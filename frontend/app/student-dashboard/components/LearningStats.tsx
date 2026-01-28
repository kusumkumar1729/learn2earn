'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatData {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface LearningStatsProps {
  stats: StatData[];
}

const LearningStats = ({ stats }: LearningStatsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group overflow-hidden rounded-xl bg-card p-4 shadow-glow-sm backdrop-blur-sm transition-smooth hover:scale-[1.02] hover:shadow-glow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="mb-1 font-caption text-xs text-muted-foreground">
                {stat.label}
              </p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <Icon
                  name={stat.change >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                  size={14}
                  className={stat.change >= 0 ? 'text-accent' : 'text-error'}
                />
                <span
                  className={`font-caption text-xs font-medium ${stat.change >= 0 ? 'text-accent' : 'text-error'
                    }`}
                >
                  {Math.abs(stat.change)}% vs last week
                </span>
              </div>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} transition-smooth group-hover:scale-110`}
            >
              <Icon name={stat.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningStats;