'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { auth, sendPasswordResetEmail } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface SecuritySettingsTabProps {
  walletConnected: boolean;
  twoFactorEnabled: boolean;
}

const SecuritySettingsTab = ({ walletConnected: initialWalletConnected, twoFactorEnabled: initialTwoFactorEnabled }: SecuritySettingsTabProps) => {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmailError, setResetEmailError] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialTwoFactorEnabled);
  const [walletConnected, setWalletConnected] = useState(initialWalletConnected);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const handleSendPasswordResetEmail = async () => {
    setResetEmailError('');
    setResetEmailSent(false);

    if (!user?.email) {
      setResetEmailError('No email address associated with this account');
      return;
    }

    setIsSendingResetEmail(true);

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 10000);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('auth/too-many-requests')) {
          setResetEmailError('Too many requests. Please try again later.');
        } else {
          setResetEmailError(error.message);
        }
      } else {
        setResetEmailError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    setTimeout(() => {
      alert(twoFactorEnabled ? '2FA has been disabled' : '2FA setup would open here with QR code');
    }, 300);
  };

  const handleWalletConnection = () => {
    setWalletConnected(!walletConnected);
    setTimeout(() => {
      alert(walletConnected ? 'Wallet disconnected successfully' : 'Wallet connection would trigger MetaMask here');
    }, 300);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('Account deletion would be processed here with final confirmation');
  };

  return (
    <div className="space-y-6">
      {resetEmailSent && (
        <div className="flex items-center gap-3 rounded-lg bg-success/20 p-4 animate-fade-in">
          <Icon name="CheckCircleIcon" size={20} className="text-success" />
          <div>
            <span className="font-caption text-sm font-medium text-success-foreground">
              Password reset email sent!
            </span>
            <p className="font-caption text-xs text-muted-foreground mt-1">
              Check your inbox at <strong>{user?.email}</strong> and follow the link to reset your password.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Change Password</h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Icon name="EnvelopeIcon" size={24} className="text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-caption text-sm font-medium text-foreground">
                  Reset via Email
                </h4>
                <p className="font-caption text-xs text-muted-foreground mt-1">
                  We&apos;ll send a password reset link to your registered email address.
                  Click the link in the email to set a new password.
                </p>
                {user?.email && (
                  <p className="font-caption text-xs text-muted-foreground mt-2">
                    Email: <span className="text-foreground">{user.email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {resetEmailError && (
            <div className="flex items-center gap-2 rounded-lg bg-error/20 p-3">
              <Icon name="ExclamationCircleIcon" size={18} className="text-error" />
              <span className="font-caption text-xs text-error">{resetEmailError}</span>
            </div>
          )}

          <button
            onClick={handleSendPasswordResetEmail}
            disabled={isSendingResetEmail || !user?.email}
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingResetEmail ? (
              <>
                <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Icon name="EnvelopeIcon" size={16} />
                Send Password Reset Email
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
            <p className="mt-1 font-caption text-sm text-muted-foreground">
              Add an extra layer of security to your account with 2FA
            </p>
          </div>
          <button
            onClick={handleToggle2FA}
            className={`relative flex-shrink-0 h-6 w-11 rounded-full overflow-hidden transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${twoFactorEnabled ? 'bg-success' : 'bg-muted'
              }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Wallet Connection</h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${walletConnected ? 'bg-success/20' : 'bg-muted'}`}>
              <Icon name="WalletIcon" size={24} className={walletConnected ? 'text-success' : 'text-muted-foreground'} />
            </div>
            <div>
              <p className="font-caption text-sm font-medium text-foreground">
                {walletConnected ? 'Wallet Connected' : 'No Wallet Connected'}
              </p>
              <p className="font-caption text-xs text-muted-foreground">
                {walletConnected ? '0x1234...5678' : 'Connect your wallet to receive tokens'}
              </p>
            </div>
          </div>
          <button
            onClick={handleWalletConnection}
            className={`rounded-md px-4 py-2 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${walletConnected
              ? 'border border-error text-error hover:bg-error/10'
              : 'bg-primary text-primary-foreground hover:scale-[0.98]'
              }`}
          >
            {walletConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-error/50 bg-error/5 p-6">
        <h3 className="mb-2 font-heading text-lg font-semibold text-error">Danger Zone</h3>
        <p className="mb-4 font-caption text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 rounded-md border border-error bg-transparent px-4 py-2 font-caption text-sm font-medium text-error transition-smooth hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background"
        >
          <Icon name="TrashIcon" size={16} />
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-glow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/20">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-error" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">Delete Account?</h3>
            </div>
            <p className="mb-6 font-caption text-sm text-muted-foreground">
              This will permanently delete your account, all courses, achievements, and tokens. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md border border-border bg-card px-4 py-2 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="rounded-md bg-error px-4 py-2 font-caption text-sm font-medium text-error-foreground transition-smooth hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettingsTab;