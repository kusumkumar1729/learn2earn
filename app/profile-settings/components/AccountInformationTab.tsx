'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface AccountInfo {
  fullName: string;
  email: string;
  bio: string;
  avatar: string;
  phoneNumber: string;
  location: string;
}

interface AccountInformationTabProps {
  initialData: AccountInfo;
}

const AccountInformationTab = ({ initialData }: AccountInformationTabProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<AccountInfo>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AccountInfo, string>>>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccountInfo, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AccountInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleAvatarUpload = () => {
    alert('Avatar upload functionality would trigger file picker here');
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-lg bg-success/20 p-4 animate-fade-in">
          <Icon name="CheckCircleIcon" size={20} className="text-success" />
          <span className="font-caption text-sm text-success-foreground">
            Profile updated successfully!
          </span>
        </div>
      )}

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full">
            <AppImage
              src={formData.avatar}
              alt="User profile photo showing current avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <button
              onClick={handleAvatarUpload}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <Icon name="PhotoIcon" size={18} />
              Upload New Photo
            </button>
            <p className="mt-2 font-caption text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-glow-sm">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block font-caption text-sm font-medium text-foreground">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full rounded-md border ${
                errors.fullName ? 'border-error' : 'border-border'
              } bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 font-caption text-xs text-error">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-caption text-sm font-medium text-foreground">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full rounded-md border ${
                errors.email ? 'border-error' : 'border-border'
              } bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 font-caption text-xs text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-2 block font-caption text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full rounded-md border ${
                errors.phoneNumber ? 'border-error' : 'border-border'
              } bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phoneNumber && (
              <p className="mt-1 font-caption text-xs text-error">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block font-caption text-sm font-medium text-foreground">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-2 block font-caption text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Tell us about yourself..."
            />
            <p className="mt-1 font-caption text-xs text-muted-foreground">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setFormData(initialData)}
          className="rounded-md border border-border bg-card px-6 py-2.5 font-caption text-sm font-medium text-foreground transition-smooth hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-caption text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.98] hover:shadow-glow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AccountInformationTab;