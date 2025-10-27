import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';

interface AutocompleteInputProps {
  value: string;
  onValueChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onValueChange,
  suggestions,
  placeholder,
  id,
  disabled
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    setInputValue(userInput);
    onValueChange(userInput);

    if (userInput) {
        const filtered = suggestions.filter(
          suggestion =>
            suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
    } else {
        setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onValueChange(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const SuggestionList = () => {
    return (filteredSuggestions.length && showSuggestions && inputValue) ? (
      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
        {filteredSuggestions.map((suggestion, index) => {
          return (
            <li
              key={suggestion + index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : null;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      <SuggestionList />
    </div>
  );
};
