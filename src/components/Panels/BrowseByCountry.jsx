
/**
 *
 * @file BrowseByCountry.jsx
 * @path src/components/Panels/BrowseByCountry.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 8, 2025
 *
 * Browse By Country Panel Component
 *
 * Drawer/panel component for browsing cigars by country of origin. Displays a collapsible 
 * list of country categories with cigar counts, allowing users to filter their collection 
 * by country. Designed for mobile-friendly navigation and quick access to country-based 
 * filtering.
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
import { MapPin } from 'lucide-react';
import { countryCategories } from '../../constants/countryCategories';
import CollapsiblePanel from '../UI/CollapsiblePanel';

const BrowseByCountry = ({ cigars, navigate }) => {
    const countryData = useMemo(() => {
        const counts = cigars.reduce((acc, cigar) => {
            const country = cigar.country || 'Unknown';
            const matchedCategory = countryCategories.find(cat => cat.filterValue.toLowerCase() === country.toLowerCase());

            if (matchedCategory) {
                acc[matchedCategory.label] = (acc[matchedCategory.label] || 0) + cigar.quantity;
            } else {
                acc['Other Countries'] = (acc['Other Countries'] || 0) + cigar.quantity;
            }
            return acc;
        }, {});

        // Map back to the original category labels, including those with zero count if desired,
        // but here we filter to only show categories with actual cigars.
        return countryCategories
            .map(category => ({
                label: category.label,
                quantity: counts[category.label] || 0,
                filterValue: category.filterValue
            }))
            .filter(item => item.quantity > 0)
            .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label
    }, [cigars, countryCategories]);

    return (
        <CollapsiblePanel title="Browse by Country of Origin" icon={MapPin}>
            <div className="mt-4">
                {countryData.length > 0 ? (
                    countryData.map(({ label, quantity, filterValue }) => (
                        <button
                            key={label}
                            onClick={() => navigate('HumidorsScreen', { preFilterCountry: filterValue })}
                            className="w-full text-left py-2 px-4 rounded-lg hover:bg-base-200 transition-colors flex justify-between items-center"
                        >
                            <span className="text-base-content">{label}</span>
                            <span className="text-base-content/70">({quantity})</span>
                        </button>
                    ))
                ) : (
                    <p className="text-base-content/70 text-sm text-center py-4">No country of origin data available.</p>
                )}
            </div>
        </CollapsiblePanel>
    );
};

export default BrowseByCountry;