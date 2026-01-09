import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
  Layers,
  FileText,
  X,
  Loader2,
  Save,
} from 'lucide-react';

import { ContentService } from '@/features/content/api/content.service';
import { ContentItem } from '@/features/content/types/content.types';
import { Select } from '@/shared/ui/Select';

interface ContributePageProps {
  onBack: () => void;
}

const CATEGORIES = [
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Mystery', label: 'Mystery' },
  { value: 'Slice of Life', label: 'Slice of Life' },
  { value: 'Horror', label: 'Horror' },
  { value: 'Historical', label: 'Historical' },
];

export const ContributePage: React.FC<ContributePageProps> = ({ onBack }) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    tags: [] as string[],
    snippet: '',
    tagInput: ''
  });

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await ContentService.getUntrusted();
      setItems(data);
      if (data.length > 0) {
        selectItem(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectItem = (item: ContentItem) => {
    setSelectedId(item.id);
    setFormData({
      category: item.category || '',
      tags: item.tags || [],
      snippet: item.snippet || '',
      tagInput: ''
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.tagInput.trim()) {
      e.preventDefault();
      const newTag = formData.tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag],
          tagInput: ''
        }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!selectedId) return;

    setIsSubmitting(true);
    try {
      await ContentService.updateItem(selectedId, {
        category: formData.category,
        tags: formData.tags,
        snippet: formData.snippet
      });

      const remainingItems = items.filter(i => i.id !== selectedId);
      setItems(remainingItems);

      if (remainingItems.length > 0) {
        selectItem(remainingItems[0]);
      } else {
        setSelectedId(null);
      }

    } catch (e) {
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedItem = items.find(i => i.id === selectedId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-warm-50 dark:bg-warm-950 text-warm-500 gap-2">
        <Loader2 className="animate-spin" />
        <span>Loading review queue...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-950 flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-warm-50/90 dark:bg-warm-950/90 backdrop-blur-md border-b border-warm-200 dark:border-warm-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-700 dark:text-warm-300 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif font-bold text-lg text-warm-900 dark:text-warm-100 leading-none">Community Review</h1>
            <span className="text-xs text-warm-500 dark:text-warm-400">{items.length} items waiting</span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Queue */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-warm-400 px-1">Pending Approval</h2>

          <div className="flex flex-col gap-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-1">
            {items.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-warm-900 rounded-2xl border border-dashed border-warm-200 dark:border-warm-800">
                <CheckCircle2 size={32} className="mx-auto text-green-500 mb-2" />
                <p className="text-warm-600 dark:text-warm-300 font-medium">All caught up!</p>
                <p className="text-xs text-warm-400">No pending items found.</p>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${selectedId === item.id
                    ? 'bg-white dark:bg-warm-800 border-primary-500 shadow-md ring-1 ring-primary-500'
                    : 'bg-white dark:bg-warm-900 border-warm-100 dark:border-warm-800 hover:border-warm-300 dark:hover:border-warm-700 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.type === 'story' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                      }`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-warm-400">{item.author.name}</span>
                  </div>
                  <h3 className="font-bold text-warm-900 dark:text-warm-100 leading-tight mb-1">{item.title}</h3>
                  <p className="text-xs text-warm-500 line-clamp-1">{item.source}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="md:col-span-2">
          {selectedItem ? (
            <div className="bg-white dark:bg-warm-900 rounded-[2rem] border border-warm-200 dark:border-warm-800 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Preview */}
              <div className="mb-8 p-4 bg-warm-50 dark:bg-warm-800 rounded-2xl border border-warm-100 dark:border-warm-700">
                <div className="flex items-center gap-2 mb-2 text-warm-500 dark:text-warm-400 text-xs font-mono">
                  <AlertCircle size={14} />
                  <span>Original Submission Preview</span>
                </div>
                {selectedItem.type === 'story' ? (
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-warm-900 dark:text-warm-100">{selectedItem.title}</h2>
                    <p className="mt-2 text-warm-700 dark:text-warm-300 italic">"{selectedItem.snippet}"</p>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <img src={selectedItem.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl" />
                    <div>
                      <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100">{selectedItem.title}</h2>
                      <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">Uploaded by {selectedItem.author.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="space-y-6">

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-warm-700 dark:text-warm-300">
                    <Layers size={16} /> Category
                  </label>
                  <Select
                    value={formData.category}
                    options={CATEGORIES}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-warm-700 dark:text-warm-300">
                    <FileText size={16} /> Short Description / Snippet
                  </label>
                  <textarea
                    className="w-full h-28 p-4 bg-warm-50 dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 focus:bg-white dark:focus:bg-warm-900 transition-all text-warm-900 dark:text-warm-100 leading-relaxed"
                    placeholder="Write a compelling snippet or description..."
                    value={formData.snippet}
                    onChange={(e) => setFormData(prev => ({ ...prev, snippet: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-warm-700 dark:text-warm-300">
                    <Tag size={16} /> Tags
                  </label>
                  <div className="p-2 bg-warm-50 dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-2xl focus-within:ring-2 focus-within:ring-primary-200 dark:focus-within:ring-primary-900 focus-within:bg-white dark:focus-within:bg-warm-900 transition-all">
                    <div className="flex flex-wrap gap-2 mb-2 px-1">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-warm-200 dark:bg-warm-700 text-warm-900 dark:text-warm-100 text-xs font-medium px-2 py-1 rounded-lg">
                          #{tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-600"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none text-sm px-2 py-1 placeholder-warm-400 dark:text-warm-100"
                      placeholder="Type tag and press Enter..."
                      value={formData.tagInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                  <p className="text-[10px] text-warm-400 px-1">Press Enter to add a tag.</p>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-warm-100 dark:border-warm-800">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="px-6 py-3 rounded-xl text-warm-600 dark:text-warm-400 font-medium hover:bg-warm-50 dark:hover:bg-warm-800 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.category}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-warm-900 dark:bg-primary-600 text-white font-bold shadow-lg shadow-warm-900/20 hover:bg-warm-800 dark:hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Verify & Publish
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-warm-400 dark:text-warm-600 bg-warm-50/50 dark:bg-warm-900/50 rounded-[2rem] border-2 border-dashed border-warm-200 dark:border-warm-800 min-h-[400px]">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Select an item from the left to start reviewing</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};