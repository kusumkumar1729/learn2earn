'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Confetti from '@/components/ui/Confetti';

const TransferContent = () => {
    const { userProfile, spendTokens } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [isTransferring, setIsTransferring] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [recentTransfers, setRecentTransfers] = useState<Array<{
        id: number;
        recipient: string;
        amount: number;
        timestamp: string;
    }>>([]);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const showToastMessage = (msg: string, type: 'success' | 'error') => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const validateTransfer = (): string | null => {
        const tokenAmount = parseInt(amount);
        const balance = userProfile?.tokens || 0;

        if (!recipientAddress.trim()) {
            return 'Please enter a recipient wallet address.';
        }

        if (recipientAddress.length < 10) {
            return 'Invalid wallet address. Please enter a valid address.';
        }

        if (!amount || isNaN(tokenAmount)) {
            return 'Please enter a valid token amount.';
        }

        if (tokenAmount < 50) {
            return 'Minimum transferable amount is 50 tokens.';
        }

        if (tokenAmount > 1000) {
            return 'Maximum transferable amount is 1000 tokens.';
        }

        if (tokenAmount > balance) {
            return `Insufficient balance! You have ${balance} tokens available.`;
        }

        return null;
    };

    const handleTransfer = () => {
        const error = validateTransfer();
        if (error) {
            showToastMessage(error, 'error');
            return;
        }

        setIsTransferring(true);

        // Simulate network delay
        setTimeout(() => {
            const tokenAmount = parseInt(amount);
            const success = spendTokens(tokenAmount);

            if (success) {
                // Add to recent transfers
                setRecentTransfers(prev => [{
                    id: Date.now(),
                    recipient: recipientAddress.slice(0, 6) + '...' + recipientAddress.slice(-4),
                    amount: tokenAmount,
                    timestamp: new Date().toLocaleTimeString(),
                }, ...prev.slice(0, 4)]);

                // Clear form
                setRecipientAddress('');
                setAmount('');
                setMessage('');

                // Show success feedback
                showToastMessage(`Successfully transferred ${tokenAmount} EDU tokens!`, 'success');
                setShowConfetti(true);
            } else {
                showToastMessage('Transfer failed. Please try again.', 'error');
            }

            setIsTransferring(false);
        }, 2000);
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="mb-8 h-12 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="h-96 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-border p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-3xl font-bold text-foreground">Transfer Tokens</h1>
                            <p className="mt-2 font-caption text-base text-muted-foreground">
                                Send EDU tokens to other students securely
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-card border border-border px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                                        <Icon name="CurrencyDollarIcon" size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-caption text-sm text-muted-foreground">Available Balance</p>
                                        <p className="font-heading text-2xl font-bold text-primary">{userProfile?.tokens || 0} EDU</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Transfer Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl bg-card border border-border p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                                    <Icon name="ArrowsRightLeftIcon" size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-foreground">Send Tokens</h2>
                                    <p className="font-caption text-sm text-muted-foreground">
                                        Transfer EDU tokens to another wallet
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {/* Recipient Address */}
                                <div>
                                    <label className="mb-2 block font-caption text-sm font-medium text-foreground">
                                        Recipient Wallet Address
                                    </label>
                                    <div className="relative">
                                        <Icon name="UserIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={recipientAddress}
                                            onChange={(e) => setRecipientAddress(e.target.value)}
                                            placeholder="Enter wallet address (e.g., 0x1234...abcd)"
                                            className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                                        />
                                    </div>
                                </div>

                                {/* Token Amount */}
                                <div>
                                    <label className="mb-2 block font-caption text-sm font-medium text-foreground">
                                        Token Amount
                                    </label>
                                    <div className="relative">
                                        <Icon name="CurrencyDollarIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount (50 - 1000)"
                                            min="50"
                                            max="1000"
                                            className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                                        />
                                    </div>
                                    <p className="mt-1 font-caption text-xs text-muted-foreground">
                                        Min: 50 tokens • Max: 1000 tokens
                                    </p>
                                </div>

                                {/* Optional Message */}
                                <div>
                                    <label className="mb-2 block font-caption text-sm font-medium text-foreground">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Add a note to your transfer..."
                                        rows={3}
                                        className="w-full rounded-lg border border-border bg-background p-3 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth resize-none"
                                    />
                                </div>

                                {/* Transfer Button */}
                                <button
                                    onClick={handleTransfer}
                                    disabled={isTransferring}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-caption text-base font-medium text-primary-foreground transition-smooth hover:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isTransferring ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                                            <span>Processing Transfer...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="PaperAirplaneIcon" size={20} />
                                            <span>Send Tokens</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Transfer Rules */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Transfer Rules</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Icon name="CheckCircleIcon" size={16} className="mt-0.5 text-success flex-shrink-0" />
                                    <span className="font-caption text-sm text-muted-foreground">Minimum transfer: 50 tokens</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="CheckCircleIcon" size={16} className="mt-0.5 text-success flex-shrink-0" />
                                    <span className="font-caption text-sm text-muted-foreground">Maximum transfer: 1000 tokens</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="CheckCircleIcon" size={16} className="mt-0.5 text-success flex-shrink-0" />
                                    <span className="font-caption text-sm text-muted-foreground">Transfers are instant</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon name="ShieldCheckIcon" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                                    <span className="font-caption text-sm text-muted-foreground">All transfers are secured</span>
                                </li>
                            </ul>
                        </div>

                        {/* Recent Transfers */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Recent Transfers</h3>
                            {recentTransfers.length > 0 ? (
                                <ul className="space-y-3">
                                    {recentTransfers.map((transfer) => (
                                        <li key={transfer.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                            <div>
                                                <p className="font-mono text-sm text-foreground">{transfer.recipient}</p>
                                                <p className="font-caption text-xs text-muted-foreground">{transfer.timestamp}</p>
                                            </div>
                                            <span className="font-mono text-sm font-bold text-primary">-{transfer.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="font-caption text-sm text-muted-foreground text-center py-4">
                                    No recent transfers
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[1030] animate-slide-in">
                    <div className={`flex items-center gap-3 rounded-lg px-6 py-4 shadow-glow-lg ${toastType === 'success' ? 'bg-card border border-success/20' : 'bg-card border border-error/20'}`}>
                        <Icon
                            name={toastType === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
                            size={20}
                            className={toastType === 'success' ? 'text-success' : 'text-error'}
                        />
                        <span className="font-caption text-sm text-foreground">{toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const TransferPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <TransferContent />
        </ProtectedRoute>
    );
};

export default TransferPage;
