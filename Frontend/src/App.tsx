import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { ReactElement } from 'react';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const App = (): ReactElement => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<PageWithNavbar><Login /></PageWithNavbar>} />
          <Route path="/register" element={<PageWithNavbar><Register /></PageWithNavbar>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <Dashboard />
                </PageWithNavbar>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};


const PageWithNavbar = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);


export default App;
