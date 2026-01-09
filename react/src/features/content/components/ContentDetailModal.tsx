import React, { useEffect, useState } from 'react';
import { Heart, Share2, ExternalLink, MessageSquare, Plus, Hash, User, Send, ChevronDown } from 'lucide-react';
import { ContentItem } from '@/features/content/types/content.types';
import { useTheme } from '@/app/providers/ThemeContext';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface ContentDetailModalProps {
  item: ContentItem;
  onClose: () => void;
  canAddTags: boolean;
}

const ALL_COMMENTS = [
  { id: 1, user: 'Alice Walker', text: 'This is absolutely stunning! The atmosphere is palpable.', time: '2h ago' },
  { id: 2, user: 'Bob Builder', text: 'I really enjoyed the pacing of this story. Great work.', time: '5h ago' },
  { id: 3, user: 'Charlie Day', text: 'The ending caught me completely off guard. Needs a sequel!', time: '6h ago' },
];

export const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ item, onClose, canAddTags }) => {
  const [commentText, setCommentText] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const isStory = item.type === 'story';

  // Using the generic Modal component simplifies this file significantly
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      showCloseButton={true}
      className="w-full md:max-w-3xl lg:max-w-4xl max-h-[90vh]"
    >
      {/* Header/Banner Section */}
      <div className="flex-shrink-0">
        {isStory ? (
          <div className="relative h-48 bg-gradient-to-br from-warm-200 to-primary-100 dark:from-warm-800 dark:to-warm-950 p-8 flex flex-col justify-end">
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <h2 className="relative z-10 font-serif text-3xl md:text-4xl font-bold text-warm-900 dark:text-warm-50 leading-tight">
              {item.title}
            </h2>
            <div className="relative z-10 flex items-center gap-2 mt-2 text-warm-800/70 dark:text-warm-300 font-medium">
              <span>{item.author.name}</span>
              <span>•</span>
              <span>{item.lengthCategory} Read</span>
            </div>
          </div>
        ) : (
          <div className="relative h-64 md:h-80 bg-warm-200 dark:bg-warm-800">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white shadow-sm">
                {item.title}
              </h2>
              <p className="text-white/80 text-sm mt-1">{item.author.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="p-6 md:p-8 space-y-8">
        <div className="prose prose-warm dark:prose-invert max-w-none text-warm-800 dark:text-warm-200 leading-relaxed">
          {isStory ? (
            <>
              <p className="font-serif text-lg leading-loose">{item.snippet}...</p>
              <p className="opacity-50 italic text-sm mt-4">[Full story content would be loaded here from the server]</p>
              <div className="my-6 p-4 bg-white dark:bg-warm-800 rounded-xl border border-warm-100 dark:border-warm-700 italic text-warm-600 dark:text-warm-400">
                "The best fiction is far more true than any journalism."
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-warm-600 dark:text-warm-300">Captured with high fidelity settings. This piece explores the relationship between light and shadow in a modern setting.</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-warm-400 flex items-center gap-2">
              <Hash size={14} /> Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 rounded-lg text-sm font-medium">
                #{tag}
              </span>
            ))}
            {canAddTags && (
              <button className="px-3 py-1.5 border border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                <Plus size={14} /> Add
              </button>
            )}
          </div>
        </div>

        {/* Comments (Simplified for brevity in refactor) */}
        <div className="border-t border-warm-100 dark:border-warm-800 pt-6">
          <h3 className="text-lg font-serif font-bold text-warm-900 dark:text-warm-100 flex items-center gap-2 mb-4">
            <MessageSquare size={18} /> Comments
          </h3>
          <div className="space-y-4 mb-4">
            {ALL_COMMENTS.slice(0, visibleCount).map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-warm-200 dark:bg-warm-700 flex items-center justify-center text-warm-600 dark:text-warm-300 flex-shrink-0">
                  <User size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-warm-900 dark:text-warm-100">{comment.user}</span>
                    <span className="text-xs text-warm-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-warm-700 dark:text-warm-300 mt-0.5">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-warm-900 border-t border-warm-100 dark:border-warm-800 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Heart size={18} />}>Like</Button>
          <Button variant="secondary" icon={<Share2 size={18} />}>Share</Button>
        </div>
        <Button variant="primary" icon={<ExternalLink size={16} />}>Visit Source</Button>
      </div>
    </Modal>
  );
};