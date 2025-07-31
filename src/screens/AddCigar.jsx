// File: AddCigar.jsx
// Path: src/screens/AddCigar.jsx
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: January 27, 2025
// Time: 2:45 PM CST

/**
 * @fileoverview AddCigar - Advanced cigar addition form with AI-powered auto-fill capabilities
 * 
 * @component AddCigar
 * @description A comprehensive React component that provides an advanced form interface for users to add new cigars to their humidor collection.
 * Features AI-powered auto-fill capabilities using Gemini API, smart image modal integration, flavor notes management,
 * and extensive form validation with Firebase Firestore persistence. Includes intelligent field suggestions and real-time updates.
 * 
 * @key-features
 * - AI-powered auto-fill using Gemini API with structured response schema for accurate cigar data population
 * - SmartImageModal integration for custom cigar images with positioning controls
 * - Comprehensive form with all cigar attributes including dimensions, wrapper details, and flavor profiles
 * - AutoCompleteInputField components with intelligent suggestions for shapes, wrappers, binders, fillers, and countries
 * - Dynamic field updates with visual feedback (flashing animations) when shape selection auto-populates dimensions
 * - FlavorNotesModal integration for advanced flavor profile management with visual tags
 * - QuantityControl component for intuitive quantity selection
 * - Firebase Firestore integration for seamless data persistence
 * - Responsive design optimized for mobile devices with touch-friendly controls
 * - Theme-aware styling throughout the interface with accessibility considerations
 * - Real-time validation and error handling for all input fields
 * - Navigation integration with proper back button and cancel functionality
 * - Intelligent puro detection based on tobacco origin analysis
 * - Star rating system for user ratings with half-star precision
 * 
 * @ai-integration
 * - Gemini API integration with structured prompts for accurate cigar data retrieval
 * - Intelligent field population that respects existing user input
 * - Visual feedback system showing which fields were auto-populated
 * - Error handling and fallback for API failures
 * - Structured JSON response schema for consistent data formatting
 * 
 * @form-intelligence
 * - Shape selection automatically populates length and ring gauge from common dimensions database
 * - Strength field with autocomplete suggestions and dropdown selection
 * - Price formatting with automatic decimal precision
 * - Date handling with proper ISO string conversion for database storage
 * - Puro detection algorithm analyzing wrapper, binder, and filler origins
 * - Real-time tobacco origin mapping and country extraction
 * 
 * @dependencies
 * - React (useState, useRef, useEffect)
 * - Firebase Firestore (collection, addDoc)
 * - Lucide React Icons
 * - Custom UI Components (InputField, TextAreaField, AutoCompleteInputField, QuantityControl, StarRating)
 * - Modal Components (SmartImageModal, GeminiModal, FlavorNotesModal)
 * - Utility Functions (getFlavorTagColor)
 * - Services (callGeminiAPI)
 * - Constants (strengthOptions, commonCigarDimensions, cigar data arrays)
 * 
 * @param {Object} props - Component props
 * @param {Function} props.navigate - Navigation function for routing between screens
 * @param {Object} props.db - Firebase Firestore database instance
 * @param {string} props.appId - Application identifier for Firestore document path
 * @param {string} props.userId - Current user's unique identifier
 * @param {string} props.humidorId - Target humidor ID where cigar will be added
 * @param {Object} props.theme - Theme object containing styling classes and colors
 * 
 * @returns {JSX.Element} Rendered AddCigar form component
 * 
 * @example
 * <AddCigar 
 *   navigate={navigate}
 *   db={db}
 *   appId="myApp"
 *   userId="user123"
 *   humidorId="humidor456"
 *   theme={darkTheme}
 * />
 * 
 * @author Shawn Miller
 * @since 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ChevronLeft, LoaderCircle, Sparkles, Tag, Edit, Award } from 'lucide-react';
import { strengthOptions, commonCigarDimensions, cigarLengths, cigarRingGauges, cigarWrapperColors, cigarBinderTypes, cigarFillerTypes, cigarCountryOfOrigin } from '../constants/cigarOptions';
import InputField from '../components/UI/InputField';
import TextAreaField from '../components/UI/TextAreaField';
import AutoCompleteInputField from '../components/UI/AutoCompleteInputField';
import QuantityControl from '../components/UI/QuantityControl';
import SmartImageModal from '../components/Modals/Composite/SmartImageModal';
import GeminiModal from '../components/Modals/Content/GeminiModal';
import FlavorNotesModal from '../components/Modals/Forms/FlavorNotesModal';
import { getFlavorTagColor } from '../utils/colorUtils';
import { callGeminiAPI } from '../services/geminiService';
import StarRating from '../components/UI/StarRating';

// Comprehensive tobacco country mapping for puro detection
const TOBACCO_COUNTRY_MAPPINGS = {
    // Adjectives to countries
    'nicaraguan': 'nicaragua',
    'dominican': 'dominican republic',
    'cuban': 'cuba',
    'honduran': 'honduras',
    'ecuadorian': 'ecuador',
    'mexican': 'mexico',
    'brazilian': 'brazil',
    'cameroon': 'cameroon',
    'connecticut': 'usa',
    'pennsylvania': 'usa',
    'kentucky': 'usa',
    'peruvian': 'peru',
    'colombian': 'colombia',
    'costa rican': 'costa rica',
    'san andres': 'mexico',
    'san andrés': 'mexico',
    'habano': 'ecuador',    // Most Habano wrappers are Ecuadorian
    'corojo': 'honduras',   // Traditional Corojo origin
    'criollo': 'nicaragua', // Common Criollo origin
    'maduro': null,         // Maduro is a process, not origin-specific
    'natural': null,        // Natural is a process, not origin-specific
    'claro': null,          // Claro is a color, not origin-specific
    'oscuro': null,         // Oscuro is a color, not origin-specific

    // Direct country names
    'nicaragua': 'nicaragua',
    'dominican republic': 'dominican republic',
    'cuba': 'cuba',
    'honduras': 'honduras',
    'ecuador': 'ecuador',
    'mexico': 'mexico',
    'brazil': 'brazil',
    'usa': 'usa',
    'peru': 'peru',
    'colombia': 'colombia',
    'costa rica': 'costa rica'
};

// Function to extract country from tobacco description
const extractCountryFromTobacco = (tobacco) => {
    console.log('extractCountryFromTobacco called with:', tobacco);
    if (!tobacco || typeof tobacco !== 'string') {
        console.log('extractCountryFromTobacco: Invalid tobacco input, returning null');
        return null;
    }

    const normalized = tobacco.toLowerCase().trim();
    console.log('extractCountryFromTobacco: Normalized tobacco:', normalized);

    // Check for direct matches first
    for (const [key, country] of Object.entries(TOBACCO_COUNTRY_MAPPINGS)) {
        if (country && normalized.includes(key)) {
            console.log(`extractCountryFromTobacco: Found match - key: ${key}, country: ${country}`);
            return country;
        }
    }

    console.log('extractCountryFromTobacco: No match found, returning null');
    return null;
};

// Function to detect if cigar is a puro
const detectPuro = (wrapper, binder, filler) => {
    console.log('detectPuro called with:', { wrapper, binder, filler });
    const wrapperCountry = extractCountryFromTobacco(wrapper);
    const binderCountry = extractCountryFromTobacco(binder);
    const fillerCountry = extractCountryFromTobacco(filler);

    console.log('detectPuro: Extracted countries:', { wrapperCountry, binderCountry, fillerCountry });

    // All three must have identifiable countries and be the same
    if (wrapperCountry && binderCountry && fillerCountry) {
        if (wrapperCountry === binderCountry && binderCountry === fillerCountry) {
            console.log('detectPuro: PURO DETECTED!', wrapperCountry);
            return { isPuro: true, country: wrapperCountry };
        }
    }

    console.log('detectPuro: Not a puro - mixed origins or missing data');
    return { isPuro: false, country: null };
};

const AddCigar = ({ navigate, db, appId, userId, humidorId, theme }) => {
    console.log('AddCigar component initialized with props:', { appId, userId, humidorId, theme: theme?.name || 'unknown' });

    // Initialize formData with new fields length_inches, ring_gauge, and isPuro
    const [formData, setFormData] = useState({ brand: '', name: '', shape: '', size: '', wrapper: '', binder: '', filler: '', country: '', strength: '', price: '', rating: '', quantity: 1, image: '', shortDescription: '', description: '', flavorNotes: [], dateAdded: new Date().toISOString().split('T')[0], length_inches: '', ring_gauge: '', isPuro: false });
    console.log('Initial formData state:', formData);
    const [setStrengthSuggestions] = useState([]);
    const [isAutofilling, setIsAutofilling] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, content: '', isLoading: false });
    const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);

    // Refs for flashing effect
    const lengthInputRef = useRef(null);
    const gaugeInputRef = useRef(null);
    const sizeInputRef = useRef(null);
    const [isLengthFlashing, setIsLengthFlashing] = useState(false);
    const [isGaugeFlashing, setIsGaugeFlashing] = useState(false);
    const [isSizeFlashing, setIsSizeFlashing] = useState(false);
    const [puroDetected, setPuroDetected] = useState(null);
    const [showPuroNotification, setShowPuroNotification] = useState(false);

    // Effect to detect puro status when tobacco fields change
    useEffect(() => {
        console.log('useEffect triggered - tobacco fields changed:', {
            wrapper: formData.wrapper,
            binder: formData.binder,
            filler: formData.filler
        });

        const detection = detectPuro(formData.wrapper, formData.binder, formData.filler);
        console.log('useEffect: Detection result:', detection);
        console.log('useEffect: Current isPuro state:', formData.isPuro);

        if (detection.isPuro !== formData.isPuro) {
            console.log('useEffect: Puro status changed, updating formData');
            setFormData(prev => ({ ...prev, isPuro: detection.isPuro }));
            setPuroDetected(detection.country);

            // Show notification when puro is detected
            if (detection.isPuro && !formData.isPuro) {
                console.log('useEffect: Showing puro notification');
                setShowPuroNotification(true);
                setTimeout(() => setShowPuroNotification(false), 4000);
            }
        } else {
            console.log('useEffect: No change in puro status');
        }
    }, [formData.wrapper, formData.binder, formData.filler, formData.isPuro]);
    // ^^^ Added formData.isPuro to dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('handleInputChange called:', { name, value });
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            console.log('handleInputChange: Updated formData:', updated);
            return updated;
        });

        if (name === 'strength') {
            console.log('handleInputChange: Processing strength field');
            setStrengthSuggestions(value ? strengthOptions.filter(opt => opt.toLowerCase().includes(value.toLowerCase())) : []);
        } else if (name === 'shape') {
            console.log('handleInputChange: Processing shape field, value:', value);
            // Auto-update length_inches, ring_gauge, and size based on selected shape
            const dimensions = commonCigarDimensions[value];
            console.log('handleInputChange: Found dimensions for shape:', dimensions);
            if (dimensions) {
                const updatedData = {
                    length_inches: dimensions.length_inches || '',
                    ring_gauge: dimensions.ring_gauge || ''
                };
                console.log('handleInputChange: Prepared dimension updates:', updatedData);

                // Only update size if it's empty or null
                if (!formData.size || formData.size.trim() === '') {
                    updatedData.size = `${dimensions.length_inches}x${dimensions.ring_gauge}`;
                    console.log('handleInputChange: Also updating size field to:', updatedData.size);
                }

                setFormData(prev => ({
                    ...prev,
                    ...updatedData
                }));

                // Trigger flashing effect for updated fields
                if (dimensions.length_inches) {
                    console.log('handleInputChange: Triggering length flash effect');
                    setIsLengthFlashing(true);
                    setTimeout(() => setIsLengthFlashing(false), 500);
                }
                if (dimensions.ring_gauge) {
                    console.log('handleInputChange: Triggering gauge flash effect');
                    setIsGaugeFlashing(true);
                    setTimeout(() => setIsGaugeFlashing(false), 500);
                }
                // Flash size field if it was updated
                if (!formData.size || formData.size.trim() === '') {
                    console.log('handleInputChange: Triggering size flash effect');
                    setIsSizeFlashing(true);
                    setTimeout(() => setIsSizeFlashing(false), 500);
                }
            }
        }
    };

    const handleSuggestionClick = (value) => {
        console.log('handleSuggestionClick called with value:', value);
        setFormData({ ...formData, strength: value });
        setStrengthSuggestions([]);
    };

    const handleQuantityChange = (newQuantity) => {
        console.log('handleQuantityChange called with newQuantity:', newQuantity);
        if (newQuantity >= 0) {
            setFormData(prev => {
                const updated = { ...prev, quantity: newQuantity };
                console.log('handleQuantityChange: Updated formData quantity:', updated.quantity);
                return updated;
            });
        } else {
            console.log('handleQuantityChange: Invalid quantity (negative), ignoring');
        }
    };

    // Validate user rating to allowed values: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
    const validateUserRating = (value) => {
        if (value <= 0) return 0;
        if (value >= 5) return 5;
        // Round to nearest 0.5
        return Math.round(value * 2) / 2;
    };

    const handleSave = async () => {
        console.log('handleSave called - preparing to save cigar');
        console.log('handleSave: Current formData:', formData);

        const newCigar = {
            ...formData,
            humidorId: humidorId,
            dateAdded: new Date(formData.dateAdded).toISOString(),
            flavorNotes: Array.isArray(formData.flavorNotes) ? formData.flavorNotes : [],
            rating: Number(formData.rating) || 0,
            price: Number(formData.price) || 0,
            quantity: Number(formData.quantity) || 1,
            length_inches: Number(formData.length_inches) || 0, // Ensure number type
            ring_gauge: Number(formData.ring_gauge) || 0,     // Ensure number type
            userRating: validateUserRating(Number(formData.userRating) || 0), // Validate user rating
        };

        console.log('handleSave: Prepared newCigar object:', newCigar);
        console.log('handleSave: Database path:', `artifacts/${appId}/users/${userId}/cigars`);

        try {
            const cigarsCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'cigars');
            const docRef = await addDoc(cigarsCollectionRef, newCigar);
            console.log('handleSave: Successfully saved cigar with ID:', docRef.id);
            navigate('MyHumidor', { humidorId: humidorId });
        } catch (error) {
            console.error('handleSave: Error saving cigar:', error);
        }
    };

    const handleAutofill = async () => {
        console.log('handleAutofill called');
        console.log('handleAutofill: Current cigar name:', formData.name);

        if (!formData.name) {
            console.log('handleAutofill: No cigar name provided, showing error modal');
            setModalState({ isOpen: true, content: "Please enter a cigar name to auto-fill.", isLoading: false });
            return;
        }

        console.log('handleAutofill: Starting auto-fill process');
        setIsAutofilling(true);

        const prompt = `You are a cigar database. Based on the cigar name "${formData.name}", provide its details as a JSON object. The schema MUST be: { "brand": "string", "shape": "string", "size": "string", "country": "string", "wrapper": "string", "binder": "string", "filler": "string", "strength": "Mild" | "Mild-Medium" | "Medium" | "Medium-Full" | "Full", "flavorNotes": ["string", "string", "string", "string"], "shortDescription": "string", "description": "string", "image": "string", "rating": "number", "price": "number", "length_inches": "number", "ring_gauge": "number" }. If you cannot determine a value, use an empty string "" or an empty array [] or 0 for numbers. Do not include any text or markdown formatting outside of the JSON object.`;
        console.log('handleAutofill: Prepared prompt:', prompt);

        const responseSchema = {
            type: "OBJECT",
            properties: {
                brand: { type: "STRING" },
                shape: { type: "STRING" },
                size: { type: "STRING" },
                country: { type: "STRING" },
                wrapper: { type: "STRING" },
                binder: { type: "STRING" },
                filler: { type: "STRING" },
                strength: { type: "STRING", enum: ["Mild", "Mild-Medium", "Medium", "Medium-Full", "Full"] },
                flavorNotes: { type: "ARRAY", items: { type: "STRING" } },
                shortDescription: { type: "STRING" },
                description: { type: "STRING" },
                image: { type: "STRING" },
                rating: { type: "NUMBER" },
                price: { type: "NUMBER" },
                length_inches: { type: "NUMBER" },
                ring_gauge: { type: "NUMBER" }
            },
            required: ["brand", "shape", "size", "country", "wrapper", "binder", "filler", "strength", "flavorNotes", "shortDescription", "description", "image", "rating", "price", "length_inches", "ring_gauge"]
        };
        console.log('handleAutofill: Prepared response schema:', responseSchema);

        try {
            console.log('handleAutofill: Calling Gemini API...');
            // Call the Gemini API with the prompt and response schema
            const result = await callGeminiAPI(prompt, responseSchema);
            console.log("handleAutofill: Gemini API result for", formData.name, ":", result);

            if (typeof result === 'object' && result !== null) {
                console.log('handleAutofill: Valid result received, processing updates');
                const updatedFields = [];
                const currentFormData = { ...formData }; // Get a snapshot of the current state
                console.log('handleAutofill: Current form data snapshot:', currentFormData);

                // Determine which fields will be updated
                for (const key in result) {
                    const hasExistingValue = currentFormData[key] && (!Array.isArray(currentFormData[key]) || currentFormData[key].length > 0);
                    const hasNewValue = result[key] && (!Array.isArray(result[key]) || result[key].length > 0);

                    console.log(`handleAutofill: Checking field ${key}:`, {
                        currentValue: currentFormData[key],
                        newValue: result[key],
                        hasExistingValue,
                        hasNewValue,
                        willUpdate: !hasExistingValue && hasNewValue
                    });

                    if (!hasExistingValue && hasNewValue) {
                        updatedFields.push(key);
                    }
                }

                console.log('handleAutofill: Fields to be updated:', updatedFields);

                if (updatedFields.length > 0) {
                    console.log('handleAutofill: Applying updates to form data');
                    // Apply the updates to the form state
                    setFormData(prevData => {
                        const updatedData = { ...prevData };
                        updatedFields.forEach(key => {
                            console.log(`handleAutofill: Updating ${key} from "${updatedData[key]}" to "${result[key]}"`);
                            updatedData[key] = result[key];
                        });
                        console.log('handleAutofill: Final updated form data:', updatedData);
                        return updatedData;
                    });

                    // Create a user-friendly list of changes for the modal
                    const changesList = updatedFields
                        .map(field => `- ${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`)
                        .join('\n');
                    const modalContent = `Woof! Roxy found some details for you and updated the following:\n\n${changesList}`;
                    console.log('handleAutofill: Showing success modal with content:', modalContent);
                    setModalState({ isOpen: true, content: modalContent, isLoading: false });
                    setTimeout(() => setModalState({ isOpen: false, content: '', isLoading: false }), 8000); // Show for 8 seconds
                } else {
                    console.log('handleAutofill: No fields to update, showing already filled message');
                    // If no fields were updated, show a different message
                    setModalState({ isOpen: true, content: "Ruff! Roxy looked, but all your details seem to be filled in already. Good job!", isLoading: false });
                    setTimeout(() => setModalState({ isOpen: false, content: '', isLoading: false }), 5000); // Disappear after 5 seconds
                }
            } else {
                console.error("handleAutofill: Gemini API response was not a valid object:", result);
                setModalState({ isOpen: true, content: `Ruff! Roxy couldn't fetch details. Try a different name or fill manually. Error: ${result}`, isLoading: false });
                setTimeout(() => setModalState({ isOpen: false, content: '', isLoading: false }), 5000); // Disappear after 5 seconds
            }
        } catch (error) {
            console.error('handleAutofill: Error during API call:', error);
            setModalState({ isOpen: true, content: `Ruff! Roxy encountered an error. Error: ${error.message}`, isLoading: false });
            setTimeout(() => setModalState({ isOpen: false, content: '', isLoading: false }), 5000);
        }

        console.log('handleAutofill: Process completed, setting isAutofilling to false');
        setIsAutofilling(false);
    };

    const closeModal = () => setModalState({ isOpen: false, content: '', isLoading: false });

    // Function to update flavor notes from modal
    const handleFlavorNotesUpdate = (newNotes) => {
        setFormData(prev => ({ ...prev, flavorNotes: newNotes }));
    };

    return (
        <div className="pb-24">
            {modalState.isOpen && <GeminiModal title="Auto-fill Status" content={modalState.content} isLoading={modalState.isLoading} onClose={closeModal} />}
            {isFlavorModalOpen && <FlavorNotesModal cigar={{ flavorNotes: formData.flavorNotes }} db={db} appId={appId} userId={userId} onClose={() => setIsFlavorModalOpen(false)} setSelectedNotes={handleFlavorNotesUpdate} />}

            <div id="pnlSmartImageModal" className="relative">



                <div className="flex justify-center items-center pt-6 pb-2">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-700 shadow-lg bg-gray-800">
                        <SmartImageModal
                            itemName={formData.name}
                            theme={theme}
                            currentImage={formData.image || `https://placehold.co/400x600/5a3825/ffffff?font=playfair-display&text=${formData.name.replace(/\s/g, '+') || 'Cigar+Image'}`}
                            currentPosition={formData.imagePosition || { x: 50, y: 50 }}
                            onImageAccept={(img, pos) => setFormData(prev => ({
                                ...prev,
                                image: img,
                                imagePosition: pos
                            }))}
                        />
                    </div>
                </div>



                {/* <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div> */}
                <div className="absolute top-4 left-4">
                    <button onClick={() => navigate('MyHumidor', { humidorId })} className="p-2 -ml-2 mr-2 bg-black/50 rounded-full">
                        <ChevronLeft className={`w-7 h-7 ${theme.text}`} />
                    </button>
                </div>
                <div className="absolute bottom-0 p-4">
                    <h2 className={`text-3xl font-bold ${theme.text}`}>Add Cigar</h2>
                </div>
            </div>

            {/* Cigar Name and Details */}
            <div id="pnlCigarNameAndDetails" className="p-4 space-y-4">

                <div id="pnlGeminiAutoFill" className={`${theme.roxyBg} p-4 rounded-md space-y-4`}>
                    {/* Name / Line */}
                    <InputField name="name" label="Name / Line" placeholder="e.g., 1964 Anniversary" value={formData.name} onChange={handleInputChange} theme={theme} />
                    {/* Auto-fill Button */}
                    <button onClick={handleAutofill} disabled={isAutofilling} className="w-full flex items-center justify-center gap-2 bg-purple-600/20 border border-purple-500 text-purple-300 font-bold py-2 rounded-lg hover:bg-purple-600/30 transition-colors disabled:opacity-50">
                        {isAutofilling ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {isAutofilling ? 'Thinking...' : '✨ Auto-fill Details'}
                    </button>
                </div>

                {/* Brand */}
                <InputField name="brand" label="Brand" placeholder="e.g., Padrón" value={formData.brand} onChange={handleInputChange} theme={theme} />

                {/* Overview / Short Description */}
                <InputField name="shortDescription" label="Overview" placeholder="Brief overview of the cigar..." value={formData.shortDescription} onChange={handleInputChange} theme={theme} />

                {/* Description */}
                <TextAreaField name="description" label="Description" placeholder="Notes on this cigar..." value={formData.description} onChange={handleInputChange} theme={theme} />



                <div id="pnlShapeAndSize" className="grid grid-cols-2 gap-3">
                    <AutoCompleteInputField
                        name="shape"
                        label="Shape"
                        placeholder="e.g., Toro"
                        value={formData.shape}
                        onChange={handleInputChange}
                        suggestions={Object.keys(commonCigarDimensions)}
                        theme={theme}
                    />
                    <InputField
                        name="size"
                        label="Size"
                        placeholder="e.g., 5.5x50"
                        value={formData.size}
                        onChange={handleInputChange}
                        theme={theme}
                        className={isSizeFlashing ? 'ring-2 ring-amber-400 animate-pulse' : ''}
                        inputRef={sizeInputRef}
                    />
                </div>
                {/* Length and Ring Gauge */}
                <div id="pnlLengthAndRing" className="grid grid-cols-2 gap-3">
                    <AutoCompleteInputField
                        name="length_inches"
                        label="Length (inches)"
                        placeholder="e.g., 6"
                        type="number"
                        value={formData.length_inches}
                        onChange={handleInputChange}
                        theme={theme}
                        className={isLengthFlashing ? 'ring-2 ring-amber-400 animate-pulse' : ''}
                        inputRef={lengthInputRef}
                        suggestions={cigarLengths}
                    />
                    <AutoCompleteInputField
                        name="ring_gauge"
                        label="Ring Gauge"
                        placeholder="e.g., 52"
                        type="number"
                        value={formData.ring_gauge}
                        onChange={handleInputChange}
                        theme={theme}
                        className={isGaugeFlashing ? 'ring-2 ring-amber-400 animate-pulse' : ''}
                        inputRef={gaugeInputRef}
                        suggestions={cigarRingGauges}
                    />
                </div>

                {/* Wrapper and Binder */}
                <div id="pnlWrapperAndBinder" className="grid grid-cols-2 gap-3">
                    <AutoCompleteInputField
                        name="wrapper"
                        label="Wrapper"
                        placeholder="e.g., Maduro"
                        value={formData.wrapper}
                        onChange={handleInputChange}
                        suggestions={cigarWrapperColors}
                        theme={theme}
                    />
                    <AutoCompleteInputField
                        name="binder"
                        label="Binder"
                        placeholder="e.g., Nicaraguan"
                        value={formData.binder}
                        onChange={handleInputChange}
                        suggestions={cigarBinderTypes}
                        theme={theme}
                    />
                </div>

                {/* Filler and Country */}
                <div id="pnlFillerAndCountry" className="grid grid-cols-2 gap-3">
                    <AutoCompleteInputField
                        name="filler"
                        label="Filler"
                        placeholder="e.g., Dominican"
                        value={formData.filler}
                        onChange={handleInputChange}
                        suggestions={cigarFillerTypes}
                        theme={theme}
                    />
                    <AutoCompleteInputField
                        name="country"
                        label="Country"
                        placeholder="e.g., Cuba"
                        value={formData.country}
                        onChange={handleInputChange}
                        suggestions={cigarCountryOfOrigin}
                        theme={theme}
                    />
                </div>

                {/* Puro Detection Section */}
                {(formData.wrapper && formData.binder && formData.filler) && (
                    <div className={`p-3 rounded-lg border ${formData.isPuro
                        ? 'bg-green-900/20 border-green-800'
                        : `${theme.roxyBg} ${theme.roxyBorder}`
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isPuro"
                                    checked={formData.isPuro || false}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPuro: e.target.checked }))}
                                    className="w-4 h-4 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="isPuro" className={`text-sm font-medium flex items-center space-x-2 ${formData.isPuro ? 'text-green-300' : 'text-amber-300'
                                    }`}>
                                    <Award className="w-4 h-4" />
                                    <span>This is a Puro</span>
                                </label>
                            </div>
                            {formData.isPuro && puroDetected && (
                                <span className="text-xs bg-green-600/20 text-green-300 px-2 py-1 rounded capitalize">
                                    {puroDetected} Puro
                                </span>
                            )}
                        </div>
                        {formData.isPuro && puroDetected && (
                            <p className="text-xs text-green-400 mt-2">
                                All tobacco components from {puroDetected.charAt(0).toUpperCase() + puroDetected.slice(1)}
                            </p>
                        )}
                        {!formData.isPuro && (formData.wrapper || formData.binder || formData.filler) && (
                            <p className="text-xs text-amber-400 mt-2">
                                Mixed origin tobacco blend
                            </p>
                        )}
                    </div>
                )}

                {/* Puro Detection Notification */}
                {showPuroNotification && (
                    <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 animate-pulse">
                        <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-green-400" />
                            <span className="text-green-300 font-medium">Puro Detected!</span>
                        </div>
                        <p className="text-xs text-green-400 mt-1">
                            All tobacco from {puroDetected} - automatically marked as puro
                        </p>
                    </div>
                )}

                {/* Profile and Price */}
                <div id="pnlProfileAndPrice" className="grid grid-cols-2 gap-3">
                    <AutoCompleteInputField
                        name="strength"
                        label="Profile"
                        placeholder="e.g., Full"
                        value={formData.strength}
                        onChange={handleInputChange}
                        suggestions={strengthOptions}
                        theme={theme}
                    />
                    {/* TODO: Add to Gimini lookup as MSRP price */}
                    <InputField name="price" label="Price" placeholder="e.g., 23.50" type="number" value={formData.price} onChange={handleInputChange} theme={theme} />
                </div>

                {/* Rating and Date Added */}
                <div id="pnlRatingAndDate" className="grid grid-cols-2 gap-3">
                    <InputField name="rating" label="Rating" placeholder="e.g., 94" type="number" value={formData.rating} onChange={handleInputChange} theme={theme} />
                    <InputField name="dateAdded" Tooltip="Date Added to Humidor" label="Date Added" type="date" value={formData.dateAdded} onChange={handleInputChange} theme={theme} />
                </div>

                {/* User Rating */}
                {/* <div id="pnlUserRating" className="grid grid-cols-2 gap-3">
                    <InputField
                        name="userRating"
                        label="User Rating"
                        placeholder="e.g., 90"
                        type="number"
                        value={formData.userRating}
                        onChange={handleInputChange}
                        theme={theme}
                    />
                </div> */}

                {/* New User Rating section: */}
                <div id="pnlUserRating" className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">My Rating</label>
                    <StarRating
                        rating={formData.userRating || 0}
                        onRatingChange={(rating) => setFormData(prev => ({ ...prev, userRating: rating }))}
                    />
                </div>

                {/* Flavor Notes */}
                <div id="pnlFlavorNotes" className="bg-gray-800/50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-amber-300 text-lg flex items-center"><Tag className="w-5 h-5 mr-3 text-amber-400" /> Flavor Notes</h3>
                        <button type="button" onClick={() => setIsFlavorModalOpen(true)} className="text-gray-400 hover:text-amber-400 p-1"><Edit className="w-4 h-4" /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.flavorNotes.length > 0 ? (
                            formData.flavorNotes.map(note => (<span key={note} className={`text-xs font-semibold px-3 py-1 rounded-full ${getFlavorTagColor(note)}`}>{note}</span>))
                        ) : (
                            <p className="text-sm text-gray-500">No notes selected. Click the edit icon to add some!</p>
                        )}
                    </div>
                </div>
                {/* QuantityControl Component */}
                <div id="pnlQuantity" className="flex flex-col items-center py-4">
                    <label className={`text-sm font-medium ${theme.subtleText} mb-2`}>Quantity</label>
                    <QuantityControl quantity={formData.quantity} onChange={handleQuantityChange} theme={theme} />
                </div>
            </div>
            {/* Save/Cancel Buttons */}
            <div id="pnlSaveCancelButtons" className="pt-4 flex space-x-4">
                <button
                    onClick={() => navigate('MyHumidor', { humidorId })}
                    className={`w-full ${theme.button} ${theme.text} font-bold py-3 rounded-lg transition-colors`}>
                    Cancel</button>
                <button
                    onClick={handleSave}
                    className={`w-full ${theme.primaryBg} ${theme.text === 'text-white' ? 'text-white' : 'text-black'} font-bold py-3 rounded-lg ${theme.hoverPrimaryBg} transition-colors`}>
                    Save Cigar</button>
            </div>
        </div>
    );
};

export default AddCigar;