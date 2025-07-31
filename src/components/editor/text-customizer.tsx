import React, { useState } from 'react';
import TextLayerForm, {
  FormInputField,
  FormSliderField,
  FormColorPicker,
  FormFontPicker,
  TextLayerData,
} from './text-layer-form';
import { Button } from '@/components/ui/button';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Move,
  Type,
  Bold,
  RotateCw,
  Palette,
  LightbulbIcon,
  CaseSensitive,
  TypeOutline,
  ArrowLeftRight,
  ArrowUpDown,
  AlignHorizontalSpaceAround,
  Copy,
  Trash2,
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TextCustomizerProps {
  textSet: TextLayerData;
  handleAttributeChange: (id: number, attribute: string, value: any) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (textSet: any) => void;
  userId: string;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({
  textSet,
  handleAttributeChange,
  removeTextSet,
  duplicateTextSet,
  userId,
}) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const handleFormSave = (data: TextLayerData) => {
    // Update all changed attributes
    Object.keys(data).forEach((key) => {
      if (
        key !== 'id' &&
        data[key as keyof TextLayerData] !== textSet[key as keyof TextLayerData]
      ) {
        handleAttributeChange(
          textSet.id,
          key,
          data[key as keyof TextLayerData]
        );
      }
    });
  };

  const controls = [
    { id: 'text', icon: <CaseSensitive size={20} />, label: 'Text' },
    { id: 'fontFamily', icon: <Type size={20} />, label: 'Font' },
    { id: 'color', icon: <Palette size={20} />, label: 'Color' },
    { id: 'position', icon: <Move size={20} />, label: 'Position' },
    { id: 'fontSize', icon: <Type size={20} />, label: 'Size' },
    { id: 'fontWeight', icon: <Bold size={20} />, label: 'Weight' },
    {
      id: 'letterSpacing',
      icon: <AlignHorizontalSpaceAround size={20} />,
      label: 'Letter spacing',
    },
    { id: 'opacity', icon: <LightbulbIcon size={20} />, label: 'Opacity' },
    { id: 'rotation', icon: <RotateCw size={20} />, label: 'Rotate' },
    {
      id: 'tiltX',
      icon: <ArrowLeftRight size={20} />,
      label: 'Tilt X (3D effect)',
    },
    {
      id: 'tiltY',
      icon: <ArrowUpDown size={20} />,
      label: 'Tilt Y (3D effect)',
    },
  ];

  return (
    <TextLayerForm textLayer={textSet} onSave={handleFormSave}>
      {({ control, formState, watch, setValue }) => (
        <AccordionItem
          value={`item-${textSet.id}`}
          className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: textSet.color }}
              ></div>
              <span className="font-medium text-gray-800 truncate max-w-[200px]">
                {textSet.text || 'Empty Text'}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {/* Mobile Controls */}
            <div className="md:hidden">
              <ScrollArea className="w-full">
                <div className="flex w-max gap-2 mb-6 p-2">
                  {controls.map((control) => (
                    <button
                      key={control.id}
                      onClick={() =>
                        setActiveControl(
                          activeControl === control.id ? null : control.id
                        )
                      }
                      className={`flex flex-col items-center justify-center min-w-[4.5rem] h-[4.5rem] rounded-xl transition-all duration-200 ${
                        activeControl === control.id
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {control.icon}
                      <span className="text-xs mt-1.5 font-medium">
                        {control.label}
                      </span>
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div>
                {activeControl === 'text' && (
                  <FormInputField name="text" label="Text" control={control} />
                )}

                {activeControl === 'fontFamily' && (
                  <FormFontPicker
                    name="fontFamily"
                    control={control}
                    userId={userId}
                  />
                )}

                {activeControl === 'color' && (
                  <FormColorPicker
                    name="color"
                    label="Text Color"
                    control={control}
                  />
                )}

                {activeControl === 'position' && (
                  <div className="space-y-4">
                    <FormSliderField
                      name="left"
                      label="X Position"
                      min={-200}
                      max={200}
                      step={1}
                      control={control}
                    />
                    <FormSliderField
                      name="top"
                      label="Y Position"
                      min={-100}
                      max={100}
                      step={1}
                      control={control}
                    />
                  </div>
                )}

                {activeControl === 'fontSize' && (
                  <FormSliderField
                    name="fontSize"
                    label="Text Size"
                    min={10}
                    max={3000}
                    step={10}
                    control={control}
                  />
                )}

                {activeControl === 'fontWeight' && (
                  <FormSliderField
                    name="fontWeight"
                    label="Font Weight"
                    min={100}
                    max={900}
                    step={100}
                    control={control}
                  />
                )}

                {activeControl === 'letterSpacing' && (
                  <FormSliderField
                    name="letterSpacing"
                    label="Letter Spacing"
                    min={-20}
                    max={100}
                    step={1}
                    control={control}
                  />
                )}

                {activeControl === 'opacity' && (
                  <FormSliderField
                    name="opacity"
                    label="Opacity"
                    min={0}
                    max={1}
                    step={0.01}
                    control={control}
                  />
                )}

                {activeControl === 'rotation' && (
                  <FormSliderField
                    name="rotation"
                    label="Rotation"
                    min={-180}
                    max={180}
                    step={1}
                    control={control}
                  />
                )}

                {activeControl === 'tiltX' && (
                  <FormSliderField
                    name="tiltX"
                    label="Tilt X (3D effect)"
                    min={-90}
                    max={90}
                    step={1}
                    control={control}
                  />
                )}

                {activeControl === 'tiltY' && (
                  <FormSliderField
                    name="tiltY"
                    label="Tilt Y (3D effect)"
                    min={-90}
                    max={90}
                    step={1}
                    control={control}
                  />
                )}
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:block space-y-8 bg-gray-50 rounded-lg p-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CaseSensitive size={20} className="text-blue-500" />
                  Text Content
                </h3>
                <FormInputField name="text" label="Text" control={control} />
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Type size={20} className="text-blue-500" />
                  Typography
                </h3>
                <FormFontPicker
                  name="fontFamily"
                  control={control}
                  userId={userId}
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Palette size={20} className="text-blue-500" />
                  Appearance
                </h3>
                <FormColorPicker
                  name="color"
                  label="Text Color"
                  control={control}
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Move size={20} className="text-blue-500" />
                  Position
                </h3>
                <div className="space-y-6">
                  <FormSliderField
                    name="left"
                    label="X Position"
                    min={-200}
                    max={200}
                    step={1}
                    control={control}
                  />
                  <FormSliderField
                    name="top"
                    label="Y Position"
                    min={-100}
                    max={100}
                    step={1}
                    control={control}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Type size={20} className="text-blue-500" />
                  Text Styling
                </h3>
                <div className="space-y-6">
                  <FormSliderField
                    name="fontSize"
                    label="Font Size"
                    min={10}
                    max={3000}
                    step={10}
                    control={control}
                  />
                  <FormSliderField
                    name="fontWeight"
                    label="Font Weight"
                    min={100}
                    max={900}
                    step={100}
                    control={control}
                  />
                  <FormSliderField
                    name="letterSpacing"
                    label="Letter Spacing"
                    min={-20}
                    max={100}
                    step={1}
                    control={control}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <RotateCw size={20} className="text-blue-500" />
                  Transform & Effects
                </h3>
                <div className="space-y-6">
                  <FormSliderField
                    name="opacity"
                    label="Opacity"
                    min={0}
                    max={1}
                    step={0.01}
                    control={control}
                  />
                  <FormSliderField
                    name="rotation"
                    label="Rotation"
                    min={-180}
                    max={180}
                    step={1}
                    control={control}
                  />
                  <FormSliderField
                    name="tiltX"
                    label="Horizontal Tilt (3D)"
                    min={-90}
                    max={90}
                    step={1}
                    control={control}
                  />
                  <FormSliderField
                    name="tiltY"
                    label="Vertical Tilt (3D)"
                    min={-90}
                    max={90}
                    step={1}
                    control={control}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => duplicateTextSet(textSet)}
                className="flex items-center gap-2 px-4 py-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <Copy size={16} />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                onClick={() => removeTextSet(textSet.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 transition-all duration-200"
              >
                <Trash2 size={16} />
                Remove
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </TextLayerForm>
  );
};

export default TextCustomizer;
