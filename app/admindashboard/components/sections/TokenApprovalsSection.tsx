'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
    getAllSubmissions,
    approveSubmission,
    rejectSubmission,
    type ActivitySubmission,
} from '@/lib/activitySubmissionsStore';
import { addTokensToUser } from '@/lib/mockDataStore';
import { addTransaction, TOKEN_REWARD_MAP } from '@/lib/adminDataStore';

const TokenApprovalsSection = () => {
    const [submissions, setSubmissions] = useState<ActivitySubmission[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadData = useCallback(() => {
        setSubmissions(getAllSubmissions().filter(s => s.status === 'pending' || s.status === 'approved'));
    }, []);

    useEffect(() => {
        loadData();
        const handler = () => loadData();
        window.addEventListener('submissionUpdated', handler);
        return () => window.removeEventListener('submissionUpdated', handler);
    }, [loadData]);

    const handleBulkApprove = async () => {
        const pendingItems = submissions.filter(s => s.status === 'pending');
        for (const sub of pendingItems) {
            approveSubmission(sub.activityId, sub.studentId);
            addTokensToUser(sub.studentId, sub.tokens);
            addTransaction({
                type: 'reward', from: 'Treasury', to: sub.studentId.slice(0, 8) + '...',
                amount: sub.tokens, status: 'completed', description: `Bulk approved: ${sub.activityTitle}`,
            });
        }
        setToast({ message: `Approved ${pendingItems.length} requests`, type: 'success' });
        setTimeout(() => setToast(null), 3000);
        loadData();
    };

    const handleApprove = async (sub: ActivitySubmission) => {
        setProcessingId(`${sub.activityId}_${sub.studentId}`);
        await new Promise(r => setTimeout(r, 800));
        approveSubmission(sub.activityId, sub.studentId);
        addTokensToUser(sub.studentId, sub.tokens);
        addTransaction({
            type: 'reward', from: 'Treasury', to: sub.studentId.slice(0, 8) + '...',
            amount: sub.tokens, status: 'completed', description: `Approved: ${sub.activityTitle}`,
        });
        setToast({ message: `+${sub.tokens} tokens sent to ${sub.studentName}`, type: 'success' });
        setTimeout(() => setToast(null), 3000);
        setProcessingId(null);
        loadData();
    };

    const handleReject = async (sub: ActivitySubmission) => {
        setProcessingId(`${sub.activityId}_${sub.studentId}`);
        await new Promise(r => setTimeout(r, 500));
        rejectSubmission(sub.activityId, sub.studentId);
        setToast({ message: `Rejected: ${sub.activityTitle}`, type: 'error' });
        setTimeout(() => setToast(null), 3000);
        setProcessingId(null);
        loadData();
    };

    const categories = ['all', ...new Set(TOKEN_REWARD_MAP.map(t => t.category))];
    const filteredSubmissions = selectedCategory === 'all'
        ? submissions
        : submissions.filter(s => {
            const config = TOKEN_REWARD_MAP.find(t => s.activityTitle.toLowerCase().includes(t.taskType.toLowerCase()));
            return config?.category === selectedCategory;
        });

    const pendingCount = submissions.filter(s => s.status === 'pending').length;
    const totalPendingTokens = submissions.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.tokens, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Token Approvals</h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">Manage token distribution and reward approvals</p>
                </div>
                {pendingCount > 0 && (
                    <button
                        onClick={handleBulkApprove}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success text-white font-caption text-sm font-medium hover:bg-success/90 transition-smooth"
                    >
                        <Icon name="CheckCircleIcon" size={16} />
                        Approve All ({pendingCount})
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-card border border-border p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
                            <Icon name="ClockIcon" size={20} className="text-warning" />
                        </div>
                        <div>
                            <p className="font-heading text-xl font-bold text-foreground">{pendingCount}</p>
                            <p className="font-caption text-xs text-muted-foreground">Pending Approvals</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-card border border-border p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                            <Icon name="CurrencyDollarIcon" size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="font-heading text-xl font-bold text-foreground">{totalPendingTokens}</p>
                            <p className="font-caption text-xs text-muted-foreground">Tokens to Mint</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-card border border-border p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
                            <Icon name="CheckCircleIcon" size={20} className="text-success" />
                        </div>
                        <div>
                            <p className="font-heading text-xl font-bold text-foreground">{submissions.filter(s => s.status === 'approved').length}</p>
                            <p className="font-caption text-xs text-muted-foreground">Already Approved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg font-caption text-xs font-medium capitalize whitespace-nowrap transition-smooth ${selectedCategory === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Token Cards */}
            {filteredSubmissions.length === 0 ? (
                <div className="rounded-xl bg-card border border-border p-12 text-center">
                    <Icon name="CurrencyDollarIcon" size={40} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">No Token Requests</h3>
                    <p className="font-caption text-sm text-muted-foreground mt-1">No pending token approvals in this category.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredSubmissions.map((sub) => {
                        const isProcessing = processingId === `${sub.activityId}_${sub.studentId}`;
                        return (
                            <div key={`${sub.activityId}_${sub.studentId}`} className="rounded-xl bg-card border border-border p-4 hover:border-primary/30 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                            <span className="text-xs font-bold text-primary">{sub.studentName.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-caption text-sm font-medium text-foreground">{sub.studentName}</p>
                                            <p className="font-caption text-[10px] text-muted-foreground">{sub.studentEmail}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-caption text-xs font-semibold">
                                        +{sub.tokens}
                                    </span>
                                </div>
                                <p className="font-caption text-xs text-foreground mb-1">{sub.activityTitle}</p>
                                <p className="font-caption text-[10px] text-muted-foreground mb-3">
                                    {new Date(sub.submittedAt).toLocaleDateString()}
                                </p>
                                {sub.status === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(sub)}
                                            disabled={isProcessing}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-success/15 text-success hover:bg-success/25 font-caption text-xs font-medium transition-smooth disabled:opacity-50"
                                        >
                                            {isProcessing ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-success border-t-transparent" /> : <Icon name="CheckCircleIcon" size={14} />}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(sub)}
                                            disabled={isProcessing}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-error/15 text-error hover:bg-error/25 font-caption text-xs font-medium transition-smooth disabled:opacity-50"
                                        >
                                            <Icon name="XMarkIcon" size={14} />
                                            Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 justify-center py-2 text-success">
                                        <Icon name="CheckCircleIcon" size={14} />
                                        <span className="font-caption text-xs font-medium">Approved</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && (
                <div className="fixed bottom-8 right-8 z-[1060] animate-slide-in">
                    <div className={`flex items-center gap-3 rounded-lg px-5 py-3 shadow-glow-lg border ${toast.type === 'success' ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'
                        }`}>
                        <Icon name={toast.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} size={18} className={toast.type === 'success' ? 'text-success' : 'text-error'} />
                        <span className="font-caption text-sm text-foreground">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenApprovalsSection;
