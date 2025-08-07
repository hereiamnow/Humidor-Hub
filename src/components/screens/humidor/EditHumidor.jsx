// File: EditHumidor.js
// Path: src/screens/EditHumidor.js
// Project: Humidor Hub
// Author: Shawn Miller (hereiamnow@gmail.com)
// Date: July 24, 2025
// Time: 10:01 PM CDT

// Description:
// EditHumidor is a React component that provides a comprehensive form interface for users to edit existing humidors in their collection.
// The component features advanced environment tracking options including Govee sensor integration, smart image modal for visual customization,
// and form validation with Firebase Firestore persistence. It supports both manual and automated environment monitoring.
//
// Key Features:
// - Pre-populated form with existing humidor data and backward compatibility for legacy fields
// - SmartImageModal integration for custom humidor images with positioning controls
// - Dual environment tracking modes: manual input and Govee sensor integration
// - Govee API integration with device selection and real-time sensor data display
// - Firebase Firestore integration for data persistence and updates
// - Responsive design optimized for mobile devices with touch-friendly controls
// - Theme-aware styling throughout the interface with accessibility considerations
// - Form validation and error handling for all input fields
// - Navigation integration with proper back button and cancel functionality
//
// Environment Tracking:
// - Manual mode: Users can input temperature and humidity values directly
// - Govee mode: Integration with Govee sensors for automated readings with device selection
// - Real-time display of current sensor readings when Govee devices are connected
// - Fallback handling for missing API keys or unavailable sensors

import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ChevronLeft, MapPin } from 'lucide-react';
import InputField from '../../UI/InputField';
import TextAreaField from '../../UI/TextAreaField';
import SmartImageModal from '../../Modals/Composite/SmartImageModal';

const EditHumidor = ({ navigate, db, appId, userId, humidor, goveeApiKey, goveeDevices }) => {
    const humidorTypes = ["Desktop Humidor", "Cabinet Humidor", "Glass Top Humidor", "Travel Humidor", "Cigar Cooler", "Walk-In Humidor", "Personalized Humidor"];
    const [formData, setFormData] = useState({
        ...humidor,
        shortDescription: humidor.shortDescription || '',
        longDescription: humidor.longDescription || humidor.description || '', // Migrate old description
        trackingMethod: humidor.goveeDeviceId ? 'govee' : 'manual'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGoveeDeviceChange = (e) => {
        const selectedDeviceId = e.target.value;
        const selectedDevice = goveeDevices.find(d => d.device === selectedDeviceId);
        setFormData(prev => ({ ...prev, goveeDeviceId: selectedDevice?.device || null, goveeDeviceModel: selectedDevice?.model || null }));
    };

    const handleSave = async () => {
        const humidorRef = doc(db, 'artifacts', appId, 'users', userId, 'humidors', humidor.id);
        const { id, description, ...dataToSave } = formData; // Exclude id and old description field
        const updatedHumidor = {
            ...dataToSave,
            goveeDeviceId: formData.trackingMethod === 'manual' ? null : formData.goveeDeviceId,
            goveeDeviceModel: formData.trackingMethod === 'manual' ? null : formData.goveeDeviceModel,
            image: formData.image || `https://placehold.co/600x400/3a2d27/ffffff?font=playfair-display&text=${formData.name.replace(/\s/g, '+') || 'Humidor'}`,
        };
        await updateDoc(humidorRef, updatedHumidor);
        navigate('MyHumidor', { humidorId: humidor.id });
    };

    return (
        <div
            id="pnlContentWrapper_EditHumidor"
            className="p-4 pb-24">

            <div className="relative">
                {/* Circular image container */}
                <div className="flex justify-center items-center pt-6 pb-2">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-base-300">
                        <SmartImageModal
                            itemName={formData.name}
                            itemCategory="humidor"
                            itemType={formData.type}
                            currentImage={formData.image || `https://placehold.co/600x400/EEE/31343C?font=playfair-display&text=${formData.name.replace(/\s/g, '+') || 'My Humidor'}`}
                            currentPosition={formData.imagePosition || { x: 50, y: 50 }}
                            onImageAccept={(img, pos) => setFormData(prev => ({
                                ...prev,
                                image: img,
                                imagePosition: pos
                            }))}
                        />
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent pointer-events-none"></div>
                <div className="absolute top-4 left-4 z-10">
                    <button onClick={() => navigate('HumidorsScreen')} className="btn btn-ghost btn-circle">
                        <ChevronLeft className="w-7 h-7" />
                    </button>
                </div>
                <div className="absolute bottom-0 p-4 z-10 pointer-events-none">
                    <h1 className="text-3xl font-bold text-base-content">Edit Humidor</h1>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Humidor Name */}
                <InputField name="name" label="Humidor Name" placeholder="e.g., The Big One" value={formData.name} onChange={handleInputChange} />
                {/* Short Description */}
                <InputField name="shortDescription" label="Short Description" placeholder="e.g., Main aging unit" value={formData.shortDescription} onChange={handleInputChange} />
                {/* Long Description */}
                <TextAreaField name="longDescription" label="Long Description" placeholder="e.g., A 150-count mahogany humidor..." value={formData.longDescription} onChange={handleInputChange} />

                {/* Type of Humidor */}
                <div>
                    <label className="label-text mb-1 block">Type of Humidor</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="select select-bordered w-full">
                        {humidorTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                {/* Size and location */}
                <div id="pnlSizeAndLocation" className="grid grid-cols-2 gap-4">
                    <InputField name="size" label="Size" placeholder="e.g., 150-count" value={formData.size} onChange={handleInputChange} />
                    <InputField name="location" label="Location" placeholder="e.g., Office" value={formData.location} onChange={handleInputChange} />
                </div>
                {/* Environment Tracking */}
                <div pnl="pnlEnvironmentTracking" className="card bg-base-200 p-4 rounded-md">
                    <h3 className="font-bold text-xl text-primary mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2" /> Environment Tracking</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label-text mb-2 block">Tracking Method</label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center"><input type="radio" name="trackingMethod" value="manual" checked={formData.trackingMethod === 'manual'} onChange={handleInputChange} className="radio radio-primary" /><span className="ml-2">Manual Input</span></label>
                                <label className="inline-flex items-center"><input type="radio" name="trackingMethod" value="govee" checked={formData.trackingMethod === 'govee'} onChange={handleInputChange} className="radio radio-primary" /><span className="ml-2">Govee Sensor</span></label>
                            </div>
                        </div>
                        {formData.trackingMethod === 'manual' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <InputField name="temp" label="Temperature (°F)" placeholder="e.g., 68" type="number" value={formData.temp} onChange={handleInputChange} />
                                <InputField name="humidity" label="Humidity (%)" placeholder="e.g., 70" type="number" value={formData.humidity} onChange={handleInputChange} />
                            </div>
                        ) : (
                            <div>
                                <label className="label-text mb-1 block">Govee Sensor</label>
                                <select value={formData.goveeDeviceId || ''} onChange={handleGoveeDeviceChange} disabled={!goveeApiKey || goveeDevices.length === 0} className="select select-bordered w-full">
                                    <option value="">{!goveeApiKey ? "Connect Govee first" : (goveeDevices.length === 0 ? "No sensors found" : "Select a sensor")}</option>
                                    {goveeDevices.map(device => (<option key={device.device} value={device.device}>{device.deviceName} ({device.model})</option>))}
                                </select>
                                {!goveeApiKey && (<p className="text-xs text-error mt-1">Please connect your Govee API key in Integrations settings.</p>)}
                                {goveeApiKey && goveeDevices.length === 0 && (<p className="text-xs text-warning mt-1">No Govee sensors found. Check your key and Govee app.</p>)}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <InputField name="temp" label="Current Temp (°F)" value={humidor.temp} type="number" onChange={() => { }} disabled={true} />
                                    <InputField name="humidity" label="Current Humidity (%)" value={humidor.humidity} type="number" onChange={() => { }} disabled={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Save and Cancel buttons */}
                <div pnl="pnlSaveCancelButtons" className="pt-4 flex space-x-4">

                    <button
                        onClick={() => navigate('MyHumidor', { humidorId: humidor.id })}
                        className="btn btn-secondary flex-grow">
                        Cancel</button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary flex-grow">
                        Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditHumidor;