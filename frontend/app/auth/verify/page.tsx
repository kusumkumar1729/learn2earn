'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function VerifyEmailPage() {
    const router = useRouter();

    useEffect(() => {
        // The actual verification is handled in AuthContext
        // This page just shows a loading state while the verification happens
        // After successful verification, the user will be redirected

        // If the user lands here without the email link parameters,
        // redirect to landing page after a short delay
        const timeout = setTimeout(() => {
            router.push('/landing-page');
        }, 5000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon name="EnvelopeOpenIcon" size={40} className="text-primary" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Verifying your email...
                </h1>
                <p className="mt-2 font-body text-muted-foreground">
                    Please wait while we sign you in
                </p>
                <div className="mt-6 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
        </div>
    );
}
