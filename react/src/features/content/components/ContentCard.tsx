import React from 'react';
import { Heart, Eye, ShieldCheck, BookOpen, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { ContentItem } from '@/features/content/types/content.types';
import { IconPill } from '@/shared/ui/IconPill';
import { useTheme } from '@/app/providers/ThemeContext';

interface ContentCardProps {
  item: ContentItem;
  onClick?: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, onClick }) => {
  const isStory = item.type === 'story';

  // Get a stable random color for this card to add visual variety
  const accentColor = useTheme().useStableAccentColor();

  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-warm-900 transition-all duration-300 hover:shadow-xl hover:shadow-warm-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 border border-warm-100 dark:border-warm-800 cursor-pointer"
    >

      {/* --- Visual Header (Top Half) --- */}
      {isStory ? (
        <div
          className="h-32 w-full p-6 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}10 100%)`
          }}
        >
          {/* Decorative Blur Circle */}
          <div
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-all duration-500 group-hover:opacity-70 opacity-40"
            style={{ backgroundColor: accentColor }}
          />

          <div className="flex justify-between items-start z-10">
            <span className="inline-flex items-center rounded-full bg-white/80 dark:bg-black/30 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-warm-900 dark:text-warm-100 shadow-sm">
              <BookOpen size={10} className="mr-1.5" />
              {item.lengthCategory}
            </span>
            {item.isTrusted && (
              <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full p-1" title="Trusted Source">
                <ShieldCheck size={14} strokeWidth={2.5} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative h-48 w-full overflow-hidden bg-warm-200 dark:bg-warm-800">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            {item.isTrusted && (
              <div className="text-white bg-black/20 backdrop-blur-md rounded-full p-1.5" title="Trusted Source">
                <ShieldCheck size={14} strokeWidth={2.5} />
              </div>
            )}
          </div>
          <div className="absolute top-3 left-3 flex gap-1">
            <span className="inline-flex items-center rounded-full bg-black/30 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              <ImageIcon size={10} className="mr-1.5" />
              Image
            </span>
          </div>
        </div>
      )}

      {/* --- Content Body (Bottom Half) --- */}
      <div className="flex flex-1 flex-col p-5">

        {/* Author Info */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-warm-200 dark:bg-warm-800 ring-2 ring-white dark:ring-warm-800">
            <img
              src={item.author.avatar || `https://ui-avatars.com/api/?name=${item.author.name}&background=f2e8e5&color=5d4037`}
              alt={item.author.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-warm-800/80 dark:text-warm-300">{item.author.name}</span>
          <span className="text-[10px] text-warm-800/40 dark:text-warm-600">•</span>
          <span className="text-[10px] text-warm-800/50 dark:text-warm-500 truncate max-w-[80px]">{item.source}</span>
        </div>

        {/* Title with Dynamic Hover Color */}
        <h3
          className="mb-2 text-xl font-serif font-bold leading-tight text-warm-900 dark:text-warm-50 transition-colors duration-300"
          style={{ '--hover-color': accentColor } as React.CSSProperties}
        >
          <span className="group-hover:text-[var(--hover-color)] transition-colors">
            {item.title}
          </span>
        </h3>

        {isStory && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-warm-800/70 dark:text-warm-400 font-light">
            {item.snippet}
          </p>
        )}

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="rounded-md bg-warm-100 dark:bg-warm-800 px-2 py-0.5 text-[10px] font-medium text-warm-800/60 dark:text-warm-300 transition-colors group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between border-t border-warm-100 dark:border-warm-800 pt-3">
          <div className="flex gap-4">
            <IconPill icon={<Eye size={14} />} label={formatNumber(item.views)} className="dark:text-warm-500" />
            <IconPill icon={<Heart size={14} className="group-hover:text-rose-500 transition-colors" />} label={formatNumber(item.likes)} className="dark:text-warm-500" />
          </div>
          <span className="text-[10px] font-medium text-warm-800/40 dark:text-warm-500 bg-warm-50 dark:bg-warm-800 px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
};