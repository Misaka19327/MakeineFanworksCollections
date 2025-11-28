import React, { useMemo } from 'react';
import { ArrowLeft, BarChart2, Calendar, FileText, Layers, PieChart, TrendingUp } from 'lucide-react';
import { ContentItem } from '../types';

interface StatsPageProps {
  data: ContentItem[];
  onBack: () => void;
}

// --- Simple SVG Chart Components ---

const LineChart = ({ data, color = "#ff7043" }: { data: { label: string; value: number }[]; color?: string }) => {
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

  // Create fill area path
  const firstX = padding;
  const lastX = width - padding;
  const fillPath = `${points} L ${lastX},${height} L ${firstX},${height} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Gradient Defs */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill Area */}
        <path d={`M ${points.split(' ')[0]} ${fillPath.substring(points.split(' ')[0].length)}`} fill="url(#chartGradient)" stroke="none" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        
        {/* Points */}
        {data.map((d, i) => {
           const x = padding + (i / (data.length - 1)) * (width - padding * 2);
           const y = height - padding - (d.value / maxValue) * (height - padding * 2);
           return (
             <g key={i} className="group">
               <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
               {/* Tooltip-ish text */}
               <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#5d4037" className="opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                 {d.value}
               </text>
               <text x={x} y={height - 5} textAnchor="middle" fontSize="10" fill="#a1887f">
                 {d.label}
               </text>
             </g>
           );
        })}
      </svg>
    </div>
  );
};

const DonutChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
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
          // Avoid drawing tiny slices that break math or full circles differently
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

          const el = (
            <path
              key={i}
              d={pathData}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              className="transition-all hover:opacity-80 hover:stroke-[22]"
            />
          );
          currentAngle += sliceAngle;
          return el;
        })}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-warm-900">
        <span className="text-3xl font-serif font-bold">{total}</span>
        <span className="text-xs text-warm-500 uppercase tracking-wide">Total</span>
      </div>
    </div>
  );
};


export const StatsPage: React.FC<StatsPageProps> = ({ data, onBack }) => {

  // --- Calculations ---

  // 1. Overview Metrics
  const totalItems = data.length;
  const totalWords = data.reduce((acc, item) => acc + (item.wordCount || 0), 0);
  const totalStories = data.filter(i => i.type === 'story').length;
  const totalImages = data.filter(i => i.type === 'image').length;

  // 2. Trend Data (Line Chart) - Mocking a bit more variance for the visual
  // Since DUMMY_DATA is static, we group by month
  const trendData = useMemo(() => {
    // Map of Month -> Count
    const groups: Record<string, number> = {};
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize
    months.forEach(m => groups[m] = 0);

    data.forEach(item => {
      const date = new Date(item.publishedAt);
      const month = date.toLocaleString('default', { month: 'short' });
      if (groups[month] !== undefined) {
        groups[month] += (item.views || 0); // Plotting Views instead of count for a more dynamic line
      }
    });

    return Object.entries(groups).map(([label, value]) => ({ label, value }));
  }, [data]);

  // 3. Category Data (Donut Chart)
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      const cat = item.category || 'Other';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    
    // Assign colors
    const colors = ['#e64a19', '#f57c00', '#ffa000', '#fbc02d', '#afb42b', '#7cb342', '#00897b'];
    
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length]
      }));
  }, [data]);

  return (
    <div className="min-h-screen bg-warm-50 pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-warm-50/90 backdrop-blur-md border-b border-warm-100">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-warm-900 shadow-sm border border-warm-100 hover:bg-warm-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif font-bold text-warm-900">Dashboard</h1>
          </div>
          <div className="text-xs text-warm-500 font-medium px-3 py-1 bg-warm-100 rounded-full">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 space-y-8">
        
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Items" value={totalItems} icon={<Layers size={18} />} color="bg-primary-100 text-primary-900" />
          <StatCard label="Total Words" value={totalWords.toLocaleString()} icon={<FileText size={18} />} color="bg-warm-200 text-warm-900" />
          <StatCard label="Stories" value={totalStories} icon={<FileText size={18} />} color="bg-orange-100 text-orange-900" />
          <StatCard label="Images" value={totalImages} icon={<BarChart2 size={18} />} color="bg-blue-100 text-blue-900" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Line Chart (Views Trend) */}
          <div className="lg:col-span-2 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-warm-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-warm-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary-500" />
                Views Trends (Monthly)
              </h2>
              <div className="text-xs font-medium text-warm-400 bg-warm-50 px-2 py-1 rounded-lg">Last 5 Months</div>
            </div>
            
            <LineChart data={trendData} />
            
            <div className="mt-4 text-center text-xs text-warm-400">
              Total accumulated views across all content types over time.
            </div>
          </div>

          {/* Donut Chart (Categories) */}
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-warm-100 flex flex-col">
            <h2 className="text-lg font-bold text-warm-900 flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-purple-500" />
              Content Mix
            </h2>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <DonutChart data={categoryData} />
            </div>

            <div className="mt-8 space-y-2">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-warm-600">{item.label}</span>
                   </div>
                   <span className="font-bold text-warm-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className={`p-5 rounded-3xl ${color} bg-opacity-50 transition-transform hover:scale-[1.02]`}>
    <div className="flex items-center gap-2 mb-2 opacity-70">
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-serif font-bold">{value}</div>
  </div>
);