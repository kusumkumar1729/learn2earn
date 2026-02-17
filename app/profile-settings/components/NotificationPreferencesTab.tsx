'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NotificationSettings {
  email: {
    courseUpdates: boolean;
    tokenTransactions: boolean;
    achievements: boolean;
    weeklyDigest: boolean;
  };
  push: {
    courseReminders: boolean;
    tokenReceived: boolean;
    newFeatures: boolean;
  };
  inApp: {
    messages: boolean;
    comments: boolean;
    mentions: boolean;
  };
}

interface NotificationPreferencesTabProps {
  initialSettings: NotificationSettings;
}

const NotificationPreferencesTab = ({ initialSettings }: NotificationPreferencesTabProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const handleToggle = (category: keyof NotificationSettings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]]
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative flex-shrink-0 h-6 w-11 rounded-full overflow-hidden transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${enabled ? 'bg-primary' : 'bg-muted'
        }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-lg bg-success/20 p-4 animate-fade-in">
          <Icon name="CheckCircleIcon" size={20} className="text-success" />
          <span className="font-caption text-sm text-success-foreground">
            Notification preferences saved successfully!
          </span>
        </div>
      )}

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
            <Icon name="EnvelopeIcon" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Email Notifications</h3>
            <p className="font-caption text-xs text-muted-foreground">Receive updates via email</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Course Updates</p>
              <p className="font-caption text-xs text-muted-foreground">New lessons and course announcements</p>
            </div>
            <ToggleSwitch
              enabled={settings.email.courseUpdates}
              onToggle={() => handleToggle('email', 'courseUpdates')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Token Transactions</p>
              <p className="font-caption text-xs text-muted-foreground">Notifications about token transfers</p>
            </div>
            <ToggleSwitch
              enabled={settings.email.tokenTransactions}
              onToggle={() => handleToggle('email', 'tokenTransactions')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Achievements</p>
              <p className="font-caption text-xs text-muted-foreground">Badges and milestone completions</p>
            </div>
            <ToggleSwitch
              enabled={settings.email.achievements}
              onToggle={() => handleToggle('email', 'achievements')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Weekly Digest</p>
              <p className="font-caption text-xs text-muted-foreground">Summary of your weekly activity</p>
            </div>
            <ToggleSwitch
              enabled={settings.email.weeklyDigest}
              onToggle={() => handleToggle('email', 'weeklyDigest')}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Icon name="BellIcon" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Push Notifications</h3>
            <p className="font-caption text-xs text-muted-foreground">Browser and mobile notifications</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Course Reminders</p>
              <p className="font-caption text-xs text-muted-foreground">Reminders to continue learning</p>
            </div>
            <ToggleSwitch
              enabled={settings.push.courseReminders}
              onToggle={() => handleToggle('push', 'courseReminders')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Token Received</p>
              <p className="font-caption text-xs text-muted-foreground">When you receive tokens</p>
            </div>
            <ToggleSwitch
              enabled={settings.push.tokenReceived}
              onToggle={() => handleToggle('push', 'tokenReceived')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">New Features</p>
              <p className="font-caption text-xs text-muted-foreground">Platform updates and new features</p>
            </div>
            <ToggleSwitch
              enabled={settings.push.newFeatures}
              onToggle={() => handleToggle('push', 'newFeatures')}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">In-App Notifications</h3>
            <p className="font-caption text-xs text-muted-foreground">Notifications within the platform</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Messages</p>
              <p className="font-caption text-xs text-muted-foreground">Direct messages from instructors</p>
            </div>
            <ToggleSwitch
              enabled={settings.inApp.messages}
              onToggle={() => handleToggle('inApp', 'messages')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Comments</p>
              <p className="font-caption text-xs text-muted-foreground">Replies to your comments</p>
            </div>
            <ToggleSwitch
              enabled={settings.inApp.comments}
              onToggle={() => handleToggle('inApp', 'comments')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-caption text-sm font-medium text-foreground">Mentions</p>
              <p className="font-caption text-xs text-muted-foreground">When someone mentions you</p>
            </div>
            <ToggleSwitch
              enabled={settings.inApp.mentions}
              onToggle={() => handleToggle('inApp', 'mentions')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setSettings(initialSettings)}
          className="rounded-md border border-border bg-card px-6 py-2.5 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icon name="CheckIcon" size={16} />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferencesTab;