'use client';

import React from 'react';
import Header from '@/components/common/Header';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import CTASection from './CTASection';
import FooterSection from './FooterSection';

const LandingPageInteractive = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header userRole={null} isAuthenticated={false} />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default LandingPageInteractive;