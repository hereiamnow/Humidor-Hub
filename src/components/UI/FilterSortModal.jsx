/**
 * FilterSortModal - A modal component for filtering and sorting cigars
 * Allows users to select filters like brand, country, strength, and flavor notes
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.filters - Current filter values
 * @param {string} props.sortBy - Current sort criteria
 * @param {string} props.sortOrder - Current sort order (asc/desc)
 * @param {Function} props.onFilterChange - Function to handle filter changes
 * @param {Function} props.onFlavorNoteToggle - Function to toggle flavor notes
 * @param {Function} props.onSortChange - Function to handle sort changes
 * @param {Function} props.onClearFilters - Function to clear all filters
 * @param {Array} props.uniqueBrands - Array of unique brand names
 * @param {Array} props.uniqueCountries - Array of unique countries
 * @param {Array} props.availableFlavorNotes - Array of available flavor notes
 */
import React from 'react';
import { Filter, X, ArrowUp, ArrowDown } from 'lucide-react';
import { strengthOptions } from '../../constants/cigarOptions';

const FilterSortModal = ({
    isOpen,
    onClose,
    filters,
    sortBy,
    sortOrder,
    onFilterChange,
    onFlavorNoteToggle,
    onSortChange,
    onClearFilters,
    uniqueBrands,
    uniqueCountries,
    availableFlavorNotes
}) => {
    if (!isOpen) return null;

    const handleSortClick = (sortCriteria) => {
        onSortChange(sortCriteria);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center p-4 z-[200]" onClick={onClose}>
            <div className="bg-base-200 rounded-t-2xl p-6 w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-primary flex items-center"><Filter className="w-5 h-5 mr-2" /> Filter & Sort</h3>
                    <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle"><X /></button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Sorting Section */}
                    <div>
                        <h4 className="font-bold text-base-content text-base mb-2">Sort By</h4>
                        <div className="flex flex-wrap gap-2">
                            {['name', 'brand', 'rating', 'quantity', 'price', 'dateAdded'].map(criteria => (
                                <button
                                    key={criteria}
                                    onClick={() => handleSortClick(criteria)}
                                    className={`btn btn-sm gap-1 ${sortBy === criteria ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    {criteria === 'dateAdded' ? 'Date Added' : criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                                    {sortBy === criteria && (sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filtering Section */}
                    <div className="divider my-2"></div>
                    <div>
                        <h4 className="font-bold text-base-content text-base mb-2">Filter By</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Brand</span></label>
                                <select value={filters.brand} onChange={(e) => onFilterChange('brand', e.target.value)} className="select select-bordered w-full">
                                    <option value="">All Brands</option>
                                    {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Country</span></label>
                                <select value={filters.country} onChange={(e) => onFilterChange('country', e.target.value)} className="select select-bordered w-full">
                                    <option value="">All Countries</option>
                                    {uniqueCountries.map(country => <option key={country} value={country}>{country}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2 form-control">
                                <label className="label"><span className="label-text">Strength</span></label>
                                <select value={filters.strength} onChange={(e) => onFilterChange('strength', e.target.value)} className="select select-bordered w-full">
                                    <option value="">All Strengths</option>
                                    {strengthOptions.map(strength => <option key={strength} value={strength}>{strength}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 form-control">
                            <label className="label"><span className="label-text">Flavor Notes</span></label>
                            <div className="flex flex-wrap gap-2">
                                {availableFlavorNotes.map(note => (
                                    <button key={note} onClick={() => onFlavorNoteToggle(note)} className={`badge badge-lg transition-all duration-200 ${filters.flavorNotes.includes(note) ? 'badge-primary' : 'badge-outline'}`}>
                                        {note}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4 mt-4 border-t border-base-300">
                    <button onClick={onClearFilters} className="btn btn-ghost flex-grow">Clear Filters</button>
                    <button onClick={onClose} className="btn btn-primary flex-grow">Done</button>
                </div>
            </div>
        </div>
    );
};

export default FilterSortModal;