'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { getAllUserProfiles } from '@/lib/mockDataStore';
import { getAnalyticsSummary } from '@/lib/adminDataStore';
import { getPendingSubmissions, getAllSubmissions } from '@/lib/activitySubmissionsStore';

const AnalyticsChart = dynamic(() => import('../AnalyticsChart'), {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded-xl bg-muted" />,
});

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    color: string;
}

const StatCard = ({ title, value, change, trend, icon, color }: StatCardProps) => (
    <div className="group rounded-xl bg-card border border-border p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-glow-sm">
        <div className="flex items-start justify-between mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon name={icon} size={20} />
            </div>
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                <Icon name={trend === 'up' ? 'ArrowUpTrayIcon' : 'ArrowDownTrayIcon'} size={12} />
                {change}
            </span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-foreground">{value}</h3>
        <p className="mt-1 font-caption text-xs text-muted-foreground">{title}</p>
    </div>
);

interface ChartData {
    month: string;
    registrations: number;
    completions: number;
}

const OverviewSection = () => {
    const [users, setUsers] = useState<ReturnType<typeof getAllUserProfiles>>([]);
    const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [totalSubmissions, setTotalSubmissions] = useState(0);

    useEffect(() => {
        setUsers(getAllUserProfiles());
        setAnalytics(getAnalyticsSummary());
        setPendingCount(getPendingSubmissions().length);
        setTotalSubmissions(getAllSubmissions().length);
    }, []);

    const stats: StatCardProps[] = [
        { title: 'Total Students', value: String(2849 + users.length), change: '+12.5%', trend: 'up', icon: 'UsersIcon', color: 'bg-primary/15 text-primary' },
        { title: 'Active Students', value: String(2136 + users.length), change: '+8.2%', trend: 'up', icon: 'AcademicCapIcon', color: 'bg-secondary/15 text-secondary' },
        { title: 'Tokens Distributed', value: `${((analytics?.totalTokensIssued || 0) / 1000 + 3.2).toFixed(1)}K`, change: '+15.3%', trend: 'up', icon: 'CurrencyDollarIcon', color: 'bg-accent/15 text-accent' },
        { title: 'Pending Requests', value: String(pendingCount), change: pendingCount > 0 ? `${pendingCount} new` : '0', trend: pendingCount > 0 ? 'up' : 'down', icon: 'ClockIcon', color: 'bg-warning/15 text-warning' },
        { title: 'Total Submissions', value: String(totalSubmissions), change: '+22%', trend: 'up', icon: 'InboxIcon', color: 'bg-success/15 text-success' },
        { title: 'NFTs Issued', value: String(analytics?.totalNFTs || 4), change: '+3', trend: 'up', icon: 'SparklesIcon', color: 'bg-primary/15 text-primary' },
    ];

    const chartData: ChartData[] = [
        { month: 'Jul', registrations: 245, completions: 189 },
        { month: 'Aug', registrations: 312, completions: 234 },
        { month: 'Sep', registrations: 289, completions: 267 },
        { month: 'Oct', registrations: 378, completions: 298 },
        { month: 'Nov', registrations: 423, completions: 356 },
        { month: 'Dec', registrations: 467, completions: 389 },
        { month: 'Jan', registrations: 512 + users.length, completions: 423 },
    ];

    const recentActivity = [
        { icon: 'CheckCircleIcon', text: 'Student Sarah Johnson approved for Attendance', time: '2 min ago', color: 'text-success' },
        { icon: 'UserPlusIcon', text: 'New student registered: alex.w@campus.edu', time: '15 min ago', color: 'text-primary' },
        { icon: 'CurrencyDollarIcon', text: '+200 tokens minted for CGPA milestone', time: '1 hour ago', color: 'text-accent' },
        { icon: 'SparklesIcon', text: 'NFT certificate issued to Michael Chen', time: '3 hours ago', color: 'text-secondary' },
        { icon: 'InboxIcon', text: 'New submission: Assignment proof from Emily R.', time: '5 hours ago', color: 'text-warning' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Dashboard Overview</h2>
                <p className="mt-1 font-caption text-sm text-muted-foreground">
                    Platform performance at a glance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Chart + Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AnalyticsChart data={chartData} />
                </div>
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="font-heading text-base font-semibold text-foreground mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="mt-0.5 shrink-0">
                                    <Icon name={item.icon} size={16} className={item.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-caption text-xs text-foreground">{item.text}</p>
                                    <p className="font-caption text-[10px] text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Token Economy Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Distributed', value: `${((analytics?.totalTokensIssued || 0) / 1000 + 3.2).toFixed(1)}K`, icon: 'ArrowUpTrayIcon', color: 'bg-primary' },
                    { label: 'Pending Rewards', value: `${pendingCount * 75}`, icon: 'ClockIcon', color: 'bg-warning' },
                    { label: 'Redeemed Tokens', value: `${((analytics?.totalTokensSpent || 0) / 1000 + 2.1).toFixed(1)}K`, icon: 'CheckCircleIcon', color: 'bg-success' },
                    { label: 'Active Services', value: String(analytics?.activeServices || 4), icon: 'CubeIcon', color: 'bg-secondary' },
                ].map((metric) => (
                    <div key={metric.label} className="flex items-center gap-4 rounded-xl bg-card border border-border p-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.color}/15`}>
                            <Icon name={metric.icon} size={20} className={`${metric.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                            <p className="font-heading text-lg font-bold text-foreground">{metric.value}</p>
                            <p className="font-caption text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverviewSection;
