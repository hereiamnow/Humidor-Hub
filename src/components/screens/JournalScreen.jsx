/**
 *
 * @file CigarJournalScreen.js
 * @path src/components/Journal/CigarJournalScreen.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Cigar Journal Screen Component
 *
 * Displays a searchable, filterable list of cigar journal entries, sorted by date. Supports editing and deleting entries with confirmation modals.
 * Integrates with Firestore for entry deletion and provides a user-friendly interface for managing cigar experiences.
 *
 * @param {Object} props - Component props
 * @param {Function} props.navigate - Navigation function
 * @param {Array} props.journalEntries - Array of journal entry objects
 * @param {Object} props.theme - Theme object for styling
 * @param {Object} props.db - Firestore database instance
 * @param {string} props.appId - Application ID
 * @param {string} props.userId - User ID
 *
 */
import React, { useMemo, useState } from 'react';
import { BookText, Search, X, Trash2, LayoutGrid, List, Plus, Wind } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import JournalEntryCard from '../Journal/JournalEntryCard';
import GridJournalEntryCard from '../Journal/GridJournalEntryCard';
import PageHeader from '../UI/PageHeader';


const CigarJournalScreen = ({ navigate, journalEntries, db, appId, userId }) => {
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const sortedEntries = useMemo(() => {
        return [...journalEntries].sort((a, b) => new Date(b.dateSmoked) - new Date(a.dateSmoked));
    }, [journalEntries]);

    const filteredEntries = useMemo(() => {
        if (!searchQuery) return sortedEntries;
        const lowercasedQuery = searchQuery.toLowerCase();
        return sortedEntries.filter(entry =>
            entry.cigarName.toLowerCase().includes(lowercasedQuery) ||
            entry.cigarBrand.toLowerCase().includes(lowercasedQuery) ||
            (entry.notes && entry.notes.toLowerCase().includes(lowercasedQuery)) ||
            (entry.firstThirdNotes && entry.firstThirdNotes.toLowerCase().includes(lowercasedQuery)) ||
            (entry.secondThirdNotes && entry.secondThirdNotes.toLowerCase().includes(lowercasedQuery)) ||
            (entry.finalThirdNotes && entry.finalThirdNotes.toLowerCase().includes(lowercasedQuery))
        );
    }, [sortedEntries, searchQuery]);

    const handleEdit = (entry) => {
        navigate('AddEditJournalEntry', { cigarId: entry.cigarId, entryId: entry.id });
    };

    const handleDelete = async () => {
        if (entryToDelete) {
            const docRef = doc(db, 'artifacts', appId, 'users', userId, 'journalEntries', entryToDelete.id);
            await deleteDoc(docRef);
            setIsDeleteModalOpen(false);
            setEntryToDelete(null);
            navigate('CigarJournal');
        }
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleAddJournalEntry = () => {
        navigate('AddEditJournalEntry');
    };

    return (
        <div id="pnlContentWrapper" className="p-4 pb-24">
            <PageHeader
                icon={BookText}
                title="Cigar Journal"
                subtitle="Track your smoking experiences and tasting notes"
            />


            {/* Search Wrapper */}
            <div
                id="pnlSearchWrapper"
                className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search journal entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>{/* End Search Wrapper */}

            {/* toolbar */}
            <div
                id="toolbar"
                className="flex items-center gap-4 mb-6 px-2 justify-end">
                {/* Grid View Button */}
                <div
                    id="btnGridWrapper"
                    className="relative group flex items-center gap-4">
                    <button
                        id="btnGrid"
                        onClick={() => handleViewModeChange('grid')}
                        className={`btn btn-ghost btn-circle transition-colors ${viewMode === 'grid'
                            ? 'btn-active'
                            : ''
                            }`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-base-300 text-base-content text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        Grid View
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-base-300"></div>
                    </div>{/* End pnlLayoutGrid */}



                    {/* List View Button */}
                    <div
                        id="pnlLayoutList"
                        className="relative group">
                        <button
                            onClick={() => handleViewModeChange('list')}
                            className={`btn btn-ghost btn-circle transition-colors ${viewMode === 'list'
                                ? 'btn-active'
                                : ''
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-base-300 text-base-content text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                            List View
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-base-300"></div>
                        </div>
                    </div>



                </div>

                {/* Add Journal Entry Button */}
                <div
                    id="pnlAddJournalEntryButton"
                    className="relative group">
                    <button
                        onClick={handleAddJournalEntry}
                        className="btn btn-primary btn-circle"
                        aria-label="Add Journal Entry"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-base-300 text-base-content text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        Add Entry
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-base-300"></div>
                    </div>
                </div>
            </div>


            <div className="flex justify-between items-center mb-6 px-2">
                {/* Journal Entries Container - Conditional rendering based on view mode */}
                {filteredEntries.length > 0 ? (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4"
                        : "space-y-4"
                    }>
                        {filteredEntries.map(entry => (
                            viewMode === 'grid' ? (
                                <GridJournalEntryCard
                                    key={entry.id}
                                    entry={entry}
                                    onEdit={handleEdit}
                                    onDelete={() => {
                                        setEntryToDelete(entry);
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            ) : (
                                <JournalEntryCard
                                    key={entry.id}
                                    entry={entry}
                                    onEdit={handleEdit}
                                    onDelete={() => {
                                        setEntryToDelete(entry);
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            )
                        ))}
                    </div>
                ) : (
                    // Roxy's Corner Message: No entries message
                    <div id="pnlRoxysCorner_NoEntries"
                        className="bg-secondary/20 border border-secondary rounded-md p-6 text-left">

                        <h3 className="font-bold text-secondary-content text-lg flex items-center justify-left mb-3">
                            <Wind className="w-5 h-5 mr-2" /> Roxy's Corner
                        </h3>

                        <p id="roxyMessage"
                            className="text-secondary-content/80 text-sm mb-4">
                            Your Journal is Empty. You haven't logged any cigar experiences yet.
                            Roxy suggests you start by adding a humidor and cigars to your collection.
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]" onClick={() => setIsDeleteModalOpen(false)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                            <h3 className="font-bold text-lg text-error flex items-center"><Trash2 className="w-5 h-5 mr-2" />Delete Journal Entry</h3>
                            <p className="py-4">
                                Are you sure you want to delete this journal entry? This action cannot be undone.
                            </p>
                            <div className="modal-action">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        await handleDelete();
                                        setIsDeleteModalOpen(false);
                                    }}
                                    className="btn btn-error"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CigarJournalScreen;