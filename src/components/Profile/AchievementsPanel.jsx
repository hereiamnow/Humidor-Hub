/**
 * @file AchievementsPanel.jsx
 * @path src/components/Profile/AchievementsPanel.jsx
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date 2024-06-11
 * 
 * Achievements panel component for displaying user achievements based on their cigar and humidor collection.
 */

import React, { useMemo } from 'react';
import { Box, MapPin, Database, Star, DollarSign } from 'lucide-react';
import CollapsiblePanel from '../UI/CollapsiblePanel';

const AchievementsPanel = ({ cigars, humidors, showTitleIcon = true }) => {
    const totalCigars = cigars.reduce((sum, c) => sum + c.quantity, 0);
    const totalValue = cigars.reduce((acc, cigar) => acc + ((cigar.price || 0) * cigar.quantity), 0);
    const uniqueCountries = useMemo(() => [...new Set(cigars.map(c => c.country).filter(Boolean))], [cigars]);

    const achievementsList = useMemo(() => [
        { id: 'collector_bronze', name: 'Bronze Collector', description: 'Collect 10+ cigars', icon: Box, check: (stats) => stats.totalCigars >= 10 },
        { id: 'collector_silver', name: 'Silver Collector', description: 'Collect 50+ cigars', icon: Box, check: (stats) => stats.totalCigars >= 50 },
        { id: 'collector_gold', name: 'Gold Collector', description: 'Collect 100+ cigars', icon: Box, check: (stats) => stats.totalCigars >= 100 },
        { id: 'globetrotter_bronze', name: 'Globetrotter', description: 'Cigars from 3+ countries', icon: MapPin, check: (stats) => stats.uniqueCountries.length >= 3 },
        { id: 'globetrotter_silver', name: 'World Traveler', description: 'Cigars from 5+ countries', icon: MapPin, check: (stats) => stats.uniqueCountries.length >= 5 },
        { id: 'humidor_enthusiast', name: 'Humidor Enthusiast', description: 'Own 2+ humidors', icon: Database, check: (stats) => stats.humidors.length >= 2 },
        { id: 'aficionado', name: 'Aficionado', description: 'Rate 10+ cigars', icon: Star, check: (stats) => stats.cigars.filter(c => c.userRating > 0).length >= 10 },
        { id: 'high_roller', name: 'High Roller', description: 'Collection value over $500', icon: DollarSign, check: (stats) => stats.totalValue > 500 },
    ], []);

    const earnedAchievements = useMemo(() => {
        const stats = { totalCigars, totalValue, uniqueCountries, humidors, cigars };
        return achievementsList.map(ach => ({ ...ach, earned: ach.check(stats) }));
    }, [cigars, humidors, totalCigars, totalValue, uniqueCountries, achievementsList]);

    const BadgeIcon = ({ achievement }) => (
        <div className="flex flex-col items-center group relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${achievement.earned ? 'bg-amber-500/20 border-amber-400' : 'bg-gray-700/50 border-gray-600 opacity-60'}`}>
                <achievement.icon className={`w-8 h-8 ${achievement.earned ? 'text-amber-400' : 'text-gray-400'}`} />
            </div>
            <p className={`mt-2 text-xs text-center font-semibold ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>{achievement.name}</p>
            <div className="absolute bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {achievement.description}
                {!achievement.earned && <span className="block text-gray-400">(Not earned yet)</span>}
            </div>
        </div>
    );

    return (
        <CollapsiblePanel title="Achievements" icon={showTitleIcon ? Star : null}>
            <div className="grid grid-cols-4 gap-4 mt-4">
                {earnedAchievements.map(ach => (
                    <BadgeIcon key={ach.id} achievement={ach} />
                ))}
            </div>
        </CollapsiblePanel>
    );
};

export default AchievementsPanel;