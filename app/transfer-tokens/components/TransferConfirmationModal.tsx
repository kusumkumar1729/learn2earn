'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TransferConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: {
    recipientAddress: string;
    amount: number;
    token: string;
    networkFee: number;
    note?: string;
  };
  onConfirm: () => void;
}

const TransferConfirmationModal = ({
  isOpen,
  onClose,
  transferData,
  onConfirm,
}: TransferConfirmationModalProps) => {
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  const total = transferData.amount + transferData.networkFee;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-fade-in rounded-xl bg-card p-6 shadow-glow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Confirm Transfer
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 font-caption text-xs text-muted-foreground">
              Recipient Address
            </p>
            <p className="font-mono text-sm text-foreground">
              {truncateAddress(transferData.recipientAddress)}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="mb-1 font-caption text-xs text-muted-foreground">
              Transfer Amount
            </p>
            <p className="font-mono text-2xl font-bold text-foreground">
              {transferData.amount.toFixed(6)} {transferData.token}
            </p>
          </div>

          {transferData.note && (
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-1 font-caption text-xs text-muted-foreground">
                Note
              </p>
              <p className="font-caption text-sm text-foreground">
                {transferData.note}
              </p>
            </div>
          )}

          <div className="space-y-2 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm text-muted-foreground">
                Transfer Amount
              </span>
              <span className="font-mono text-sm text-foreground">
                {transferData.amount.toFixed(6)} {transferData.token}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm text-muted-foreground">
                Network Fee
              </span>
              <span className="font-mono text-sm text-foreground">
                {transferData.networkFee.toFixed(6)} {transferData.token}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-caption text-sm font-medium text-foreground">
                Total
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                {total.toFixed(6)} {transferData.token}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg bg-warning/10 p-4">
          <Icon name="ExclamationTriangleIcon" size={20} className="text-warning" />
          <div>
            <p className="font-caption text-sm font-medium text-warning">
              Important
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              Please verify the recipient address carefully. Transactions cannot be reversed once confirmed.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-muted px-6 py-3 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
          >
            <Icon name="CheckIcon" size={20} />
            <span>Confirm Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferConfirmationModal;