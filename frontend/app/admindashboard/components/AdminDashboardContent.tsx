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
import { useAuth } from '@/contexts/AuthContext';
import { getAllUserProfiles, UserProfile } from '@/lib/mockDataStore';

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
    const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);

    useEffect(() => {
        setIsHydrated(true);
        // Load registered users from mock store
        const users = getAllUserProfiles();
        setRegisteredUsers(users);
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
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleAddUser}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <Icon name="PlusIcon" size={18} />
                                Add User
                            </button>
                            <button
                                onClick={handleExportData}
                                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <Icon name="ArrowDownTrayIcon" size={18} />
                                Export Data
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg border border-error/50 bg-card px-4 py-2.5 font-caption text-sm font-medium text-error transition-smooth hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <Icon name="ArrowRightOnRectangleIcon" size={18} />
                                Logout
                            </button>
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

                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="mb-8 grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <AnalyticsChart data={chartData} />
                    </div>
                    <div className="space-y-6">
                        <TokenEconomyWidget metrics={tokenMetrics} />
                    </div>
                </div>

                <div className="mb-8">
                    <PopularCourses courses={popularCourses} />
                </div>

                <div className="rounded-xl bg-card p-6">
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
