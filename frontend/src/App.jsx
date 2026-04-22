import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReelProvider } from './context/ReelContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PartnerDashboard from './pages/PartnerDashboard';
import ReelDetail from './pages/ReelDetail';
import NotFound from './pages/NotFound';
import Explore from './pages/Explore';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reel/:id" element={<ReelDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:username" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/partner/dashboard" element={
            <ProtectedRoute role="partner"><PartnerDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReelProvider>
          <AppRoutes />
        </ReelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
