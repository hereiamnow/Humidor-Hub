import React from 'react';
import { Tag, Edit } from 'lucide-react';
import { getFlavorTagColor } from '../../utils/colorUtils';

const FlavorNotesPanel = ({ 
    flavorNotes = [], 
    onEditClick, 
    theme,
    className = "",
    showEditButton = true 
}) => {
    return (
        <div id="pnlFlavorNotes" className={`bg-gray-800/50 p-4 rounded-md ${className}`}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-amber-300 text-lg flex items-center">
                    <Tag className="w-5 h-5 mr-3 text-amber-400" /> Flavor Notes
                </h3>
                {showEditButton && (
                    <button 
                        type="button" 
                        onClick={onEditClick} 
                        className="text-gray-400 hover:text-amber-400 p-1"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {flavorNotes.length > 0 ? (
                    flavorNotes.map(note => (
                        <span 
                            key={note} 
                            className={`text-xs font-semibold px-1 py-1 rounded-xs ${getFlavorTagColor(note)}`}
                        >
                            {note}
                        </span>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        No notes selected. {showEditButton ? "Click the edit icon to add some!" : ""}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FlavorNotesPanel;