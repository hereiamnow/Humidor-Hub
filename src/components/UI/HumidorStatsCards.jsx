import React from "react";

const HumidorStatsCards = ({ stats = [], className = "" }) => (
    <div
        className={`flex justify-around items-center bg-gray-800/50 p-3 rounded-md mb-6 text-center ${className}`}
        id="pnlStatCards"
    >
        {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="font-bold text-white text-base">{stat.value}</p>
                </div>
                {idx < stats.length - 1 && (
                    <div className="h-10 w-px bg-gray-700"></div>
                )}
            </React.Fragment>
        ))}
    </div>
);

export default HumidorStatsCards;