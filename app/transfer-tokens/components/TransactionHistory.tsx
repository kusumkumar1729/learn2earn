'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  token: string;
  address: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  note?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-glow-md">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return b.amount - a.amount;
  });

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'CheckCircleIcon';
      case 'pending':
        return 'ClockIcon';
      case 'failed':
        return 'XCircleIcon';
      default:
        return 'QuestionMarkCircleIcon';
    }
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-glow-md">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Transaction History
        </h2>

        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md bg-muted p-1">
            {(['all', 'sent', 'received'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded px-3 py-1.5 font-caption text-xs font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card ${filterType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
            className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 font-caption text-xs font-medium text-foreground transition-smooth hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
          >
            <Icon name="ArrowsUpDownIcon" size={14} />
            <span>Sort by {sortBy === 'date' ? 'Date' : 'Amount'}</span>
          </button>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Icon name="DocumentTextIcon" size={32} className="text-muted-foreground" />
          </div>
          <p className="font-caption text-sm text-muted-foreground">
            No transactions found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="hidden min-w-full lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-caption text-xs font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="pb-3 text-left font-caption text-xs font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="pb-3 text-left font-caption text-xs font-medium text-muted-foreground">
                    Address
                  </th>
                  <th className="pb-3 text-left font-caption text-xs font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="pb-3 text-left font-caption text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left font-caption text-xs font-medium text-muted-foreground">
                    TX Hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-border transition-smooth hover:bg-muted"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.type === 'sent' ? 'bg-error/20' : 'bg-success/20'
                            }`}
                        >
                          <Icon
                            name={
                              tx.type === 'sent' ? 'ArrowUpRightIcon' : 'ArrowDownLeftIcon'
                            }
                            size={16}
                            className={
                              tx.type === 'sent' ? 'text-error' : 'text-success'
                            }
                          />
                        </div>
                        <span className="font-caption text-sm font-medium text-foreground">
                          {tx.type === 'sent' ? 'Sent' : 'Received'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-mono text-sm font-medium text-foreground">
                        {tx.type === 'sent' ? '-' : '+'}
                        {tx.amount.toFixed(6)} {tx.token}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="font-mono text-sm text-muted-foreground">
                        {truncateAddress(tx.address)}
                      </p>
                    </td>
                    <td className="py-4">
                      <p className="font-caption text-sm text-muted-foreground">
                        {tx.timestamp}
                      </p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Icon
                          name={getStatusIcon(tx.status)}
                          size={16}
                          className={getStatusColor(tx.status)}
                        />
                        <span
                          className={`font-caption text-sm ${getStatusColor(
                            tx.status
                          )}`}
                        >
                          {tx.status.charAt(0).toUpperCase() +
                            tx.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <button className="font-mono text-sm text-primary transition-smooth hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card">
                        {truncateHash(tx.txHash)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {sortedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-lg bg-muted p-4 transition-smooth hover:bg-muted/80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.type === 'sent' ? 'bg-error/20' : 'bg-success/20'
                        }`}
                    >
                      <Icon
                        name={
                          tx.type === 'sent' ? 'ArrowUpRightIcon' : 'ArrowDownLeftIcon'
                        }
                        size={16}
                        className={
                          tx.type === 'sent' ? 'text-error' : 'text-success'
                        }
                      />
                    </div>
                    <span className="font-caption text-sm font-medium text-foreground">
                      {tx.type === 'sent' ? 'Sent' : 'Received'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      name={getStatusIcon(tx.status)}
                      size={16}
                      className={getStatusColor(tx.status)}
                    />
                    <span
                      className={`font-caption text-xs ${getStatusColor(
                        tx.status
                      )}`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-caption text-xs text-muted-foreground">
                      Amount
                    </span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {tx.type === 'sent' ? '-' : '+'}
                      {tx.amount.toFixed(6)} {tx.token}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-caption text-xs text-muted-foreground">
                      Address
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {truncateAddress(tx.address)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-caption text-xs text-muted-foreground">
                      Date
                    </span>
                    <span className="font-caption text-xs text-muted-foreground">
                      {tx.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-caption text-xs text-muted-foreground">
                      TX Hash
                    </span>
                    <button className="font-mono text-xs text-primary transition-smooth hover:underline focus:outline-none">
                      {truncateHash(tx.txHash)}
                    </button>
                  </div>
                </div>

                {tx.note && (
                  <div className="mt-3 rounded bg-background/50 p-2">
                    <p className="font-caption text-xs text-muted-foreground">
                      {tx.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;