/**
 * @file cigarOptions.js
 * @path src/constants/cigarOptions.js
 * @author Shawn Miller
 * @date July 28, 2025
 * @time 10:30 AM
 * 
 * Cigar Options and Reference Data
 * 
 * Comprehensive collection of standardized options, dimensions, and reference data
 * for cigar characteristics. Used throughout the application for form dropdowns,
 * validation, auto-completion, and ensuring data consistency.
 */

/**
 * Complete list of flavor notes commonly found in cigars.
 * Used for flavor profile tagging, search filters, and tasting note suggestions.
 * Alphabetically sorted for consistent UI presentation.
 * 
 * @type {string[]}
 */
export const allFlavorNotes = [
    'Earth', 'Earthy', 'Woody', 'Spice', 'Spicy', 'Nutty', 'Sweet', 'Fruity', 'Floral', 'Herbal',
    'Leather', 'Coffee', 'Cocoa', 'Chocolate', 'Creamy', 'Pepper', 'Cedar', 'Oak',
    'Cinnamon', 'Vanilla', 'Honey', 'Caramel', 'Citrus', 'Dried Fruit', 'Hay', 'Toasted',
    'Dark Cherry', 'Roasted Nuts', 'Toasted Bread'
].sort(); // Alphabetical sorting ensures consistent dropdown ordering

/**
 * Standard cigar strength classifications from mildest to strongest.
 * Ordered by intensity progression for logical UI presentation.
 * 
 * @type {string[]}
 */
export const strengthOptions = ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'];

/**
 * Comprehensive list of cigar shapes (vitolas) including both traditional and modern formats.
 * Includes both straight-sided (parejo) and shaped (figurado) cigars.
 * Alphabetically sorted for consistent dropdown presentation.
 * 
 * @type {string[]}
 */
export const cigarShapes = [
    'Parejo', 'Corona', 'Robusto', 'Toro', 'Churchill', 'Double Corona', 'Lonsdale',
    'Panetela', 'Lancero', 'Grand Corona', 'Presidente', 'Figurado', 'Belicoso',
    'Torpedo', 'Piramide', 'Perfecto', 'Diadema', 'Culebra', 'Double Robusto'
].sort(); // Alphabetical sorting for consistent UI ordering

/**
 * Standard ring gauge measurements (diameter in 64ths of an inch).
 * Covers the typical range from thin panetelas (30) to large gordos (58+).
 * Numerically sorted for logical progression in form inputs.
 * 
 * @type {number[]}
 */
export const cigarRingGauges = [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58].sort();

/**
 * Common cigar lengths in inches, covering the full spectrum from cigarillos to oversized cigars.
 * Includes quarter-inch increments for precision in popular size ranges.
 * Numerically sorted for logical progression in form inputs.
 * 
 * @type {number[]}
 */
export const cigarLengths = [3, 3.5, 4, 4.5, 5, 5.25, 5.5, 5.75, 6, 6.25, 6.5, 6.75, 7, 7.5, 8].sort();

/**
 * Wrapper leaf types and origins for cigar construction.
 * Includes both color classifications (Natural, Maduro) and regional origins.
 * The wrapper significantly influences flavor and appearance.
 * 
 * @type {string[]}
 */
export const cigarWrapperColors = [
    'Natural', 'Maduro', 'Connecticut', 'Habano', 'Sumatra', 'Candela', 'Oscuro',
    'Colorado', 'Criollo', 'Cameroon', 'San Andres', 'Mexican', 'Brazilian',
    'Pennsylvania', 'Nicaraguan', 'Dominican', 'Honduran'
].sort(); // Alphabetical sorting for consistent UI presentation

/**
 * Binder leaf types and origins for cigar construction.
 * The binder holds the filler tobacco together beneath the wrapper.
 * Uses same classification system as wrapper for consistency.
 * 
 * @type {string[]}
 */
export const cigarBinderTypes = [
    'Natural', 'Maduro', 'Connecticut', 'Habano', 'Sumatra', 'Candela', 'Oscuro',
    'Colorado', 'Criollo', 'Cameroon', 'San Andres', 'Mexican', 'Brazilian',
    'Pennsylvania', 'Nicaraguan', 'Dominican', 'Honduran'
].sort(); // Consistent with wrapper classifications

/**
 * Filler tobacco types and origins for cigar construction.
 * The filler blend forms the core of the cigar and provides primary flavor characteristics.
 * Often consists of multiple tobacco types blended together.
 * 
 * @type {string[]}
 */
export const cigarFillerTypes = [
    'Natural', 'Maduro', 'Connecticut', 'Habano', 'Sumatra', 'Candela', 'Oscuro',
    'Colorado', 'Criollo', 'Cameroon', 'San Andres', 'Mexican', 'Brazilian',
    'Pennsylvania', 'Nicaraguan', 'Dominican', 'Honduran'
].sort(); // Consistent classification system across tobacco components

/**
 * Countries known for cigar production and manufacturing.
 * Includes both traditional cigar-producing regions and emerging markets.
 * Note: Contains duplicate 'Nicaragua' entry that should be cleaned up.
 * 
 * @type {string[]}
 */
export const cigarCountryOfOrigin = [
    'Cuba', 'Dominican Republic', 'Nicaragua', 'Honduras', 'Mexico', 'Brazil',
    'Peru', 'United States', 'Colombia', 'Costa Rica', 'Panama', 'Jamaica',
    'Philippines', 'India', 'El Salvador', 'Ecuador', 'Guatemala', 'Nicaragua' // TODO: Remove duplicate Nicaragua
].sort();

/**
 * Standard dimensions for common cigar vitolas (shapes/sizes).
 * Used for auto-filling length and ring gauge fields when users select a vitola.
 * Provides consistent sizing standards based on traditional cigar classifications.
 * 
 * Object structure:
 * - Key: Vitola name (string)
 * - Value: { length_inches: number|null, ring_gauge: number|null }
 * - null values indicate highly variable dimensions that can't be standardized
 * 
 * @type {Object<string, {length_inches: number|null, ring_gauge: number|null}>}
 */
export const commonCigarDimensions = {
    // Classic parejo (straight-sided) vitolas
    'Corona': { length_inches: 5.5, ring_gauge: 42 },
    'Robusto': { length_inches: 5, ring_gauge: 50 },
    'Toro': { length_inches: 6, ring_gauge: 52 },
    'Churchill': { length_inches: 7, ring_gauge: 48 },
    'Double Corona': { length_inches: 7.5, ring_gauge: 49 },
    'Lonsdale': { length_inches: 6.5, ring_gauge: 42 },
    'Panetela': { length_inches: 6, ring_gauge: 38 },
    'Lancero': { length_inches: 7.5, ring_gauge: 38 },
    'Grand Corona': { length_inches: 5.6, ring_gauge: 46 },

    // Figurado (shaped) vitolas
    'Perfecto': { length_inches: 4.5, ring_gauge: 48 }, // Variable, this is typical
    'Piramide': { length_inches: 6.2, ring_gauge: 52 },
    'Torpedo': { length_inches: 6, ring_gauge: 52 },
    'Belicoso': { length_inches: 5, ring_gauge: 50 },
    'Diadema': { length_inches: 8.5, ring_gauge: 55 }, // Large tapered cigar
    'Salomon': { length_inches: 7.25, ring_gauge: 57 }, // Double figurado

    // Modern and specialty sizes
    'Double Robusto': { length_inches: 5.5, ring_gauge: 54 },
    'Presidente': { length_inches: 8, ring_gauge: 52 },
    'Petit Corona': { length_inches: 4.5, ring_gauge: 42 },
    'Petit Robusto': { length_inches: 4, ring_gauge: 50 },
    'Short Churchill': { length_inches: 4.875, ring_gauge: 48 },
    'Gigante': { length_inches: 6, ring_gauge: 60 }, // Extra thick
    'Gordo': { length_inches: 6, ring_gauge: 60 }, // Similar to Gigante
    'Magnum': { length_inches: 6.5, ring_gauge: 54 },
    'Presidente Grande': { length_inches: 9, ring_gauge: 52 }, // Oversized
    'Torpedito': { length_inches: 5, ring_gauge: 50 }, // Smaller torpedo
    'Mini Cigarillo': { length_inches: 3.5, ring_gauge: 20 }, // Very small format

    // General categories with variable dimensions
    'Figurado': { length_inches: null, ring_gauge: null }, // Too variable to standardize
    'Parejo': { length_inches: null, ring_gauge: null }, // General straight-sided category
    'Culebra': { length_inches: null, ring_gauge: null }, // Braided/twisted, irregular shape
};
