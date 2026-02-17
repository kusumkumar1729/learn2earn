'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Transaction {
  id: string;
  rewardTitle: string;
  tokenCost: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  transactionHash: string;
}

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHistoryModal = ({ isOpen, onClose }: TransactionHistoryModalProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      rewardTitle: 'Advanced JavaScript Course',
      tokenCost: 1500,
      date: '2026-01-12',
      status: 'completed',
      transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    },
    {
      id: '2',
      rewardTitle: 'Professional Certificate',
      tokenCost: 800,
      date: '2026-01-10',
      status: 'completed',
      transactionHash: '0x3c2c2eb7b11a91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ea',
    },
    {
      id: '3',
      rewardTitle: 'Learn2Earn T-Shirt',
      tokenCost: 300,
      date: '2026-01-08',
      status: 'completed',
      transactionHash: '0x91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ea3c2c2eb7b11a',
    },
  ];

  if (!isOpen || !isHydrated) return null;

  const statusConfig = {
    completed: {
      label: 'Completed',
      color: 'text-success',
      bgColor: 'bg-success/20',
      icon: 'CheckCircleIcon' as const,
    },
    pending: {
      label: 'Pending',
      color: 'text-warning',
      bgColor: 'bg-warning/20',
      icon: 'ClockIcon' as const,
    },
    failed: {
      label: 'Failed',
      color: 'text-error',
      bgColor: 'bg-error/20',
      icon: 'XCircleIcon' as const,
    },
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-card shadow-glow-lg animate-fade-in">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Transaction History
            </h2>
            <p className="mt-1 font-caption text-sm text-muted-foreground">
              View your past redemptions and transactions
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Close modal"
          >
            <Icon name="XMarkIcon" size={20} className="text-foreground" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-custom p-6">
          {mockTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Icon name="DocumentTextIcon" size={32} className="text-muted-foreground" />
              </div>
              <p className="font-caption text-sm text-muted-foreground">
                No transactions yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockTransactions.map((transaction) => {
                const config = statusConfig[transaction.status];
                return (
                  <div
                    key={transaction.id}
                    className="rounded-xl bg-muted/50 p-4 transition-smooth hover:bg-muted"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="mb-1 font-caption text-base font-medium text-foreground">
                          {transaction.rewardTitle}
                        </h3>
                        <p className="font-caption text-xs text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 rounded-full ${config.bgColor} px-3 py-1.5`}>
                        <Icon name={config.icon} size={14} className={config.color} />
                        <span className={`font-caption text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <Icon name="CurrencyDollarIcon" size={16} className="text-primary" />
                      <span className="font-mono text-sm font-bold text-primary">
                        {transaction.tokenCost.toLocaleString()} L2E
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-md bg-card/50 p-3">
                      <Icon name="LinkIcon" size={14} className="shrink-0 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground truncate">
                        {transaction.transactionHash}
                      </span>
                      <button
                        onClick={() => {
                          if (isHydrated && typeof navigator !== 'undefined') {
                            navigator.clipboard.writeText(transaction.transactionHash);
                          }
                        }}
                        className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                        aria-label="Copy transaction hash"
                      >
                        <Icon name="ClipboardDocumentIcon" size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-border p-6">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;