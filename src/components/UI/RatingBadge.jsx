import React from 'react';
import { getRatingColor } from '../utils/getRatingColor';

// Add optional theme prop for background override
const RatingBadge = ({ rating, theme, size }) => {
    if (!rating || rating === 0) return null;
    const bgClass = theme && theme.ratingBg ? theme.ratingBg : 'bg-gray-900/50';
    // Support sm, md, and default (lg) sizes
    let badgeSize, ratingText, labelText, showLabel;
    switch (size) {
        case "sm":
            badgeSize = "w-8 h-8";
            ratingText = "text-base";
            labelText = "text-[10px]";
            showLabel = false;
            break;
        case "md":
            badgeSize = "w-14 h-14";
            ratingText = "text-lg";
            labelText = "text-xs";
            showLabel = false;
            break;
        default:
            badgeSize = "w-16 h-16";
            ratingText = "text-2xl";
            labelText = "text-xs";
            showLabel = true;
    }
    return (
        <div
            id="rating-badge"
            className={`flex flex-col items-center justify-center ${badgeSize} rounded-full border-2 aspect-square ${getRatingColor(rating)} ${bgClass} backdrop-blur-sm`}
            style={{ aspectRatio: '1 / 1' }}
            title="Professional rating"
        >
            <span id="sRatingNumber" className={`${ratingText} font-bold text-white`}>{rating}</span>
            {showLabel && (
                <span id="sRatingLabel" className={`${labelText} text-white/80 -mt-1`}>RATED</span>
            )}
        </div>
    );
};



export default RatingBadge;
