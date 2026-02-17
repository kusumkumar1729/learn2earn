import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const rarityColors = {
    Common: 'from-muted-foreground to-muted',
    Rare: 'from-secondary to-secondary/60',
    Epic: 'from-primary to-warning',
    Legendary: 'from-accent to-primary',
  };

  const rarityGlow = {
    Common: 'shadow-glow-sm',
    Rare: 'shadow-glow-md',
    Epic: 'shadow-glow-lg',
    Legendary: 'shadow-glow-lg',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card backdrop-blur-sm p-4 transition-smooth hover:scale-[1.02] ${achievement.earned ? rarityGlow[achievement.rarity] : 'opacity-50'
        }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${rarityColors[achievement.rarity]
            } transition-smooth group-hover:scale-110`}
        >
          <Icon
            name={achievement.icon}
            size={32}
            className="text-white"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="font-heading text-base font-bold text-foreground line-clamp-1">
              {achievement.title}
            </h4>
            {achievement.earned && (
              <Icon
                name="CheckBadgeIcon"
                size={16}
                className="flex-shrink-0 text-accent"
              />
            )}
          </div>
          <p className="mb-2 font-caption text-xs text-muted-foreground line-clamp-2">
            {achievement.description}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-0.5 font-caption text-xs font-medium ${achievement.rarity === 'Common' ? 'bg-muted text-muted-foreground'
                : achievement.rarity === 'Rare' ? 'bg-secondary/20 text-secondary'
                  : achievement.rarity === 'Epic' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                }`}
            >
              {achievement.rarity}
            </span>
            {achievement.earned && achievement.earnedDate && (
              <span className="font-caption text-xs text-muted-foreground">
                Earned {achievement.earnedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;