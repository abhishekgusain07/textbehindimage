import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InputFieldProps {
  attribute: string;
  label: string;
  currentValue: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({ attribute, label, currentValue, handleAttributeChange }) => {
    const [localValue, setLocalValue] = useState(currentValue);

    // Debounced update function
    const debouncedUpdate = useCallback(
      (value: string) => {
        const timeoutId = setTimeout(() => {
          handleAttributeChange(attribute, value);
        }, 300);
        return () => clearTimeout(timeoutId);
      },
      [attribute, handleAttributeChange]
    );

    // Update local value immediately for responsive UI
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLocalValue(value);
        const cleanup = debouncedUpdate(value);
        return cleanup;
      },
      [debouncedUpdate]
    );

    // Sync with external changes
    useEffect(() => {
      setLocalValue(currentValue);
    }, [currentValue]);

    return (
      <div className="flex flex-col items-start space-y-2">
        <Label
          htmlFor={attribute}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </Label>
        <Input
          id={attribute}
          type="text"
          placeholder="Enter text..."
          value={localValue}
          onChange={handleInputChange}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  }
);

export default InputField;
