'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const router = useRouter();
  const { user, setShowAuthModal } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="rounded-2xl bg-card/50 p-12 text-center backdrop-blur-sm md:p-16">
            <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Ready to Start Learning?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
              Join thousands of learners earning cryptocurrency while building valuable skills
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-14 w-48 rounded-md bg-muted animate-pulse" />
              <div className="h-14 w-48 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-card/50 p-12 text-center backdrop-blur-sm md:p-16">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 backdrop-blur-sm">
              <Icon name="FireIcon" size={20} className="text-primary" />
              <span className="font-caption text-sm font-medium text-primary">
                Limited Time Offer
              </span>
            </div>

            <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Ready to Start Learning?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
              Join thousands of learners earning cryptocurrency while building valuable skills. Get 100 bonus tokens when you sign up today.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => {
                  if (user) {
                    router.push('/dashboard');
                  } else {
                    setShowAuthModal(true);
                  }
                }}
                className="group flex items-center gap-2 rounded-md bg-primary px-8 py-4 font-caption text-base font-medium text-primary-foreground shadow-glow-md transition-smooth hover:scale-[0.98] hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Icon name="RocketLaunchIcon" size={20} />
                <span>{user ? 'Go to Dashboard' : 'Start Learning Now'}</span>
                <Icon
                  name="ArrowRightIcon"
                  size={20}
                  className="transition-smooth group-hover:translate-x-1"
                />
              </button>

              <button
                className="group flex items-center gap-2 rounded-md border-2 border-primary/20 bg-background/50 px-8 py-4 font-caption text-base font-medium text-foreground backdrop-blur-sm transition-smooth hover:border-primary/40 hover:bg-background/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <Icon name="PlayIcon" size={20} />
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={20} className="text-success" />
                <span className="font-caption text-sm text-muted-foreground">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={20} className="text-success" />
                <span className="font-caption text-sm text-muted-foreground">
                  Free to start
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={20} className="text-success" />
                <span className="font-caption text-sm text-muted-foreground">
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;