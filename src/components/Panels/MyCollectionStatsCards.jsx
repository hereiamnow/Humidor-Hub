/**
 *
 * @file MyCollectionStatsCards.jsx
 * @path src/components/Panels/MyCollectionStatsCards.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 3, 2025
 *
 * My Collection Stats Cards Component
 *
 * Displays summary statistic cards for the user's cigar collection, including total cigars, total value, and number of humidors. Uses themed icons and responsive grid layout for quick at-a-glance stats.
 *
 * @param {Object} props - Component props
 * @param {number} props.totalCigars - Total number of cigars
 * @param {number} props.totalValue - Total value of the collection
 * @param {Array} props.humidors - Array of humidor objects
 * @param {Object} props.theme - Theme object for styling
 *
 */
import React from 'react';
import StatCard from '../UI/StatCard';
import { Cigarette, DollarSign, Box } from 'lucide-react';

const MyCollectionStatsCards = ({ totalCigars, totalValue, humidors, theme }) => {
    return (
        <div id="my-collection-stats" className="grid grid-cols-3 sm:grid-cols-3 gap-2 mb-6">
            <StatCard icon={Cigarette} value={totalCigars} label="Cigars" theme={theme} />
            <StatCard icon={DollarSign} value={`$${totalValue.toFixed(0)}`} label="Value" theme={theme} />
            <StatCard icon={Box} value={humidors.length} label="Humidors" theme={theme} />
        </div>
    );
};

export default MyCollectionStatsCards;