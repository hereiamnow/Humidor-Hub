// File: CigarDetail.js
// Path: src/screens/CigarDetail.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 24, 2025
// Time: 12:19 PM CDT

// Description:
// CigarDetail component provides a comprehensive view of individual cigar records with rich functionality.
// Features include detailed cigar profile display, journal entry management, AI-powered recommendations,
// smoking session logging, and interactive "Roxy's Corner" with pairing suggestions, tasting notes,
// similar cigar recommendations, and aging potential analysis. The component integrates with Firebase
// Firestore for data operations and includes modal dialogs for various actions like editing, deleting,
// and exporting cigar data.

import React, { useState, useMemo, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import {
    Award,
    ChevronLeft,
    Cigarette,
    Check,
    Tag,
    BookText,
    Wind,
    ChevronDown,
    Sparkles,
    Calendar as CalendarIcon
} from 'lucide-react';

// Import UI utility functions
import { getRatingColor } from '../../utils/getRatingColor';
import { calculateAge } from '../../utils/calculateAge';
import { getFlavorTagColor } from '../../../utils/colorUtils';
import { formatDate } from '../../utils/formatUtils';

// Import modal components for dialogs
import GeminiModal from '../../Modals/Content/GeminiModal';
import FlavorNotesModal from '../../Modals/Forms/FlavorNotesModal';
import DeleteCigarsModal from '../../Modals/Actions/DeleteCigarsModal';
import ExportModal from '../../Modals/Data/ExportModal';

// Import menu and journal components
import CigarActionMenu from '../../Menus/CigarActionMenu';
import JournalEntryCard from '../../Journal/JournalEntryCard';

// Import Gemini API service
import { callGeminiAPI } from '../../../services/geminiService';

// Import StarRating UI component
import StarRating from '../../UI/StarRating';

// Import Gemini key utility
import { hasValidGeminiKey } from '../../../utils/geminiKeyUtils';

// Import IsPuroBadge component
import IsPuroBadge from '../../UI/IsPuroBadge';

// Import RatingBadge component
import RatingBadge from '../../UI/RatingBadge';

// Main CigarDetail component
const CigarDetail = ({ cigar, navigate, db, appId, userId, journalEntries, theme }) => {
    // Auth state
    const [user] = useAuthState(auth);

    // Modal and UI state
    const [modalState, setModalState] = useState({ isOpen: false, type: null, content: '', isLoading: false });
    const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isRoxyOpen, setIsRoxyOpen] = useState(false);
    const [showSmokeConfirmation, setShowSmokeConfirmation] = useState(false);

    // Gemini API key state
    const [hasGeminiKey, setHasGeminiKey] = useState(false);
    const [keyCheckLoading, setKeyCheckLoading] = useState(true);

    // Check if user has valid Gemini API key on mount or user change
    useEffect(() => {
        const checkGeminiKey = async () => {
            if (!user) {
                setHasGeminiKey(false);
                setKeyCheckLoading(false);
                return;
            }
            try {
                const hasKey = await hasValidGeminiKey(user.uid);
                setHasGeminiKey(hasKey);
            } catch (error) {
                setHasGeminiKey(false);
            } finally {
                setKeyCheckLoading(false);
            }
        };
        checkGeminiKey();
    }, [user]);

    // Memoized journal entries for this cigar, sorted by date
    const journalEntriesForCigar = useMemo(() => {
        return journalEntries
            .filter(entry => entry.cigarId === cigar.id)
            .sort((a, b) => new Date(b.dateSmoked) - new Date(a.dateSmoked));
    }, [journalEntries, cigar.id]);

    // Handler: Smoke a cigar (decrement quantity)
    const handleSmokeCigar = async () => {
        if (cigar.quantity > 0) {
            const newQuantity = cigar.quantity - 1;
            const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigar.id);
            await updateDoc(cigarRef, { quantity: newQuantity });
            setShowSmokeConfirmation(true);
            setTimeout(() => setShowSmokeConfirmation(false), 1500); // Hide after 1.5 seconds
            // Optionally navigate to journal entry screen
            // navigate('AddEditJournalEntry', { cigarId: cigar.id });
        }
    };

    // Handler: Delete cigar
    const handleDeleteCigar = async () => {
        const cigarRef = doc(db, 'artifacts', appId, 'users', userId, 'cigars', cigar.id);
        await deleteDoc(cigarRef);
        navigate('MyHumidor', { humidorId: cigar.humidorId });
    };

    // Handler: Suggest drink pairings using Gemini
    const handleSuggestPairings = async () => {
        setModalState({ isOpen: true, type: 'pairings', content: '', isLoading: true });
        const prompt = `You are a world-class sommelier and cigar expert. Given the following cigar:\n- Brand: ${cigar.brand}\n- Name: ${cigar.name}\n- Strength: ${cigar.strength}\n- Wrapper: ${cigar.wrapper}\n\nSuggest three diverse drink pairings (e.g., a spirit, a coffee, a non-alcoholic beverage). For each, provide a one-sentence explanation for why it works well. Format the response clearly with headings for each pairing.`;
        const result = await callGeminiAPI(prompt);
        setModalState({ isOpen: true, type: 'pairings', content: result, isLoading: false });
    };

    // Handler: Generate a tasting note idea using Gemini
    const handleGenerateNote = async () => {
        setModalState({ isOpen: true, type: 'notes', content: '', isLoading: true });
        const prompt = `You are a seasoned cigar aficionado with a poetic command of language. Based on this cigar's profile:\n- Brand: ${cigar.brand}\n- Name: ${cigar.name}\n- Strength: ${cigar.strength}\n- Wrapper: ${cigar.wrapper}\n\nGenerate a short, evocative tasting note (2-3 sentences) that a user could use as inspiration for their own review. Focus on potential flavors and the overall experience.`;
        const result = await callGeminiAPI(prompt);
        setModalState({ isOpen: true, type: 'notes', content: result, isLoading: false });
    };

    // Handler: Find similar cigars using Gemini
    const handleFindSimilar = async () => {
        setModalState({ isOpen: true, type: 'similar', content: '', isLoading: true });
        const prompt = `You are a cigar expert. A user likes the '${cigar.brand} ${cigar.name}'. Based on its profile (Strength: ${cigar.strength}, Wrapper: ${cigar.wrapper}, Filler: ${cigar.filler}, Origin: ${cigar.country}, Flavors: ${cigar.flavorNotes.join(', ')}), suggest 3 other cigars that they might also enjoy. For each suggestion, provide the Brand and Name, and a 1-sentence reason why it's a good recommendation. Format as a list.`;
        const result = await callGeminiAPI(prompt);
        setModalState({ isOpen: true, type: 'similar', content: result, isLoading: false });
    };

    // Handler: Get aging potential using Gemini
    const handleAgingPotential = async () => {
        setModalState({ isOpen: true, type: 'aging', content: '', isLoading: true });
        const timeInHumidor = calculateAge(cigar.dateAdded);
        const prompt = `You are a master tobacconist and cigar aging expert named Roxy. A user is asking about the aging potential of their cigar.

Cigar Details:
- Name: ${cigar.brand} ${cigar.name}
- Wrapper: ${cigar.wrapper}
- Strength: ${cigar.strength}
- Time already aged: ${timeInHumidor}

Provide a brief, encouraging, and slightly personalized note about this cigar's aging potential. Mention when it might be at its peak for smoking. Keep it to 2-3 sentences and maintain your persona as a friendly, knowledgeable dog.`;
        const result = await callGeminiAPI(prompt);
        setModalState({ isOpen: true, type: 'aging', content: result, isLoading: false });
    };

    // Handler: Close any modal
    const closeModal = () => setModalState({ isOpen: false, type: null, content: '', isLoading: false });

    // Detail item component for displaying label/value pairs
    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-bold text-white text-sm">{value || 'N/A'}</p>
        </div>
    );

    // Helper to determine if cigar is a puro (all tobaccos from same country)
    const isPuro = useMemo(() => {
        // Prefer explicit field if present
        if (typeof cigar.isPuro === 'boolean') return cigar.isPuro;
        // Fallback to computed logic
        if (!cigar.wrapper || !cigar.binder || !cigar.filler || !cigar.country) {
            return false;
        }
        const origin = cigar.country.trim().toLowerCase();
        return (
            cigar.wrapper.trim().toLowerCase() === origin &&
            cigar.binder.trim().toLowerCase() === origin &&
            cigar.filler.trim().toLowerCase() === origin
        );
    }, [cigar.isPuro, cigar.wrapper, cigar.binder, cigar.filler, cigar.country]);

    // Log isPuro value for debugging
    useEffect(() => {
        console.log('Screen loaded. isPuro:', isPuro);
    }, [isPuro]);


    // Main render
    return (
        <div 
        id="pnlContentWrapper_CigarDetail" 
        className="pb-24">
            {/* Modals for Gemini, flavor notes, delete, and export */}
            {modalState.isOpen && <GeminiModal title={modalState.type === 'pairings' ? "Pairing Suggestions" : modalState.type === 'notes' ? "Tasting Note Idea" : modalState.type === 'aging' ? "Aging Potential" : "Similar Smokes"} content={modalState.content} isLoading={modalState.isLoading} onClose={closeModal} />}
            {isFlavorModalOpen && <FlavorNotesModal cigar={cigar} db={db} appId={appId} userId={userId} onClose={() => setIsFlavorModalOpen(false)} />}
            <DeleteCigarsModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteCigar} count={1} />
            {isExportModalOpen && <ExportModal data={[cigar]} dataType="cigar" onClose={() => setIsExportModalOpen(false)} />}

            {/* Cigar image and header */}
            <div className="relative">


                <div className="flex justify-center items-center pt-6 pb-2">
                    <img
                        src={cigar.image || `https://placehold.co/400x400/5a3825/ffffff?font=playfair-display&text=${cigar.brand.replace(/\s/g, '+')}`}
                        alt={cigar.name}
                        className="w-40 h-40 object-cover rounded-full border-4 border-amber-700 shadow-lg"
                    />
                </div>
                

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

                {/* Page Header Action Buttons */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <button onClick={() => navigate('MyHumidor', { humidorId: cigar.humidorId })} className="p-2 bg-black/50 rounded-full text-white"><ChevronLeft className="w-7 h-7" /></button>
                    <CigarActionMenu
                        onEdit={() => navigate('EditCigar', { cigarId: cigar.id })}
                        onExport={() => setIsExportModalOpen(true)}
                        onDelete={() => setIsDeleteModalOpen(true)}
                        onAddJournal={() => navigate('AddEditJournalEntry', { cigarId: cigar.id })}
                    />
                </div>

                {/* Title and Rating/IsPuro Badges */}
                <div id="titleRatingBadge" className="absolute bottom-0 p-4 w-full flex justify-between items-end">
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="text-gray-300 text-sm font-semibold uppercase">{cigar.brand}</p>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold text-white">{cigar.name}</h1>
                            </div>
                        </div>
                    </div>
                    {/* Badges: isPuro and rating */}
                    <div className="flex items-center">
                        <IsPuroBadge isPuro={isPuro} theme={theme} />
                        <RatingBadge rating={cigar.rating} />
                    </div>
                </div>
            </div>

            {/* Main content panel */}
            <div className="p-4 space-y-6">
                {/* SMOKE THIS! Action Button */}
                <button
                    onClick={handleSmokeCigar}
                    disabled={cigar.quantity === 0}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <Cigarette className="w-5 h-5" /> Smoke This! ({cigar.quantity} in stock)
                </button>
                {/* Smoke confirmation toast */}
                {showSmokeConfirmation && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>Enjoy your smoke!</span>
                    </div>
                )}

                {/* Cigar Profile Panel */}
                <div className="bg-gray-800/50 p-4 rounded-md space-y-4">

                    {/* Profile header */}
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-amber-300 text-lg">Profile</h3>
                    </div>

                    {/* Profile grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {/* Short Description */}
                        <div className="col-span-2">
                            <p className="text-xs text-gray-400">Short Description</p>
                            <p className="font-light text-white text-sm break-words">{cigar.shortDescription || 'No short description provided.'}</p>
                        </div>

                        {/* Shape, Size, Strength, Wrapper, Binder, Filler */}
                        <DetailItem label="Shape" value={cigar.shape} />
                        {/* Updated Size display to combine length_inches and ring_gauge */}
                        <DetailItem label="Size" value={cigar.length_inches && cigar.ring_gauge ? `${cigar.length_inches} x ${cigar.ring_gauge}` : cigar.size} />
                        <DetailItem label="Strength" value={cigar.strength} />
                        <DetailItem label="Wrapper" value={cigar.wrapper} />
                        <DetailItem label="Binder" value={cigar.binder} />
                        <DetailItem label="Filler" value={cigar.filler} />

                        {/* Origin + Puro Badge (inline) */}
                        <div id="isPuroBadge">
                            <p className="text-xs text-gray-400">Origin</p>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{cigar.country || 'N/A'}</span>
                                {/* Inline puro badge for grid */}
                                {isPuro && (
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-700 text-xs font-semibold text-white ml-1"
                                        title="Wrapper, binder, and filler are all from the same country">
                                        PURO
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* My Rating (stars) */}
                        <div>
                            <p className="text-xs text-gray-400">My Rating</p>
                            <StarRating
                                rating={cigar.userRating || 0}
                                readonly={true}
                                size="w-4 h-4"
                            />
                        </div>

                        {/* Additional details */}
                        <DetailItem label="My Rating" value={cigar.userRating || 'N/A'} />
                        <DetailItem label="Price Paid" value={cigar.price ? `${Number(cigar.price).toFixed(2)}` : 'N/A'} />
                        <DetailItem label="Date Added" value={formatDate(cigar.dateAdded)} />
                        <DetailItem label="Time in Humidor" value={calculateAge(cigar.dateAdded)} />
                    </div>

                    {/* Description section */}
                    <div className="border-t border-gray-700 pt-4">
                        <p className="text-xs text-gray-400">Description</p>
                        <p className="font-light text-white text-sm">{cigar.description || 'No description provided.'}</p>
                    </div>

                    {/* Flavor notes section */}
                    <div className="border-t border-gray-700 pt-4">
                        <h4 className="font-bold text-white flex items-center mb-3"><Tag className="w-4 h-4 mr-2 text-amber-400" /> Flavor Notes</h4>
                        <div className="flex flex-wrap gap-2">
                            {cigar.flavorNotes && cigar.flavorNotes.length > 0 ?
                                cigar.flavorNotes.map(note => (<span key={note} className={`text-xs font-semibold px-3 py-1 rounded-full ${getFlavorTagColor(note)}`}>{note}</span>))
                                : <p className="text-sm text-gray-500">No flavor notes added.</p>
                            }
                        </div>
                    </div>
                </div>

                {/* Journal History Panel */}
                <div className="bg-gray-800/50 p-4 rounded-md space-y-4">
                    <h3 className="font-bold text-amber-300 text-lg flex items-center"><BookText className="w-5 h-5 mr-2" /> Journal History</h3>
                    {journalEntriesForCigar.length > 0 ? (
                        <div className="space-y-4">
                            {journalEntriesForCigar.map(entry => (
                                <JournalEntryCard
                                    key={entry.id}
                                    entry={entry}
                                    theme={{ card: 'bg-gray-800' }}
                                    onEdit={() => navigate('AddEditJournalEntry', { cigarId: cigar.id, entryId: entry.id })}
                                    onDelete={async (entryId) => {
                                        if (window.confirm("Delete this entry?")) {
                                            const entryRef = doc(db, 'artifacts', appId, 'users', userId, 'journalEntries', entryId);
                                            await deleteDoc(entryRef);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No journal entries for this cigar yet. Smoke one to add an entry!</p>
                    )}
                </div>

                {/* Roxy's Corner Collapsible Panel - Only show when user has valid Gemini API key */}
                {hasGeminiKey && !keyCheckLoading && (
                    <div id="pnlRoxysCorner"
                        className={`${theme.roxyBg} border ${theme.roxyBorder} rounded-md overflow-hidden`}>
                        <button onClick={() => setIsRoxyOpen(!isRoxyOpen)} className="w-full p-4 flex justify-between items-center">
                            <h3 className="font-bold text-amber-300 text-lg flex items-center"><Wind className="w-5 h-5 mr-2" /> Roxy's Corner</h3>
                            <ChevronDown className={`w-5 h-5 text-amber-300 transition-transform duration-300 ${isRoxyOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isRoxyOpen && (
                            <div id="pnlGeminiButtons" className="px-4 pb-4 space-y-4">
                                <p className="text-amber-200 text-sm pt-2">Let Roxy help you get the most out of your smoke. What would you like to know?</p>
                                <button onClick={handleSuggestPairings} className="w-full flex items-center justify-center bg-amber-500/20 border border-amber-500 text-amber-300 font-bold py-3 rounded-lg hover:bg-amber-500/30 transition-colors"><Sparkles className="w-5 h-5 mr-2" /> Suggest Pairings</button>
                                <button onClick={handleGenerateNote} className="w-full flex items-center justify-center bg-sky-500/20 border border-sky-500 text-sky-300 font-bold py-3 rounded-lg hover:bg-sky-500/30 transition-colors"><Sparkles className="w-5 h-5 mr-2" /> Generate Note Idea</button>
                                <button onClick={handleFindSimilar} className="w-full flex items-center justify-center bg-green-500/20 border border-green-500 text-green-300 font-bold py-3 rounded-lg hover:bg-green-500/30 transition-colors"><Sparkles className="w-5 h-5 mr-2" /> Find Similar Smokes</button>
                                <button onClick={handleAgingPotential} className="w-full flex items-center justify-center bg-purple-500/20 border border-purple-500 text-purple-300 font-bold py-3 rounded-lg hover:bg-purple-500/30 transition-colors"><CalendarIcon className="w-5 h-5 mr-2" /> Aging Potential</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CigarDetail;