import React from 'react';
import { PenTool, BarChart2, Book, Edit3, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-50 bg-warm-50/80 dark:bg-warm-950/80 backdrop-blur-md transition-all border-b border-transparent dark:border-warm-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onNavigate('home')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 shadow-lg shadow-warm-900/20 dark:shadow-none">
            <PenTool size={20} />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-warm-900 dark:text-warm-50">
            WarmReads
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
           <Button 
            variant="secondary"
            size="icon"
            onClick={onOpenSettings}
            title="Appearance"
            className="w-9 h-9"
            icon={<Settings size={18} />}
           />

           <div className="hidden md:flex gap-2">
             <Button 
              variant="primary"
              size="sm"
              onClick={() => onNavigate('contribute')}
              icon={<Edit3 size={16} />}
              className="bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 shadow-none hover:bg-primary-500 hover:text-white"
             >
                Review
             </Button>
           </div>
           
           <Button 
             variant="secondary"
             size="sm"
             onClick={() => onNavigate('wiki')}
             icon={<Book size={16} />}
             className="hidden sm:flex"
           >
             Wiki
           </Button>

           <Button 
             variant="secondary"
             size="sm"
             onClick={() => onNavigate('stats')}
             icon={<BarChart2 size={16} />}
             className="hidden sm:flex"
           >
             Stats
           </Button>

          <div className="h-6 w-px bg-warm-200 dark:bg-warm-800 mx-1" />
          
          <button 
            onClick={() => onNavigate('login')}
            className="text-sm font-medium text-warm-800 dark:text-warm-200 transition-colors hover:text-primary-700 dark:hover:text-primary-400 px-2"
          >
            Login
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="h-8 w-8 overflow-hidden rounded-full border border-warm-200 dark:border-warm-700 bg-white transition-transform hover:scale-105 active:scale-95"
          >
            <img src="https://ui-avatars.com/api/?name=Guest+User&background=ff7043&color=fff" alt="User" />
          </button>
        </div>
      </div>
    </header>
  );
};