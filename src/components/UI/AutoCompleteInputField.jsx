import React, { useState } from 'react';

const AutoCompleteInputField = ({ name, label, placeholder, value, onChange, suggestions,  className = '', inputRef }) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(e);

        if (inputValue.length > 0) {
            const filtered = suggestions.filter(
                (suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onChange({ target: { name, value: suggestion } });
        setShowSuggestions(false);
        setFilteredSuggestions([]);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 100);
    };

    return (
        <div className="relative">
            <label className={`text-sm font-medium text-gray-400 mb-1 block`}>{label}</label>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={value || ''}
                onChange={handleInputChange}
                onFocus={() => {
                    if (value && value.length > 0) {
                        const filtered = suggestions.filter(
                            (suggestion) => suggestion.toLowerCase().includes(value.toLowerCase())
                        );
                        setFilteredSuggestions(filtered);
                        setShowSuggestions(true);
                    }
                }}
                onBlur={handleBlur}
                ref={inputRef}
                className={`input w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 keeper-ignore ${className}`}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className={`absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg`}>
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(suggestion);
                            }}
                            className={`px-3 py-2 cursor-pointer text-white hover:bg-gray-700`}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutoCompleteInputField;
