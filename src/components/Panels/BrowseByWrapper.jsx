
/**
 *
 * @file BrowseByWrapper.jsx
 * @path src/components/Panels/BrowseByWrapper.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 7, 2025
 *
 * Browse By Wrapper Panel Component
 *
 * Drawer/panel component for browsing cigars by wrapper type. Displays a collapsible list of wrapper types with cigar counts, allowing users to filter their collection by wrapper. Designed for mobile-friendly navigation and quick access to wrapper-based filtering.
 *
 * @param {Object} props - Component props
 * @param {Array} props.cigars - Array of cigar objects
 * @param {Function} props.navigate - Navigation function for filtered view
 * @param {Object} props.theme - Theme object for styling
 * @param {boolean} props.isCollapsed - Whether the panel is collapsed
 * @param {Function} props.onToggle - Callback to toggle collapse state
 *
 */

import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

const BrowseByWrapper = ({ cigars, navigate, theme, isCollapsed, onToggle }) => {
    // Calculate unique wrapper types and their counts
    const wrapperData = useMemo(() => {
        const counts = cigars.reduce((acc, cigar) => {
            const wrapper = cigar.wrapper || 'Unknown'; // Handle cigars without a wrapper defined
            acc[wrapper] = (acc[wrapper] || 0) + cigar.quantity;
            return acc;
        }, {});
        // Convert to an array of objects for easier mapping and sorting
        return Object.entries(counts)
            .map(([wrapper, quantity]) => ({ wrapper, quantity }))
            .sort((a, b) => a.wrapper.localeCompare(b.wrapper)); // Sort alphabetically by wrapper name
    }, [cigars]);

    return (
        <div id="pnlBrowseByWrapper" tabIndex={0} className="collapse collapse-plus bg-base-100 border-base-300 border">
           
            <div className="collapse-title font-semibold">
                    Browse by Wrapper
                </div>
            <div className="collapse-content text-sm">
                    {wrapperData.length > 0 ? (
                        wrapperData.map(({ wrapper, quantity }) => (
                            <button
                                key={wrapper}
                                onClick={() => navigate('HumidorsScreen', { preFilterWrapper: wrapper })}
                                className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex justify-between items-center"
                            >
                                <span className="text-gray-300">{wrapper}</span>
                                <span className="text-gray-400">({quantity})</span>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No wrapper data available.</p>
                    )}
                </div>
        </div>
    );
};

export default BrowseByWrapper;