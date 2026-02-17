'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

interface MockServiceItem {
    id: string;
    name: string;
    description?: string;
    tokenCost: number;
    currentParticipants: number;
    maxParticipants?: number;
    imageUrl?: string;
    externalUrl?: string;
}

interface CreateServicePanelProps {
    onServiceCreated?: () => void;
}

const CreateServicePanel = ({ onServiceCreated }: CreateServicePanelProps) => {
    // Form state
    const [activeTab, setActiveTab] = useState<'hackathon' | 'course'>('hackathon');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tokenCost: '',
        maxParticipants: '',
        imageUrl: '',
        externalUrl: '',
    });
    const [isPending, setIsPending] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showToastMessage = (message: string, type: 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.tokenCost) {
            showToastMessage('Name and token cost are required', 'error');
            return;
        }

        setIsPending(true);

        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            showToastMessage(`${activeTab === 'hackathon' ? 'Hackathon' : 'Course'} created successfully!`, 'success');

            // Reset form
            setFormData({
                name: '',
                description: '',
                tokenCost: '',
                maxParticipants: '',
                imageUrl: '',
                externalUrl: '',
            });

            onServiceCreated?.();
        } catch {
            showToastMessage('Failed to create service', 'error');
        } finally {
            setIsPending(false);
        }
    };

    const refetch = () => {
        // Mock refetch
        showToastMessage('Refreshed', 'success');
    };

    // Mock existing services
    const hackathons: MockServiceItem[] = [];
    const courses: MockServiceItem[] = [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                        Create {activeTab === 'hackathon' ? 'Hackathon' : 'Course'}
                    </h2>
                    <p className="mt-1 font-caption text-sm text-muted-foreground">
                        Create and manage hackathons and courses
                    </p>
                </div>
                <button
                    onClick={refetch}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 font-caption text-xs text-foreground hover:bg-background transition-smooth"
                >
                    <Icon name="ArrowPathIcon" size={14} />
                    Refresh
                </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('hackathon')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-caption text-sm font-medium transition-smooth ${activeTab === 'hackathon'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Icon name="RocketLaunchIcon" size={16} />
                    Hackathon
                </button>
                <button
                    onClick={() => setActiveTab('course')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-caption text-sm font-medium transition-smooth ${activeTab === 'course'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Icon name="AcademicCapIcon" size={16} />
                    Course
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Create Form */}
                <div className="rounded-xl bg-card border border-border p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                        New {activeTab === 'hackathon' ? 'Hackathon' : 'Course'} Details
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-caption text-sm font-medium text-foreground mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder={activeTab === 'hackathon' ? 'Web3 Innovation Challenge' : 'Blockchain Fundamentals'}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-caption text-sm font-medium text-foreground mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter a detailed description..."
                                rows={3}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-caption text-sm font-medium text-foreground mb-1">
                                    Token Cost (EDU) *
                                </label>
                                <input
                                    type="number"
                                    name="tokenCost"
                                    value={formData.tokenCost}
                                    onChange={handleInputChange}
                                    placeholder="100"
                                    min="1"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-caption text-sm font-medium text-foreground mb-1">
                                    Max Participants
                                </label>
                                <input
                                    type="number"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleInputChange}
                                    placeholder="100"
                                    min="1"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-caption text-sm font-medium text-foreground mb-1">
                                Image URL (Poster)
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label className="block font-caption text-sm font-medium text-foreground mb-1">
                                External URL {activeTab === 'hackathon' ? '(Registration Link)' : '(Course Link)'}
                            </label>
                            <input
                                type="url"
                                name="externalUrl"
                                value={formData.externalUrl}
                                onChange={handleInputChange}
                                placeholder="https://hackathon.example.com"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 font-caption text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Icon name="PlusIcon" size={16} />
                                    Create {activeTab === 'hackathon' ? 'Hackathon' : 'Course'}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Existing Services List */}
                <div className="rounded-xl bg-card border border-border p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                        Existing {activeTab === 'hackathon' ? 'Hackathons' : 'Courses'} ({activeTab === 'hackathon' ? hackathons.length : courses.length})
                    </h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {(activeTab === 'hackathon' ? hackathons : courses).length === 0 ? (
                            <div className="text-center py-8">
                                <Icon
                                    name={activeTab === 'hackathon' ? 'RocketLaunchIcon' : 'AcademicCapIcon'}
                                    size={40}
                                    className="mx-auto text-muted-foreground mb-2"
                                />
                                <p className="font-caption text-sm text-muted-foreground">
                                    No {activeTab === 'hackathon' ? 'hackathons' : 'courses'} created yet
                                </p>
                            </div>
                        ) : (
                            (activeTab === 'hackathon' ? hackathons : courses).map((service: MockServiceItem) => (
                                <div
                                    key={service.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-smooth"
                                >
                                    {service.imageUrl ? (
                                        <Image
                                            src={service.imageUrl}
                                            alt={service.name}
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                            <Icon
                                                name={activeTab === 'hackathon' ? 'RocketLaunchIcon' : 'BookOpenIcon'}
                                                size={24}
                                                className="text-muted-foreground"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-heading text-sm font-bold text-foreground truncate">
                                            {service.name}
                                        </h4>
                                        {service.description && (
                                            <p className="font-caption text-xs text-muted-foreground line-clamp-1">
                                                {service.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="font-mono text-xs text-primary">
                                                {Number(service.tokenCost) / 1e18} EDU
                                            </span>
                                            <span className="font-caption text-xs text-muted-foreground">
                                                {service.currentParticipants}/{service.maxParticipants || '∞'} participants
                                            </span>
                                        </div>
                                    </div>
                                    {service.externalUrl && (
                                        <a
                                            href={service.externalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
                                        >
                                            <Icon name="ArrowTopRightOnSquareIcon" size={16} />
                                        </a>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[1030] animate-slide-in">
                    <div className={`flex items-center gap-3 rounded-lg px-6 py-4 shadow-glow-lg ${toastType === 'success'
                        ? 'bg-card border border-success/20'
                        : 'bg-card border border-error/20'
                        }`}>
                        <Icon
                            name={toastType === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'}
                            size={20}
                            className={toastType === 'success' ? 'text-success' : 'text-error'}
                        />
                        <span className="font-caption text-sm text-foreground">{toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateServicePanel;
