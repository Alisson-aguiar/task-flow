import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/Auth/AuthPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import CallbackPage from './pages/Auth/CallbackPage';
import './styles/global.css';

function App() {
  const { user, loading, isAuthenticated, register, login, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
        color: 'white'
      }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem' }}>Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onLogin={login} onRegister={register} />
          )
        }
      />
      <Route
        path="/auth/callback"
        element={<CallbackPage />}
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardPage user={user} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
