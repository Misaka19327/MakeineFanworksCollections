import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Share2, ExternalLink, MessageSquare, Plus, Hash, User, Send, ChevronDown } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentDetailModalProps {
  item: ContentItem;
  onClose: () => void;
  canAddTags: boolean;
}

const ALL_COMMENTS = [
  { id: 1, user: 'Alice Walker', text: 'This is absolutely stunning! The atmosphere is palpable.', time: '2h ago' },
  { id: 2, user: 'Bob Builder', text: 'I really enjoyed the pacing of this story. Great work.', time: '5h ago' },
  { id: 3, user: 'Charlie Day', text: 'The ending caught me completely off guard. Needs a sequel!', time: '6h ago' },
  { id: 4, user: 'Diana Prince', text: 'Beautiful imagery in the second paragraph.', time: '8h ago' },
  { id: 5, user: 'Evan Peters', text: 'Is this based on a true event? It feels so real.', time: '12h ago' },
  { id: 6, user: 'Fiona Gallagher', text: 'I disagree with the other comments, I think the middle dragged a bit.', time: '1d ago' },
  { id: 7, user: 'George Martin', text: 'Not enough dragons, but still quality writing.', time: '1d ago' },
  { id: 8, user: 'Hannah Montana', text: 'Best of both worlds: gritty realism and magical fantasy.', time: '2d ago' },
];

const INITIAL_COMMENT_COUNT = 3;
const LOAD_INCREMENT = 3;

export const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ item, onClose, canAddTags }) => {
  const [commentText, setCommentText] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENT_COUNT);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_INCREMENT, ALL_COMMENTS.length));
  };

  const isStory = item.type === 'story';
  const displayedComments = ALL_COMMENTS.slice(0, visibleCount);
  const hasMoreComments = visibleCount < ALL_COMMENTS.length;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      
      <div 
        className={`absolute inset-0 bg-warm-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      <div 
        className={`relative flex flex-col w-full md:max-w-3xl lg:max-w-4xl max-h-[90vh] bg-warm-50 dark:bg-warm-900 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-warm-100 dark:ring-warm-800 transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'}`}
      >
        
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/30 transition-colors"
        >
          <X size={20} />
        </button>

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

        <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                   <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-white dark:bg-warm-800 p-3 rounded-xl text-xs">
                        <span className="block text-warm-400 uppercase tracking-wider font-bold">Resolution</span>
                        <span className="text-warm-900 dark:text-warm-100 font-mono">4096 x 2160</span>
                      </div>
                      <div className="bg-white dark:bg-warm-800 p-3 rounded-xl text-xs">
                        <span className="block text-warm-400 uppercase tracking-wider font-bold">License</span>
                        <span className="text-warm-900 dark:text-warm-100">Creative Commons</span>
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-warm-400 flex items-center gap-2">
                  <Hash size={14} /> Tags
                </h3>
                {canAddTags && (
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                    Contributions Allowed
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 rounded-lg text-sm font-medium">
                    #{tag}
                  </span>
                ))}
                
                {canAddTags ? (
                  <button className="px-3 py-1.5 border border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                    <Plus size={14} /> Add
                  </button>
                ) : (
                  <span className="px-3 py-1.5 border border-warm-100 dark:border-warm-700 text-warm-300 dark:text-warm-600 rounded-lg text-sm select-none cursor-not-allowed" title="Tagging locked">
                    Locked
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-warm-100 dark:border-warm-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-serif font-bold text-warm-900 dark:text-warm-100 flex items-center gap-2">
                   <MessageSquare size={18} /> Comments 
                   <span className="text-sm font-sans font-normal text-warm-400">({ALL_COMMENTS.length})</span>
                 </h3>
              </div>
              
              <div className="space-y-4 mb-4">
                {displayedComments.map(comment => (
                  <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
              
              {hasMoreComments && (
                <button 
                  onClick={handleLoadMore}
                  className="w-full py-2 mb-6 text-xs font-bold uppercase tracking-wide text-warm-500 hover:text-warm-800 dark:hover:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  Show more comments
                  <ChevronDown size={14} />
                </button>
              )}

              <div className="relative">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all text-warm-900 dark:text-warm-100"
                />
                <button 
                  disabled={!commentText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary-500 text-white disabled:opacity-50 disabled:bg-warm-200 dark:disabled:bg-warm-700 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="flex-shrink-0 p-4 bg-white dark:bg-warm-900 border-t border-warm-100 dark:border-warm-800 flex items-center justify-between gap-4">
           <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
               <Heart size={18} />
               <span className="hidden sm:inline text-sm font-medium">Like</span>
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors">
               <Share2 size={18} />
               <span className="hidden sm:inline text-sm font-medium">Share</span>
             </button>
           </div>

           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 shadow-lg shadow-warm-900/20 hover:bg-warm-800 dark:hover:bg-warm-200 transition-transform active:scale-95">
             <span>Visit Source</span>
             <ExternalLink size={16} />
           </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};