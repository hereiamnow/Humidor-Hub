import React, { createContext, useState, useContext } from 'react';
import { fontOptions } from '../constants/fontOptions';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Application state
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [goveeApiKey, setGoveeApiKey] = useState('');
  const [goveeDevices, setGoveeDevices] = useState([]);

  // Dashboard panel visibility state
  const [dashboardPanelVisibility, setDashboardPanelVisibility] = useState({
    showAchievements: true,
    showAgingWellPanel: true,
    showWrapperPanel: false,
    showStrengthPanel: false,
    showCountryPanel: false,
    showInventoryAnalysis: true,
    showWorldMap: false,
  });

  // Dashboard panel states (open/closed)
  const [dashboardPanelStates, setDashboardPanelStates] = useState({
    roxy: true,
    liveEnvironment: true,
    inventoryAnalysis: true,
    wrapper: true,
    strength: true,
    country: true,
    worldMap: true,
    agingWell: true,
  });

  const value = {
    selectedFont,
    setSelectedFont,
    goveeApiKey,
    setGoveeApiKey,
    goveeDevices,
    setGoveeDevices,
    dashboardPanelVisibility,
    setDashboardPanelVisibility,
    dashboardPanelStates,
    setDashboardPanelStates,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
