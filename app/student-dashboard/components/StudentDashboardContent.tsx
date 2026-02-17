'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ProgressOverview from './ProgressOverview';
import CourseCard from './CourseCard';
import AchievementBadge from './AchievementBadge';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface MockCourse {
    serviceId: number;
    serviceName: string;
    tokensPaid: number;
    serviceType?: number;
}

interface MockService {
    id: number;
    name: string;
    tokenCost: number;
    serviceType: number;
}

// Interfaces
interface Course {
    id: number;
    title: string;
    description: string;
    image: string;
    alt: string;
    progress: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    tokenReward: number;
    duration: string;
    enrolled: boolean;
}

interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

interface StatData {
    label: string;
    value: string;
    change: number;
    icon: string;
    color: string;
}

const StudentDashboardContent = () => {
    const { user, userProfile } = useAuth();

    // Mock Data
    const balance = 1250;
    const certificateBalance = 5;

    // Stabilize mock data with useMemo to prevent re-renders
    const studentCourses: MockCourse[] = useMemo(() => [
        { serviceId: 101, serviceName: "Intro to Web3", tokensPaid: 100 * 1e18 },
        { serviceId: 102, serviceName: "React Basics", tokensPaid: 50 * 1e18 }
    ], []);

    const services: MockService[] = useMemo(() => [
        { id: 201, name: "Advanced Node.js", tokenCost: 75 * 1e18, serviceType: 1 },
        { id: 202, name: "Solidity Security", tokenCost: 150 * 1e18, serviceType: 1 }
    ], []);

    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // 1. Safe derived state for Progress
    const progressData = useMemo(() => {
        const completedCount = studentCourses ? studentCourses.filter((c: MockCourse) => Number(c.serviceType) === 1).length : 0;
        const total = studentCourses ? studentCourses.length : 0;
        // Assume courses take roughly 5.5h on average for this metric
        const hours = Math.floor(total * 5.5);
        const tokenBalance = balance ? Number(balance) / 1e18 : 0;

        return {
            coursesCompleted: completedCount,
            totalCourses: total,
            tokensEarned: tokenBalance,
            hoursLearned: hours,
            currentStreak: total > 0 ? 1 : 0, // dynamic streak based on activity
            overallProgress: total > 0 ? 100 : 0
        };
    }, [studentCourses, balance]);

    // 2. Map blockchain services to UI Course objects
    const mappedEnrolledCourses: Course[] = useMemo(() => {
        return (studentCourses || []).map((p: MockCourse) => ({
            id: Number(p.serviceId),
            title: p.serviceName,
            description: `Successfully enrolled in ${p.serviceName}`,
            image: "https://images.unsplash.com/photo-1649682892309-e10e0b7cd40b",
            alt: "Course Image",
            progress: 100,
            difficulty: 'Intermediate',
            tokenReward: Number(p.tokensPaid) / 1e18,
            duration: "Self-Paced",
            enrolled: true
        }));
    }, [studentCourses]);

    const mappedAvailableCourses: Course[] = useMemo(() => {
        return (services || [])
            .filter((s: MockService) => Number(s.serviceType) === 1)
            .map((s: MockService) => ({
                id: Number(s.id),
                title: s.name,
                description: `Join our ${s.name} and earn rewards.`,
                image: "https://img.rocket.new/generatedImages/rocket_gen_img_136f7b22f-1767598784543.png",
                alt: s.name,
                progress: 0,
                difficulty: 'Intermediate',
                tokenReward: Number(s.tokenCost) / 1e18,
                duration: "Self-Paced",
                enrolled: (studentCourses || []).some((p: MockCourse) => Number(p.serviceId) === Number(s.id))
            }));
    }, [services, studentCourses]);

    // 3. Achievements based on real data
    const achievements: Achievement[] = useMemo(() => {
        const courseCount = studentCourses?.length || 0;
        const tokenBalance = balance ? Number(balance) / 1e18 : 0;

        return [
            {
                id: 1,
                title: "First Steps",
                description: "Complete your first course",
                icon: "AcademicCapIcon",
                earned: courseCount >= 1,
                earnedDate: courseCount >= 1 ? "Recently" : undefined,
                rarity: 'Common'
            },
            {
                id: 2,
                title: "Token Collector",
                description: "Earn 100 EDU tokens",
                icon: "CurrencyDollarIcon",
                earned: tokenBalance >= 100,
                rarity: 'Rare'
            },
            {
                id: 3,
                title: "Knowledge Seeker",
                description: "Enroll in 5 courses",
                icon: "BookOpenIcon",
                earned: courseCount >= 5,
                rarity: 'Epic'
            },
            {
                id: 4,
                title: "Master Scholar",
                description: "Enroll in 10 courses",
                icon: "TrophyIcon",
                earned: courseCount >= 10,
                rarity: 'Legendary'
            }
        ];
    }, [studentCourses, balance]);

    const learningStats: StatData[] = useMemo(() => {
        return [
            {
                label: "Courses Enrolled",
                value: (studentCourses?.length || 0).toString(),
                change: 0,
                icon: "ChartBarIcon",
                color: "bg-secondary/20 text-secondary"
            },
            {
                label: "Completion Rate",
                value: (studentCourses?.length > 0 ? "100%" : "0%"),
                change: 0,
                icon: "CheckCircleIcon",
                color: "bg-accent/20 text-accent"
            },
            {
                label: "Certificates",
                value: (certificateBalance?.toString() || "0"),
                change: 0,
                icon: "TrophyIcon",
                color: "bg-warning/20 text-warning"
            }
        ];
    }, [studentCourses, certificateBalance]);

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="mb-8 h-12 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-64 animate-pulse rounded-xl bg-muted" />
                            <div className="h-96 animate-pulse rounded-xl bg-muted" />
                        </div>
                        <div className="space-y-6">
                            <div className="h-64 animate-pulse rounded-xl bg-muted" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const displayName = userProfile?.name || user?.displayName || 'Student';
    const firstName = displayName.split(' ')[0];

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                {/* User Profile Summary */}
                <div className="mb-8 rounded-xl bg-card/50 border border-border p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <Icon name="UserCircleIcon" size={40} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="font-heading text-2xl font-bold text-foreground">
                                    Welcome back, {firstName}!
                                </h1>
                                <p className="font-caption text-sm text-muted-foreground">
                                    {userProfile?.email || user?.email || 'Student'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="font-heading text-2xl font-bold text-primary">
                                    {balance}
                                </div>
                                <div className="font-caption text-xs text-muted-foreground">EDU Tokens</div>
                            </div>
                            <div className="text-center">
                                <div className="font-heading text-2xl font-bold text-secondary">
                                    {studentCourses?.length || 0}
                                </div>
                                <div className="font-caption text-xs text-muted-foreground">Courses Enrolled</div>
                            </div>
                            <div className="text-center">
                                <div className="font-heading text-2xl font-bold text-accent">
                                    {certificateBalance ? Number(certificateBalance) : 0}
                                </div>
                                <div className="font-caption text-xs text-muted-foreground">Certificates</div>
                            </div>

                            <Link
                                href="/profile-settings"
                                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-caption text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-smooth"
                            >
                                <Icon name="Cog6ToothIcon" size={18} />
                                <span className="hidden sm:inline">Settings</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <ProgressOverview data={progressData} />

                        <div className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    My Courses
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('enrolled')}
                                        className={`rounded-md px-4 py-2 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${activeTab === 'enrolled'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        Enrolled
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('available')}
                                        className={`rounded-md px-4 py-2 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${activeTab === 'available'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        Available
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {(activeTab === 'enrolled' ? mappedEnrolledCourses : mappedAvailableCourses).length === 0 ? (
                                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                                        {activeTab === 'enrolled'
                                            ? "You haven't enrolled in any courses yet."
                                            : "No courses available at the moment."}
                                    </div>
                                ) : (
                                    (activeTab === 'enrolled' ? mappedEnrolledCourses : mappedAvailableCourses).map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onEnroll={async () => {
                                                alert("Successfully enrolled (Mock)!");
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm">
                            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                                Learning Stats
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {learningStats.map((stat, index) => (
                                    <div key={index} className={`p-4 rounded-xl border border-border ${stat.color.replace('text-', 'border-').split(' ')[0]} bg-card/30`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-md ${stat.color}`}>
                                                <Icon name={stat.icon} size={20} />
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm">
                            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                                Achievements
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {achievements.map((achievement) => (
                                    <AchievementBadge key={achievement.id} achievement={achievement} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">

                        <div className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm">
                            <h3 className="mb-4 font-heading text-xl font-bold text-foreground">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setActiveTab('available')}
                                    className="flex w-full items-center gap-3 rounded-lg bg-primary p-4 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                                >
                                    <Icon name="AcademicCapIcon" size={20} />
                                    <span>Browse All Courses</span>
                                </button>
                                <Link
                                    href="/redeem-tokens"
                                    className="flex w-full items-center gap-3 rounded-lg bg-secondary p-4 font-caption text-sm font-medium text-secondary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
                                >
                                    <Icon name="CurrencyDollarIcon" size={20} />
                                    <span>Redeem Tokens</span>
                                </Link>
                                <Link
                                    href="/profile-settings"
                                    className="flex w-full items-center gap-3 rounded-lg bg-accent p-4 font-caption text-sm font-medium text-accent-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                                >
                                    <Icon name="UserCircleIcon" size={20} />
                                    <span>Edit Profile</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardContent;
