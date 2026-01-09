import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ThemeProvider } from '@/app/providers/ThemeContext';
import { ContributePage } from '@/pages/ContributePage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { StatsPage } from '@/pages/StatsPage';
import { WikiPage } from '@/pages/WikiPage';
import { PageTransition } from '@/shared/ui/PageTransition';
import { Header } from '@/widgets/layout/Header';
import { ThemeSettings } from '@/widgets/layout/ThemeSettings';

type View = 'home' | 'login' | 'stats' | 'wiki' | 'contribute';

const AppContent: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentView: View =
    location.pathname === '/' ? 'home'
      : location.pathname.startsWith('/login') ? 'login'
        : location.pathname.startsWith('/stats') ? 'stats'
          : location.pathname.startsWith('/wiki') ? 'wiki'
            : 'contribute';

  const isHome = currentView === 'home';

  return (
    <>
      <PageTransition key={currentView}>
        {isHome ? (
          <div className="min-h-screen bg-warm-50 dark:bg-warm-950 transition-colors duration-300 pb-20 pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
            <Header
              currentView={currentView}
              onNavigate={(view: View) => {
                const map: Record<View, string> = {
                  home: '/',
                  login: '/login',
                  stats: '/stats',
                  wiki: '/wiki',
                  contribute: '/contribute',
                };
                navigate(map[view]);
              }}
              onOpenSettings={() => setShowSettings(true)}
            />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage onBack={() => navigate('/')} />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/wiki" element={<WikiPage />} />
              <Route path="/contribute" element={<ContributePage onBack={() => navigate('/')} />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onBack={() => navigate('/')} />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/wiki" element={<WikiPage />} />
            <Route path="/contribute" element={<ContributePage onBack={() => navigate('/')} />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        )}
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