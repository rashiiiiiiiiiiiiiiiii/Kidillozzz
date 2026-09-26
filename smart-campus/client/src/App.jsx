import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Notifications from './pages/Notifications';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

/**
 * Renders the correct dashboard based on the user's role.
 */
function DashboardRouter() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes (authenticated layout) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Admin-only routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Future feature modules plug in cleanly here:
        <Route path="/attendance/*" element={<AttendanceModule />} />
        <Route path="/complaints/*" element={<ComplaintsModule />} />
        <Route path="/events/*" element={<EventsModule />} />
        */}
      </Route>

      {/* Redirects & fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
