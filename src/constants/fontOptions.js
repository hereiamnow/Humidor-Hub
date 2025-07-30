/**
 * @file fontOptions.js
 * @path src/constants/fontOptions.js
 * @author Shawn Miller
 * @created 2025-07-28T10:30:00Z
 * 
 * Font Pairing Options for Theme Customization
 * 
 * Curated collection of professional font combinations for the application's typography system.
 * Each pairing combines a serif heading font with a complementary sans-serif body font
 * to create visual hierarchy and optimal readability across different content types.
 * 
 * Used by the theme system to allow users to customize the application's typography
 * while maintaining design consistency and readability standards.
 *
 * Available font pairing combinations for theme customization.
 * Each option provides a complete typography system with heading and body font specifications.
 * 
 * Font Selection Criteria:
 * - Heading fonts: Serif typefaces for elegance and authority
 * - Body fonts: Sans-serif typefaces for readability and modern appeal
 * - All fonts are web-safe with Google Fonts availability
 * - Pairings tested for contrast and visual harmony
 * 
 * Object Structure:
 * - label: Human-readable name for UI display
 * - heading: CSS font-family value for headings (h1, h2, h3, etc.)
 * - body: CSS font-family value for body text and UI elements
 * 
 * @type {Array<{label: string, heading: string, body: string}>}
 */
export const fontOptions = [
    {
        label: "Playfair Display + Inter",
        heading: "'Playfair Display', serif", // Elegant, high-contrast serif for luxury feel
        body: "'Inter', sans-serif" // Modern, highly readable sans-serif
    },
    {
        label: "Merriweather + Lato",
        heading: "'Merriweather', serif", // Traditional, readable serif designed for screens
        body: "'Lato', sans-serif" // Friendly, approachable sans-serif
    },
    {
        label: "Cormorant Garamond + Roboto",
        heading: "'Cormorant Garamond', serif", // Classic, refined serif with character
        body: "'Roboto', sans-serif" // Clean, neutral sans-serif with excellent legibility
    },
    {
        label: "Cinzel + Open Sans",
        heading: "'Cinzel', serif", // Inspired by Roman inscriptions, formal and distinguished
        body: "'Open Sans', sans-serif" // Optimized for print, web, and mobile interfaces
    },
    {
        label: "EB Garamond + Montserrat",
        heading: "'EB Garamond', serif", // Revival of classic Garamond, scholarly and timeless
        body: "'Montserrat', sans-serif" // Geometric sans-serif inspired by urban typography
    }
];
