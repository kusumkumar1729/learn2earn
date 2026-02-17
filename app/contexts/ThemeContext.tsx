'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface ThemeSettings {
    mode: 'dark' | 'light';
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    highContrast: boolean;
}

interface ThemeContextType {
    theme: ThemeSettings;
    updateTheme: (settings: Partial<ThemeSettings>) => void;
    resetTheme: () => void;
}

const defaultTheme: ThemeSettings = {
    mode: 'dark',
    accentColor: '#F59E0B',
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'learn2earn_theme';

// Font size mapping
const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
};

// Accent color to HSL mapping for CSS variables
const accentColorMap: Record<string, { h: number; s: number; l: number }> = {
    '#F59E0B': { h: 43, s: 96, l: 56 },  // Amber (default)
    '#3B82F6': { h: 217, s: 91, l: 60 }, // Blue
    '#10B981': { h: 160, s: 84, l: 39 }, // Emerald
    '#EF4444': { h: 0, s: 84, l: 60 },   // Red
    '#8B5CF6': { h: 258, s: 90, l: 66 }, // Purple
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
            try {
                const parsed = JSON.parse(savedTheme);
                setTheme({ ...defaultTheme, ...parsed });
            } catch {
                console.error('Failed to parse saved theme');
            }
        }
        setIsHydrated(true);
    }, []);

    // Apply theme changes to document
    useEffect(() => {
        if (!isHydrated) return;

        const root = document.documentElement;

        // Apply dark/light mode
        if (theme.mode === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }

        // Apply font size
        root.style.fontSize = fontSizeMap[theme.fontSize];

        // Apply accent color
        const accentHSL = accentColorMap[theme.accentColor] || accentColorMap['#F59E0B'];
        root.style.setProperty('--primary', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);

        // Apply reduced motion
        if (theme.reducedMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }

        // Apply high contrast
        if (theme.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Save to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    }, [theme, isHydrated]);

    const updateTheme = useCallback((settings: Partial<ThemeSettings>) => {
        setTheme(prev => ({ ...prev, ...settings }));
    }, []);

    const resetTheme = useCallback(() => {
        setTheme(defaultTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
