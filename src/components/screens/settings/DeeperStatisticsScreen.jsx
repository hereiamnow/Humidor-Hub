// File: DeeperStatisticsScreen.jsx
// Path: src/screens/DeeperStatisticsScreen.jsx
// Project: Humidor Hub
// Author: Extracted from App.js
// Date: July 23, 2025

// Description:
// A comprehensive statistics screen that provides detailed insights into the user's cigar collection.
// Features collection value calculations, user rating analytics, favorite brand/country analysis,
// oldest cigar tracking, and tasting preference visualization with strength distribution charts
// and top flavor notes. Used to give users deeper understanding of their collection patterns.

import React, { useMemo } from 'react';
import { ChevronLeft, DollarSign, Star, Box, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { getFlavorTagColor } from '../../../utils/colorUtils';
import { formatDate } from '../../../utils/formatUtils';
import { calculateAge } from '../../utils/calculateAge';

const DeeperStatisticsScreen = ({ navigate, cigars }) => {
    // 1. Collection Value
    const totalValue = cigars.reduce((sum, c) => sum + ((c.price || 0) * (c.quantity || 0)), 0);

    // 2. Average User Rating (only rated cigars)
    const ratedCigars = cigars.filter(c => typeof c.userRating === 'number' && c.userRating > 0);
    const avgUserRating = ratedCigars.length > 0
        ? (ratedCigars.reduce((sum, c) => sum + c.userRating, 0) / ratedCigars.length).toFixed(1)
        : 'N/A';

    // 3. Favorite Brand/Country
    const getMostCommon = (arr, key) => {
        const counts = arr.reduce((acc, item) => {
            const val = (item[key] || '').trim();
            if (val) acc[val] = (acc[val] || 0) + (item.quantity || 1);
            return acc;
        }, {});
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : null;
    };
    const favoriteBrand = getMostCommon(cigars, 'brand');
    const favoriteCountry = getMostCommon(cigars, 'country');

    // 4. Oldest Cigar
    const oldestCigar = cigars
        .filter(c => c.dateAdded)
        .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))[0];

    // Tasting Preferences Panel logic
    const strengthOptions = ['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'];
    const strengthCounts = useMemo(() => {
        const counts = {};
        cigars.forEach(cigar => {
            const strength = cigar.strength || 'Unknown';
            counts[strength] = (counts[strength] || 0) + (cigar.quantity || 1);
        });
        return counts;
    }, [cigars]);
    const totalStrengthCigars = strengthOptions.reduce((sum, s) => sum + (strengthCounts[s] || 0), 0);
    const preferredStrength = useMemo(() => {
        let max = 0, pref = 'N/A';
        for (const s of strengthOptions) {
            if ((strengthCounts[s] || 0) > max) {
                max = strengthCounts[s];
                pref = s;
            }
        }
        return pref;
    }, [strengthCounts]);
    const topFlavors = useMemo(() => {
        const flavorCounts = cigars.flatMap(c => c.flavorNotes || []).reduce((acc, flavor) => {
            acc[flavor] = (acc[flavor] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(flavorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => entry[0]);
    }, [cigars]);

    return (
        <div
            id="pnlContentWrapper_DeeperStatisticsScreen"
            className="p-4 pb-24">

            <div className="flex items-center mb-6">
                <button onClick={() => navigate('Settings')} className="btn btn-ghost btn-square -ml-2 mr-2">
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <h1 className="text-3xl font-bold text-base-content">Deeper Statistics & Insights</h1>
            </div>

            <p className="text-base-content/70 mb-6 leading-relaxed">
                This screen is for testing components. Explore comprehensive analytics about your cigar collection. View collection value,
                rating patterns, favorite brands and countries, aging insights, and detailed tasting
                preferences to better understand your smoking habits.
            </p>

            <div className="space-y-6">

                {/* 1. Collection Value */}
                <div className="card bg-base-200 p-4 flex flex-row items-center gap-4">
                    <DollarSign className="w-8 h-8 text-success" />
                    <div>
                        <p className="text-lg font-bold text-base-content">Collection Value</p>
                        <p className="text-2xl text-success font-bold">${totalValue.toFixed(2)}</p>
                    </div>
                </div>
                {/* 2. Average User Rating */}
                <div className="card bg-base-200 p-4 flex flex-row items-center gap-4">
                    <Star className="w-8 h-8 text-warning" />
                    <div>
                        <p className="text-lg font-bold text-base-content">Average My Rating</p>
                        <p className="text-2xl text-warning font-bold">{avgUserRating}</p>
                        <p className="text-xs text-base-content/70">{ratedCigars.length} cigars rated</p>
                    </div>
                </div>
                {/* 3. Favorite Brand/Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="card bg-base-200 p-4 flex flex-row items-center gap-4">
                        <Box className="w-8 h-8 text-primary" />
                        <div>
                            <p className="text-lg font-bold text-base-content">Favorite Brand</p>
                            <p className="text-xl text-primary font-bold">{favoriteBrand ? favoriteBrand.name : 'N/A'}</p>
                            {favoriteBrand && <p className="text-xs text-base-content/70">{favoriteBrand.count} cigars</p>}
                        </div>
                    </div>
                    <div className="card bg-base-200 p-4 flex flex-row items-center gap-4">
                        <MapPin className="w-8 h-8 text-info" />
                        <div>
                            <p className="text-lg font-bold text-base-content">Favorite Country</p>
                            <p className="text-xl text-info font-bold">{favoriteCountry ? favoriteCountry.name : 'N/A'}</p>
                            {favoriteCountry && <p className="text-xs text-base-content/70">{favoriteCountry.count} cigars</p>}
                        </div>
                    </div>
                </div>
                {/* 4. Oldest Cigar */}
                <div className="card bg-base-200 p-4 flex flex-row items-center gap-4">
                    <CalendarIcon className="w-8 h-8 text-secondary" />
                    <div>
                        <p className="text-lg font-bold text-base-content">Oldest Cigar</p>
                        {oldestCigar ? (
                            <>
                                <p className="text-xl text-secondary font-bold">{oldestCigar.brand} {oldestCigar.name}</p>
                                <p className="text-xs text-base-content/70">Aging since {formatDate(oldestCigar.dateAdded)} ({calculateAge(oldestCigar.dateAdded)})</p>
                            </>
                        ) : (
                            <p className="text-base-content/70">No cigars with a date added.</p>
                        )}
                    </div>
                </div>
                {/* --- Tasting Preferences Panel --- */}
                <div id="pnlTastingPreferences" className="card bg-base-200 p-4">
                    <h3 className="font-bold text-primary text-lg mb-3">Tasting Preferences</h3>
                    <div>
                        <h4 className="font-semibold text-base-content mb-2">Preferred Strength</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-base-content/70">Most Common:</span>
                            <span className="font-bold text-primary">{preferredStrength}</span>
                        </div>
                        <progress className="progress progress-primary w-full" value={totalStrengthCigars > 0 ? (strengthCounts[preferredStrength] || 0) : 0} max={totalStrengthCigars}></progress>
                        <div className="flex justify-between text-xs text-base-content/70 mt-1">
                            {strengthOptions.map(strength => (
                                <span key={strength} className="w-1/5 text-center">{strength}</span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-base-content mb-2">Top Flavors</h4>
                        <div className="flex flex-wrap gap-2">{topFlavors.map(note => (<div key={note} className="badge badge-neutral">{note}</div>))}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeeperStatisticsScreen;