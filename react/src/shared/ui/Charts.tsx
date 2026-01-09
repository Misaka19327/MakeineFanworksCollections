import React from 'react';

interface LineChartProps {
  title: string;
  data: number[];
  labels?: string[];
  color?: string;
  className?: string;
}

interface DonutChartProps {
  title: string;
  data: { label: string; value: number; color?: string }[];
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ title, data, labels = [], color = '#8d6e63', className = '' }) => {
  const max = Math.max(1, ...data);
  return (
    <div className={`bg-white dark:bg-warm-900 rounded-2xl p-4 border border-warm-100 dark:border-warm-800 ${className}`}>
      <h3 className="text-sm font-bold text-warm-500 mb-3">{title}</h3>
      <div className="h-28 flex items-end gap-1">
        {data.map((v, i) => (
          <div
            key={i}
            title={labels[i] ?? String(v)}
            className="flex-1 rounded-t-md"
            style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.85 }}
          />
        ))}
      </div>
    </div>
  );
};

export const DonutChart: React.FC<DonutChartProps> = ({ title, data, className = '' }) => {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div className={`bg-white dark:bg-warm-900 rounded-2xl p-4 border border-warm-100 dark:border-warm-800 ${className}`}>
      <h3 className="text-sm font-bold text-warm-500 mb-3">{title}</h3>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-full">
          {/* Simplified donut: stacked circles */}
          {data.map((s, i) => (
            <div key={i} className="absolute inset-0 rounded-full border-[10px]" style={{ borderColor: s.color || '#8d6e63', opacity: (i + 1) / data.length }} />
          ))}
          <div className="absolute inset-3 bg-white dark:bg-warm-900 rounded-full" />
        </div>
        <div className="text-sm space-y-1">
          {data.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color || '#8d6e63' }} />
              <span className="text-warm-600 dark:text-warm-300">{s.label}</span>
              <span className="text-warm-400">{Math.round((s.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className = '' }) => (
  <div className={`rounded-2xl p-4 border border-warm-100 dark:border-warm-800 ${className || 'bg-white dark:bg-warm-900'}`}>
    <div className="flex items-center gap-3 opacity-70 mb-2">{icon}<span className="text-sm font-bold uppercase tracking-wider">{title}</span></div>
    <div className="text-2xl font-serif font-bold text-warm-900 dark:text-warm-100">{value}</div>
  </div>
);
