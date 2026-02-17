'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
    getAllSubmissions,
    getPendingSubmissions,
    approveSubmission,
    rejectSubmission,
    type ActivitySubmission,
} from '@/lib/activitySubmissionsStore';
import { addTokensToUser } from '@/lib/mockDataStore';
import { addTransaction, TOKEN_REWARD_MAP } from '@/lib/adminDataStore';

interface StudentRequestsSectionProps {
    onPendingCountChange: (count: number) => void;
}

const StudentRequestsSection = ({ onPendingCountChange }: StudentRequestsSectionProps) => {
    const [submissions, setSubmissions] = useState<ActivitySubmission[]>([]);
    const [pending, setPending] = useState<ActivitySubmission[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'redeemed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; submission: ActivitySubmission } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const loadData = useCallback(() => {
        const all = getAllSubmissions();
        const pend = getPendingSubmissions();
        setSubmissions(all);
        setPending(pend);
        onPendingCountChange(pend.length);
    }, [onPendingCountChange]);

    useEffect(() => {
        loadData();
        const handler = () => loadData();
        window.addEventListener('submissionUpdated', handler);
        return () => window.removeEventListener('submissionUpdated', handler);
    }, [loadData]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleApprove = async (sub: ActivitySubmission) => {
        setProcessingId(`${sub.activityId}_${sub.studentId}`);
        try {
            // Simulate blockchain delay
            await new Promise(resolve => setTimeout(resolve, 1200));

            const success = approveSubmission(sub.activityId, sub.studentId);
            if (success) {
                // Credit tokens to student
                addTokensToUser(sub.studentId, sub.tokens);

                // Record transaction
                addTransaction({
                    type: 'reward',
                    from: 'Treasury',
                    to: sub.studentId.slice(0, 8) + '...',
                    amount: sub.tokens,
                    status: 'completed',
                    description: `Approved: ${sub.activityTitle} by ${sub.studentName}`,
                });

                showToast(`Approved ${sub.activityTitle} for ${sub.studentName} (+${sub.tokens} tokens)`, 'success');
                loadData();
            }
        } catch {
            showToast('Failed to approve request', 'error');
        } finally {
            setProcessingId(null);
            setShowConfirmModal(false);
            setConfirmAction(null);
        }
    };

    const handleReject = async (sub: ActivitySubmission) => {
        setProcessingId(`${sub.activityId}_${sub.studentId}`);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const success = rejectSubmission(sub.activityId, sub.studentId);
            if (success) {
                showToast(`Rejected ${sub.activityTitle} for ${sub.studentName}`, 'error');
                loadData();
            }
        } catch {
            showToast('Failed to reject request', 'error');
        } finally {
            setProcessingId(null);
            setShowConfirmModal(false);
            setConfirmAction(null);
        }
    };

    const openConfirm = (type: 'approve' | 'reject', submission: ActivitySubmission) => {
        setConfirmAction({ type, submission });
        setShowConfirmModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-warning/15 text-warning border-warning/20';
            case 'approved': return 'bg-success/15 text-success border-success/20';
            case 'redeemed': return 'bg-primary/15 text-primary border-primary/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getRewardForTask = (title: string) => {
        const config = TOKEN_REWARD_MAP.find(t => title.toLowerCase().includes(t.taskType.toLowerCase()));
        return config?.icon || 'CurrencyDollarIcon';
    };

    const filteredSubmissions = submissions
        .filter(s => filter === 'all' || s.status === filter)
        .filter(s =>
            searchQuery === '' ||
            s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const paginatedSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Student Requests</h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">
                        Review and approve student task submissions for token rewards
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20">
                        <Icon name="ClockIcon" size={16} className="text-warning" />
                        <span className="font-caption text-sm font-medium text-warning">{pending.length} Pending</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    {(['all', 'pending', 'approved', 'redeemed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium transition-smooth capitalize ${filter === f
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f} {f === 'pending' && pending.length > 0 && `(${pending.length})`}
                            {f === 'all' && `(${submissions.length})`}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                    <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Search by student or task..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                </div>
            </div>

            {/* Empty State */}
            {filteredSubmissions.length === 0 && (
                <div className="rounded-xl bg-card border border-border p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Icon name="InboxIcon" size={28} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">No Requests Found</h3>
                    <p className="font-caption text-sm text-muted-foreground">
                        {filter === 'pending'
                            ? 'No pending student requests. All caught up!'
                            : 'No submissions match your search criteria.'
                        }
                    </p>
                </div>
            )}

            {/* Requests Table */}
            {filteredSubmissions.length > 0 && (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Student</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Task Type</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Reward</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Proof</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Submitted</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-5 py-3.5 text-center font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {paginatedSubmissions.map((sub) => {
                                    const isProcessing = processingId === `${sub.activityId}_${sub.studentId}`;
                                    return (
                                        <tr key={`${sub.activityId}_${sub.studentId}`} className="hover:bg-muted/20 transition-smooth">
                                            {/* Student */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                        <span className="text-sm font-bold text-primary">
                                                            {sub.studentName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-caption text-sm font-medium text-foreground">{sub.studentName}</p>
                                                        <p className="font-caption text-xs text-muted-foreground">{sub.studentEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Task Type */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Icon name={getRewardForTask(sub.activityTitle)} size={16} className="text-primary" />
                                                    <span className="font-caption text-sm text-foreground">{sub.activityTitle}</span>
                                                </div>
                                            </td>
                                            {/* Reward */}
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-caption text-xs font-semibold">
                                                    <Icon name="CurrencyDollarIcon" size={14} />
                                                    +{sub.tokens}
                                                </span>
                                            </td>
                                            {/* Proof */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        name={sub.proofType === 'file' ? 'DocumentIcon' : sub.proofType === 'link' ? 'LinkIcon' : 'DocumentIcon'}
                                                        size={14} className="text-muted-foreground"
                                                    />
                                                    <span className="font-caption text-xs text-muted-foreground truncate max-w-[150px]">
                                                        {sub.proofValue || 'Submitted'}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Submitted */}
                                            <td className="px-5 py-4">
                                                <span className="font-caption text-xs text-muted-foreground">
                                                    {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </span>
                                            </td>
                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(sub.status)}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {sub.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => openConfirm('approve', sub)}
                                                                disabled={isProcessing}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 font-caption text-xs font-medium transition-smooth disabled:opacity-50"
                                                            >
                                                                {isProcessing ? (
                                                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-success border-t-transparent" />
                                                                ) : (
                                                                    <Icon name="CheckCircleIcon" size={14} />
                                                                )}
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => openConfirm('reject', sub)}
                                                                disabled={isProcessing}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/15 text-error hover:bg-error/25 font-caption text-xs font-medium transition-smooth disabled:opacity-50"
                                                            >
                                                                <Icon name="XMarkIcon" size={14} />
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="font-caption text-xs text-muted-foreground italic">
                                                            {sub.status === 'approved' ? 'Approved ✓' : 'Tokens redeemed'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
                            <span className="font-caption text-xs text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-smooth"
                                >
                                    <Icon name="ChevronLeftIcon" size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`h-7 w-7 rounded-md font-caption text-xs font-medium transition-smooth ${currentPage === page
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-smooth"
                                >
                                    <Icon name="ChevronRightIcon" size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Token Reward Reference */}
            <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Token Reward Reference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {TOKEN_REWARD_MAP.map((t) => (
                        <div key={t.taskType} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/50">
                            <Icon name={t.icon} size={18} className="text-primary shrink-0" />
                            <div className="min-w-0">
                                <p className="font-caption text-xs font-medium text-foreground truncate">{t.taskType}</p>
                                <p className="font-caption text-[10px] text-success font-semibold">+{t.reward} tokens</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && confirmAction && (
                <div className="fixed inset-0 z-[1040] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
                    <div className="relative z-[1050] w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-glow-lg animate-scale-in">
                        <div className="text-center mb-6">
                            <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${confirmAction.type === 'approve' ? 'bg-success/15' : 'bg-error/15'
                                }`}>
                                <Icon
                                    name={confirmAction.type === 'approve' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
                                    size={28}
                                    className={confirmAction.type === 'approve' ? 'text-success' : 'text-error'}
                                />
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground">
                                {confirmAction.type === 'approve' ? 'Approve Request' : 'Reject Request'}
                            </h3>
                            <p className="mt-2 font-caption text-sm text-muted-foreground">
                                {confirmAction.type === 'approve'
                                    ? `Award +${confirmAction.submission.tokens} tokens to ${confirmAction.submission.studentName} for "${confirmAction.submission.activityTitle}"?`
                                    : `Reject "${confirmAction.submission.activityTitle}" submitted by ${confirmAction.submission.studentName}? The student will be able to resubmit.`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-caption text-sm font-medium hover:bg-muted transition-smooth"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmAction.type === 'approve') {
                                        handleApprove(confirmAction.submission);
                                    } else {
                                        handleReject(confirmAction.submission);
                                    }
                                }}
                                disabled={!!processingId}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-caption text-sm font-medium transition-smooth disabled:opacity-60 ${confirmAction.type === 'approve'
                                        ? 'bg-success text-white hover:bg-success/90'
                                        : 'bg-error text-white hover:bg-error/90'
                                    }`}
                            >
                                {processingId ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : null}
                                {confirmAction.type === 'approve' ? 'Approve & Mint' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-8 right-8 z-[1060] animate-slide-in">
                    <div className={`flex items-center gap-3 rounded-lg px-5 py-3 shadow-glow-lg border ${toast.type === 'success' ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'
                        }`}>
                        <Icon
                            name={toast.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
                            size={18}
                            className={toast.type === 'success' ? 'text-success' : 'text-error'}
                        />
                        <span className="font-caption text-sm text-foreground">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRequestsSection;
