// File: PageHeader.jsx
// Path: src/components/UI/PageHeader.jsx
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 28, 2025

// Description:
// Reusable PageHeader component that provides consistent header styling across screens.
// Features an icon, title, and optional subtitle with theme-aware styling.
/**
 * PageHeader
 * A reusable header component for pages.
 * Props:
 * - icon: React component for the header icon
 * - title: string for the main title
 * - subtitle: optional string for a subtitle
 * - className: additional CSS classes for styling
 */
import React from 'react';
import ThemeControllerSelect from './ThemeControllerSelect';

const PageHeader = ({ icon: Icon, title, subtitle, className = "" }) => {
    return (
        <div id="pnlHeader" className={className}>
            <div id="pnlTitle" className="flex items-center mb-1">
                {Icon && <Icon className="w-8 h-8 mr-3 text-primary" />}
                <h1 className="text-3xl font-bold text-base-content">{title}</h1>
                {subtitle && (
                    <p id="pOverview" className="text-base-content/70 mb-6">
                        {subtitle}
                    </p>
                )}
            </div>


            <div id="pnlActions" className="flex">
                {/* Action buttons can be added here */}
                <ThemeControllerSelect
                    selectedTheme="default"
                    onChange={(theme) => console.log(`Selected theme: ${theme}`)}
                />
            </div>
        </div>
    );
};

export default PageHeader;