/**
 *
 * @file GridJournalEntryCard.js
 * @path src/components/Journal/GridJournalEntryCard.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 30, 2025
 *
 * Grid Journal Entry Card Component
 *
 * Displays a compact card view for a single journal entry in a grid layout, showing cigar name, brand, 
 * date smoked, and overall rating. Includes dropdown menu for edit/delete actions.
 *
 * @param {Object} props - Component props
 * @param {Object} props.entry - The journal entry object to display
 * @param {Function} props.onEdit - Callback for editing the entry
 * @param {Function} props.onDelete - Callback for deleting the entry
 *
 */
import React from 'react';
import { Star, Calendar as CalendarIcon, MoreVertical, Edit, Trash2 } from 'lucide-react';

const GridJournalEntryCard = ({ entry, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const RatingStars = ({ rating }) => (
        <div className="flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-base-content/50'}`}
                />
            ))}
        </div>
    );

    return (
        <div className="card bg-base-200 rounded-md overflow-hidden group cursor-pointer transition-all duration-200 relative">
            {/* Header with date */}
            <div className="bg-base-300 px-3 py-2 border-b border-base-content/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3 text-base-content/70" />
                        <p className="text-xs text-base-content/70">{formatDate(entry.dateSmoked)}</p>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="p-1 rounded-full hover:bg-base-content/10 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-base-content/70" />
                        </button>
                        {menuOpen && (
                            <div className="absolute top-full right-0 mt-1 w-32 bg-base-100 border border-base-content/10 rounded-lg shadow-lg z-10 overflow-hidden">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(entry);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-base-content hover:bg-base-content/10 transition-colors"
                                >
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(entry.id);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-error hover:bg-error/10 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="p-4 space-y-3">
                {/* Cigar info */}
                <div className="text-center">
                    <h4 className="font-bold text-lg text-base-content truncate" title={entry.cigarName}>
                        {entry.cigarName}
                    </h4>
                    <p className="text-sm text-base-content/80 truncate" title={entry.cigarBrand}>
                        {entry.cigarBrand}
                    </p>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-center space-y-1">
                    <RatingStars rating={entry.experienceRating || 0} />
                    <p className="text-xs text-base-content/70">
                        {entry.experienceRating || 0}/5 Stars
                    </p>
                </div>

                {/* Performance ratings (compact) */}
                {(entry.drawRating || entry.burnRating || entry.ashRating) && (
                    <div className="border-t border-base-content/10 pt-3">
                        <p className="text-xs text-secondary font-semibold mb-2 text-center">Performance</p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-xs text-base-content/70 mb-1">Draw</p>
                                <div className="flex justify-center">
                                    <RatingStars rating={entry.drawRating || 0} />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-base-content/70 mb-1">Burn</p>
                                <div className="flex justify-center">
                                    <RatingStars rating={entry.burnRating || 0} />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-base-content/70 mb-1">Ash</p>
                                <div className="flex justify-center">
                                    <RatingStars rating={entry.ashRating || 0} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GridJournalEntryCard;