'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const TermsPage = () => {
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
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using Learn2Earn (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Learn2Earn is a blockchain-powered educational platform that allows users to earn cryptocurrency tokens (L2E tokens) for completing courses, achieving milestones, and demonstrating academic progress. The platform also issues verifiable credentials as NFTs.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>You must be at least 13 years old to create an account</li>
                            <li>You are responsible for maintaining the security of your account credentials</li>
                            <li>You must provide accurate and complete information during registration</li>
                            <li>One person may not maintain more than one account</li>
                            <li>You are responsible for all activities that occur under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">4. Token Rewards</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            L2E tokens are earned based on legitimate academic activities verified by authorized administrators or faculty. Token rewards are subject to the following conditions:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Tokens are awarded only after verification by institutional authorities</li>
                            <li>Token values may fluctuate based on market conditions</li>
                            <li>Fraudulent activities will result in account suspension and forfeiture of tokens</li>
                            <li>We reserve the right to modify token reward structures with notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">5. Academic Integrity</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Users must maintain academic integrity. Cheating, plagiarism, or any form of academic dishonesty is strictly prohibited and will result in immediate account termination and forfeiture of all earned tokens.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">6. Blockchain Transactions</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All blockchain transactions are irreversible. Once tokens are transferred or certificates are minted, they cannot be reversed or deleted due to the immutable nature of blockchain technology. Users should carefully review all transactions before confirming.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All course content, platform design, and materials are owned by Learn2Earn or our content partners. Users may not reproduce, distribute, or create derivative works without explicit permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Learn2Earn is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to loss of tokens or cryptocurrency.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">9. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may suspend or terminate your account at any time for violation of these terms. Upon termination, you lose access to your account but may retain any tokens already transferred to external wallets.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">10. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or platform notification.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">11. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms of Service, please contact us at{' '}
                            <a href="mailto:legal@learn2earn.com" className="text-primary hover:underline">legal@learn2earn.com</a>.
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

export default TermsPage;
