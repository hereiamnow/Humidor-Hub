/**
 *
 * @file ListCigarCardSimple.jsx
 * @path src/components/Cigar/ListCigarCardSimple.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * List Cigar Card Simple Component
 *
 * Displays a simplified horizontal card for a single cigar in a list layout, showing brand, name, shape, origin, rating, and quantity.
 * Supports selection mode for batch actions and navigation to detail view. Visual cues for rating and selection state.
 *
 * @param {Object} props - Component props
 * @param {Object} props.cigar - The cigar object to display
 * @param {Function} props.navigate - Navigation function for detail view
 * @param {boolean} props.isSelectMode - Whether selection mode is active
 * @param {boolean} props.isSelected - Whether this card is selected
 * @param {Function} props.onSelect - Callback for selection toggle
 *
 */
import React from 'react';
import { Check, Award } from 'lucide-react';
import { getRatingColor } from '../utils/getRatingColor';
import RatingBadge from '../UI/RatingBadge';

const ListCigarCardSimple = ({ cigar, navigate, isSelectMode, isSelected, onSelect }) => {
    const ratingColor = getRatingColor(cigar.rating);
    const clickHandler = isSelectMode ? () => onSelect(cigar.id) : () => navigate('CigarDetail', { cigarId: cigar.id });

    return (
        <div className="relative" onClick={clickHandler}>
            <div className={`bg-gray-800/50 rounded-md overflow-hidden group cursor-pointer flex transition-all duration-200 ${isSelected ? 'ring-2 ring-amber-400' : ''}`}>
                <div className="p-3 flex-grow flex flex-col justify-between">


                    <div id="cigar-header" className="flex flex-row justify-between items-start gap-2">
                        <div className="flex flex-col flex-grow min-w-0">
                            <div className="flex items-center gap-1">
                                {/* Add Award icon here if its isPuiro */}
                                {cigar.isPuro && (
                                    <span title="Puro">
                                        <Award className="w-4 h-4 text-amber-400 inline-block" />
                                    </span>
                                )}
                                <p className="text-gray-400 text-xs font-semibold uppercase">{cigar.brand}</p>
                            </div>
                            <h3 className="text-white font-bold text-base truncate">{cigar.name}</h3>
                        </div>
                        {cigar.rating > 0 && (
                            <div className="flex items-center">
                                <RatingBadge rating={cigar.rating} size="sm" />
                            </div>
                        )}
                    </div>


                    <div className="text-xs mt-2 space-y-1">

                        <div id="cigar-details" className="flex w-full gap-x-4 gap-y-1">

                            <div id="cigar-shape" className="flex-1 min-w-0 flex flex-col">
                                <span className="text-gray-400">shape</span>
                                <span title={cigar.shape}
                                    className="font-semibold text-gray-200">{cigar.shape}</span>
                            </div>

                            <div id="cigar-wrapper" className="flex-1 min-w-0 flex flex-col">
                                <span className="text-gray-400">wrapper</span>
                                <span title={cigar.wrapper}
                                    className="font-semibold text-gray-200">{cigar.wrapper}</span>
                            </div>

                            <div id="cigar-origin" className="flex-1 min-w-0 flex flex-col">
                                <span className="text-gray-400">origin</span>
                                <span title={cigar.country}
                                    className="font-semibold text-gray-200">{cigar.country}</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            {isSelectMode && (
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-amber-500 border-white' : 'bg-gray-900/50 border-gray-400'}`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
            )}
        </div>
    );
};

export default ListCigarCardSimple;
