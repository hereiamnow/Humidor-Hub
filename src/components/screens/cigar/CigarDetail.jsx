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
const CigarDetail = ({ cigar, navigate, db, appId, userId, journalEntries }) => {
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
                        className="w-40 h-40 object-cover rounded-full border-4 border-primary shadow-lg"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent"></div>

                {/* Page Header Action Buttons */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <button onClick={() => navigate('MyHumidor', { humidorId: cigar.humidorId })} className="btn btn-circle btn-ghost"><ChevronLeft className="w-7 h-7" /></button>
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
                            <p className="text-base-content/80 text-sm font-semibold uppercase">{cigar.brand}</p>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{cigar.name}</h1>
                            </div>
                        </div>
                    </div>
                    {/* Badges: isPuro and rating */}
                    <div className="flex items-center">
                        <IsPuroBadge isPuro={isPuro} />
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
                    className="btn btn-primary w-full">
                    <Cigarette className="w-5 h-5" /> Smoke This! ({cigar.quantity} in stock)
                </button>
                {/* Smoke confirmation toast */}
                {showSmokeConfirmation && (
                    <div className="toast toast-center">
                        <div className="alert alert-success">
                            <Check className="w-5 h-5" />
                            <span>Enjoy your smoke!</span>
                        </div>
                    </div>
                )}

                {/* Cigar Profile Panel */}
                <div className="card bg-base-200 p-4 space-y-4">
                    <h3 className="card-title text-primary">Profile</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="col-span-2">
                            <p className="text-xs text-base-content/70">Overview</p>
                            <p className="font-light text-sm break-words">{cigar.shortDescription || 'No short description provided.'}</p>
                        </div>
                        <DetailItem label="Shape" value={cigar.shape} />
                        <DetailItem label="Size" value={cigar.length_inches && cigar.ring_gauge ? `${cigar.length_inches} x ${cigar.ring_gauge}` : cigar.size} />
                        <DetailItem label="Strength" value={cigar.strength} />
                        <DetailItem label="Wrapper" value={cigar.wrapper} />
                        <DetailItem label="Binder" value={cigar.binder} />
                        <DetailItem label="Filler" value={cigar.filler} />
                        <div id="isPuroBadge">
                            <p className="text-xs text-base-content/70">Origin</p>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{cigar.country || 'N/A'}</span>
                                {isPuro && (
                                    <div className="badge badge-success badge-sm">PURO</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div>
                        <p className="text-xs text-base-content/70">Description</p>
                        <p className="font-light text-sm">{cigar.description || 'No description provided.'}</p>
                    </div>
                    <div className="divider"></div>
                    <div>
                        <h4 className="font-light flex items-center mb-3">Flavor Notes</h4>
                        <div className="flex flex-wrap gap-2">
                            {cigar.flavorNotes && cigar.flavorNotes.length > 0 ?
                                cigar.flavorNotes.map(note => (<div key={note} className={`badge ${getFlavorTagColor(note)}`}>{note}</div>))
                                : <p className="text-sm text-base-content/70">No flavor notes added.</p>
                            }
                        </div>
                    </div>
                </div>

                {/* Purchase, Aging & Rating Panel */}
                <div className="card bg-base-200 p-4 space-y-4">
                    <h3 className="card-title text-primary">Purchase, Aging & Rating</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <DetailItem label="Date Added" value={formatDate(cigar.dateAdded)} />
                        <DetailItem label="Time in Humidor" value={calculateAge(cigar.dateAdded)} />
                        <DetailItem label="Price Paid" value={cigar.price ? `${Number(cigar.price).toFixed(2)}` : 'N/A'} />
                        <div>
                            <p className="text-xs text-base-content/70">My Rating</p>
                            <StarRating
                                rating={cigar.userRating || 0}
                                readonly={true}
                                size="w-4 h-4"
                            />
                        </div>
                    </div>
                </div>

                {/* Journal History Panel */}
                <div className="card bg-base-200 p-4 space-y-4">
                    <h3 className="card-title text-primary">Journal History</h3>
                    {journalEntriesForCigar.length > 0 ? (
                        <div className="space-y-4">
                            {journalEntriesForCigar.map(entry => (
                                <JournalEntryCard
                                    key={entry.id}
                                    entry={entry}
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
                        <p className="text-sm text-base-content/70">No journal entries for this cigar yet. Smoke one to add an entry!</p>
                    )}
                </div>

                {/* Roxy's Corner Collapsible Panel */}
                {hasGeminiKey && !keyCheckLoading && (
                    <div tabIndex={0} className="collapse collapse-plus border bg-neutral border-base-300 rounded-md shadow-sm mb-4">
                        <input type="checkbox" checked={isRoxyOpen} onChange={() => setIsRoxyOpen(!isRoxyOpen)} />
                        <div className="collapse-title font-bold text-lg flex items-center">
                            <Wind className="w-5 h-5 mr-2" /> Roxy's Corner
                        </div>
                        <div className="collapse-content">
                            <p className="text-sm pt-2">Let Roxy help you get the most out of your smoke. What would you like to know?</p>
                            <div className="pt-4 space-y-4">
                                <button onClick={handleSuggestPairings} className="btn btn-primary btn-outline w-full"><Sparkles className="w-5 h-5 mr-2" /> Suggest Pairings</button>
                                <button onClick={handleGenerateNote} className="btn btn-info btn-outline w-full"><Sparkles className="w-5 h-5 mr-2" /> Generate Note Idea</button>
                                <button onClick={handleFindSimilar} className="btn btn-success btn-outline w-full"><Sparkles className="w-5 h-5 mr-2" /> Find Similar Smokes</button>
                                <button onClick={handleAgingPotential} className="btn btn-accent btn-outline w-full"><CalendarIcon className="w-5 h-5 mr-2" /> Aging Potential</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CigarDetail;