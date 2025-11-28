/**
 * Adjusts a hex color by a specific amount to lighten or darken it.
 * @param hex The hex color string (e.g., "#ff0000" or "ff0000").
 * @param amount The amount to adjust (-100 to 100). Negative darkens, positive lightens.
 * @returns The adjusted hex color string.
 */
export const adjustColor = (hex: string, amount: number) => {
    let usePound = false;
    if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
    }
    const num = parseInt(hex, 16);
    
    let r = (num >> 16) + amount;
    if (r > 255) r = 255; else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) b = 255; else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amount;
    if (g > 255) g = 255; else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

/**
 * Generates a Tailwind-compatible palette object from a base color.
 * @param baseHex The base primary color.
 */
export const generatePalette = (baseHex: string) => {
    return {
        '100': adjustColor(baseHex, 140), // Very Light
        '200': adjustColor(baseHex, 100), // Light
        '500': baseHex,                   // Base
        '600': adjustColor(baseHex, -20), // Slightly Dark
        '700': adjustColor(baseHex, -40), // Dark
    };
};

/**
 * Calculates the best contrasting text color (white or dark warm brown)
 * based on the brightness of the background hex color.
 * Uses the YIQ formula.
 * @param hex The background hex color.
 * @returns Hex color string for the text ('#271512' or '#ffffff').
 */
export const getContrastText = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    
    // YIQ brightness formula
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Threshold of 128 is standard. 
    // If >= 128, background is light -> return dark text.
    // If < 128, background is dark -> return white text.
    return (yiq >= 128) ? '#271512' : '#ffffff';
};