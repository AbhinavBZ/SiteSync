import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './GeofenceMap.css';

// Fallback map center used only when creating a brand-new site (no shape yet).
// Leaflet uses [lat, lng] order — note this is the OPPOSITE of GeoJSON's
// [lng, lat] order, which is what we store everywhere else in this app.
// We convert between the two at the edges of this component.
const DEFAULT_CENTER = [19.076, 72.8777]; // Mumbai
const DEFAULT_ZOOM = 12;
const EDIT_ZOOM = 16;

/**
 * Lets a manager draw a polygon geofence on a Leaflet + OpenStreetMap map.
 * No API key, account, or credit card required — OSM's public tile server
 * is free to use for low-volume projects like this one.
 *
 * Props:
 *  - initialPoints: a closed ring of [lng, lat] pairs (GeoJSON order, last
 *    point === first point) to pre-load when editing an existing site, or
 *    null/undefined for a brand-new one.
 *  - onChange(ring): called whenever the drawn shape changes. `ring` is a
 *    closed [lng, lat][] array (GeoJSON order, matching what the backend and
 *    Turf.js expect), or [] if the shape was cleared.
 */
export default function GeofenceMap({ initialPoints, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);

  const [area, setArea] = useState(0);
  const [pointCount, setPointCount] = useState(
    initialPoints?.length ? initialPoints.length - 1 : 0
  );

  useEffect(() => {
    if (mapRef.current) return;

    const hasShape = Boolean(initialPoints?.length);
    // Flip our stored [lng, lat] into Leaflet's [lat, lng] for the initial view.
    const center = hasShape
      ? [initialPoints[0][1], initialPoints[0][0]]
      : DEFAULT_CENTER;

    const map = L.map(containerRef.current).setView(center, hasShape ? EDIT_ZOOM : DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: { allowIntersection: false, showArea: false },
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: { featureGroup: drawnItems, remove: true },
    });
    map.addControl(drawControl);

    const reportShape = () => {
      const layers = drawnItems.getLayers();

      if (!layers.length) {
        setArea(0);
        setPointCount(0);
        onChange([]);
        return;
      }

      // We only ever keep one polygon at a time.
      const layer = layers[layers.length - 1];
      const latLngs = layer.getLatLngs()[0]; // outer ring

      // Convert Leaflet's [lat, lng] back to GeoJSON's [lng, lat] and close the ring.
      const ring = latLngs.map((p) => [p.lng, p.lat]);
      ring.push(ring[0]);

      setPointCount(ring.length - 1);
      try {
        setArea(Math.round(turf.area(turf.polygon([ring]))));
      } catch {
        setArea(0);
      }
      onChange(ring);
    };

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers(); // enforce a single shape at a time
      drawnItems.addLayer(e.layer);
      reportShape();
    });
    map.on(L.Draw.Event.EDITED, reportShape);
    map.on(L.Draw.Event.DELETED, reportShape);

    if (hasShape) {
      // initialPoints is a closed GeoJSON ring; Leaflet wants [lat,lng] pairs
      // with no duplicate closing point (it closes the polygon visually on its own).
      const latlngs = initialPoints.slice(0, -1).map(([lng, lat]) => [lat, lng]);
      drawnItems.addLayer(L.polygon(latlngs));
      reportShape();
    }

    mapRef.current = map;
    drawnItemsRef.current = drawnItems;

    return () => {
      map.remove();
      mapRef.current = null;
      drawnItemsRef.current = null;
    };
    // Intentionally run once on mount — the map/draw instance is imperative
    // and manages its own state after that.
  }, []);

  const handleClear = () => {
    drawnItemsRef.current?.clearLayers();
    setArea(0);
    setPointCount(0);
    onChange([]);
  };

  return (
    <div className="geofence-map-wrap">
      <div ref={containerRef} className="geofence-map" />
      <div className="geofence-map-footer">
        <span>
          {pointCount === 0
            ? 'Click the polygon tool (top-left), then click points on the map to draw the geofence.'
            : `${pointCount} points · ~${(area / 10000).toFixed(2)} hectares (${area.toLocaleString()} m²)`}
        </span>
        {pointCount > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleClear}>
            Clear &amp; redraw
          </button>
        )}
      </div>
    </div>
  );
}
