/**
 *
 * @file JournalEntryCard.js
 * @path src/components/Journal/JournalEntryCard.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Journal Entry Card Component
 *
 * Displays a single cigar journal entry with ratings, notes, and actions for editing or deleting.
 * Includes a dropdown menu for entry actions and visualizes performance and tasting notes.
 *
 * @param {Object} props - Component props
 * @param {Object} props.entry - The journal entry object to display
 * @param {Function} props.onEdit - Callback for editing the entry
 * @param {Function} props.onDelete - Callback for deleting the entry
 *
 */
import React from 'react';
import { Star, MapPin, GlassWater, Calendar as CalendarIcon, MoreVertical, Edit, Trash2 } from 'lucide-react';

const JournalEntryCard = ({ entry, onEdit, onDelete }) => {
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
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const RatingStars = ({ rating }) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-base-content/50'}`} />
            ))}
        </div>
    );

    return (
        <div className="card bg-base-200 p-4 rounded-md shadow-md relative">

            <div id="entry-header" className="flex justify-between items-start">
                <div id="entry-info">
                    <p className="text-xs text-base-content/70 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> {formatDate(entry.dateSmoked)}</p>
                    <h4 className="font-bold text-lg text-base-content mt-1">{entry.cigarName}</h4>
                    <p className="text-sm text-base-content/80">{entry.cigarBrand}</p>
                </div>

                <div id="rating" className="flex flex-col items-end">
                    <RatingStars rating={entry.experienceRating} />
                    <p className="text-xs text-base-content/70 mt-1">{entry.experienceRating}/5 Stars</p>
                </div>
            </div>

            <div id="entry-details" className="mt-4 border-t border-base-content/10 pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-base-content/80">{entry.location || 'No location specified'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <GlassWater className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-base-content/80">{entry.pairing || 'No pairing specified'}</span>
                </div>
            </div>

            <div id="performance" className="mt-4 border-t border-base-content/10 pt-4">
                <h5 className="text-sm font-semibold text-secondary mb-3">Performance</h5>
                <div className="grid grid-cols-3 gap-2 text-left">
                    <div >
                        <p className="text-xs text-base-content/70 text-center">Draw</p>
                        <RatingStars rating={entry.drawRating || 0} />
                    </div>
                    <div >
                        <p className="text-xs text-base-content/70 text-center">Burn</p>
                        <RatingStars rating={entry.burnRating || 0} />
                    </div>
                    <div >
                        <p className="text-xs text-base-content/70 text-center">Ash</p>
                        <RatingStars rating={entry.ashRating || 0} />
                    </div>
                </div>
            </div>


            <div id="tasting-notes" className="mt-4 border-t border-base-content/10 pt-4 space-y-3">
                <h5 className="text-sm font-semibold text-secondary">Tasting Notes</h5>
                <div className="text-sm text-base-content/70 space-y-2 pl-2 border-l-2 border-base-content/10">
                    <p><strong>1/3:</strong> {entry.firstThirdNotes || 'N/A'}</p>
                    <p><strong>2/3:</strong> {entry.secondThirdNotes || 'N/A'}</p>
                    <p><strong>3/3:</strong> {entry.finalThirdNotes || 'N/A'}</p>
                </div>
            </div>

            <div className="absolute top-4 right-4" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full hover:bg-base-content/10">
                    <MoreVertical className="w-5 h-5 text-base-content/70" />
                </button>
                {menuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-base-100 border border-base-content/10 rounded-lg shadow-lg z-10 overflow-hidden">
                        <button onClick={() => { onEdit(entry); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left text-base-content hover:bg-base-content/10">
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => { onDelete(entry.id); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left text-error hover:bg-error/10">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalEntryCard;