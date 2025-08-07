import React from 'react';

const ChartCard = ({ title, children, action }) => (
    <div className="card card-sm shadow-md rounded-md border bg-base-100 border-base-300 mb-4">
        <div className="card-body">
            <div className="flex justify-between items-center mb-4">
                <h3 className="card-title">{title}</h3>
                {action}
            </div>
            <div className="h-64">
                {children}
            </div>
        </div>
    </div>
);

export default ChartCard;
