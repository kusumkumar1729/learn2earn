'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface TransferSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData: {
    txHash: string;
    amount: number;
    token: string;
    recipientAddress: string;
  };
}

const TransferSuccessModal = ({
  isOpen,
  onClose,
  transactionData,
}: TransferSuccessModalProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !isHydrated) return null;

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-fade-in rounded-xl bg-card p-6 shadow-glow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <Icon name="CheckCircleIcon" size={40} className="text-success" />
          </div>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
            Transfer Successful!
          </h2>
          <p className="font-caption text-sm text-muted-foreground">
            Your tokens have been sent successfully
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 font-caption text-xs text-muted-foreground">
              Amount Sent
            </p>
            <p className="font-mono text-xl font-bold text-foreground">
              {transactionData.amount.toFixed(6)} {transactionData.token}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 font-caption text-xs text-muted-foreground">
              Recipient
            </p>
            <p className="font-mono text-sm text-foreground">
              {truncateAddress(transactionData.recipientAddress)}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 font-caption text-xs text-muted-foreground">
              Transaction Hash
            </p>
            <button className="font-mono text-sm text-primary transition-smooth hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card">
              {truncateHash(transactionData.txHash)}
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg bg-secondary/10 p-4">
          <Icon name="InformationCircleIcon" size={20} className="text-secondary" />
          <p className="font-caption text-xs text-muted-foreground">
            Your transaction is being processed on the blockchain. It may take a few minutes to complete.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/student-dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-muted px-6 py-3 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
          >
            <Icon name="HomeIcon" size={20} />
            <span>Go to Dashboard</span>
          </Link>
          <button
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
          >
            <Icon name="PaperAirplaneIcon" size={20} />
            <span>New Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferSuccessModal;