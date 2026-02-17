'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export type AdminSection =
    | 'overview'
    | 'requests'
    | 'tokens'
    | 'nft'
    | 'services'
    | 'transactions'
    | 'students'
    | 'analytics'
    | 'settings';

interface NavItem {
    id: AdminSection;
    label: string;
    icon: string;
    badge?: number;
}

interface AdminSidebarProps {
    activeSection: AdminSection;
    onSectionChange: (section: AdminSection) => void;
    pendingCount: number;
    collapsed: boolean;
    onToggle: () => void;
}

const AdminSidebar = ({ activeSection, onSectionChange, pendingCount, collapsed, onToggle }: AdminSidebarProps) => {
    const navItems: NavItem[] = [
        { id: 'overview', label: 'Dashboard Overview', icon: 'Squares2X2Icon' },
        { id: 'requests', label: 'Student Requests', icon: 'InboxIcon', badge: pendingCount },
        { id: 'tokens', label: 'Token Approvals', icon: 'CurrencyDollarIcon' },
        { id: 'nft', label: 'NFT Certificates', icon: 'SparklesIcon' },
        { id: 'services', label: 'Services Manager', icon: 'CubeIcon' },
        { id: 'transactions', label: 'Transactions', icon: 'ArrowPathIcon' },
        { id: 'students', label: 'Students List', icon: 'UserGroupIcon' },
        { id: 'analytics', label: 'Analytics', icon: 'ChartBarIcon' },
        { id: 'settings', label: 'Settings', icon: 'Cog6ToothIcon' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border z-40 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'
                    }`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shrink-0">
                        <Icon name="ShieldCheckIcon" size={18} className="text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="font-heading text-base font-bold text-foreground truncate">Admin Panel</h1>
                            <p className="font-caption text-[10px] text-muted-foreground">Learn2Earn</p>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className={`ml-auto p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth ${collapsed ? 'mx-auto' : ''}`}
                    >
                        <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-custom">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-caption text-sm transition-all duration-200 group relative ${activeSection === item.id
                                    ? 'bg-primary/15 text-primary font-medium shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <div className="relative shrink-0">
                                <Icon name={item.icon} size={20} />
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-error text-[10px] font-bold text-white">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                            {!collapsed && (
                                <>
                                    <span className="truncate flex-1 text-left">{item.label}</span>
                                    {item.badge && item.badge > 0 && (
                                        <span className="ml-auto px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-medium">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {activeSection === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                {!collapsed && (
                    <div className="p-3 border-t border-border shrink-0">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 shrink-0">
                                <Icon name="UserCircleIcon" size={16} className="text-primary" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-caption text-xs font-medium text-foreground truncate">Administrator</p>
                                <p className="font-caption text-[10px] text-muted-foreground">Super Admin</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-40 px-1 py-1">
                <div className="flex items-center justify-around">
                    {navItems.slice(0, 5).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-smooth relative ${activeSection === item.id
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                }`}
                        >
                            <div className="relative">
                                <Icon name={item.icon} size={20} />
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1.5 flex items-center justify-center h-3.5 min-w-[14px] px-0.5 rounded-full bg-error text-[8px] font-bold text-white">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-medium">{item.label.split(' ')[0]}</span>
                        </button>
                    ))}
                    {/* More button for remaining items */}
                    <div className="relative group">
                        <button className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-muted-foreground transition-smooth">
                            <Icon name="EllipsisHorizontalIcon" size={20} />
                            <span className="text-[9px] font-medium">More</span>
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-card border border-border rounded-xl shadow-glow-lg p-2 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all z-50">
                            {navItems.slice(5).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onSectionChange(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-caption text-sm transition-smooth ${activeSection === item.id
                                            ? 'bg-primary/15 text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    <Icon name={item.icon} size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default AdminSidebar;
