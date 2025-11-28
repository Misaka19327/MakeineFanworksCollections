import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, PenTool } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -right-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary-100/50 blur-[100px]" />
         <div className="absolute -left-[10%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-warm-200/50 blur-[80px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-warm-900/10 ring-1 ring-warm-100 transition-all duration-500 animate-in fade-in zoom-in-95">
        
        {/* Header Section */}
        <div className="bg-gradient-to-b from-warm-50/80 to-transparent p-8 pb-4 text-center">
           <button 
             onClick={onBack}
             className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-warm-900 shadow-sm transition-transform hover:scale-105 active:scale-95 border border-warm-100"
             aria-label="Go back"
           >
             <ArrowLeft size={20} />
           </button>
           
           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-900 text-white shadow-xl shadow-warm-900/20">
              <PenTool size={32} />
           </div>
           <h2 className="font-serif text-3xl font-bold text-warm-900">Welcome Back</h2>
           <p className="mt-2 text-sm text-warm-800/60 font-medium">Sign in to continue your journey</p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-4">
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email Input */}
            <div className="group relative">
               <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 transition-colors group-focus-within:text-primary-500">
                 <Mail size={20} />
               </div>
               <input 
                 type="email" 
                 placeholder="Email Address"
                 className="h-14 w-full rounded-2xl border-none bg-warm-50 pl-12 pr-4 text-warm-900 placeholder-warm-400/70 outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-warm-100/50"
                 required
               />
            </div>

            {/* Password Input */}
            <div className="group relative">
               <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 transition-colors group-focus-within:text-primary-500">
                 <Lock size={20} />
               </div>
               <input 
                 type={showPassword ? "text" : "password"} 
                 placeholder="Password"
                 className="h-14 w-full rounded-2xl border-none bg-warm-50 pl-12 pr-12 text-warm-900 placeholder-warm-400/70 outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-2 focus:ring-primary-500/20 hover:bg-warm-100/50"
                 required
               />
               <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-0 top-0 h-14 w-12 flex items-center justify-center text-warm-400 hover:text-warm-600 focus:outline-none"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button type="button" className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button className="mt-2 h-14 w-full rounded-full bg-warm-900 text-lg font-medium text-white shadow-lg shadow-warm-900/20 transition-all hover:bg-warm-800 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-200/60"></div>
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold uppercase tracking-wider text-warm-400">Or continue with</span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white font-medium text-warm-900 transition-all hover:bg-warm-50 hover:border-warm-300">
               <svg className="h-5 w-5" viewBox="0 0 24 24">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               Google
            </button>
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white font-medium text-warm-900 transition-all hover:bg-warm-50 hover:border-warm-300">
               <svg className="h-5 w-5 text-warm-900" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M13.601 2.326A4.499 4.499 0 0017.504 0a4.418 4.418 0 00-2.927 2.362 4.259 4.259 0 00-1.055 2.662 2.872 2.872 0 00.08-.024zM12.926 23.995c-1.332 0-2.28-.686-3.266-1.526-1.074-.913-2.126-1.808-3.665-1.808-1.914 0-3.614 1.109-4.755 1.109-.99 0-2.583-.918-3.664-2.553C-4.433 16.35 1.258 8.01 1.053 7.647c.224-.54 2.228-3.52 6.035-3.52 1.624 0 2.85.975 3.73 9.975.986 0 2.518-1.25 4.234-1.25 1.764 0 3.085.875 3.945 1.83-3.551 2.112-2.95 7.914.805 9.605-.662 1.645-1.614 3.264-2.85 4.957-1.144 1.558-2.394 3.078-4.026 3.056z"/>
               </svg>
               Apple
            </button>
          </div>
          
          <div className="mt-8 text-center text-sm text-warm-800/60">
            Don't have an account?{' '}
            <button className="font-semibold text-primary-700 hover:text-primary-800 transition-colors">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};