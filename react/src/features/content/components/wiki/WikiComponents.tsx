import React from 'react';
import { useTheme } from '@/app/providers/ThemeContext';

export const TimelineView: React.FC<{ data: { year: string; event: string }[] }> = ({ data }) => {
  const color = useTheme().useStableAccentColor();
  return (
    <div className="relative border-l-2 border-warm-200 dark:border-warm-700 ml-3 space-y-6 py-2">
      {data.map((item, idx) => (
        <div key={idx} className="relative pl-6">
          <div
            className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-warm-900"
            style={{ backgroundColor: color }}
          />
          <span className="block text-xs font-bold font-mono text-warm-500 dark:text-warm-400 mb-1">{item.year}</span>
          <p className="text-warm-800 dark:text-warm-200 text-sm">{item.event}</p>
        </div>
      ))}
    </div>
  );
};

export const AttributesView: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((attr, idx) => (
        <div key={idx} className="bg-warm-50 dark:bg-warm-800/50 p-3 rounded-xl border border-warm-100 dark:border-warm-700">
          <div className="flex justify-between mb-1 text-xs font-bold uppercase tracking-wider text-warm-600 dark:text-warm-300">
            <span>{attr.label}</span>
            <span>{attr.value}%</span>
          </div>
          <div className="h-2 w-full bg-warm-200 dark:bg-warm-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${attr.value}%`, backgroundColor: attr.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const GalleryView: React.FC<{ data: { url: string; caption: string }[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {data.map((img, idx) => (
        <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden bg-warm-100 dark:bg-warm-800">
          <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <span className="text-xs text-white font-medium truncate w-full">{img.caption}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const QuoteView: React.FC<{ content: string }> = ({ content }) => {
  const color = useTheme().useStableAccentColor();
  return (
    <blockquote className="relative p-6 my-4 bg-warm-50 dark:bg-warm-800/50 rounded-2xl">
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />
      <p className="font-serif text-xl italic text-warm-800 dark:text-warm-200 leading-relaxed text-center">
        {content}
      </p>
    </blockquote>
  );
};

export const OrderedListView: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <ol className="list-none space-y-2 ml-1">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3 text-warm-800 dark:text-warm-300 leading-relaxed">
          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-warm-200 dark:bg-warm-700 text-warm-900 dark:text-warm-100 text-xs font-bold font-mono">
            {idx + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
};

export const TableView: React.FC<{ headers: string[], rows: string[][] }> = ({ headers, rows }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-warm-200 dark:border-warm-700 shadow-sm">
      <table className="w-full min-w-[600px] border-collapse bg-white dark:bg-warm-800/50 text-sm">
        <thead>
          <tr className="bg-warm-100/70 dark:bg-warm-800 border-b border-warm-200 dark:border-warm-700 text-warm-900 dark:text-warm-100">
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4 font-bold text-center uppercase tracking-wide text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-100 dark:divide-warm-700/50">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-warm-50 dark:hover:bg-warm-700/30 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-3 px-4 text-warm-700 dark:text-warm-300 text-center">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CategoryHeader: React.FC<{ category: string, children: React.ReactNode }> = ({ category, children }) => {
  const color = useTheme().useStableAccentColor();
  return (
    <h3 className="px-3 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-warm-500 dark:text-warm-400">
      <span style={{ color: color }}>{children}</span>
      {category}
    </h3>
  );
};