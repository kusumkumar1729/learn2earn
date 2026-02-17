'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';

const DashboardInteractive = () => {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();

    // Mock data for dashboard stats
    const coursesCompleted = 2; // Example static value
    const tokenBalance = 1250; // Example static value
    const achievementCount = 5; // Example static value

    // Redirect to landing if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/landing-page');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/landing-page');
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
                    <p className="mt-4 font-caption text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return null;
    }

    // Get user info
    const displayName = user.displayName || user.email || user.phoneNumber || 'User';
    const email = user.email || user.phoneNumber || '';
    const photoURL = user.photoURL;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pb-16 pt-8">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

                <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
                    {/* Welcome Card */}
                    <div className="rounded-2xl bg-card/50 p-8 backdrop-blur-sm border border-border">
                        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                            {/* Avatar */}
                            {photoURL ? (
                                <Image
                                    src={photoURL}
                                    alt={displayName}
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-primary/20 shadow-glow-md"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold shadow-glow-md">
                                    {initial}
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                                    Welcome back, {displayName.split(' ')[0]}! 👋
                                </h1>
                                <p className="mt-2 font-body text-lg text-muted-foreground">
                                    {email}
                                </p>
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                    <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2">
                                        <Icon name="CheckCircleIcon" size={16} className="text-success" />
                                        <span className="font-caption text-sm font-medium text-success">Verified Account</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                                        <Icon name="SparklesIcon" size={16} className="text-primary" />
                                        <span className="font-caption text-sm font-medium text-primary">New Member</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Link
                                    href="/profile-settings"
                                    className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted/80"
                                >
                                    <Icon name="Cog6ToothIcon" size={18} />
                                    <span>Settings</span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-2 font-caption text-sm font-medium text-error transition-smooth hover:bg-error/20"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-8">
                <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                    Quick Actions
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Start Learning */}
                    <Link
                        href="/student-dashboard"
                        className="group relative overflow-hidden rounded-2xl bg-card p-6 border border-border transition-smooth hover:border-primary/40 hover:shadow-glow-md"
                    >
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-smooth group-hover:bg-primary/10" />
                        <div className="relative">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                <Icon name="AcademicCapIcon" size={28} className="text-primary" />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground">Start Learning</h3>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                                Browse courses and start earning
                            </p>
                            <div className="mt-4 flex items-center gap-2 font-caption text-sm font-medium text-primary">
                                <span>Get Started</span>
                                <Icon name="ArrowRightIcon" size={16} className="transition-smooth group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* View Tokens */}
                    <Link
                        href="/redeem-tokens"
                        className="group relative overflow-hidden rounded-2xl bg-card p-6 border border-border transition-smooth hover:border-primary/40 hover:shadow-glow-md"
                    >
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/5 transition-smooth group-hover:bg-secondary/10" />
                        <div className="relative">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                                <Icon name="CurrencyDollarIcon" size={28} className="text-secondary" />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground">View Tokens</h3>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                                Check your token balance
                            </p>
                            <div className="mt-4 flex items-center gap-2 font-caption text-sm font-medium text-secondary">
                                <span>View Balance</span>
                                <Icon name="ArrowRightIcon" size={16} className="transition-smooth group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Transfer Tokens */}
                    <Link
                        href="/transfer-tokens"
                        className="group relative overflow-hidden rounded-2xl bg-card p-6 border border-border transition-smooth hover:border-primary/40 hover:shadow-glow-md"
                    >
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/5 transition-smooth group-hover:bg-accent/10" />
                        <div className="relative">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                                <Icon name="ArrowsRightLeftIcon" size={28} className="text-accent" />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground">Transfer Tokens</h3>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                                Send tokens to others
                            </p>
                            <div className="mt-4 flex items-center gap-2 font-caption text-sm font-medium text-accent">
                                <span>Transfer Now</span>
                                <Icon name="ArrowRightIcon" size={16} className="transition-smooth group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Profile Settings */}
                    <Link
                        href="/profile-settings"
                        className="group relative overflow-hidden rounded-2xl bg-card p-6 border border-border transition-smooth hover:border-primary/40 hover:shadow-glow-md"
                    >
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-warning/5 transition-smooth group-hover:bg-warning/10" />
                        <div className="relative">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10">
                                <Icon name="UserCircleIcon" size={28} className="text-warning" />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground">Profile Settings</h3>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                                Manage your account
                            </p>
                            <div className="mt-4 flex items-center gap-2 font-caption text-sm font-medium text-warning">
                                <span>Go to Settings</span>
                                <Icon name="ArrowRightIcon" size={16} className="transition-smooth group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="mx-auto max-w-[1400px] px-6 pb-12 lg:px-8">
                <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 p-8 border border-border">
                    <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                        Your Progress
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary">
                                {coursesCompleted}
                            </div>
                            <div className="mt-1 font-caption text-sm text-muted-foreground">Courses Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-secondary">
                                {tokenBalance.toLocaleString()}
                            </div>
                            <div className="mt-1 font-caption text-sm text-muted-foreground">Tokens Earned</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-accent">
                                {achievementCount}
                            </div>
                            <div className="mt-1 font-caption text-sm text-muted-foreground">Achievements</div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href="/student-dashboard"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground shadow-glow-md transition-smooth hover:scale-[0.98] hover:shadow-glow-lg"
                        >
                            <Icon name="RocketLaunchIcon" size={18} />
                            <span>Start Your First Course</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardInteractive;
