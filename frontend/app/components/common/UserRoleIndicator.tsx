'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface UserRoleIndicatorProps {
  role: 'student' | 'admin' | null;
}

const UserRoleIndicator = ({ role }: UserRoleIndicatorProps) => {
  if (!role) return null;

  const roleConfig = {
    student: {
      label: 'Student',
      icon: 'AcademicCapIcon' as const,
      bgColor: 'bg-secondary/20',
      textColor: 'text-secondary',
      iconColor: 'text-secondary',
    },
    admin: {
      label: 'Admin',
      icon: 'ShieldCheckIcon' as const,
      bgColor: 'bg-accent/20',
      textColor: 'text-accent',
      iconColor: 'text-accent',
    },
  };

  const config = roleConfig[role];

  return (
    <div
      className={`flex items-center gap-2 rounded-md ${config.bgColor} px-3 py-1.5 transition-smooth`}
    >
      <Icon name={config.icon} size={16} className={config.iconColor} />
      <span className={`font-caption text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};

export default UserRoleIndicator;