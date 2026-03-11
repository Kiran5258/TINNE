import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../services/useAuthStore';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // Wait until checkAuth finishes
  if (isCheckingAuth) return null;

  // MUST call the function
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
