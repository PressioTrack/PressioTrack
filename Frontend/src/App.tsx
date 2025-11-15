import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Perfil from './pages/Perfil';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from "./components/Layout";
import type { ReactElement } from 'react';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const PageWithNavbar = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <Layout>{children}</Layout>
  </>
);

const PageWithLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

const App = (): ReactElement => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<PageWithLayout><LandingPage /></PageWithLayout>} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <PageWithNavbar><Login /></PageWithNavbar>
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <PageWithNavbar><Register /></PageWithNavbar>
              </GuestRoute>
            }
          />
          <Route
            path="/forgot"
            element={
              <GuestRoute>
                <PageWithNavbar><Forgot /></PageWithNavbar>
              </GuestRoute>
            }
          />
          <Route
            path="/reset"
            element={
              <GuestRoute>
                <PageWithNavbar><Reset /></PageWithNavbar>
              </GuestRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageWithNavbar><Dashboard /></PageWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PageWithNavbar><Perfil /></PageWithNavbar>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
