import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { SearchDoctors } from './pages/patient/SearchDoctors';
import { DoctorPublicProfile } from './pages/patient/DoctorPublicProfile';
import { MyAppointments } from './pages/patient/MyAppointments';
import { PatientProfile } from './pages/patient/Profile';
import { Messages } from './pages/patient/Messages';
import { Chat } from './pages/patient/Chat';
import { Appointments } from './pages/doctor/Appointments';
import { DoctorProfile } from './pages/doctor/Profile';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import { PatientMedicalHistory } from './pages/doctor/PatientMedicalHistory';
import { AdminDashboard } from './pages/admin/Dashboard';
import { NavbarDemo } from './components/NavbarDemo';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { Footer } from './components/Footer';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancel } from './pages/PaymentCancel';
import { NotFound } from './pages/NotFound';

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
                <MyAppointments />
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
          path="/doctor/schedule"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DoctorSchedule />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patient/:pacienteId/history"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <PatientMedicalHistory />
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
          path="/messages"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Messages />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/chat/:userId"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Chat />
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

        {/* Payment routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

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
