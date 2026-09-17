import { useState } from 'react';
import api from '../../utils/api';
import GeofenceMap from './GeofenceMap';

export default function SiteModal({ site, onClose, onSaved }) {
  const isEdit = Boolean(site);

  const [name, setName] = useState(site?.name || '');
  const [address, setAddress] = useState(site?.address || '');
  // A closed ring of [lng, lat] points, e.g. [[72.8,19.0], [72.9,19.0], [72.9,19.1], [72.8,19.0]]
  const [points, setPoints] = useState(site?.geofence?.coordinates?.[0] || []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // A closed ring needs at least 4 entries: 3 distinct corners + the
    // repeated closing point.
    if (points.length < 4) {
      setError('Draw a geofence with at least 3 points before saving.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name, address, points };
      if (isEdit) {
        await api.put(`/sites/${site._id}`, payload);
        onSaved('Site updated successfully.');
      } else {
        await api.post('/sites', payload);
        onSaved('Site created successfully.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Site' : 'Create New Site'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Site Name *</label>
            <input type="text" className="form-input" placeholder="e.g. Downtown Construction Site"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" className="form-input" placeholder="e.g. 123 Main St, Mumbai"
              value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Geofence Boundary *</label>
            <GeofenceMap initialPoints={points.length ? points : null} onChange={setPoints} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Saving...</> : (isEdit ? 'Save Changes' : 'Create Site')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
