'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Step {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  highlight: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: 'AcademicCapIcon',
    title: 'Earn Tokens',
    subtitle: 'Rewarding real academic effort',
    description:
      'Students earn tokens for meaningful academic progress and skill-building activities, making learning more engaging and valuable.',
    details: [
      'Attendance consistency across subjects',
      'Assignment and record submissions',
      'CGPA milestones or semester completion',
      'Course completions and certifications',
      'Participation in technical and extracurricular activities',
      'NFT certificates issued for verified achievements',
    ],
    highlight: 'Tokens reflect real effort and progress',
  },
  {
    id: 2,
    icon: 'ShieldCheckIcon',
    title: 'Assign Tokens',
    subtitle: 'Verified by institution authorities',
    description:
      'To ensure fairness and credibility, tokens are assigned only after verification by faculty or administrators.',
    details: [
      'Admin verifies attendance and assignments',
      'Faculty validates academic records',
      'Approved rewards distributed securely',
      'Transparent and institution-backed system',
    ],
    highlight: 'Fair, trusted, and tamper-resistant rewards',
  },
  {
    id: 3,
    icon: 'GiftIcon',
    title: 'Use Tokens',
    subtitle: 'Turn rewards into real benefits',
    description:
      'Students can redeem their earned tokens for academic, career, and campus benefits that create real-world impact.',
    details: [
      'Hackathon and competition participation',
      'Canteen discounts and campus benefits',
      'Event tickets for workshops and conferences',
      'University merchandise like hoodies and notebooks',
      'Resume reviews and T&P training programs',
      'Voting power to choose workshops and events',
    ],
    highlight: 'Tokens unlock meaningful opportunities',
  },
  {
    id: 4,
    icon: 'SquaresPlusIcon',
    title: 'Token-Powered Applications',
    subtitle: 'Built for real-world usage',
    description:
      'Dedicated platforms are built around the token ecosystem to ensure students can use their rewards in practical and valuable ways.',
    details: [
      'Hackathon & events platform for registrations and rewards',
      'Learning & career platform for workshops and mock interviews',
      'Token-based access to premium opportunities',
      'Ecosystem designed for continuous student growth',
    ],
    highlight: 'Extensible ecosystem for future innovation',
  },

  {
    id: 5,
    icon: 'LinkIcon',
    title: 'Blockchain Transparency',
    subtitle: 'Every action is verifiable and secure',
    description:
      'All token transactions, rewards, and certificates are recorded on the blockchain, ensuring complete transparency and tamper-proof academic records.',
    details: [
      'Immutable transaction history for rewards',
      'Verifiable proof of achievements',
      'No manipulation of records or scores',
      'Trust between students and institutions',
    ],
    highlight: 'Powered by decentralized trust',
  },

  {
    id: 6,
    icon: 'BriefcaseIcon',
    title: 'Career Impact',
    subtitle: 'Turn learning into opportunities',
    description:
      'Beyond rewards, the platform helps students build real career value through verified skills, credentials, and performance-based recognition.',
    details: [
      'NFT certificates for portfolio and LinkedIn',
      'Skill-based proof for recruiters',
      'Performance-driven student recognition',
      'Bridges education with employability',
    ],
    highlight: 'Learning that directly supports career growth',
  },

];

const HowItWorksSection = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((step, index) => {
            setTimeout(() => {
              setVisibleSteps((prev) =>
                prev.includes(step.id) ? prev : [...prev, step.id]
              );
            }, index * 200);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-background py-20 scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
          <p className="mt-4 text-muted-foreground">
            Start earning cryptocurrency while you learn in three simple steps.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`transition-all duration-700 transform rounded-xl border p-8
              ${visibleSteps.includes(step.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-primary">{step.subtitle}</p>
              <p className="mt-3 text-muted-foreground">{step.description}</p>

              <ul className="mt-4 space-y-2">
                {step.details.map((d, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {d}</li>
                ))}
              </ul>

              <div className="mt-4 text-xs text-primary font-medium">
                ✨ {step.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
