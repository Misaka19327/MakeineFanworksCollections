import React, { useState, useMemo } from 'react';
import { Search, X, Hash, Filter, Check, Layers, Type, Image as ImageIcon, FileText } from 'lucide-react';
import { FilterState, StoryLength, ContentType } from '@/features/content/types/content.types';
import { Select } from '@/shared/ui/Select';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

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

const InputWrapper = ({ leftIcon, rightIcon, className, ...props }: any) => (
  <div className={`relative ${className?.includes('w-full') ? 'w-full' : ''}`}>
    {leftIcon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
        {leftIcon}
      </div>
    )}
    <Input
      {...props}
      className={`${className} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
    />
    {rightIcon && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {rightIcon}
      </div>
    )}
  </div>
);

const SelectWrapper = ({ label, icon, className, ...props }: any) => (
  <div className={`flex flex-col gap-1 ${className?.includes('w-full') ? 'w-full' : ''}`}>
    {(label || icon) && (
      <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 flex items-center gap-1.5 ml-1">
        {icon} {label}
      </span>
    )}
    <Select {...props} className={className} />
  </div>
);

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
          <InputWrapper
            placeholder="Search via title, author, or source..."
            value={filterState.searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="h-14 text-lg rounded-[1.5rem]"
            leftIcon={<Search size={22} strokeWidth={2.5} />}
            rightIcon={filterState.searchQuery && (
              <button onClick={() => onSearchChange('')} className="p-1 hover:bg-warm-100 rounded-full">
                <X size={18} className="text-warm-400" />
              </button>
            )}
          />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 overflow-x-auto w-full px-1 pb-1 no-scrollbar">

              <SelectWrapper
                label="Type"
                value={filterState.contentType}
                options={contentTypeOptions}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onContentTypeChange(e.target.value as ContentType | 'all')}
                icon={filterState.contentType === 'story' ? <FileText size={14} /> : filterState.contentType === 'image' ? <ImageIcon size={14} /> : <Layers size={14} />}
                className="min-w-[130px]"
              />

              <div className="h-6 w-px bg-warm-200 dark:bg-warm-700 mx-1 flex-shrink-0" />

              <SelectWrapper
                label="Category"
                value={filterState.selectedCategory || ''}
                options={categoryOptions}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value || null)}
                icon={<Filter size={14} />}
                className="min-w-[140px]"
              />

              <SelectWrapper
                label="Format"
                value={filterState.lengthFilter}
                options={lengthOptions}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onLengthChange(e.target.value as StoryLength | 'All')}
                className="min-w-[130px]"
              />

              <div className="h-6 w-px bg-warm-200 dark:bg-warm-700 mx-1 flex-shrink-0" />

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 ml-1">Tags</span>
                <button
                  onClick={() => setIsTagModalOpen(true)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-xl border px-3 h-10 text-sm font-medium transition-all ${filterState.selectedTag
                      ? 'border-warm-800 bg-warm-100 text-warm-900 ring-1 ring-warm-800 dark:bg-warm-700 dark:text-warm-100 dark:border-warm-500'
                      : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-900 text-warm-500 dark:text-warm-300 hover:border-warm-400 hover:bg-warm-50 dark:hover:bg-warm-700'
                    }`}
                >
                  <Hash size={14} />
                  <span>{filterState.selectedTag || 'Any Tag'}</span>
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
      </div>

      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      >
        <div className="border-b border-warm-100 dark:border-warm-800 p-4">
          <h3 className="text-lg font-bold font-serif text-warm-900 dark:text-warm-100">Explore Tags</h3>
        </div>
        <div className="px-5 pt-4 pb-2">
          <InputWrapper
            autoFocus
            placeholder="Find a tag..."
            value={tagSearchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
            className="py-3 rounded-xl"
          />
        </div>

        <div className="p-5 pt-2">
          {filterState.selectedTag && (
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-warm-400 mb-2">Active</div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => { onTagChange(null); setIsTagModalOpen(false); }}
                icon={<Hash size={12} />}
                className="rounded-lg"
              >
                {filterState.selectedTag}
                <X size={14} className="ml-1 opacity-70" />
              </Button>
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
                  className={`group flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${filterState.selectedTag === tag
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
      </Modal>
    </>
  );
};