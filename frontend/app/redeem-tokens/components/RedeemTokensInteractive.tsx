'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import RedeemTokensContent from './RedeemTokensContent';

const RedeemTokensInteractive = () => {
  return (
    <ProtectedRoute requiredRole="student">
      <DynamicNavbar />
      <RedeemTokensContent />
    </ProtectedRoute>
  );
};

export default RedeemTokensInteractive;