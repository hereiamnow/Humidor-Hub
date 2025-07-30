// File: PageHeader.jsx
// Path: src/components/UI/PageHeader.jsx
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 28, 2025

// Description:
// Reusable PageHeader component that provides consistent header styling across screens.
// Features an icon, title, and optional subtitle with theme-aware styling.

import React from 'react';

const PageHeader = ({ icon: Icon, title, subtitle, theme, className = "" }) => {
    return (
        <div id="pnlHeader" className={className}>
            <div id="pnlTitle" className="flex items-center mb-1">
                {Icon && <Icon className={`w-8 h-8 mr-3 ${theme.primary}`} />}
                <h1 className={`text-3xl font-bold ${theme.text}`}>{title}</h1>
            </div>
            {subtitle && (
                <p id="pOverview" className={`${theme.subtleText} mb-6`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default PageHeader;