'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterToolbarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCostRange: string;
  onCostRangeChange: (range: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (availability: string) => void;
  onClearFilters: () => void;
}

const FilterToolbar = ({
  selectedCategory,
  onCategoryChange,
  selectedCostRange,
  onCostRangeChange,
  selectedAvailability,
  onAvailabilityChange,
  onClearFilters,
}: FilterToolbarProps) => {
  const categories = [
    { value: 'all', label: 'All Categories', icon: 'Squares2X2Icon' as const },
    { value: 'courses', label: 'Course Upgrades', icon: 'AcademicCapIcon' as const },
    { value: 'certificates', label: 'Certificates', icon: 'DocumentCheckIcon' as const },
    { value: 'merchandise', label: 'Merchandise', icon: 'ShoppingBagIcon' as const },
    { value: 'credits', label: 'Platform Credits', icon: 'CreditCardIcon' as const },
  ];

  const costRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: '0 - 500 L2E' },
    { value: '501-1000', label: '501 - 1,000 L2E' },
    { value: '1001-2000', label: '1,001 - 2,000 L2E' },
    { value: '2001+', label: '2,001+ L2E' },
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'available', label: 'Available' },
    { value: 'limited', label: 'Limited Stock' },
  ];

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCostRange !== 'all' ||
    selectedAvailability !== 'all';

  return (
    <div className="rounded-xl bg-card/50 p-6 backdrop-blur-sm shadow-glow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 font-caption text-sm text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <Icon name="XMarkIcon" size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-3 block font-caption text-sm font-medium text-card-foreground">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`flex items-center justify-center gap-2 rounded-md px-4 py-3 font-caption text-sm font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  selectedCategory === category.value
                    ? 'bg-primary text-primary-foreground shadow-glow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                <Icon name={category.icon} size={18} />
                <span className="hidden sm:inline">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-3 block font-caption text-sm font-medium text-card-foreground">
              Token Cost Range
            </label>
            <div className="space-y-2">
              {costRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onCostRangeChange(range.value)}
                  className={`flex w-full items-center justify-between rounded-md px-4 py-2.5 font-caption text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    selectedCostRange === range.value
                      ? 'bg-primary/20 text-primary font-medium' :'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <span>{range.label}</span>
                  {selectedCostRange === range.value && (
                    <Icon name="CheckIcon" size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block font-caption text-sm font-medium text-card-foreground">
              Availability
            </label>
            <div className="space-y-2">
              {availabilityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onAvailabilityChange(option.value)}
                  className={`flex w-full items-center justify-between rounded-md px-4 py-2.5 font-caption text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    selectedAvailability === option.value
                      ? 'bg-primary/20 text-primary font-medium' :'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedAvailability === option.value && (
                    <Icon name="CheckIcon" size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;