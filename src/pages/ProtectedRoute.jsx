import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('admin') || localStorage.getItem('user') || '{}');

  if (!token) {
    // No token: redirect to appropriate login page
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (role && user.role !== role) {
    // Token exists but role mismatch: redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
