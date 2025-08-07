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
 *
 */
import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import Gauge from '../UI/Gauge';

const LiveEnvironmentPanel = ({ humidors }) => {
    const firstHumidor = humidors && humidors.length > 0 ? humidors[0] : null;

    if (!firstHumidor) {
        return (
            <div className="collapse collapse-plus bg-base-100 border-base-300 border">
                <input type="checkbox" />
                <div className="collapse-title font-semibold flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-primary" /> Live Environment
                </div>
                <div className="collapse-content">
                    <p className="text-base-content/70 text-center py-4">No humidor data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div tabIndex={0} className="collapse collapse-plus bg-base-100 border-base-300 border">
            <input type="checkbox" />
            <div className="collapse-title font-semibold flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-primary" /> Live Environment
            </div>
            <div className="collapse-content">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <Gauge value={firstHumidor.humidity || 70} max={100} color="hsl(var(--in))" />
                        <p className="text-sm text-base-content/70 mt-2 flex items-center justify-center">
                            <Droplets className="w-4 h-4 mr-1" /> Humidity
                        </p>
                    </div>
                    <div className="text-center">
                        <Gauge value={firstHumidor.temperature || 68} max={100} color="hsl(var(--er))" />
                        <p className="text-sm text-base-content/70 mt-2 flex items-center justify-center">
                            <Thermometer className="w-4 h-4 mr-1" /> Temperature
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveEnvironmentPanel;