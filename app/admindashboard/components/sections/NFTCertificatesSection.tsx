'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getNFTCertificates, issueNFTCertificate, revokeNFTCertificate, type NFTCertificate } from '@/lib/adminDataStore';

const NFTCertificatesSection = () => {
    const [certificates, setCertificates] = useState<NFTCertificate[]>([]);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({ studentName: '', studentId: '', title: '', description: '', category: 'Course Completion' });

    useEffect(() => {
        setCertificates(getNFTCertificates());
    }, []);

    const handleIssue = () => {
        if (!formData.studentName || !formData.title) return;
        issueNFTCertificate(formData);
        setCertificates(getNFTCertificates());
        setShowIssueModal(false);
        setFormData({ studentName: '', studentId: '', title: '', description: '', category: 'Course Completion' });
        setToast({ message: 'NFT Certificate issued successfully', type: 'success' });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRevoke = (id: string) => {
        revokeNFTCertificate(id);
        setCertificates(getNFTCertificates());
        setToast({ message: 'Certificate revoked', type: 'error' });
        setTimeout(() => setToast(null), 3000);
    };

    const filtered = certificates
        .filter(c => filterStatus === 'all' || c.status === filterStatus)
        .filter(c =>
            searchQuery === '' ||
            c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">NFT Certificates</h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">Issue and manage blockchain-verified achievement certificates</p>
                </div>
                <button
                    onClick={() => setShowIssueModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-caption text-sm font-medium hover:bg-primary/90 transition-smooth"
                >
                    <Icon name="PlusIcon" size={16} />
                    Issue Certificate
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><Icon name="SparklesIcon" size={20} className="text-primary" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{certificates.length}</p><p className="font-caption text-xs text-muted-foreground">Total NFTs</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15"><Icon name="CheckCircleIcon" size={20} className="text-success" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{certificates.filter(c => c.status === 'active').length}</p><p className="font-caption text-xs text-muted-foreground">Active</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/15"><Icon name="ExclamationCircleIcon" size={20} className="text-error" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{certificates.filter(c => c.status === 'revoked').length}</p><p className="font-caption text-xs text-muted-foreground">Revoked</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    {(['all', 'active', 'revoked'] as const).map(f => (
                        <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium capitalize transition-smooth ${filterStatus === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{f}</button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                    <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search certificates..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
            </div>

            {/* Certificates Grid */}
            {filtered.length === 0 ? (
                <div className="rounded-xl bg-card border border-border p-12 text-center">
                    <Icon name="SparklesIcon" size={40} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">No Certificates Found</h3>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map(cert => (
                        <div key={cert.id} className={`rounded-xl bg-card border p-5 transition-all hover:shadow-glow-sm ${cert.status === 'revoked' ? 'border-error/20 opacity-70' : 'border-border hover:border-primary/30'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <Icon name="SparklesIcon" size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-caption text-xs text-muted-foreground">{cert.tokenId}</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cert.status === 'active' ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>{cert.status}</span>
                                    </div>
                                </div>
                                {cert.status === 'active' && (
                                    <button onClick={() => handleRevoke(cert.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-smooth" title="Revoke">
                                        <Icon name="XMarkIcon" size={16} />
                                    </button>
                                )}
                            </div>
                            <h4 className="font-heading text-sm font-semibold text-foreground mb-1">{cert.title}</h4>
                            <p className="font-caption text-xs text-muted-foreground mb-3 line-clamp-2">{cert.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                        <span className="text-[10px] font-bold text-primary">{cert.studentName.charAt(0)}</span>
                                    </div>
                                    <span className="font-caption text-xs text-foreground">{cert.studentName}</span>
                                </div>
                                <span className="font-caption text-[10px] text-muted-foreground">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Issue Modal */}
            {showIssueModal && (
                <div className="fixed inset-0 z-[1040] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowIssueModal(false)} />
                    <div className="relative z-[1050] w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-glow-lg">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-heading text-lg font-bold text-foreground">Issue NFT Certificate</h3>
                            <button onClick={() => setShowIssueModal(false)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"><Icon name="XMarkIcon" size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Student Name</label>
                                <input type="text" value={formData.studentName} onChange={e => setFormData(p => ({ ...p, studentName: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g., Sarah Johnson" />
                            </div>
                            <div>
                                <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Student ID</label>
                                <input type="text" value={formData.studentId} onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g., u123" />
                            </div>
                            <div>
                                <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Certificate Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g., Blockchain Fundamentals" />
                            </div>
                            <div>
                                <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Describe the achievement..." />
                            </div>
                            <div>
                                <label className="block font-caption text-xs font-medium text-foreground mb-1.5">Category</label>
                                <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                                    {['Course Completion', 'Skill Certification', 'Achievement', 'Hackathon Winner', 'Special Award'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <button onClick={() => setShowIssueModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-caption text-sm font-medium hover:bg-muted transition-smooth">Cancel</button>
                            <button onClick={handleIssue} disabled={!formData.studentName || !formData.title} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50">
                                <span className="flex items-center justify-center gap-2"><Icon name="SparklesIcon" size={16} />Issue NFT</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default NFTCertificatesSection;
