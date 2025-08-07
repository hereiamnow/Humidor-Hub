import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantityControl = ({ quantity, onChange }) => (
    <div className="flex items-center gap-4">
        <button
            type="button"
            onClick={() => onChange(quantity - 1)}
            className="btn btn-primary btn-circle btn-lg"
            disabled={quantity <= 0}
        >
            <Minus className="w-6 h-6" />
        </button>
        <span className={`text-5xl ${quantity === 0 ? 'text-error' : 'text-base-content'} font-bold w-16 text-center`}>{quantity}</span>
        <button
            type="button"
            onClick={() => onChange(quantity + 1)}
            className="btn btn-primary btn-circle btn-lg"
        >
            <Plus className="w-6 h-6" />
        </button>
    </div>
);

export default QuantityControl;
