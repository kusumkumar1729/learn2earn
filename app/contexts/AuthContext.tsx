'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    firebaseSignOut,
    onAuthStateChanged,
    User,
} from '@/lib/firebase';
import {
    UserProfile,
    getOrCreateUserProfile,
    getUserProfile,
    updateUserProfile as updateMockProfile,
    addTokensToUser,
    deductTokensFromUser,
    setAdminSession,
    getAdminSession,
    clearAdminSession,
} from '@/lib/mockDataStore';

// Admin credentials (frontend only - for demo purposes)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin@1729',
};

export type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
    user: User | null;
    userRole: UserRole;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
    showAuthModal: boolean;
    setShowAuthModal: (show: boolean) => void;
    signInWithGoogle: () => Promise<boolean>;
    signUpWithEmail: (email: string, password: string, name: string) => Promise<boolean>;
    signInWithEmail: (email: string, password: string) => Promise<boolean>;
    resendVerificationEmail: () => Promise<boolean>;
    signOut: () => Promise<void>;
    adminLogin: (username: string, password: string) => Promise<boolean>;
    adminLogout: () => void;
    updateUserProfile: (updates: Partial<UserProfile>) => void;
    earnTokens: (amount: number) => boolean;
    spendTokens: (amount: number) => boolean;
    clearError: () => void;
    isEmailVerified: boolean;
    isAdmin: boolean;
    isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    // Separate admin session state — independent of student/Firebase auth
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    // Initialize user profile when user changes
    const initializeUserProfile = useCallback((currentUser: User) => {
        const profile = getOrCreateUserProfile(
            currentUser.uid,
            currentUser.displayName || 'Student',
            currentUser.email || ''
        );
        setUserProfile(profile);
        setUserRole('student');
    }, []);

    // Check for existing admin session on mount
    useEffect(() => {
        if (getAdminSession()) {
            setIsAdminLoggedIn(true);
            // Also set userRole for backward compatibility if no student is logged in
            setUserRole('admin');
        }
    }, []);

    // Listen for auth state changes — only manages student session, never touches admin state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser && currentUser.emailVerified) {
                setShowAuthModal(false);
                initializeUserProfile(currentUser);
            } else if (!currentUser) {
                // Only clear student-related state, never touch admin session
                setUserRole((prev) => prev === 'student' ? null : prev);
                setUserProfile(null);
            }
        });

        return () => unsubscribe();
    }, [initializeUserProfile]);

    // Derived auth state — admin and student are INDEPENDENT
    const isEmailVerified = user?.emailVerified ?? false;
    const isAdmin = isAdminLoggedIn;
    const isStudent = (!!user && isEmailVerified) || userRole === 'student';

    // Google Sign In
    const signInWithGoogle = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                initializeUserProfile(result.user);
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to sign in with Google';

            if (errorMessage.includes('popup-closed-by-user')) {
                setError('Sign-in was cancelled');
            } else if (errorMessage.includes('popup-blocked')) {
                setError('Popup was blocked. Please allow popups and try again.');
            } else {
                setError(errorMessage);
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, [initializeUserProfile]);

    // Sign Up with Email and Password
    const signUpWithEmail = useCallback(
        async (email: string, password: string, name: string): Promise<boolean> => {
            try {
                setError(null);
                setLoading(true);

                // Create user account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // Update display name
                await updateProfile(userCredential.user, {
                    displayName: name,
                });

                // Send verification email
                await sendEmailVerification(userCredential.user);

                // Pre-create profile (will be activated after email verification)
                getOrCreateUserProfile(userCredential.user.uid, name, email);

                return true;
            } catch (err: unknown) {
                console.error('Sign up error:', err);

                let errorCode = '';
                let errorMessage = 'Failed to create account';

                if (err && typeof err === 'object') {
                    if ('code' in err) {
                        errorCode = String(err.code);
                    }
                    if ('message' in err) {
                        errorMessage = String(err.message);
                    }
                }

                if (errorCode === 'auth/email-already-in-use') {
                    setError('This email is already registered. Please sign in instead.');
                } else if (errorCode === 'auth/invalid-email') {
                    setError('Invalid email address.');
                } else if (errorCode === 'auth/weak-password') {
                    setError('Password is too weak. Please use at least 6 characters.');
                } else if (errorCode === 'auth/operation-not-allowed') {
                    setError('Email/password accounts are not enabled. Please contact support.');
                } else {
                    setError(`Error: ${errorCode || errorMessage}`);
                }

                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Sign In with Email and Password
    const signInWithEmail = useCallback(
        async (email: string, password: string): Promise<boolean> => {
            try {
                setError(null);
                setLoading(true);

                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                // Check if email is verified
                if (!userCredential.user.emailVerified) {
                    setError('Please verify your email before signing in. Check your inbox for the verification link.');
                    return false;
                }

                // Initialize profile for verified user
                initializeUserProfile(userCredential.user);

                return true;
            } catch (err: unknown) {
                console.error('Sign in error:', err);

                let errorCode = '';
                let errorMessage = 'Failed to sign in';

                if (err && typeof err === 'object') {
                    if ('code' in err) {
                        errorCode = String(err.code);
                    }
                    if ('message' in err) {
                        errorMessage = String(err.message);
                    }
                }

                if (errorCode === 'auth/user-not-found') {
                    setError('No account found with this email. Please sign up first.');
                } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
                    setError('Incorrect password. Please try again.');
                } else if (errorCode === 'auth/invalid-email') {
                    setError('Invalid email address.');
                } else if (errorCode === 'auth/user-disabled') {
                    setError('This account has been disabled. Please contact support.');
                } else if (errorCode === 'auth/too-many-requests') {
                    setError('Too many failed attempts. Please try again later.');
                } else {
                    setError(`Error: ${errorCode || errorMessage}`);
                }

                return false;
            } finally {
                setLoading(false);
            }
        },
        [initializeUserProfile]
    );

    // Resend Verification Email
    const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);
            setLoading(true);

            if (!user) {
                setError('No user is signed in.');
                return false;
            }

            await sendEmailVerification(user);
            return true;
        } catch (err: unknown) {
            console.error('Resend verification error:', err);

            let errorCode = '';

            if (err && typeof err === 'object' && 'code' in err) {
                errorCode = String(err.code);
            }

            if (errorCode === 'auth/too-many-requests') {
                setError('Please wait before requesting another verification email.');
            } else {
                setError('Failed to send verification email. Please try again.');
            }

            return false;
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Admin Login — completely independent of student session
    const adminLogin = useCallback(async (username: string, password: string): Promise<boolean> => {
        setError(null);

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            setAdminSession();
            setIsAdminLoggedIn(true);
            setUserRole('admin');
            return true;
        }

        setError('Invalid admin credentials');
        return false;
    }, []);

    // Admin Logout — only clears admin state, preserves student session
    const adminLogout = useCallback(() => {
        clearAdminSession();
        setIsAdminLoggedIn(false);
        // Restore student role if a student is still logged in via Firebase
        if (user && user.emailVerified) {
            setUserRole('student');
        } else {
            setUserRole(null);
        }
    }, [user]);

    // Sign Out (Student)
    const signOut = useCallback(async () => {
        try {
            setError(null);
            await firebaseSignOut(auth);
            setUserRole(null);
            setUserProfile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign out');
        }
    }, []);

    // Update User Profile
    const updateUserProfileData = useCallback((updates: Partial<UserProfile>) => {
        if (!user || !userProfile) return;

        const updatedProfile = updateMockProfile(user.uid, updates);
        if (updatedProfile) {
            setUserProfile(updatedProfile);
        }
    }, [user, userProfile]);

    // Refresh user profile from storage
    useEffect(() => {
        if (user && userRole === 'student') {
            const profile = getUserProfile(user.uid);
            if (profile) {
                setUserProfile(profile);
            }
        }
    }, [user, userRole]);

    // Clear Error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Earn Tokens - increases token balance
    const earnTokens = useCallback((amount: number): boolean => {
        if (!user || !userProfile || amount <= 0) return false;

        const updatedProfile = addTokensToUser(user.uid, amount);
        if (updatedProfile) {
            setUserProfile(updatedProfile);
            return true;
        }
        return false;
    }, [user, userProfile]);

    // Spend Tokens - decreases token balance
    const spendTokens = useCallback((amount: number): boolean => {
        if (!user || !userProfile || amount <= 0) return false;
        if (userProfile.tokens < amount) return false;

        const updatedProfile = deductTokensFromUser(user.uid, amount);
        if (updatedProfile) {
            setUserProfile(updatedProfile);
            return true;
        }
        return false;
    }, [user, userProfile]);

    const value: AuthContextType = {
        user,
        userRole,
        userProfile,
        loading,
        error,
        showAuthModal,
        setShowAuthModal,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        resendVerificationEmail,
        signOut,
        adminLogin,
        adminLogout,
        updateUserProfile: updateUserProfileData,
        earnTokens,
        spendTokens,
        clearError,
        isEmailVerified,
        isAdmin,
        isStudent,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
