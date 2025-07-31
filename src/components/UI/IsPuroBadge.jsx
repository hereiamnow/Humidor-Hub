import React from 'react';
import { Award } from 'lucide-react';

// Reusable IsPuroBadge component
const IsPuroBadge = ({ isPuro, theme, size }) => {
    if (!isPuro) return null;
    const roxyBg = theme && theme.roxyBg ? theme.roxyBg : 'bg-green-700';
    // Support sm, md (default), and lg (default) sizes
    let badgeSize, iconSize, textSize, marginRight, showText;
    switch (size) {
        case "sm":
            badgeSize = "w-8 h-8";
            iconSize = "w-4 h-4 mb-0";
            textSize = "text-[10px]";
            marginRight = "mr-1";
            showText = false;
            break;
        case "md":
            badgeSize = "w-12 h-12";
            iconSize = "w-5 h-5 mb-0.5";
            textSize = "text-xs";
            marginRight = "mr-1";
            showText = false;
            break;
        default:
            badgeSize = "w-16 h-16";
            iconSize = "w-6 h-6 mb-1";
            textSize = "text-xs";
            marginRight = "mr-2";
            showText = true;
    }
    return (
        <div
            className={`flex flex-col items-center justify-center ${badgeSize} rounded-full border-2 aspect-square ${roxyBg} bg-gray-900/50 backdrop-blur-sm ${marginRight}`}
            style={{ aspectRatio: '1 / 1' }}
            title="Wrapper, binder, and filler are all from the same country"
        >
            <Award id="is-puro-icon" className={`${iconSize} text-amber-400`} />
            {showText && (
                <span id="is-puro-text" className={`font-bold text-white ${textSize}`}>PURO</span>
            )}
        </div>
    );
};

export default IsPuroBadge;
