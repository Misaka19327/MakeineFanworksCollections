import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { StatsPage } from './pages/StatsPage';
import { WikiPage } from './pages/WikiPage';
import { ContributePage } from './pages/ContributePage';
import { PageTransition } from './components/ui/PageTransition';
import { PenTool, BarChart2, Book, Edit3, Settings } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeSettings } from './components/ThemeSettings';

type View = 'home' | 'login' | 'stats' | 'wiki' | 'contribute';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showSettings, setShowSettings] = useState(false);

  let content;
  if (currentView === 'login') {
    content = <LoginPage onBack={() => setCurrentView('home')} />;
  } else if (currentView === 'stats') {
    content = <StatsPage onBack={() => setCurrentView('home')} />;
  } else if (currentView === 'wiki') {
    content = <WikiPage onBack={() => setCurrentView('home')} />;
  } else if (currentView === 'contribute') {
    content = <ContributePage onBack={() => setCurrentView('home')} />;
  } else {
    content = <HomePage />;
  }

  const isHome = currentView === 'home';

  return (
    <>
      <PageTransition key={currentView}>
         
         {isHome && (
          <div className="min-h-screen bg-warm-50 dark:bg-warm-950 transition-colors duration-300 pb-20 pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
            
            {/* Header */}
            <header className="sticky top-0 z-50 bg-warm-50/80 dark:bg-warm-950/80 backdrop-blur-md transition-all border-b border-transparent dark:border-warm-800">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setCurrentView('home')}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 shadow-lg shadow-warm-900/20 dark:shadow-none">
                    <PenTool size={20} />
                  </div>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-warm-900 dark:text-warm-50">
                    WarmReads
                  </h1>
                </div>
                
                <div className="flex items-center gap-3">
                   {/* Theme Settings Trigger */}
                   <button 
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-warm-100 dark:bg-warm-800 text-warm-800 dark:text-warm-200 transition-colors hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400"
                    title="Appearance"
                   >
                     <Settings size={18} />
                   </button>

                   <button 
                    onClick={() => setCurrentView('contribute')}
                    className="hidden md:flex items-center gap-2 rounded-xl bg-primary-100 dark:bg-primary-900/30 px-3 py-2 text-sm font-medium text-primary-900 dark:text-primary-100 transition-colors hover:bg-primary-500 hover:text-white"
                  >
                    <Edit3 size={16} />
                    <span className="hidden lg:inline">Review</span>
                  </button>
                   <button 
                    onClick={() => setCurrentView('wiki')}
                    className="flex items-center gap-2 rounded-xl bg-warm-100 dark:bg-warm-800 px-3 py-2 text-sm font-medium text-warm-800 dark:text-warm-200 transition-colors hover:bg-warm-200 dark:hover:bg-warm-700"
                  >
                    <Book size={16} />
                    <span className="hidden sm:inline">Wiki</span>
                  </button>
                  <button 
                    onClick={() => setCurrentView('stats')}
                    className="flex items-center gap-2 rounded-xl bg-warm-100 dark:bg-warm-800 px-3 py-2 text-sm font-medium text-warm-800 dark:text-warm-200 transition-colors hover:bg-warm-200 dark:hover:bg-warm-700"
                  >
                    <BarChart2 size={16} />
                    <span className="hidden sm:inline">Stats</span>
                  </button>
                  <div className="h-6 w-px bg-warm-200 dark:bg-warm-800" />
                  <button 
                    onClick={() => setCurrentView('login')}
                    className="text-sm font-medium text-warm-800 dark:text-warm-200 transition-colors hover:text-primary-700 dark:hover:text-primary-400"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setCurrentView('login')}
                    className="h-8 w-8 overflow-hidden rounded-full border border-warm-200 dark:border-warm-700 bg-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <img src="https://ui-avatars.com/api/?name=Guest+User&background=ff7043&color=fff" alt="User" />
                  </button>
                </div>
              </div>
            </header>
            
            {content}
          </div>
         )}
         
         {!isHome && content}
      </PageTransition>

      {showSettings && <ThemeSettings onClose={() => setShowSettings(false)} />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;