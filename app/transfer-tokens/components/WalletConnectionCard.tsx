'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface WalletConnectionCardProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletConnectionCard = ({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}: WalletConnectionCardProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-glow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <div className="h-6 w-6 animate-pulse rounded-full bg-muted-foreground/20" />
            </div>
            <div>
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-glow-md transition-smooth hover:shadow-glow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isConnected ? 'bg-success/20' : 'bg-muted'
            }`}
          >
            <Icon
              name="WalletIcon"
              size={24}
              className={isConnected ? 'text-success' : 'text-muted-foreground'}
            />
          </div>
          <div>
            <h3 className="font-caption text-sm font-medium text-foreground">
              {isConnected ? 'Wallet Connected' : 'Connect Your Wallet'}
            </h3>
            {isConnected ? (
              <p className="font-mono text-xs text-muted-foreground">
                {truncateAddress(walletAddress)}
              </p>
            ) : (
              <p className="font-caption text-xs text-muted-foreground">
                Connect to start transferring tokens
              </p>
            )}
          </div>
        </div>
        <button
          onClick={isConnected ? onDisconnect : onConnect}
          className={`rounded-md px-6 py-2.5 font-caption text-sm font-medium transition-smooth hover:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
            isConnected
              ? 'bg-error text-error-foreground hover:shadow-glow-md focus:ring-error'
              : 'bg-primary text-primary-foreground hover:shadow-glow-md focus:ring-primary'
          }`}
        >
          {isConnected ? 'Disconnect' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default WalletConnectionCard;