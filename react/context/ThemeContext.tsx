import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { generatePalette, getContrastText } from '../utils/colorUtils';

// Default accent colors list
const DEFAULT_ACCENTS = [
    '#ff7043', // Orange
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FFC107', // Amber
];

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    accentColors: string[];
    addAccentColor: (color: string) => void;
    removeAccentColor: (color: string) => void;
    // Helper to get a stable random color for a component
    useStableAccentColor: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- Dark Mode State ---
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('warmreads-theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // --- Accent Color State ---
    const [accentColors, setAccentColors] = useState<string[]>(() => {
        const saved = localStorage.getItem('warmreads-accents');
        return saved ? JSON.parse(saved) : DEFAULT_ACCENTS;
    });

    // Apply Dark Mode Class
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('warmreads-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('warmreads-theme', 'light');
        }
    }, [isDarkMode]);

    // Apply Global Primary Variable (Use the first color as the "Brand" primary for buttons/header)
    useEffect(() => {
        // We use the first color in the list as the "Global/Brand" primary
        // to ensure navigation/headers have a consistent feel, while other elements vary.
        const mainColor = accentColors[0] || DEFAULT_ACCENTS[0];
        const palette = generatePalette(mainColor);
        const contrastText = getContrastText(mainColor);
        
        const root = window.document.documentElement;
        
        root.style.setProperty('--color-primary-100', palette['100']);
        root.style.setProperty('--color-primary-200', palette['200']);
        root.style.setProperty('--color-primary-500', palette['500']);
        root.style.setProperty('--color-primary-600', palette['600']);
        root.style.setProperty('--color-primary-700', palette['700']);
        root.style.setProperty('--color-on-primary', contrastText);

    }, [accentColors]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const addAccentColor = (color: string) => {
        if (!/^#[0-9A-F]{6}$/i.test(color)) return;
        if (accentColors.includes(color)) return;
        
        const newColors = [...accentColors, color];
        setAccentColors(newColors);
        localStorage.setItem('warmreads-accents', JSON.stringify(newColors));
    };

    const removeAccentColor = (color: string) => {
        if (accentColors.length <= 1) return; 
        const newColors = accentColors.filter(c => c !== color);
        setAccentColors(newColors);
        localStorage.setItem('warmreads-accents', JSON.stringify(newColors));
    };

    // Custom Hook: Returns a random color from the list that stays constant across re-renders
    // unless the list itself changes significantly
    const useStableAccentColor = () => {
        return useMemo(() => {
            const randomIndex = Math.floor(Math.random() * accentColors.length);
            return accentColors[randomIndex];
        }, [accentColors]); // Only re-roll if the palette list changes
    };

    return (
        <ThemeContext.Provider value={{
            isDarkMode,
            toggleDarkMode,
            accentColors,
            addAccentColor,
            removeAccentColor,
            useStableAccentColor
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};