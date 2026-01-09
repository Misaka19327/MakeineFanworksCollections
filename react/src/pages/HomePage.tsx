import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';

import { ContentService } from '@/features/content/api/content.service';
import { ContentCard } from '@/features/content/components/ContentCard';
import { ContentDetailModal } from '@/features/content/components/ContentDetailModal';
import { FilterBar } from '@/features/content/components/FilterBar';
import { ContentItem, FilterState } from '@/features/content/types/content.types';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    contentType: 'all',
    selectedCategory: null,
    selectedTag: null,
    lengthFilter: 'All',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await ContentService.getAll();
        setData(result);
      } catch (err) {
        setError('Failed to load stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (item: ContentItem) => {
    setSelectedItem(item);
    window.history.pushState({ modalOpen: true }, '', window.location.pathname);
  };

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setSelectedItem(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const allTags = useMemo(() => Array.from(new Set(data.flatMap(item => item.tags))), [data]);

  const filteredContent = useMemo(() => {
    return data.filter(item => {
      if (filterState.contentType !== 'all' && item.type !== filterState.contentType) return false;

      const query = filterState.searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.author.name.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (filterState.selectedCategory && item.category !== filterState.selectedCategory) return false;
      if (filterState.selectedTag && !item.tags.includes(filterState.selectedTag)) return false;
      if (filterState.lengthFilter !== 'All' && item.lengthCategory !== filterState.lengthFilter) return false;

      return true;
    });
  }, [filterState, data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-warm-400 gap-4">
        <Loader2 size={40} className="animate-spin text-primary-500" />
        <p className="animate-pulse">Fetching library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-warm-900 dark:text-warm-100">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 rounded-lg hover:bg-warm-800 dark:hover:bg-warm-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="relative mb-8">
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-10 pointer-events-none">
            <div className="absolute -left-[10%] -top-[50%] h-[500px] w-[500px] rounded-full bg-primary-100 blur-[100px]" />
            <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-warm-200 blur-[80px]" />
          </div>

          <div className="relative z-10 px-6 pt-8 pb-4 text-center">
            <h2 className="mb-2 font-serif text-4xl text-warm-900 dark:text-warm-50 md:text-5xl">
              Discover stories that matter.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-warm-800/60 dark:text-warm-300/60">
              A curated collection of thoughts, fictions, and moments captured in time.
            </p>
          </div>

          <FilterBar
            filterState={filterState}
            onSearchChange={(q) => setFilterState(prev => ({ ...prev, searchQuery: q }))}
            onCategoryChange={(c) => setFilterState(prev => ({ ...prev, selectedCategory: c }))}
            onLengthChange={(l) => setFilterState(prev => ({ ...prev, lengthFilter: l }))}
            onTagChange={(t) => setFilterState(prev => ({ ...prev, selectedTag: t }))}
            onContentTypeChange={(t) => setFilterState(prev => ({ ...prev, contentType: t, lengthFilter: 'All' }))}
            allTags={allTags}
          />
        </section>

        <main>
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredContent.map(item => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onClick={() => openModal(item)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-warm-100 dark:bg-warm-800 p-6 text-warm-400 dark:text-warm-500">
                <Search size={48} />
              </div>
              <h3 className="text-xl font-medium text-warm-900 dark:text-warm-100">No results found</h3>
              <p className="mt-2 text-warm-800/50 dark:text-warm-400/50">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => setFilterState({ searchQuery: '', contentType: 'all', selectedCategory: null, selectedTag: null, lengthFilter: 'All' })}
                className="mt-6 text-primary-700 dark:text-primary-400 underline underline-offset-4 hover:text-primary-800 dark:hover:text-primary-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {selectedItem && (
        <ContentDetailModal
          item={selectedItem}
          onClose={closeModal}
          canAddTags={!selectedItem.isTrusted}
        />
      )}
    </>
  );
};