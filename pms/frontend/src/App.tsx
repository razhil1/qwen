import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import DashboardLayout from './components/common/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import ReservationsPage from './pages/ReservationsPage';
import GuestsPage from './pages/GuestsPage';
import RoomsPage from './pages/RoomsPage';
import HousekeepingPage from './pages/HousekeepingPage';
import MaintenancePage from './pages/MaintenancePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><PropertiesPage /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><ReservationsPage /></ProtectedRoute>} />
        <Route path="/guests" element={<ProtectedRoute><GuestsPage /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
        <Route path="/housekeeping" element={<ProtectedRoute><HousekeepingPage /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
