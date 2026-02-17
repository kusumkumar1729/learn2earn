'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AdminSidebar, { type AdminSection } from './AdminSidebar';
import { getPendingSubmissions } from '@/lib/activitySubmissionsStore';

// Lazy-load every section for optimal performance
const OverviewSection = dynamic(() => import('./sections/OverviewSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const StudentRequestsSection = dynamic(() => import('./sections/StudentRequestsSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const TokenApprovalsSection = dynamic(() => import('./sections/TokenApprovalsSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const NFTCertificatesSection = dynamic(() => import('./sections/NFTCertificatesSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const ServicesManagerSection = dynamic(() => import('./sections/ServicesManagerSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const TransactionsSection = dynamic(() => import('./sections/TransactionsSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const StudentsListSection = dynamic(() => import('./sections/StudentsListSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const AnalyticsSection = dynamic(() => import('./sections/AnalyticsSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});
const SettingsSection = dynamic(() => import('./sections/SettingsSection'), {
    ssr: false,
    loading: () => <SectionSkeleton />,
});

function SectionSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-72 bg-muted rounded" />
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-muted" />
                ))}
            </div>
            <div className="h-80 rounded-xl bg-muted" />
        </div>
    );
}

const AdminDashboardContent = () => {
    const [activeSection, setActiveSection] = useState<AdminSection>('overview');
    const [pendingCount, setPendingCount] = useState(0);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Initialize pending count
    useEffect(() => {
        setPendingCount(getPendingSubmissions().length);
        const handler = () => setPendingCount(getPendingSubmissions().length);
        window.addEventListener('submissionUpdated', handler);
        return () => window.removeEventListener('submissionUpdated', handler);
    }, []);

    const handlePendingCountChange = useCallback((count: number) => {
        setPendingCount(count);
    }, []);

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <OverviewSection />;
            case 'requests': return <StudentRequestsSection onPendingCountChange={handlePendingCountChange} />;
            case 'tokens': return <TokenApprovalsSection />;
            case 'nft': return <NFTCertificatesSection />;
            case 'services': return <ServicesManagerSection />;
            case 'transactions': return <TransactionsSection />;
            case 'students': return <StudentsListSection />;
            case 'analytics': return <AnalyticsSection />;
            case 'settings': return <SettingsSection />;
            default: return <OverviewSection />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                pendingCount={pendingCount}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(prev => !prev)}
            />

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
                    } pb-20 lg:pb-8`}
            >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardContent;
