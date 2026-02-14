'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import StatCard from './StatCard';
import FilterControls from './FilterControls';
import UserTableRow from './UserTableRow';
import PopularCourses from './PopularCourses';
import TokenEconomyWidget from './TokenEconomyWidget';
import CreateServicePanel from './CreateServicePanel';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUserProfiles, UserProfile } from '@/lib/mockDataStore';
// import { getPendingSubmissions, approveSubmission, rejectSubmission, type ActivitySubmission } from '@/lib/activitySubmissionsStore'; // Removed

import { useCallback } from 'react';

// Lazy load AnalyticsChart - recharts is heavy (~500KB)
const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded-xl bg-muted" />
});

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    avatarAlt: string;
    enrollmentDate: string;
    status: 'active' | 'inactive' | 'suspended';
    progress: number;
    tokensEarned: number;
    coursesCompleted: number;
    category: string;
}

interface StatData {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    iconBg: string;
}

interface ChartData {
    month: string;
    registrations: number;
    completions: number;
}

interface Course {
    id: string;
    title: string;
    enrollments: number;
    completionRate: number;
    category: string;
}

interface TokenMetric {
    label: string;
    value: string;
    icon: string;
    color: string;
}


const PendingSubmissionsSection = ({
    submissions,
    processingSubmission,
    onApprove,
    onReject,
    onRefresh,
    isLoading
}: {
    submissions: any[]; // Relaxed type for Web3 usage
    processingSubmission: string | null;
    onApprove: (submission: any) => void;
    onReject: (submission: any) => void;
    onRefresh: () => void;
    isLoading?: boolean;
}) => {
    return (
        <div id="submissions" className="mb-8 rounded-xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Pending Submissions</h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">
                        Review and approve student activity submissions
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 font-caption text-xs text-foreground hover:bg-background transition-smooth disabled:opacity-50"
                >
                    <Icon name="ArrowPathIcon" size={14} className={isLoading ? "animate-spin" : ""} />
                    <span>Refresh</span>
                </button>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted mb-4">
                        <Icon name="InboxIcon" size={32} className="text-muted-foreground" />
                    </div>
                    <p className="font-caption text-muted-foreground">No pending submissions to review</p>
                    <p className="font-caption text-xs text-muted-foreground mt-1">When students submit tasks, they will appear here</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-caption text-xs font-medium text-muted-foreground uppercase tracking-wider">Student</th>
                                <th className="text-left py-3 px-4 font-caption text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                                <th className="text-left py-3 px-4 font-caption text-xs font-medium text-muted-foreground uppercase tracking-wider">Proof</th>
                                <th className="text-left py-3 px-4 font-caption text-xs font-medium text-muted-foreground uppercase tracking-wider">Tokens</th>
                                <th className="text-left py-3 px-4 font-caption text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="text-right py-3 px-4 font-caption text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {submissions.map((submission) => {
                                const isProcessing = processingSubmission === `${submission.activityId}-${submission.studentId}`;
                                return (
                                    <tr key={`${submission.activityId}-${submission.studentId}`} className="hover:bg-muted/50 transition-smooth">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-caption text-sm font-medium text-foreground">
                                                    {submission.studentId.substring(0, 6)}...{submission.studentId.substring(38)}
                                                </p>
                                                <p className="font-caption text-xs text-muted-foreground">{submission.studentEmail || 'Blockchain User'}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-caption text-sm text-foreground">{submission.activityTitle}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="max-w-[200px]">
                                                <p className="font-caption text-xs text-muted-foreground truncate" title={submission.proofValue}>
                                                    {submission.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-sm font-bold text-primary">+{submission.tokens} EDU</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-caption text-xs text-muted-foreground">
                                                {new Date(Number(submission.submittedAt) * 1000).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onApprove(submission)}
                                                    disabled={isProcessing}
                                                    className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 font-caption text-xs font-medium text-success-foreground transition-smooth hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isProcessing ? (
                                                        <Icon name="ArrowPathIcon" size={12} className="animate-spin" />
                                                    ) : (
                                                        <Icon name="CheckIcon" size={12} />
                                                    )}
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => onReject(submission)}
                                                    disabled={isProcessing}
                                                    className="flex items-center gap-1 rounded-lg bg-error px-3 py-1.5 font-caption text-xs font-medium text-error-foreground transition-smooth hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Icon name="XMarkIcon" size={12} />
                                                    <span>Reject</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AdminDashboardContent = () => {
    const router = useRouter();
    const { adminLogout } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'services' | 'users'>('overview');

    const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
    const [realPendingSubmissions, setRealPendingSubmissions] = useState<any[]>([]);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [processingSubmission, setProcessingSubmission] = useState<string | null>(null);

    // Removed fetchAllPendingActivities logic

    useEffect(() => {
        setIsHydrated(true);

        const loadData = () => {
            // Mock users still loaded for User Management Table (as we don't have on-chain registry)
            const users = getAllUserProfiles();
            setRegisteredUsers(users);
        };

        loadData();
    }, []);



    // Convert registered users to display format
    const registeredUsersList: User[] = registeredUsers.map((profile, index) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,
        avatarAlt: `${profile.name}'s avatar`,
        enrollmentDate: new Date(profile.joinedDate).toLocaleDateString(),
        status: 'active' as const,
        progress: Math.min(100, (profile.coursesCompleted / 10) * 100),
        tokensEarned: profile.tokens,
        coursesCompleted: profile.coursesCompleted,
        category: index % 4 === 0 ? 'blockchain' : index % 4 === 1 ? 'programming' : index % 4 === 2 ? 'design' : 'business',
    }));

    const statsData: StatData[] = [
        {
            title: 'Total Users',
            value: String(2847 + registeredUsers.length),
            change: '+12.5%',
            trend: 'up',
            icon: 'UsersIcon',
            iconBg: 'bg-primary/20'
        },
        {
            title: 'Active Students',
            value: String(2134 + registeredUsers.length),
            change: '+8.2%',
            trend: 'up',
            icon: 'AcademicCapIcon',
            iconBg: 'bg-secondary/20'
        },
        {
            title: 'Course Completions',
            value: String(1456 + registeredUsers.reduce((sum, u) => sum + u.coursesCompleted, 0)),
            change: '+15.3%',
            trend: 'up',
            icon: 'CheckBadgeIcon',
            iconBg: 'bg-accent/20'
        },
        {
            title: 'Tokens Distributed',
            value: `${(3.2 + registeredUsers.reduce((sum, u) => sum + u.tokens, 0) / 1000000).toFixed(1)}M`,
            change: '-2.4%',
            trend: 'down',
            icon: 'CurrencyDollarIcon',
            iconBg: 'bg-warning/20'
        }
    ];

    const mockUsers: User[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_103b528db-1763293982935.png",
            avatarAlt: 'Professional woman with long brown hair in white blouse smiling at camera',
            enrollmentDate: '01/15/2026',
            status: 'active',
            progress: 87,
            tokensEarned: 2450,
            coursesCompleted: 12,
            category: 'blockchain'
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1542cfaf5-1763295130468.png",
            avatarAlt: 'Asian man with short black hair in navy suit with confident expression',
            enrollmentDate: '01/10/2026',
            status: 'active',
            progress: 92,
            tokensEarned: 3120,
            coursesCompleted: 15,
            category: 'programming'
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@example.com',
            avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1623c0903-1763296489854.png",
            avatarAlt: 'Hispanic woman with curly brown hair in casual attire with warm smile',
            enrollmentDate: '01/08/2026',
            status: 'active',
            progress: 65,
            tokensEarned: 1890,
            coursesCompleted: 8,
            category: 'design'
        },
        {
            id: '4',
            name: 'David Kim',
            email: 'david.kim@example.com',
            avatar: "https://images.unsplash.com/photo-1520996188303-e271f0fbaec9",
            avatarAlt: 'Young man with short dark hair in gray sweater looking thoughtful',
            enrollmentDate: '01/05/2026',
            status: 'inactive',
            progress: 34,
            tokensEarned: 780,
            coursesCompleted: 4,
            category: 'business'
        },
        {
            id: '5',
            name: 'Jessica Taylor',
            email: 'jessica.taylor@example.com',
            avatar: "https://images.unsplash.com/photo-1648466982925-65dac4ed0814",
            avatarAlt: 'Woman with blonde hair in professional attire with confident pose',
            enrollmentDate: '12/28/2025',
            status: 'active',
            progress: 78,
            tokensEarned: 2210,
            coursesCompleted: 10,
            category: 'blockchain'
        },
        ...registeredUsersList,
    ];

    const chartData: ChartData[] = [
        { month: 'Jul', registrations: 245, completions: 189 },
        { month: 'Aug', registrations: 312, completions: 234 },
        { month: 'Sep', registrations: 289, completions: 267 },
        { month: 'Oct', registrations: 378, completions: 298 },
        { month: 'Nov', registrations: 423, completions: 356 },
        { month: 'Dec', registrations: 467, completions: 389 },
        { month: 'Jan', registrations: 512 + registeredUsers.length, completions: 423 }
    ];

    const popularCourses: Course[] = [
        {
            id: '1',
            title: 'Blockchain Fundamentals',
            enrollments: 1234,
            completionRate: 87,
            category: 'Blockchain'
        },
        {
            id: '2',
            title: 'Smart Contract Development',
            enrollments: 987,
            completionRate: 82,
            category: 'Blockchain'
        },
        {
            id: '3',
            title: 'Web3 Application Design',
            enrollments: 856,
            completionRate: 79,
            category: 'Design'
        },
        {
            id: '4',
            title: 'DeFi Protocols Explained',
            enrollments: 743,
            completionRate: 75,
            category: 'Blockchain'
        }
    ];

    const tokenMetrics: TokenMetric[] = [
        {
            label: 'Total Distributed',
            value: `${(3.2 + registeredUsers.reduce((sum, u) => sum + u.tokens, 0) / 1000000).toFixed(1)}M`,
            icon: 'ArrowUpCircleIcon',
            color: 'bg-primary'
        },
        {
            label: 'Pending Rewards',
            value: '456K',
            icon: 'ClockIcon',
            color: 'bg-warning'
        },
        {
            label: 'Redeemed Tokens',
            value: '2.1M',
            icon: 'CheckCircleIcon',
            color: 'bg-success'
        },
        {
            label: 'Average per User',
            value: registeredUsers.length > 0
                ? String(Math.floor(registeredUsers.reduce((sum, u) => sum + u.tokens, 0) / registeredUsers.length))
                : '1,124',
            icon: 'UserIcon',
            color: 'bg-secondary'
        }
    ];

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || user.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortColumn) return 0;

        let aValue = a[sortColumn as keyof User];
        let bValue = b[sortColumn as keyof User];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleViewProfile = (userId: string) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const handleManageUser = (userId: string) => {
        const user = mockUsers.find((u) => u.id === userId);
        setToastMessage(`Managing user: ${user?.name}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAddUser = () => {
        setToastMessage('Add User functionality coming soon');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleExportData = () => {
        setToastMessage('Exporting data...');
        setShowToast(true);
        setTimeout(() => {
            setToastMessage('Data exported successfully');
            setTimeout(() => setShowToast(false), 3000);
        }, 1500);
    };

    const handleManageCourses = () => {
        setToastMessage('Redirecting to course management...');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleLogout = () => {
        adminLogout();
        router.push('/');
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                    <div className="h-96 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                {/* Admin Header */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                    <Icon name="ShieldCheckIcon" size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
                                    <p className="font-caption text-sm text-muted-foreground">
                                        Logged in as Administrator
                                    </p>
                                </div>
                            </div>
                            <p className="mt-2 font-caption text-base text-muted-foreground">
                                Manage users, monitor platform performance, and analyze learning metrics
                            </p>
                        </div>
                    </div>

                </div>

                {/* Registered Users Banner */}
                {registeredUsers.length > 0 && (
                    <div className="mb-6 rounded-lg bg-success/10 border border-success/20 p-4">
                        <div className="flex items-center gap-2">
                            <Icon name="UserGroupIcon" size={20} className="text-success" />
                            <span className="font-caption text-sm text-success">
                                {registeredUsers.length} new user{registeredUsers.length > 1 ? 's' : ''} registered via the platform
                            </span>
                        </div>
                    </div>
                )}

                {/* Admin Navigation Tabs */}
                <div className="mb-8 flex items-center gap-2 p-1 bg-muted rounded-lg w-fit overflow-x-auto">
                    <button
                        onClick={() => setActiveAdminTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-caption text-sm font-medium transition-smooth whitespace-nowrap ${activeAdminTab === 'overview'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }`}
                    >
                        <Icon name="ChartBarIcon" size={16} />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveAdminTab('services')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-caption text-sm font-medium transition-smooth whitespace-nowrap ${activeAdminTab === 'services'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }`}
                    >
                        <Icon name="RocketLaunchIcon" size={16} />
                        Hackathons & Courses
                    </button>
                    <button
                        onClick={() => setActiveAdminTab('users')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-caption text-sm font-medium transition-smooth whitespace-nowrap ${activeAdminTab === 'users'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                            }`}
                    >
                        <Icon name="UserGroupIcon" size={16} />
                        Users & Submissions
                    </button>
                </div>

                {/* Tab Content */}
                {activeAdminTab === 'services' && (
                    <div className="mb-8">
                        <CreateServicePanel onServiceCreated={() => {
                            setToastMessage('Service created successfully');
                            setShowToast(true);
                            setTimeout(() => setShowToast(false), 3000);
                        }} />
                    </div>
                )}

                {activeAdminTab === 'overview' && (
                    <>
                        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {statsData.map((stat) => (
                                <StatCard key={stat.title} {...stat} />
                            ))}
                        </div>

                        <div id="analytics" className="mb-8 grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <AnalyticsChart data={chartData} />
                            </div>
                            <div id="tokens" className="space-y-6">
                                <TokenEconomyWidget metrics={tokenMetrics} />
                            </div>
                        </div>

                        <div className="mb-8">
                            <PopularCourses courses={popularCourses} />
                        </div>
                    </>
                )}

                {activeAdminTab === 'users' && (
                    <>
                        {/* Pending Submissions Section - Removed Blockchain Integration */}
                        {/* <PendingSubmissionsSection ... /> */}

                        <div id="users" className="rounded-xl bg-card p-6">
                            <div className="mb-6">
                                <h2 className="font-heading text-2xl font-bold text-foreground">User Management</h2>
                                <p className="mt-1 font-caption text-sm text-muted-foreground">
                                    View and manage all registered users on the platform
                                </p>
                            </div>

                            <div className="mb-6">
                                <FilterControls
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={setSelectedCategory}
                                    selectedStatus={selectedStatus}
                                    onStatusChange={setSelectedStatus}
                                    dateRange={dateRange}
                                    onDateRangeChange={setDateRange}
                                />
                            </div>

                            <div className="overflow-x-auto scrollbar-custom">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="px-6 py-4 text-left">
                                                <button
                                                    onClick={() => handleSort('name')}
                                                    className="flex items-center gap-2 font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground transition-smooth hover:text-foreground focus:outline-none"
                                                >
                                                    User
                                                    <Icon
                                                        name={sortColumn === 'name' && sortDirection === 'desc' ? 'ChevronDownIcon' : 'ChevronUpIcon'}
                                                        size={14}
                                                        className={sortColumn === 'name' ? 'text-primary' : ''}
                                                    />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button
                                                    onClick={() => handleSort('enrollmentDate')}
                                                    className="flex items-center gap-2 font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground transition-smooth hover:text-foreground focus:outline-none"
                                                >
                                                    Enrollment
                                                    <Icon
                                                        name={sortColumn === 'enrollmentDate' && sortDirection === 'desc' ? 'ChevronDownIcon' : 'ChevronUpIcon'}
                                                        size={14}
                                                        className={sortColumn === 'enrollmentDate' ? 'text-primary' : ''}
                                                    />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button
                                                    onClick={() => handleSort('status')}
                                                    className="flex items-center gap-2 font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground transition-smooth hover:text-foreground focus:outline-none"
                                                >
                                                    Status
                                                    <Icon
                                                        name={sortColumn === 'status' && sortDirection === 'desc' ? 'ChevronDownIcon' : 'ChevronUpIcon'}
                                                        size={14}
                                                        className={sortColumn === 'status' ? 'text-primary' : ''}
                                                    />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button
                                                    onClick={() => handleSort('progress')}
                                                    className="flex items-center gap-2 font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground transition-smooth hover:text-foreground focus:outline-none"
                                                >
                                                    Progress
                                                    <Icon
                                                        name={sortColumn === 'progress' && sortDirection === 'desc' ? 'ChevronDownIcon' : 'ChevronUpIcon'}
                                                        size={14}
                                                        className={sortColumn === 'progress' ? 'text-primary' : ''}
                                                    />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button
                                                    onClick={() => handleSort('tokensEarned')}
                                                    className="flex items-center gap-2 font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground transition-smooth hover:text-foreground focus:outline-none"
                                                >
                                                    Tokens
                                                    <Icon
                                                        name={sortColumn === 'tokensEarned' && sortDirection === 'desc' ? 'ChevronDownIcon' : 'ChevronUpIcon'}
                                                        size={14}
                                                        className={sortColumn === 'tokensEarned' ? 'text-primary' : ''}
                                                    />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <span className="font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedUsers.map((user) => (
                                            <UserTableRow
                                                key={user.id}
                                                user={user}
                                                onViewProfile={handleViewProfile}
                                                onManageUser={handleManageUser}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {sortedUsers.length === 0 && (
                                <div className="py-12 text-center">
                                    <Icon name="UserGroupIcon" size={48} className="mx-auto text-muted-foreground" />
                                    <p className="mt-4 font-caption text-sm text-muted-foreground">
                                        No users found matching your filters
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {showToast && (
                <div className="fixed bottom-8 right-8 z-[1030] animate-slide-in">
                    <div className="flex items-center gap-3 rounded-lg bg-card px-6 py-4 shadow-glow-lg">
                        <Icon name="CheckCircleIcon" size={20} className="text-success" />
                        <span className="font-caption text-sm text-foreground">{toastMessage}</span>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-[1040] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative z-[1050] w-full max-w-md rounded-xl bg-card p-6 shadow-glow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-heading text-xl font-bold text-foreground">User Profile</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-md p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <Icon name="XMarkIcon" size={20} />
                            </button>
                        </div>
                        <p className="font-caption text-sm text-muted-foreground">
                            Detailed user profile view coming soon. User ID: {selectedUserId}
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg border border-border bg-card px-4 py-2 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardContent;
