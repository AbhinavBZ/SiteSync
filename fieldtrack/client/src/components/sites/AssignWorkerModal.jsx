import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AssignWorkerModal({ site, onClose, onAssigned }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users?role=worker').then(({ data }) => {
      setWorkers(data.users || []);
    }).catch(() => {
      setError('Could not load workers');
    });
  }, []);

  const handleAssign = async () => {
    if (!selectedWorker) return;
    setLoading(true);
    try {
      await api.post(`/sites/${site._id}/assign`, { workerId: selectedWorker });
      onAssigned();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign worker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Assign Worker</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <select
          className="form-input"
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          style={{ marginBottom: 16 }}
        >
          <option value="">Select a worker...</option>
          {workers.map((w) => (
            <option key={w._id} value={w._id}>{w.name} ({w.email})</option>
          ))}
        </select>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAssign} disabled={loading || !selectedWorker}>
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}