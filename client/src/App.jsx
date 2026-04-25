import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import Medicines from './pages/Medicines';
import MedicineDetail from './pages/MedicineDetail';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
// NOTE: Navbar import removed — Sidebar is now the top navbar

const AppContent = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F3' }}>
        <div style={{ width: 36, height: 36, border: '2.5px solid #9FE1CB', borderTop: '2.5px solid #0F6E56', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F3' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login"           element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register"        element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/forgot-password" element={token ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
        <Route path="/reset-password"  element={token ? <Navigate to="/dashboard" /> : <ResetPassword />} />
        <Route path="/verify-email"    element={token ? <Navigate to="/dashboard" /> : <VerifyEmail />} />

        {/* Protected Routes
            Sidebar is now a FIXED TOP NAVBAR — no flex wrapper, no md:ml-64 needed.
            Each page handles its own max-width centering internally.                */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Sidebar />
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/symptom-checker" element={
          <ProtectedRoute>
            <Sidebar />
            <SymptomChecker />
          </ProtectedRoute>
        } />
        <Route path="/medicines" element={
          <ProtectedRoute>
            <Sidebar />
            <Medicines />
          </ProtectedRoute>
        } />
        <Route path="/medicines/:id" element={
          <ProtectedRoute>
            <Sidebar />
            <MedicineDetail />
          </ProtectedRoute>
        } />
        <Route path="/reminders" element={
          <ProtectedRoute>
            <Sidebar />
            <Reminders />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Sidebar />
            <Profile />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </BrowserRouter>
);

export default App;