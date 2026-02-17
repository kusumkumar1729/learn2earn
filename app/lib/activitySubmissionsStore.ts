// Activity Submissions Store
// Manages activity submission states in localStorage

export type SubmissionStatus = 'not_submitted' | 'pending' | 'approved' | 'redeemed';

export interface ActivitySubmission {
    activityId: number;
    activityTitle: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    status: SubmissionStatus;
    proofType: 'file' | 'text' | 'link' | 'percentage';
    proofValue: string;
    submittedAt: string;
    reviewedAt?: string;
    tokens: number;
}

const STORAGE_KEY = 'learn2earn_activity_submissions';

// Get all submissions from localStorage
export const getAllSubmissions = (): ActivitySubmission[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Get submissions for a specific student
export const getStudentSubmissions = (studentId: string): ActivitySubmission[] => {
    return getAllSubmissions().filter(s => s.studentId === studentId);
};

// Get pending submissions (for admin)
export const getPendingSubmissions = (): ActivitySubmission[] => {
    return getAllSubmissions().filter(s => s.status === 'pending');
};

// Get submission status for a specific activity and student
export const getActivityStatus = (activityId: number, studentId: string): SubmissionStatus => {
    const submissions = getAllSubmissions();
    const submission = submissions.find(
        s => s.activityId === activityId && s.studentId === studentId
    );
    return submission?.status || 'not_submitted';
};

// Get submission for a specific activity and student
export const getActivitySubmission = (activityId: number, studentId: string): ActivitySubmission | null => {
    const submissions = getAllSubmissions();
    return submissions.find(
        s => s.activityId === activityId && s.studentId === studentId
    ) || null;
};

// Submit an activity (student side)
export const submitActivity = (
    activityId: number,
    activityTitle: string,
    studentId: string,
    studentName: string,
    studentEmail: string,
    proofType: 'file' | 'text' | 'link' | 'percentage',
    proofValue: string,
    tokens: number
): boolean => {
    try {
        const submissions = getAllSubmissions();

        // Check if already submitted
        const existingIndex = submissions.findIndex(
            s => s.activityId === activityId && s.studentId === studentId
        );

        const newSubmission: ActivitySubmission = {
            activityId,
            activityTitle,
            studentId,
            studentName,
            studentEmail,
            status: 'pending',
            proofType,
            proofValue,
            submittedAt: new Date().toISOString(),
            tokens,
        };

        if (existingIndex >= 0) {
            submissions[existingIndex] = newSubmission;
        } else {
            submissions.push(newSubmission);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('submissionUpdated'));
        }
        return true;
    } catch {
        return false;
    }
};

// Approve a submission (admin side)
export const approveSubmission = (activityId: number, studentId: string): boolean => {
    try {
        const submissions = getAllSubmissions();
        const index = submissions.findIndex(
            s => s.activityId === activityId && s.studentId === studentId
        );

        if (index >= 0) {
            submissions[index].status = 'approved';
            submissions[index].reviewedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('submissionUpdated'));
            }
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

// Reject a submission (admin side) - resets to not_submitted
export const rejectSubmission = (activityId: number, studentId: string): boolean => {
    try {
        const submissions = getAllSubmissions();
        const index = submissions.findIndex(
            s => s.activityId === activityId && s.studentId === studentId
        );

        if (index >= 0) {
            // Remove the submission so student can resubmit
            submissions.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('submissionUpdated'));
            }
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

// Mark activity as redeemed (after tokens earned)
export const redeemActivity = (activityId: number, studentId: string): boolean => {
    try {
        const submissions = getAllSubmissions();
        const index = submissions.findIndex(
            s => s.activityId === activityId && s.studentId === studentId && s.status === 'approved'
        );

        if (index >= 0) {
            submissions[index].status = 'redeemed';
            localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('submissionUpdated'));
            }
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

// Clear all submissions (for testing)
export const clearAllSubmissions = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
};
