'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const DynamicNavbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, userRole, isAdmin, isStudent, signOut, adminLogout, userProfile } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Define navigation items based on role
    const getNavItems = (): NavItem[] => {
        if (isAdmin) {
            return [
                { label: 'Dashboard', href: '/admindashboard', icon: 'HomeIcon' },
                { label: 'Submissions', href: '/admindashboard#submissions', icon: 'DocumentCheckIcon' },
                { label: 'Users', href: '/admindashboard#users', icon: 'UsersIcon' },
                { label: 'Tokens', href: '/admindashboard#tokens', icon: 'CurrencyDollarIcon' },
                { label: 'Analytics', href: '/admindashboard#analytics', icon: 'ChartBarIcon' },
            ];
        }

        if (isStudent) {
            return [
                { label: 'Home', href: '/student-dashboard', icon: 'HomeIcon' },
                { label: 'Earn Tokens', href: '/earn-tokens', icon: 'SparklesIcon' },
                { label: 'Transfer', href: '/transfer', icon: 'ArrowsRightLeftIcon' },
                { label: 'Hackathons', href: '/hackathon', icon: 'TrophyIcon' },
                { label: 'Courses', href: '/courses', icon: 'BookOpenIcon' },
                { label: 'Redeem', href: '/redeem-tokens', icon: 'GiftIcon' },
                { label: 'Profile', href: '/profile-settings', icon: 'UserCircleIcon' },
            ];
        }

        // Guest navigation
        return [
            { label: 'Home', href: '/', icon: 'HomeIcon' },
            { label: 'About', href: '/about', icon: 'InformationCircleIcon' },
        ];
    };

    const navItems = getNavItems();

    const handleLogout = async () => {
        if (isAdmin) {
            adminLogout();
            router.push('/');
        } else {
            await signOut();
            router.push('/');
        }
        setIsMobileMenuOpen(false);
    };

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="mx-auto max-w-[1400px] px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href={isAdmin ? '/admindashboard' : isStudent ? '/student-dashboard' : '/'} className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Icon name="AcademicCapIcon" size={24} className="text-primary-foreground" />
                        </div>
                        <span className="font-heading text-xl font-bold text-foreground">
                            Learn2Earn
                        </span>
                        {isAdmin && (
                            <span className="ml-2 rounded-full bg-error/10 px-2 py-0.5 font-caption text-xs font-medium text-error">
                                Admin
                            </span>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 font-caption text-sm transition-smooth ${isActive(item.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                                    }`}
                            >
                                <Icon name={item.icon} size={18} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {(isAdmin || isStudent) ? (
                            <div className="flex items-center gap-4">
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    {/* Profile Photo or Initial */}
                                    {(user?.photoURL || userProfile?.avatar) ? (
                                        <img
                                            src={user?.photoURL || userProfile?.avatar || ''}
                                            alt={userProfile?.name || user?.displayName || 'User'}
                                            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                                            {(userProfile?.name || user?.displayName || 'S').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="hidden lg:block">
                                        <p className="font-caption text-sm font-medium text-foreground">
                                            {isAdmin ? 'Administrator' : userProfile?.name || user?.displayName || 'Student'}
                                        </p>
                                        <p className="font-caption text-xs text-muted-foreground">
                                            {isAdmin ? 'Admin Account' : `${userProfile?.tokens || 0} tokens`}
                                        </p>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-caption text-sm text-muted-foreground transition-smooth hover:border-error/50 hover:text-error"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin-login"
                                    className="font-caption text-sm text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    Admin
                                </Link>
                                <button
                                    onClick={() => router.push('/')}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:opacity-90"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={18} />
                                    <span>Sign In</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-smooth"
                    >
                        <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-caption text-sm transition-smooth ${isActive(item.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                                    }`}
                            >
                                <Icon name={item.icon} size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* Mobile User Info & Logout */}
                        {(isAdmin || isStudent) && (
                            <>
                                <div className="border-t border-border pt-4 mt-4">
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        {/* Profile Photo or Initial */}
                                        {(user?.photoURL || userProfile?.avatar) ? (
                                            <img
                                                src={user?.photoURL || userProfile?.avatar || ''}
                                                alt={userProfile?.name || user?.displayName || 'User'}
                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                                                {(userProfile?.name || user?.displayName || 'S').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-caption text-sm font-medium text-foreground">
                                                {isAdmin ? 'Administrator' : userProfile?.name || user?.displayName || 'Student'}
                                            </p>
                                            <p className="font-caption text-xs text-muted-foreground">
                                                {isAdmin ? 'Admin Account' : `${userProfile?.tokens || 0} tokens`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 font-caption text-sm text-error hover:bg-error/5 transition-smooth"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={20} />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}

                        {/* Mobile Guest Options */}
                        {!isAdmin && !isStudent && (
                            <div className="border-t border-border pt-4 mt-4 space-y-2">
                                <Link
                                    href="/admin-login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-caption text-sm text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    <Icon name="ShieldCheckIcon" size={20} />
                                    <span>Admin Login</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push('/');
                                    }}
                                    className="w-full flex items-center gap-3 rounded-lg bg-primary px-4 py-3 font-caption text-sm font-medium text-primary-foreground"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={20} />
                                    <span>Sign In</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default DynamicNavbar;
