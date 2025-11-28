import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, BookOpen, Map, Users, Sparkles, 
  ChevronRight, Calendar, Globe, Shield, Tag, Menu, X, Zap, Image as ImageIcon, ListOrdered, Table as TableIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- Types ---
type ArticleCategory = 'Characters' | 'Locations' | 'Magic & Tech' | 'History' | 'Factions';
type SectionType = 'text' | 'timeline' | 'attributes' | 'gallery' | 'quote' | 'ordered-list' | 'table';

interface WikiSection {
  type: SectionType;
  title?: string;
  content?: string; 
  data?: any; 
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
  stats?: { label: string; value: string }[];
}

// --- Data ---
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
        type: 'text',
        title: 'Biography',
        content: 'Born in the industrial district of Oakhaven, Eliza was orphaned at a young age and taken in by the Master Clockmaker. She quickly displayed an unusual talent: she did not need tools to diagnose a broken machine; she could simply listen to its rhythm.'
      },
      {
        type: 'quote',
        content: '"The gears didn\'t just turn; they sang. I knew the song of the brass heart better than my own heartbeat."'
      },
      {
        type: 'attributes',
        title: 'Capabilities',
        data: [
          { label: 'Mechanics', value: 95, color: '#FF7043' },
          { label: 'Perception', value: 80, color: '#4CAF50' },
          { label: 'Combat', value: 30, color: '#EF5350' },
          { label: 'Diplomacy', value: 50, color: '#42A5F5' }
        ]
      },
      {
        type: 'timeline',
        title: 'Key Events',
        data: [
          { year: '1895', event: 'Found on the steps of the Guildhall.' },
          { year: '1905', event: 'Repaired the Great Clock of Oakhaven.' },
          { year: '1919', event: 'Discovered the First Echo.' }
        ]
      }
    ],
    relatedIds: ['brass-heart', 'oakhaven']
  },
  {
    id: 'brass-guild',
    title: 'The Brass Guild',
    category: 'Factions',
    lastUpdated: '2023-12-05',
    summary: 'The governing body of Oakhaven’s industrial sector, regulating all clockwork technology and steam power.',
    image: 'https://ui-avatars.com/api/?name=Brass+Guild&background=ffb74d&color=3e2723&size=200',
    stats: [
      { label: 'Leader', value: 'High Artificer M.' },
      { label: 'HQ', value: 'The Grand Cog' },
      { label: 'Status', value: 'Active' }
    ],
    sections: [
      {
        type: 'text',
        title: 'Mission',
        content: 'The Guild ensures that technology serves the city, not the other way around. They strictly control the distribution of Aether cores.'
      },
      {
        type: 'ordered-list',
        title: 'Code of Conduct',
        data: [
          'Never leave a gear winding.',
          'Respect the machine spirit above all else.',
          'Unauthorized innovation is heresy.',
          'Maintain the rhythm of the city.',
          'Report all Echoes immediately.'
        ]
      },
      {
        type: 'table',
        title: 'Hierarchy & Wages',
        data: {
          headers: ['Rank', 'Title', 'Daily Wage (Coins)', 'Clearance Level'],
          rows: [
            ['1', 'Oiler', '5', 'Low'],
            ['2', 'Apprentice', '15', 'Low'],
            ['3', 'Journeyman', '40', 'Medium'],
            ['4', 'Artificer', '120', 'High'],
            ['5', 'Grandmaster', '500+', 'Absolute']
          ]
        }
      }
    ],
    relatedIds: ['oakhaven', 'eliza-vance']
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
        type: 'text',
        title: 'Overview',
        content: 'Oakhaven is a city built vertically. The wealthy live in the "Sun-Spires" above the smog layer, while the workers inhabit the "Undercity", a labyrinth of pipes and tunnels.'
      },
      {
        type: 'gallery',
        title: 'Cityscapes',
        data: [
          { url: 'https://picsum.photos/id/234/400/300', caption: 'The Sun Spires' },
          { url: 'https://picsum.photos/id/235/400/300', caption: 'Steam Tram' },
          { url: 'https://picsum.photos/id/236/400/300', caption: 'Undercity Markets' }
        ]
      },
      {
        type: 'text',
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
        type: 'text',
        title: 'Mythology',
        content: 'Legend says the Heart was forged by the First Architect. It is not just a power source, but a soul-vessel.'
      }
    ],
    relatedIds: ['eliza-vance']
  }
];

// --- Specialized View Components ---

const TimelineView: React.FC<{ data: { year: string; event: string }[] }> = ({ data }) => {
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

const AttributesView: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
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

const GalleryView: React.FC<{ data: { url: string; caption: string }[] }> = ({ data }) => {
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

const QuoteView: React.FC<{ content: string }> = ({ content }) => {
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

const OrderedListView: React.FC<{ items: string[] }> = ({ items }) => {
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

const TableView: React.FC<{ headers: string[], rows: string[][] }> = ({ headers, rows }) => {
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

const CategoryHeader: React.FC<{ category: string, children: React.ReactNode }> = ({ category, children }) => {
    const color = useTheme().useStableAccentColor();
    return (
        <h3 className="px-3 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 text-warm-500 dark:text-warm-400">
            <span style={{ color: color }}>{children}</span>
            {category}
        </h3>
    );
};

// --- Main Page Component ---
export const WikiPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeArticle = useMemo(() => WIKI_DATA.find(a => a.id === selectedArticleId), [selectedArticleId]);

  const categories = useMemo(() => {
    const cats: Record<string, WikiArticle[]> = {};
    WIKI_DATA.forEach(article => {
      if (!cats[article.category]) cats[article.category] = [];
      cats[article.category].push(article);
    });
    return cats;
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const filtered: Record<string, WikiArticle[]> = {};
    Object.entries(categories).forEach(([cat, articles]) => {
      const matching = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
      if (matching.length > 0) filtered[cat] = matching;
    });
    return filtered;
  }, [categories, searchQuery]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Characters': return <Users size={16} />;
      case 'Locations': return <Map size={16} />;
      case 'Magic & Tech': return <Sparkles size={16} />;
      case 'Factions': return <Shield size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const handleArticleClick = (id: string) => {
    setSelectedArticleId(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = (section: WikiSection, idx: number) => {
    switch (section.type) {
      case 'timeline':
        return (
          <section key={idx} className="mb-8">
            <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-warm-400" />
              {section.title}
            </h2>
            <TimelineView data={section.data} />
          </section>
        );
      case 'attributes':
        return (
          <section key={idx} className="mb-8">
            <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-warm-400" />
              {section.title}
            </h2>
            <AttributesView data={section.data} />
          </section>
        );
      case 'gallery':
         return (
          <section key={idx} className="mb-8">
            <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-warm-400" />
              {section.title}
            </h2>
            <GalleryView data={section.data} />
          </section>
        );
      case 'ordered-list':
        return (
          <section key={idx} className="mb-8">
             <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-4 flex items-center gap-2">
               <ListOrdered size={20} className="text-warm-400" />
               {section.title}
             </h2>
             <OrderedListView items={section.data} />
          </section>
        );
      case 'table':
        return (
          <section key={idx} className="mb-8">
             <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-4 flex items-center gap-2">
               <TableIcon size={20} className="text-warm-400" />
               {section.title}
             </h2>
             <TableView headers={section.data.headers} rows={section.data.rows} />
          </section>
        );
      case 'quote':
        return <QuoteView key={idx} content={section.content || ''} />;
      case 'text':
      default:
        return (
          <section key={idx} className="mb-8">
            {section.title && <h2 className="text-2xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-3">{section.title}</h2>}
            <div className="prose prose-warm dark:prose-invert text-warm-800/80 dark:text-warm-300/80 leading-7 whitespace-pre-line">
              {section.content?.split('\n').map((line, i) => {
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-primary-500">{line.substring(2)}</li>
                  if (line.startsWith('**')) return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>
                  return <p key={i} className="mb-2">{line}</p>
              })}
            </div>
          </section>
        );
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-950 flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
      
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-warm-900/90 backdrop-blur-md border-b border-warm-200 dark:border-warm-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-warm-700 dark:text-warm-300">
            <ArrowLeft size={20} />
          </button>
          <span className="font-serif font-bold text-lg text-warm-900 dark:text-warm-100">Archives</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-warm-100 dark:bg-warm-800 rounded-lg text-warm-900 dark:text-warm-100">
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-warm-900 border-r border-warm-200 dark:border-warm-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 pb-2 border-b border-warm-100 dark:border-warm-800 bg-warm-50/50 dark:bg-warm-900">
            <div className="flex items-center justify-between mb-6 md:mb-4">
               <button onClick={onBack} className="hidden md:flex items-center gap-2 text-sm font-medium text-warm-600 dark:text-warm-400 hover:text-warm-900 dark:hover:text-warm-200 transition-colors">
                  <ArrowLeft size={16} />
                  Back to App
               </button>
               <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-full hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-500 dark:text-warm-400">
                 <X size={20} />
               </button>
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-warm-900 dark:text-warm-100 mb-1 flex items-center gap-2">
              <Globe className="text-primary-500" size={24} />
              Wiki & Lore
            </h2>
            <p className="text-xs text-warm-500 dark:text-warm-400 mb-4">Explore the universe of WarmReads</p>

            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
              <input 
                type="text" 
                placeholder="Filter articles..."
                className="w-full bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all text-warm-900 dark:text-warm-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            <button 
              onClick={() => handleArticleClick('')} 
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                !selectedArticleId ? 'bg-warm-100 dark:bg-warm-800 text-warm-900 dark:text-warm-100' : 'text-warm-600 dark:text-warm-400 hover:bg-warm-50 dark:hover:bg-warm-800'
              }`}
            >
              <BookOpen size={16} />
              Wiki Home
            </button>

            {Object.entries(filteredCategories).map(([category, articles]) => (
              <div key={category}>
                <CategoryHeader category={category}>
                    {getCategoryIcon(category)}
                </CategoryHeader>
                
                <div className="space-y-0.5">
                  {articles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors border-l-2 ${
                        selectedArticleId === article.id 
                          ? 'bg-warm-50 dark:bg-warm-800/50 border-primary-500 text-warm-900 dark:text-warm-100 font-medium' 
                          : 'border-transparent text-warm-600 dark:text-warm-400 hover:bg-warm-50 dark:hover:bg-warm-800 hover:text-warm-900 dark:hover:text-warm-200'
                      }`}
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 lg:p-12 overflow-x-hidden">
        {activeArticle ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-warm-500 dark:text-warm-400 mb-6">
              <span className="cursor-pointer hover:underline" onClick={() => setSelectedArticleId(null)}>Wiki</span>
              <ChevronRight size={12} />
              <span>{activeArticle.category}</span>
              <ChevronRight size={12} />
              <span className="font-medium text-warm-900 dark:text-warm-100">{activeArticle.title}</span>
            </div>
            
            {/* Header */}
            <header className="mb-8 border-b border-warm-200 dark:border-warm-800 pb-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-start">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-warm-900 dark:text-warm-50 mb-4">{activeArticle.title}</h1>
                  <p className="text-lg text-warm-600 dark:text-warm-300 leading-relaxed italic border-l-4 border-primary-200 dark:border-primary-800 pl-4">{activeArticle.summary}</p>
                </div>
                {activeArticle.image && (
                   <div className="hidden md:block w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-warm-900/10 ring-4 ring-white dark:ring-warm-800">
                     <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
                   </div>
                )}
              </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {activeArticle.sections.map((section, idx) => renderSection(section, idx))}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                 {activeArticle.image && (
                  <div className="md:hidden w-full aspect-video rounded-2xl overflow-hidden shadow-lg shadow-warm-900/10 mb-6">
                    <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {activeArticle.stats && (
                  <div className="bg-white dark:bg-warm-800 p-5 rounded-2xl border border-warm-200 dark:border-warm-700 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-warm-400 mb-4">Quick Data</h3>
                    <div className="space-y-3">
                      {activeArticle.stats.map(stat => (
                        <div key={stat.label} className="flex justify-between items-center text-sm border-b border-warm-50 dark:border-warm-700 pb-2 last:border-0 last:pb-0">
                          <span className="text-warm-500 dark:text-warm-400">{stat.label}</span>
                          <span className="font-medium text-warm-900 dark:text-warm-100 text-right">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-8 md:py-16">
            <div className="text-center mb-12 animate-in fade-in zoom-in-95 duration-700">
               <h1 className="text-4xl md:text-6xl font-serif font-bold text-warm-900 dark:text-warm-50 mb-4 tracking-tight">The Archives</h1>
               <p className="text-xl text-warm-500 dark:text-warm-400 max-w-xl mx-auto">Welcome to the official repository of lore.</p>
            </div>
             {/* Landing Page Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div onClick={() => handleArticleClick('oakhaven')} className="group cursor-pointer relative overflow-hidden rounded-[2rem] bg-warm-900 text-warm-50 h-64 p-8 flex flex-col justify-end transition-transform hover:scale-[1.02]">
                 <div className="absolute inset-0 opacity-40"><img src="https://picsum.photos/id/122/600/400" className="w-full h-full object-cover grayscale mix-blend-multiply" alt="Featured" /></div>
                 <div className="relative z-10">
                   <span className="inline-block px-3 py-1 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 text-on-primary">Featured Location</span>
                   <h3 className="text-3xl font-serif font-bold mb-2 group-hover:underline decoration-primary-500 underline-offset-4">Oakhaven</h3>
                   <p className="text-warm-200/80 line-clamp-2 text-sm">Explore the vertical city of steam and brass.</p>
                 </div>
               </div>
               <div className="bg-white dark:bg-warm-800 rounded-[2rem] p-8 border border-warm-200 dark:border-warm-700 shadow-sm flex flex-col">
                 <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100 mb-6 flex items-center gap-2"><Sparkles className="text-yellow-500" />Recently Updated</h3>
                 <div className="space-y-4 flex-1">
                   {WIKI_DATA.slice(0, 3).map(article => (
                     <div key={article.id} onClick={() => handleArticleClick(article.id)} className="flex items-center gap-4 group cursor-pointer">
                       <div className="w-12 h-12 rounded-xl bg-warm-100 dark:bg-warm-700 flex items-center justify-center text-warm-500 dark:text-warm-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 transition-colors">{getCategoryIcon(article.category)}</div>
                       <div><h4 className="font-medium text-warm-900 dark:text-warm-100 group-hover:text-primary-700 transition-colors">{article.title}</h4><span className="text-xs text-warm-400">{article.category}</span></div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};