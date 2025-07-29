import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChromePicker } from 'react-color';
import { colors } from '@/constants/colors';

interface ColorPickerProps {
  attribute: string;
  label: string;
  currentColor: string;
  handleAttributeChange: (attribute: string, value: any) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = React.memo(
  ({ attribute, label, currentColor, handleAttributeChange }) => {
    const handleColorChange = useCallback(
      (color: any) => {
        handleAttributeChange(attribute, color.hex);
      },
      [attribute, handleAttributeChange]
    );

    const handlePresetColorClick = useCallback(
      (color: string) => {
        handleAttributeChange(attribute, color);
      },
      [attribute, handleAttributeChange]
    );

    return (
      <div className="space-y-3">
        <Label
          htmlFor={attribute}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </Label>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-3 px-4 py-2 h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div
                  style={{ background: currentColor }}
                  className="rounded-md h-5 w-5 border border-gray-200 shadow-sm transition-transform duration-200 hover:scale-110"
                />
                <span className="font-mono text-sm">{currentColor}</span>
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
                      color={currentColor}
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
                          currentColor === color
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
      </div>
    );
  }
);

export default ColorPicker;
