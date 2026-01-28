'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressOverview from './ProgressOverview';
import CourseCard from './CourseCard';
import AchievementBadge from './AchievementBadge';
import ActivityFeed from './ActivityFeed';
import UpcomingDeadlines from './UpcomingDeadlines';
import LearningStats from './LearningStats';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

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

interface Activity {
    id: number;
    type: 'course_completed' | 'token_earned' | 'achievement_unlocked' | 'streak_milestone';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
}

interface Deadline {
    id: number;
    title: string;
    courseName: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
    type: 'Assignment' | 'Quiz' | 'Project' | 'Exam';
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
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Dynamic progress data based on user profile
    const progressData = {
        coursesCompleted: userProfile?.coursesCompleted || 0,
        totalCourses: (userProfile?.coursesCompleted || 0) + (userProfile?.coursesInProgress || 0) + 3,
        tokensEarned: userProfile?.tokens || 0,
        hoursLearned: Math.floor((userProfile?.coursesCompleted || 0) * 5.5),
        currentStreak: 12,
        overallProgress: userProfile?.coursesCompleted
            ? Math.floor((userProfile.coursesCompleted / ((userProfile.coursesCompleted || 0) + (userProfile.coursesInProgress || 0) + 3)) * 100)
            : 0
    };

    const enrolledCourses: Course[] = [
        {
            id: 1,
            title: "Blockchain Fundamentals",
            description: "Master the core concepts of blockchain technology, including distributed ledgers, consensus mechanisms, and cryptographic principles.",
            image: "https://images.unsplash.com/photo-1649682892309-e10e0b7cd40b",
            alt: "Digital blockchain network visualization with glowing blue nodes and connections on dark background",
            progress: 75,
            difficulty: 'Intermediate',
            tokenReward: 150,
            duration: "6 hours",
            enrolled: true
        },
        {
            id: 2,
            title: "Smart Contract Development",
            description: "Learn to write, deploy, and test smart contracts using Solidity and industry-standard development frameworks.",
            image: "https://images.unsplash.com/photo-1534137667199-675a46e143f3",
            alt: "Computer screen displaying colorful code editor with programming syntax highlighting",
            progress: 45,
            difficulty: 'Advanced',
            tokenReward: 200,
            duration: "8 hours",
            enrolled: true
        },
        {
            id: 3,
            title: "Cryptocurrency Trading Basics",
            description: "Understand market dynamics, technical analysis, and risk management strategies for cryptocurrency trading.",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_12fb302af-1767707274231.png",
            alt: "Financial trading charts with candlestick patterns and trend lines on multiple monitors",
            progress: 90,
            difficulty: 'Beginner',
            tokenReward: 100,
            duration: "4 hours",
            enrolled: true
        }
    ];

    const availableCourses: Course[] = [
        {
            id: 4,
            title: "DeFi Protocols & Applications",
            description: "Explore decentralized finance protocols, liquidity pools, yield farming, and the future of financial services.",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_136f7b22f-1767598784543.png",
            alt: "Abstract digital finance concept with interconnected geometric shapes and glowing elements",
            progress: 0,
            difficulty: 'Advanced',
            tokenReward: 250,
            duration: "10 hours",
            enrolled: false
        },
        {
            id: 5,
            title: "NFT Creation & Marketing",
            description: "Learn how to create, mint, and market non-fungible tokens across various blockchain platforms.",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_12ff3d6a0-1766511958579.png",
            alt: "Colorful digital art gallery showcasing various NFT artworks on virtual display screens",
            progress: 0,
            difficulty: 'Intermediate',
            tokenReward: 175,
            duration: "7 hours",
            enrolled: false
        },
        {
            id: 6,
            title: "Web3 Development Essentials",
            description: "Build decentralized applications using modern Web3 frameworks, libraries, and best practices.",
            image: "https://img.rocket.new/generatedImages/rocket_gen_img_1278e5e50-1764670617656.png",
            alt: "Developer workspace with laptop showing web development code and design mockups",
            progress: 0,
            difficulty: 'Intermediate',
            tokenReward: 180,
            duration: "9 hours",
            enrolled: false
        }
    ];

    const achievements: Achievement[] = [
        {
            id: 1,
            title: "First Steps",
            description: "Complete your first course",
            icon: "AcademicCapIcon",
            earned: (userProfile?.coursesCompleted || 0) >= 1,
            earnedDate: (userProfile?.coursesCompleted || 0) >= 1 ? "Recently" : undefined,
            rarity: 'Common'
        },
        {
            id: 2,
            title: "Token Collector",
            description: "Earn 100 tokens",
            icon: "CurrencyDollarIcon",
            earned: (userProfile?.tokens || 0) >= 100,
            earnedDate: (userProfile?.tokens || 0) >= 100 ? "Recently" : undefined,
            rarity: 'Rare'
        },
        {
            id: 3,
            title: "Streak Master",
            description: "Maintain a 7-day learning streak",
            icon: "FireIcon",
            earned: true,
            earnedDate: "Jan 10, 2026",
            rarity: 'Epic'
        },
        {
            id: 4,
            title: "Knowledge Seeker",
            description: "Complete 10 courses",
            icon: "BookOpenIcon",
            earned: (userProfile?.coursesCompleted || 0) >= 10,
            rarity: 'Legendary'
        }
    ];

    const activities: Activity[] = [
        {
            id: 1,
            type: 'course_completed',
            title: "Course Completed",
            description: "Finished 'Cryptocurrency Trading Basics' with 95% score",
            timestamp: "2 hours ago",
            icon: "CheckCircleIcon",
            color: "text-accent"
        },
        {
            id: 2,
            type: 'token_earned',
            title: "Tokens Earned",
            description: `Received ${userProfile?.tokens || 0} L2E tokens total`,
            timestamp: "Recently",
            icon: "CurrencyDollarIcon",
            color: "text-primary"
        },
        {
            id: 3,
            type: 'achievement_unlocked',
            title: "Achievement Unlocked",
            description: "Earned 'Streak Master' achievement",
            timestamp: "1 day ago",
            icon: "TrophyIcon",
            color: "text-secondary"
        },
        {
            id: 4,
            type: 'streak_milestone',
            title: "Streak Milestone",
            description: "Reached 12-day learning streak",
            timestamp: "1 day ago",
            icon: "FireIcon",
            color: "text-warning"
        }
    ];

    const deadlines: Deadline[] = [
        {
            id: 1,
            title: "Smart Contract Quiz",
            courseName: "Smart Contract Development",
            dueDate: "Jan 15, 2026",
            priority: 'High',
            type: 'Quiz'
        },
        {
            id: 2,
            title: "Blockchain Project Submission",
            courseName: "Blockchain Fundamentals",
            dueDate: "Jan 18, 2026",
            priority: 'Medium',
            type: 'Project'
        },
        {
            id: 3,
            title: "Trading Strategy Assignment",
            courseName: "Cryptocurrency Trading Basics",
            dueDate: "Jan 22, 2026",
            priority: 'Low',
            type: 'Assignment'
        }
    ];

    const learningStats: StatData[] = [
        {
            label: "Average Score",
            value: "87%",
            change: 5,
            icon: "ChartBarIcon",
            color: "bg-secondary/20 text-secondary"
        },
        {
            label: "Completion Rate",
            value: "92%",
            change: 8,
            icon: "CheckCircleIcon",
            color: "bg-accent/20 text-accent"
        },
        {
            label: "Study Time",
            value: "3.2h/day",
            change: -2,
            icon: "ClockIcon",
            color: "bg-primary/20 text-primary"
        },
        {
            label: "Rank",
            value: "#47",
            change: 12,
            icon: "TrophyIcon",
            color: "bg-warning/20 text-warning"
        }
    ];

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
                            <div className="h-64 animate-pulse rounded-xl bg-muted" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Get user's display name
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
                                    {userProfile?.email || user?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="font-heading text-2xl font-bold text-primary">
                                    {userProfile?.tokens || 0}
                                </div>
                                <div className="font-caption text-xs text-muted-foreground">EDU Tokens</div>
                            </div>
                            <div className="text-center">
                                <div className="font-heading text-2xl font-bold text-secondary">
                                    {userProfile?.coursesCompleted || 0}
                                </div>
                                <div className="font-caption text-xs text-muted-foreground">Courses Done</div>
                            </div>
                            <div className="text-center">
                                <div className="font-heading text-2xl font-bold text-accent">
                                    {userProfile?.certificates || 0}
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
                    {/* Wallet Address */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                            <Icon name="WalletIcon" size={16} className="text-muted-foreground" />
                            <span className="font-caption text-xs text-muted-foreground">Wallet:</span>
                            <code className="font-mono text-xs text-foreground bg-background/50 px-2 py-1 rounded">
                                {userProfile?.walletAddress || 'Not connected'}
                            </code>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <ProgressOverview data={progressData} />

                        <div
                            className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm"
                        >
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
                                {(activeTab === 'enrolled' ? enrolledCourses : availableCourses).map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onEnroll={(id) => {
                                            alert(`Enrolling in course ${id}... (Mock Action)`);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <LearningStats stats={learningStats} />

                        <div
                            className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm"
                        >
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
                        <ActivityFeed activities={activities} />
                        <UpcomingDeadlines deadlines={deadlines} />

                        <div
                            className="overflow-hidden rounded-xl bg-card p-6 shadow-glow-sm backdrop-blur-sm"
                        >
                            <h3 className="mb-4 font-heading text-xl font-bold text-foreground">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button className="flex w-full items-center gap-3 rounded-lg bg-primary p-4 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
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
