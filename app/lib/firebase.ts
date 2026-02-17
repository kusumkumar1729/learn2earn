// Firebase configuration for Learn2Earn
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';

// Firebase configuration from user's Firebase console
const firebaseConfig = {
    apiKey: 'AIzaSyB3MYeW0vzyP5nSEMozef9S2lQNPZAY4Z0',
    authDomain: 'learn2earn-43356.firebaseapp.com',
    projectId: 'learn2earn-43356',
    storageBucket: 'learn2earn-43356.firebasestorage.app',
    messagingSenderId: '861476641334',
    appId: '1:861476641334:web:278a778c3af16eb5241697',
    measurementId: 'G-HW55WFB64B',
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account',
});

// Export everything needed
export {
    app,
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    firebaseSignOut,
    onAuthStateChanged,
};

export type { User };
