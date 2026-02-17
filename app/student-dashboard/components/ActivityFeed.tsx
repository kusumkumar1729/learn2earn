import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: number;
  type: 'course_completed' | 'token_earned' | 'achievement_unlocked' | 'streak_milestone';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'course_completed':
        return 'text-accent bg-accent/20';
      case 'token_earned':
        return 'text-primary bg-primary/20';
      case 'achievement_unlocked':
        return 'text-secondary bg-secondary/20';
      case 'streak_milestone':
        return 'text-warning bg-warning/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div
      className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm"
    >
      <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group flex items-start gap-4 rounded-lg p-3 transition-smooth hover:bg-muted"
          >
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${getActivityColor(
                activity.type
              )} transition-smooth group-hover:scale-110`}
            >
              <Icon name={activity.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="mb-1 font-caption text-sm font-medium text-foreground line-clamp-1">
                {activity.title}
              </h4>
              <p className="mb-1 font-caption text-xs text-muted-foreground line-clamp-2">
                {activity.description}
              </p>
              <span className="font-caption text-xs text-muted-foreground">
                {activity.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;