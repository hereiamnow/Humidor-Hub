// File: FontPicker.js
// Path: src/components/Settings/FontPicker.js
// Project: Humidor Hub
// Author: Extracted from App.js
// Date: July 23, 2025

// Description:
// A font selection component that provides a dropdown for choosing font combinations
// and displays a live preview of heading and body text styles. Used in the FontsScreen
// to allow users to customize the app's typography. Features real-time preview updates
// and proper theming integration for consistent styling across the application.

import React from 'react';
import { fontOptions } from '../../../constants/fontOptions';

const FontPicker = ({ selectedFont, setSelectedFont }) => (
    <div id="font-picker" className="form-control w-full mb-4">
        <label className="label">
            <span className="label-text font-bold">Font Style</span>
        </label>
        <select
            value={selectedFont.label}
            onChange={e => {
                const font = fontOptions.find(f => f.label === e.target.value);
                if (font) {
                    setSelectedFont(font);
                }
            }}
            className="select select-bordered w-full"
        >
            {fontOptions.map(font => (
                <option key={font.label} value={font.label}>
                    {font.label}
                </option>
            ))}
        </select>
        <div className="mt-4 p-4 card bg-base-200">
            <h3
                className="text-xl font-bold text-base-content"
                style={{
                    fontFamily: selectedFont.heading,
                }}
            >
                Heading Example
            </h3>
            <p
                className="text-base text-base-content/80"
                style={{
                    fontFamily: selectedFont.body,
                }}
            >
                This is an example of the body text. It will change as you select a different font combination from the dropdown menu above, giving you a live preview.
            </p>
        </div>
    </div>
);

export default FontPicker;