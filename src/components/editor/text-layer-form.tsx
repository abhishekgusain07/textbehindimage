import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChromePicker } from 'react-color';
import { LockIcon, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors } from '@/constants/colors';
import { ALL_FONTS } from '@/constants/fonts';

export interface TextLayerData {
  id: number;
  text: string;
  fontFamily: string;
  top: number;
  left: number;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  rotation: number;
  shadowColor: string;
  shadowSize: number;
  tiltX: number;
  tiltY: number;
  letterSpacing: number;
}

interface TextLayerFormProps {
  textLayer: TextLayerData;
  onSave: (data: TextLayerData) => void;
  children: (props: {
    control: any;
    formState: any;
    watch: any;
    setValue: any;
  }) => React.ReactNode;
}

const TextLayerForm: React.FC<TextLayerFormProps> = ({
  textLayer,
  onSave,
  children,
}) => {
  const { control, formState, watch, setValue, reset } = useForm<TextLayerData>(
    {
      defaultValues: textLayer,
      mode: 'onChange',
    }
  );

  const watchedValues = watch();
  const [debouncedValues] = useDebounce(watchedValues, 500);

  // Reset form when textLayer prop changes (when switching between text layers)
  useEffect(() => {
    reset(textLayer);
  }, [textLayer.id, reset]);

  // Auto-save with debounce
  useEffect(() => {
    // Don't save on initial mount or if values haven't actually changed
    if (JSON.stringify(debouncedValues) !== JSON.stringify(textLayer)) {
      onSave(debouncedValues);
    }
  }, [debouncedValues, onSave]);

  return (
    <>
      {children({
        control,
        formState,
        watch,
        setValue,
      })}
    </>
  );
};

// Optimized Input Field Component for Text
export const FormInputField: React.FC<{
  name: string;
  label: string;
  control: any;
  placeholder?: string;
}> = React.memo(({ name, label, control, placeholder }) => (
  <div className="flex flex-col items-start space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          id={name}
          type="text"
          placeholder={placeholder || 'Enter text...'}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    />
  </div>
));

FormInputField.displayName = 'FormInputField';

// Optimized Slider Field Component
export const FormSliderField: React.FC<{
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  control: any;
  hasTopPadding?: boolean;
  disabled?: boolean;
  premiumFeature?: boolean;
}> = React.memo(
  ({
    name,
    label,
    min,
    max,
    step,
    control,
    hasTopPadding = false,
    disabled = false,
    premiumFeature = false,
  }) => (
    <div className={`space-y-3 ${hasTopPadding ? 'pt-6' : ''}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={name}
                  className="text-sm font-medium text-gray-700 select-none"
                >
                  {label}
                </Label>
                {premiumFeature && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md">
                    <LockIcon size={10} className="text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">
                      Pro
                    </span>
                  </div>
                )}
              </div>
              <Input
                type="number"
                value={field.value}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (
                    !disabled &&
                    !isNaN(value) &&
                    value >= min &&
                    value <= max
                  ) {
                    field.onChange(value);
                  }
                }}
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
                id={name}
                min={min}
                max={max}
                value={[field.value]}
                step={step}
                onValueChange={(values) => {
                  if (!disabled) {
                    field.onChange(values[0]);
                  }
                }}
                className={`w-full transition-opacity duration-200 ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                } [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 [&_[role=slider]]:hover:scale-110 [&_.relative]:h-2 [&_.relative]:bg-gray-100 [&_.absolute]:bg-gradient-to-r [&_.absolute]:from-blue-500 [&_.absolute]:to-blue-600`}
                aria-label={label}
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>{min}</span>
                <span className="text-blue-600 font-medium">
                  {Math.round(field.value * 100) / 100}
                </span>
                <span>{max}</span>
              </div>
            </div>
          </>
        )}
      />
    </div>
  )
);

FormSliderField.displayName = 'FormSliderField';

// Optimized Color Picker Component
export const FormColorPicker: React.FC<{
  name: string;
  label: string;
  control: any;
}> = React.memo(({ name, label, control }) => (
  <div className="space-y-3">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleColorChange = useCallback(
          (color: any) => {
            field.onChange(color.hex);
          },
          [field]
        );

        const handlePresetColorClick = useCallback(
          (color: string) => {
            field.onChange(color);
          },
          [field]
        );

        return (
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-3 px-4 py-2 h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div
                    style={{ background: field.value }}
                    className="rounded-md h-5 w-5 border border-gray-200 shadow-sm transition-transform duration-200 hover:scale-110"
                  />
                  <span className="font-mono text-sm">{field.value}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[280px] p-4 bg-white border border-gray-200 shadow-xl rounded-xl"
                side="left"
                sideOffset={10}
              >
                <Tabs defaultValue="colorPicker" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100">
                    <TabsTrigger
                      value="colorPicker"
                      className="flex items-center gap-2 font-medium"
                    >
                      🎨 Custom
                    </TabsTrigger>
                    <TabsTrigger
                      value="suggestions"
                      className="flex items-center gap-2 font-medium"
                    >
                      ⚡️ Presets
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="colorPicker" className="mt-0">
                    <div className="flex justify-center">
                      <ChromePicker
                        color={field.value}
                        onChange={handleColorChange}
                        disableAlpha={true}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="suggestions" className="mt-0">
                    <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                      {colors.map((color) => (
                        <div
                          key={color}
                          style={{ background: color }}
                          className={`rounded-lg h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg border-2 ${
                            field.value === color
                              ? 'border-blue-500 scale-110'
                              : 'border-gray-200'
                          }`}
                          onClick={() => handlePresetColorClick(color)}
                          title={color}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }}
    />
  </div>
));

FormColorPicker.displayName = 'FormColorPicker';

// Optimized Font Picker Component
export const FormFontPicker: React.FC<{
  name: string;
  control: any;
  userId: string;
}> = React.memo(({ name, control, userId }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Popover>
        <div className="flex flex-col items-start justify-start my-8">
          <Label>Font Family</Label>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-[200px] justify-between mt-3 p-2',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? field.value : 'Select font family'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        </div>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search fonts..." />
            <CommandList>
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {ALL_FONTS.map((font) => (
                  <CommandItem
                    key={font}
                    value={font}
                    onSelect={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        field.value === font ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span style={{ fontFamily: font }}>{font}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )}
  />
));

FormFontPicker.displayName = 'FormFontPicker';

export default TextLayerForm;
