'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getAllUserProfiles, type UserProfile } from '@/lib/mockDataStore';
import { getAllSubmissions } from '@/lib/activitySubmissionsStore';
import { getNFTCertificates } from '@/lib/adminDataStore';

interface ExtendedUser extends UserProfile {
    submissionCount: number;
    nftCount: number;
    status: 'active' | 'inactive';
}

const StudentsListSection = () => {
    const [students, setStudents] = useState<ExtendedUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<string>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;

    useEffect(() => {
        const users = getAllUserProfiles();
        const submissions = getAllSubmissions();
        const certs = getNFTCertificates();

        const extended: ExtendedUser[] = users.map(u => ({
            ...u,
            submissionCount: submissions.filter(s => s.studentId === u.id).length,
            nftCount: certs.filter(c => c.studentId === u.id && c.status === 'active').length,
            status: 'active' as const,
        }));

        // Add mock students to fill the table
        const mockStudents: ExtendedUser[] = [
            { id: 'mock1', name: 'Sarah Johnson', email: 'sarah@campus.edu', walletAddress: '0x1a2b...3c4d', tokens: 2450, totalEarned: 3200, coursesCompleted: 12, coursesInProgress: 2, certificates: 5, joinedDate: '2026-01-15', lastActive: '2026-02-16', submissionCount: 8, nftCount: 3, status: 'active' },
            { id: 'mock2', name: 'Michael Chen', email: 'michael@campus.edu', walletAddress: '0x5e6f...7a8b', tokens: 3120, totalEarned: 4100, coursesCompleted: 15, coursesInProgress: 1, certificates: 7, joinedDate: '2026-01-10', lastActive: '2026-02-16', submissionCount: 12, nftCount: 4, status: 'active' },
            { id: 'mock3', name: 'Emily Rodriguez', email: 'emily@campus.edu', walletAddress: '0x9c0d...1e2f', tokens: 1890, totalEarned: 2500, coursesCompleted: 8, coursesInProgress: 3, certificates: 3, joinedDate: '2026-01-08', lastActive: '2026-02-15', submissionCount: 6, nftCount: 2, status: 'active' },
            { id: 'mock4', name: 'David Kim', email: 'david@campus.edu', walletAddress: '0x3a4b...5c6d', tokens: 780, totalEarned: 1200, coursesCompleted: 4, coursesInProgress: 1, certificates: 1, joinedDate: '2026-01-05', lastActive: '2026-02-10', submissionCount: 3, nftCount: 0, status: 'inactive' },
            { id: 'mock5', name: 'Jessica Taylor', email: 'jessica@campus.edu', walletAddress: '0x7e8f...9a0b', tokens: 2210, totalEarned: 2800, coursesCompleted: 10, coursesInProgress: 2, certificates: 4, joinedDate: '2025-12-28', lastActive: '2026-02-16', submissionCount: 9, nftCount: 2, status: 'active' },
        ];

        setStudents([...extended, ...mockStudents]);
    }, []);

    const handleSort = (field: string) => {
        if (sortField === field) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }
        else { setSortField(field); setSortDir('asc'); }
    };

    const filtered = students.filter(s =>
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        const aVal = a[sortField as keyof ExtendedUser];
        const bVal = b[sortField as keyof ExtendedUser];
        if (typeof aVal === 'string' && typeof bVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / perPage);
    const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

    const SortableHeader = ({ field, label }: { field: string; label: string }) => (
        <th className="px-5 py-3.5 text-left">
            <button onClick={() => handleSort(field)} className="flex items-center gap-1 font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-smooth">
                {label}<Icon name={sortField === field && sortDir === 'desc' ? 'ChevronDownIcon' : 'ChevronUpIcon'} size={12} className={sortField === field ? 'text-primary' : ''} />
            </button>
        </th>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Students List</h2>
                <p className="mt-1 font-caption text-sm text-muted-foreground">Complete student directory with activity metrics</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15"><Icon name="UsersIcon" size={20} className="text-primary" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{students.length}</p><p className="font-caption text-xs text-muted-foreground">Total Students</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15"><Icon name="CheckCircleIcon" size={20} className="text-success" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{students.filter(s => s.status === 'active').length}</p><p className="font-caption text-xs text-muted-foreground">Active</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15"><Icon name="CurrencyDollarIcon" size={20} className="text-accent" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{students.reduce((s, u) => s + u.tokens, 0)}</p><p className="font-caption text-xs text-muted-foreground">Total Tokens</p></div>
                </div>
                <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15"><Icon name="AcademicCapIcon" size={20} className="text-secondary" /></div>
                    <div><p className="font-heading text-xl font-bold text-foreground">{students.reduce((s, u) => s + u.coursesCompleted, 0)}</p><p className="font-caption text-xs text-muted-foreground">Courses Done</p></div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search by name, email, or wallet..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            {/* Table */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <SortableHeader field="name" label="Student" />
                                <SortableHeader field="walletAddress" label="Wallet" />
                                <SortableHeader field="tokens" label="Tokens" />
                                <SortableHeader field="coursesCompleted" label="Courses" />
                                <SortableHeader field="nftCount" label="NFTs" />
                                <SortableHeader field="submissionCount" label="Activities" />
                                <th className="px-5 py-3.5 text-left font-caption text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginated.map(student => (
                                <tr key={student.id} className="hover:bg-muted/20 transition-smooth">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                <span className="text-sm font-bold text-primary">{student.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-caption text-sm font-medium text-foreground">{student.name}</p>
                                                <p className="font-caption text-[10px] text-muted-foreground">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4"><span className="font-mono text-xs text-muted-foreground">{student.walletAddress}</span></td>
                                    <td className="px-5 py-4"><span className="font-caption text-sm font-semibold text-primary">{student.tokens}</span></td>
                                    <td className="px-5 py-4"><span className="font-caption text-sm text-foreground">{student.coursesCompleted}</span></td>
                                    <td className="px-5 py-4"><span className="font-caption text-sm text-foreground">{student.nftCount}</span></td>
                                    <td className="px-5 py-4"><span className="font-caption text-sm text-foreground">{student.submissionCount}</span></td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${student.status === 'active' ? 'bg-success/15 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}>{student.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
                        <span className="font-caption text-xs text-muted-foreground">Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, sorted.length)} of {sorted.length}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-40 transition-smooth"><Icon name="ChevronLeftIcon" size={16} /></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`h-7 w-7 rounded-md font-caption text-xs font-medium transition-smooth ${currentPage === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-40 transition-smooth"><Icon name="ChevronRightIcon" size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsListSection;
