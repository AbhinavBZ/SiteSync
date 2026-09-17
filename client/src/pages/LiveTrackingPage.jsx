import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import './LiveTrackingPage.css';

const MARKER_COLORS = {
  online: '#3b82f6',
  offline: '#9ca3af',
};

export default function LiveTrackingPage() {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [workers, setWorkers] = useState({});
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const markersRef = useRef({});
  const geofenceLayerRef = useRef(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data } = await api.get('/sites');
        setSites(data.sites || []);
        if (data.sites?.length > 0) {
          setSelectedSiteId(data.sites[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch sites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (!selectedSiteId) return;

    const fetchSiteDetails = async () => {
      try {
        const siteRes = await api.get(`/sites/${selectedSiteId}`);
        setSelectedSite(siteRes.data.site);

        const sessionsRes = await api.get(`/sites/${selectedSiteId}/sessions`);
        const activeSessions = sessionsRes.data.sessions.filter((s) => s.status === 'active');

        const workersMap = {};
        activeSessions.forEach((session) => {
          workersMap[session.worker._id] = {
            name: session.worker.name,
            email: session.worker.email,
            lat: session.clockInLocation.coordinates[1],
            lng: session.clockInLocation.coordinates[0],
            lastPing: new Date(session.createdAt),
          };
        });
        setWorkers(workersMap);
      } catch (err) {
        console.error('Failed to fetch site details:', err);
      }
    };

    fetchSiteDetails();
  }, [selectedSiteId]);

  useEffect(() => {
    if (!selectedSite || !mapRef.current) return;

    let map = mapRef.current._leaflet_map;

    if (!map) {
      map = L.map(mapRef.current).setView([19.076, 72.8777], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current._leaflet_map = map;
    }

    if (geofenceLayerRef.current) {
      map.removeLayer(geofenceLayerRef.current);
    }
    if (selectedSite.geofence) {
      const latlngs = selectedSite.geofence.coordinates[0].map(([lng, lat]) => [lat, lng]);
      geofenceLayerRef.current = L.polygon(latlngs, {
        color: '#888888',
        weight: 2,
        opacity: 0.5,
        fillColor: '#888888',
        fillOpacity: 0.05,
      }).addTo(map);
    }

    if (selectedSite.center) {
      map.setView([selectedSite.center.coordinates[1], selectedSite.center.coordinates[0]], 16);
    }

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000');
    }

    socketRef.current.emit('watch-site', selectedSiteId);

    socketRef.current.on('worker-location-update', (data) => {
      setWorkers((prev) => ({
        ...prev,
        [data.workerId]: {
          ...prev[data.workerId],
          lat: data.location.lat,
          lng: data.location.lng,
          lastPing: new Date(data.timestamp),
        },
      }));
    });

    socketRef.current.on('worker-clocked-out', (data) => {
      setWorkers((prev) => {
        const updated = { ...prev };
        delete updated[data.workerId];
        return updated;
      });
      if (markersRef.current[data.workerId]) {
        map.removeLayer(markersRef.current[data.workerId]);
        delete markersRef.current[data.workerId];
      }
    });

    return () => {
      socketRef.current?.emit('unwatch-site', selectedSiteId);
    };
  }, [selectedSite, selectedSiteId]);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current._leaflet_map) return;
    const map = mapRef.current._leaflet_map;

    Object.keys(markersRef.current).forEach((workerId) => {
      if (!workers[workerId]) {
        map.removeLayer(markersRef.current[workerId]);
        delete markersRef.current[workerId];
      }
    });

    Object.entries(workers).forEach(([workerId, workerData]) => {
      const { lat, lng, name } = workerData;

      if (markersRef.current[workerId]) {
        markersRef.current[workerId].setLatLng([lat, lng]);
      } else {
        const marker = L.circleMarker([lat, lng], {
          radius: 12,
          fillColor: MARKER_COLORS.online,
          color: '#fff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
        })
          .bindPopup(`<strong>${name}</strong>`)
          .addTo(map);

        markersRef.current[workerId] = marker;
      }
    });
  }, [workers]);

  if (loading) {
    return <div className="live-tracking-loader">Loading...</div>;
  }

  return (
    <div className="live-tracking-container">
      <div className="live-tracking-sidebar">
        <h2>Live Tracking</h2>
        <label>
          <span>Select Site:</span>
          <select value={selectedSiteId || ''} onChange={(e) => setSelectedSiteId(e.target.value)}>
            <option value="">Choose a site...</option>
            {sites.map((site) => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>
        </label>

        <div className="workers-list">
          <h3>Clocked In ({Object.keys(workers).length})</h3>
          {Object.keys(workers).length === 0 ? (
            <p className="empty">No workers clocked in</p>
          ) : (
            <ul>
              {Object.entries(workers).map(([workerId, data]) => (
                <li key={workerId}>
                  <span className="dot" style={{ backgroundColor: MARKER_COLORS.online }} />
                  <div className="worker-info">
                    <strong>{data.name}</strong>
                    <small>{data.email}</small>
                    <small className="timestamp">
                      Last ping: {data.lastPing ? data.lastPing.toLocaleTimeString() : 'N/A'}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="live-tracking-map" ref={mapRef} />
    </div>
  );
}