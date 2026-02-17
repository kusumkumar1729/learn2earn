'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import StudentDashboardContent from './StudentDashboardContent';

const StudentDashboardInteractive = () => {
  return (
    <ProtectedRoute requiredRole="student">
      <DynamicNavbar />
      <StudentDashboardContent />
    </ProtectedRoute>
  );
};

export default StudentDashboardInteractive;