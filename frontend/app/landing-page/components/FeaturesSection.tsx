'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  highlights: string[];
  gradient: string;
}

const FeaturesSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const features: Feature[] = [
    {
      id: 1,
      icon: 'CurrencyDollarIcon',
      title: 'Token Rewards',
      description: 'Earn cryptocurrency tokens for every completed lesson, quiz, and certification. Your knowledge has real value.',
      highlights: ['Instant payouts', 'No fees', 'Trade anywhere'],
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      id: 2,
      icon: 'AcademicCapIcon',
      title: 'Premium Courses',
      description: 'Access expert-led courses across technology, business, design, and more. Learn from industry professionals.',
      highlights: ['500+ courses', 'Expert instructors', 'Updated content'],
      gradient: 'from-secondary/20 to-secondary/5',
    },
    {
      id: 3,
      icon: 'ShieldCheckIcon',
      title: 'Blockchain Security',
      description: 'Your achievements and tokens are secured on the blockchain. Transparent, immutable, and verifiable credentials.',
      highlights: ['Tamper-proof', 'Instant verification', 'Lifetime valid'],
      gradient: 'from-accent/20 to-accent/5',
    },
    {
      id: 4,
      icon: 'ChartBarIcon',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics. Track courses, tokens earned, and skill development.',
      highlights: ['Real-time stats', 'Goal tracking', 'Skill insights'],
      gradient: 'from-warning/20 to-warning/5',
    },
    {
      id: 5,
      icon: 'UserGroupIcon',
      title: 'Community Learning',
      description: 'Join a global community of learners. Collaborate, share knowledge, and grow together in a supportive environment.',
      highlights: ['Peer support', 'Study groups', 'Networking'],
      gradient: 'from-success/20 to-success/5',
    },
    {
      id: 6,
      icon: 'GiftIcon',
      title: 'Redeem Rewards',
      description: 'Exchange your earned tokens for courses, certifications, merchandise, or transfer to your crypto wallet.',
      highlights: ['Multiple options', 'Low minimums', 'Fast transfers'],
      gradient: 'from-error/20 to-error/5',
    },
  ];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <section className="bg-card py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Platform Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
              Everything you need for a rewarding learning experience
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="bg-card py-20 scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Platform Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Everything you need for a rewarding learning experience
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative overflow-hidden rounded-xl bg-background/80 border border-border p-8 backdrop-blur-sm transition-smooth hover:scale-[1.02] hover:shadow-glow-lg hover:border-primary/30`}
            >
              <div className="relative z-10">
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} transition-smooth group-hover:scale-110`}>
                  <Icon name={feature.icon} size={32} className="text-primary" />
                </div>

                <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="mb-4 font-body text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-caption text-xs text-foreground/90 border border-primary/20"
                    >
                      <Icon name="CheckCircleIcon" size={12} className="text-success" />
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-smooth group-hover:scale-150" />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 font-caption text-xs text-muted-foreground uppercase tracking-wider">
            Trusted by learners at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-50">
            <span className="font-heading text-lg font-semibold text-foreground">TechCorp</span>
            <span className="font-heading text-lg font-semibold text-foreground">EduVentures</span>
            <span className="font-heading text-lg font-semibold text-foreground">SkillsBridge</span>
            <span className="font-heading text-lg font-semibold text-foreground">FutureLearn</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;