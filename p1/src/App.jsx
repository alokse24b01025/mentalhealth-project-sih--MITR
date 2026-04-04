import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Existing Page imports
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ResourcesPage from './pages/ResourcesPage';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// NEW: Privacy, Care Alerts, and Help Center imports
import PrivacyPage from './pages/PrivacyPage';
import CareAlertsPage from './pages/CareAlertsPage';
import HelpCenterPage from './pages/HelpCenterPage';

// NEW: Admin Security Gates & Upload [CRITICAL FIX]
import AdminGate from './pages/AdminGate';
import AdminUpload from './pages/AdminUpload'; // Added this import

// Component imports
import PeerSupport from "./components/PeerSupport"; 

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router basename="/mentalhealth-project-sih-/">

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* --- ADMIN SECURITY ROUTES --- */}
          {/* Gate for ID and Secret Key Entry */}
          <Route path="/admin-gate" element={<AdminGate />} />
          
          {/* Main Command Center */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* NEW: Resource Deployer Route [CRITICAL FIX] */}
          <Route path="/admin-upload" element={<AdminUpload />} /> 

          {/* Protected Student Routes */}
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          
          <Route path="/booking" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/peer-support" element={
            <ProtectedRoute>
              <PeerSupport />
            </ProtectedRoute>
          } />

          {/* Settings & Help Navigation */}
          <Route path="/settings/privacy" element={
            <ProtectedRoute>
              <PrivacyPage />
            </ProtectedRoute>
          } />

          <Route path="/care-alerts" element={
            <ProtectedRoute>
              <CareAlertsPage />
            </ProtectedRoute>
          } />

          <Route path="/help" element={
            <ProtectedRoute>
              <HelpCenterPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;