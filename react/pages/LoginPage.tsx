import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, PenTool } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 dark:bg-warm-950 p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -right-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary-100/50 dark:bg-primary-900/20 blur-[100px]" />
         <div className="absolute -left-[10%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-warm-200/50 dark:bg-warm-900/30 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[2.5rem] bg-white dark:bg-warm-900 shadow-2xl shadow-warm-900/10 dark:shadow-black/40 ring-1 ring-warm-100 dark:ring-warm-800 transition-all duration-500 animate-in fade-in zoom-in-95">
        <div className="bg-gradient-to-b from-warm-50/80 to-transparent dark:from-warm-800/80 p-8 pb-4 text-center">
           <button 
             onClick={onBack}
             className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 shadow-sm transition-transform hover:scale-105 active:scale-95 border border-warm-100 dark:border-warm-700"
           >
             <ArrowLeft size={20} />
           </button>
           
           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-900 dark:bg-primary-600 text-white shadow-xl shadow-warm-900/20">
              <PenTool size={32} />
           </div>
           <h2 className="font-serif text-3xl font-bold text-warm-900 dark:text-warm-50">Welcome Back</h2>
           <p className="mt-2 text-sm text-warm-800/60 dark:text-warm-300 font-medium">Sign in to continue your journey</p>
        </div>

        <div className="p-8 pt-4">
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="group relative">
               <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 transition-colors group-focus-within:text-primary-500">
                 <Mail size={20} />
               </div>
               <input 
                 type="email" 
                 placeholder="Email Address"
                 className="h-14 w-full rounded-2xl border-none bg-warm-50 dark:bg-warm-800 pl-12 pr-4 text-warm-900 dark:text-warm-100 placeholder-warm-400/70 outline-none ring-1 ring-transparent transition-all focus:bg-white dark:focus:bg-warm-900 focus:ring-2 focus:ring-primary-500/20 hover:bg-warm-100/50 dark:hover:bg-warm-700/50"
               />
            </div>

            <div className="group relative">
               <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 transition-colors group-focus-within:text-primary-500">
                 <Lock size={20} />
               </div>
               <input 
                 type={showPassword ? "text" : "password"} 
                 placeholder="Password"
                 className="h-14 w-full rounded-2xl border-none bg-warm-50 dark:bg-warm-800 pl-12 pr-12 text-warm-900 dark:text-warm-100 placeholder-warm-400/70 outline-none ring-1 ring-transparent transition-all focus:bg-white dark:focus:bg-warm-900 focus:ring-2 focus:ring-primary-500/20 hover:bg-warm-100/50 dark:hover:bg-warm-700/50"
               />
               <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-0 top-0 h-14 w-12 flex items-center justify-center text-warm-400 hover:text-warm-600 focus:outline-none"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
            </div>

            <button className="mt-2 h-14 w-full rounded-full bg-warm-900 dark:bg-primary-600 text-lg font-medium text-white shadow-lg shadow-warm-900/20 dark:shadow-none transition-all hover:bg-warm-800 dark:hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};