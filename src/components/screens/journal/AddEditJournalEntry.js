/**
 *
 * @file AddEditJournalEntry.js
 * @path src/components/Journal/AddEditJournalEntry.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Add/Edit Journal Entry Component
 *
 * Provides a form for users to log or edit a cigar smoking experience, including ratings, notes, and flavor wheel integration.
 * Supports both creation and editing of journal entries, with Firebase integration for persistence and deletion.
 *
 * @param {Object} props - Component props
 * @param {Function} props.navigate - Navigation function
 * @param {Object} props.db - Firestore database instance
 * @param {string} props.appId - Application ID
 * @param {string} props.userId - User ID
 * @param {Object} props.cigar - The cigar object being journaled
 * @param {Object} [props.existingEntry] - Existing journal entry for editing
 *
 */
import React, { useState } from 'react';
import { doc, addDoc, updateDoc, collection, deleteDoc } from 'firebase/firestore';
import { ChevronLeft, Star, MapPin, GlassWater, Calendar as CalendarIcon, Save, Trash2, HelpCircle } from 'lucide-react';
import InputField from '../../UI/InputField';
import TextAreaField from '../../UI/TextAreaField';
import FlavorWheel from '../../Journal/FlavorWheel';



const AddEditJournalEntry = ({ navigate, db, appId, userId, cigar, existingEntry }) => {
    const isEditing = !!existingEntry;
    const [isFlavorWheelOpen, setIsFlavorWheelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        dateSmoked: new Date().toISOString(),
        location: '',
        pairing: '',
        experienceRating: 0,
        drawRating: 0,
        burnRating: 0,
        ashRating: 0,
        firstThirdNotes: '',
        secondThirdNotes: '',
        finalThirdNotes: '',
        burnTimeMinutes: '',
        ...existingEntry,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (name, rating) => {
        setFormData(prev => ({ ...prev, [name]: rating }));
    };

    const handleSave = async () => {
        const collectionRef = collection(db, 'artifacts', appId, 'users', userId, 'journalEntries');
        const dataToSave = {
            ...formData,
            cigarId: cigar.id,
            cigarName: cigar.name,
            cigarBrand: cigar.brand,
            experienceRating: Number(formData.experienceRating),
            drawRating: Number(formData.drawRating),
            burnRating: Number(formData.burnRating),
            ashRating: Number(formData.ashRating),
            burnTimeMinutes: Number(formData.burnTimeMinutes) || 0,
        };

        if (isEditing) {
            const docRef = doc(db, 'artifacts', appId, 'users', userId, 'journalEntries', existingEntry.id);
            await updateDoc(docRef, dataToSave);
        } else {
            await addDoc(collectionRef, dataToSave);
        }
        navigate('CigarJournal');
    };

    const handleDelete = async () => {
        if (isEditing) {
            const docRef = doc(db, 'artifacts', appId, 'users', userId, 'journalEntries', existingEntry.id);
            await deleteDoc(docRef);
            navigate('CigarJournal');
        }
    };



    return (
        <div className="p-4 pb-24">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('CigarDetail', { cigarId: cigar.id })} className="btn btn-ghost btn-circle">
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-bold ml-2">{isEditing ? 'Edit Journal Entry' : 'Log New Experience'}</h1>
            </div>

            <div className="bg-base-200 p-4 rounded-box mb-4">
                <p className="text-sm text-base-content/70">{cigar.brand}</p>
                <h2 className="text-xl font-bold text-primary">{cigar.name}</h2>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    <label className="label-text mb-2">Experience Rating</label>
                    <div className="rating rating-lg">
                        {[1, 2, 3, 4, 5].map(star => (
                            <input
                                key={star}
                                type="radio"
                                name="experienceRating"
                                className="mask mask-star-2 bg-warning"
                                checked={formData.experienceRating === star}
                                onChange={() => handleRatingChange('experienceRating', star)}
                            />
                        ))}
                    </div>
                </div>

                <InputField icon={CalendarIcon} name="dateSmoked" label="Date & Time" type="datetime-local" value={formData.dateSmoked.substring(0, 16)} onChange={handleInputChange} />
                <InputField icon={MapPin} name="location" label="Location" placeholder="e.g., Back Patio" value={formData.location} onChange={handleInputChange} />
                <InputField icon={GlassWater} name="pairing" label="Drink Pairing" placeholder="e.g., Espresso, Bourbon" value={formData.pairing} onChange={handleInputChange} />

                <div id="pnlPerformanceStarRatings" className="bg-base-200 p-4 rounded-box space-y-4">
                    <h3 className="text-lg font-semibold text-primary text-center">Performance Ratings</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="label-text">Draw</label>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="drawRating"
                                        className="mask mask-star-2 bg-warning"
                                        checked={formData.drawRating === star}
                                        onChange={() => handleRatingChange('drawRating', star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="label-text">Burn</label>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="burnRating"
                                        className="mask mask-star-2 bg-warning"
                                        checked={formData.burnRating === star}
                                        onChange={() => handleRatingChange('burnRating', star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="label-text">Ash</label>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="ashRating"
                                        className="mask mask-star-2 bg-warning"
                                        checked={formData.ashRating === star}
                                        onChange={() => handleRatingChange('ashRating', star)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="firstThirdNotes" className="label-text">First Third Notes</label>
                        <button onClick={() => setIsFlavorWheelOpen(true)} className="btn btn-ghost btn-circle btn-sm">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                    <TextAreaField name="firstThirdNotes" placeholder="e.g., Peppery, with hints of cedar..." value={formData.firstThirdNotes} onChange={handleInputChange} rows={3} />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="secondThirdNotes" className="label-text">Second Third Notes</label>
                        <button onClick={() => setIsFlavorWheelOpen(true)} className="btn btn-ghost btn-circle btn-sm">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                    <TextAreaField name="secondThirdNotes" placeholder="e.g., Mellowed into cocoa and leather..." value={formData.secondThirdNotes} onChange={handleInputChange} rows={3} />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="finalThirdNotes" className="label-text">Final Third Notes</label>
                        <button onClick={() => setIsFlavorWheelOpen(true)} className="btn btn-ghost btn-circle btn-sm">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                    <TextAreaField name="finalThirdNotes" placeholder="e.g., A sweet, creamy finish..." value={formData.finalThirdNotes} onChange={handleInputChange} rows={3} />
                </div>
                <InputField name="burnTimeMinutes" label="Burn Time (minutes)" type="number" placeholder="e.g., 75" value={formData.burnTimeMinutes} onChange={handleInputChange} />

                <div className="pt-4 flex space-x-4">
                    <button onClick={handleSave} className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> {isEditing ? 'Save Changes' : 'Save Entry'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="btn btn-error w-full flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" /> Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="modal modal-open" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg text-error flex items-center">
                            <Trash2 className="w-5 h-5 mr-2" /> Delete Journal Entry
                        </h3>
                        <p className="py-4">
                            Are you sure you want to delete this journal entry? This action cannot be undone.
                        </p>
                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="btn"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
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

            {/* Flavor Wheel Panel */}
            {isFlavorWheelOpen && (
                <div
                    id="pnlFlavorWheelPanel"
                    className="fixed inset-x-0 bottom-0 z-40 h-[60vh] max-h-[calc(80vh-5rem)] transform-gpu transition-transform duration-300 ease-in-out"
                    style={{ transform: isFlavorWheelOpen ? 'translateY(0)' : 'translateY(100%)' }}
                >
                    <div className="bg-base-100/95 backdrop-blur-sm border-t border-base-300 shadow-2xl h-full flex flex-col">
                        <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-base-300">
                            <h3 id="flavorWheelTitle" className="text-xl font-bold text-primary flex items-center">
                                Flavor Wheel
                            </h3>
                            <button onClick={() => setIsFlavorWheelOpen(false)} className="btn btn-primary">Done</button>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto">
                            <FlavorWheel onFlavorSelect={() => { }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddEditJournalEntry;