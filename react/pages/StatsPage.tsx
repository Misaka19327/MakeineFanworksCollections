import React, { useMemo, useEffect, useState } from 'react';
import { ArrowLeft, BarChart2, FileText, Layers, PieChart, TrendingUp, Loader2 } from 'lucide-react';
import { ContentItem } from '../types';
import { ContentService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface StatsPageProps {
  onBack: () => void;
}

// --- Chart Components ---

const LineChart: React.FC<{ data: { label: string; value: number }[]; color?: string }> = ({ data, color = "#ff7043" }) => {
  if (!data.length) return null;
  
  const height = 150; 
  const width = 500; 
  const padding = 20;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');
  
  const lastX = width - padding;
  const firstX = padding;
  const fillPath = `${points} L ${lastX},${height} L ${firstX},${height} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points.split(' ')[0]} ${fillPath.substring(points.split(' ')[0].length)}`} fill="url(#chartGradient)" stroke="none" />
        <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {data.map((d, i) => {
           const x = padding + (i / (data.length - 1)) * (width - padding * 2);
           const y = height - padding - (d.value / maxValue) * (height - padding * 2);
           return (
             <g key={i} className="group">
               <circle cx={x} cy={y} r="4" fill="white" className="dark:fill-warm-900" stroke={color} strokeWidth="2" />
             </g>
           );
        })}
      </svg>
    </div>
  );
};

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const size = 200; 
  const center = size / 2; 
  const radius = 80; 
  const strokeWidth = 20;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-48 transform -rotate-90">
        {data.map((item, i) => {
          const sliceAngle = (item.value / total) * 360;
          const isFull = sliceAngle === 360;
          
          const x1 = center + radius * Math.cos((Math.PI * currentAngle) / 180);
          const y1 = center + radius * Math.sin((Math.PI * currentAngle) / 180);
          const endAngle = currentAngle + sliceAngle;
          const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
          const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
          
          const largeArc = sliceAngle > 180 ? 1 : 0;
          const pathData = isFull 
             ? `M ${center - radius}, ${center} a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
             : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
             
          currentAngle += sliceAngle;
          return <path key={i} d={pathData} fill="none" stroke={item.color} strokeWidth={strokeWidth} />;
        })}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-warm-900 dark:text-warm-100">
        <span className="text-3xl font-serif font-bold">{total}</span>
        <span className="text-xs text-warm-500 dark:text-warm-400 uppercase tracking-wide">Total</span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string | number, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
  <div className={`p-5 rounded-3xl ${color} bg-opacity-50 dark:bg-opacity-20 transition-transform hover:scale-[1.02]`}>
    <div className="flex items-center gap-2 mb-2 opacity-70">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-serif font-bold">{value}</div>
  </div>
);

// --- Main Page ---

export const StatsPage: React.FC<StatsPageProps> = ({ onBack }) => {
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

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-warm-950"><Loader2 className="animate-spin text-warm-500"/></div>;

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-950 pb-20">
      <div className="sticky top-0 z-30 bg-warm-50/90 dark:bg-warm-950/90 backdrop-blur-md border-b border-warm-100 dark:border-warm-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 shadow-sm border border-warm-100 dark:border-warm-800 hover:bg-warm-100 dark:hover:bg-warm-800">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif font-bold text-warm-900 dark:text-warm-100">Dashboard</h1>
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Items" value={totalItems} icon={<Layers size={18} />} color="bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-100" />
          <StatCard label="Total Words" value={totalWords.toLocaleString()} icon={<FileText size={18} />} color="bg-warm-200 dark:bg-warm-800 text-warm-900 dark:text-warm-100" />
          <StatCard label="Stories" value={totalStories} icon={<FileText size={18} />} color="bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100" />
          <StatCard label="Images" value={totalImages} icon={<BarChart2 size={18} />} color="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[2rem] bg-white dark:bg-warm-900 p-6 shadow-sm ring-1 ring-warm-100 dark:ring-warm-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary-500" /> 
                Views Trends (Monthly)
              </h2>
            </div>
            {/* Pass the first accent color (Primary) as the line chart color */}
            <LineChart data={trendData} color={accentColors[0]} />
          </div>
          
          <div className="rounded-[2rem] bg-white dark:bg-warm-900 p-6 shadow-sm ring-1 ring-warm-100 dark:ring-warm-800 flex flex-col">
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 flex items-center gap-2 mb-6">
                <PieChart size={20} className="text-purple-500" /> Content Mix
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center"><DonutChart data={categoryData} /></div>
            
            <div className="mt-8 space-y-2">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-warm-600 dark:text-warm-300">{item.label}</span>
                   </div>
                   <span className="font-bold text-warm-900 dark:text-warm-100">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};