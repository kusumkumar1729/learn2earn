'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface TokenBalanceIndicatorProps {
  balance: number;
}

const TokenBalanceIndicator = ({ balance }: TokenBalanceIndicatorProps) => {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (balance !== displayBalance) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayBalance(balance);
        setIsAnimating(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [balance, displayBalance]);

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Link
      href="/transfer-tokens"
      className="group flex items-center gap-2 rounded-md bg-muted px-4 py-2 transition-smooth hover:bg-primary/10 hover:shadow-glow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
        <Icon
          name="CurrencyDollarIcon"
          size={18}
          className="text-primary transition-smooth group-hover:scale-110"
        />
      </div>
      <div className="hidden flex-col sm:flex">
        <span className="font-caption text-xs text-muted-foreground">Balance</span>
        <span
          className={`font-mono text-sm font-medium text-foreground transition-smooth ${
            isAnimating ? 'scale-110 text-primary' : ''
          }`}
        >
          {formatBalance(displayBalance)} L2E
        </span>
      </div>
      <div className="flex sm:hidden">
        <span
          className={`font-mono text-sm font-medium text-foreground transition-smooth ${
            isAnimating ? 'scale-110 text-primary' : ''
          }`}
        >
          {formatBalance(displayBalance)}
        </span>
      </div>
    </Link>
  );
};

export default TokenBalanceIndicator;