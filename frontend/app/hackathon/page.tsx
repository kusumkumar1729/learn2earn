'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Confetti from '@/components/ui/Confetti';

interface Hackathon {
    id: number;
    title: string;
    description: string;
    date: string;
    duration: string;
    tokenCost: number;
    participants: number;
    maxParticipants: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    prizes: string[];
    tags: string[];
    image: string;
    externalUrl?: string; // Added field
    status: 'upcoming' | 'ongoing' | 'ended';
}

const HackathonContent = () => {
    const { userProfile, spendTokens } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [participatedHackathons, setParticipatedHackathons] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Mock State
    const isConnected = true;

    // We will use the static 'hackathons' array below as the source of truth
    const finalHackathons: Hackathon[] = []; // Initialized empty, will be populated below or just defined there.

    // Move hackathons definition UP or just merge logic.
    // Ideally we define hackathons array first.
    // Let's just remove the blockchain fetching logic here and use the static list defined below.


    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const hackathons: Hackathon[] = [
        {
            id: 1,
            title: 'Blockchain Innovation Challenge',
            description: 'Build decentralized applications that solve real-world problems using blockchain technology.',
            date: 'Feb 15-17, 2026',
            duration: '48 hours',
            tokenCost: 200,
            participants: 156,
            maxParticipants: 300,
            difficulty: 'Intermediate',
            prizes: ['5000 L2E Tokens', 'Internship Opportunities', 'Certificates'],
            tags: ['Blockchain', 'Web3', 'Smart Contracts'],
            image: 'https://images.unsplash.com/photo-1649682892309-e10e0b7cd40b',
            status: 'upcoming',
        },
        {
            id: 2,
            title: 'AI/ML Hackathon 2026',
            description: 'Create innovative AI solutions for healthcare, education, or sustainability.',
            date: 'Feb 22-24, 2026',
            duration: '48 hours',
            tokenCost: 150,
            participants: 234,
            maxParticipants: 400,
            difficulty: 'Advanced',
            prizes: ['4000 L2E Tokens', 'Cloud Credits', 'Mentorship'],
            tags: ['AI', 'Machine Learning', 'Python'],
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
            status: 'upcoming',
        },
        {
            id: 3,
            title: 'Web Development Sprint',
            description: 'Design and develop responsive web applications using modern frameworks.',
            date: 'Mar 1-2, 2026',
            duration: '24 hours',
            tokenCost: 100,
            participants: 89,
            maxParticipants: 200,
            difficulty: 'Beginner',
            prizes: ['2000 L2E Tokens', 'Premium Course Access', 'Swag'],
            tags: ['React', 'Next.js', 'TypeScript'],
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            status: 'upcoming',
        },
        {
            id: 4,
            title: 'Cybersecurity CTF',
            description: 'Capture the flag competition testing your cybersecurity skills.',
            date: 'Jan 20-21, 2026',
            duration: '36 hours',
            tokenCost: 175,
            participants: 120,
            maxParticipants: 120,
            difficulty: 'Advanced',
            prizes: ['3500 L2E Tokens', 'Security Certifications'],
            tags: ['Security', 'CTF', 'Networking'],
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
            status: 'ended',
        },
        {
            id: 5,
            title: 'Mobile App Challenge',
            description: 'Build cross-platform mobile applications for campus life improvement.',
            date: 'Mar 8-10, 2026',
            duration: '48 hours',
            tokenCost: 125,
            participants: 67,
            maxParticipants: 150,
            difficulty: 'Intermediate',
            prizes: ['3000 L2E Tokens', 'App Store Publishing Help'],
            tags: ['React Native', 'Flutter', 'Mobile'],
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
            status: 'upcoming',
        },
        {
            id: 6,
            title: 'IoT Innovation Lab',
            description: 'Create IoT solutions for smart campus and sustainable living.',
            date: 'Mar 15-16, 2026',
            duration: '24 hours',
            tokenCost: 100,
            participants: 45,
            maxParticipants: 100,
            difficulty: 'Beginner',
            prizes: ['2000 L2E Tokens', 'Hardware Kits'],
            tags: ['IoT', 'Arduino', 'Raspberry Pi'],
            image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f',
            status: 'upcoming',
        },
    ];

    const effectiveHackathons = hackathons; // Use the static list

    const isRegistered = (hackathonId: number) => {
        // Check local state 
        return participatedHackathons.includes(hackathonId);
    };

    const handleParticipate = async (hackathon: Hackathon) => {
        if (isRegistered(hackathon.id)) {
            showToastMessage('You have already registered for this hackathon!', 'error');
            return;
        }

        // Mock Registration
        if (isConnected) {
            setIsLoading(hackathon.id);
            try {
                // Mock delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                showToastMessage(`Registration submitted for ${hackathon.title}!`, 'success');
                setParticipatedHackathons(prev => [...prev, hackathon.id]);
                setShowConfetti(true);
            } catch (error) {
                console.error('Registration failed:', error);
                showToastMessage('Registration failed: ' + (error as any).message, 'error');
            }
            setIsLoading(null);
            return;
        }

        // Fallback Logic
        const tokenBalance = userProfile?.tokens || 0;
        if (tokenBalance < hackathon.tokenCost) {
            showToastMessage(`Insufficient tokens! You need ${hackathon.tokenCost} tokens.`, 'error');
            return;
        }

        if (hackathon.participants >= hackathon.maxParticipants) {
            showToastMessage('This hackathon is full!', 'error');
            return;
        }

        setIsLoading(hackathon.id);

        setTimeout(() => {
            const success = spendTokens(hackathon.tokenCost);
            if (success) {
                setParticipatedHackathons(prev => [...prev, hackathon.id]);
                showToastMessage(`Successfully registered for ${hackathon.title}!`, 'success');
                setShowConfetti(true);
            } else {
                showToastMessage('Failed to spend tokens. Please try again.', 'error');
            }
            setIsLoading(null);
        }, 1500);
    };

    const showToastMessage = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-accent/20 text-accent';
            case 'Intermediate': return 'bg-warning/20 text-warning';
            case 'Advanced': return 'bg-error/20 text-error';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-secondary/20 text-secondary';
            case 'ongoing': return 'bg-success/20 text-success';
            case 'ended': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="mb-8 h-12 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-warning/10 via-primary/10 to-secondary/10 border border-border p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-3xl font-bold text-foreground">Hackathons</h1>
                            <p className="mt-2 font-caption text-base text-muted-foreground">
                                Participate in exciting hackathons and win amazing prizes
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-card border border-border px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                                        <Icon name="CurrencyDollarIcon" size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-caption text-sm text-muted-foreground">Token Balance</p>
                                        <p className="font-heading text-2xl font-bold text-primary">{userProfile?.tokens || 0} EDU</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                <Icon name="TrophyIcon" size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">{effectiveHackathons.filter(h => h.status === 'upcoming').length}</p>
                                <p className="font-caption text-xs text-muted-foreground">Upcoming</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                                <Icon name="CheckCircleIcon" size={20} className="text-success" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">{participatedHackathons.length}</p>
                                <p className="font-caption text-xs text-muted-foreground">Registered</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                                <Icon name="UserGroupIcon" size={20} className="text-secondary" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">{effectiveHackathons.reduce((acc, h) => acc + h.participants, 0)}</p>
                                <p className="font-caption text-xs text-muted-foreground">Total Participants</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                                <Icon name="SparklesIcon" size={20} className="text-warning" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">{effectiveHackathons.length > 0 ? "Dynamic Pool" : "0"}</p>
                                <p className="font-caption text-xs text-muted-foreground">Total Prize Pool</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hackathon Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {effectiveHackathons.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No active hackathons found.
                        </div>
                    )}
                    {effectiveHackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className="group overflow-hidden rounded-xl bg-card border border-border transition-smooth hover:border-primary/50 hover:shadow-glow-sm"
                        >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden">
                                <Image
                                    src={hackathon.image}
                                    alt={hackathon.title}
                                    fill
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`rounded-full px-2 py-1 font-caption text-xs font-medium ${getStatusColor(hackathon.status)}`}>
                                        {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1">
                                        {hackathon.title}
                                    </h3>
                                    <span className={`flex-shrink-0 rounded-md px-2 py-0.5 font-caption text-xs font-medium ${getDifficultyColor(hackathon.difficulty)}`}>
                                        {hackathon.difficulty}
                                    </span>
                                </div>

                                <p className="mb-4 font-caption text-sm text-muted-foreground line-clamp-2">
                                    {hackathon.description}
                                </p>

                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Icon name="CalendarIcon" size={14} />
                                        <span className="font-caption text-xs">{hackathon.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Icon name="ClockIcon" size={14} />
                                        <span className="font-caption text-xs">{hackathon.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Icon name="UserGroupIcon" size={14} />
                                        <span className="font-caption text-xs">{hackathon.participants}/{hackathon.maxParticipants} participants</span>
                                    </div>
                                </div>

                                <div className="mb-4 flex flex-wrap gap-1">
                                    {hackathon.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="rounded-md bg-muted px-2 py-0.5 font-caption text-xs text-muted-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <div className="flex items-center gap-1">
                                        <Icon name="CurrencyDollarIcon" size={18} className="text-primary" />
                                        <span className="font-mono text-lg font-bold text-primary">{hackathon.tokenCost}</span>
                                        <span className="font-caption text-xs text-muted-foreground">EDU</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/hackathon/${hackathon.id}`}
                                            className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 font-caption text-xs font-medium text-muted-foreground transition-smooth hover:border-primary hover:text-foreground"
                                        >
                                            <Icon name="EyeIcon" size={14} />
                                            <span>Details</span>
                                        </Link>
                                        {hackathon.externalUrl && (
                                            <a
                                                href={hackathon.externalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 font-caption text-xs font-medium text-muted-foreground transition-smooth hover:border-primary hover:text-foreground"
                                                title="Visit Website"
                                            >
                                                <Icon name="ArrowTopRightOnSquareIcon" size={14} />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleParticipate(hackathon)}
                                            disabled={hackathon.status === 'ended' || isRegistered(hackathon.id) || isLoading === hackathon.id}
                                            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${isRegistered(hackathon.id)
                                                ? 'bg-success text-success-foreground'
                                                : 'bg-primary text-primary-foreground hover:scale-[0.98]'
                                                }`}
                                        >
                                            {isLoading === hackathon.id ? (
                                                <>
                                                    <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : isRegistered(hackathon.id) ? (
                                                <>
                                                    <Icon name="CheckIcon" size={16} />
                                                    <span>Registered</span>
                                                </>
                                            ) : hackathon.status === 'ended' ? (
                                                <span>Ended</span>
                                            ) : (
                                                <>
                                                    <Icon name="RocketLaunchIcon" size={16} />
                                                    <span>Participate</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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

const HackathonPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <HackathonContent />
        </ProtectedRoute>
    );
};

export default HackathonPage;
