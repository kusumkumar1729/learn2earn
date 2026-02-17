'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboardContent from './AdminDashboardContent';

const AdminDashboardInteractive = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

export default AdminDashboardInteractive;