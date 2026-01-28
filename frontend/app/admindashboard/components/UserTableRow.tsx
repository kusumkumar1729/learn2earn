'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarAlt: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended';
  progress: number;
  tokensEarned: number;
  coursesCompleted: number;
}

interface UserTableRowProps {
  user: User;
  onViewProfile: (userId: string) => void;
  onManageUser: (userId: string) => void;
}

const UserTableRow = ({ user, onViewProfile, onManageUser }: UserTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'suspended':
        return 'bg-error/20 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <tr className="group border-b border-border transition-smooth hover:bg-muted/50">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <AppImage
                src={user.avatar}
                alt={user.avatarAlt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-caption text-sm font-medium text-foreground">{user.name}</span>
              <span className="font-caption text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <span className="font-caption text-sm text-card-foreground">{user.enrollmentDate}</span>
        </td>
        
        <td className="px-6 py-4">
          <span className={`inline-flex items-center rounded-full px-3 py-1 font-caption text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-smooth"
                style={{ width: `${user.progress}%` }}
              />
            </div>
            <span className="font-mono text-sm text-card-foreground">{user.progress}%</span>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <span className="font-mono text-sm font-medium text-primary">{user.tokensEarned.toLocaleString()}</span>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewProfile(user.id)}
              className="rounded-md p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="View profile"
            >
              <Icon name="EyeIcon" size={18} />
            </button>
            <button
              onClick={() => onManageUser(user.id)}
              className="rounded-md p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Manage user"
            >
              <Icon name="Cog6ToothIcon" size={18} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-md p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:hidden"
              aria-label="Toggle details"
            >
              <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={18} />
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="border-b border-border bg-muted/30 md:hidden">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs text-muted-foreground">Enrollment Date</span>
                <span className="font-caption text-sm text-card-foreground">{user.enrollmentDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs text-muted-foreground">Status</span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 font-caption text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs text-muted-foreground">Progress</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-smooth"
                      style={{ width: `${user.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-card-foreground">{user.progress}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs text-muted-foreground">Tokens Earned</span>
                <span className="font-mono text-sm font-medium text-primary">{user.tokensEarned.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs text-muted-foreground">Courses Completed</span>
                <span className="font-caption text-sm text-card-foreground">{user.coursesCompleted}</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default UserTableRow;