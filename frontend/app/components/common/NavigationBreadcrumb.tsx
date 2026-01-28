'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface NavigationBreadcrumbProps {
  customItems?: BreadcrumbItem[];
}

const NavigationBreadcrumb = ({ customItems }: NavigationBreadcrumbProps) => {
  const pathname = usePathname();

  const routeLabels: Record<string, string> = {
    '/landing-page': 'Home',
    '/student-dashboard': 'Dashboard',
    '/admin-dashboard': 'Admin Dashboard',
    '/redeem-tokens': 'Redeem Tokens',
    '/transfer-tokens': 'Transfer Tokens',
    '/profile-settings': 'Profile Settings',
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = routeLabels[currentPath] || path.replace(/-/g, ' ');
      breadcrumbs.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-custom"
      aria-label="Breadcrumb"
    >
      <Link
        href="/student-dashboard"
        className="flex items-center gap-1 font-caption text-sm text-muted-foreground transition-smooth hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <Icon name="HomeIcon" size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={item.path}>
            <Icon
              name="ChevronRightIcon"
              size={16}
              className="text-muted-foreground"
            />
            {isLast ? (
              <span className="font-caption text-sm font-medium text-foreground">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.path}
                className="whitespace-nowrap font-caption text-sm text-muted-foreground transition-smooth hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default NavigationBreadcrumb;