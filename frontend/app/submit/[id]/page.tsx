'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { submitActivity, getActivityStatus } from '@/lib/activitySubmissionsStore';

interface Activity {
    id: number;
    title: string;
    description: string;
    tokens: number;
    icon: string;
    proofType: 'file' | 'text' | 'link' | 'percentage';
    proofLabel: string;
    proofPlaceholder: string;
    instructions: string[];
}

const activitiesData: Activity[] = [
    {
        id: 1,
        title: 'Attendance',
        description: 'Maintain 90%+ attendance each month',
        tokens: 50,
        icon: 'CalendarDaysIcon',
        proofType: 'percentage',
        proofLabel: 'Attendance Percentage',
        proofPlaceholder: 'Enter your attendance percentage (e.g., 95)',
        instructions: [
            'Log in to your university portal',
            'Navigate to Attendance section',
            'Enter your current attendance percentage',
            'Minimum 90% required for token eligibility',
        ],
    },
    {
        id: 2,
        title: 'Assignments',
        description: 'Submit assignments on time with good grades',
        tokens: 25,
        icon: 'DocumentCheckIcon',
        proofType: 'link',
        proofLabel: 'Assignment Submission Link',
        proofPlaceholder: 'Paste link to your submitted assignment',
        instructions: [
            'Complete all pending assignments',
            'Submit them on the university portal',
            'Copy the submission confirmation link',
            'Paste it below for verification',
        ],
    },
    {
        id: 3,
        title: 'CGPA Milestones',
        description: 'Achieve CGPA of 8.0, 8.5, 9.0, 9.5+',
        tokens: 200,
        icon: 'ChartBarIcon',
        proofType: 'text',
        proofLabel: 'Current CGPA',
        proofPlaceholder: 'Enter your current CGPA (e.g., 8.5)',
        instructions: [
            'Check your latest grade card',
            'Enter your current CGPA',
            'Minimum CGPA of 8.0 required',
            'Higher CGPA may qualify for bonus tokens',
        ],
    },
    {
        id: 4,
        title: 'Semester Completion',
        description: 'Successfully complete each semester',
        tokens: 100,
        icon: 'AcademicCapIcon',
        proofType: 'text',
        proofLabel: 'Semester Details',
        proofPlaceholder: 'Enter semester number and academic year',
        instructions: [
            'Confirm you have completed the semester',
            'Enter the semester number (1-8)',
            'Provide the academic year',
            'Proof will be verified with university records',
        ],
    },
    {
        id: 5,
        title: 'Record Submissions',
        description: 'Submit lab records and project documentation',
        tokens: 30,
        icon: 'FolderIcon',
        proofType: 'link',
        proofLabel: 'Record Submission Link',
        proofPlaceholder: 'Paste link to your submitted records',
        instructions: [
            'Complete all lab records/documentation',
            'Submit to your department',
            'Get acknowledgment from faculty',
            'Provide submission details below',
        ],
    },
    {
        id: 6,
        title: 'Course Completions',
        description: 'Complete online courses and certifications',
        tokens: 75,
        icon: 'BookOpenIcon',
        proofType: 'link',
        proofLabel: 'Course Completion Certificate Link',
        proofPlaceholder: 'Paste link to your course certificate',
        instructions: [
            'Complete an online course (Coursera, Udemy, etc.)',
            'Download or copy the certificate link',
            'Paste the verification link below',
            'Course must be relevant to your field',
        ],
    },
    {
        id: 7,
        title: 'Certifications',
        description: 'Earn verified industry certifications',
        tokens: 150,
        icon: 'CheckBadgeIcon',
        proofType: 'link',
        proofLabel: 'Certification Verification Link',
        proofPlaceholder: 'Paste your certification verification URL',
        instructions: [
            'Earn an industry certification',
            'Get the verification/credential link',
            'Paste the public verification URL',
            'Examples: AWS, Google Cloud, Microsoft, etc.',
        ],
    },
    {
        id: 8,
        title: 'Technical Activities',
        description: 'Participate in coding contests, workshops',
        tokens: 100,
        icon: 'CodeBracketIcon',
        proofType: 'text',
        proofLabel: 'Activity Description',
        proofPlaceholder: 'Describe the technical activity and your participation',
        instructions: [
            'Participate in hackathons, coding contests, or workshops',
            'Describe your participation and role',
            'Include event name and date',
            'Mention any awards or recognition received',
        ],
    },
    {
        id: 9,
        title: 'Cultural Activities',
        description: 'Participate in cultural fests and events',
        tokens: 50,
        icon: 'MusicalNoteIcon',
        proofType: 'text',
        proofLabel: 'Event Details',
        proofPlaceholder: 'Describe the cultural event and your participation',
        instructions: [
            'Participate in cultural fests or events',
            'Describe the event and your role',
            'Include event name and date',
            'Photo proof may be requested later',
        ],
    },
    {
        id: 10,
        title: 'Extracurricular',
        description: 'Sports, clubs, volunteer activities',
        tokens: 40,
        icon: 'UserGroupIcon',
        proofType: 'text',
        proofLabel: 'Activity Details',
        proofPlaceholder: 'Describe your extracurricular activity',
        instructions: [
            'Participate in sports, clubs, or volunteering',
            'Describe your involvement',
            'Include duration and role',
            'Club coordinator verification may be required',
        ],
    },
    {
        id: 11,
        title: 'NFT Certificates',
        description: 'Receive NFT tokens for verified achievements',
        tokens: 250,
        icon: 'SparklesIcon',
        proofType: 'text',
        proofLabel: 'Wallet Address & Achievement',
        proofPlaceholder: 'Enter your wallet address and achievement details',
        instructions: [
            'Provide your Web3 wallet address',
            'Describe the achievement for NFT minting',
            'NFT will be minted after admin verification',
            'You will receive the NFT in your wallet',
        ],
    },
];

const SubmitActivityContent = () => {
    const params = useParams();
    const router = useRouter();
    const { user, userProfile } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [proofValue, setProofValue] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const activityId = parseInt(params.id as string);
    const activity = activitiesData.find(a => a.id === activityId);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const showToastMessage = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!activity || !user || !userProfile) {
            showToastMessage('Unable to submit. Please try again.', 'error');
            return;
        }

        if (!proofValue.trim()) {
            showToastMessage('Please provide the required proof.', 'error');
            return;
        }

        // Check if already submitted
        const currentStatus = getActivityStatus(activity.id, user.uid);
        if (currentStatus !== 'not_submitted') {
            showToastMessage('This activity has already been submitted.', 'error');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            const fullProof = additionalNotes
                ? `${proofValue}\n\nAdditional Notes: ${additionalNotes}`
                : proofValue;

            const success = submitActivity(
                activity.id,
                activity.title,
                user.uid,
                userProfile.name || 'Student',
                userProfile.email || user.email || '',
                activity.proofType,
                fullProof,
                activity.tokens
            );

            if (success) {
                showToastMessage('Submission successful! Waiting for admin verification.', 'success');
                setTimeout(() => {
                    router.push('/earn-tokens');
                }, 2000);
            } else {
                showToastMessage('Submission failed. Please try again.', 'error');
            }
            setIsSubmitting(false);
        }, 1500);
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[800px] px-6 py-8 lg:px-8">
                    <div className="h-8 w-64 animate-pulse rounded-lg bg-muted mb-6" />
                    <div className="h-64 animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="ExclamationCircleIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
                    <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Activity Not Found</h1>
                    <p className="font-caption text-muted-foreground mb-4">The activity you are looking for does not exist.</p>
                    <button
                        onClick={() => router.push('/earn-tokens')}
                        className="rounded-lg bg-primary px-4 py-2 font-caption text-sm font-medium text-primary-foreground"
                    >
                        Back to Earn Tokens
                    </button>
                </div>
            </div>
        );
    }

    const isBelow50 = activity.tokens < 50;

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="mx-auto max-w-[800px] px-6 py-8 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/earn-tokens')}
                    className="mb-6 flex items-center gap-2 font-caption text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back to Earn Tokens</span>
                </button>

                {/* Header */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                            <Icon name={activity.icon} size={28} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-foreground">{activity.title}</h1>
                            <p className="font-caption text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Icon name="CurrencyDollarIcon" size={18} className="text-primary" />
                        <span className="font-mono text-lg font-bold text-primary">+{activity.tokens}</span>
                        <span className="font-caption text-sm text-muted-foreground">EDU Tokens on approval</span>
                    </div>
                </div>

                {isBelow50 ? (
                    <div className="rounded-xl bg-error/10 border border-error/30 p-6 text-center">
                        <Icon name="ExclamationTriangleIcon" size={48} className="text-error mx-auto mb-4" />
                        <h2 className="font-heading text-xl font-bold text-error mb-2">Minimum Not Met</h2>
                        <p className="font-caption text-muted-foreground">
                            This activity rewards only {activity.tokens} EDU tokens. Minimum redeemable amount is 50 EDU.
                        </p>
                        <button
                            onClick={() => router.push('/earn-tokens')}
                            className="mt-4 rounded-lg bg-muted px-4 py-2 font-caption text-sm font-medium text-foreground"
                        >
                            Back to Activities
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Instructions */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Submission Instructions</h2>
                            <ul className="space-y-3">
                                {activity.instructions.map((instruction, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                                            <span className="font-mono text-xs font-bold text-primary">{index + 1}</span>
                                        </div>
                                        <span className="font-caption text-sm text-muted-foreground">{instruction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Proof Input */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Submit Your Proof</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block font-caption text-sm font-medium text-foreground">
                                        {activity.proofLabel} <span className="text-error">*</span>
                                    </label>
                                    {activity.proofType === 'text' || activity.proofType === 'percentage' ? (
                                        <input
                                            type={activity.proofType === 'percentage' ? 'number' : 'text'}
                                            value={proofValue}
                                            onChange={(e) => setProofValue(e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-3 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder={activity.proofPlaceholder}
                                            min={activity.proofType === 'percentage' ? 0 : undefined}
                                            max={activity.proofType === 'percentage' ? 100 : undefined}
                                        />
                                    ) : (
                                        <input
                                            type="url"
                                            value={proofValue}
                                            onChange={(e) => setProofValue(e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-3 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder={activity.proofPlaceholder}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block font-caption text-sm font-medium text-foreground">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-3 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        placeholder="Any additional information for verification..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !proofValue.trim()}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-caption text-base font-medium text-primary-foreground transition-smooth hover:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="PaperAirplaneIcon" size={20} />
                                    <span>Submit for Verification</span>
                                </>
                            )}
                        </button>

                        <p className="text-center font-caption text-xs text-muted-foreground">
                            Your submission will be reviewed by an admin. You will be able to redeem tokens once approved.
                        </p>
                    </form>
                )}
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[1050] animate-slide-in">
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

const SubmitActivityPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <SubmitActivityContent />
        </ProtectedRoute>
    );
};

export default SubmitActivityPage;
