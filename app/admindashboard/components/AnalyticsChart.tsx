'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  month: string;
  registrations: number;
  completions: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
}

const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
  return (
    <div className="rounded-xl bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">Platform Analytics</h3>
          <p className="mt-1 font-caption text-sm text-muted-foreground">Monthly registrations and course completions</p>
        </div>
      </div>
      
      <div className="h-80 w-full" aria-label="Platform Analytics Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="month"
              stroke="#A3A3A3"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis
              stroke="#A3A3A3"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
              }}
              labelStyle={{ color: '#F5F5F5' }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <Bar dataKey="registrations" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            <Bar dataKey="completions" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;