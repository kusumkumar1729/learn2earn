'use client';

import React from 'react';

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge = ({ count }: NotificationBadgeProps) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error px-1.5 font-mono text-xs font-medium text-error-foreground animate-fade-in">
      {displayCount}
    </span>
  );
};

export default NotificationBadge;