// File: MyHumidor.jsx
// Path: src/screens/MyHumidor.jsx
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 27, 2025
// Time: 2:45 PM CST

/**
 * MyHumidor Screen Component
 * 
 * Displays individual humidor details with comprehensive cigar management capabilities.
 * This component serves as the main interface for viewing and managing cigars within
 * a specific humidor, featuring environmental monitoring, search/filter functionality,
 * bulk operations, and AI-powered data enhancement through Roxy's Corner.
 * 
 * Key Features:
 * - Environmental data display (temperature, humidity, estimated value)
 * - Advanced search and filtering with real-time suggestions
 * - Multiple view modes (grid/list) with responsive design
 * - Bulk operations (move, delete) with select mode
 * - AI-powered auto-fill for missing cigar details via Roxy's Corner
 * - Comprehensive sorting options (name, brand, rating, quantity, price, date)
 * - Export functionality for data management
 * - Real-time cigar statistics and collection insights
 * 
 * Dependencies:
 * - Firebase Firestore for data persistence
 * - Gemini AI API for auto-fill functionality
 * - Lucide React for consistent iconography
 * - Custom UI components for modular design
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.humidor - Humidor object with details and settings
 * @param {Function} props.navigate - Navigation function for screen transitions
 * @param {Array} props.cigars - Array of all cigars in the collection
 * @param {Array} props.humidors - Array of all humidors for move operations
 * @param {Object} props.db - Firebase Firestore database instance
 * @param {string} props.appId - Application identifier for Firestore paths
 * @param {string} props.userId - Current user's unique identifier
 * @param {Object} props.theme - Theme configuration object for styling
 * @param {Function} props.setCigars - Function to update the cigars state
 * @param {Function} props.setHumidors - Function to update the humidors state
 */

// React and core imports
import React, { useState, useEffect, useMemo } from 'react';

// Firebase imports
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';

// Icon imports from Lucide React
import {
    Wind, ChevronLeft, ChevronDown, Plus, Search, Filter, LayoutGrid, List,
    Thermometer, Droplets, Move, Trash2,
    CheckSquare, ArrowUp, ArrowDown, X
} from 'lucide-react';

// Firebase imports
import { doc, updateDoc, writeBatch } from 'firebase/firestore';

// Service imports
import { callGeminiAPI } from '../../../services/geminiService.js';

// Utils
import { hasValidGeminiKey } from '../../../utils/geminiKeyUtils';

// Constants imports
import { strengthOptions } from '../../../constants/cigarOptions';

// UI Component imports
import FilterSortModal from '../../UI/FilterSortModal';
import GridCigarCard from '../../Cigar/GridCigarCard';
import ListCigarCard from '../../Cigar/ListCigarCard.jsx';

// Menu Component imports
import HumidorActionMenu from '../../Menus/HumidorActionMenu';

// Modal Component imports
import ManualReadingModal from '../../Modals/Forms/ManualReadingModal';
import MoveCigarsModal from '../../Modals/Actions/MoveCigarsModal';
import DeleteHumidorModal from '../../Modals/Actions/DeleteHumidorModal';
import DeleteCigarsModal from '../../Modals/Actions/DeleteCigarsModal';
import ExportModal from '../../Modals/Data/ExportModal';
import HumidorStatsCards from "../../UI/HumidorStatsCards";
const MyHumidor = ({ humidor, navigate, cigars, humidors, db, appId, userId, theme, setCigars, setHumidors }) => {
    // Debug: Log component props on render
    console.log('MyHumidor: Component rendered with props:', {
        humidorId: humidor?.id,
        humidorName: humidor?.name,
        cigarsCount: cigars?.length || 0,
        humidorsCount: humidors?.length || 0,
        userId,
        appId
    });

    console.log('MyHumidor: Full humidor object:', humidor);
    console.log('MyHumidor: All cigars:', cigars);
    console.log('MyHumidor: All humidors:', humidors);

    // === STATE MANAGEMENT ===

    // Search and UI state
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    // List View is default, but check localStorage on mount
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("humidorViewMode") || "list";
        }
        return "list";
    });

    // Selection and bulk operations state
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedCigarIds, setSelectedCigarIds] = useState([]);

    // Modal visibility state
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isDeleteHumidorModalOpen, setIsDeleteHumidorModalOpen] = useState(false);
    const [isDeleteCigarsModalOpen, setIsDeleteCigarsModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isManualReadingModalOpen, setIsManualReadingModalOpen] = useState(false);
    const [isFilterSortModalOpen, setIsFilterSortModalOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // Filtering and sorting state
    const [filters, setFilters] = useState({
        brand: '',
        country: '',
        strength: '',
        flavorNotes: []
    });
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // === ROXY'S CORNER AUTO-FILL LOGIC ===

    // Firebase auth state
    const [user, authLoading] = useAuthState(auth);

    // Auto-fill banner state
    const [showAutofillBanner, setShowAutofillBanner] = useState(true);
    const [isRoxyPanelCollapsed, setIsRoxyPanelCollapsed] = useState(false);
    const [isAutofilling, setIsAutofilling] = useState(false);
    const [autofillStatus, setAutofillStatus] = useState(""); // User feedback message

    // State for tracking if user has valid Gemini API key
    const [hasGeminiKey, setHasGeminiKey] = useState(false);
    const [keyCheckLoading, setKeyCheckLoading] = useState(true);

    // Fields that can be auto-filled by AI (excludes physical measurements)
    const FIELDS_TO_AUTOFILL = useMemo(() => [
        "shortDescription", "description", "wrapper", "binder",
        "filler", "rating", "flavorNotes", "price"
    ], []);

    console.log('MyHumidor: State initialized, auto-fill fields:', FIELDS_TO_AUTOFILL);
    console.log('MyHumidor: Auth state - user:', user?.uid, 'loading:', authLoading);

    // === EFFECTS ===

    // Effect to check for valid Gemini API key when user auth state changes
    useEffect(() => {
        const checkGeminiKey = async () => {
            if (authLoading) {
                console.log('MyHumidor: Auth still loading, waiting...');
                return;
            }

            if (!user) {
                console.log('MyHumidor: No authenticated user, no API key check needed');
                setHasGeminiKey(false);
                setKeyCheckLoading(false);
                return;
            }

            console.log('MyHumidor: Checking for Gemini API key for user:', user.uid);
            setKeyCheckLoading(true);

            try {
                const hasKey = await hasValidGeminiKey(user.uid);
                console.log('MyHumidor: Gemini API key check result:', hasKey);
                setHasGeminiKey(hasKey);
            } catch (error) {
                console.error('MyHumidor: Error checking Gemini API key:', error);
                setHasGeminiKey(false);
            } finally {
                setKeyCheckLoading(false);
            }
        };

        checkGeminiKey();
    }, [user, authLoading]);

    // Save viewMode to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("humidorViewMode", viewMode);
        }
    }, [viewMode]);

    // === MEMOIZED CALCULATIONS ===

    /**
     * Filters and sorts cigars based on current search query, filters, and sort settings
     * This is memoized to prevent unnecessary recalculations on every render
     */
    const filteredAndSortedCigars = useMemo(() => {
        console.log('MyHumidor: Recalculating filtered and sorted cigars');

        // Start with cigars from this humidor only
        let currentCigars = cigars.filter(c => c.humidorId === humidor.id);
        console.log('MyHumidor: Initial cigars in humidor:', currentCigars.length);

        // Apply search query filter
        if (searchQuery) {
            const beforeSearch = currentCigars.length;
            currentCigars = currentCigars.filter(cigar =>
                cigar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cigar.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log('MyHumidor: After search filter:', currentCigars.length, 'from', beforeSearch);
        }

        // Apply brand filter
        if (filters.brand) {
            const beforeBrand = currentCigars.length;
            currentCigars = currentCigars.filter(cigar => cigar.brand === filters.brand);
            console.log('MyHumidor: After brand filter:', currentCigars.length, 'from', beforeBrand);
        }

        // Apply country filter
        if (filters.country) {
            const beforeCountry = currentCigars.length;
            currentCigars = currentCigars.filter(cigar => cigar.country === filters.country);
            console.log('MyHumidor: After country filter:', currentCigars.length, 'from', beforeCountry);
        }

        // Apply strength filter
        if (filters.strength) {
            const beforeStrength = currentCigars.length;
            currentCigars = currentCigars.filter(cigar => cigar.strength === filters.strength);
            console.log('MyHumidor: After strength filter:', currentCigars.length, 'from', beforeStrength);
        }

        // Apply flavor notes filter
        if (filters.flavorNotes.length > 0) {
            const beforeFlavor = currentCigars.length;
            currentCigars = currentCigars.filter(cigar =>
                filters.flavorNotes.every(note => cigar.flavorNotes.includes(note))
            );
            console.log('MyHumidor: After flavor notes filter:', currentCigars.length, 'from', beforeFlavor);
        }

        // Apply sorting
        currentCigars.sort((a, b) => {
            let valA, valB;
            switch (sortBy) {
                case 'name': valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); break;
                case 'brand': valA = a.brand.toLowerCase(); valB = b.brand.toLowerCase(); break;
                case 'rating': valA = a.rating || 0; valB = b.rating || 0; break;
                case 'quantity': valA = a.quantity; valB = b.quantity; break;
                case 'price': valA = a.price || 0; valB = b.price || 0; break;
                case 'dateAdded': valA = a.dateAdded; valB = b.dateAdded; break;
                default: return 0;
            }
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        console.log('MyHumidor: Final filtered and sorted cigars:', currentCigars.length, 'sorted by', sortBy, sortOrder);
        return currentCigars;
    }, [cigars, humidor.id, searchQuery, filters, sortBy, sortOrder]);

    /**
     * Identifies cigars with missing details that can be auto-filled by AI
     * Only includes cigars from the current humidor and current filter results
     */
    const cigarsWithMissingDetails = useMemo(() => {
        const missingDetailsCigars = filteredAndSortedCigars.filter(cigar =>
            FIELDS_TO_AUTOFILL.some(field =>
                cigar[field] === undefined ||
                cigar[field] === "" ||
                (Array.isArray(cigar[field]) && cigar[field].length === 0)
            )
        );
        console.log('MyHumidor: Cigars with missing details:', missingDetailsCigars.length, 'out of', filteredAndSortedCigars.length);
        return missingDetailsCigars;
    }, [filteredAndSortedCigars, FIELDS_TO_AUTOFILL]);

    /**
     * Determines if any filters are currently active
     */
    const isFilterActive = useMemo(() => {
        const active = filters.brand || filters.country || filters.strength || filters.flavorNotes.length > 0;
        console.log('MyHumidor: Filters active:', active, filters);
        return active;
    }, [filters]);

    /**
     * Generates unique filter options from cigars in this humidor
     */
    const uniqueBrands = useMemo(() => {
        const brands = [...new Set(cigars.filter(c => c.humidorId === humidor.id).map(c => c.brand))].sort();
        console.log('MyHumidor: Unique brands:', brands.length, brands);
        return brands;
    }, [cigars, humidor.id]);

    const uniqueCountries = useMemo(() => {
        const countries = [...new Set(cigars.filter(c => c.humidorId === humidor.id).map(c => c.country))].sort();
        console.log('MyHumidor: Unique countries:', countries.length, countries);
        return countries;
    }, [cigars, humidor.id]);

    const availableFlavorNotes = useMemo(() => {
        const notes = [...new Set(cigars.filter(c => c.humidorId === humidor.id).flatMap(c => c.flavorNotes))].sort();
        console.log('MyHumidor: Available flavor notes:', notes.length, notes);
        return notes;
    }, [cigars, humidor.id]);

    // === CALCULATED VALUES ===

    // Calculate total quantity and estimated value
    const totalQuantity = filteredAndSortedCigars.reduce((sum, c) => sum + c.quantity, 0);
    const humidorValue = filteredAndSortedCigars.reduce((sum, c) => sum + (c.quantity * (c.price || 0)), 0);

    console.log('MyHumidor: Collection stats - Total quantity:', totalQuantity, 'Estimated value: $', humidorValue.toFixed(2));

    const handleSearchChange = (e) => {
        const query = e.target.value;
        console.log('MyHumidor: Search query changed to:', query);
        setSearchQuery(query);
        if (query.length > 1) {
            const allSuggestions = cigars.filter(c => c.humidorId === humidor.id).map(c => c.brand).concat(cigars.filter(c => c.humidorId === humidor.id).map(c => c.name)).filter(name => name.toLowerCase().includes(query.toLowerCase()));
            const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 5);
            console.log('MyHumidor: Generated suggestions:', uniqueSuggestions);
            setSuggestions(uniqueSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSuggestions([]);
    };

    const handleToggleSelectMode = () => {
        console.log('MyHumidor: Toggling select mode from', isSelectMode, 'to', !isSelectMode);
        setIsSelectMode(!isSelectMode);
        setSelectedCigarIds([]);
    };

    const handleSelectCigar = (cigarId) => {
        console.log('MyHumidor: Selecting/deselecting cigar:', cigarId);
        setSelectedCigarIds(prev => {
            const newSelection = prev.includes(cigarId) ? prev.filter(id => id !== cigarId) : [...prev, cigarId];
            console.log('MyHumidor: Updated selected cigars:', newSelection);
            return newSelection;
        });
    };

    // Function to handle the Move Cigars action
    const handleMoveCigars = async (destinationHumidorId) => {
        // Get a new write batch
        const batch = writeBatch(db);
        // Iterate over each selected cigar ID
        selectedCigarIds.forEach(cigarId => {
            // Correctly reference the cigar document using the cigarId from the loop
            const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigarId);
            // Update the humidorId and reset the dateAdded for the moved cigar
            batch.update(cigarRef, { humidorId: destinationHumidorId, dateAdded: new Date().toISOString() });
        });
        // Commit the batch update
        await batch.commit();
        // Reset state and navigate to the destination humidor
        setIsMoveModalOpen(false);
        setIsSelectMode(false);
        setSelectedCigarIds([]);
        navigate('MyHumidor', { humidorId: destinationHumidorId });
    };

    const handleConfirmDeleteHumidor = async ({ action, destinationHumidorId }) => {
        const batch = writeBatch(db);
        const cigarsToDelete = cigars.filter(c => c.humidorId === humidor.id);

        switch (action) {
            case 'move':
                cigarsToDelete.forEach(cigar => {
                    const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigar.id);
                    batch.update(cigarRef, { humidorId: destinationHumidorId });
                });
                break;
            case 'export':
            case 'deleteAll':
                cigarsToDelete.forEach(cigar => {
                    const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigar.id);
                    batch.delete(cigarRef);
                });
                break;
            default: break;
        }

        const humidorRef = doc(db, 'artifacts', appId, 'users', userId, 'humidors', humidor.id);
        batch.delete(humidorRef);

        await batch.commit();

        // Update local state to reflect deletion
        const updatedCigars = cigars.filter(c => c.humidorId !== humidor.id);
        const updatedHumidors = humidors.filter(h => h.id !== humidor.id);

        setCigars(updatedCigars);
        setHumidors(updatedHumidors);

        setIsDeleteHumidorModalOpen(false);
        navigate('HumidorsScreen');
    };

    const handleAutofillMissingDetails = async () => {
        setIsAutofilling(true);
        setAutofillStatus("Auto-filling details...");

        for (const cigar of cigarsWithMissingDetails) {
            // Build prompt for Gemini
            const missingFields = FIELDS_TO_AUTOFILL.filter(f =>
                cigar[f] === undefined ||
                cigar[f] === "" ||
                (Array.isArray(cigar[f]) && cigar[f].length === 0)
            );
            if (!cigar.name || missingFields.length === 0) continue;

            const prompt = `You are a cigar database. Fill in missing details for this cigar as a JSON object.
Cigar: "${cigar.brand} ${cigar.name}".
Missing fields: ${missingFields.join(", ")}.
Schema: { "shortDescription": "string", "description": "string", "wrapper": "string", "binder": "string", "filler": "string", "rating": "number", "flavorNotes": ["string"], "price": "number" }.
If you cannot determine a value, use "" or [] or 0. Only return the JSON object.`;

            const responseSchema = {
                type: "OBJECT",
                properties: {
                    shortDescription: { type: "STRING" },
                    description: { type: "STRING" },
                    wrapper: { type: "STRING" },
                    binder: { type: "STRING" },
                    filler: { type: "STRING" },
                    rating: { type: "NUMBER" },
                    flavorNotes: { type: "ARRAY", items: { type: "STRING" } },
                    price: { type: "NUMBER" }
                }
            };

            const result = await callGeminiAPI(prompt, responseSchema);

            if (typeof result === "object" && result !== null) {
                // Only update missing fields
                const updateData = {};
                FIELDS_TO_AUTOFILL.forEach(field => {
                    if (
                        (!cigar[field] || (Array.isArray(cigar[field]) && cigar[field].length === 0)) &&
                        result[field] !== undefined
                    ) {
                        updateData[field] = result[field];
                    }
                });
                console.log("Fields to update for", cigar.name, updateData);
                if (Object.keys(updateData).length > 0) {
                    const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigar.id);
                    await updateDoc(cigarRef, updateData);
                }
            } else {
                setAutofillStatus(`Roxy couldn't find any details for "${cigar.name}".`);
                console.warn("No data returned from Gemini for", cigar.name, result);
            }
        }
        setAutofillStatus("Auto-fill complete!");
        setIsAutofilling(false);
        setShowAutofillBanner(false);
    };

    // Function to handle the confirmation of deleting selected cigars
    const handleConfirmDeleteCigars = async () => {
        // Get a new write batch
        const batch = writeBatch(db);
        // Iterate over each selected cigar ID
        selectedCigarIds.forEach(cigarId => {
            // Correctly reference the cigar document using the cigarId from the loop
            const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigarId);
            // Delete the document
            batch.delete(cigarRef);
        });
        // Commit the batch deletion
        await batch.commit();
        // Reset the state
        setIsDeleteCigarsModalOpen(false);
        setIsSelectMode(false);
        setSelectedCigarIds([]);
    };

    const handleSaveManualReading = async (newTemp, newHumidity) => {
        const humidorRef = doc(db, 'artifacts', appId, 'users', userId, 'humidors', humidor.id);
        await updateDoc(humidorRef, { temp: newTemp, humidity: newHumidity });
        setIsManualReadingModalOpen(false);
    };

    const handleFilterChange = (filterName, value) => setFilters(prev => ({ ...prev, [filterName]: value }));

    const handleFlavorNoteToggle = (note) => {
        setFilters(prev => ({ ...prev, flavorNotes: prev.flavorNotes.includes(note) ? prev.flavorNotes.filter(n => n !== note) : [...prev.flavorNotes, note] }));
    };

    const handleSortChange = (sortCriteria) => {
        if (sortBy === sortCriteria) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(sortCriteria);
            setSortOrder('asc');
        }
    };

    const handleClearFilters = () => {
        setFilters({ brand: '', country: '', strength: '', flavorNotes: [] });
    };

    return (
        <div id="pnlContainerWrapper" className={`${theme.bg} min-h-screen pb-24`}>
            {isManualReadingModalOpen && <ManualReadingModal humidor={humidor} onClose={() => setIsManualReadingModalOpen(false)} onSave={handleSaveManualReading} theme={theme} />}
            {isMoveModalOpen && <MoveCigarsModal onClose={() => setIsMoveModalOpen(false)} onMove={handleMoveCigars} destinationHumidors={humidors.filter(h => h.id !== humidor.id)} theme={theme} />}
            <DeleteHumidorModal isOpen={isDeleteHumidorModalOpen} onClose={() => setIsDeleteHumidorModalOpen(false)} onConfirm={handleConfirmDeleteHumidor} humidor={humidor} cigarsInHumidor={filteredAndSortedCigars} otherHumidors={humidors.filter(h => h.id !== humidor.id)} />
            <DeleteCigarsModal isOpen={isDeleteCigarsModalOpen} onClose={() => setIsDeleteCigarsModalOpen(false)} onConfirm={handleConfirmDeleteCigars} count={selectedCigarIds.length} />
            {isExportModalOpen && <ExportModal data={filteredAndSortedCigars} dataType="cigar" onClose={() => setIsExportModalOpen(false)} />}

            <div className="relative">

                <div className="flex justify-center items-center pt-6 pb-2">
                    <img
                        id="imgHumidorHeader"
                        src={humidor.image || `https://placehold.co/600x400/transparent/grey&text=${humidor.name.replace(/\s/g, '+')}`}
                        alt={humidor.name}
                        className="w-40 h-40 object-cover rounded-full border-4 border-amber-700 shadow-md"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <button onClick={() => navigate('HumidorsScreen')} className="p-2 bg-black/50 rounded-full">
                        <ChevronLeft className="w-7 h-7 text-white" />
                    </button>
                    <HumidorActionMenu
                        onAddCigar={() => navigate('AddCigar', { humidorId: humidor.id })}
                        onEdit={() => navigate('EditHumidor', { humidorId: humidor.id })}
                        onTakeReading={() => setIsManualReadingModalOpen(true)}
                        onExport={() => setIsExportModalOpen(true)}
                        onDelete={() => setIsDeleteHumidorModalOpen(true)}
                        onImport={() => navigate('DataSync')} // Navigate to DataSync for import options
                        handleToggleSelectMode={handleToggleSelectMode} // Fixed prop name to match component
                    />
                </div>
                <div className="absolute bottom-0 p-4">
                    <div className="flex items-center">
                        <h1 className="text-3xl font-bold text-white">{humidor.name}</h1>
                    </div>
                    <p className="text-sm text-gray-300">{humidor.shortDescription || humidor.description}</p>
                </div>
            </div>

            <div className="p-4">

                {/* My Humidor Stats Cards */}
                <HumidorStatsCards
                    stats={[
                        { label: "Humidity", value: `${humidor.humidity}%` },
                        { label: "Temperature", value: `${humidor.temp}°F` },
                        { label: "Est. Value", value: `$${humidorValue.toFixed(2)}` }
                    ]}
                />

                {/* Search Bar */}
                <div id="pnlSearchBar" className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search this humidor..." value={searchQuery} onChange={handleSearchChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    {searchQuery && (
                        <button onClick={handleClearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-b-xl mt-1 z-20 overflow-hidden">
                            {suggestions.map(suggestion => (<div key={suggestion} onMouseDown={() => handleSuggestionClick(suggestion)} className="w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors cursor-pointer">{suggestion}</div>))}
                        </div>
                    )}
                </div>

                <div id="pnlHumidorToolbar" className="flex justify-between items-center mb-6 px-0">

                    <div id="pnlHumidorStatsNum" className="relative group">
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-md px-3 py-2 backdrop-blur-sm">
                            <div className="flex items-center justify-center gap-1">
                                <span
                                    className="font-bold text-amber-400 text-lg hover:text-amber-300 transition-colors cursor-help"
                                    title="Unique cigars"
                                >
                                    {filteredAndSortedCigars.length}
                                </span>
                                <span className="text-gray-500 font-medium">/</span>
                                <span
                                    className="font-bold text-blue-400 text-lg hover:text-blue-300 transition-colors cursor-help"
                                    title="Total cigars"
                                >
                                    {totalQuantity}
                                </span>
                            </div>
                            {/* <div className="text-xs text-gray-500 text-center mt-0.5">cigars</div> */}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                            <div className="text-center">
                                <div className="text-amber-300">{filteredAndSortedCigars.length} unique cigars</div>
                                <div className="text-blue-300">{totalQuantity} total cigars</div>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>

                    <div id="toolbar-buttons" className="flex justify-center gap-2">
                        <div className="relative group">
                            <button
                                id="btnFilter"
                                onClick={() => setIsFilterPanelOpen(prev => !prev)}
                                className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full ${theme.primary} hover:bg-gray-700 transition-colors`}
                            >
                                <Filter className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                Filter & Sort
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-amber-500 text-white border-amber-400' : `${theme.primary} hover:bg-gray-700`}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                Grid View
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-white border-amber-400' : `${theme.primary} hover:bg-gray-700`}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                List View
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={handleToggleSelectMode}
                                className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full transition-colors ${isSelectMode ? 'bg-amber-500 text-white border-amber-400' : `${theme.primary} hover:bg-gray-700`}`}
                            >
                                <CheckSquare className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                Select Mode
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                id="btnAddCigar"
                                onClick={() => navigate('AddCigar', { humidorId: humidor.id })}
                                className="p-3 bg-amber-500 border border-amber-400 rounded-full text-white hover:bg-amber-600 transition-colors"
                                aria-label="Add Cigar"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                Add Cigar
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    </div>
                </div>






                {/* Roxy's Corner: Show the autofill banner if enabled, there are cigars with missing 
                details, AND user has valid Gemini API key */}
                {showAutofillBanner && cigarsWithMissingDetails.length > 0 && hasGeminiKey && !keyCheckLoading && (
                    <div
                        id="pnlRoxysCorner"
                        className="bg-amber-900/20 border border-amber-800 rounded-md overflow-hidden">
                        <button
                            onClick={() => setIsRoxyPanelCollapsed(!isRoxyPanelCollapsed)}
                            className="w-full p-4 flex justify-between items-center"
                        >
                            <h3 className="font-bold text-amber-300 text-lg flex items-center">
                                <Wind className="w-5 h-5 mr-2 text-amber-300" /> Roxy's Corner
                            </h3>
                            <ChevronDown className={`w-5 h-5 text-amber-200 transition-transform duration-300 ${isRoxyPanelCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                        {!isRoxyPanelCollapsed && (
                            <div className="px-4 pb-4">



                                <span className="text-amber-100 text-sm mb-3 block">
                                    Some imported cigars are missing many details. Let Roxy auto-fill them for you!
                                </span>



                                <button
                                    id="btnAutofillMissingDetails"
                                    onClick={handleAutofillMissingDetails}
                                    disabled={isAutofilling}
                                    className="bg-amber-500 text-white font-bold px-4 py-2 rounded-md hover:bg-amber-600 transition-colors w-full"
                                >
                                    {isAutofilling ? "Auto-filling..." : "Auto-fill Details"}
                                </button>
                                {autofillStatus && (
                                    <div className="mt-2 text-amber-200 text-xs">{autofillStatus}</div>
                                )}
                            </div>
                        )}
                    </div>
                )}






                {/* Show message when user has cigars with missing details but no API key */}
                {showAutofillBanner && cigarsWithMissingDetails.length > 0 && !hasGeminiKey && !keyCheckLoading && user && (
                    <div
                        id="pnlRoxysCorner"
                        className="bg-amber-900/20 border border-amber-800 rounded-md overflow-hidden">

                        <h3 className="font-bold text-amber-300 text-lg flex items-center justify-left mb-3">
                            <Wind id="pnlIcon" className="w-5 h-5 mr-2 text-amber-300" />
                            Roxy's Corner
                        </h3>


                        <div className="px-4 pb-4">

                            <span className="text-amber-100 text-sm mb-3 block">
                                Some cigars are missing details and can be auto-filled, but you need a Gemini API key to use auto-fill!
                            </span>

                            <div className="w-full p-3 bg-purple-900/20 border border-purple-600/50 rounded-md">
                                <p className="text-purple-200 text-sm text-center">
                                    💡 Add your Gemini API key in Settings to enable AI-powered auto-fill for missing cigar details!
                                </p>
                            </div>

                        </div>

                    </div>
                )}







                {isFilterActive && (
                    <div className="flex justify-between items-center mb-4 bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-300">Filtering by:</span>
                            {filters.brand && <span className="text-xs font-semibold px-2 py-1 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/50">{filters.brand}</span>}
                            {filters.country && <span className="text-xs font-semibold px-2 py-1 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/50">{filters.country}</span>}
                            {filters.strength && <span className="text-xs font-semibold px-2 py-1 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/50">{filters.strength}</span>}
                            {filters.flavorNotes.map(note => <span key={note} className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50">{note}</span>)}
                        </div>
                        <button onClick={handleClearFilters} className="p-1 rounded-md hover:bg-amber-800 transition-colors text-amber-400"><X className="w-4 h-4" /></button>
                    </div>
                )}

                {/* change the grid layout columns */}
                <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-4" : "flex flex-col gap-4"}>
                    {filteredAndSortedCigars.map(cigar => (viewMode === 'grid' ? <GridCigarCard key={cigar.id} cigar={cigar} navigate={navigate} isSelectMode={isSelectMode} isSelected={selectedCigarIds.includes(cigar.id)} onSelect={handleSelectCigar} /> : <ListCigarCard key={cigar.id} cigar={cigar} navigate={navigate} isSelectMode={isSelectMode} isSelected={selectedCigarIds.includes(cigar.id)} onSelect={handleSelectCigar} />))}
                    {filteredAndSortedCigars.length === 0 && (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-400">No cigars match your search.</p>
                        </div>
                    )}
                </div>

                {/* Panel for Select Mode */}
                {isSelectMode && (
                    <div id="pnlSelectMode" className="fixed bottom-20 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4 z-20 border-t border-gray-700">
                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-white">{selectedCigarIds.length} Selected</h3>
                                <button onClick={handleToggleSelectMode} className="text-amber-400 font-semibold">Done</button>
                            </div>
                            {selectedCigarIds.length > 0 && (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsMoveModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 rounded-full hover:bg-amber-600 transition-colors shadow-lg"><Move className="w-5 h-5" />Move</button>
                                    <button onClick={() => setIsDeleteCigarsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors shadow-lg"><Trash2 className="w-5 h-5" />Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}{/* End Panel for Select Mode */}

                {/* Panel for Filter Mode */}
                {isFilterPanelOpen && (
                    <div id="pnlFilterMode" className="fixed bottom-20 left-0 right-0 bg-gray-900/80 backdrop-blur-sm p-4 z-20 border-t border-gray-700">
                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-amber-400 flex items-center">
                                    {/* <Filter className="w-5 h-5 mr-2" />  */}
                                    Filter & Sort</h3>
                                <button onClick={() => setIsFilterPanelOpen(false)} className="text-amber-400 font-semibold">Done</button>
                            </div>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {/* Sorting Section */}
                                <div>
                                    <h4 className="font-bold text-white text-base mb-2">Sort By</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['name', 'brand', 'rating', 'quantity', 'price', 'dateAdded'].map(criteria => (
                                            <button
                                                key={criteria}
                                                onClick={() => handleSortChange(criteria)}
                                                className={`px-3 py-1.5 rounded-sm text-sm font-semibold flex items-center gap-1 transition-colors ${sortBy === criteria ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                            >
                                                {criteria === 'dateAdded' ? 'Date' : criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                                                {sortBy === criteria && (sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Filtering Section */}
                                <div className="border-t border-gray-700 pt-4 mt-4">
                                    <h4 className="font-bold text-white text-base mb-2">Filter By</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`${theme.subtleText} text-sm mb-1 block`}>Brand</label>
                                            <select value={filters.brand} onChange={(e) => handleFilterChange('brand', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-sm py-2 px-3 text-white">
                                                <option value="">All Brands</option>
                                                {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`${theme.subtleText} text-sm mb-1 block`}>Country</label>
                                            <select value={filters.country} onChange={(e) => handleFilterChange('country', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-sm py-2 px-3 text-white">
                                                <option value="">All Countries</option>
                                                {uniqueCountries.map(country => <option key={country} value={country}>{country}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className={`${theme.subtleText} text-sm mb-1 block`}>Strength</label>
                                            <select value={filters.strength} onChange={(e) => handleFilterChange('strength', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-sm py-2 px-3 text-white">
                                                <option value="">All Strengths</option>
                                                {strengthOptions.map(strength => <option key={strength} value={strength}>{strength}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className={`${theme.subtleText} text-sm mb-1 block`}>Flavor Notes</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableFlavorNotes.map(note => (
                                                <button key={note} onClick={() => handleFlavorNoteToggle(note)} className={`text-xs font-semibold px-1.5 py-1.5 rounded-sm transition-all duration-200 ${filters.flavorNotes.includes(note) ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 border border-gray-600'}`}>
                                                    {note}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Panel Actions */}
                            <div className="flex gap-3 pt-4 mt-4 border-t border-gray-700">
                                <button onClick={handleClearFilters} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors flex-grow">Clear Filters</button>
                                <button onClick={() => setIsFilterPanelOpen(false)} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-colors flex-grow">Done</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Place FilterSortModal here, outside the main content */}
            {isFilterSortModalOpen && (
                <FilterSortModal
                    isOpen={isFilterSortModalOpen}
                    onClose={() => setIsFilterSortModalOpen(false)}
                    filters={filters}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onFilterChange={handleFilterChange}
                    onFlavorNoteToggle={handleFlavorNoteToggle}
                    onSortChange={handleSortChange}
                    onClearFilters={handleClearFilters}
                    uniqueBrands={uniqueBrands}
                    uniqueCountries={uniqueCountries}
                    availableFlavorNotes={availableFlavorNotes}
                    theme={theme}
                />
            )}

        </div>
    );
};

export default MyHumidor;