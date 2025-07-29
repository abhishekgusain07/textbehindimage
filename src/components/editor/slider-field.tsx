import React, { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { LockIcon } from 'lucide-react';

interface SliderFieldProps {
  attribute: string;
  label: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  hasTopPadding?: boolean;
  disabled?: boolean;
  premiumFeature?: boolean;
  handleAttributeChange: (attribute: string, value: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = React.memo(
  ({
    attribute,
    label,
    min,
    max,
    step,
    currentValue,
    hasTopPadding = false,
    disabled = false,
    premiumFeature = false,
    handleAttributeChange,
  }) => {
    const [localValue, setLocalValue] = useState(currentValue);

    // Debounced update for input field
    const debouncedInputUpdate = useCallback(
      (value: number) => {
        const timeoutId = setTimeout(() => {
          if (!disabled && !isNaN(value) && value >= min && value <= max) {
            handleAttributeChange(attribute, value);
          }
        }, 200);
        return () => clearTimeout(timeoutId);
      },
      [attribute, handleAttributeChange, disabled, min, max]
    );

    const handleSliderInputFieldChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const value = parseFloat(event.target.value) || 0;
        setLocalValue(value);
        const cleanup = debouncedInputUpdate(value);
        return cleanup;
      },
      [disabled, debouncedInputUpdate]
    );

    // Immediate update for slider (no debounce needed)
    const handleSliderChange = useCallback(
      (values: number[]) => {
        if (!disabled) {
          const value = values[0];
          setLocalValue(value);
          handleAttributeChange(attribute, value);
        }
      },
      [attribute, handleAttributeChange, disabled]
    );

    // Sync with external changes
    useEffect(() => {
      setLocalValue(currentValue);
    }, [currentValue]);

    return (
      <div className={`space-y-3 ${hasTopPadding ? 'pt-6' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label
              htmlFor={attribute}
              className="text-sm font-medium text-gray-700 select-none"
            >
              {label}
            </Label>
            {premiumFeature && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md">
                <LockIcon size={10} className="text-amber-600" />
                <span className="text-xs font-medium text-amber-700">Pro</span>
              </div>
            )}
          </div>
          <Input
            type="number"
            value={localValue}
            onChange={handleSliderInputFieldChange}
            className={`w-16 h-8 rounded-lg border text-center text-sm font-medium transition-all duration-200 ${
              disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white'
            }`}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        </div>
        <div className="relative">
          <Slider
            id={attribute}
            min={min}
            max={max}
            value={[localValue]}
            step={step}
            onValueChange={handleSliderChange}
            className={`w-full transition-opacity duration-200 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 [&_[role=slider]]:hover:scale-110 [&_.relative]:h-2 [&_.relative]:bg-gray-100 [&_.absolute]:bg-gradient-to-r [&_.absolute]:from-blue-500 [&_.absolute]:to-blue-600`}
            aria-label={label}
            disabled={disabled}
          />
          {/* Value indicator */}
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
            <span>{min}</span>
            <span className="text-blue-600 font-medium">
              {Math.round(localValue * 100) / 100}
            </span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    );
  }
);

export default SliderField;
