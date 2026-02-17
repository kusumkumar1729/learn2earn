'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
  alt: string;
}

interface TokenPortfolioProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  selectedTokenId: string;
}

const TokenPortfolio = ({
  tokens,
  onSelectToken,
  selectedTokenId,
}: TokenPortfolioProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-glow-md">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalValue = tokens.reduce((sum, token) => sum + token.usdValue, 0);

  return (
    <div className="rounded-xl bg-card p-6 shadow-glow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Token Portfolio
        </h2>
        <div className="text-right">
          <p className="font-caption text-xs text-muted-foreground">
            Total Value
          </p>
          <p className="font-mono text-lg font-medium text-foreground">
            ${formatNumber(totalValue)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {tokens.map((token) => {
          const isSelected = token.id === selectedTokenId;
          const isPositive = token.change24h >= 0;

          return (
            <button
              key={token.id}
              onClick={() => onSelectToken(token)}
              className={`w-full rounded-lg p-4 text-left transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card ${
                isSelected ? 'bg-muted ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <AppImage
                      src={token.icon}
                      alt={token.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-caption text-sm font-medium text-foreground">
                      {token.name}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-sm font-medium text-foreground">
                    {formatNumber(token.balance)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <Icon
                      name={isPositive ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                      size={12}
                      className={
                        isPositive ? 'text-success' : 'text-error'
                      }
                    />
                    <p
                      className={`font-mono text-xs ${
                        isPositive ? 'text-success' : 'text-error'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TokenPortfolio;