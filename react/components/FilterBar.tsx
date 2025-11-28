import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Hash, Filter, Check, Layers, Type, Image as ImageIcon, FileText } from 'lucide-react';
import { FilterState, StoryLength, ContentType } from '../types';
import { Select } from './ui/Select';

interface FilterBarProps {
  filterState: FilterState;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  onLengthChange: (length: StoryLength | 'All') => void;
  onTagChange: (tag: string | null) => void;
  onContentTypeChange: (type: ContentType | 'all') => void;
  allTags: string[];
}

const CATEGORIES = ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Slice of Life', 'Horror', 'Historical'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onSearchChange,
  onCategoryChange,
  onLengthChange,
  onTagChange,
  onContentTypeChange,
  allTags
}) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  const filteredTags = useMemo(() => {
    if (!tagSearchQuery) return allTags;
    return allTags.filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()));
  }, [allTags, tagSearchQuery]);

  const contentTypeOptions = [
    { value: 'all', label: 'All Content' },
    { value: 'story', label: 'Stories' },
    { value: 'image', label: 'Images' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...CATEGORIES.map(c => ({ value: c, label: c }))
  ];

  const lengthOptions = useMemo(() => {
    if (filterState.contentType === 'story') {
      return [
        { value: 'All', label: 'Any Length' },
        { value: 'Short', label: 'Short' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Long', label: 'Long' }
      ];
    } else if (filterState.contentType === 'image') {
       return [
        { value: 'All', label: 'Any Orientation' },
        { value: 'Landscape', label: 'Landscape' },
        { value: 'Portrait', label: 'Portrait' }
      ];
    }
    return [
      { value: 'All', label: 'Any Format' },
      { value: 'Short', label: 'Short Story' },
      { value: 'Medium', label: 'Medium Story' },
      { value: 'Long', label: 'Long Story' },
      { value: 'Landscape', label: 'Img: Landscape' },
      { value: 'Portrait', label: 'Img: Portrait' }
    ];
  }, [filterState.contentType]);

  return (
    <>
      <div className="sticky top-4 z-40 mx-auto w-full max-w-5xl px-4 md:px-0">
        <div className="flex flex-col gap-3 rounded-[2rem] bg-white/90 dark:bg-warm-900/90 p-3 shadow-xl shadow-warm-900/5 dark:shadow-black/20 backdrop-blur-xl ring-1 ring-warm-900/5 dark:ring-white/5 transition-all">
          
          {/* Search Input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 flex items-center text-warm-800/40 dark:text-warm-400">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search via title, author, or source..."
              className="h-14 w-full rounded-[1.5rem] bg-warm-50 dark:bg-warm-800 pl-12 pr-4 text-lg text-warm-900 dark:text-warm-100 placeholder-warm-800/30 dark:placeholder-warm-500 outline-none ring-1 ring-transparent transition-all focus:bg-white dark:focus:bg-warm-900 focus:ring-2 focus:ring-primary-500/20 hover:bg-warm-100/50 dark:hover:bg-warm-700/50"
              value={filterState.searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {filterState.searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-4 rounded-full p-1 text-warm-800/40 dark:text-warm-500 hover:bg-warm-100 dark:hover:bg-warm-700 hover:text-warm-900 dark:hover:text-warm-200"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 overflow-x-auto w-full px-1 pb-1 no-scrollbar">
              
              <Select 
                label="Type" 
                value={filterState.contentType} 
                options={contentTypeOptions} 
                onChange={(val) => onContentTypeChange(val as ContentType | 'all')}
                icon={filterState.contentType === 'story' ? <FileText size={14}/> : filterState.contentType === 'image' ? <ImageIcon size={14}/> : <Layers size={14}/>}
                className="min-w-[130px]"
              />

              <div className="h-6 w-px bg-warm-200 dark:bg-warm-700 mx-1 flex-shrink-0" />

              <Select
                label="Category"
                value={filterState.selectedCategory || ''}
                options={categoryOptions}
                onChange={(val) => onCategoryChange(val || null)}
                icon={<Filter size={14} />}
                className="min-w-[140px]"
              />

              <Select
                label="Format"
                value={filterState.lengthFilter}
                options={lengthOptions}
                onChange={(val) => onLengthChange(val as StoryLength | 'All')}
                className="min-w-[130px]"
              />

              <div className="h-6 w-px bg-warm-200 dark:bg-warm-700 mx-1 flex-shrink-0" />

              <button
                onClick={() => setIsTagModalOpen(true)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                  filterState.selectedTag
                    ? 'border-warm-800 bg-warm-100 text-warm-900 ring-1 ring-warm-800 dark:bg-warm-700 dark:text-warm-100 dark:border-warm-500' 
                    : 'border-dashed border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-500 dark:text-warm-300 hover:border-warm-400 hover:bg-warm-50 dark:hover:bg-warm-700'
                }`}
              >
                <Hash size={14} />
                <span>{filterState.selectedTag || 'Tags'}</span>
                {filterState.selectedTag && (
                   <div onClick={(e) => {
                     e.stopPropagation();
                     onTagChange(null);
                   }} className="ml-1 rounded-full p-0.5 hover:bg-warm-200 dark:hover:bg-warm-600">
                     <X size={12} />
                   </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isTagModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-warm-900/30 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsTagModalOpen(false)}
          />
          <div className="relative w-full max-w-lg flex flex-col max-h-[80vh] overflow-hidden rounded-[2rem] bg-white dark:bg-warm-900 shadow-2xl ring-1 ring-warm-100 dark:ring-warm-800 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-warm-100 dark:border-warm-800 p-5 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-warm-900 dark:text-warm-100">Explore Tags</h3>
                <p className="text-xs text-warm-500 dark:text-warm-400">Select a tag to filter content</p>
              </div>
              <button 
                onClick={() => setIsTagModalOpen(false)}
                className="rounded-full bg-warm-50 dark:bg-warm-800 p-2 text-warm-500 dark:text-warm-400 transition-colors hover:bg-warm-100 dark:hover:bg-warm-700 hover:text-warm-900 dark:hover:text-warm-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input 
                    type="text" 
                    placeholder="Find a tag..." 
                    autoFocus
                    className="w-full rounded-xl bg-warm-50 dark:bg-warm-800 py-3 pl-9 pr-4 text-sm text-warm-900 dark:text-warm-100 outline-none ring-1 ring-transparent focus:ring-primary-200 dark:focus:ring-primary-900 transition-all"
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pt-2 custom-scrollbar">
               {filterState.selectedTag && (
                 <div className="mb-4">
                   <div className="text-[10px] font-bold uppercase tracking-wider text-warm-400 mb-2">Active</div>
                   <button
                    onClick={() => { onTagChange(null); setIsTagModalOpen(false); }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-warm-900 dark:bg-primary-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm"
                   >
                     <Hash size={12} />
                     {filterState.selectedTag}
                     <X size={14} className="ml-1 opacity-70" />
                   </button>
                 </div>
               )}

               <div className="text-[10px] font-bold uppercase tracking-wider text-warm-400 mb-2">
                 {tagSearchQuery ? 'Search Results' : 'All Tags'}
               </div>
               
               <div className="flex flex-wrap gap-2">
                 {filteredTags.length > 0 ? (
                   filteredTags.map(tag => (
                     <button
                       key={tag}
                       onClick={() => {
                         onTagChange(tag === filterState.selectedTag ? null : tag);
                         setIsTagModalOpen(false);
                       }}
                       className={`group flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${
                         filterState.selectedTag === tag
                           ? 'border-warm-900 bg-warm-900 text-white dark:bg-primary-600 dark:border-primary-600'
                           : 'border-warm-100 dark:border-warm-800 bg-white dark:bg-warm-800/50 text-warm-600 dark:text-warm-300 hover:border-warm-300 dark:hover:border-warm-600 hover:bg-warm-50 dark:hover:bg-warm-800'
                       }`}
                     >
                       <span className="opacity-50">#</span>
                       {tag}
                       {filterState.selectedTag === tag && <Check size={12} />}
                     </button>
                   ))
                 ) : (
                   <div className="w-full py-8 text-center text-warm-400 text-sm">
                     No tags found for "{tagSearchQuery}"
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};