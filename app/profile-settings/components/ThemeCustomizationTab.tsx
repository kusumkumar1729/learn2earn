'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useTheme, ThemeSettings } from '@/contexts/ThemeContext';

const ThemeCustomizationTab: React.FC = () => {
    const { theme, updateTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [localSettings, setLocalSettings] = useState<ThemeSettings>(theme);

    // Sync local settings with theme context
    useEffect(() => {
        setLocalSettings(theme);
    }, [theme]);

    const handleSettingChange = (key: keyof ThemeSettings, value: string | boolean) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        // Apply immediately for live preview
        updateTheme({ [key]: value });
    };

    const handleSave = () => {
        setIsSaving(true);
        // Settings are already saved via updateTheme, just show confirmation
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 500);
    };

    const handleReset = () => {
        const defaultSettings: ThemeSettings = {
            mode: 'dark',
            accentColor: '#F59E0B',
            fontSize: 'medium',
            reducedMotion: false,
            highContrast: false,
        };
        setLocalSettings(defaultSettings);
        updateTheme(defaultSettings);
    };

    return (
        <div className="space-y-6">
            {saveSuccess && (
                <div className="flex items-center gap-3 rounded-lg bg-success/20 p-4 animate-fade-in">
                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                    <span className="font-caption text-sm text-success-foreground">
                        Theme settings saved successfully!
                    </span>
                </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold font-heading">Appearance</h2>
                <div className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Theme Mode</p>
                            <p className="text-sm text-muted-foreground">Select your preferred interface style</p>
                        </div>
                        <select
                            value={localSettings.mode}
                            onChange={(e) => handleSettingChange('mode', e.target.value as 'dark' | 'light')}
                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Font Size</p>
                            <p className="text-sm text-muted-foreground">Adjust the text size for readability</p>
                        </div>
                        <select
                            value={localSettings.fontSize}
                            onChange={(e) => handleSettingChange('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Accent Color</p>
                            <p className="text-sm text-muted-foreground">Choose your primary brand color</p>
                        </div>
                        <div className="flex gap-2">
                            {['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleSettingChange('accentColor', color)}
                                    className={`h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${localSettings.accentColor === color ? 'ring-2 ring-white scale-110' : ''
                                        }`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold font-heading">Accessibility</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Reduced Motion</p>
                            <p className="text-sm text-muted-foreground">Minimize animation intensities</p>
                        </div>
                        <button
                            onClick={() => handleSettingChange('reducedMotion', !localSettings.reducedMotion)}
                            className={`relative flex-shrink-0 h-6 w-11 rounded-full overflow-hidden transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${localSettings.reducedMotion ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${localSettings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">High Contrast</p>
                            <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                        </div>
                        <button
                            onClick={() => handleSettingChange('highContrast', !localSettings.highContrast)}
                            className={`relative flex-shrink-0 h-6 w-11 rounded-full overflow-hidden transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${localSettings.highContrast ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${localSettings.highContrast ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={handleReset}
                    className="rounded-md border border-border bg-card px-6 py-2.5 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Reset to Default
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Icon name="CheckIcon" size={16} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ThemeCustomizationTab;
