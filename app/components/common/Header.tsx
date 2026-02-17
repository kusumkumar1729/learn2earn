'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import TokenBalanceIndicator from '@/components/common/TokenBalanceIndicator';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import NotificationBadge from '@/components/common/NotificationBadge';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

interface HeaderProps {
  userRole?: 'student' | 'admin' | null;
  isAuthenticated?: boolean;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  roles: ('student' | 'admin')[];
  showBadge?: boolean;
}

const Header = ({ userRole: propUserRole = null, isAuthenticated: propIsAuthenticated = false }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut, setShowAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Use context user if available, otherwise fall back to props
  const isAuthenticated = user ? true : propIsAuthenticated;
  const userRole = user ? 'student' : propUserRole;

  const navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      path: userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard',
      icon: 'HomeIcon',
      roles: ['student', 'admin'],
    },
    {
      label: 'Learn',
      path: '/student-dashboard',
      icon: 'AcademicCapIcon',
      roles: ['student'],
      showBadge: true,
    },
    {
      label: 'Tokens',
      path: '/redeem-tokens',
      icon: 'CurrencyDollarIcon',
      roles: ['student'],
      showBadge: true,
    },
    {
      label: 'Profile',
      path: '/profile-settings',
      icon: 'UserCircleIcon',
      roles: ['student', 'admin'],
    },
  ];

  const moreMenuItems: NavigationItem[] = [
    {
      label: 'Admin',
      path: '/admin-dashboard',
      icon: 'Cog6ToothIcon',
      roles: ['admin'],
      showBadge: true,
    },
  ];

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const filteredNavItems = isAuthenticated
    ? navigationItems.filter((item) => userRole && item.roles.includes(userRole))
    : [];

  const filteredMoreItems = isAuthenticated
    ? moreMenuItems.filter((item) => userRole && item.roles.includes(userRole))
    : [];

  const isActivePath = (path: string) => {
    if (path === '/redeem-tokens') {
      return pathname === '/redeem-tokens' || pathname === '/transfer-tokens';
    }
    return pathname === path;
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push('/landing-page');
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.displayName || user.email || user.phoneNumber || 'User';
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getUserAvatar = () => {
    return user?.photoURL || null;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-[1000] w-full transition-smooth ${scrolled
          ? 'bg-card shadow-glow-md'
          : 'bg-card'
          }`}
        style={{
          backdropFilter: scrolled ? 'blur(0px)' : 'none',
        }}
      >
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-8">
          <Link
            href={isAuthenticated ? (userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard') : '/landing-page'}
            className="flex items-center transition-smooth hover:opacity-80"
            onClick={handleNavClick}
          >
            <div className="flex items-center gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-smooth hover:scale-105"
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
              <span className="font-heading text-2xl font-bold text-foreground">
                Learn2Earn
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <>
              <div className="hidden items-center gap-8 md:flex">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 font-caption text-base font-medium transition-smooth hover:text-primary ${isActivePath(item.path)
                      ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    onClick={handleNavClick}
                  >
                    <Icon name={item.icon} size={20} />
                    <span>{item.label}</span>
                    {item.showBadge && (
                      <NotificationBadge
                        count={item.label === 'Learn' ? 3 : item.label === 'Tokens' ? 2 : 0}
                      />
                    )}
                    {isActivePath(item.path) && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                    )}
                  </Link>
                ))}

                {filteredMoreItems.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 font-caption text-base font-medium text-muted-foreground transition-smooth hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                      <Icon name="EllipsisHorizontalIcon" size={20} />
                      <span>More</span>
                    </button>

                    {isMoreMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[1010]"
                          onClick={() => setIsMoreMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full z-[1020] mt-2 w-48 rounded-md bg-popover shadow-glow-lg">
                          {filteredMoreItems.map((item) => (
                            <Link
                              key={item.label}
                              href={item.path}
                              className={`flex items-center gap-3 px-4 py-3 font-caption text-sm transition-smooth hover:bg-muted ${isActivePath(item.path)
                                ? 'text-primary' : 'text-popover-foreground'
                                }`}
                              onClick={handleNavClick}
                            >
                              <Icon name={item.icon} size={18} />
                              <span>{item.label}</span>
                              {item.showBadge && (
                                <NotificationBadge count={5} />
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="hidden items-center gap-4 md:flex">
                {userRole === 'student' && <TokenBalanceIndicator balance={1250} />}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 rounded-full p-1 transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    {getUserAvatar() ? (
                      <Image
                        src={getUserAvatar()!}
                        alt={getUserDisplayName()}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                        {getUserInitial()}
                      </div>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[1010]"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full z-[1020] mt-2 w-64 rounded-xl bg-popover border border-border shadow-glow-lg overflow-hidden">
                        {/* User Info */}
                        <div className="border-b border-border p-4">
                          <div className="flex items-center gap-3">
                            {getUserAvatar() ? (
                              <Image
                                src={getUserAvatar()!}
                                alt={getUserDisplayName()}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-medium">
                                {getUserInitial()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-caption text-sm font-medium text-foreground truncate">
                                {getUserDisplayName()}
                              </p>
                              <p className="font-caption text-xs text-muted-foreground truncate">
                                {user?.email || user?.phoneNumber || ''}
                              </p>
                            </div>
                          </div>
                        </div>


                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/student-dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 font-caption text-sm text-popover-foreground transition-smooth hover:bg-muted"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon name="Squares2X2Icon" size={18} />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/profile-settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 font-caption text-sm text-popover-foreground transition-smooth hover:bg-muted"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon name="UserCircleIcon" size={18} />
                            <span>Profile Settings</span>
                          </Link>
                          <hr className="my-2 border-border" />
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-caption text-sm text-error transition-smooth hover:bg-error/10"
                          >
                            <Icon name="ArrowRightOnRectangleIcon" size={18} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:hidden"
                aria-label="Toggle mobile menu"
              >
                <Icon
                  name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
                  size={24}
                />
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLoginClick}
                disabled={loading}
                className="font-caption text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
              >
                Login
              </button>
              <button
                onClick={handleLoginClick}
                disabled={loading}
                className="rounded-md bg-primary px-6 py-2.5 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.96] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
              >
                Get Started
              </button>
            </div>
          )}
        </nav>
      </header>

      {isMobileMenuOpen && isAuthenticated && (
        <div className="fixed inset-0 z-[1020] md:hidden">
          <div
            className="absolute inset-0 bg-background"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-20 h-[calc(100vh-5rem)] w-full animate-slide-in bg-card shadow-glow-lg">
            <div className="flex h-full flex-col overflow-y-auto scrollbar-custom p-6">
              {/* User Info Mobile */}
              {user && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  {getUserAvatar() ? (
                    <Image
                      src={getUserAvatar()!}
                      alt={getUserDisplayName()}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-medium">
                      {getUserInitial()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-caption text-sm font-medium text-foreground truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="font-caption text-xs text-muted-foreground truncate">
                      {user?.email || user?.phoneNumber || ''}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                {userRole === 'student' && <TokenBalanceIndicator balance={1250} />}
                <UserRoleIndicator role={userRole} />
              </div>

              <div className="flex flex-col gap-2">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 font-caption text-base font-medium transition-smooth hover:bg-muted ${isActivePath(item.path)
                      ? 'bg-muted text-primary' : 'text-card-foreground'
                      }`}
                    onClick={handleNavClick}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="flex-1">{item.label}</span>
                    {item.showBadge && (
                      <NotificationBadge
                        count={item.label === 'Learn' ? 3 : item.label === 'Tokens' ? 2 : 0}
                      />
                    )}
                  </Link>
                ))}

                {filteredMoreItems.length > 0 && (
                  <>
                    <div className="my-4 h-px bg-border" />
                    {filteredMoreItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.path}
                        className={`flex items-center gap-3 rounded-md px-4 py-3 font-caption text-base font-medium transition-smooth hover:bg-muted ${isActivePath(item.path)
                          ? 'bg-muted text-primary' : 'text-card-foreground'
                          }`}
                        onClick={handleNavClick}
                      >
                        <Icon name={item.icon} size={20} />
                        <span className="flex-1">{item.label}</span>
                        {item.showBadge && <NotificationBadge count={5} />}
                      </Link>
                    ))}
                  </>
                )}

                {/* Sign Out Mobile */}
                <div className="my-4 h-px bg-border" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-md px-4 py-3 font-caption text-base font-medium text-error transition-smooth hover:bg-error/10"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
};

export default Header;