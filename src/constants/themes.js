/**
 * @file themes.js
 * @path src/constants/themes.js
 * @author Shawn Miller
 * @date July 3, 2025
 * @time 10:30 AM
 * 
 * UI Theme Definitions
 * 
 * The 'themes' object defines available UI themes for the app.
 * Each theme contains keys for background, card, text, primary color, border, input, and button styles.
 * Usage: Pass the selected theme object to components for consistent styling.
 */
export const themes = {
    "Humidor Hub": {
        name: "Humidor Hub",                    //Core Colors
        bg: "bg-gray-900",                      //Core Colors
        card: "bg-gray-800/50",                 //Core Colors
        text: "text-white",                     //Core Colors
        subtleText: "text-gray-400",            //Core Colors
        primary: "text-amber-400",              //Interactive Elements
        primaryBg: "bg-amber-500",              //Interactive Elements
        hoverPrimaryBg: "hover:bg-amber-600",   //Interactive Elements
        button: "bg-gray-700 hover:bg-gray-600",//Interactive Elements
        borderColor: "border-gray-700",         //Form Elements
        inputBg: "bg-gray-800",                 //Form Elements
        ring: "focus:ring-amber-500",           //Form Elements
        icon: "",
        drawerBg: "bg-amber-500/40",            // Specialized Components
        drawerBorderColor: "border-gray-700",   // Specialized Components
        roxyBg: "bg-amber-900/20",              // Roxy's Corner - Background color
        roxyBorder: "border-amber-800",         // Roxy's Corner - Border color
        roxyText: "text-amber-200",             // Roxy's Corner - Text color
        mapHighlightedCountry: "#fbbf24",       // Map Visualization - Selected country highlighting
        mapCigarCountry: "#fde68a",             // Map Visualization - Countries with cigar data
        mapOtherCountry: "#22223b",             // Map Visualization - Default country colors
        mapBorder: "#d1d5db",                   // Map Visualization - Country border lines
        mapHover: "#f59e0b",                    // Map Visualization - Hover state colors
    }



};
