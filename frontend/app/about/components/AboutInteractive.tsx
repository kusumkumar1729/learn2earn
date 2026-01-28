'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

const AboutInteractive = () => {
    const { user, setShowAuthModal } = useAuth();

    const features = [
        {
            icon: 'AcademicCapIcon',
            title: 'Learn Valuable Skills',
            description: 'Access high-quality courses in blockchain, programming, finance, and more. Our curriculum is designed by industry experts.',
            color: 'primary',
        },
        {
            icon: 'CurrencyDollarIcon',
            title: 'Earn Cryptocurrency',
            description: 'Complete courses, quizzes, and assignments to earn L2E tokens. The more you learn, the more you earn.',
            color: 'secondary',
        },
        {
            icon: 'ShieldCheckIcon',
            title: 'Blockchain Verified',
            description: 'All your achievements and certificates are stored on the blockchain, providing immutable proof of your skills.',
            color: 'accent',
        },
        {
            icon: 'UserGroupIcon',
            title: 'Community Driven',
            description: 'Join a global community of learners and educators. Share knowledge, collaborate on projects, and grow together.',
            color: 'warning',
        },
    ];

    const howItWorks = [
        {
            step: 1,
            title: 'Create Your Account',
            description: 'Sign up using your email or Google account. It takes less than a minute to get started.',
        },
        {
            step: 2,
            title: 'Choose Your Courses',
            description: 'Browse our extensive library of courses and select topics that interest you or align with your career goals.',
        },
        {
            step: 3,
            title: 'Learn & Complete',
            description: 'Watch videos, read materials, and complete quizzes to demonstrate your understanding of the subject matter.',
        },
        {
            step: 4,
            title: 'Earn L2E Tokens',
            description: 'Every completed lesson, quiz, and course earns you L2E tokens. Track your earnings in real-time on your dashboard.',
        },
        {
            step: 5,
            title: 'Redeem or Trade',
            description: 'Use your tokens to access premium courses, trade them on exchanges, or convert them to other cryptocurrencies.',
        },
    ];

    const tokenomics = [
        { label: 'Total Supply', value: '100,000,000 L2E' },
        { label: 'Learning Rewards', value: '40%' },
        { label: 'Team & Advisors', value: '15%' },
        { label: 'Development', value: '20%' },
        { label: 'Community', value: '15%' },
        { label: 'Reserve', value: '10%' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

                <div className="relative mx-auto max-w-[1200px] px-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
                        <Icon name="SparklesIcon" size={16} className="text-primary" />
                        <span className="font-caption text-sm font-medium text-primary">
                            Revolutionary Education Platform
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                        Welcome to <span className="text-primary">Learn2Earn</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl font-body text-lg text-muted-foreground md:text-xl">
                        Learn2Earn is a blockchain-powered education platform that transforms your learning journey
                        into tangible cryptocurrency rewards. We believe education should be accessible, engaging,
                        and rewarding.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="mx-auto max-w-[1200px] px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                                Our Mission
                            </h2>
                            <p className="mt-4 font-body text-lg text-muted-foreground">
                                We are on a mission to democratize education and create a world where everyone
                                can learn valuable skills and be fairly compensated for their efforts.
                            </p>
                            <p className="mt-4 font-body text-muted-foreground">
                                Traditional education systems often fail to incentivize learners properly.
                                Learn2Earn changes this by introducing a token-based reward system that
                                recognizes and rewards every step of your learning journey.
                            </p>
                            <p className="mt-4 font-body text-muted-foreground">
                                Whether you&apos;re a student looking to gain new skills, a professional seeking
                                to upskill, or simply curious about blockchain technology, Learn2Earn provides
                                the perfect platform to learn and earn simultaneously.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl bg-card p-6 border border-border transition-smooth hover:border-primary/40 hover:shadow-glow-md"
                                >
                                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}/10`}>
                                        <Icon name={feature.icon} size={24} className={`text-${feature.color}`} />
                                    </div>
                                    <h3 className="font-heading text-lg font-bold text-foreground">{feature.title}</h3>
                                    <p className="mt-2 font-body text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-muted/30 py-20">
                <div className="mx-auto max-w-[1200px] px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                            How It Works
                        </h2>
                        <p className="mt-4 font-body text-lg text-muted-foreground">
                            Getting started with Learn2Earn is simple
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-5">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-xl font-bold">
                                    {item.step}
                                </div>
                                <h3 className="font-heading text-lg font-bold text-foreground">{item.title}</h3>
                                <p className="mt-2 font-body text-sm text-muted-foreground">{item.description}</p>
                                {index < howItWorks.length - 1 && (
                                    <div className="hidden md:block absolute top-7 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tokenomics */}
            <section className="py-20">
                <div className="mx-auto max-w-[1200px] px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                            L2E Tokenomics
                        </h2>
                        <p className="mt-4 font-body text-lg text-muted-foreground">
                            Our token distribution is designed for sustainability and growth
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tokenomics.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-2xl bg-card p-6 border border-border text-center"
                            >
                                <p className="font-heading text-3xl font-bold text-primary">{item.value}</p>
                                <p className="mt-2 font-caption text-sm text-muted-foreground">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology */}
            <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
                <div className="mx-auto max-w-[1200px] px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                                Powered by Blockchain
                            </h2>
                            <p className="mt-4 font-body text-lg text-muted-foreground">
                                Learn2Earn is built on cutting-edge blockchain technology to ensure
                                transparency, security, and true ownership of your rewards.
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-start gap-3">
                                    <Icon name="CheckCircleIcon" size={24} className="text-success mt-0.5" />
                                    <div>
                                        <p className="font-caption font-medium text-foreground">Transparent Transactions</p>
                                        <p className="font-body text-sm text-muted-foreground">All token transfers are recorded on the blockchain for full transparency.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Icon name="CheckCircleIcon" size={24} className="text-success mt-0.5" />
                                    <div>
                                        <p className="font-caption font-medium text-foreground">Smart Contracts</p>
                                        <p className="font-body text-sm text-muted-foreground">Automated reward distribution through secure smart contracts.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Icon name="CheckCircleIcon" size={24} className="text-success mt-0.5" />
                                    <div>
                                        <p className="font-caption font-medium text-foreground">NFT Certificates</p>
                                        <p className="font-body text-sm text-muted-foreground">Earn NFT certificates that prove your achievements forever.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Icon name="CheckCircleIcon" size={24} className="text-success mt-0.5" />
                                    <div>
                                        <p className="font-caption font-medium text-foreground">Decentralized Governance</p>
                                        <p className="font-body text-sm text-muted-foreground">Token holders can vote on platform decisions and future developments.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-2xl bg-card p-8 border border-border">
                            <div className="text-center">
                                <Icon name="CubeTransparentIcon" size={64} className="mx-auto text-primary" />
                                <h3 className="mt-4 font-heading text-xl font-bold text-foreground">Built for the Future</h3>
                                <p className="mt-2 font-body text-muted-foreground">
                                    Our infrastructure is designed to scale with millions of learners worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="mx-auto max-w-[1200px] px-6 text-center">
                    <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                        Ready to Start Learning & Earning?
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
                        Join thousands of learners who are already earning cryptocurrency
                        while building valuable skills.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-caption text-base font-medium text-primary-foreground shadow-glow-md transition-smooth hover:scale-[0.98] hover:shadow-glow-lg"
                            >
                                <Icon name="RocketLaunchIcon" size={20} />
                                <span>Go to Dashboard</span>
                                <Icon name="ArrowRightIcon" size={20} className="transition-smooth group-hover:translate-x-1" />
                            </Link>
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-caption text-base font-medium text-primary-foreground shadow-glow-md transition-smooth hover:scale-[0.98] hover:shadow-glow-lg"
                            >
                                <Icon name="RocketLaunchIcon" size={20} />
                                <span>Get Started Now</span>
                                <Icon name="ArrowRightIcon" size={20} className="transition-smooth group-hover:translate-x-1" />
                            </button>
                        )}
                        <Link
                            href="/landing-page"
                            className="flex items-center gap-2 rounded-xl border-2 border-border px-8 py-4 font-caption text-base font-medium text-foreground transition-smooth hover:border-primary/40 hover:bg-muted"
                        >
                            <Icon name="HomeIcon" size={20} />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutInteractive;
