'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import AccountInformationTab from './AccountInformationTab';
import SecuritySettingsTab from './SecuritySettingsTab';
import NotificationPreferencesTab from './NotificationPreferencesTab';
import ThemeCustomizationTab from './ThemeCustomizationTab';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'account' | 'security' | 'notifications' | 'theme';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const ProfileSettingsInteractive = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const tabs: Tab[] = [
    { id: 'account', label: 'Account', icon: 'UserIcon' },
    { id: 'security', label: 'Security', icon: 'LockClosedIcon' },
    { id: 'notifications', label: 'Notifications', icon: 'BellIcon' },
    { id: 'theme', label: 'Theme', icon: 'PaintBrushIcon' }
  ];

  // Use actual user data from context
  const accountData = {
    fullName: userProfile?.name || user?.displayName || 'Student',
    email: userProfile?.email || user?.email || '',
    bio: userProfile?.bio || 'A passionate learner on Learn2Earn platform.',
    avatar: user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'Student')}&background=random`,
    phoneNumber: '',
    location: userProfile?.institution || ''
  };

  const handleSaveProfile = (data: typeof accountData) => {
    // Update user profile in mock store
    updateUserProfile({
      name: data.fullName,
      bio: data.bio,
      institution: data.location,
    });

    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const mockNotificationSettings = {
    email: {
      courseUpdates: true,
      tokenTransactions: true,
      achievements: true,
      weeklyDigest: false
    },
    push: {
      courseReminders: true,
      tokenReceived: true,
      newFeatures: false
    },
    inApp: {
      messages: true,
      comments: true,
      mentions: true
    }
  };

  const mockThemeSettings = {
    mode: 'dark' as const,
    accentColor: '#F59E0B',
    fontSize: 'medium' as const,
    reducedMotion: false,
    highContrast: false
  };

  if (!isHydrated) {
    return (
      <ProtectedRoute requiredRole="student">
        <DynamicNavbar />
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
            <div className="mb-8 h-32 animate-pulse rounded-lg bg-muted" />
            <div className="mb-6 flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="student">
      <DynamicNavbar />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
          {/* User Identity Card */}
          <div className="mb-6 rounded-xl bg-card/50 border border-border p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {user?.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={userProfile?.name || 'User'}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <Icon name="UserCircleIcon" size={40} className="text-primary" />
                )}
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {userProfile?.name || user?.displayName || 'Student'}
                </h2>
                <p className="font-caption text-sm text-muted-foreground">
                  {userProfile?.email || user?.email}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1 font-caption text-xs text-muted-foreground">
                    <Icon name="CurrencyDollarIcon" size={14} className="text-primary" />
                    {userProfile?.tokens || 0} tokens
                  </span>
                  <span className="flex items-center gap-1 font-caption text-xs text-muted-foreground">
                    <Icon name="WalletIcon" size={14} className="text-secondary" />
                    {userProfile?.walletAddress || 'No wallet'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 overflow-x-auto scrollbar-custom">
            <div className="flex gap-2 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-3 font-caption text-sm font-medium transition-smooth focus:outline-none ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in">
            {activeTab === 'account' && (
              <AccountInformationTab
                initialData={accountData}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySettingsTab walletConnected={!!userProfile?.walletAddress} twoFactorEnabled={false} />
            )}
            {activeTab === 'notifications' && (
              <NotificationPreferencesTab initialSettings={mockNotificationSettings} />
            )}
            {activeTab === 'theme' && <ThemeCustomizationTab />}
          </div>
        </div>

        {/* Success Toast */}
        {showToast && (
          <div className="fixed bottom-8 right-8 z-[1030] animate-slide-in">
            <div className="flex items-center gap-3 rounded-lg bg-card px-6 py-4 shadow-glow-lg border border-success/20">
              <Icon name="CheckCircleIcon" size={20} className="text-success" />
              <span className="font-caption text-sm text-foreground">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfileSettingsInteractive;