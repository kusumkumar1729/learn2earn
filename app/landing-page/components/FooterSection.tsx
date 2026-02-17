'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const FooterSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);

  const footerSections: FooterSection[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Student Dashboard', href: '/student' },
        { label: 'Admin Dashboard', href: '/admin' },
        { label: 'Redeem Tokens', href: '/redeem' },
        { label: 'Transfer Tokens', href: '/trans' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Features', href: '#features' },
        { label: 'Documentation', href: '/about' },
        { label: 'FAQ', href: '/about' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/about' },
        { label: 'Careers', href: '/about' },
        { label: 'Blog', href: '/about' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/privacy' },
        { label: 'Security', href: '/about' },
      ],
    },
  ];

  const socialLinks = [
    { icon: 'GlobeAltIcon', label: 'Website', href: '/' },
    { icon: 'ChatBubbleLeftRightIcon', label: 'Discord', href: 'https://discord.com' },
    { icon: 'AtSymbolIcon', label: 'Twitter', href: 'https://twitter.com' },
    { icon: 'VideoCameraIcon', label: 'YouTube', href: 'https://youtube.com' },
  ];

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (!isHydrated) {
    return (
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <div className="h-10 w-40 rounded bg-muted animate-pulse" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="mb-4 h-6 w-24 rounded bg-muted animate-pulse" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 w-32 rounded bg-muted animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/landing-page" className="flex items-center gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="url(#gradient)" />
                <path
                  d="M20 10L12 16V24L20 30L28 24V16L20 10Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 20L12 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 20V30"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 20L28 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0"
                    y1="0"
                    x2="40"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-heading text-xl font-bold text-foreground">
                Learn2Earn
              </span>
            </Link>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Blockchain-powered education platform where learning meets earning. Transform your knowledge into verifiable credentials and real cryptocurrency rewards.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-muted transition-smooth hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={social.label}
                >
                  <Icon name={social.icon} size={20} />
                </Link>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-caption text-sm text-muted-foreground transition-smooth hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-caption text-sm text-muted-foreground">
              &copy; {currentYear} Learn2Earn. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Icon name="ShieldCheckIcon" size={16} className="text-success" />
                <span className="font-caption text-sm text-muted-foreground">
                  Secured by Blockchain
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="GlobeAltIcon" size={16} className="text-muted-foreground" />
                <span className="font-caption text-sm text-muted-foreground">
                  140+ Countries
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;