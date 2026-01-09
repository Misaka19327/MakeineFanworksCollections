import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, FileText, Layers, PieChart, TrendingUp, Loader2 } from 'lucide-react';

import { useTheme } from '@/app/providers/ThemeContext';
import { ContentService } from '@/features/content/api/content.service';
import { ContentItem } from '@/features/content/types/content.types';
import { Button } from '@/shared/ui/Button';
import { LineChart, DonutChart, StatCard } from '@/shared/ui/Charts';

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { accentColors } = useTheme();

  useEffect(() => {
    ContentService.getAll().then(setData).finally(() => setLoading(false));
  }, []);

  const { totalItems, totalWords, totalStories, totalImages, trendData, categoryData } = useMemo(() => {
    const totalItems = data.length;
    const totalWords = data.reduce((acc, item) => acc + (item.wordCount || 0), 0);
    const totalStories = data.filter(i => i.type === 'story').length;
    const totalImages = data.filter(i => i.type === 'image').length;

    // Trend Data
    const groups: Record<string, number> = {};
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(m => groups[m] = 0);
    data.forEach(item => {
      const date = new Date(item.publishedAt);
      const month = date.toLocaleString('default', { month: 'short' });
      if (groups[month] !== undefined) groups[month] += (item.views || 0);
    });
    const trendData = Object.entries(groups).map(([label, value]) => ({ label, value }));

    // Category Data
    const map = new Map<string, number>();
    data.forEach(item => {
      const cat = item.category || 'Other';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    const categoryData = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({
      label,
      value,
      color: accentColors[i % accentColors.length]
    }));

    return { totalItems, totalWords, totalStories, totalImages, trendData, categoryData };
  }, [data, accentColors]);

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-warm-950"><Loader2 className="animate-spin text-warm-500" /></div>;

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-950 pb-20">
      <div className="sticky top-0 z-30 bg-warm-50/90 dark:bg-warm-950/90 backdrop-blur-md border-b border-warm-100 dark:border-warm-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} variant="secondary" size="icon" className="rounded-full shadow-sm border border-warm-100 dark:border-warm-800">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-serif font-bold text-warm-900 dark:text-warm-100">Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Items" value={totalItems} icon={<Layers size={18} />} className="bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-100" />
          <StatCard title="Total Words" value={totalWords.toLocaleString()} icon={<FileText size={18} />} className="bg-warm-200 dark:bg-warm-800 text-warm-900 dark:text-warm-100" />
          <StatCard title="Stories" value={totalStories} icon={<FileText size={18} />} className="bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100" />
          <StatCard title="Images" value={totalImages} icon={<BarChart2 size={18} />} className="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LineChart
              title="Views Trend (Monthly)"
              data={trendData.map(d => d.value)}
              labels={trendData.map(d => d.label)}
              color={accentColors[0]}
            />
          </div>

          <div>
            <DonutChart title="Content Mix" data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  );
};