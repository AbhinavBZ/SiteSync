import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats]   = useState({ sites: 0, workers: 0, activeSites: 0 });
  const [sites, setSites]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const { data } = await api.get('/sites');
      setSites(data.sites || []);
      if (user.role === 'manager') {
        const { data: wData } = await api.get('/users?role=worker');
        setStats({
          sites: (data.sites || []).length,
          activeSites: (data.sites || []).filter((s) => s.isActive).length,
          workers: (wData.workers || []).length,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [user.role]);

  if (loading) return <div className="page-loader"><div className="spinner" /> Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p>Here's an overview of your {user.role === 'manager' ? 'operation' : 'assigned sites'}</p>
        </div>
      </div>

      {/* Stats (manager only) */}
      {user.role === 'manager' && (
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(79,124,255,0.15)' }}>📍</div>
            <div>
              <div className="stat-value">{stats.sites}</div>
              <div className="stat-label">Total Sites</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)' }}>✅</div>
            <div>
              <div className="stat-value">{stats.activeSites}</div>
              <div className="stat-label">Active Sites</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>👷</div>
            <div>
              <div className="stat-value">{stats.workers}</div>
              <div className="stat-label">Total Workers</div>
            </div>
          </div>
        </div>
      )}

      {/* Sites list */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="section-header">
          <h2>{user.role === 'manager' ? 'Your Sites' : 'Assigned Sites'}</h2>
          {user.role === 'manager' && <Link to="/sites" className="btn btn-ghost btn-sm">Manage Sites →</Link>}
        </div>

        {sites.length === 0 ? (
          <div className="empty-state">
            <h3>No sites yet</h3>
            <p>
              {user.role === 'manager'
                ? 'Create your first work site to get started.'
                : 'Your manager hasn\'t assigned you to any sites yet.'}
            </p>
            {user.role === 'manager' && <Link to="/sites" className="btn btn-primary">Create Site</Link>}
          </div>
        ) : (
          <div className="sites-list">
            {sites.slice(0, 5).map((site) => (
              <div key={site._id} className="site-row">
                <div className="site-dot" style={{ background: site.isActive ? 'var(--color-success)' : 'var(--color-text-dim)' }} />
                <div className="site-info">
                  <div className="site-name">{site.name}</div>
                  <div className="site-meta">
                    {site.address || 'No address'} · {site.areaSqMeters ? `${(site.areaSqMeters / 10000).toFixed(2)} ha` : 'No geofence'}
                  </div>
                </div>
                <span className={`badge ${site.isActive ? 'badge-green' : 'badge-red'}`}>
                  {site.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.role === 'manager' && (
                  <span className="badge badge-blue">{site.assignedWorkers?.length || 0} workers</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links for managers */}
      {user.role === 'manager' && (
        <div className="quick-links">
          <Link to="/workers" className="quick-link card">
            <span className="ql-icon">👷</span>
            <div>
              <div className="ql-title">Manage Workers</div>
              <div className="ql-desc">Add workers and assign them to sites</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-dim)' }}>→</span>
          </Link>
          <Link to="/sites" className="quick-link card">
            <span className="ql-icon">📍</span>
            <div>
              <div className="ql-title">Manage Sites</div>
              <div className="ql-desc">Create and configure work site geofences</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-dim)' }}>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
