// File: AlertsScreen.js
// Path: src/screens/AlertsScreen.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 24, 2025
// Time: 3:45 PM CDT

// Description:
// AlertsScreen component provides environmental monitoring alert configuration for humidors in the
// Humidor Hub application. Features include customizable temperature and humidity alert thresholds
// for each humidor, toggle switches to enable/disable alerts, and input fields for setting minimum
// and maximum values. The component displays a personalized interface for each humidor with separate
// controls for humidity alerts (with percentage thresholds) and temperature alerts (with Fahrenheit
// thresholds). When no humidors are present, it shows a helpful "Roxy's Corner" message encouraging
// users to add their first humidor. The interface includes visual feedback with toggle switches
// and organized layout with collapsible alert settings.

import React, { useState } from 'react';
import { Wind, Plus, Bell } from 'lucide-react';
import PageHeader from '../UI/PageHeader';
const AlertsScreen = ({ navigate, humidors }) => {
    // Debug: Log component props on render
    console.log('AlertsScreen: Component rendered with props:', {
        hasNavigate: typeof navigate === 'function',
        humidorsCount: humidors?.length || 0,
    });

    const [alertSettings, setAlertSettings] = useState(
        (humidors || []).map(h => ({ humidorId: h.id, name: h.name, humidityAlert: false, minHumidity: 68, maxHumidity: 72, tempAlert: false, minTemp: 65, maxTemp: 70 }))
    );

    const handleToggle = (humidorId, type) => {
        setAlertSettings(prev => prev.map(s => s.humidorId === humidorId ? { ...s, [type]: !s[type] } : s));
    };

    const handleValueChange = (humidorId, type, value) => {
        setAlertSettings(prev => prev.map(s => s.humidorId === humidorId ? { ...s, [type]: value } : s));
    };

    return (
        <div
            id="pnlContentWrapper_AlertsScreen"
            className="p-4 pb-24">

            <PageHeader
                icon={Bell}
                title="Alerts"
                subtitle="Configure temperature and humidity notifications"
            />

            <div className="space-y-6">
                {humidors && humidors.length > 0 ? (
                    alertSettings.map(setting => (
                        <div key={setting.humidorId} className="card bg-base-200 p-4">
                            <h3 className="card-title text-primary mb-4">{setting.name}</h3>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Humidity Alert</span>
                                        <input type="checkbox" className="toggle toggle-primary" checked={setting.humidityAlert} onChange={() => handleToggle(setting.humidorId, 'humidityAlert')} />
                                    </label>
                                </div>
                                {setting.humidityAlert && (
                                    <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-base-300 ml-2">
                                        <div className="form-control"><label className="label"><span className="label-text">Min:</span></label><div className="input-group"><span>%</span><input type="number" value={setting.minHumidity} onChange={(e) => handleValueChange(setting.humidorId, 'minHumidity', e.target.value)} className="input input-bordered w-full" /></div></div>
                                        <div className="form-control"><label className="label"><span className="label-text">Max:</span></label><div className="input-group"><span>%</span><input type="number" value={setting.maxHumidity} onChange={(e) => handleValueChange(setting.humidorId, 'maxHumidity', e.target.value)} className="input input-bordered w-full" /></div></div>
                                    </div>
                                )}
                                <div className="divider"></div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Temperature Alert</span>
                                        <input type="checkbox" className="toggle toggle-primary" checked={setting.tempAlert} onChange={() => handleToggle(setting.humidorId, 'tempAlert')} />
                                    </label>
                                </div>
                                {setting.tempAlert && (
                                    <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-base-300 ml-2">
                                        <div className="form-control"><label className="label"><span className="label-text">Min:</span></label><div className="input-group"><span>°F</span><input type="number" value={setting.minTemp} onChange={(e) => handleValueChange(setting.humidorId, 'minTemp', e.target.value)} className="input input-bordered w-full" /></div></div>
                                        <div className="form-control"><label className="label"><span className="label-text">Max:</span></label><div className="input-group"><span>°F</span><input type="number" value={setting.maxTemp} onChange={(e) => handleValueChange(setting.humidorId, 'maxTemp', e.target.value)} className="input input-bordered w-full" /></div></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        id="pnlRoxysCorner_NoHumidors"
                        className="card bg-primary/10 border border-primary/20 text-primary-content p-6 text-left">
                        <h3 className="card-title flex items-center justify-left mb-3">
                            <Wind className="w-5 h-5 mr-2" /> Roxy's Corner
                        </h3>
                        <p id="roxyMessage"
                            className="text-sm mb-4">
                            Ruff! You need to add a humidor before you can set up any alerts. Let's get your first one set up!
                        </p>
                        <div className="card-actions">
                            <button
                                onClick={() => navigate('AddHumidor')}
                                className="btn btn-primary w-full"
                            >
                                <Plus className="w-4 h-4" /> Add a Humidor
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsScreen;