'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProgressData {
  coursesCompleted: number;
  totalCourses: number;
  tokensEarned: number;
  hoursLearned: number;
  currentStreak: number;
  overallProgress: number;
}

interface ProgressOverviewProps {
  data: ProgressData;
}

const ProgressOverview = ({ data }: ProgressOverviewProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Courses Completed',
      value: `${data.coursesCompleted}/${data.totalCourses}`,
      icon: 'AcademicCapIcon',
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
    {
      label: 'Tokens Earned',
      value: data.tokensEarned.toLocaleString(),
      icon: 'CurrencyDollarIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      label: 'Hours Learned',
      value: data.hoursLearned.toString(),
      icon: 'ClockIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
    {
      label: 'Current Streak',
      value: `${data.currentStreak} days`,
      icon: 'FireIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm transition-smooth hover:scale-[1.02] hover:shadow-glow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-caption text-sm text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor} transition-smooth group-hover:scale-110`}
              >
                <Icon name={stat.icon} size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Overall Progress
          </h3>
          <span className="font-mono text-2xl font-bold text-primary">
            {data.overallProgress}%
          </span>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
            style={{ width: `${data.overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;