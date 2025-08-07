/**
 * Interactive World Map Component
 * 
 * Displays a zoomable, interactive world map that visualizes cigar inventory by country.
 * Countries are color-coded based on whether they have cigars in the collection,
 * are known cigar-producing regions, or neither. Users can click on countries
 * with cigars to filter their collection by origin.
 * 
 * @file InteractiveWorldMap.jsx
 * @path src/components/Drawers/InteractiveWorldMap.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 21, 2025
 */

import React, { useState, useMemo } from 'react';
import { ChevronDown, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

/** 
 * Countries known for producing premium cigars.
 * Used to highlight cigar-producing regions even when no cigars are in inventory.
 */
const cigarCountries = [
    "United States",
    "Mexico",
    "Cuba",
    "Dominican Republic",
    "Honduras",
    "Nicaragua"
];

/** World map topology data source - provides country boundaries and names */
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Interactive World Map Component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.cigars - Array of cigar objects with country and quantity properties
 * @param {Function} props.navigate - Navigation function to route to other screens
 * @param {boolean} props.isCollapsed - Whether the drawer is collapsed
 * @param {Function} props.onToggle - Function to toggle drawer collapse state
 * @returns {JSX.Element} Interactive world map component
 */
const InteractiveWorldMap = ({ cigars, navigate, isCollapsed, onToggle }) => {

    const [isInteractiveWorldMapCollapsed, setIsInteractiveWorldMapCollapsed] = useState(true);

    /** 
     * Memoized calculation of cigar quantities by country.
     * Creates a map of country names to total cigar counts for visualization.
     */
    const countryCounts = useMemo(() => {
        return cigars.reduce((acc, cigar) => {
            const country = cigar.country || 'Unknown';
            if (country !== 'Unknown') {
                acc[country] = (acc[country] || 0) + cigar.quantity;
            }
            return acc;
        }, {});
    }, [cigars]);

    /** 
     * Determines the country with the highest cigar count to center the map initially.
     * Defaults to United States if no cigars are found.
     */
    const topCountry = useMemo(() => {
        let max = 0, top = "United States";
        Object.entries(countryCounts).forEach(([country, count]) => {
            if (count > max) {
                max = count;
                top = country;
            }
        });
        return top;
    }, [countryCounts]);

    /** 
     * Geographic coordinates [longitude, latitude] for centering the map on specific countries.
     * Used to focus the initial view on the country with the most cigars.
     */
    const countryCenters = {
        "United States": [-98, 39],
        "Mexico": [-102, 23],
        "Cuba": [-79, 21],
        "Dominican Republic": [-70.7, 19],
        "Honduras": [-86.5, 15],
        "Nicaragua": [-85, 12],
        // Add more coordinates as needed for additional countries
    };

    /** Initial map center based on top country, fallback to USA */
    const initialCenter = countryCenters[topCountry] || [-98, 39];
    /** Maximum zoom level for detailed country view */
    const initialZoom = 8;

    // Map interaction state
    /** Current zoom level (1-8 scale) */
    const [zoom, setZoom] = useState(initialZoom);
    /** Current map center coordinates [lng, lat] */
    const [center, setCenter] = useState(initialCenter);
    /** Tooltip state for country hover information */
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
    /** Whether to show the usage instructions overlay */
    const [showInstructions, setShowInstructions] = useState(true);

    /** Increases zoom level by 0.5, capped at maximum of 8 */
    const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 8));

    /** Decreases zoom level by 0.5, capped at minimum of 1 */
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 1));

    /** Resets map to initial zoom and center position */
    const handleReset = () => {
        setZoom(initialZoom);
        setCenter(initialCenter);
    };

    /**
     * Handles map pan/drag end events from react-simple-maps.
     * Validates position data before updating center state to prevent errors.
     * 
     * @param {Array|Object} position - New center position from ZoomableGroup
     */
    const handleMoveEnd = (position) => {
        // Validate position is a coordinate array [lng, lat]
        if (Array.isArray(position) && position.length === 2 && typeof position[0] === "number" && typeof position[1] === "number") {
            setCenter(position);
        } else if (position && typeof position === "object" && "coordinates" in position && Array.isArray(position.coordinates)) {
            // Handle alternative position object format
            setCenter(position.coordinates);
        } else {
            // Invalid position format - log warning but don't crash
            console.warn("Invalid center position from ZoomableGroup:", position);
        }
    };

    return (
        <div id="pnlBrowseWorldMap" tabIndex={0} className="collapse collapse-plus border bg-neutral border-base-300 rounded-md shadow-sm mb-4">
            <input type="checkbox" className="peer" checked={!isInteractiveWorldMapCollapsed} onChange={() => setIsInteractiveWorldMapCollapsed(!isInteractiveWorldMapCollapsed)} />

            <div className="collapse-title font-semibold">
                World Map
            </div>



            <div className="collapse-content text-sm">
                <div className="w-full" style={{ minHeight: 300, position: "relative" }}>
                    {/* Dismissible instructions overlay for first-time users */}
                    {showInstructions && (
                        <div className="absolute top-1 left-1 right-1 z-20">
                            <div className="alert shadow-lg">
                                <p className="text-sm flex-1">
                                    Tap on a highlighted country to filter your collection by its origin.
                                </p>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="btn btn-ghost btn-sm btn-circle"
                                    title="Close instructions"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Country information tooltip - appears on hover */}
                    {tooltip.show && (
                        <div
                            className="absolute z-20 card bg-base-200 rounded-lg px-3 py-2 text-sm shadow-lg pointer-events-none"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: 'translate(-50%, -100%)', // Center horizontally, position above cursor
                                marginTop: '-8px'
                            }}
                        >
                            {tooltip.content}
                        </div>
                    )}
                    {/* Map control panel - positioned in bottom right corner */}
                    <div
                        className="absolute bottom-2 right-2 flex items-center gap-2 z-10"
                        style={{ pointerEvents: "auto" }} // Ensure controls are clickable over map
                    >
                        {/* Current zoom level display */}
                        <div className="badge badge-lg badge-neutral text-sm font-medium shadow-lg">
                            {zoom.toFixed(1)}x
                        </div>
                        {/* Zoom out button */}
                        <button
                            onClick={handleZoomOut}
                            className="btn btn-primary btn-circle shadow-lg"
                            title="Zoom Out"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        {/* Zoom in button */}
                        <button
                            onClick={handleZoomIn}
                            className="btn btn-primary btn-circle shadow-lg"
                            title="Zoom In"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        {/* Reset to initial view button */}
                        <button
                            onClick={handleReset}
                            className="btn btn-primary btn-circle shadow-lg"
                            title="Reset Map"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Main map component with responsive sizing */}
                    <ComposableMap
                        width={1000}
                        height={350}
                        style={{ width: "100%", height: "350px" }}
                    >
                        {/* Zoomable and pannable map container */}
                        <ZoomableGroup
                            center={center}
                            zoom={zoom}
                            onMoveEnd={handleMoveEnd}
                            minZoom={5} // Minimum zoom to keep map readable
                            maxZoom={8} // Maximum zoom for country detail
                        >
                            {/* Country geography data and rendering */}
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map(geo => {
                                        const countryName = geo.properties.name;
                                        const isCigarCountry = cigarCountries.includes(countryName);
                                        const hasCigars = countryCounts[countryName] > 0;

                                        // Define fill colors using DaisyUI CSS variables
                                        const highlightedFill = 'hsl(var(--wa))'; // warning color
                                        const cigarCountryFill = 'hsl(var(--wa) / 0.4)'; // warning color with alpha
                                        const otherFill = 'hsl(var(--b2))'; // base-200
                                        const hoverFill = 'hsl(var(--p))'; // primary
                                        const borderStroke = 'hsl(var(--b3))'; // base-300

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                // Navigate to filtered view only for countries with cigars
                                                onClick={() => hasCigars && navigate('HumidorsScreen', { preFilterCountry: countryName })}
                                                // Show tooltip on hover for relevant countries
                                                onMouseEnter={(evt) => {
                                                    const cigarCount = countryCounts[countryName] || 0;
                                                    if (cigarCount > 0 || isCigarCountry) {
                                                        // Calculate tooltip position relative to map container
                                                        const containerRect = evt.target.closest('.w-full').getBoundingClientRect();
                                                        setTooltip({
                                                            show: true,
                                                            content: cigarCount > 0
                                                                ? `${countryName}: ${cigarCount} cigar${cigarCount !== 1 ? 's' : ''}`
                                                                : `${countryName}: Cigar producing country`,
                                                            x: evt.clientX - containerRect.left,
                                                            y: evt.clientY - containerRect.top
                                                        });
                                                    }
                                                }}
                                                onMouseLeave={() => setTooltip({ show: false, content: '', x: 0, y: 0 })}
                                                style={{
                                                    default: {
                                                        // Color coding: highlighted > cigar country > other
                                                        fill: hasCigars
                                                            ? highlightedFill
                                                            : isCigarCountry
                                                                ? cigarCountryFill
                                                                : otherFill,
                                                        outline: "none",
                                                        cursor: hasCigars ? "pointer" : "default",
                                                        stroke: borderStroke,
                                                        strokeWidth: 0.5
                                                    },
                                                    hover: {
                                                        // Only highlight countries with cigars on hover
                                                        fill: hasCigars
                                                            ? hoverFill
                                                            : isCigarCountry
                                                                ? cigarCountryFill
                                                                : otherFill,
                                                        outline: "none",
                                                        cursor: hasCigars ? "pointer" : "default"
                                                    },
                                                    pressed: {
                                                        fill: hoverFill,
                                                        outline: "none"
                                                    }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            </div>
        </div>
    );
};

export default InteractiveWorldMap;