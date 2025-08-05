import React from 'react';

const ChartCard = ({ title, children, action }) => (
    <div className="card w-96 bg-base-100 card-sm shadow-sm">
        <div className="card-body">
            <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">{title}</h2>
                {action}
            </div>
            <div className="h-64">
                {children}
            </div>
        </div>
    </div>
);

export default ChartCard;
