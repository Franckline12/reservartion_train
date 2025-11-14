import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchTrains from './pages/SearchTrains';
import Reservation from './pages/Reservation';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTrains from './pages/admin/Trains';
import AdminTrajets from './pages/admin/Trajets';
import AdminReservations from './pages/admin/Reservations';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchTrains />} />
              
              {/* Protected Routes */}
              <Route path="/reservation/:id" element={
                <ProtectedRoute>
                  <Reservation />
                </ProtectedRoute>
              } />
              <Route path="/my-reservations" element={
                <ProtectedRoute>
                  <MyReservations />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/trains" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminTrains />
                </ProtectedRoute>
              } />
              <Route path="/admin/trajets" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminTrajets />
                </ProtectedRoute>
              } />
              <Route path="/admin/reservations" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminReservations />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;