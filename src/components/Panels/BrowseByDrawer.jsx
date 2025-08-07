/**
 *
 * @file BrowseByPanel.jsx
 * @path src/components/Panels/BrowseByPanel.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 8, 2025
 *
 * Browse By Panel Component
 *
 * Reusable bottom modal panel for browsing cigars by different criteria 
 * (wrapper, strength, country, etc). Features a scrollable content area, 
 * dynamic content based on browse mode, and navigation with pre-filters. 
 * Designed for mobile-friendly, modal-style navigation.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls panel visibility
 * @param {Function} props.onClose - Callback when panel is closed
 * @param {string} props.title - Panel title text
 * @param {React.Component} props.icon - Icon component to display next to title
 * @param {Array} props.data - Array of items to display in the panel
 * @param {Function} props.onItemClick - Callback when an item is clicked, receives the item data
 * @param {string} [props.itemLabelKey='label'] - Key to use for item label
 * @param {string} [props.itemQuantityKey='quantity'] - Key to use for item quantity
 *
 */
import React from 'react';
import { XCircle } from 'lucide-react';
const BrowseByPanel = ({
    isOpen,
    onClose,
    title,
    icon: IconComponent,
    data = [],
    onItemClick,
    itemLabelKey = 'label',
    itemQuantityKey = 'quantity'
}) => {
    // Don't render if panel is closed
    if (!isOpen) return null;

    // Handle item click with data passed to callback
    const handleItemClick = (item) => {
        onItemClick(item);
        onClose(); // Close panel after selection
    };

    return (
        <div
            id="pnlBrowseByDrawer"
            className="fixed bottom-20 left-0 right-0 bg-accent/10 backdrop-blur-sm p-4 z-40 border-t border-base-300 shadow-lg"
        >
            <div className="max-w-md mx-auto">
                {/* Panel Header */}
                <div id="pnlBrowseByTitle" className="flex justify-between items-center mb-4">
                    <h3 id="browseByMode" className="text-xl font-bold bg-base-content flex items-center">
                        {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label="Close panel"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* Panel Content - Scrollable List */}
                <div id="pnlBrowseByDrawerContent" className="mb-4 max-h-64 overflow-y-auto space-y-2">
                    {data.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-base-content/70">No items found</p>
                        </div>
                    ) : (
                        data.map((item, index) => {
                            // Support both object and simple data structures
                            const label = typeof item === 'object' ? item[itemLabelKey] : item;
                            const quantity = typeof item === 'object' ? item[itemQuantityKey] : null;
                            const key = typeof item === 'object' && item.key ? item.key : `${label}-${index}`;

                            return (
                                <button
                                    key={key}
                                    onClick={() => handleItemClick(item)}
                                    className="w-full text-left py-3 px-4 rounded-lg hover:bg-base-300 transition-colors flex justify-between items-center"
                                >
                                    <span className="text-base-content">{label}</span>
                                    {quantity !== null && quantity !== undefined && (
                                        <span className="badge badge-ghost">{quantity}</span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseByPanel;