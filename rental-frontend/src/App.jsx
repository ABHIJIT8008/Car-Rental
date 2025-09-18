// File Path: frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import DashboardMapPage from './pages/DashboardMapPage.jsx';
import DashboardPanelPage from './pages/DashboardPanelPage.jsx';
import { LoaderCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const API_URL = 'http://localhost:5000/api/v1';

  // Central API helper function
  const api = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An API error occurred');
    }
    return data;
  };

  // Check for existing session on initial app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsAuthReady(true);
  }, []);

  // Handle user login and registration
  const handleAuth = async (endpoint, formData) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api(`/auth/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Show a loading spinner until the initial auth check is complete
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <LoaderCircle className="animate-spin text-white" size={48} />
      </div>
    );
  }

  // Conditionally render routes based on authentication
  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          // Unauthenticated: go to AuthPage
          <>
            <Route path="/auth" element={<AuthPage handleAuth={handleAuth} apiError={error} isLoading={isLoading} />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : (
          // Authenticated: use dashboard routes
          <>
            <Route
              path="/dashboard/*"
              element={<DashboardPage user={user} handleLogout={handleLogout} api={api} />}
            >
              <Route index element={<DashboardHome />} />
              <Route path="map" element={<DashboardMapPage />} />
              <Route path="panel" element={<DashboardPanelPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
