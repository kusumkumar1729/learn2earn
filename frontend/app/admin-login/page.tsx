'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

const AdminLoginPage = () => {
    const router = useRouter();
    const { adminLogin, isAdmin, error, clearError } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAdmin) {
            router.replace('/admindashboard');
        }
    }, [isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!username.trim()) {
            setLocalError('Username is required');
            return;
        }
        if (!password.trim()) {
            setLocalError('Password is required');
            return;
        }

        setIsLoading(true);
        const success = await adminLogin(username, password);
        setIsLoading(false);

        if (success) {
            router.push('/admindashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Back to Home */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8"
                >
                    <Icon name="ArrowLeftIcon" size={20} />
                    <span className="font-caption text-sm">Back to Home</span>
                </Link>

                {/* Login Card */}
                <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border p-8 shadow-glow-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Icon name="ShieldCheckIcon" size={32} className="text-primary" />
                        </div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">Admin Login</h1>
                        <p className="mt-2 font-body text-sm text-muted-foreground">
                            Access the administration dashboard
                        </p>
                    </div>

                    {/* Error Display */}
                    {(localError || error) && (
                        <div className="mb-6 rounded-lg bg-error/10 border border-error/20 p-4">
                            <div className="flex items-center gap-2">
                                <Icon name="ExclamationCircleIcon" size={20} className="text-error" />
                                <span className="font-caption text-sm text-error">{localError || error}</span>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block font-caption text-sm font-medium text-foreground mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Icon name="UserIcon" size={20} className="text-muted-foreground" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block font-caption text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Icon name="LockClosedIcon" size={20} className="text-muted-foreground" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-12 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-caption text-base font-medium text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <Icon name="ArrowRightOnRectangleIcon" size={20} />
                                    <span>Sign In as Admin</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-8 text-center">
                        <p className="font-caption text-xs text-muted-foreground">
                            This portal is for authorized administrators only.
                        </p>
                    </div>
                </div>

                {/* Student Login Link */}
                <div className="mt-6 text-center">
                    <p className="font-caption text-sm text-muted-foreground">
                        Are you a student?{' '}
                        <Link href="/" className="text-primary hover:underline">
                            Go to student login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
