'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Confetti from '@/components/ui/Confetti';

interface CourseService {
    id: number;
    title: string;
    description: string;
    tokenCost: number;
    duration: string;
    icon: string;
    image: string;
    category: 'career' | 'training' | 'workshop' | 'review';
    features: string[];
    instructor?: string;
    spots?: number;
}

const CoursesContent = () => {
    const { userProfile, spendTokens } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [enrolledServices, setEnrolledServices] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<'all' | 'career' | 'training' | 'workshop' | 'review'>('all');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const courseServices: CourseService[] = [
        {
            id: 1,
            title: 'Professional Resume Review',
            description: 'Get your resume reviewed by HR professionals with detailed feedback and improvement suggestions.',
            tokenCost: 75,
            duration: '2-3 days',
            icon: 'DocumentTextIcon',
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
            category: 'review',
            features: ['ATS Optimization', 'Formatting Review', 'Content Enhancement', 'Industry-Specific Tips'],
            instructor: 'HR Experts',
        },
        {
            id: 2,
            title: 'T&P Training Program',
            description: 'Comprehensive placement training covering aptitude, technical concepts, and interview preparation.',
            tokenCost: 350,
            duration: '4 weeks',
            icon: 'BriefcaseIcon',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
            category: 'training',
            features: ['Aptitude Training', 'Technical Prep', 'Interview Skills', 'Group Discussions'],
            instructor: 'Training & Placement Cell',
            spots: 50,
        },
        {
            id: 3,
            title: 'Web Development Bootcamp',
            description: 'Intensive bootcamp covering React, Next.js, Node.js, and modern web development practices.',
            tokenCost: 400,
            duration: '6 weeks',
            icon: 'CodeBracketIcon',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            category: 'workshop',
            features: ['React & Next.js', 'Backend with Node.js', 'Database Integration', 'Project Deployment'],
            instructor: 'Industry Mentors',
            spots: 30,
        },
        {
            id: 4,
            title: 'Mock Interview Session',
            description: 'Practice with realistic interview scenarios and receive constructive feedback.',
            tokenCost: 100,
            duration: '1 hour',
            icon: 'VideoCameraIcon',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
            category: 'career',
            features: ['Technical Rounds', 'HR Rounds', 'Instant Feedback', 'Recording Available'],
            instructor: 'Senior Engineers',
        },
        {
            id: 5,
            title: 'Data Science Workshop',
            description: 'Learn Python, pandas, scikit-learn, and machine learning fundamentals.',
            tokenCost: 300,
            duration: '4 weeks',
            icon: 'ChartBarIcon',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            category: 'workshop',
            features: ['Python Basics', 'Data Analysis', 'ML Fundamentals', 'Real Projects'],
            instructor: 'Data Scientists',
            spots: 40,
        },
        {
            id: 6,
            title: 'LinkedIn Profile Optimization',
            description: 'Optimize your LinkedIn profile to attract recruiters and opportunities.',
            tokenCost: 50,
            duration: '1-2 days',
            icon: 'UserCircleIcon',
            image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c',
            category: 'review',
            features: ['Profile Analysis', 'Headline Optimization', 'Skills Section', 'Network Strategy'],
            instructor: 'Career Counselors',
        },
        {
            id: 7,
            title: 'Communication Skills Workshop',
            description: 'Enhance your verbal and written communication for professional settings.',
            tokenCost: 150,
            duration: '2 weeks',
            icon: 'ChatBubbleLeftRightIcon',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
            category: 'training',
            features: ['Public Speaking', 'Email Writing', 'Presentation Skills', 'Body Language'],
            instructor: 'Soft Skills Trainers',
            spots: 25,
        },
        {
            id: 8,
            title: 'Cloud Computing Basics',
            description: 'Introduction to AWS, Azure, and Google Cloud with hands-on labs.',
            tokenCost: 250,
            duration: '3 weeks',
            icon: 'CloudIcon',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
            category: 'workshop',
            features: ['AWS Fundamentals', 'Azure Basics', 'GCP Overview', 'Certification Prep'],
            instructor: 'Cloud Architects',
            spots: 35,
        },
        {
            id: 9,
            title: 'Career Counseling Session',
            description: 'One-on-one session with career counselors to plan your professional path.',
            tokenCost: 80,
            duration: '45 mins',
            icon: 'LightBulbIcon',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
            category: 'career',
            features: ['Career Assessment', 'Goal Setting', 'Industry Insights', 'Action Plan'],
            instructor: 'Career Counselors',
        },
        {
            id: 10,
            title: 'DSA Crash Course',
            description: 'Master data structures and algorithms for coding interviews.',
            tokenCost: 200,
            duration: '3 weeks',
            icon: 'CubeIcon',
            image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
            category: 'training',
            features: ['Arrays & Strings', 'Trees & Graphs', 'DP & Recursion', '100+ Problems'],
            instructor: 'Competitive Programmers',
            spots: 60,
        },
        {
            id: 11,
            title: 'Portfolio Website Review',
            description: 'Get expert feedback on your developer portfolio website.',
            tokenCost: 60,
            duration: '1-2 days',
            icon: 'GlobeAltIcon',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d',
            category: 'review',
            features: ['UI/UX Review', 'Content Analysis', 'SEO Tips', 'Best Practices'],
            instructor: 'Senior Developers',
        },
        {
            id: 12,
            title: 'Cybersecurity Fundamentals',
            description: 'Learn ethical hacking basics, network security, and security best practices.',
            tokenCost: 275,
            duration: '4 weeks',
            icon: 'ShieldCheckIcon',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
            category: 'workshop',
            features: ['Network Security', 'Web Security', 'Ethical Hacking', 'CTF Practice'],
            instructor: 'Security Experts',
            spots: 25,
        },
    ];

    const handleEnroll = (service: CourseService) => {
        if (enrolledServices.includes(service.id)) {
            showToastMessage('You are already enrolled in this program!', 'error');
            return;
        }

        const tokenBalance = userProfile?.tokens || 0;
        if (tokenBalance < service.tokenCost) {
            showToastMessage(`Insufficient tokens! You need ${service.tokenCost} tokens.`, 'error');
            return;
        }

        setIsLoading(service.id);

        setTimeout(() => {
            const success = spendTokens(service.tokenCost);
            if (success) {
                setEnrolledServices(prev => [...prev, service.id]);
                showToastMessage(`Successfully enrolled in ${service.title}!`, 'success');
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

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'career': return 'bg-primary/20 text-primary';
            case 'training': return 'bg-secondary/20 text-secondary';
            case 'workshop': return 'bg-accent/20 text-accent';
            case 'review': return 'bg-warning/20 text-warning';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'career': return 'Career Services';
            case 'training': return 'Training Program';
            case 'workshop': return 'Workshop';
            case 'review': return 'Review Service';
            default: return category;
        }
    };

    const filteredServices = activeCategory === 'all'
        ? courseServices
        : courseServices.filter(s => s.category === activeCategory);

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                    <div className="mb-8 h-12 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
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
                <div className="mb-8 rounded-xl bg-gradient-to-r from-secondary/10 via-accent/10 to-primary/10 border border-border p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="font-heading text-3xl font-bold text-foreground">Courses & Career Services</h1>
                            <p className="mt-2 font-caption text-base text-muted-foreground">
                                Invest your tokens in skills and career development
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

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: 'All Services', icon: 'Squares2X2Icon' },
                        { id: 'career', label: 'Career Services', icon: 'BriefcaseIcon' },
                        { id: 'training', label: 'Training Programs', icon: 'AcademicCapIcon' },
                        { id: 'workshop', label: 'Workshops', icon: 'RocketLaunchIcon' },
                        { id: 'review', label: 'Review Services', icon: 'DocumentCheckIcon' },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-caption text-sm font-medium transition-smooth ${activeCategory === cat.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon name={cat.icon} size={18} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                <Icon name="BookOpenIcon" size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">{courseServices.length}</p>
                                <p className="font-caption text-xs text-muted-foreground">Total Services</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                                <Icon name="CheckCircleIcon" size={20} className="text-success" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">{enrolledServices.length}</p>
                                <p className="font-caption text-xs text-muted-foreground">Enrolled</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                                <Icon name="UserGroupIcon" size={20} className="text-secondary" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">2,450+</p>
                                <p className="font-caption text-xs text-muted-foreground">Students Trained</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                                <Icon name="StarIcon" size={20} className="text-warning" />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold text-foreground">4.8</p>
                                <p className="font-caption text-xs text-muted-foreground">Avg Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="group overflow-hidden rounded-xl bg-card border border-border transition-smooth hover:border-primary/50 hover:shadow-glow-sm"
                        >
                            {/* Image */}
                            <div className="relative h-36 overflow-hidden">
                                <img
                                    src={`${service.image}?w=600&h=300&fit=crop&auto=format`}
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                                <div className="absolute top-3 right-3">
                                    <span className={`rounded-md px-2 py-0.5 font-caption text-xs font-medium ${getCategoryColor(service.category)}`}>
                                        {getCategoryLabel(service.category)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${getCategoryColor(service.category)}`}>
                                        <Icon name={service.icon} size={20} />
                                    </div>
                                    <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1">
                                        {service.title}
                                    </h3>
                                </div>

                                <p className="mb-4 font-caption text-sm text-muted-foreground line-clamp-2">
                                    {service.description}
                                </p>

                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Icon name="ClockIcon" size={14} />
                                        <span className="font-caption text-xs">{service.duration}</span>
                                    </div>
                                    {service.instructor && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Icon name="UserIcon" size={14} />
                                            <span className="font-caption text-xs">{service.instructor}</span>
                                        </div>
                                    )}
                                    {service.spots && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Icon name="UserGroupIcon" size={14} />
                                            <span className="font-caption text-xs">{service.spots} spots available</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4 flex flex-wrap gap-1">
                                    {service.features.slice(0, 3).map((feature, index) => (
                                        <span key={index} className="rounded-md bg-muted px-2 py-0.5 font-caption text-xs text-muted-foreground">
                                            {feature}
                                        </span>
                                    ))}
                                    {service.features.length > 3 && (
                                        <span className="rounded-md bg-muted px-2 py-0.5 font-caption text-xs text-muted-foreground">
                                            +{service.features.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <div className="flex items-center gap-1">
                                        <Icon name="CurrencyDollarIcon" size={18} className="text-primary" />
                                        <span className="font-mono text-lg font-bold text-primary">{service.tokenCost}</span>
                                        <span className="font-caption text-xs text-muted-foreground">tokens</span>
                                    </div>
                                    <button
                                        onClick={() => handleEnroll(service)}
                                        disabled={enrolledServices.includes(service.id) || isLoading === service.id}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${enrolledServices.includes(service.id)
                                            ? 'bg-success text-success-foreground'
                                            : 'bg-primary text-primary-foreground hover:scale-[0.98]'
                                            }`}
                                    >
                                        {isLoading === service.id ? (
                                            <>
                                                <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : enrolledServices.includes(service.id) ? (
                                            <>
                                                <Icon name="CheckIcon" size={16} />
                                                <span>Enrolled</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="AcademicCapIcon" size={16} />
                                                <span>Enroll Now</span>
                                            </>
                                        )}
                                    </button>
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

const CoursesPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <CoursesContent />
        </ProtectedRoute>
    );
};

export default CoursesPage;
