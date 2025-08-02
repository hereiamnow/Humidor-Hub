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
import JournalEntryCard from './JournalEntryCard';
import GridJournalEntryCard from './GridJournalEntryCard';
import PageHeader from '../UI/PageHeader';


const CigarJournalScreen = ({ navigate, journalEntries, theme, db, appId, userId }) => {
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
                theme={theme}
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
                        className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full transition-colors ${viewMode === 'grid'
                            ? 'bg-amber-500 text-white border-amber-400'
                            : `${theme.primary} hover:bg-gray-700`
                            }`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        Grid View
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                    </div>{/* End pnlLayoutGrid */}



                    {/* List View Button */}
                    <div
                        id="pnlLayoutList"
                        className="relative group">
                        <button
                            onClick={() => handleViewModeChange('list')}
                            className={`p-3 bg-gray-800/50 border border-gray-700 rounded-full transition-colors ${viewMode === 'list'
                                ? 'bg-amber-500 text-white border-amber-400'
                                : `${theme.primary} hover:bg-gray-700`
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                            List View
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>



                </div>

                {/* Add Journal Entry Button */}
                <div
                    id="pnlAddJournalEntryButton"
                    className="relative group">
                    <button
                        onClick={handleAddJournalEntry}
                        className="p-3 bg-amber-500 border border-amber-400 rounded-full text-white hover:bg-amber-600 transition-colors"
                        aria-label="Add Journal Entry"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                        Add Entry
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
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
                                    theme={theme}
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
                                    theme={theme}
                                />
                            )
                        ))}
                    </div>
                ) : (
                    // Roxy's Corner Message: No entries message
                    <div id="pnlRoxysCorner_NoEntries"
                        className="bg-gray-800/50 border border-amber-800 rounded-md p-4 mb-6 text-left">
                        <h3 className="font-bold text-amber-300 text-lg flex items-center">
                            <Wind id="pnlIcon" className="w-5 h-5 mr-2 text-amber-300" /> Roxy's Corner
                        </h3>
                        <p className="text-amber-200 text-sm mb-4">
                            Your Journal is Empty.You haven't logged any cigar experiences yet.
                            Roxy suggests you start by adding a humidor and cigars to your collection.
                        </p>
                        <p className="text-amber-200 text-sm ">
                            Once you have cigars, you can log your smoking experiences here.
                        </p>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]" onClick={() => setIsDeleteModalOpen(false)}>
                        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-red-400 flex items-center">
                                    <Trash2 className="w-5 h-5 mr-2" /> Delete Journal Entry
                                </h3>
                                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to delete this journal entry? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await handleDelete();
                                        setIsDeleteModalOpen(false);
                                    }}
                                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
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