import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, BookOpen, Map, Users, Sparkles, 
  ChevronRight, ChevronDown, Clock, Globe, Shield, Tag, Menu, X
} from 'lucide-react';

// --- Wiki Data Types ---

type ArticleCategory = 'Characters' | 'Locations' | 'Magic & Tech' | 'History' | 'Factions';

interface WikiSection {
  title: string;
  content: string; // Supports rudimentary markdown-like rendering
}

interface WikiArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  lastUpdated: string;
  summary: string;
  sections: WikiSection[];
  relatedIds: string[];
  image?: string;
  stats?: { label: string; value: string }[]; // For "Infobox" style data
}

// --- Dummy Wiki Data ---

const WIKI_DATA: WikiArticle[] = [
  {
    id: 'eliza-vance',
    title: 'Eliza Vance',
    category: 'Characters',
    lastUpdated: '2023-11-12',
    summary: 'The protagonist of "The Clockmaker\'s Daughter", Eliza is known for her innate ability to hear the "song" of mechanical objects.',
    image: 'https://ui-avatars.com/api/?name=Eliza+Vance&background=eaddd7&color=5d4037&size=200',
    stats: [
      { label: 'Role', value: 'Protagonist' },
      { label: 'Age', value: '24' },
      { label: 'Affiliation', value: 'The Brass Guild' }
    ],
    sections: [
      {
        title: 'Biography',
        content: 'Born in the industrial district of Oakhaven, Eliza was orphaned at a young age and taken in by the Master Clockmaker. She quickly displayed an unusual talent: she did not need tools to diagnose a broken machine; she could simply listen to its rhythm.'
      },
      {
        title: 'Abilities',
        content: '**Mechanized Synesthesia:** Eliza perceives the function of machinery as music. A well-oiled engine hums a lullaby, while a rusted gear screams in dissonance.'
      }
    ],
    relatedIds: ['brass-heart', 'oakhaven']
  },
  {
    id: 'oakhaven',
    title: 'Oakhaven',
    category: 'Locations',
    lastUpdated: '2023-10-05',
    summary: 'A sprawling metropolis powered by steam and clockwork, serving as the primary setting for the Gear Chronicles.',
    image: 'https://picsum.photos/id/122/400/300',
    stats: [
      { label: 'Population', value: '2.5 Million' },
      { label: 'Government', value: 'Technocratic Council' },
      { label: 'Climate', value: 'Rainy/Industrial' }
    ],
    sections: [
      {
        title: 'Overview',
        content: 'Oakhaven is a city built vertically. The wealthy live in the "Sun-Spires" above the smog layer, while the workers inhabit the "Undercity", a labyrinth of pipes and tunnels.'
      },
      {
        title: 'Districts',
        content: '- **The Foundry:** Industrial heart.\n- **Velvet Row:** Entertainment and high society.\n- **The Rustyards:** Scrapyards and black markets.'
      }
    ],
    relatedIds: ['eliza-vance']
  },
  {
    id: 'brass-heart',
    title: 'The Brass Heart',
    category: 'Magic & Tech',
    lastUpdated: '2023-09-20',
    summary: 'A legendary artifact said to grant eternal life to machines, turning constructs into sentient beings.',
    stats: [
      { label: 'Type', value: 'Artifact' },
      { label: 'Status', value: 'Lost' },
      { label: 'Origin', value: 'Pre-Collapse Era' }
    ],
    sections: [
      {
        title: 'Mythology',
        content: 'Legend says the Heart was forged by the First Architect. It is not just a power source, but a soul-vessel.'
      }
    ],
    relatedIds: ['eliza-vance']
  },
   {
    id: 'neon-verve',
    title: 'Neon Verve',
    category: 'Locations',
    lastUpdated: '2023-12-01',
    summary: 'A digital realm that overlaps with reality, accessible only to those with neural implants.',
    stats: [
      { label: 'Type', value: 'Virtual Reality' },
      { label: 'Risk Level', value: 'High' }
    ],
    sections: [
      {
        title: 'Access',
        content: 'Users "jack in" via cortex shunts. Time moves 10x faster inside the Verve.'
      }
    ],
    relatedIds: []
  },
  {
    id: 'chronomancy',
    title: 'Chronomancy',
    category: 'Magic & Tech',
    lastUpdated: '2023-08-15',
    summary: 'The forbidden art of manipulating time streams using Aether crystals.',
    stats: [
      { label: 'Legality', value: 'Illegal' },
      { label: 'Cost', value: 'Lifespan of user' }
    ],
    sections: [
      {
        title: 'Mechanics',
        content: 'Chronomancers do not reverse time; they create "echoes" of the past. Excessive use causes the user to fade from existence.'
      }
    ],
    relatedIds: []
  }
];

// --- Components ---

interface WikiPageProps {
  onBack: () => void;
}

export const WikiPage: React.FC<WikiPageProps> = ({ onBack }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state
  const activeArticle = useMemo<WikiArticle | undefined>(() => 
    WIKI_DATA.find(a => a.id === selectedArticleId), 
  [selectedArticleId]);

  const categories = useMemo<Record<string, WikiArticle[]>>(() => {
    const cats: Record<string, WikiArticle[]> = {};
    WIKI_DATA.forEach(article => {
      if (!cats[article.category]) cats[article.category] = [];
      cats[article.category].push(article);
    });
    return cats;
  }, []);

  const filteredCategories = useMemo<Record<string, WikiArticle[]>>(() => {
    if (!searchQuery) return categories;
    const filtered: Record<string, WikiArticle[]> = {};
    
    Object.entries(categories).forEach(([cat, articles]) => {
      const matching = (articles as WikiArticle[]).filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matching.length > 0) filtered[cat] = matching;
    });
    return filtered;
  }, [categories, searchQuery]);

  // Icons based on category
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Characters': return <Users size={16} />;
      case 'Locations': return <Map size={16} />;
      case 'Magic & Tech': return <Sparkles size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const handleArticleClick = (id: string) => {
    setSelectedArticleId(id);
    setSidebarOpen(false); // Close mobile menu on selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
      
      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-warm-700">
            <ArrowLeft size={20} />
          </button>
          <span className="font-serif font-bold text-lg text-warm-900">Archives</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-warm-100 rounded-lg text-warm-900"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) & Static (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-warm-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none'}
      `}>
        <div className="h-full flex flex-col">
          
          {/* Sidebar Header */}
          <div className="p-6 pb-2 border-b border-warm-100 bg-warm-50/50">
            <div className="flex items-center justify-between mb-6 md:mb-4">
               <button onClick={onBack} className="hidden md:flex items-center gap-2 text-sm font-medium text-warm-600 hover:text-warm-900 transition-colors">
                  <ArrowLeft size={16} />
                  Back to App
               </button>
               <button 
                 onClick={() => setSidebarOpen(false)}
                 className="md:hidden p-1 rounded-full hover:bg-warm-100"
               >
                 <X size={20} />
               </button>
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-warm-900 mb-1 flex items-center gap-2">
              <Globe className="text-primary-500" size={24} />
              Wiki & Lore
            </h2>
            <p className="text-xs text-warm-500 mb-4">Explore the universe of WarmReads</p>

            {/* Sidebar Search */}
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
              <input 
                type="text" 
                placeholder="Filter articles..."
                className="w-full bg-white border border-warm-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            <button 
              onClick={() => handleArticleClick('')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                !selectedArticleId ? 'bg-warm-100 text-warm-900' : 'text-warm-600 hover:bg-warm-50'
              }`}
            >
              <BookOpen size={16} />
              Wiki Home
            </button>

            {Object.entries(filteredCategories).map(([category, articles]) => (
              <div key={category}>
                <h3 className="px-3 text-xs font-bold text-warm-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                </h3>
                <div className="space-y-0.5">
                  {(articles as WikiArticle[]).map(article => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors border-l-2 ${
                        selectedArticleId === article.id 
                          ? 'bg-warm-50 border-primary-500 text-warm-900 font-medium' 
                          : 'border-transparent text-warm-600 hover:bg-warm-50 hover:text-warm-900'
                      }`}
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(filteredCategories).length === 0 && (
              <div className="text-center py-8 text-warm-400 text-sm">
                No articles found.
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 md:p-8 lg:p-12 overflow-x-hidden">
        
        {activeArticle ? (
          // --- Article View ---
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-warm-500 mb-6">
              <span className="cursor-pointer hover:underline" onClick={() => setSelectedArticleId(null)}>Wiki</span>
              <ChevronRight size={12} />
              <span>{activeArticle.category}</span>
              <ChevronRight size={12} />
              <span className="font-medium text-warm-900">{activeArticle.title}</span>
            </div>

            {/* Header */}
            <header className="mb-8 border-b border-warm-200 pb-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-start">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-warm-900 mb-4">{activeArticle.title}</h1>
                  <p className="text-lg text-warm-600 leading-relaxed italic border-l-4 border-primary-200 pl-4">
                    {activeArticle.summary}
                  </p>
                </div>
                {/* Desktop Infobox Image */}
                {activeArticle.image && (
                   <div className="hidden md:block w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-warm-900/10 ring-4 ring-white">
                     <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
                   </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-6 text-xs text-warm-400 font-mono">
                <div className="flex items-center gap-1.5 bg-warm-100 px-2 py-1 rounded">
                   <Clock size={12} />
                   Last Updated: {activeArticle.lastUpdated}
                </div>
                <div className="flex items-center gap-1.5">
                   <Shield size={12} />
                   Official Canon
                </div>
              </div>
            </header>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Main Text */}
              <div className="lg:col-span-2 space-y-8">
                {activeArticle.sections.map((section, idx) => (
                  <section key={idx}>
                    <h2 className="text-2xl font-serif font-bold text-warm-900 mb-3 flex items-center gap-2">
                      {section.title}
                    </h2>
                    <div className="prose prose-warm text-warm-800/80 leading-7 whitespace-pre-line">
                      {/* Simple Markdown Parser Simulation */}
                      {section.content.split('\n').map((line, i) => {
                         if (line.startsWith('- ')) {
                           return <li key={i} className="ml-4 list-disc marker:text-primary-500">{line.substring(2)}</li>
                         }
                         if (line.startsWith('**')) {
                            // simple bold check
                            const content = line.replace(/\*\*/g, '');
                            return <p key={i} className="font-bold">{content}</p>
                         }
                         return <p key={i} className="mb-2">{line}</p>
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* Right Data Panel (Infobox) */}
              <div className="space-y-6">
                
                {/* Mobile Image (shown here in column flow on mobile, hidden on desktop) */}
                {activeArticle.image && (
                  <div className="md:hidden w-full aspect-video rounded-2xl overflow-hidden shadow-lg shadow-warm-900/10 mb-6">
                    <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {activeArticle.stats && (
                  <div className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-warm-400 mb-4">Quick Data</h3>
                    <div className="space-y-3">
                      {(activeArticle.stats as { label: string; value: string }[]).map(stat => (
                        <div key={stat.label} className="flex justify-between items-center text-sm border-b border-warm-50 pb-2 last:border-0 last:pb-0">
                          <span className="text-warm-500">{stat.label}</span>
                          <span className="font-medium text-warm-900 text-right">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeArticle.relatedIds.length > 0 && (
                  <div className="bg-warm-100/50 p-5 rounded-2xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-warm-400 mb-3">See Also</h3>
                    <div className="flex flex-wrap gap-2">
                      {(activeArticle.relatedIds as string[]).map(id => {
                        const related = WIKI_DATA.find(r => r.id === id);
                        if (!related) return null;
                        return (
                          <button 
                            key={id}
                            onClick={() => handleArticleClick(id)}
                            className="text-xs bg-white border border-warm-200 px-3 py-1.5 rounded-full text-warm-700 hover:border-primary-300 hover:text-primary-700 transition-colors flex items-center gap-1"
                          >
                            <Tag size={10} />
                            {related.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        ) : (
          // --- Wiki Landing Page ---
          <div className="max-w-4xl mx-auto py-8 md:py-16">
            <div className="text-center mb-12 animate-in fade-in zoom-in-95 duration-700">
               <div className="inline-flex items-center justify-center p-3 bg-warm-100 rounded-2xl text-warm-800 mb-6">
                 <Globe size={48} strokeWidth={1.5} />
               </div>
               <h1 className="text-4xl md:text-6xl font-serif font-bold text-warm-900 mb-4 tracking-tight">The Archives</h1>
               <p className="text-xl text-warm-500 max-w-xl mx-auto">
                 Welcome to the official repository of lore, characters, and histories for the WarmReads universe.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               {/* Featured Article Card */}
               <div 
                 onClick={() => handleArticleClick('oakhaven')}
                 className="group cursor-pointer relative overflow-hidden rounded-[2rem] bg-warm-900 text-warm-50 h-64 p-8 flex flex-col justify-end transition-transform hover:scale-[1.02]"
               >
                 <div className="absolute inset-0 opacity-40">
                   <img src="https://picsum.photos/id/122/600/400" className="w-full h-full object-cover grayscale mix-blend-multiply" alt="Featured" />
                 </div>
                 <div className="relative z-10">
                   <span className="inline-block px-3 py-1 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">Featured Location</span>
                   <h3 className="text-3xl font-serif font-bold mb-2 group-hover:underline decoration-primary-500 underline-offset-4">Oakhaven</h3>
                   <p className="text-warm-200/80 line-clamp-2 text-sm">Explore the vertical city of steam and brass, where the rich live in clouds and the poor in pipes.</p>
                 </div>
               </div>

               {/* Random/Recent Card */}
               <div className="bg-white rounded-[2rem] p-8 border border-warm-200 shadow-sm flex flex-col">
                 <h3 className="text-lg font-bold text-warm-900 mb-6 flex items-center gap-2">
                   <Sparkles className="text-yellow-500" />
                   Recently Updated
                 </h3>
                 <div className="space-y-4 flex-1">
                   {WIKI_DATA.slice(0, 3).map(article => (
                     <div 
                       key={article.id} 
                       onClick={() => handleArticleClick(article.id)}
                       className="flex items-center gap-4 group cursor-pointer"
                     >
                       <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center text-warm-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                          {getCategoryIcon(article.category)}
                       </div>
                       <div>
                         <h4 className="font-medium text-warm-900 group-hover:text-primary-700 transition-colors">{article.title}</h4>
                         <span className="text-xs text-warm-400">{article.category} • {article.lastUpdated}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {['Characters', 'Locations', 'Magic & Tech', 'History'].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => {
                     // For demo purposes, find first article of this cat or just filter sidebar
                     setSearchQuery(cat);
                     if(window.innerWidth < 768) setSidebarOpen(true);
                   }}
                   className="p-4 bg-white border border-warm-100 rounded-2xl hover:border-warm-300 hover:shadow-md transition-all text-center group"
                 >
                   <div className="mb-2 text-warm-400 group-hover:text-primary-500 transition-colors flex justify-center">
                     {getCategoryIcon(cat)}
                   </div>
                   <div className="text-sm font-bold text-warm-800">{cat}</div>
                 </button>
               ))}
            </div>

          </div>
        )}
      </main>

    </div>
  );
};