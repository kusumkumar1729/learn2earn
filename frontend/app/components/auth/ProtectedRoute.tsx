'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: UserRole;
    redirectTo?: string;
}

const ProtectedRoute = ({
    children,
    requiredRole = 'student',
    redirectTo,
}: ProtectedRouteProps) => {
    const router = useRouter();
    const { user, userRole, loading, isEmailVerified, isAdmin, isStudent } = useAuth();

    useEffect(() => {
        if (loading) return;

        // Allow dual-dashboard access - admin can access both dashboards
        // Only redirect unauthenticated users
        if (requiredRole === 'admin') {
            // Admin route - only block unauthenticated users
            if (!isAdmin) {
                router.replace(redirectTo || '/admin-login');
            }
        } else if (requiredRole === 'student') {
            // Student route - allow admin to access student pages too for testing/management
            // Only redirect if completely unauthenticated
            if (!user && !isAdmin) {
                router.replace(redirectTo || '/');
            }
        }
    }, [user, userRole, loading, isEmailVerified, isAdmin, isStudent, requiredRole, redirectTo, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Check authorization - show access denied for wrong role
    if (requiredRole === 'admin' && !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Icon name="ShieldExclamationIcon" size={48} className="mx-auto mb-4 text-error" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
                    <p className="text-muted-foreground">Redirecting to admin login...</p>
                </div>
            </div>
        );
    }

    // Allow admin to access student routes - no blocking
    // Admin can view student dashboard for testing and management purposes

    // For student routes, only block if completely unauthenticated (not admin, not student)
    if (requiredRole === 'student' && !user && !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Icon name="LockClosedIcon" size={48} className="mx-auto mb-4 text-warning" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Authentication Required</h2>
                    <p className="text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
