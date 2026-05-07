import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import ReportsPage from './pages/ReportsPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AISymptomsPage from './pages/AISymptomsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import PublicDoctorsPage from './pages/PublicDoctorsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import Layout from './components/layout/Layout';
import NotificationsPage from './pages/NotificationsPage';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctor/:id" element={<DoctorProfilePage />} />
        <Route path="/doctors-public" element={<PublicDoctorsPage />} />
        
        {/* Pathless route for protected layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/smart-booking" element={<AISymptomsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorSchedulePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
