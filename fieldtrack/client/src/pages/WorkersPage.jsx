import { useState, useEffect } from 'react';
import api from '../utils/api';
import WorkerModal from '../components/workers/WorkerModal';

export default function WorkersPage() {
  const [workers, setWorkers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage]     = useState('');

  const fetchWorkers = async () => {
    try {
      const { data } = await api.get('/users/workers');
      setWorkers(data.workers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleSaved = () => {
    setShowModal(false);
    fetchWorkers();
    setMessage('Worker added successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this worker?')) return;
    try {
      await api.delete(`/users/workers/${id}`);
      fetchWorkers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate worker.');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /> Loading workers...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Workers</h1>
          <p>Manage your field workforce</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Worker</button>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: 16 }}>{message}</div>}

      {workers.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No workers added yet</h3>
            <p>Add your first field worker to assign them to sites.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add First Worker</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--color-primary)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 13, flexShrink: 0,
                        }}>
                          {w.name[0].toUpperCase()}
                        </div>
                        <strong>{w.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{w.email}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{w.phone || '—'}</td>
                    <td>
                      <span className={`badge ${w.isActive ? 'badge-green' : 'badge-red'}`}>
                        {w.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {w.isActive && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(w._id)}>
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <WorkerModal
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
