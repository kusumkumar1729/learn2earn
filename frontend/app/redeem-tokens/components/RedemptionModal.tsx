'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface RedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: {
    id: string;
    title: string;
    description: string;
    tokenCost: number;
    image: string;
    alt: string;
  } | null;
  currentBalance: number;
  onConfirm: () => void;
}

const RedemptionModal = ({
  isOpen,
  onClose,
  reward,
  currentBalance,
  onConfirm,
}: RedemptionModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  if (!isOpen || !reward || !isHydrated) return null;

  const hasEnoughTokens = currentBalance >= reward.tokenCost;
  const remainingBalance = currentBalance - reward.tokenCost;

  const handleConfirm = () => {
    if (!hasEnoughTokens) return;
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm();
      setIsProcessing(false);
      setProgress(0);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-glow-lg animate-fade-in">
        <div className="relative h-48 w-full overflow-hidden">
          <AppImage
            src={reward.image}
            alt={reward.alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          
          {!isProcessing && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-smooth hover:bg-card hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Close modal"
            >
              <Icon name="XMarkIcon" size={20} className="text-foreground" />
            </button>
          )}
        </div>

        <div className="p-6">
          {!isProcessing ? (
            <>
              <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                Confirm Redemption
              </h2>
              <p className="mb-6 font-caption text-sm text-muted-foreground">
                {reward.description}
              </p>

              <div className="mb-6 space-y-4 rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-card-foreground">
                    Reward
                  </span>
                  <span className="font-caption text-sm font-medium text-foreground">
                    {reward.title}
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-card-foreground">
                    Token Cost
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Icon name="CurrencyDollarIcon" size={16} className="text-primary" />
                    <span className="font-mono text-sm font-bold text-primary">
                      {reward.tokenCost.toLocaleString()} L2E
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm text-card-foreground">
                    Current Balance
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {currentBalance.toLocaleString()} L2E
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="font-caption text-sm font-medium text-card-foreground">
                    Remaining Balance
                  </span>
                  <span
                    className={`font-mono text-sm font-bold ${
                      hasEnoughTokens ? 'text-success' : 'text-error'
                    }`}
                  >
                    {hasEnoughTokens ? remainingBalance.toLocaleString() : '0'} L2E
                  </span>
                </div>
              </div>

              {!hasEnoughTokens && (
                <div className="mb-6 flex items-start gap-3 rounded-md bg-error/20 p-4">
                  <Icon name="ExclamationTriangleIcon" size={20} className="shrink-0 text-error" />
                  <div>
                    <p className="font-caption text-sm font-medium text-error">
                      Insufficient Balance
                    </p>
                    <p className="mt-1 font-caption text-xs text-error/80">
                      You need {(reward.tokenCost - currentBalance).toLocaleString()} more tokens to redeem this reward.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-md bg-muted px-6 py-3 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!hasEnoughTokens}
                  className={`flex-1 rounded-md px-6 py-3 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    hasEnoughTokens
                      ? 'bg-primary text-primary-foreground hover:scale-[0.98] hover:shadow-glow-md'
                      : 'cursor-not-allowed bg-muted text-muted-foreground opacity-50'
                  }`}
                >
                  Confirm Redemption
                </button>
              </div>
            </>
          ) : (
            <div className="py-8">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Icon name="CurrencyDollarIcon" size={40} className="text-primary animate-pulse" />
                </div>
              </div>

              <h3 className="mb-2 text-center font-heading text-xl font-bold text-foreground">
                Processing Transaction
              </h3>
              <p className="mb-6 text-center font-caption text-sm text-muted-foreground">
                Please wait while we process your redemption...
              </p>

              <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-smooth"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-center font-mono text-xs text-muted-foreground">
                {progress}% Complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedemptionModal;