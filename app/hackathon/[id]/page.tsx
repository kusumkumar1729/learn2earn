'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    about: string;
    date: string;
    tokenCost: number;
    participants: number;
    maxParticipants: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    status: 'upcoming' | 'live' | 'completed';
    prizes: string[];
    rules: string[];
    timeline: { date: string; event: string }[];
    organizer: string;
    location: string;
    image: string;
}

const hackathonsData: Hackathon[] = [
    {
        id: 1,
        title: 'AI Innovation Challenge 2024',
        description: 'Build innovative AI solutions to real-world problems',
        about: 'Join us for an exciting 48-hour hackathon focused on artificial intelligence and machine learning. Work with cutting-edge technologies, learn from industry experts, and compete for amazing prizes. This is your chance to showcase your AI skills and build something that could change the world.',
        date: '2024-03-15',
        tokenCost: 150,
        participants: 245,
        maxParticipants: 500,
        difficulty: 'intermediate',
        status: 'upcoming',
        prizes: ['₹50,000 Cash Prize', 'Internship Opportunity at Top Tech Company', 'AI/ML Course Subscription', 'Developer Swag Kit'],
        rules: ['Team size: 2-4 members', 'All code must be written during the hackathon', 'Use of open-source libraries is allowed', 'Projects must include AI/ML component', 'Presentations limited to 5 minutes'],
        timeline: [
            { date: 'Day 1 - 9:00 AM', event: 'Registration & Opening Ceremony' },
            { date: 'Day 1 - 10:00 AM', event: 'Hacking Begins' },
            { date: 'Day 1 - 2:00 PM', event: 'Mentor Sessions' },
            { date: 'Day 2 - 10:00 AM', event: 'Code Freeze' },
            { date: 'Day 2 - 12:00 PM', event: 'Presentations & Judging' },
            { date: 'Day 2 - 4:00 PM', event: 'Prize Distribution' },
        ],
        organizer: 'Tech Club & AI Society',
        location: 'Main Auditorium, Block A',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    },
    {
        id: 2,
        title: 'Web3 DeFi Hackathon',
        description: 'Create decentralized finance solutions',
        about: 'Explore the future of finance by building decentralized applications. This hackathon focuses on blockchain technology, smart contracts, and DeFi protocols. Whether you are new to Web3 or an experienced developer, this event offers mentorship and resources to help you succeed.',
        date: '2024-04-01',
        tokenCost: 200,
        participants: 180,
        maxParticipants: 300,
        difficulty: 'advanced',
        status: 'upcoming',
        prizes: ['1 ETH Prize Pool', 'Web3 Developer Certification', 'Blockchain Course Access', 'Hardware Wallet'],
        rules: ['Solo or team (max 3 members)', 'Must use blockchain technology', 'Smart contracts must be deployed on testnet', 'Open-source everything', 'Demo required for judging'],
        timeline: [
            { date: 'Day 1 - 8:00 AM', event: 'Check-in & Setup' },
            { date: 'Day 1 - 9:30 AM', event: 'Web3 Workshop' },
            { date: 'Day 1 - 11:00 AM', event: 'Hacking Starts' },
            { date: 'Day 2 - 3:00 PM', event: 'Submission Deadline' },
            { date: 'Day 2 - 5:00 PM', event: 'Winner Announcement' },
        ],
        organizer: 'Blockchain Society',
        location: 'Innovation Lab, Block C',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
    },
    {
        id: 3,
        title: 'Mobile App Sprint',
        description: 'Design and build mobile apps in 24 hours',
        about: 'A fast-paced hackathon where you will design, develop, and demo a mobile application in just 24 hours. Focus on user experience, innovation, and technical implementation. Perfect for mobile developers looking to test their skills under pressure.',
        date: '2024-03-28',
        tokenCost: 100,
        participants: 156,
        maxParticipants: 200,
        difficulty: 'beginner',
        status: 'upcoming',
        prizes: ['₹25,000 Cash Prize', 'Play Store/App Store Credits', 'Mobile Dev Course', 'Smartphone'],
        rules: ['Teams of 2-3 members', 'React Native or Flutter only', 'Must be a new project', 'App must work on both iOS and Android', 'UI/UX is 40% of scoring'],
        timeline: [
            { date: '9:00 AM', event: 'Kickoff & Theme Reveal' },
            { date: '10:00 AM', event: 'Development Begins' },
            { date: '9:00 AM (Next Day)', event: 'Submission' },
            { date: '11:00 AM', event: 'Demo & Awards' },
        ],
        organizer: 'Mobile Dev Club',
        location: 'Computer Lab 1, Block B',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
    },
];

const HackathonDetailContent = () => {
    const params = useParams();
    const router = useRouter();
    const { userProfile, spendTokens } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        college: '',
        year: '',
        wallet: '',
    });

    const hackathonId = parseInt(params.id as string);
    const hackathon = hackathonsData.find(h => h.id === hackathonId);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const showToastMessage = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleRegister = () => {
        if (!formData.name || !formData.email || !formData.college || !formData.year) {
            showToastMessage('Please fill all required fields.', 'error');
            return;
        }

        if (!hackathon) return;

        const balance = userProfile?.tokens || 0;
        if (balance < hackathon.tokenCost) {
            showToastMessage(`Insufficient tokens! You need ${hackathon.tokenCost} EDU.`, 'error');
            return;
        }

        setIsRegistering(true);

        setTimeout(() => {
            const success = spendTokens(hackathon.tokenCost);
            if (success) {
                setIsRegistered(true);
                setShowModal(false);
                showToastMessage(`Successfully registered for ${hackathon.title}!`, 'success');
                setShowConfetti(true);
            } else {
                showToastMessage('Registration failed. Please try again.', 'error');
            }
            setIsRegistering(false);
        }, 2000);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-success/20 text-success';
            case 'intermediate': return 'bg-warning/20 text-warning';
            case 'advanced': return 'bg-error/20 text-error';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-primary/20 text-primary';
            case 'live': return 'bg-success/20 text-success';
            case 'completed': return 'bg-muted text-muted-foreground';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="h-64 animate-pulse rounded-xl bg-muted mb-6" />
                    <div className="h-8 w-64 animate-pulse rounded-lg bg-muted mb-4" />
                    <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
                </div>
            </div>
        );
    }

    if (!hackathon) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="ExclamationCircleIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
                    <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Hackathon Not Found</h1>
                    <p className="font-caption text-muted-foreground mb-4">The hackathon you are looking for does not exist.</p>
                    <button
                        onClick={() => router.push('/hackathon')}
                        className="rounded-lg bg-primary px-4 py-2 font-caption text-sm font-medium text-primary-foreground"
                    >
                        Back to Hackathons
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

            <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/hackathon')}
                    className="mb-6 flex items-center gap-2 font-caption text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back to Hackathons</span>
                </button>

                {/* Hero Section */}
                <div className="relative rounded-xl overflow-hidden mb-8">
                    <Image
                        src={`${hackathon.image}?w=1400&h=400&fit=crop&auto=format`}
                        alt={hackathon.title}
                        fill
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`rounded-full px-3 py-1 font-caption text-xs font-medium ${getDifficultyColor(hackathon.difficulty)}`}>
                                {hackathon.difficulty.charAt(0).toUpperCase() + hackathon.difficulty.slice(1)}
                            </span>
                            <span className={`rounded-full px-3 py-1 font-caption text-xs font-medium ${getStatusColor(hackathon.status)}`}>
                                {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                            </span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{hackathon.title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">About This Hackathon</h2>
                            <p className="font-caption text-muted-foreground leading-relaxed">{hackathon.about}</p>
                        </div>

                        {/* Timeline */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Event Timeline</h2>
                            <div className="space-y-4">
                                {hackathon.timeline.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                            {index < hackathon.timeline.length - 1 && (
                                                <div className="w-0.5 flex-1 bg-border mt-1" />
                                            )}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-mono text-xs text-primary mb-1">{item.date}</p>
                                            <p className="font-caption text-sm text-foreground">{item.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rules */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Rules & Guidelines</h2>
                            <ul className="space-y-2">
                                {hackathon.rules.map((rule, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Icon name="CheckCircleIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
                                        <span className="font-caption text-sm text-muted-foreground">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Prizes */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Prizes & Rewards</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {hackathon.prizes.map((prize, index) => (
                                    <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                                            <Icon name="TrophyIcon" size={20} className="text-warning" />
                                        </div>
                                        <span className="font-caption text-sm text-foreground">{prize}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <div className="rounded-xl bg-card border border-border p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-caption text-sm text-muted-foreground">Registration Fee</span>
                                <div className="flex items-center gap-1">
                                    <Icon name="CurrencyDollarIcon" size={18} className="text-primary" />
                                    <span className="font-mono text-xl font-bold text-primary">{hackathon.tokenCost}</span>
                                    <span className="font-caption text-sm text-muted-foreground">EDU</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4 text-sm">
                                <span className="font-caption text-muted-foreground">Your Balance</span>
                                <span className="font-mono font-medium text-foreground">{userProfile?.tokens || 0} EDU</span>
                            </div>

                            <div className="flex items-center justify-between mb-6 text-sm">
                                <span className="font-caption text-muted-foreground">Participants</span>
                                <span className="font-caption text-foreground">{hackathon.participants}/{hackathon.maxParticipants}</span>
                            </div>

                            {isRegistered ? (
                                <div className="flex items-center justify-center gap-2 rounded-lg bg-success/20 border border-success/30 px-4 py-3">
                                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                                    <span className="font-caption text-sm font-medium text-success">Registered Successfully!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.99]"
                                >
                                    <Icon name="TicketIcon" size={18} />
                                    <span>Register Using Tokens</span>
                                </button>
                            )}
                        </div>

                        {/* Details Card */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Event Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Icon name="CalendarDaysIcon" size={18} className="text-muted-foreground" />
                                    <span className="font-caption text-sm text-foreground">{new Date(hackathon.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="MapPinIcon" size={18} className="text-muted-foreground" />
                                    <span className="font-caption text-sm text-foreground">{hackathon.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="UserGroupIcon" size={18} className="text-muted-foreground" />
                                    <span className="font-caption text-sm text-foreground">{hackathon.organizer}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[1040] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-glow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading text-xl font-bold text-foreground">Register for Hackathon</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-1 hover:bg-muted transition-smooth"
                            >
                                <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block font-caption text-sm font-medium text-foreground">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-caption text-sm font-medium text-foreground">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-caption text-sm font-medium text-foreground">College *</label>
                                <input
                                    type="text"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter your college"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-caption text-sm font-medium text-foreground">Year *</label>
                                <select
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block font-caption text-sm font-medium text-foreground">Wallet Address (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.wallet}
                                    onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 font-caption text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="0x..."
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2 text-sm">
                                <span className="font-caption text-muted-foreground">Registration Cost</span>
                                <span className="font-mono font-bold text-primary">{hackathon.tokenCost} EDU</span>
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={isRegistering}
                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRegistering ? (
                                    <>
                                        <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="CheckCircleIcon" size={18} />
                                        <span>Confirm Registration</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

const HackathonDetailPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <HackathonDetailContent />
        </ProtectedRoute>
    );
};

export default HackathonDetailPage;
