'use client';

import React, { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const SuccessToast = ({ isVisible, message, onClose }: SuccessToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[3000] animate-fade-in">
      <div className="flex items-center gap-3 rounded-xl bg-success p-4 shadow-glow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-foreground/20">
          <Icon name="CheckCircleIcon" size={24} className="text-success-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-caption text-sm font-medium text-success-foreground">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-smooth hover:bg-success-foreground/20 focus:outline-none focus:ring-2 focus:ring-success-foreground focus:ring-offset-2 focus:ring-offset-success"
          aria-label="Close notification"
        >
          <Icon name="XMarkIcon" size={18} className="text-success-foreground" />
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;