import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function AutocompleteInput({ options, value, onChange, placeholder, getOptionLabel = o => o.label, getOptionValue = o => o.code }) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    // Set inputValue to label if value is a code
    useEffect(() => {
        const selected = options.find(opt => getOptionValue(opt) === value);
        if (selected) {
            setInputValue(getOptionLabel(selected));
        } else {
            setInputValue(value || '');
        }
    }, [value, options, getOptionLabel, getOptionValue]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (inputValue) {
            const filtered = options.filter(option =>
                getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [inputValue, options, getOptionLabel]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowSuggestions(true);
        setHighlightedIndex(-1);
    };

    const handleOptionClick = (option) => {
        setInputValue(getOptionLabel(option));
        onChange(getOptionValue(option));
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;
        if (e.key === 'ArrowDown') {
            setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        } else if (e.key === 'ArrowUp') {
            setHighlightedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                const option = filteredOptions[highlightedIndex];
                setInputValue(getOptionLabel(option));
                onChange(getOptionValue(option));
                setShowSuggestions(false);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
            />
            {showSuggestions && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {filteredOptions.map((option, idx) => (
                        <li
                            key={getOptionValue(option)}
                            onClick={() => handleOptionClick(option)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`px-2 py-1 cursor-pointer ${highlightedIndex === idx ? 'bg-amber-100' : ''}`}
                        >
                            {getOptionLabel(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

AutocompleteInput.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    getOptionLabel: PropTypes.func,
    getOptionValue: PropTypes.func,
};

export default AutocompleteInput;
