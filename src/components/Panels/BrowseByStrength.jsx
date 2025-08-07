
/**
 *
 * @file BrowseByStrength.jsx
 * @path src/components/Panels/BrowseByStrength.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 8, 2025
 *
 * Browse By Strength Panel Component
 *
 * Drawer/panel component for browsing cigars by strength profile. Displays a collapsible list of strength categories with cigar counts, allowing users to filter their collection by strength. Designed for mobile-friendly navigation and quick access to strength-based filtering.
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
import { Zap } from 'lucide-react';
import { strengthCategories } from '../../constants/strengthCategories';
import CollapsiblePanel from '../UI/CollapsiblePanel';

const BrowseByStrength = ({ cigars, navigate }) => {
    const strengthData = useMemo(() => {
        const counts = strengthCategories.map(category => {
            let quantity = 0;
            // Sum quantities for a specific strength
            quantity = cigars
                .filter(cigar => cigar.strength === category.filterValue)
                .reduce((sum, cigar) => sum + cigar.quantity, 0);
            return { label: category.label, quantity, filterValue: category.filterValue };
        });
        return counts.filter(item => item.quantity > 0); // Only show categories with cigars
    }, [cigars, strengthCategories]);

    return (
        <CollapsiblePanel title="Browse by Profile" icon={Zap}>
            <div className="mt-4">
                {strengthData.length > 0 ? (
                    strengthData.map(({ label, quantity, filterValue }) => (
                        <button
                            key={label}
                            onClick={() => navigate('HumidorsScreen', { preFilterStrength: filterValue })}
                            className="w-full text-left py-2 px-4 rounded-lg hover:bg-base-200 transition-colors flex justify-between items-center"
                        >
                            <span className="text-base-content">{label}</span>
                            <span className="text-base-content/70">({quantity})</span>
                        </button>
                    ))
                ) : (
                    <p className="text-base-content/70 text-sm text-center py-4">No strength data available.</p>
                )}
            </div>
        </CollapsiblePanel>
    );
};

export default BrowseByStrength;