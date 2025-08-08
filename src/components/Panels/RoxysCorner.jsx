/**
 *
 * @file RoxysCorner.jsx
 * @path src/components/Panels/RoxysCorner.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date January 8, 2025
 *
 * Roxy's Corner Component
 *
 * A reusable subscription-aware panel component that displays different styling and content based on user subscription tier. 
 * Features premium/free tier styling with gradient backgrounds, appropriate icons, and customizable content through children props.
 *
 * @param {Object} props - Component props
 * @param {Object} props.subscription - Optional subscription object (falls back to context)
 * @param {boolean} props.isCollapsible - Whether the panel should be collapsible
 * @param {boolean} props.isCollapsed - Current collapsed state (only used if isCollapsible is true)
 * @param {Function} props.onToggle - Toggle function for collapsible state
 * @param {string} props.panalTitle - Optional custom title (defaults to "Roxy's Corner")
 * @param {React.ReactNode} props.children - Optional custom content to display
 *
 */

import React from 'react';
import { Wind, Lock } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';


const RoxysCorner = ({ subscription: propSubscription, isCollapsible = false, isCollapsed = false, onToggle, panalTitle, children }) => {
    // Get subscription context values
    const { subscription: contextSubscription, isPremium, isFree } = useSubscription();
    console.log('RoxysCorner: context values', { contextSubscription, isPremium, isFree });

    // Use context subscription if available, otherwise fall back to prop
    const subscription = contextSubscription || propSubscription;
    console.log('Roxys Corner: effective subscription', subscription);

    // Don't render if no subscription data available
    if (!subscription) return null;

    // Dynamic styling based on subscription tier
    const tierColor = isPremium ? 'from-amber-500/20 to-yellow-500/20' : 'from-gray-500/20 to-slate-500/20';
    const borderColor = isPremium ? 'border-amber-400/50' : 'border-gray-400/50';
    const icon = isPremium ? Wind : Lock;

    return (
        <div
            id="pnlRoxysCorner"
            tabIndex={isCollapsible ? 0 : undefined}
            className={`bg-gradient-to-r ${tierColor} rounded-md border ${borderColor} shadow-lg p-0 ${isCollapsible
                    ? 'collapse collapse-plus'
                    : ''
                }`}>

            {/* Checkbox for collapsible functionality */}
            {isCollapsible && (
                <input
                    type="checkbox"
                    checked={!isCollapsed}
                    onChange={onToggle}
                />
            )}

            {/* Header with subscription-aware icon and title */}
            <div className={`flex justify-between items-center mb-0 font-bold text-lg ${isCollapsible
                    ? 'collapse-title'
                    : ''
                }`}>
                <h3 id="pnlIconTitle" className="font-bold text-amber-200 text-lg flex items-center">
                    {React.createElement(icon, { className: "w-5 h-5 mr-2" })} {panalTitle || "Roxy's Corner"}
                </h3>
            </div>

            {/* Content area - displays children or default subscription messaging */}
            <div
                id="pnlRoxysMessage"
                className={`text-gray-300 ${isCollapsible
                        ? 'collapse-content'
                        : ''
                    }`}>
                {children ? (
                    children
                ) : (
                    // Default messaging based on subscription tier
                    isPremium ? (
                        <p>Welcome to Roxy's premium corner! Enjoy exclusive features.</p>
                    ) : (
                        <p>Upgrade to premium to unlock Roxy's special features.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default RoxysCorner;