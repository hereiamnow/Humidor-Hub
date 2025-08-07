/**
 *
 * @file AgingWellPanel.jsx
 * @path src/components/Panels/AgingWellPanel.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Aging Well Panel Component
 *
 * Displays the three oldest cigars in the collection, showing their aging status with
 * visual indicators and mobile-friendly design. Provides quick navigation to cigar
 * details and highlights cigars that are perfectly aged, ready to smoke, maturing, or young.
 *
 * @param {Object} props - Component props
 * @param {Array} props.cigars - Array of cigar objects
 * @param {Function} props.navigate - Navigation function for cigar details
 * @param {boolean} props.isCollapsed - Whether the panel is collapsed
 * @param {Function} props.onToggle - Callback to toggle collapse state
 *
 */
import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Clock } from 'lucide-react';
import { calculateAge } from '../utils/calculateAge';
import { formatDate } from '../../utils/formatUtils';

const AgingWellPanel = ({ cigars, navigate, isCollapsed, onToggle }) => {
    // Get the three oldest cigars with valid dates
    const oldestCigars = useMemo(() => {
        return cigars
            .filter(cigar => cigar.dateAdded) // Only include cigars with valid dates
            .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)) // Sort oldest first
            .slice(0, 3); // Take only the first 3 (oldest)
    }, [cigars]);

    // Helper function to get aging status and color
    const getAgingStatus = (ageInDays) => {
        if (ageInDays >= 730) return { text: 'Perfectly Aged', color: `badge badge-success badge-outline` };
        if (ageInDays >= 365) return { text: 'Ready to Smoke', color: 'badge badge-success' };
        if (ageInDays >= 180) return { text: 'Maturing', color: 'badge badge-info' };
        return { text: 'Young', color: `badge badge-ghost` };
    };

    return (
        <div id="pnlAgingWell" tabIndex={0} className="collapse collapse-plus bg-base-100 border-base-300 border">

            <div className="collapse-title font-semibold">
                Aging Well / From the Cellar
            </div>
            <div className="collapse-content text-sm">
                <div className="space-y-2">
                    {oldestCigars.length > 0 ? (
                        oldestCigars.map((cigar, index) => {
                            const ageInDays = calculateAge(cigar.dateAdded, true);
                            const agingStatus = getAgingStatus(ageInDays);

                            return (
                                <button
                                    key={cigar.id}
                                    onClick={() => navigate('CigarDetail', { cigarId: cigar.id })}
                                    className="w-full text-left p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-200 border border-base-300"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`badge badge-warning`}>
                                                    #{index + 1} Oldest
                                                </span>
                                                <span className={`badge ${agingStatus.color}`}>
                                                    {agingStatus.text}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-sm mb-1 truncate">
                                                {cigar.brand} {cigar.name}
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-base-content/70">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{calculateAge(cigar.dateAdded)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    <span>Since {formatDate(cigar.dateAdded)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="text-center py-6">
                            <Clock className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                            <p className="text-base-content/70 text-sm">No cigars with aging dates found.</p>
                            <p className="text-base-content/70 text-xs mt-1">Add some cigars to start tracking aging!</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AgingWellPanel;