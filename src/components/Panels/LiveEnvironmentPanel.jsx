/**
 *
 * @file LiveEnvironmentPanel.jsx
 * @path src/components/Panels/LiveEnvironmentPanel.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 3, 2025
 *
 * Live Environment Panel Component
 *
 * Displays real-time temperature and humidity readings for the user's primary humidor. Features a collapsible panel with gauge visualizations and theme-aware styling for mobile-friendly monitoring.
 *
 * @param {Object} props - Component props
 * @param {Array} props.humidors - Array of humidor objects
 * @param {Object} props.theme - Theme object for styling
 *
 */
import React, { useState } from 'react';
import { ChevronDown, Thermometer, Droplets } from 'lucide-react';
import Gauge from '../UI/Gauge';

const LiveEnvironmentPanel = ({ humidors, theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const firstHumidor = humidors[0];

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-md overflow-hidden">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full p-4 flex justify-between items-center">
                <h3 className={`font-bold ${theme.primary} text-lg flex items-center`}>
                    <Thermometer className={`w-5 h-5 mr-2 ${theme.primary}`} /> Live Environment
                </h3>
                <ChevronDown className={`w-5 h-5 ${theme.primary} transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
            </button>
            {!isCollapsed && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <Gauge value={firstHumidor.humidity || 70} max={100} color="#3b82f6" />
                            <p className="text-sm text-gray-400 mt-2 flex items-center justify-center">
                                <Droplets className="w-4 h-4 mr-1" /> Humidity
                            </p>
                        </div>
                        <div className="text-center">
                            <Gauge value={firstHumidor.temperature || 68} max={100} color="#ef4444" />
                            <p className="text-sm text-gray-400 mt-2 flex items-center justify-center">
                                <Thermometer className="w-4 h-4 mr-1" /> Temperature
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveEnvironmentPanel;