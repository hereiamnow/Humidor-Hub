/**
 * @file fieldDefinitions.js
 * @path src/constants/fieldDefinitions.js
 * @author Shawn Miller
 * @date July 28, 2025
 * @time 10:30 AM
 * 
 * Field Definitions for Data Schema and Validation
 * 
 * Defines the structure, validation rules, and metadata for humidor and cigar data objects.
 * Used across the application for form generation, data import/export, validation,
 * and ensuring consistent data structure.
 */

/**
 * Field definition schema for humidor objects.
 * Defines all properties that can be stored for a humidor, including validation rules
 * and display metadata for forms and data operations.
 * 
 * Field Properties:
 * - key: Database/object property name
 * - label: Human-readable field name for UI display
 * - required: Whether field is mandatory for data integrity
 * - type: Data type for validation and input handling (defaults to 'string')
 * 
 * @type {Array<{key: string, label: string, required: boolean, type?: string}>}
 */
export const APP_HUMIDOR_FIELDS = [
    // Core identification fields
    { key: 'name', label: 'Humidor Name', required: true },

    // Descriptive content fields
    { key: 'shortDescription', label: 'Overview', required: false },
    { key: 'longDescription', label: 'Long Description', required: false },

    // Physical characteristics
    { key: 'size', label: 'Size', required: false },
    { key: 'location', label: 'Location', required: false },
    { key: 'type', label: 'Type', required: false },

    // Visual representation
    { key: 'image', label: 'Image URL', required: false },

    // Environmental monitoring
    { key: 'temp', label: 'Temperature', required: false, type: 'number' },
    { key: 'humidity', label: 'Humidity', required: false, type: 'number' },

    // Smart device integration (Govee sensors)
    { key: 'goveeDeviceId', label: 'Govee Device ID', required: false },
    { key: 'goveeDeviceModel', label: 'Govee Device Model', required: false },
];

/**
 * Field definition schema for cigar objects.
 * Comprehensive definition of all cigar properties including physical characteristics,
 * tobacco composition, ratings, inventory data, and metadata.
 * 
 * Special field types:
 * - 'boolean': True/false values for binary characteristics
 * - 'number': Numeric values for measurements, ratings, prices, quantities
 * - 'array': Semicolon-separated values that get parsed into arrays
 * - 'date': Date values for temporal tracking
 * 
 * @type {Array<{key: string, label: string, required: boolean, type?: string}>}
 */
export const APP_CIGAR_FIELDS = [
    // Core identification - required for basic cigar record
    { key: 'name', label: 'Cigar Name', required: true },
    { key: 'brand', label: 'Brand', required: true },
    { key: 'line', label: 'Product Line', required: false },

    // Physical characteristics and construction
    { key: 'shape', label: 'Shape', required: false },
    { key: 'isBoxPress', label: 'Is Box Pressed', required: false, type: 'boolean' },
    { key: 'isPuro', label: 'Is Puro', required: false, type: 'boolean' }, // Single-country tobacco

    // Dimensional specifications
    { key: 'length_inches', label: 'Length (in)', required: false, type: 'number' },
    { key: 'ring_gauge', label: 'Ring Gauge', required: false, type: 'number' }, // Diameter in 64ths of inch
    { key: 'size', label: 'Size (e.g., 5.5x50)', required: false }, // Combined length x ring gauge

    // Origin and tobacco composition
    { key: 'continent', label: 'Continent', required: false },  // Continent of origin
    { key: 'country', label: 'Country', required: false },      // Country of origin
    { key: 'wrapper', label: 'Wrapper', required: false },      // Outer tobacco leaf
    { key: 'binder', label: 'Binder', required: false },        // Holds filler together
    { key: 'filler', label: 'Filler', required: false },        // Interior tobacco blend

    // Smoking characteristics
    { key: 'strength', label: 'Strength', required: false },    // Mild, Medium, Full
    { key: 'flavorNotes', label: 'Flavor Notes (semicolon-separated)', required: false, type: 'array' },

    // Rating and evaluation
    { key: 'rating', label: 'Rating (Official)', required: false, type: 'number' },     // Professional ratings
    { key: 'userRating', label: 'My Rating', required: false, type: 'number' },         // Personal rating

    // Commercial and inventory data
    { key: 'price', label: 'Price', required: false, type: 'number' },
    { key: 'quantity', label: 'Quantity', required: true, type: 'number' }, // Required for inventory tracking

    // Visual and descriptive content
    { key: 'image', label: 'Image URL', required: false },
    { key: 'shortDescription', label: 'Overview', required: false },
    { key: 'description', label: 'Long Description', required: false },

    // Metadata and tracking
    { key: 'dateAdded', label: 'Date Added', required: false, type: 'date' }
];