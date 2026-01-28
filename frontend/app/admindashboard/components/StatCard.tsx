import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  iconBg: string;
}

const StatCard = ({ title, value, change, trend, icon, iconBg }: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card p-6 transition-smooth hover:shadow-glow-md">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-smooth group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="font-caption text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-2 font-heading text-3xl font-bold text-foreground">{value}</h3>
          <div className="mt-3 flex items-center gap-2">
            <span className={`flex items-center gap-1 font-caption text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              <Icon name={trend === 'up' ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={14} />
              {change}
            </span>
            <span className="font-caption text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg} transition-smooth group-hover:scale-110`}>
          <Icon name={icon} size={24} className="text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;