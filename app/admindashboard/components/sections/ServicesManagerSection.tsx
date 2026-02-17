'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getServices, addService, updateService, deleteService, type AdminService } from '@/lib/adminDataStore';

const SERVICE_TYPES = ['hackathon', 'course', 'workshop', 'merchandise'] as const;

const ServicesManagerSection = () => {
    const [services, setServices] = useState<AdminService[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingService, setEditingService] = useState<AdminService | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', type: 'course' as AdminService['type'], tokenCost: 100, walletAddress: '', description: '', active: true });

    useEffect(() => { setServices(getServices()); }, []);

    const resetForm = () => {
        setFormData({ name: '', type: 'course', tokenCost: 100, walletAddress: '', description: '', active: true });
        setEditingService(null);
    };

    const handleCreate = () => {
        if (!formData.name || !formData.walletAddress) return;
        addService(formData);
        setServices(getServices());
        setShowCreateModal(false);
        resetForm();
        setToast({ message: 'Service created successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    const handleUpdate = () => {
        if (!editingService) return;
        updateService(editingService.id, formData);
        setServices(getServices());
        setShowCreateModal(false);
        resetForm();
        setToast({ message: 'Service updated', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = (id: string) => {
        deleteService(id);
        setServices(getServices());
        setShowDeleteConfirm(null);
        setToast({ message: 'Service deleted', type: 'error' });
        setTimeout(() => setToast(null), 3000);
    };

    const handleToggleActive = (id: string, active: boolean) => {
        updateService(id, { active: !active });
        setServices(getServices());
    };

    const openEditModal = (service: AdminService) => {
        setEditingService(service);
        setFormData({ name: service.name, type: service.type, tokenCost: service.tokenCost, walletAddress: service.walletAddress, description: service.description, active: service.active });
        setShowCreateModal(true);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'hackathon': return 'bg-primary/15 text-primary';
            case 'course': return 'bg-secondary/15 text-secondary';
            case 'workshop': return 'bg-accent/15 text-accent';
            case 'merchandise': return 'bg-warning/15 text-warning';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'hackathon': return 'TrophyIcon';
            case 'course': return 'AcademicCapIcon';
            case 'workshop': return 'WrenchIcon';
            case 'merchandise': return 'ShoppingBagIcon';
            default: return 'CubeIcon';
        }
    };

    const filtered = services
        .filter(s => filterType === 'all' || s.type === filterType)
        .filter(s => searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">Services Manager</h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">Create and manage platform services, courses, and hackathons</p>
                </div>
                <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-caption text-sm font-medium hover:bg-primary/90 transition-smooth">
                    <Icon name="PlusIcon" size={16} /> Add Service
                </button>
            </div>

            {/* Summary */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {SERVICE_TYPES.map(type => (
                    <div key={type} className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(type)}`}>
                            <Icon name={getTypeIcon(type)} size={20} />
                        </div>
                        <div>
                            <p className="font-heading text-lg font-bold text-foreground">{services.filter(s => s.type === type).length}</p>
                            <p className="font-caption text-xs text-muted-foreground capitalize">{type}s</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium transition-smooth ${filterType === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
                    {SERVICE_TYPES.map(type => (
                        <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium capitalize transition-smooth ${filterType === type ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{type}</button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                    <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search services..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
            </div>

            {/* Services Table */}
            {filtered.length === 0 ? (
                <div className="rounded-xl bg-card border border-border p-12 text-center">
                    <Icon name="CubeIcon" size={40} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">No Services Found</h3>
                </div>
            ) : (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Token Cost</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Wallet</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Enrollments</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-5 py-3.5 text-center font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map(service => (
                                    <tr key={service.id} className="hover:bg-muted/20 transition-smooth">
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-caption text-sm font-medium text-foreground">{service.name}</p>
                                                <p className="font-caption text-[10px] text-muted-foreground truncate max-w-[200px]">{service.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(service.type)}`}>
                                                <Icon name={getTypeIcon(service.type)} size={12} />{service.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4"><span className="font-caption text-sm font-semibold text-primary">{service.tokenCost} EDU</span></td>
                                        <td className="px-5 py-4"><span className="font-caption text-xs text-muted-foreground font-mono">{service.walletAddress}</span></td>
                                        <td className="px-5 py-4"><span className="font-caption text-sm text-foreground">{service.enrollments}</span></td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleToggleActive(service.id, service.active)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${service.active ? 'bg-success' : 'bg-muted'}`}>
                                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${service.active ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => openEditModal(service)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"><Icon name="PencilIcon" size={14} /></button>
                                                <button onClick={() => setShowDeleteConfirm(service.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-smooth"><Icon name="TrashIcon" size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[1040] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setShowCreateModal(false); resetForm(); }} />
                    <div className="relative z-[1050] w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-glow-lg">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-heading text-lg font-bold text-foreground">{editingService ? 'Edit Service' : 'Create Service'}</h3>
                            <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"><Icon name="XMarkIcon" size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block font-caption text-xs font-medium text-foreground mb-1.5">Name</label><input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Service name" /></div>
                            <div><label className="block font-caption text-xs font-medium text-foreground mb-1.5">Type</label><select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as AdminService['type'] }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">{SERVICE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</select></div>
                            <div><label className="block font-caption text-xs font-medium text-foreground mb-1.5">Token Cost</label><input type="number" value={formData.tokenCost} onChange={e => setFormData(p => ({ ...p, tokenCost: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
                            <div><label className="block font-caption text-xs font-medium text-foreground mb-1.5">Wallet Address</label><input type="text" value={formData.walletAddress} onChange={e => setFormData(p => ({ ...p, walletAddress: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0x..." /></div>
                            <div><label className="block font-caption text-xs font-medium text-foreground mb-1.5">Description</label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-caption text-sm font-medium hover:bg-muted transition-smooth">Cancel</button>
                            <button onClick={editingService ? handleUpdate : handleCreate} disabled={!formData.name || !formData.walletAddress} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50">{editingService ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[1060] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
                    <div className="relative z-[1070] w-full max-w-sm rounded-xl bg-card border border-border p-6 shadow-glow-lg text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-error/15"><Icon name="TrashIcon" size={24} className="text-error" /></div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-2">Delete Service?</h3>
                        <p className="font-caption text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-border text-foreground font-caption text-sm font-medium hover:bg-muted transition-smooth">Cancel</button>
                            <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-error text-white font-caption text-sm font-medium hover:bg-error/90 transition-smooth">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="fixed bottom-8 right-8 z-[1080] animate-slide-in">
                    <div className={`flex items-center gap-3 rounded-lg px-5 py-3 shadow-glow-lg border ${toast.type === 'success' ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'}`}>
                        <Icon name={toast.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} size={18} className={toast.type === 'success' ? 'text-success' : 'text-error'} />
                        <span className="font-caption text-sm text-foreground">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManagerSection;
