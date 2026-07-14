import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'manager', phone: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <span>📡</span>
          <h1>FieldTrack</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input type="text" name="name" className="form-input" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input type="tel" name="phone" className="form-input" placeholder="+91 98765 43210"
                value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" name="email" className="form-input" placeholder="you@company.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className="role-selector">
              {['manager', 'worker'].map((role) => (
                <label
                  key={role}
                  className={`role-option ${form.role === role ? 'selected' : ''}`}
                >
                  <input type="radio" name="role" value={role}
                    checked={form.role === role} onChange={handleChange} />
                  <span className="role-icon">{role === 'manager' ? '🏢' : '👷'}</span>
                  <span className="role-label">{role === 'manager' ? 'Manager' : 'Field Worker'}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><span className="spinner" /> Creating account...</> : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
