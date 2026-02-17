'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Confetti from '@/components/ui/Confetti';
import { getActivityStatus, redeemActivity, type SubmissionStatus } from '@/lib/activitySubmissionsStore';

interface TokenActivity {
    id: number;
    title: string;
    description: string;
    tokens: number;
    icon: string;
    category: 'academic' | 'extracurricular' | 'certification';
}

interface TokenUse {
    id: number;
    title: string;
    description: string;
    tokenCost: string;
    icon: string;
    category: 'events' | 'benefits' | 'career';
}

interface RedeemableItem {
    id: number;
    title: string;
    description: string;
    tokenCost: number;
    icon: string;
    image: string;
    category: 'service' | 'merchandise' | 'event';
}

const EarnTokensContent = () => {
    const { user, userProfile, earnTokens, spendTokens } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [activeSection, setActiveSection] = useState<'earn' | 'assign' | 'use' | 'funding' | 'redeem'>('earn');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [showConfetti, setShowConfetti] = useState(false);
    const [redeemedItems, setRedeemedItems] = useState<number[]>([]);
    const [isRedeeming, setIsRedeeming] = useState<number | null>(null);
    const [earnedActivities, setEarnedActivities] = useState<number[]>([]);
    const [isEarningActivity, setIsEarningActivity] = useState<number | null>(null);
    const [totalEarned, setTotalEarned] = useState(0);

    // Mock State
    const isConnected = true;

    // Calculate display balance
    const displayBalance = userProfile?.tokens || 1250;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const earnActivities: TokenActivity[] = [
        { id: 1, title: 'Attendance', description: 'Maintain 90%+ attendance each month', tokens: 50, icon: 'CalendarDaysIcon', category: 'academic' },
        { id: 2, title: 'Assignments', description: 'Submit assignments on time with good grades', tokens: 25, icon: 'DocumentCheckIcon', category: 'academic' },
        { id: 3, title: 'CGPA Milestones', description: 'Achieve CGPA of 8.0, 8.5, 9.0, 9.5+', tokens: 200, icon: 'ChartBarIcon', category: 'academic' },
        { id: 4, title: 'Semester Completion', description: 'Successfully complete each semester', tokens: 100, icon: 'AcademicCapIcon', category: 'academic' },
        { id: 5, title: 'Record Submissions', description: 'Submit lab records and project documentation', tokens: 30, icon: 'FolderIcon', category: 'academic' },
        { id: 6, title: 'Course Completions', description: 'Complete online courses and certifications', tokens: 75, icon: 'BookOpenIcon', category: 'certification' },
        { id: 7, title: 'Certifications', description: 'Earn verified industry certifications', tokens: 150, icon: 'CheckBadgeIcon', category: 'certification' },
        { id: 8, title: 'Technical Activities', description: 'Participate in coding contests, workshops', tokens: 100, icon: 'CodeBracketIcon', category: 'extracurricular' },
        { id: 9, title: 'Cultural Activities', description: 'Participate in cultural fests and events', tokens: 50, icon: 'MusicalNoteIcon', category: 'extracurricular' },
        { id: 10, title: 'Extracurricular', description: 'Sports, clubs, volunteer activities', tokens: 40, icon: 'UserGroupIcon', category: 'extracurricular' },
        { id: 11, title: 'NFT Certificates', description: 'Receive NFT tokens for verified achievements', tokens: 250, icon: 'SparklesIcon', category: 'certification' },
    ];

    const tokenUses: TokenUse[] = [
        { id: 1, title: 'Hackathon Participation', description: 'Join exclusive hackathons and competitions', tokenCost: '100-500', icon: 'TrophyIcon', category: 'events' },
        { id: 2, title: 'Canteen Discounts', description: 'Get discounts at university canteen', tokenCost: '10-50', icon: 'CakeIcon', category: 'benefits' },
        { id: 3, title: 'Event Tickets', description: 'Book tickets for fests and events', tokenCost: '50-200', icon: 'TicketIcon', category: 'events' },
        { id: 4, title: 'University Merchandise', description: 'T-shirts, hoodies, notebooks with college logo', tokenCost: '100-300', icon: 'ShoppingBagIcon', category: 'benefits' },
        { id: 5, title: 'Workshop Voting', description: 'Vote for topics in upcoming workshops', tokenCost: '10-25', icon: 'HandRaisedIcon', category: 'events' },
        { id: 6, title: 'Resume Reviews', description: 'Get professional resume feedback', tokenCost: '75-150', icon: 'DocumentTextIcon', category: 'career' },
        { id: 7, title: 'T&P Training Programs', description: 'Access placement training sessions', tokenCost: '200-500', icon: 'BriefcaseIcon', category: 'career' },
        { id: 8, title: 'Workshops & Bootcamps', description: 'Enroll in skill-building workshops', tokenCost: '150-400', icon: 'RocketLaunchIcon', category: 'career' },
    ];

    const fundingSources = [
        { title: 'Google Ads Placements', description: 'Non-intrusive ads on platform pages generate revenue', icon: 'CursorArrowRaysIcon' },
        { title: 'Institutional Sponsorships', description: 'University and college partnerships fund the ecosystem', icon: 'BuildingOfficeIcon' },
        { title: 'Student Club Partnerships', description: 'Collaborations with tech and cultural clubs', icon: 'UserGroupIcon' },
        { title: 'Small Operational Budget', description: 'Minimal overhead keeps the system sustainable', icon: 'CalculatorIcon' },
        { title: 'Promotions & Brand Collaborations', description: 'Educational tool and service promotions', icon: 'MegaphoneIcon' },
    ];

    const redeemableItems: RedeemableItem[] = [
        { id: 1, title: 'Resume Review', description: 'Get professional feedback on your resume from HR experts', tokenCost: 75, icon: 'DocumentTextIcon', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4', category: 'service' },
        { id: 2, title: 'Workshop Access', description: 'One-time access to any premium workshop', tokenCost: 100, icon: 'AcademicCapIcon', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', category: 'service' },
        { id: 3, title: 'Hackathon Entry', description: 'Free entry to the next university hackathon', tokenCost: 150, icon: 'TrophyIcon', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', category: 'event' },
        { id: 4, title: 'University Hoodie', description: 'Premium quality hoodie with college branding', tokenCost: 250, icon: 'ShoppingBagIcon', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', category: 'merchandise' },
        { id: 5, title: 'Canteen Voucher', description: '₹100 voucher for university canteen', tokenCost: 50, icon: 'CakeIcon', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326', category: 'merchandise' },
        { id: 6, title: 'Mock Interview', description: '30-minute mock interview with industry expert', tokenCost: 125, icon: 'VideoCameraIcon', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', category: 'service' },
        { id: 7, title: 'Fest Pass', description: 'VIP pass for annual college fest', tokenCost: 175, icon: 'TicketIcon', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', category: 'event' },
        { id: 8, title: 'Branded Notebook', description: 'Premium notebook with Learn2Earn branding', tokenCost: 60, icon: 'BookOpenIcon', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57', category: 'merchandise' },
    ];

    // Get activity status for current user
    const getStatus = (activityId: number): SubmissionStatus => {
        if (!user) return 'not_submitted';
        return getActivityStatus(activityId, user.uid);
    };

    // Refresh submissions when section changes
    const [, setRefreshKey] = useState(0);
    useEffect(() => {
        // Force refresh when earn section becomes active
        if (activeSection === 'earn') {
            setRefreshKey(prev => prev + 1);
        }
    }, [activeSection]);

    // Handle redeeming approved tokens
    // Handle redeeming approved tokens
    const handleRedeemActivity = async (activity: TokenActivity) => {
        if (!user) return;

        // Mock blockchain request for "Official" feeling
        if (isConnected) {
            // Proceed to fallback or simulate "pending"
        }

        // Fallback to localStorage logic for demo/unconnected state
        const status = getStatus(activity.id);
        if (status !== 'approved') {
            showToastMessage('This activity is not approved for redemption yet.', 'error');
            return;
        }

        if (activity.tokens < 50) {
            showToastMessage('Minimum redeemable amount is 50 EDU tokens.', 'error');
            return;
        }

        setIsEarningActivity(activity.id);

        setTimeout(() => {
            const redeemSuccess = redeemActivity(activity.id, user.uid);
            if (redeemSuccess) {
                const earnSuccess = earnTokens(activity.tokens);
                if (earnSuccess) {
                    setEarnedActivities(prev => [...prev, activity.id]);
                    setTotalEarned(prev => prev + activity.tokens);
                    showToastMessage(`Tokens earned successfully! +${activity.tokens} EDU for ${activity.title}`, 'success');
                    setShowConfetti(true);
                    setRefreshKey(prev => prev + 1); // Refresh to show updated status
                } else {
                    showToastMessage('Failed to earn tokens. Please try again.', 'error');
                }
            } else {
                showToastMessage('Failed to redeem activity. Please try again.', 'error');
            }
            setIsEarningActivity(null);
        }, 1500);
    };

    // Handle redeeming items
    const handleRedeem = async (item: RedeemableItem) => {
        if (redeemedItems.includes(item.id)) {
            showToastMessage('You have already redeemed this item!', 'error');
            return;
        }

        // Fallback Local Storage Logic
        const balance = userProfile?.tokens || 0;
        if (balance < item.tokenCost) {
            showToastMessage(`Insufficient tokens! You need ${item.tokenCost} tokens.`, 'error');
            return;
        }

        setIsRedeeming(item.id);

        setTimeout(() => {
            const success = spendTokens(item.tokenCost);
            if (success) {
                setRedeemedItems(prev => [...prev, item.id]);
                showToastMessage(`Redeemed successfully! -${item.tokenCost} EDU for ${item.title}`, 'success');
                setShowConfetti(true);
            } else {
                showToastMessage('Redemption failed. Please try again.', 'error');
            }
            setIsRedeeming(null);
        }, 1500);
    };

    const getRedeemCategoryColor = (category: string) => {
        switch (category) {
            case 'service': return 'bg-primary/20 text-primary';
            case 'merchandise': return 'bg-accent/20 text-accent';
            case 'event': return 'bg-warning/20 text-warning';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const showToastMessage = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="mb-8 h-12 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'academic': return 'bg-secondary/20 text-secondary';
            case 'certification': return 'bg-primary/20 text-primary';
            case 'extracurricular': return 'bg-accent/20 text-accent';
            case 'events': return 'bg-warning/20 text-warning';
            case 'benefits': return 'bg-success/20 text-success';
            case 'career': return 'bg-secondary/20 text-secondary';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-3xl font-bold text-foreground">Earn & Use Tokens</h1>
                            <p className="mt-2 font-caption text-base text-muted-foreground">
                                Earn tokens through academic achievements and campus activities
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-card border border-border px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                                        <Icon name="CurrencyDollarIcon" size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-caption text-sm text-muted-foreground">Your Balance</p>
                                        <p className="font-heading text-2xl font-bold text-primary">{displayBalance} EDU</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {[
                        { id: 'earn', label: 'Earn Tokens', icon: 'SparklesIcon' },
                        { id: 'assign', label: 'How Tokens are Assigned', icon: 'ShieldCheckIcon' },
                        { id: 'use', label: 'Use Your Tokens', icon: 'GiftIcon' },
                        { id: 'redeem', label: 'Redeem Tokens', icon: 'ShoppingCartIcon' },
                        { id: 'funding', label: 'Ecosystem Funding', icon: 'BanknotesIcon' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as typeof activeSection)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-caption text-sm font-medium transition-smooth ${activeSection === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon name={tab.icon} size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Earn Tokens Section */}
                {activeSection === 'earn' && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="mb-2 font-heading text-xl font-bold text-foreground">Student Activities</h2>
                            <p className="mb-6 font-caption text-sm text-muted-foreground">
                                Complete these activities to earn L2E tokens that you can redeem for exciting rewards
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {earnActivities.map((activity) => {
                                    const status = getStatus(activity.id);
                                    const isBelow50 = activity.tokens < 50;
                                    const isProcessing = isEarningActivity === activity.id;
                                    const isRedeemed = status === 'redeemed';
                                    const isPending = status === 'pending';
                                    const isApproved = status === 'approved';

                                    return (
                                        <div
                                            key={activity.id}
                                            className={`group rounded-lg border bg-card/50 p-4 transition-smooth ${isRedeemed ? 'border-success/30 bg-success/5' : isPending ? 'border-warning/30 bg-warning/5' : isApproved ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/50 hover:shadow-glow-sm'}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${isRedeemed ? 'bg-success/20' : isPending ? 'bg-warning/20' : isApproved ? 'bg-primary/20' : getCategoryColor(activity.category)}`}>
                                                    {isRedeemed ? (
                                                        <Icon name="CheckCircleIcon" size={24} className="text-success" />
                                                    ) : isPending ? (
                                                        <Icon name="ClockIcon" size={24} className="text-warning" />
                                                    ) : isApproved ? (
                                                        <Icon name="SparklesIcon" size={24} className="text-primary" />
                                                    ) : (
                                                        <Icon name={activity.icon} size={24} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-caption text-sm font-medium text-foreground">{activity.title}</h3>
                                                    <p className="mt-1 font-caption text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                                                    <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                                                        <div className="flex items-center gap-1">
                                                            <Icon name="CurrencyDollarIcon" size={14} className="text-primary" />
                                                            <span className="font-mono text-sm font-bold text-primary">+{activity.tokens}</span>
                                                            <span className="font-caption text-xs text-muted-foreground">EDU</span>
                                                        </div>
                                                        {isBelow50 ? (
                                                            <span className="font-caption text-xs text-error">Min: 50 EDU</span>
                                                        ) : isRedeemed ? (
                                                            <span className="flex items-center gap-1 rounded-md bg-success px-2 py-1 font-caption text-xs font-medium text-success-foreground">
                                                                <Icon name="CheckIcon" size={12} />
                                                                <span>Earned</span>
                                                            </span>
                                                        ) : isPending ? (
                                                            <span className="flex items-center gap-1 rounded-md bg-warning/20 border border-warning/30 px-2 py-1 font-caption text-xs font-medium text-warning">
                                                                <Icon name="ClockIcon" size={12} />
                                                                <span>Pending Verification</span>
                                                            </span>
                                                        ) : isApproved ? (
                                                            <button
                                                                onClick={() => handleRedeemActivity(activity)}
                                                                disabled={isProcessing}
                                                                className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-caption text-xs font-medium text-primary-foreground transition-smooth hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {isProcessing ? (
                                                                    <>
                                                                        <Icon name="ArrowPathIcon" size={12} className="animate-spin" />
                                                                        <span>Redeeming...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Icon name="SparklesIcon" size={12} />
                                                                        <span>Redeem Tokens</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                href={`/submit/${activity.id}`}
                                                                className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 font-caption text-xs font-medium text-secondary-foreground transition-smooth hover:scale-[0.98]"
                                                            >
                                                                <Icon name="PaperAirplaneIcon" size={12} />
                                                                <span>Submit Task</span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Total Earnings Panel */}
                        <div className="rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-border p-6">
                            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Your Earnings Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-lg bg-card border border-border p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Icon name="ArrowTrendingUpIcon" size={20} className="text-success" />
                                        <span className="font-caption text-sm text-muted-foreground">Total Earned (Session)</span>
                                    </div>
                                    <p className="font-heading text-2xl font-bold text-success">+{totalEarned} EDU</p>
                                </div>
                                <div className="rounded-lg bg-card border border-border p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Icon name="WalletIcon" size={20} className="text-primary" />
                                        <span className="font-caption text-sm text-muted-foreground">Current Balance</span>
                                    </div>
                                    <p className="font-heading text-2xl font-bold text-primary">{userProfile?.tokens || 0} EDU</p>
                                </div>
                                <div className="rounded-lg bg-card border border-border p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Icon name="CheckBadgeIcon" size={20} className="text-accent" />
                                        <span className="font-caption text-sm text-muted-foreground">Activities Completed</span>
                                    </div>
                                    <p className="font-heading text-2xl font-bold text-accent">{earnedActivities.length}/{earnActivities.filter(a => a.tokens >= 50).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign Tokens Section */}
                {activeSection === 'assign' && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-card border border-border p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/20">
                                    <Icon name="ShieldCheckIcon" size={28} className="text-secondary" />
                                </div>
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-foreground">Admin Validation Flow</h2>
                                    <p className="mt-1 font-caption text-sm text-muted-foreground">
                                        How tokens are validated and assigned to ensure fairness
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="rounded-lg bg-muted/30 p-5">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading font-bold">1</div>
                                    <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">Student Activity</h3>
                                    <p className="font-caption text-sm text-muted-foreground">
                                        Students complete activities like attendance, assignments, or participate in events
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted/30 p-5">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-heading font-bold">2</div>
                                    <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">Admin Verification</h3>
                                    <p className="font-caption text-sm text-muted-foreground">
                                        Administrators verify attendance records, assignment submissions, and academic achievements
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted/30 p-5">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-heading font-bold">3</div>
                                    <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">Token Assignment</h3>
                                    <p className="font-caption text-sm text-muted-foreground">
                                        After validation, tokens are automatically credited to the student&apos;s wallet
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-lg bg-success/10 border border-success/20 p-4">
                                <div className="flex items-start gap-3">
                                    <Icon name="CheckBadgeIcon" size={24} className="text-success flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-caption text-sm font-medium text-foreground">Fairness & Trust</h4>
                                        <p className="mt-1 font-caption text-xs text-muted-foreground">
                                            This verification process ensures that tokens are only issued after proper validation,
                                            maintaining institutional trust and preventing misuse of the reward system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Use Tokens Section */}
                {activeSection === 'use' && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="mb-2 font-heading text-xl font-bold text-foreground">Student Benefits</h2>
                            <p className="mb-6 font-caption text-sm text-muted-foreground">
                                Redeem your earned tokens for these exciting rewards and opportunities
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {tokenUses.map((use) => (
                                    <div
                                        key={use.id}
                                        className="group rounded-lg border border-border bg-card/50 p-4 transition-smooth hover:border-primary/50 hover:shadow-glow-sm"
                                    >
                                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${getCategoryColor(use.category)}`}>
                                            <Icon name={use.icon} size={24} />
                                        </div>
                                        <h3 className="font-caption text-sm font-medium text-foreground">{use.title}</h3>
                                        <p className="mt-1 font-caption text-xs text-muted-foreground line-clamp-2">{use.description}</p>
                                        <div className="mt-3 flex items-center gap-1 rounded-md bg-muted px-2 py-1 w-fit">
                                            <Icon name="CurrencyDollarIcon" size={14} className="text-primary" />
                                            <span className="font-mono text-xs font-bold text-primary">{use.tokenCost}</span>
                                            <span className="font-caption text-xs text-muted-foreground">tokens</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Ecosystem Funding Section */}
                {activeSection === 'funding' && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-card border border-border p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20">
                                    <Icon name="BanknotesIcon" size={28} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-foreground">How the Ecosystem is Funded</h2>
                                    <p className="mt-1 font-caption text-sm text-muted-foreground">
                                        Sustainable revenue sources that power the Learn2Earn token economy
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {fundingSources.map((source, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <Icon name={source.icon} size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-caption text-sm font-medium text-foreground">{source.title}</h3>
                                            <p className="mt-1 font-caption text-xs text-muted-foreground">{source.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-lg bg-muted/50 p-5">
                                <h4 className="mb-2 font-heading text-base font-semibold text-foreground">Transparency & Sustainability</h4>
                                <p className="font-caption text-sm text-muted-foreground">
                                    Our funding model prioritizes transparency and long-term sustainability.
                                    All funds are used to maintain the platform, reward student achievements,
                                    and expand the ecosystem benefits. We regularly publish reports on token
                                    distribution and platform finances.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Redeem Tokens Section */}
                {activeSection === 'redeem' && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-card border border-border p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent/20">
                                    <Icon name="ShoppingCartIcon" size={28} className="text-accent" />
                                </div>
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-foreground">Redeem Tokens</h2>
                                    <p className="mt-1 font-caption text-sm text-muted-foreground">
                                        Exchange your earned tokens for exciting rewards and services
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {redeemableItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group overflow-hidden rounded-xl border border-border bg-card/50 transition-smooth hover:border-primary/50 hover:shadow-glow-sm"
                                    >
                                        {/* Image */}
                                        <div className="relative h-32 overflow-hidden">
                                            <Image
                                                src={`${item.image}?w=400&h=200&fit=crop&auto=format`}
                                                alt={item.title}
                                                fill
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                                            <div className="absolute top-2 right-2">
                                                <span className={`rounded-full px-2 py-0.5 font-caption text-xs font-medium ${getRedeemCategoryColor(item.category)}`}>
                                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Icon name={item.icon} size={18} className="text-primary" />
                                                <h3 className="font-caption text-sm font-medium text-foreground line-clamp-1">{item.title}</h3>
                                            </div>
                                            <p className="mb-3 font-caption text-xs text-muted-foreground line-clamp-2">{item.description}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                                                    <Icon name="CurrencyDollarIcon" size={14} className="text-primary" />
                                                    <span className="font-mono text-sm font-bold text-primary">{item.tokenCost}</span>
                                                    <span className="font-caption text-xs text-muted-foreground">EDU</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRedeem(item)}
                                                    disabled={redeemedItems.includes(item.id) || isRedeeming === item.id}
                                                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-caption text-xs font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${redeemedItems.includes(item.id)
                                                        ? 'bg-success text-success-foreground'
                                                        : 'bg-primary text-primary-foreground hover:scale-[0.98]'
                                                        }`}
                                                >
                                                    {isRedeeming === item.id ? (
                                                        <>
                                                            <Icon name="ArrowPathIcon" size={12} className="animate-spin" />
                                                            <span>Redeeming...</span>
                                                        </>
                                                    ) : redeemedItems.includes(item.id) ? (
                                                        <>
                                                            <Icon name="CheckIcon" size={12} />
                                                            <span>Redeemed</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icon name="GiftIcon" size={12} />
                                                            <span>Redeem</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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

const EarnTokensPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <EarnTokensContent />
        </ProtectedRoute>
    );
};

export default EarnTokensPage;
