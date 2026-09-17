import { useState, useEffect } from 'react';
import api from '../utils/api';
import SiteModal from '../components/sites/SiteModal';
import AssignWorkerModal from '../components/sites/AssignWorkerModal';
export default function SitesPage() {
  const [sites, setSites]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSite, setEditSite]   = useState(null);
  const [message, setMessage]     = useState('');
  const [assignModal, setAssignModal] = useState(null);

  const fetchSites = async () => {
    try {
      const { data } = await api.get('/sites');
      setSites(data.sites);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSites(); }, []);

  const openCreate = () => { setEditSite(null); setShowModal(true); };
  const openEdit   = (site) => { setEditSite(site); setShowModal(true); };

  const handleSaved = (msg) => {
    setShowModal(false);
    fetchSites();
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this site permanently?')) return;
    try {
      await api.delete(`/sites/${id}`);
      fetchSites();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete site.');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /> Loading sites...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Work Sites</h1>
          <p>Manage your geofenced work locations</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Site</button>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: 16 }}>{message}</div>}

      {sites.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No sites created yet</h3>
            <p>Create your first work site to start tracking your field workers.</p>
            <button className="btn btn-primary" onClick={openCreate}>Create First Site</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>Address</th>
                  <th>Center</th>
                  <th>Area</th>
                  <th>Workers</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site._id}>
                    <td><strong>{site.name}</strong></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{site.address || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                       {site.center?.coordinates
                        ? `${site.center.coordinates[1].toFixed(4)}, ${site.center.coordinates[0].toFixed(4)}`
                       : '—'}
                    </td>
                    <td>
                      {site.areaSqMeters
                        ? `${(site.areaSqMeters / 10000).toFixed(2)} ha`
                        : '—'}
                    </td>
                    <td>
                      <span className="badge badge-blue">{site.assignedWorkers?.length || 0}</span>
                    </td>
                    <td>
                      <span className={`badge ${site.isActive ? 'badge-green' : 'badge-red'}`}>
                        {site.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setAssignModal(site)}>Assign</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(site)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(site._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <SiteModal
          site={editSite}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
      {assignModal && (
        <AssignWorkerModal
          site={assignModal}
          onClose={() => setAssignModal(null)}
          onAssigned={() => fetchSites()}
        />
      )}
    </div>
  );
}
