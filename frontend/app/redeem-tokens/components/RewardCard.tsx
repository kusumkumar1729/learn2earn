'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RewardCardProps {
  reward: {
    id: string;
    title: string;
    description: string;
    tokenCost: number;
    category: string;
    availability: 'available' | 'limited' | 'soldOut';
    image: string;
    alt: string;
    requirements?: string;
    stock?: number;
  };
  onRedeem: (rewardId: string) => void;
  onWishlist: (rewardId: string) => void;
  isInWishlist: boolean;
}

const RewardCard = ({ reward, onRedeem, onWishlist, isInWishlist }: RewardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const availabilityConfig = {
    available: {
      label: 'Available',
      color: 'text-success',
      bgColor: 'bg-success/20',
      icon: 'CheckCircleIcon' as const,
    },
    limited: {
      label: 'Limited Stock',
      color: 'text-warning',
      bgColor: 'bg-warning/20',
      icon: 'ExclamationTriangleIcon' as const,
    },
    soldOut: {
      label: 'Sold Out',
      color: 'text-error',
      bgColor: 'bg-error/20',
      icon: 'XCircleIcon' as const,
    },
  };

  const config = availabilityConfig[reward.availability];
  const isAvailable = reward.availability !== 'soldOut';

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm transition-smooth ${
        isHovered ? 'shadow-glow-lg' : 'shadow-glow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <AppImage
          src={reward.image}
          alt={reward.alt}
          className={`h-full w-full object-cover transition-smooth ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${!isAvailable ? 'opacity-50 grayscale' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        <button
          onClick={() => onWishlist(reward.id)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-smooth hover:bg-card hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Icon
            name="HeartIcon"
            size={20}
            variant={isInWishlist ? 'solid' : 'outline'}
            className={isInWishlist ? 'text-error' : 'text-muted-foreground'}
          />
        </button>

        <div className={`absolute left-3 top-3 flex items-center gap-2 rounded-full ${config.bgColor} px-3 py-1.5`}>
          <Icon name={config.icon} size={16} className={config.color} />
          <span className={`font-caption text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-bold text-foreground line-clamp-2">
            {reward.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary/20 px-3 py-1.5">
            <Icon name="CurrencyDollarIcon" size={16} className="text-primary" />
            <span className="font-mono text-sm font-bold text-primary">
              {reward.tokenCost.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="mb-4 font-caption text-sm text-muted-foreground line-clamp-2">
          {reward.description}
        </p>

        {reward.requirements && (
          <div className="mb-4 flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <Icon name="InformationCircleIcon" size={16} className="mt-0.5 shrink-0 text-secondary" />
            <p className="font-caption text-xs text-card-foreground">
              {reward.requirements}
            </p>
          </div>
        )}

        {reward.stock !== undefined && reward.availability === 'limited' && (
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-warning transition-smooth"
                style={{ width: `${Math.min((reward.stock / 100) * 100, 100)}%` }}
              />
            </div>
            <span className="font-caption text-xs text-muted-foreground">
              {reward.stock} left
            </span>
          </div>
        )}

        <button
          onClick={() => onRedeem(reward.id)}
          disabled={!isAvailable}
          className={`w-full rounded-md px-6 py-3 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
            isAvailable
              ? 'bg-primary text-primary-foreground hover:scale-[0.98] hover:shadow-glow-md'
              : 'cursor-not-allowed bg-muted text-muted-foreground opacity-50'
          }`}
        >
          {isAvailable ? 'Redeem Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;