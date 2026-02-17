import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TokenMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface TokenEconomyWidgetProps {
  metrics: TokenMetric[];
}

const TokenEconomyWidget = ({ metrics }: TokenEconomyWidgetProps) => {
  return (
    <div className="rounded-xl bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">Token Economy</h3>
          <p className="mt-1 font-caption text-sm text-muted-foreground">Platform token distribution and health</p>
        </div>
        <Icon name="CurrencyDollarIcon" size={24} className="text-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="group rounded-lg border border-border p-4 transition-smooth hover:border-primary/50 hover:bg-muted/30">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.color}`}>
                <Icon name={metric.icon} size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-caption text-xs text-muted-foreground">{metric.label}</p>
                <p className="mt-1 font-mono text-lg font-bold text-foreground">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenEconomyWidget;