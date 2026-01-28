'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

const FilterControls = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  dateRange,
  onDateRangeChange,
}: FilterControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-border bg-input py-3 pl-12 pr-4 font-caption text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className="mb-2 block font-caption text-xs font-medium text-muted-foreground">
            Course Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <option value="all">All Categories</option>
            <option value="blockchain">Blockchain</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="mb-2 block font-caption text-xs font-medium text-muted-foreground">
            User Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dateRange" className="mb-2 block font-caption text-xs font-medium text-muted-foreground">
            Date Range
          </label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 font-caption text-sm text-foreground transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;