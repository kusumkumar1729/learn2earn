'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import AdminDashboardContent from './AdminDashboardContent';

const AdminDashboardInteractive = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <DynamicNavbar />
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

export default AdminDashboardInteractive;