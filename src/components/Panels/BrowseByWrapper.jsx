
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
import { Layers } from 'lucide-react';
import CollapsiblePanel from '../UI/CollapsiblePanel';

const BrowseByWrapper = ({ cigars, navigate }) => {
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
        <CollapsiblePanel title="Browse by Wrapper" icon={Layers}>
            <div className="mt-4">
                {wrapperData.length > 0 ? (
                    wrapperData.map(({ wrapper, quantity }) => (
                        <button
                            key={wrapper}
                            onClick={() => navigate('HumidorsScreen', { preFilterWrapper: wrapper })}
                            className="w-full text-left py-2 px-4 rounded-lg hover:bg-base-200 transition-colors flex justify-between items-center"
                        >
                            <span className="text-base-content">{wrapper}</span>
                            <span className="text-base-content/70">({quantity})</span>
                        </button>
                    ))
                ) : (
                    <p className="text-base-content/70 text-sm text-center py-4">No wrapper data available.</p>
                )}
            </div>
        </CollapsiblePanel>
    );
};

export default BrowseByWrapper;