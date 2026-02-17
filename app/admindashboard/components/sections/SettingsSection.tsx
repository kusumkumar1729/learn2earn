'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getAdminSettings, updateAdminSettings, type AdminSettings } from '@/lib/adminDataStore';

const SettingsSection = () => {
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { setSettings(getAdminSettings()); }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        updateAdminSettings(settings);
        setIsSaving(false);
        setToast({ message: 'Settings saved successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    if (!settings) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Settings</h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">Configure platform settings and admin preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-60"
                >
                    {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Icon name="CheckCircleIcon" size={16} />}
                    Save Changes
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* General Settings */}
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="Cog6ToothIcon" size={20} className="text-primary" /> General
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Platform Name</label>
                            <input type="text" value={settings.platformName} onChange={e => setSettings(s => s ? { ...s, platformName: e.target.value } : s)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Max Tokens Per Day</label>
                            <input type="number" value={settings.maxTokensPerDay} onChange={e => setSettings(s => s ? { ...s, maxTokensPerDay: parseInt(e.target.value) || 0 } : s)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Auto-Approve Threshold (0 = disabled)</label>
                            <input type="number" value={settings.autoApproveThreshold} onChange={e => setSettings(s => s ? { ...s, autoApproveThreshold: parseInt(e.target.value) || 0 } : s)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            <p className="font-caption text-[10px] text-muted-foreground mt-1">Requests below this token amount will be auto-approved</p>
                        </div>
                    </div>
                </div>

                {/* Feature Toggles */}
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="AdjustmentsHorizontalIcon" size={20} className="text-primary" /> Features
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border">
                            <div>
                                <p className="font-caption text-sm font-medium text-foreground">Maintenance Mode</p>
                                <p className="font-caption text-xs text-muted-foreground">Disable student access temporarily</p>
                            </div>
                            <button
                                onClick={() => setSettings(s => s ? { ...s, maintenanceMode: !s.maintenanceMode } : s)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-error' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-border">
                            <div>
                                <p className="font-caption text-sm font-medium text-foreground">Notifications</p>
                                <p className="font-caption text-xs text-muted-foreground">Enable admin notification alerts</p>
                            </div>
                            <button
                                onClick={() => setSettings(s => s ? { ...s, notificationsEnabled: !s.notificationsEnabled } : s)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-success' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="ShieldCheckIcon" size={20} className="text-primary" /> Security
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                            <Icon name="CheckCircleIcon" size={18} className="text-success" />
                            <div>
                                <p className="font-caption text-sm font-medium text-foreground">Admin Session Active</p>
                                <p className="font-caption text-[10px] text-muted-foreground">Session expires in 24 hours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Icon name="LockClosedIcon" size={18} className="text-muted-foreground" />
                            <div>
                                <p className="font-caption text-sm font-medium text-foreground">Two-Factor Auth</p>
                                <p className="font-caption text-[10px] text-muted-foreground">Not configured (recommended)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Storage */}
                <div className="rounded-xl bg-card border border-border p-5">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="ServerIcon" size={20} className="text-primary" /> Storage Info
                    </h3>
                    <div className="space-y-3">
                        {[
                            { key: 'admin_session', label: 'Admin Session' },
                            { key: 'admin_services', label: 'Services Data' },
                            { key: 'admin_transactions', label: 'Transactions' },
                            { key: 'admin_nft_certificates', label: 'NFT Certificates' },
                            { key: 'admin_settings', label: 'Settings' },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <span className="font-caption text-xs text-foreground">{item.label}</span>
                                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {toast && (
                <div className="fixed bottom-8 right-8 z-[1060] animate-slide-in">
                    <div className={`flex items-center gap-3 rounded-lg px-5 py-3 shadow-glow-lg border ${toast.type === 'success' ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'}`}>
                        <Icon name={toast.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} size={18} className={toast.type === 'success' ? 'text-success' : 'text-error'} />
                        <span className="font-caption text-sm text-foreground">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsSection;
