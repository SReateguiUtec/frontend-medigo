import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { SearchDoctors } from './pages/patient/SearchDoctors';
import { DoctorPublicProfile } from './pages/patient/DoctorPublicProfile';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientProfile } from './pages/patient/Profile';
import { Appointments } from './pages/doctor/Appointments';
import { DoctorProfile } from './pages/doctor/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';
import { NavbarDemo } from './components/NavbarDemo';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { Footer } from './components/Footer';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.rol === 'PACIENTE') {
      return <Navigate to="/patient/search" />;
    } else if (user?.rol === 'MEDICO') {
      return <Navigate to="/doctor/appointments" />;
    } else if (user?.rol === 'ADMIN') {
      return <Navigate to="/admin" />;
    }
  }

  return <Home />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide navbar on login and register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showNavbar = !isAuthenticated && !isAuthPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show navbar only for unauthenticated users and not on auth pages */}
      {showNavbar && <NavbarDemo />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with AuthenticatedLayout */}
        <Route
          path="/patient/search"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <SearchDoctors />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctor/:doctorId"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DoctorPublicProfile />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <PatientAppointments />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Appointments />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DoctorProfile />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <PatientProfile />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AdminDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Show footer only for unauthenticated users and not on auth pages */}
      {showNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
