'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="mx-auto max-w-4xl px-6 py-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-smooth">
                        <Icon name="ArrowLeftIcon" size={20} />
                        <span className="font-caption text-sm">Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-4xl px-6 py-12">
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Learn2Earn (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-powered educational platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                            <li>Name and email address when you create an account</li>
                            <li>Educational institution affiliation (if applicable)</li>
                            <li>Profile information you choose to provide</li>
                            <li>Blockchain wallet addresses for token transactions</li>
                        </ul>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Usage Information</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Course progress and completion data</li>
                            <li>Quiz scores and certification achievements</li>
                            <li>Token earnings and redemption history</li>
                            <li>Device information and IP addresses</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Provide and maintain our educational platform</li>
                            <li>Process token rewards and transactions</li>
                            <li>Issue blockchain-verified certificates</li>
                            <li>Personalize your learning experience</li>
                            <li>Communicate with you about your account and updates</li>
                            <li>Improve our services and develop new features</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Blockchain Data</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Certain information, including token transactions and NFT certificates, is recorded on the blockchain and is publicly visible. This data is immutable and cannot be deleted. We encourage you to consider this before engaging in blockchain transactions on our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your account (excluding blockchain data)</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent where applicable</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookies through your browser settings, though some features may not function properly without them.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have questions about this Privacy Policy or our data practices, please contact us at{' '}
                            <a href="mailto:privacy@learn2earn.com" className="text-primary hover:underline">privacy@learn2earn.com</a>.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8 mt-12">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Learn2Earn. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPage;
