import React, { useState } from 'react';
import { Moon, Sun, Plus, Trash2, X, Palette, Check } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeContext';
import { createPortal } from 'react-dom';

export const ThemeSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { 
        isDarkMode, toggleDarkMode, 
        accentColors, addAccentColor, removeAccentColor 
    } = useTheme();

    const [newColor, setNewColor] = useState('#000000');

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-warm-950/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-white dark:bg-warm-900 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-warm-200 dark:ring-warm-800 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-warm-100 dark:border-warm-800">
                    <h2 className="text-xl font-serif font-bold text-warm-900 dark:text-warm-100 flex items-center gap-2">
                        <Palette className="text-primary-500" />
                        Appearance
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-warm-900 dark:text-warm-100">Dark Mode</h3>
                            <p className="text-xs text-warm-500 dark:text-warm-400">Adjust the interface for low light.</p>
                        </div>
                        <button 
                            onClick={toggleDarkMode}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-primary-500' : 'bg-warm-200 dark:bg-warm-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                                {isDarkMode ? <Moon size={12} className="text-primary-500" /> : <Sun size={12} className="text-warm-400" />}
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-warm-100 dark:bg-warm-800" />

                    {/* Accent Colors */}
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-warm-900 dark:text-warm-100">Accent Palette</h3>
                                <p className="text-xs text-warm-500 dark:text-warm-400">Elements will randomly use these colors.</p>
                            </div>
                        </div>

                        {/* Color Grid */}
                        <div className="grid grid-cols-5 gap-3">
                            {accentColors.map((color, idx) => (
                                <div key={color + idx} className="relative group aspect-square rounded-xl overflow-hidden ring-1 ring-warm-900/5 dark:ring-white/10 cursor-pointer shadow-sm">
                                    <div 
                                        className="w-full h-full" 
                                        style={{ backgroundColor: color }}
                                    />
                                    {/* First color indicator (Primary) */}
                                    {idx === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10" title="Primary Brand Color">
                                            <div className="bg-white/90 rounded-full p-0.5">
                                              <Check className="text-warm-900" size={12} strokeWidth={3} />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Delete Button (hover) */}
                                    {accentColors.length > 1 && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeAccentColor(color); }}
                                            className="absolute top-0 right-0 p-1 bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {/* Add Button */}
                            <label className="relative aspect-square rounded-xl border-2 border-dashed border-warm-300 dark:border-warm-700 hover:border-primary-500 dark:hover:border-primary-500 flex items-center justify-center cursor-pointer transition-colors text-warm-400 hover:text-primary-500 bg-warm-50 dark:bg-warm-800/50">
                                <Plus size={20} />
                                <input 
                                    type="color" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    value={newColor}
                                    onChange={(e) => {
                                        setNewColor(e.target.value);
                                    }}
                                    onBlur={() => addAccentColor(newColor)}
                                />
                            </label>
                        </div>
                        <p className="text-[10px] text-warm-400 italic">The first color is used as the primary brand color (buttons, headers).</p>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};