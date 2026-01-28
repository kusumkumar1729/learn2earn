'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface FloatingToken {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const HeroSection = () => {
  const router = useRouter();
  const { user, setShowAuthModal } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [floatingTokens, setFloatingTokens] = useState<FloatingToken[]>([]);

  useEffect(() => {
    setIsHydrated(true);

    const tokens: FloatingToken[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));

    setFloatingTokens(tokens);
  }, []);

  if (!isHydrated) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-card to-background">
        <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center px-6 py-20 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-5xl font-bold text-foreground md:text-6xl lg:text-7xl">
              Learn. Earn. Grow.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-muted-foreground md:text-xl">
              Transform your education into cryptocurrency rewards with blockchain-powered learning
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-14 w-48 rounded-md bg-muted animate-pulse" />
              <div className="h-14 w-48 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-card to-background">
      {floatingTokens.map((token) => (
        <div
          key={token.id}
          className="absolute h-12 w-12 rounded-full bg-primary/10 backdrop-blur-sm"
          style={{
            left: `${token.x}%`,
            top: `${token.y}%`,
            animation: `float ${token.duration}s ease-in-out ${token.delay}s infinite`,
          }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="CurrencyDollarIcon" size={24} className="text-primary" />
          </div>
        </div>
      ))}

      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center px-6 py-20 lg:px-8">
        <div className="relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <Icon name="SparklesIcon" size={20} className="text-primary" />
            <span className="font-caption text-sm font-medium text-primary">
              Blockchain-Powered Education
            </span>
          </div>

          <h1 className="font-heading text-5xl font-bold text-foreground md:text-6xl lg:text-7xl">
            Learn. Earn. Grow.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-muted-foreground md:text-xl">
            Transform your education into cryptocurrency rewards with blockchain-powered learning. Complete courses, earn tokens, and unlock your potential.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              <span>{user ? 'Go to Dashboard' : 'Get Started'}</span>
              <Icon
                name="ArrowRightIcon"
                size={20}
                className="transition-smooth group-hover:translate-x-1"
              />
            </button>

            <button
              className="group flex items-center gap-2 rounded-md border-2 border-primary/20 bg-card/50 px-8 py-4 font-caption text-base font-medium text-foreground backdrop-blur-sm transition-smooth hover:border-primary/40 hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => router.push('/about')}
            >
              <Icon name="InformationCircleIcon" size={20} />
              <span>Know More</span>
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-lg bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-primary">10K+</div>
              <div className="font-caption text-sm font-medium text-foreground">Active Learners</div>
              <div className="mt-1 font-caption text-xs text-muted-foreground">Growing 20% month-over-month</div>
            </div>
            <div className="rounded-lg bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-primary">500+</div>
              <div className="font-caption text-sm font-medium text-foreground">Courses Available</div>
              <div className="mt-1 font-caption text-xs text-muted-foreground">From industry experts worldwide</div>
            </div>
            <div className="rounded-lg bg-card/50 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-primary">$2M+</div>
              <div className="font-caption text-sm font-medium text-foreground">Tokens Earned</div>
              <div className="mt-1 font-caption text-xs text-muted-foreground">Distributed to our learners</div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="ShieldCheckIcon" size={16} className="text-success" />
              <span className="font-caption text-xs">Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="LockClosedIcon" size={16} className="text-success" />
              <span className="font-caption text-xs">Encrypted Data</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="GlobeAltIcon" size={16} className="text-success" />
              <span className="font-caption text-xs">Available Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;