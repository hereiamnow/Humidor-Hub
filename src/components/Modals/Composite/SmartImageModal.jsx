/**
 *
 * @file SmartImageModal.jsx
 * @path src/components/Modals/Composite/SmartImageModal.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 29, 2025
 *
 * Smart Image Modal Component
 *
 * Composite modal that combines image preview and upload for seamless image management.
 * Allows users to view, edit, and accept images with position data, supporting AI generation and theming.
 *
 * @param {Object} props - Component props
 * @param {string} props.itemName - Name of the item for AI image generation
 * @param {string} props.currentImage - Current image URL
 * @param {Object} props.currentPosition - Current image position {x, y}
 * @param {Function} props.onImageAccept - Function to call when an image is accepted with (imageUrl, position) parameters
 * @param {Object} props.theme - Theme object for styling
 * @param {string} props.itemCategory - Category of the item (e.g., 'cigar', 'humidor')
 * @param {string} props.itemType - Specific type of the item for AI generation
 *
 */

import React, { useState } from 'react';
import ImagePreview from '../../UI/ImagePreview';
import ImageUploadModal from '../Forms/ImageUploadModal';

const SmartImageModal = ({ itemName, currentImage, currentPosition, onImageAccept, theme, itemCategory, itemType }) => {
    // State to control whether the modal dialog is visible.
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <ImagePreview
                image={currentImage}
                position={currentPosition}
                onClick={() => setIsModalOpen(true)}
            />
            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImageAccept={onImageAccept}
                itemName={itemName}
                initialImage={currentImage}
                initialPosition={currentPosition}
                theme={theme}
                itemCategory={itemCategory}
                itemType={itemType}
            />
        </>
    );
};

export default SmartImageModal;