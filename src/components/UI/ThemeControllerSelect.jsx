/**
 * ThemeControllerSelect
 * A reusable dropdown component for selecting a theme.
 * Props:
 * - themes: array of theme names (string[])
 * - selectedTheme: currently selected theme (string)
 * - onChange: callback(theme: string) when selection changes
 */

import React from "react";

const ThemeControllerSelect = ({
    themes = ["default", "retro", "cyberpunk", "valentine", "aqua"],
    selectedTheme,
    onChange
}) => (
    <div className="dropdown mb-4">
        <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
        </div>
        <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
            {themes.map(theme => (
                <li key={theme}>
                    <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                        value={theme}
                        checked={selectedTheme === theme}
                        onChange={() => onChange && onChange(theme)}
                    />
                </li>
            ))}
        </ul>
    </div>
);

export default ThemeControllerSelect;