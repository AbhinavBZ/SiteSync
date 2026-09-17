import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SitesPage    from './pages/SitesPage';
import WorkersPage  from './pages/WorkersPage';
import LiveTrackingPage from './pages/LiveTrackingPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// ── Route Guards ──────────────────────────────────────────
// Redirect to login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /> Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /> Loading...</div>;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// Manager-only guard
const ManagerRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'manager' ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/live-tracking" element={<LiveTrackingPage />} />

      {/* Protected routes (inside the sidebar layout) */}
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sites"     element={<ManagerRoute><SitesPage /></ManagerRoute>} />
        <Route path="workers"   element={<ManagerRoute><WorkersPage /></ManagerRoute>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
