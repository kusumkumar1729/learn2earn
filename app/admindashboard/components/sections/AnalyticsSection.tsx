'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { getAllUserProfiles } from '@/lib/mockDataStore';
import { getAnalyticsSummary, getTransactions, getServices } from '@/lib/adminDataStore';
import { getAllSubmissions, getPendingSubmissions } from '@/lib/activitySubmissionsStore';

const AnalyticsChart = dynamic(() => import('../AnalyticsChart'), {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded-xl bg-muted" />,
});

const AnalyticsSection = () => {
    const [userCount, setUserCount] = useState(0);
    const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);
    const [submissionCount, setSubmissionCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [txCount, setTxCount] = useState(0);
    const [serviceCount, setServiceCount] = useState(0);

    useEffect(() => {
        setUserCount(getAllUserProfiles().length + 2849);
        setAnalytics(getAnalyticsSummary());
        setSubmissionCount(getAllSubmissions().length);
        setPendingCount(getPendingSubmissions().length);
        setTxCount(getTransactions().length);
        setServiceCount(getServices().filter(s => s.active).length);
    }, []);

    const chartData = [
        { month: 'Jul', registrations: 245, completions: 189 },
        { month: 'Aug', registrations: 312, completions: 234 },
        { month: 'Sep', registrations: 289, completions: 267 },
        { month: 'Oct', registrations: 378, completions: 298 },
        { month: 'Nov', registrations: 423, completions: 356 },
        { month: 'Dec', registrations: 467, completions: 389 },
        { month: 'Jan', registrations: 512, completions: 423 },
    ];

    const metricCards = [
        { title: 'Total Students', value: String(userCount), icon: 'UsersIcon', color: 'bg-primary/15 text-primary', change: '+12.5%' },
        { title: 'Tokens Issued', value: `${((analytics?.totalTokensIssued || 0) + 3200).toLocaleString()}`, icon: 'CurrencyDollarIcon', color: 'bg-success/15 text-success', change: '+22%' },
        { title: 'Tokens Spent', value: `${((analytics?.totalTokensSpent || 0) + 2100).toLocaleString()}`, icon: 'ShoppingCartIcon', color: 'bg-warning/15 text-warning', change: '+18%' },
        { title: 'Pending Requests', value: String(pendingCount), icon: 'ClockIcon', color: 'bg-error/15 text-error', change: pendingCount > 0 ? 'Action needed' : 'All clear' },
        { title: 'Active Users', value: String(Math.floor(userCount * 0.75)), icon: 'UserGroupIcon', color: 'bg-secondary/15 text-secondary', change: '+8.2%' },
        { title: 'Total Submissions', value: String(submissionCount), icon: 'InboxIcon', color: 'bg-accent/15 text-accent', change: '+15%' },
        { title: 'Transactions', value: String(txCount), icon: 'ArrowPathIcon', color: 'bg-primary/15 text-primary', change: '+5%' },
        { title: 'Active Services', value: String(serviceCount), icon: 'CubeIcon', color: 'bg-success/15 text-success', change: String(serviceCount) },
    ];

    const categoryBreakdown = [
        { name: 'Academic', percentage: 45, color: 'bg-primary' },
        { name: 'Certification', percentage: 30, color: 'bg-secondary' },
        { name: 'Extracurricular', percentage: 25, color: 'bg-accent' },
    ];

    const topTokenEarners = [
        { name: 'Michael Chen', tokens: 3120, rank: 1 },
        { name: 'Sarah Johnson', tokens: 2450, rank: 2 },
        { name: 'Jessica Taylor', tokens: 2210, rank: 3 },
        { name: 'Emily Rodriguez', tokens: 1890, rank: 4 },
        { name: 'David Kim', tokens: 780, rank: 5 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Analytics</h2>
                <p className="mt-1 font-caption text-sm text-muted-foreground">Comprehensive platform analytics and insights</p>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {metricCards.map((card) => (
                    <div key={card.title} className="rounded-xl bg-card border border-border p-4 hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.color}`}><Icon name={card.icon} size={18} /></div>
                            <span className="font-caption text-[10px] font-medium text-success">{card.change}</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground">{card.value}</h3>
                        <p className="font-caption text-xs text-muted-foreground">{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AnalyticsChart data={chartData} />
                </div>
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="font-heading text-base font-semibold text-foreground mb-4">Submission Categories</h3>
                    <div className="space-y-4">
                        {categoryBreakdown.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-caption text-xs font-medium text-foreground">{cat.name}</span>
                                    <span className="font-caption text-xs text-muted-foreground">{cat.percentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${cat.color} transition-all duration-500`} style={{ width: `${cat.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                        <h4 className="font-caption text-xs font-semibold text-foreground mb-3">Top Token Earners</h4>
                        <div className="space-y-2.5">
                            {topTokenEarners.map((earner) => (
                                <div key={earner.rank} className="flex items-center gap-3">
                                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${earner.rank <= 3 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                                        }`}>{earner.rank}</span>
                                    <span className="font-caption text-xs text-foreground flex-1">{earner.name}</span>
                                    <span className="font-caption text-xs font-semibold text-primary">{earner.tokens}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Health */}
            <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-heading text-base font-semibold text-foreground mb-4">Platform Health</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Uptime', value: '99.9%', icon: 'CheckCircleIcon', status: 'excellent' },
                        { label: 'Avg Response', value: '45ms', icon: 'BoltIcon', status: 'good' },
                        { label: 'Error Rate', value: '0.1%', icon: 'ExclamationCircleIcon', status: 'excellent' },
                        { label: 'Active Connections', value: '342', icon: 'SignalIcon', status: 'good' },
                    ].map(h => (
                        <div key={h.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Icon name={h.icon} size={18} className={h.status === 'excellent' ? 'text-success' : 'text-warning'} />
                            <div>
                                <p className="font-heading text-base font-bold text-foreground">{h.value}</p>
                                <p className="font-caption text-[10px] text-muted-foreground">{h.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
