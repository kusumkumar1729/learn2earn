'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getTransactions, type AdminTransaction } from '@/lib/adminDataStore';

const TransactionsSection = () => {
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    useEffect(() => { setTransactions(getTransactions()); }, []);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'transfer': return 'bg-primary/15 text-primary';
            case 'reward': return 'bg-success/15 text-success';
            case 'payment': return 'bg-warning/15 text-warning';
            case 'mint': return 'bg-secondary/15 text-secondary';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-success/15 text-success border-success/20';
            case 'pending': return 'bg-warning/15 text-warning border-warning/20';
            case 'failed': return 'bg-error/15 text-error border-error/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'transfer': return 'ArrowPathIcon';
            case 'reward': return 'CurrencyDollarIcon';
            case 'payment': return 'CreditCardIcon';
            case 'mint': return 'SparklesIcon';
            default: return 'DocumentIcon';
        }
    };

    const filtered = transactions
        .filter(t => filterType === 'all' || t.type === filterType)
        .filter(t => filterStatus === 'all' || t.status === filterStatus)
        .filter(t =>
            searchQuery === '' ||
            t.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.to.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const totalVolume = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Transaction Monitor</h2>
                <p className="mt-1 font-caption text-sm text-muted-foreground">Monitor all blockchain activity and token transfers</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><Icon name="ArrowPathIcon" size={20} className="text-primary" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{transactions.length}</p><p className="font-caption text-xs text-muted-foreground">Total Txns</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15"><Icon name="CheckCircleIcon" size={20} className="text-success" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{transactions.filter(t => t.status === 'completed').length}</p><p className="font-caption text-xs text-muted-foreground">Completed</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15"><Icon name="ClockIcon" size={20} className="text-warning" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{transactions.filter(t => t.status === 'pending').length}</p><p className="font-caption text-xs text-muted-foreground">Pending</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15"><Icon name="CurrencyDollarIcon" size={20} className="text-accent" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{totalVolume}</p><p className="font-caption text-xs text-muted-foreground">Total Volume</p></div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    {['all', 'transfer', 'reward', 'payment', 'mint'].map(t => (
                        <button key={t} onClick={() => { setFilterType(t); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium capitalize transition-smooth ${filterType === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>
                    ))}
                </div>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    {['all', 'completed', 'pending', 'failed'].map(s => (
                        <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }} className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium capitalize transition-smooth ${filterStatus === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{s}</button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                    <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search hash, address, or description..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="rounded-xl bg-card border border-border p-12 text-center">
                    <Icon name="ArrowPathIcon" size={40} className="mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">No Transactions Found</h3>
                </div>
            ) : (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Tx Hash</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">From</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">To</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {paginated.map(tx => (
                                    <tr key={tx.id} className="hover:bg-muted/20 transition-smooth">
                                        <td className="px-5 py-4"><span className="font-mono text-xs text-muted-foreground">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span></td>
                                        <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(tx.type)}`}><Icon name={getTypeIcon(tx.type)} size={12} />{tx.type}</span></td>
                                        <td className="px-5 py-4"><span className="font-mono text-xs text-foreground">{tx.from}</span></td>
                                        <td className="px-5 py-4"><span className="font-mono text-xs text-foreground">{tx.to}</span></td>
                                        <td className="px-5 py-4"><span className="font-caption text-sm font-semibold text-primary">{tx.amount} EDU</span></td>
                                        <td className="px-5 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(tx.status)}`}>{tx.status}</span></td>
                                        <td className="px-5 py-4"><span className="font-caption text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
                            <span className="font-caption text-xs text-muted-foreground">Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-smooth"><Icon name="ChevronLeftIcon" size={16} /></button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`h-7 w-7 rounded-md font-caption text-xs font-medium transition-smooth ${currentPage === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{page}</button>
                                ))}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-smooth"><Icon name="ChevronRightIcon" size={16} /></button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TransactionsSection;
