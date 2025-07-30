/**
 *
 * @file CigarActionMenu.jsx
 * @path src/components/Menus/CigarActionMenu.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Cigar Action Menu Component
 *
 * Dropdown menu for managing cigar-specific actions: add journal, edit, export, and delete.
 * Provides a user-friendly interface for quick cigar management in the UI.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onExport - Function to handle export action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {Function} props.onAddJournal - Function to handle add journal action
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, PencilRuler, FileUp, Trash, BookOpen } from 'lucide-react';

const CigarActionMenu = ({ onEdit, onExport, onDelete, onAddJournal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const MenuItem = ({ icon: Icon, text, onClick, className = '' }) => (
        <button
            onClick={() => {
                onClick();
                setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-700 ${className}`}
        >
            <Icon className="w-5 h-5" />
            <span>{text}</span>
        </button>
    );

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-black/50 rounded-full text-white">
                <MoreVertical className="w-6 h-6" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-30 overflow-hidden">
                    <MenuItem icon={BookOpen} text="Add Journal" onClick={onAddJournal} className="text-gray-200" />
                    <div className="border-t border-gray-700 my-1"></div>
                    <MenuItem icon={PencilRuler} text="Edit this Cigar" onClick={onEdit} className="text-gray-200" />
                    <MenuItem icon={FileUp} text="Export this Cigar" onClick={onExport} className="text-gray-200" />
                    <div className="border-t border-gray-700 my-1"></div>
                    <MenuItem icon={Trash} text="Delete this Cigar" onClick={onDelete} className="text-red-400 hover:bg-red-900/50" />
                </div>
            )}
        </div>
    );
};

export default CigarActionMenu;