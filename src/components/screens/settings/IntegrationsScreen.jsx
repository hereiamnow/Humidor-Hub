// File: IntegrationsScreen.js
// Path: src/screens/IntegrationsScreen.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 24, 2025
// Time: 3:15 PM CDT

// Description:
// IntegrationsScreen component provides third-party service integration management for the Humidor Hub application.
// Currently focuses on Govee API integration for automatic temperature and humidity data synchronization from
// Govee smart sensors. Features include API key management, connection testing, device discovery, and status
// monitoring. The component handles authentication with the Govee service, validates API keys, fetches available
// devices, and provides user feedback on connection status. It includes error handling for failed connections
// and displays connected device information when successfully integrated.

import React, { useState } from 'react';
import { ChevronLeft, LoaderCircle, Zap } from 'lucide-react';

// Import services
import { fetchGoveeDevices } from '../../../services/goveeService';

const IntegrationsScreen = ({ navigate, goveeApiKey, setGoveeApiKey, goveeDevices, setGoveeDevices }) => {
    const [key, setKey] = useState(goveeApiKey || '');
    const [status, setStatus] = useState(goveeApiKey ? 'Connected' : 'Not Connected');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleConnectGovee = async () => {
        setIsLoading(true);
        setMessage('');
        setGoveeDevices([]);

        if (!key) {
            setMessage('Please enter a Govee API Key.');
            setIsLoading(false);
            return;
        }

        try {
            const devices = await fetchGoveeDevices(key);
            if (devices.length > 0) {
                setGoveeApiKey(key);
                setGoveeDevices(devices);
                setStatus('Connected');
                setMessage(`Successfully connected! Found ${devices.length} Govee device(s).`);
            } else {
                setGoveeApiKey('');
                setGoveeDevices([]);
                setStatus('Not Connected');
                setMessage('No Govee devices found with this API key. Please check your key and ensure devices are online.');
            }
        } catch (error) {
            console.error("Error connecting to Govee:", error);
            setGoveeApiKey('');
            setGoveeDevices([]);
            setStatus('Not Connected');
            setMessage(`Failed to connect to Govee: ${error.message}.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="pnlContainerWrapper" className="p-4 pb-24 min-h-screen">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('Settings')} className="btn btn-ghost btn-square -ml-2 mr-2">
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <h1 className="text-3xl font-bold text-base-content">Integrations</h1>
            </div>
            <div className="space-y-6">
                <div className="card bg-base-200 p-4">
                    <h3 className="font-bold text-xl text-primary mb-2">Govee</h3>
                    <p className="text-base-content/70 text-sm mb-4">Connect your Govee account to automatically sync temperature and humidity data.</p>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Govee API Key</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your Govee API Key"
                            value={key}
                            onChange={(e) => { setKey(e.target.value); setStatus('Not Connected'); setMessage(''); }}
                            className="input input-bordered w-full"
                        />
                        <label className="label">
                            <span className="label-text-alt">Get this from the Govee Home app under "About Us &gt; Apply for API Key".</span>
                        </label>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className={`text-sm font-bold ${status === 'Connected' ? 'text-success' : 'text-error'}`}>Status: {isLoading ? 'Connecting...' : status}</span>
                        <button onClick={handleConnectGovee} disabled={isLoading} className="btn btn-primary btn-sm">
                            {isLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {isLoading ? 'Connecting...' : 'Connect'}
                        </button>
                    </div>
                    {message && (<p className={`mt-3 text-sm ${status === 'Connected' ? 'text-success' : 'text-error'}`}>{message}</p>)}
                    {goveeDevices.length > 0 && (
                        <div className="mt-4 p-3 bg-base-300 rounded-box">
                            <p className="text-sm text-base-content font-semibold mb-2">Found Devices:</p>
                            <ul className="list-disc list-inside text-base-content/80 text-xs">{goveeDevices.map(d => (<li key={d.device}>{d.deviceName} ({d.model})</li>))}</ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IntegrationsScreen;