// File: CollapsiblePanel.js
// Path: src/components/UI/CollapsiblePanel.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 23, 2025

// Description:
// A reusable UI component that creates an expandable/collapsible content section.
// Features a clickable header with optional icon, smooth chevron animation, and
// conditional content rendering. Used throughout the app for organizing dashboard
// panels and data management sections while reducing visual clutter.

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CollapsiblePanel = ({ title, description, children, icon: Icon }) => {
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

    return (
        <div tabIndex={0} className="collapse collapse-plus border bg-neutral border-base-300 rounded-md shadow-sm mb-4">
            <input type="checkbox" className="peer" checked={!isPanelCollapsed} onChange={() => setIsPanelCollapsed(!isPanelCollapsed)} />

            <div className="collapse-title font-semibold flex justify-start items-center">
                {Icon && <Icon className="w-5 h-5 mr-2" />} {title}
            </div>



            <div className="collapse-content text-sm">
                <p className="text-gray-400 text-sm">{description}</p>
                {children}
            </div>

        </div>
    );
};

export default CollapsiblePanel;