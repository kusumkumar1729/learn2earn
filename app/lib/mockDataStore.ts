// Mock Data Store for Learn2Earn
// Uses localStorage to persist user-specific data

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    walletAddress: string;
    tokens: number;
    totalEarned: number;
    coursesCompleted: number;
    coursesInProgress: number;
    certificates: number;
    joinedDate: string;
    lastActive: string;
    avatar?: string;
    bio?: string;
    institution?: string;
    department?: string;
}

const STORAGE_KEY = 'learn2earn_users';
const ADMIN_SESSION_KEY = 'learn2earn_admin_session';

// Default profile template for new users
const createDefaultProfile = (id: string, name: string, email: string): UserProfile => ({
    id,
    name,
    email,
    walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    tokens: Math.floor(Math.random() * 100) + 50, // Random starting tokens 50-150
    totalEarned: 0,
    coursesCompleted: 0,
    coursesInProgress: 0,
    certificates: 0,
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    bio: '',
    institution: '',
    department: '',
});

// Get all users from localStorage
const getAllUsers = (): Record<string, UserProfile> => {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

// Save all users to localStorage
const saveAllUsers = (users: Record<string, UserProfile>): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Get user profile by ID (email or uid)
export const getUserProfile = (userId: string): UserProfile | null => {
    const users = getAllUsers();
    return users[userId] || null;
};

// Create or get user profile
export const getOrCreateUserProfile = (
    userId: string,
    name: string,
    email: string
): UserProfile => {
    const existingProfile = getUserProfile(userId);
    if (existingProfile) {
        // Update last active
        return updateUserProfile(userId, { lastActive: new Date().toISOString() }) || existingProfile;
    }

    // Create new profile
    const newProfile = createDefaultProfile(userId, name, email);
    const users = getAllUsers();
    users[userId] = newProfile;
    saveAllUsers(users);
    return newProfile;
};

// Update user profile
export const updateUserProfile = (
    userId: string,
    updates: Partial<UserProfile>
): UserProfile | null => {
    const users = getAllUsers();
    if (!users[userId]) return null;

    users[userId] = { ...users[userId], ...updates };
    saveAllUsers(users);
    return users[userId];
};

// Add tokens to user
export const addTokensToUser = (userId: string, amount: number): UserProfile | null => {
    const users = getAllUsers();
    if (!users[userId]) return null;

    users[userId].tokens += amount;
    users[userId].totalEarned += amount;
    saveAllUsers(users);
    return users[userId];
};

// Deduct tokens from user
export const deductTokensFromUser = (userId: string, amount: number): UserProfile | null => {
    const users = getAllUsers();
    if (!users[userId] || users[userId].tokens < amount) return null;

    users[userId].tokens -= amount;
    saveAllUsers(users);
    return users[userId];
};

// Delete user profile
export const deleteUserProfile = (userId: string): boolean => {
    const users = getAllUsers();
    if (!users[userId]) return false;

    delete users[userId];
    saveAllUsers(users);
    return true;
};

// Admin session management
export const setAdminSession = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
};

export const getAdminSession = (): boolean => {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!data) return false;
    const session = JSON.parse(data);
    // Session expires after 24 hours
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        clearAdminSession();
        return false;
    }
    return session.loggedIn === true;
};

export const clearAdminSession = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_SESSION_KEY);
};

// Get all users (for admin)
export const getAllUserProfiles = (): UserProfile[] => {
    const users = getAllUsers();
    return Object.values(users);
};
