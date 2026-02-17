// Admin Data Store
// Manages admin-specific data isolated from student state
// Uses separate localStorage keys for complete state isolation

// ─── Token Reward Config ────────────────────────────
export interface TokenRewardConfig {
    taskType: string;
    reward: number;
    icon: string;
    category: 'academic' | 'extracurricular' | 'certification';
}

export const TOKEN_REWARD_MAP: TokenRewardConfig[] = [
    { taskType: 'Attendance', reward: 50, icon: 'CalendarIcon', category: 'academic' },
    { taskType: 'Assignments', reward: 25, icon: 'DocumentIcon', category: 'academic' },
    { taskType: 'CGPA', reward: 200, icon: 'ChartBarIcon', category: 'academic' },
    { taskType: 'Semester', reward: 100, icon: 'AcademicCapIcon', category: 'academic' },
    { taskType: 'Records', reward: 30, icon: 'FolderIcon', category: 'academic' },
    { taskType: 'Courses', reward: 75, icon: 'BookOpenIcon', category: 'certification' },
    { taskType: 'Certificates', reward: 150, icon: 'CheckBadgeIcon', category: 'certification' },
    { taskType: 'Technical', reward: 100, icon: 'CodeBracketIcon', category: 'extracurricular' },
    { taskType: 'Cultural', reward: 50, icon: 'MusicalNoteIcon', category: 'extracurricular' },
    { taskType: 'Extracurricular', reward: 40, icon: 'UserGroupIcon', category: 'extracurricular' },
    { taskType: 'NFT Achievement', reward: 250, icon: 'SparklesIcon', category: 'certification' },
];

// ─── Service Types ──────────────────────────────────
export interface AdminService {
    id: string;
    name: string;
    type: 'hackathon' | 'course' | 'workshop' | 'merchandise';
    tokenCost: number;
    walletAddress: string;
    active: boolean;
    description: string;
    createdAt: string;
    enrollments: number;
}

// ─── Transaction Types ──────────────────────────────
export interface AdminTransaction {
    id: string;
    hash: string;
    type: 'transfer' | 'reward' | 'payment' | 'mint';
    from: string;
    to: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    timestamp: string;
    description: string;
}

// ─── NFT Certificate Types ──────────────────────────
export interface NFTCertificate {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    description: string;
    tokenId: string;
    issuedAt: string;
    status: 'active' | 'revoked';
    category: string;
}

// ─── Storage Keys (Isolated from student) ───────────
const ADMIN_SERVICES_KEY = 'admin_services';
const ADMIN_TRANSACTIONS_KEY = 'admin_transactions';
const ADMIN_NFT_CERTIFICATES_KEY = 'admin_nft_certificates';
const ADMIN_SETTINGS_KEY = 'admin_settings';

// ─── Services CRUD ──────────────────────────────────
export const getServices = (): AdminService[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ADMIN_SERVICES_KEY);
    if (data) return JSON.parse(data);
    // Seed with defaults
    const defaults = getDefaultServices();
    localStorage.setItem(ADMIN_SERVICES_KEY, JSON.stringify(defaults));
    return defaults;
};

export const addService = (service: Omit<AdminService, 'id' | 'createdAt' | 'enrollments'>): AdminService => {
    const services = getServices();
    const newService: AdminService = {
        ...service,
        id: `svc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        enrollments: 0,
    };
    services.push(newService);
    localStorage.setItem(ADMIN_SERVICES_KEY, JSON.stringify(services));
    return newService;
};

export const updateService = (id: string, updates: Partial<AdminService>): AdminService | null => {
    const services = getServices();
    const index = services.findIndex(s => s.id === id);
    if (index < 0) return null;
    services[index] = { ...services[index], ...updates };
    localStorage.setItem(ADMIN_SERVICES_KEY, JSON.stringify(services));
    return services[index];
};

export const deleteService = (id: string): boolean => {
    const services = getServices();
    const filtered = services.filter(s => s.id !== id);
    if (filtered.length === services.length) return false;
    localStorage.setItem(ADMIN_SERVICES_KEY, JSON.stringify(filtered));
    return true;
};

// ─── Transactions ───────────────────────────────────
export const getTransactions = (): AdminTransaction[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ADMIN_TRANSACTIONS_KEY);
    if (data) return JSON.parse(data);
    const defaults = getDefaultTransactions();
    localStorage.setItem(ADMIN_TRANSACTIONS_KEY, JSON.stringify(defaults));
    return defaults;
};

export const addTransaction = (tx: Omit<AdminTransaction, 'id' | 'hash' | 'timestamp'>): AdminTransaction => {
    const transactions = getTransactions();
    const newTx: AdminTransaction = {
        ...tx,
        id: `tx_${Date.now()}`,
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    localStorage.setItem(ADMIN_TRANSACTIONS_KEY, JSON.stringify(transactions));
    return newTx;
};

// ─── NFT Certificates ──────────────────────────────
export const getNFTCertificates = (): NFTCertificate[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ADMIN_NFT_CERTIFICATES_KEY);
    if (data) return JSON.parse(data);
    const defaults = getDefaultNFTs();
    localStorage.setItem(ADMIN_NFT_CERTIFICATES_KEY, JSON.stringify(defaults));
    return defaults;
};

export const issueNFTCertificate = (cert: Omit<NFTCertificate, 'id' | 'tokenId' | 'issuedAt' | 'status'>): NFTCertificate => {
    const certs = getNFTCertificates();
    const newCert: NFTCertificate = {
        ...cert,
        id: `nft_${Date.now()}`,
        tokenId: `#${Math.floor(Math.random() * 100000)}`,
        issuedAt: new Date().toISOString(),
        status: 'active',
    };
    certs.unshift(newCert);
    localStorage.setItem(ADMIN_NFT_CERTIFICATES_KEY, JSON.stringify(certs));
    return newCert;
};

export const revokeNFTCertificate = (id: string): boolean => {
    const certs = getNFTCertificates();
    const index = certs.findIndex(c => c.id === id);
    if (index < 0) return false;
    certs[index].status = 'revoked';
    localStorage.setItem(ADMIN_NFT_CERTIFICATES_KEY, JSON.stringify(certs));
    return true;
};

// ─── Admin Settings ─────────────────────────────────
export interface AdminSettings {
    platformName: string;
    autoApproveThreshold: number;
    maxTokensPerDay: number;
    maintenanceMode: boolean;
    notificationsEnabled: boolean;
}

export const getAdminSettings = (): AdminSettings => {
    if (typeof window === 'undefined') return defaultSettings;
    const data = localStorage.getItem(ADMIN_SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
};

export const updateAdminSettings = (updates: Partial<AdminSettings>): AdminSettings => {
    const current = getAdminSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
};

const defaultSettings: AdminSettings = {
    platformName: 'Learn2Earn',
    autoApproveThreshold: 0,
    maxTokensPerDay: 10000,
    maintenanceMode: false,
    notificationsEnabled: true,
};

// ─── Default/Seed Data ──────────────────────────────
function getDefaultServices(): AdminService[] {
    return [
        { id: 'svc_1', name: 'Blockchain Bootcamp', type: 'course', tokenCost: 200, walletAddress: '0x1a2b...3c4d', active: true, description: 'Comprehensive blockchain development course covering smart contracts, DApps, and Web3.', createdAt: '2026-01-15T10:00:00Z', enrollments: 234 },
        { id: 'svc_2', name: 'Web3 Hackathon 2026', type: 'hackathon', tokenCost: 150, walletAddress: '0x5e6f...7a8b', active: true, description: 'Annual hackathon for building decentralized applications.', createdAt: '2026-01-20T10:00:00Z', enrollments: 156 },
        { id: 'svc_3', name: 'DeFi Workshop', type: 'workshop', tokenCost: 75, walletAddress: '0x9c0d...1e2f', active: true, description: 'Hands-on workshop on DeFi protocols and yield farming.', createdAt: '2026-02-01T10:00:00Z', enrollments: 89 },
        { id: 'svc_4', name: 'Crypto Merch Pack', type: 'merchandise', tokenCost: 500, walletAddress: '0x3a4b...5c6d', active: false, description: 'Exclusive Learn2Earn branded merchandise package.', createdAt: '2026-02-05T10:00:00Z', enrollments: 45 },
        { id: 'svc_5', name: 'NFT Art Workshop', type: 'workshop', tokenCost: 100, walletAddress: '0x7e8f...9a0b', active: true, description: 'Learn to create and mint NFT digital artworks.', createdAt: '2026-02-10T10:00:00Z', enrollments: 112 },
    ];
}

function getDefaultTransactions(): AdminTransaction[] {
    const now = Date.now();
    return [
        { id: 'tx_1', hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', type: 'reward', from: 'Treasury', to: '0x1234...5678', amount: 50, status: 'completed', timestamp: new Date(now - 1000 * 60 * 5).toISOString(), description: 'Attendance reward for Sarah Johnson' },
        { id: 'tx_2', hash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567', type: 'transfer', from: '0x1234...5678', to: '0x9abc...def0', amount: 100, status: 'completed', timestamp: new Date(now - 1000 * 60 * 15).toISOString(), description: 'Token transfer between students' },
        { id: 'tx_3', hash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678', type: 'payment', from: '0x5678...9abc', to: 'Treasury', amount: 200, status: 'completed', timestamp: new Date(now - 1000 * 60 * 30).toISOString(), description: 'Blockchain Bootcamp enrollment' },
        { id: 'tx_4', hash: '0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789', type: 'mint', from: 'Contract', to: '0xdef0...1234', amount: 250, status: 'completed', timestamp: new Date(now - 1000 * 60 * 60).toISOString(), description: 'NFT Achievement mint' },
        { id: 'tx_5', hash: '0xe5f6789012345678901234567890abcdef1234567890abcdef1234567890', type: 'reward', from: 'Treasury', to: '0x3456...7890', amount: 75, status: 'pending', timestamp: new Date(now - 1000 * 60 * 90).toISOString(), description: 'Course completion reward' },
        { id: 'tx_6', hash: '0xf6789012345678901234567890abcdef1234567890abcdef12345678901', type: 'transfer', from: '0x7890...abcd', to: '0xbcde...f012', amount: 30, status: 'failed', timestamp: new Date(now - 1000 * 60 * 120).toISOString(), description: 'Failed peer transfer' },
        { id: 'tx_7', hash: '0x06789012345678901234567890abcdef1234567890abcdef123456789012', type: 'reward', from: 'Treasury', to: '0xef01...2345', amount: 100, status: 'completed', timestamp: new Date(now - 1000 * 60 * 180).toISOString(), description: 'Semester completion reward' },
        { id: 'tx_8', hash: '0x16789012345678901234567890abcdef1234567890abcdef1234567890123', type: 'payment', from: '0x2345...6789', to: 'Treasury', amount: 150, status: 'completed', timestamp: new Date(now - 1000 * 60 * 240).toISOString(), description: 'Web3 Hackathon registration' },
    ];
}

function getDefaultNFTs(): NFTCertificate[] {
    return [
        { id: 'nft_1', studentId: 'u1', studentName: 'Sarah Johnson', title: 'Blockchain Fundamentals Certification', description: 'Completed all blockchain fundamentals modules with distinction', tokenId: '#10234', issuedAt: '2026-01-25T10:00:00Z', status: 'active', category: 'Course Completion' },
        { id: 'nft_2', studentId: 'u2', studentName: 'Michael Chen', title: 'Smart Contract Developer Level 2', description: 'Passed advanced smart contract development assessment', tokenId: '#10235', issuedAt: '2026-02-01T10:00:00Z', status: 'active', category: 'Skill Certification' },
        { id: 'nft_3', studentId: 'u3', studentName: 'Emily Rodriguez', title: 'Hackathon Winner 2026', description: 'First place in Web3 Hackathon January 2026', tokenId: '#10236', issuedAt: '2026-02-05T10:00:00Z', status: 'active', category: 'Achievement' },
        { id: 'nft_4', studentId: 'u4', studentName: 'David Kim', title: 'DeFi Protocol Mastery', description: 'Mastered DeFi fundamentals including lending, borrowing, and yield', tokenId: '#10237', issuedAt: '2026-02-10T10:00:00Z', status: 'revoked', category: 'Course Completion' },
    ];
}

// ─── Analytics Helpers ──────────────────────────────
export const getAnalyticsSummary = () => {
    const transactions = getTransactions();
    const services = getServices();
    const certs = getNFTCertificates();

    const totalTokensIssued = transactions
        .filter(t => (t.type === 'reward' || t.type === 'mint') && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalTokensSpent = transactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

    return {
        totalTokensIssued,
        totalTokensSpent,
        pendingTransactions,
        totalServices: services.length,
        activeServices: services.filter(s => s.active).length,
        totalNFTs: certs.length,
        activeNFTs: certs.filter(c => c.status === 'active').length,
        totalEnrollments: services.reduce((sum, s) => sum + s.enrollments, 0),
    };
};
