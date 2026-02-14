'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import DynamicNavbar from '@/components/navigation/DynamicNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Confetti from '@/components/ui/Confetti';

interface Course {
    id: number;
    title: string;
    description: string;
    about: string;
    instructor: string;
    instructorTitle: string;
    duration: string;
    tokenCost: number;
    category: 'career' | 'training' | 'workshop' | 'review';
    level: 'beginner' | 'intermediate' | 'advanced';
    enrolled: number;
    maxEnrollment: number;
    rating: number;
    image: string;
    syllabus: string[];
    whatYouWillLearn: string[];
    requirements: string[];
}

const coursesData: Course[] = [
    {
        id: 1,
        title: 'Professional Resume Review',
        description: 'Get your resume reviewed by industry experts',
        about: 'Our resume review service provides comprehensive feedback on your resume by industry professionals with 10+ years of hiring experience. Receive personalized suggestions to make your resume stand out in the competitive job market. We analyze your resume for ATS compatibility, formatting, content, and impact.',
        instructor: 'Sarah Johnson',
        instructorTitle: 'HR Director, Tech Corp',
        duration: '2-3 days turnaround',
        tokenCost: 75,
        category: 'review',
        level: 'beginner',
        enrolled: 320,
        maxEnrollment: 500,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
        syllabus: ['Resume submission', 'Expert review', 'Detailed feedback report', 'Revision suggestions', 'Final review'],
        whatYouWillLearn: ['How to structure an impactful resume', 'Keywords that pass ATS systems', 'Formatting best practices', 'How to quantify your achievements', 'Common mistakes to avoid'],
        requirements: ['Current resume in PDF/DOC format', 'Target job roles (optional)'],
    },
    {
        id: 2,
        title: 'Technical Interview Bootcamp',
        description: '3-week intensive program for technical interviews',
        about: 'Prepare for technical interviews at top tech companies with our comprehensive bootcamp. Learn data structures, algorithms, system design, and behavioral interview techniques. Practice with mock interviews and receive personalized feedback from engineers at FAANG companies.',
        instructor: 'Mike Chen',
        instructorTitle: 'Ex-Google Engineer',
        duration: '3 weeks',
        tokenCost: 300,
        category: 'training',
        level: 'intermediate',
        enrolled: 85,
        maxEnrollment: 100,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        syllabus: ['Week 1: Data Structures & Algorithms', 'Week 2: System Design Fundamentals', 'Week 3: Mock Interviews & Behavioral', 'Bonus: Company-specific preparation'],
        whatYouWillLearn: ['Master common coding patterns', 'System design interview approach', 'Behavioral interview STAR method', 'Time complexity analysis', 'Problem-solving strategies'],
        requirements: ['Basic programming knowledge', 'Understanding of one programming language', '10+ hours per week commitment'],
    },
    {
        id: 3,
        title: 'Web Development Workshop',
        description: 'Hands-on workshop on modern web technologies',
        about: 'A weekend workshop covering modern web development with React, Next.js, and Tailwind CSS. Build a complete project from scratch and learn industry best practices. Perfect for beginners looking to start their web development journey.',
        instructor: 'Emily Rodriguez',
        instructorTitle: 'Full Stack Developer',
        duration: '2 days (weekend)',
        tokenCost: 150,
        category: 'workshop',
        level: 'beginner',
        enrolled: 45,
        maxEnrollment: 50,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
        syllabus: ['Day 1: React fundamentals & components', 'Day 1: State management & hooks', 'Day 2: Next.js & routing', 'Day 2: Styling with Tailwind CSS', 'Day 2: Deployment'],
        whatYouWillLearn: ['React component architecture', 'Modern JavaScript ES6+', 'CSS-in-JS with Tailwind', 'Server-side rendering', 'Deployment to Vercel'],
        requirements: ['Basic HTML/CSS knowledge', 'JavaScript fundamentals', 'Laptop with Node.js installed'],
    },
    {
        id: 4,
        title: 'T&P Placement Training',
        description: 'Complete placement preparation program',
        about: 'Comprehensive training program designed to prepare you for campus placements. Covers aptitude, technical tests, group discussions, and personal interviews. Includes company-specific preparation for top recruiters visiting your campus.',
        instructor: 'Dr. Rajesh Kumar',
        instructorTitle: 'TPO, University',
        duration: '6 weeks',
        tokenCost: 400,
        category: 'career',
        level: 'intermediate',
        enrolled: 200,
        maxEnrollment: 250,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        syllabus: ['Week 1-2: Aptitude & Reasoning', 'Week 3: Verbal & Communication', 'Week 4: Technical Skills', 'Week 5: GD & Personal Interview', 'Week 6: Mock Placements'],
        whatYouWillLearn: ['Aptitude problem-solving techniques', 'GD participation strategies', 'Interview body language', 'Resume optimization', 'Salary negotiation'],
        requirements: ['Active university enrollment', 'Minimum 6.0 CGPA', 'Regular attendance required'],
    },
    {
        id: 5,
        title: 'Mock Interview Sessions',
        description: 'Practice interviews with industry professionals',
        about: 'One-on-one mock interview sessions with professionals from leading companies. Get real-time feedback on your answers, body language, and communication skills. Choose from technical, HR, or managerial rounds based on your needs.',
        instructor: 'Various Industry Experts',
        instructorTitle: 'Hiring Managers',
        duration: '45 mins per session',
        tokenCost: 100,
        category: 'review',
        level: 'intermediate',
        enrolled: 150,
        maxEnrollment: 200,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a',
        syllabus: ['Pre-interview preparation', '45-minute mock interview', 'Real-time feedback', 'Improvement suggestions', 'Follow-up resources'],
        whatYouWillLearn: ['Handle pressure questions', 'Structure your answers', 'Present yourself confidently', 'Answer behavioral questions', 'Ask meaningful questions'],
        requirements: ['Prepared resume', 'Target role in mind', 'Quiet environment for interview'],
    },
];

const CourseDetailContent = () => {
    const params = useParams();
    const router = useRouter();
    const { userProfile, spendTokens } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const courseId = parseInt(params.id as string);
    const course = coursesData.find(c => c.id === courseId);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const showToastMessage = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleEnroll = () => {
        if (!course) return;

        const balance = userProfile?.tokens || 0;
        if (balance < course.tokenCost) {
            showToastMessage(`Insufficient tokens! You need ${course.tokenCost} EDU.`, 'error');
            return;
        }

        setIsEnrolling(true);

        setTimeout(() => {
            const success = spendTokens(course.tokenCost);
            if (success) {
                setIsEnrolled(true);
                showToastMessage(`Successfully enrolled in ${course.title}!`, 'success');
                setShowConfetti(true);
            } else {
                showToastMessage('Enrollment failed. Please try again.', 'error');
            }
            setIsEnrolling(false);
        }, 2000);
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

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-success/20 text-success';
            case 'intermediate': return 'bg-warning/20 text-warning';
            case 'advanced': return 'bg-error/20 text-error';
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

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Icon name="ExclamationCircleIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
                    <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
                    <p className="font-caption text-muted-foreground mb-4">The course you are looking for does not exist.</p>
                    <button
                        onClick={() => router.push('/courses')}
                        className="rounded-lg bg-primary px-4 py-2 font-caption text-sm font-medium text-primary-foreground"
                    >
                        Back to Courses
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
                    onClick={() => router.push('/courses')}
                    className="mb-6 flex items-center gap-2 font-caption text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                    <Icon name="ArrowLeftIcon" size={16} />
                    <span>Back to Courses</span>
                </button>

                {/* Hero Section */}
                <div className="relative rounded-xl overflow-hidden mb-8">
                    <img
                        src={`${course.image}?w=1400&h=400&fit=crop&auto=format`}
                        alt={course.title}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`rounded-full px-3 py-1 font-caption text-xs font-medium ${getCategoryColor(course.category)}`}>
                                {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                            </span>
                            <span className={`rounded-full px-3 py-1 font-caption text-xs font-medium ${getLevelColor(course.level)}`}>
                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                            </span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{course.title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">About This Course</h2>
                            <p className="font-caption text-muted-foreground leading-relaxed">{course.about}</p>
                        </div>

                        {/* What You'll Learn */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">What You Will Learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {course.whatYouWillLearn.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Icon name="CheckCircleIcon" size={16} className="text-success mt-0.5 flex-shrink-0" />
                                        <span className="font-caption text-sm text-muted-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Syllabus */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Course Syllabus</h2>
                            <div className="space-y-3">
                                {course.syllabus.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                                            <span className="font-mono text-sm font-bold text-primary">{index + 1}</span>
                                        </div>
                                        <span className="font-caption text-sm text-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Requirements</h2>
                            <ul className="space-y-2">
                                {course.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Icon name="ArrowRightIcon" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                        <span className="font-caption text-sm text-muted-foreground">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Enrollment Card */}
                        <div className="rounded-xl bg-card border border-border p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-caption text-sm text-muted-foreground">Course Fee</span>
                                <div className="flex items-center gap-1">
                                    <Icon name="CurrencyDollarIcon" size={18} className="text-primary" />
                                    <span className="font-mono text-xl font-bold text-primary">{course.tokenCost}</span>
                                    <span className="font-caption text-sm text-muted-foreground">EDU</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4 text-sm">
                                <span className="font-caption text-muted-foreground">Your Balance</span>
                                <span className="font-mono font-medium text-foreground">{userProfile?.tokens || 0} EDU</span>
                            </div>

                            <div className="flex items-center justify-between mb-6 text-sm">
                                <span className="font-caption text-muted-foreground">Enrolled</span>
                                <span className="font-caption text-foreground">{course.enrolled}/{course.maxEnrollment}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            name="StarIcon"
                                            size={14}
                                            className={i < Math.floor(course.rating) ? 'text-warning' : 'text-muted'}
                                        />
                                    ))}
                                </div>
                                <span className="font-caption text-sm text-foreground">{course.rating}</span>
                            </div>

                            {isEnrolled ? (
                                <div className="flex items-center justify-center gap-2 rounded-lg bg-success/20 border border-success/30 px-4 py-3">
                                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                                    <span className="font-caption text-sm font-medium text-success">Enrolled Successfully!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={isEnrolling}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isEnrolling ? (
                                        <>
                                            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                                            <span>Enrolling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="AcademicCapIcon" size={18} />
                                            <span>Enroll Using Tokens</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Instructor Card */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Instructor</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                    <Icon name="UserIcon" size={24} className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-caption text-sm font-medium text-foreground">{course.instructor}</p>
                                    <p className="font-caption text-xs text-muted-foreground">{course.instructorTitle}</p>
                                </div>
                            </div>
                        </div>

                        {/* Duration Card */}
                        <div className="rounded-xl bg-card border border-border p-6">
                            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Course Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Icon name="ClockIcon" size={18} className="text-muted-foreground" />
                                    <span className="font-caption text-sm text-foreground">{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="UserGroupIcon" size={18} className="text-muted-foreground" />
                                    <span className="font-caption text-sm text-foreground">{course.enrolled} students enrolled</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="AcademicCapIcon" size={18} className="text-muted-foreground" />
                                    <span className="font-caption text-sm text-foreground">{course.level.charAt(0).toUpperCase() + course.level.slice(1)} level</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

const CourseDetailPage = () => {
    return (
        <ProtectedRoute requiredRole="student">
            <DynamicNavbar />
            <CourseDetailContent />
        </ProtectedRoute>
    );
};

export default CourseDetailPage;
