'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';

type AuthStep = 'options' | 'signup' | 'signin' | 'verify';

const AuthModal = () => {
    const router = useRouter();
    const {
        user,
        showAuthModal,
        setShowAuthModal,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        resendVerificationEmail,
        loading,
        error,
        clearError,
        isEmailVerified,
    } = useAuth();

    const [step, setStep] = useState<AuthStep>('options');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Reset state when modal opens
    useEffect(() => {
        if (showAuthModal) {
            setStep('options');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setIsClosing(false);
            setLocalError(null);
            clearError();
        }
    }, [showAuthModal, clearError]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setShowAuthModal(false);
            setIsClosing(false);
        }, 200);
    }, [setShowAuthModal]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showAuthModal) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showAuthModal, handleClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showAuthModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showAuthModal]);

    // Auto-close modal and redirect when user is verified
    useEffect(() => {
        if (user && isEmailVerified) {
            handleClose();
            router.push('/student-dashboard');
        }
    }, [user, isEmailVerified, router, handleClose]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleGoogleSignIn = async () => {
        const success = await signInWithGoogle();
        if (success) {
            handleClose();
            router.push('/student-dashboard');
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!name.trim()) {
            setLocalError('Please enter your name');
            return;
        }
        if (!email.trim()) {
            setLocalError('Please enter your email');
            return;
        }
        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        const success = await signUpWithEmail(email.trim(), password, name.trim());
        if (success) {
            setStep('verify');
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!email.trim()) {
            setLocalError('Please enter your email');
            return;
        }
        if (!password) {
            setLocalError('Please enter your password');
            return;
        }

        const success = await signInWithEmail(email.trim(), password);
        if (success) {
            handleClose();
            router.push('/student-dashboard');
        }
    };

    const handleResendVerification = async () => {
        if (resendCooldown > 0) return;

        const success = await resendVerificationEmail();
        if (success) {
            setResendCooldown(60);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const displayError = localError || error;

    if (!showAuthModal) return null;

    return (
        <div
            className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
                }`}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

            {/* Modal */}
            <div
                className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border shadow-2xl ${isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Close"
                >
                    <Icon name="XMarkIcon" size={20} />
                </button>

                {/* Content */}
                <div className="p-8">
                    {/* Options Step */}
                    {step === 'options' && (
                        <div className="animate-slideIn">
                            {/* Header */}
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <Icon name="AcademicCapIcon" size={32} className="text-primary" />
                                </div>
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Welcome to Learn2Earn
                                </h2>
                                <p className="mt-2 font-body text-muted-foreground">
                                    Sign in to start earning while learning
                                </p>
                            </div>

                            {/* Error Message */}
                            {displayError && (
                                <div className="mb-6 rounded-lg bg-error/10 p-4 text-center">
                                    <p className="font-caption text-sm text-error">{displayError}</p>
                                </div>
                            )}

                            {/* Google Sign In */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 font-caption text-base font-medium text-gray-900 shadow-lg transition-smooth hover:scale-[0.98] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                                ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                )}
                                <span>Continue with Google</span>
                            </button>

                            {/* Divider */}
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-border" />
                                <span className="mx-4 font-caption text-sm text-muted-foreground">or</span>
                                <div className="flex-1 border-t border-border" />
                            </div>

                            {/* Email Options */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        clearError();
                                        setLocalError(null);
                                        setStep('signup');
                                    }}
                                    disabled={loading}
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-card px-6 py-4 font-caption text-base font-medium text-foreground transition-smooth hover:border-primary/40 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Icon name="UserPlusIcon" size={20} className="text-primary" />
                                    <span>Create Account</span>
                                </button>

                                <button
                                    onClick={() => {
                                        clearError();
                                        setLocalError(null);
                                        setStep('signin');
                                    }}
                                    disabled={loading}
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-card px-6 py-4 font-caption text-base font-medium text-foreground transition-smooth hover:border-primary/40 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={20} className="text-primary" />
                                    <span>Sign In with Email</span>
                                </button>
                            </div>

                            {/* Terms */}
                            <p className="mt-6 text-center font-caption text-xs text-muted-foreground">
                                By continuing, you agree to our{' '}
                                <a href="#" className="text-primary hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    )}

                    {/* Sign Up Step */}
                    {step === 'signup' && (
                        <div className="animate-slideIn">
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    clearError();
                                    setLocalError(null);
                                    setStep('options');
                                }}
                                className="mb-6 flex items-center gap-2 font-caption text-sm text-muted-foreground transition-smooth hover:text-foreground"
                            >
                                <Icon name="ArrowLeftIcon" size={16} />
                                <span>Back</span>
                            </button>

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Create Account
                                </h2>
                                <p className="mt-2 font-body text-sm text-muted-foreground">
                                    Enter your details to get started
                                </p>
                            </div>

                            {/* Error Message */}
                            {displayError && (
                                <div className="mb-4 rounded-lg bg-error/10 p-3 text-center">
                                    <p className="font-caption text-sm text-error">{displayError}</p>
                                </div>
                            )}

                            {/* Sign Up Form */}
                            <form onSubmit={handleSignUp}>
                                {/* Name Input */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="mb-2 block font-caption text-sm text-foreground">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-border bg-input px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="mb-4">
                                    <label htmlFor="signup-email" className="mb-2 block font-caption text-sm text-foreground">
                                        Email Address
                                    </label>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-border bg-input px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="mb-4">
                                    <label htmlFor="signup-password" className="mb-2 block font-caption text-sm text-foreground">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signup-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className="w-full rounded-xl border border-border bg-input px-4 py-3 pr-12 font-body text-base text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="mb-6">
                                    <label htmlFor="confirm-password" className="mb-2 block font-caption text-sm text-foreground">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        className="w-full rounded-xl border border-border bg-input px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-caption text-base font-medium text-primary-foreground shadow-glow-md transition-smooth hover:scale-[0.98] hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="UserPlusIcon" size={20} />
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <p className="mt-6 text-center font-caption text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <button
                                    onClick={() => {
                                        clearError();
                                        setLocalError(null);
                                        setStep('signin');
                                    }}
                                    className="text-primary hover:underline"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Sign In Step */}
                    {step === 'signin' && (
                        <div className="animate-slideIn">
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    clearError();
                                    setLocalError(null);
                                    setStep('options');
                                }}
                                className="mb-6 flex items-center gap-2 font-caption text-sm text-muted-foreground transition-smooth hover:text-foreground"
                            >
                                <Icon name="ArrowLeftIcon" size={16} />
                                <span>Back</span>
                            </button>

                            {/* Header */}
                            <div className="mb-6 text-center">
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Welcome Back
                                </h2>
                                <p className="mt-2 font-body text-sm text-muted-foreground">
                                    Sign in to your account
                                </p>
                            </div>

                            {/* Error Message */}
                            {displayError && (
                                <div className="mb-4 rounded-lg bg-error/10 p-3 text-center">
                                    <p className="font-caption text-sm text-error">{displayError}</p>
                                </div>
                            )}

                            {/* Sign In Form */}
                            <form onSubmit={handleSignIn}>
                                {/* Email Input */}
                                <div className="mb-4">
                                    <label htmlFor="signin-email" className="mb-2 block font-caption text-sm text-foreground">
                                        Email Address
                                    </label>
                                    <input
                                        id="signin-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-border bg-input px-4 py-3 font-body text-base text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="mb-6">
                                    <label htmlFor="signin-password" className="mb-2 block font-caption text-sm text-foreground">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signin-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full rounded-xl border border-border bg-input px-4 py-3 pr-12 font-body text-base text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-caption text-base font-medium text-primary-foreground shadow-glow-md transition-smooth hover:scale-[0.98] hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="ArrowRightOnRectangleIcon" size={20} />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <p className="mt-6 text-center font-caption text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <button
                                    onClick={() => {
                                        clearError();
                                        setLocalError(null);
                                        setStep('signup');
                                    }}
                                    className="text-primary hover:underline"
                                >
                                    Create one
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Verify Email Step */}
                    {step === 'verify' && (
                        <div className="animate-slideIn">
                            {/* Header */}
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10">
                                    <Icon name="EnvelopeIcon" size={32} className="text-warning" />
                                </div>
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Verify Your Email
                                </h2>
                                <p className="mt-2 font-body text-muted-foreground">
                                    We sent a verification link to
                                </p>
                                <p className="mt-1 font-caption text-lg font-medium text-foreground">
                                    {email}
                                </p>
                            </div>

                            {/* Error Message */}
                            {displayError && (
                                <div className="mb-6 rounded-lg bg-error/10 p-4 text-center">
                                    <p className="font-caption text-sm text-error">{displayError}</p>
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="mb-6 rounded-xl bg-muted/50 p-4">
                                <div className="flex items-start gap-3">
                                    <Icon name="InformationCircleIcon" size={20} className="mt-0.5 text-primary" />
                                    <div>
                                        <p className="font-caption text-sm text-foreground">
                                            Click the link in your email to verify your account.
                                        </p>
                                        <p className="mt-1 font-caption text-sm text-muted-foreground">
                                            After verifying, you can sign in with your email and password.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleResendVerification}
                                    disabled={loading || resendCooldown > 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-6 py-3 font-caption text-sm font-medium text-foreground transition-smooth hover:border-primary/40 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
                                    ) : (
                                        <Icon name="ArrowPathIcon" size={18} />
                                    )}
                                    <span>
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        clearError();
                                        setLocalError(null);
                                        setStep('signin');
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98]"
                                >
                                    <Icon name="ArrowRightOnRectangleIcon" size={18} />
                                    <span>Go to Sign In</span>
                                </button>

                                <button
                                    onClick={handleClose}
                                    className="font-caption text-sm text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    Close this window
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scaleOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-fadeOut { animation: fadeOut 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-scaleOut { animation: scaleOut 0.2s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default AuthModal;
