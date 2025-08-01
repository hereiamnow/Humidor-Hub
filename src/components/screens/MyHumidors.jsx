// File: HumidorsScreen.jsx
// Path: src/screens/HumidorsScreen.jsx
// Project: Humidor Hub
// Author: Extracted from App.js
// Date: July 23, 2025

// Description:
// A comprehensive screen for managing and viewing all humidors in the user's collection.
// Features advanced search and filtering capabilities by wrapper, strength, and country,
// displays humidor cards with capacity visualization, temperature/humidity monitoring,
// and collection statistics. Supports both humidor overview mode and filtered cigar
// browsing with real-time search suggestions and filter management.

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Search, X, Plus, Thermometer, Droplets, ShieldPlus, MapPin, Leaf } from 'lucide-react';
import ListCigarCard from '../Cigar/ListCigarCard';
import { parseHumidorSize } from '../../utils/formatUtils';
import PageHeader from '../UI/PageHeader';

const HumidorsScreen = ({ navigate, cigars, humidors, db, appId, userId, theme, preFilterWrapper, preFilterStrength, preFilterCountry }) => { // July 5, 2025 - 2:00:00 AM CDT: Added preFilterCountry prop
    console.log('HumidorsScreen: Component initialized', { cigars: cigars?.length, humidors: humidors?.length, theme });

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeWrapperFilter, setActiveWrapperFilter] = useState(preFilterWrapper || '');
    const [activeStrengthFilter, setActiveStrengthFilter] = useState(preFilterStrength || '');
    const [activeCountryFilter, setActiveCountryFilter] = useState(preFilterCountry || '');



    // New function to handle clearing filters.
    // It navigates to the Dashboard if a pre-filter was active.
    const handleClearFilter = () => {
        console.log('HumidorsScreen: handleClearFilter called', {
            preFilterWrapper,
            preFilterStrength,
            preFilterCountry
        });

        if (preFilterWrapper || preFilterStrength || preFilterCountry) {
            console.log('HumidorsScreen: Navigating to Dashboard due to pre-filter');
            navigate('Dashboard');
        } else {
            console.log('HumidorsScreen: Clearing local filters');
            // Clear local filters if they were not set via props
            setActiveWrapperFilter('');
            setActiveStrengthFilter('');
            setActiveCountryFilter('');
        }
    };

    // Effect to update activeWrapperFilter when preFilterWrapper prop changes
    useEffect(() => {
        console.log('HumidorsScreen: preFilterWrapper effect triggered', { preFilterWrapper });

        if (preFilterWrapper) {
            console.log('HumidorsScreen: Setting wrapper filter and clearing other filters');
            setActiveWrapperFilter(preFilterWrapper);
            setSearchQuery(''); // Clear general search if a wrapper filter is applied
            setActiveStrengthFilter(''); // Clear strength filter if wrapper filter is applied
            setActiveCountryFilter(''); // July 5, 2025 - 2:00:00 AM CDT: Clear country filter if wrapper filter is applied
        } else {
            console.log('HumidorsScreen: Clearing wrapper filter');
            setActiveWrapperFilter(''); // Clear filter if preFilterWrapper is removed
        }
    }, [preFilterWrapper]);

    // Effect to update activeStrengthFilter when preFilterStrength prop changes
    useEffect(() => {
        console.log('HumidorsScreen: preFilterStrength effect triggered', { preFilterStrength });

        if (preFilterStrength) {
            console.log('HumidorsScreen: Setting strength filter and clearing other filters');
            setActiveStrengthFilter(preFilterStrength);
            setSearchQuery(''); // Clear general search if a strength filter is applied
            setActiveWrapperFilter(''); // Clear wrapper filter if strength filter is applied
            setActiveCountryFilter(''); // July 5, 2025 - 2:00:00 AM CDT: Clear country filter if strength filter is applied
        } else {
            console.log('HumidorsScreen: Clearing strength filter');
            setActiveStrengthFilter(''); // Clear filter if preFilterStrength is removed
        }
    }, [preFilterStrength]);

    // Effect to update activeCountryFilter when preFilterCountry prop changes
    useEffect(() => {
        console.log('HumidorsScreen: preFilterCountry effect triggered', { preFilterCountry });

        if (preFilterCountry) {
            console.log('HumidorsScreen: Setting country filter and clearing other filters');
            setActiveCountryFilter(preFilterCountry);
            setSearchQuery(''); // Clear general search if a country filter is applied
            setActiveWrapperFilter(''); // Clear wrapper filter if country filter is applied
            setActiveStrengthFilter(''); // Clear strength filter if country filter is applied
        } else {
            console.log('HumidorsScreen: Clearing country filter');
            setActiveCountryFilter(''); // Clear filter if preFilterCountry is removed
        }
    }, [preFilterCountry]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        console.log('HumidorsScreen: handleSearchChange called', { query, previousQuery: searchQuery });

        setSearchQuery(query);
        if (query.length > 1) {
            const allSuggestions = cigars.map(c => c.brand).concat(cigars.map(c => c.name)).filter(name => name && name.toLowerCase().includes(query.toLowerCase()));
            const uniqueSuggestions = [...new Set(allSuggestions)];
            const finalSuggestions = uniqueSuggestions.slice(0, 5);

            console.log('HumidorsScreen: Generated suggestions', {
                suggestionsCount: finalSuggestions.length,
                suggestions: finalSuggestions
            });

            setSuggestions(finalSuggestions);
        } else {
            console.log('HumidorsScreen: Clearing suggestions (query too short)');
            setSuggestions([]);
        }
    };

    const handleClearSearch = () => {
        console.log('HumidorsScreen: handleClearSearch called');
        setSearchQuery('');
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        console.log('HumidorsScreen: handleSuggestionClick called', { suggestion });
        setSearchQuery(suggestion);
        setSuggestions([]);
    };

    const filteredCigars = useMemo(() => {
        console.log('HumidorsScreen: filteredCigars useMemo triggered', {
            totalCigars: cigars.length,
            searchQuery,
            activeWrapperFilter,
            activeStrengthFilter,
            activeCountryFilter
        });

        let currentCigars = cigars;
        const initialCount = currentCigars.length;

        if (searchQuery) {
            currentCigars = currentCigars.filter(cigar =>
                cigar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cigar.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log('HumidorsScreen: After search filter', {
                searchQuery,
                beforeCount: initialCount,
                afterCount: currentCigars.length
            });
        }

        // Apply wrapper filter
        if (activeWrapperFilter) {
            const beforeWrapperCount = currentCigars.length;
            currentCigars = currentCigars.filter(cigar =>
                cigar.wrapper && cigar.wrapper.toLowerCase() === activeWrapperFilter.toLowerCase()
            );
            console.log('HumidorsScreen: After wrapper filter', {
                activeWrapperFilter,
                beforeCount: beforeWrapperCount,
                afterCount: currentCigars.length
            });
        }

        // Apply strength filter
        if (activeStrengthFilter) {
            const beforeStrengthCount = currentCigars.length;
            if (activeStrengthFilter === 'Flavored') {
                currentCigars = currentCigars.filter(cigar => cigar.flavorNotes && cigar.flavorNotes.length > 0);
            } else {
                currentCigars = currentCigars.filter(cigar =>
                    cigar.strength && cigar.strength.toLowerCase() === activeStrengthFilter.toLowerCase()
                );
            }
            console.log('HumidorsScreen: After strength filter', {
                activeStrengthFilter,
                beforeCount: beforeStrengthCount,
                afterCount: currentCigars.length
            });
        }

        if (activeCountryFilter) {
            const beforeCountryCount = currentCigars.length;
            if (activeCountryFilter === 'Other') {
                // Filter for cigars whose country is not explicitly listed in countryCategories
                const explicitCountries = ['dominican republic', 'nicaragua', 'honduras', 'usa', 'cuba'];
                currentCigars = currentCigars.filter(cigar =>
                    cigar.country && !explicitCountries.includes(cigar.country.toLowerCase())
                );
            } else {
                currentCigars = currentCigars.filter(cigar =>
                    cigar.country && cigar.country.toLowerCase() === activeCountryFilter.toLowerCase()
                );
            }
            console.log('HumidorsScreen: After country filter', {
                activeCountryFilter,
                beforeCount: beforeCountryCount,
                afterCount: currentCigars.length
            });
        }

        console.log('HumidorsScreen: Final filtered cigars', {
            finalCount: currentCigars.length,
            originalCount: cigars.length
        });

        return currentCigars;
    }, [cigars, searchQuery, activeWrapperFilter, activeStrengthFilter, activeCountryFilter]);

    const totalUniqueCigars = filteredCigars.length;
    const totalQuantity = filteredCigars.reduce((sum, c) => sum + c.quantity, 0);

    console.log('HumidorsScreen: Rendering with filters', {
        searchQuery,
        activeWrapperFilter,
        activeStrengthFilter,
        activeCountryFilter,
        filteredCigarsCount: filteredCigars.length
    });

    return (
        // Main content wrapper panel for the Humidors screen
        <div
            id="pnlContentWrapper_HumidorsScreen"
            className="p-4 pb-24">

            <PageHeader
                icon={Box}
                title="My Humidors"
                subtitle="Your Humidor collection"
                theme={theme}
            />


            {/* Search input panel with suggestions dropdown */}
            <div id="pnlSearchInput" className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search all cigars..." value={searchQuery} onChange={handleSearchChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                {searchQuery && (
                    <button onClick={handleClearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                )}
                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-b-xl mt-1 z-20 overflow-hidden">
                        {suggestions.map(suggestion => (
                            <div key={suggestion} onMouseDown={() => handleSuggestionClick(suggestion)} className="w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors cursor-pointer">
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active wrapper filter display panel */}
            {activeWrapperFilter && (
                <div id="pnlWrapperFilter" className={`flex justify-between items-center mb-4 ${theme.roxyBg} border ${theme.roxyBorder} rounded-lg p-3`}>
                    <div>
                        <span className="text-amber-200 text-sm">Filtering by: <span className="font-bold text-amber-100">{activeWrapperFilter} Wrapper</span></span>
                        <p className="text-xs text-amber-300">Found {filteredCigars.length} matching cigars.</p>
                    </div>
                    <button onClick={handleClearFilter} className="p-1 rounded-full hover:bg-amber-800 transition-colors text-amber-300"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Active strength filter display panel */}
            {activeStrengthFilter && (
                <div id="pnlStrengthFilter" className={`flex justify-between items-center mb-4 ${theme.roxyBg} border ${theme.roxyBorder} rounded-lg p-3`}>
                    <div>
                        <span className="text-amber-200 text-sm">Filtering by: <span className="font-bold text-amber-100">{activeStrengthFilter === 'Flavored' ? 'Flavored Cigars' : `${activeStrengthFilter} Strength`}</span></span>
                        <p className="text-xs text-amber-300">Found {filteredCigars.length} matching cigars.</p>
                    </div>
                    <button onClick={handleClearFilter} className="p-1 rounded-full hover:bg-amber-800 transition-colors text-amber-300"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Active country filter display panel */}
            {activeCountryFilter && (
                <div id="pnlCountryFilter" className={`flex justify-between items-center mb-4 ${theme.roxyBg} border ${theme.roxyBorder} rounded-lg p-3`}>
                    <div>
                        <span className="text-amber-200 text-sm">Filtering by: <span className="font-bold text-amber-100">{activeCountryFilter === 'Other' ? 'Other Countries' : `${activeCountryFilter}`}</span></span>
                        <p className="text-xs text-amber-300">Found {filteredCigars.length} matching cigars.</p>
                    </div>
                    <button onClick={handleClearFilter} className="p-1 rounded-full hover:bg-amber-800 transition-colors text-amber-300"><X className="w-4 h-4" /></button>
                </div>
            )}

            {searchQuery === '' && !activeWrapperFilter && !activeStrengthFilter && !activeCountryFilter ? (
                <>
                    {/* Main humidor overview panel with stats and toolbar */}
                    <div id="pnlHumidorOverview" className="flex justify-between items-center mb-6 px-2">

                        <div id="pnlHumidorStatsNum" className="relative group">
                            <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg px-3 py-2 backdrop-blur-sm">
                                <div className="flex items-center justify-center gap-1">
                                    <span
                                        className="font-bold text-amber-400 text-lg hover:text-amber-300 transition-colors cursor-help"
                                        title="Unique cigars"
                                    >
                                        {totalUniqueCigars}
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
                                    <div className="text-amber-300">{totalUniqueCigars} unique cigars</div>
                                    <div className="text-blue-300">{totalQuantity} total cigars</div>
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>

                        {/* Toolbar buttons panel for browsing and adding humidors */}
                        <div id="pnlToolbarButtons" className="flex justify-center gap-4">
                            <div className="relative group">
                                <button
                                    id="btnBrowseByWrapper"
                                    className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full ${theme.primary} hover:bg-gray-700 transition-colors`}
                                >
                                    <Leaf className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                    Browse by Wrapper
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button
                                    id="btnBrowseByStrength"
                                    className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full ${theme.primary} hover:bg-gray-700 transition-colors`}
                                >
                                    <ShieldPlus className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                    Browse by Strength
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button
                                    id="btnBrowseByCountry"
                                    className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full ${theme.primary} hover:bg-gray-700 transition-colors`}
                                >
                                    <MapPin className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                    Browse by Country
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button
                                    id="btnAddHumidor"
                                    onClick={() => {
                                        console.log('HumidorsScreen: Add Humidor button clicked');
                                        navigate('AddHumidor');
                                    }}
                                    className="p-3 bg-amber-500 border border-amber-400 rounded-full text-white hover:bg-amber-600 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                                    Add Humidor
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>

                        </div>

                    </div>


                    {/* Humidor cards display panel */}
                    <div id="pnlHumidorCards" className="space-y-6">
                        {humidors.map(humidor => {
                            const cigarsInHumidor = cigars.filter(c => c.humidorId === humidor.id);
                            const cigarCount = cigarsInHumidor.reduce((sum, c) => sum + c.quantity, 0);
                            const humidorValue = cigarsInHumidor.reduce((sum, c) => sum + (c.quantity * (c.price || 0)), 0);
                            const humidorCapacity = parseHumidorSize(humidor.size);
                            const percentageFull = humidorCapacity > 0 ? Math.min(Math.round((cigarCount / humidorCapacity) * 100), 100) : 0;
                            const capacityColor = percentageFull > 90 ? 'bg-red-500' : theme.primaryBg;

                            console.log('HumidorsScreen: Rendering humidor card', {
                                humidorId: humidor.id,
                                name: humidor.name,
                                cigarsInHumidor: cigarsInHumidor.length,
                                cigarCount,
                                humidorValue: humidorValue.toFixed(2),
                                humidorCapacity,
                                percentageFull
                            });

                            return (
                                // Individual humidor card panel
                                <div key={humidor.id} id={`pnlHumidorCard_${humidor.id}`} className="bg-gray-800/50 rounded-md overflow-hidden group cursor-pointer shadow-lg hover:shadow-amber-500/20 transition-shadow duration-300" onClick={() => {
                                    console.log('HumidorsScreen: Humidor card clicked', { humidorId: humidor.id, name: humidor.name });
                                    navigate('MyHumidor', { humidorId: humidor.id });
                                }}>
                                    <div className="relative">
                                        <img src={humidor.image} alt={humidor.name} className="w-full h-32 object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-4">
                                            <h2 className="text-2xl font-bold text-white">{humidor.name}</h2>
                                            <p className="text-sm text-gray-300">{humidor.location}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-800 flex gap-4">
                                        <div className="flex flex-col justify-center items-center space-y-2 pr-4 border-r border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Thermometer className="w-6 h-6 text-red-400" />
                                                <span className="text-2xl font-bold text-white">{humidor.temp}°F</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Droplets className="w-6 h-6 text-blue-400" />
                                                <span className="text-2xl font-bold text-white">{humidor.humidity}%</span>
                                            </div>
                                        </div>
                                        <div className="flex-grow flex flex-col justify-center">
                                            <div>
                                                <label className="text-xs text-gray-400">Capacity</label>
                                                <div className="relative w-full bg-gray-700 rounded-full h-6 mt-1">
                                                    <div style={{ width: `${percentageFull}%` }} className={`h-full rounded-full ${capacityColor} transition-all duration-500`}></div>
                                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{percentageFull}% Full</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <div className="text-xs text-gray-400">
                                                    Value: <span className="font-bold text-white">${humidorValue.toFixed(2)}</span>
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    Cigars: <span className="font-bold text-white">{cigarCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                // Filtered cigars display panel
                <div id="pnlFilteredCigars" className="flex flex-col gap-4">
                    {filteredCigars.map(cigar => {
                        console.log('HumidorsScreen: Rendering filtered cigar', { cigarId: cigar.id, name: cigar.name });
                        return (
                            <ListCigarCard key={cigar.id} cigar={cigar} navigate={navigate} />
                        );
                    })}
                    {filteredCigars.length === 0 && (
                        // No results panel
                        <div id="pnlNoResults" className="text-center py-10">
                            <p className="text-gray-400">No cigars match your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HumidorsScreen;