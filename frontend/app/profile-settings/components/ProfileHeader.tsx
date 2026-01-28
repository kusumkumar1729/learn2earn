import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  userRole: 'student' | 'admin';
}

const ProfileHeader = ({ userName, userEmail, userRole }: ProfileHeaderProps) => {
  return (
    <div className="mb-8 flex items-center gap-6 rounded-lg bg-card p-6 shadow-glow-md">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
        <Icon name="UserCircleIcon" size={40} className="text-primary" />
      </div>
      <div className="flex-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">{userName}</h1>
        <p className="mt-1 font-caption text-sm text-muted-foreground">{userEmail}</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-secondary/20 px-3 py-1">
          <Icon name={userRole === 'admin' ? 'ShieldCheckIcon' : 'AcademicCapIcon'} size={14} className="text-secondary" />
          <span className="font-caption text-xs font-medium text-secondary">
            {userRole === 'admin' ? 'Administrator' : 'Student'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;