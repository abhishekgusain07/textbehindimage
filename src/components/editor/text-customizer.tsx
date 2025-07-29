import React, { useState } from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker';
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
  textSet: {
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
  };
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
    <AccordionItem value={`item-${textSet.id}`} className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: textSet.color }}></div>
          <span className="font-medium text-gray-800 truncate max-w-[200px]">{textSet.text || 'Empty Text'}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        {/* Mobile Controls */}
        <div className="md:hidden">
          <ScrollArea className="w-full">
            <div className="flex w-max gap-2 mb-6 p-2">
              {controls.map(control => (
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
                  <span className="text-xs mt-1.5 font-medium">{control.label}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div>
            {activeControl === 'text' && (
              <InputField
                attribute="text"
                label="Text"
                currentValue={textSet.text}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'fontFamily' && (
              <FontFamilyPicker
                attribute="fontFamily"
                currentFont={textSet.fontFamily}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
                userId={userId}
              />
            )}

            {activeControl === 'color' && (
              <ColorPicker
                attribute="color"
                label="Text Color"
                currentColor={textSet.color}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'position' && (
              <div className="space-y-4">
                <SliderField
                  attribute="left"
                  label="X Position"
                  min={-200}
                  max={200}
                  step={1}
                  currentValue={textSet.left}
                  handleAttributeChange={(attribute, value) =>
                    handleAttributeChange(textSet.id, attribute, value)
                  }
                />
                <SliderField
                  attribute="top"
                  label="Y Position"
                  min={-100}
                  max={100}
                  step={1}
                  currentValue={textSet.top}
                  handleAttributeChange={(attribute, value) =>
                    handleAttributeChange(textSet.id, attribute, value)
                  }
                />
              </div>
            )}

            {activeControl === 'fontSize' && (
              <SliderField
                attribute="fontSize"
                label="Text Size"
                min={10}
                max={3000}
                step={10}
                currentValue={textSet.fontSize}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'fontWeight' && (
              <SliderField
                attribute="fontWeight"
                label="Font Weight"
                min={100}
                max={900}
                step={100}
                currentValue={textSet.fontWeight}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'letterSpacing' && (
              <SliderField
                attribute="letterSpacing"
                label="Letter Spacing"
                min={-20}
                max={100}
                step={1}
                currentValue={textSet.letterSpacing}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'opacity' && (
              <SliderField
                attribute="opacity"
                label="Opacity"
                min={0}
                max={1}
                step={0.01}
                currentValue={textSet.opacity}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'rotation' && (
              <SliderField
                attribute="rotation"
                label="Rotation"
                min={-180}
                max={180}
                step={1}
                currentValue={textSet.rotation}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'tiltX' && (
              <SliderField
                attribute="tiltX"
                label="Tilt X (3D effect)"
                min={-90}
                max={90}
                step={1}
                currentValue={textSet.tiltX}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            )}

            {activeControl === 'tiltY' && (
              <SliderField
                attribute="tiltY"
                label="Tilt Y (3D effect)"
                min={-90}
                max={90}
                step={1}
                currentValue={textSet.tiltY}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
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
            <InputField
              attribute="text"
              label="Text"
              currentValue={textSet.text}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Type size={20} className="text-blue-500" />
              Typography
            </h3>
            <FontFamilyPicker
              attribute="fontFamily"
              currentFont={textSet.fontFamily}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
              userId={userId}
            />
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Palette size={20} className="text-blue-500" />
              Appearance
            </h3>
            <ColorPicker
              attribute="color"
              label="Text Color"
              currentColor={textSet.color}
              handleAttributeChange={(attribute, value) =>
                handleAttributeChange(textSet.id, attribute, value)
              }
            />
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Move size={20} className="text-blue-500" />
              Position
            </h3>
            <div className="space-y-6">
              <SliderField
                attribute="left"
                label="X Position"
                min={-200}
                max={200}
                step={1}
                currentValue={textSet.left}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
              <SliderField
                attribute="top"
                label="Y Position"
                min={-100}
                max={100}
                step={1}
                currentValue={textSet.top}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Type size={20} className="text-blue-500" />
              Text Styling
            </h3>
            <div className="space-y-6">
              <SliderField
                attribute="fontSize"
                label="Font Size"
                min={10}
                max={3000}
                step={10}
                currentValue={textSet.fontSize}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
              <SliderField
                attribute="fontWeight"
                label="Font Weight"
                min={100}
                max={900}
                step={100}
                currentValue={textSet.fontWeight}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
              <SliderField
                attribute="letterSpacing"
                label="Letter Spacing"
                min={-20}
                max={100}
                step={1}
                currentValue={textSet.letterSpacing}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <RotateCw size={20} className="text-blue-500" />
              Transform & Effects
            </h3>
            <div className="space-y-6">
              <SliderField
                attribute="opacity"
                label="Opacity"
                min={0}
                max={1}
                step={0.01}
                currentValue={textSet.opacity}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
              <SliderField
                attribute="rotation"
                label="Rotation"
                min={-180}
                max={180}
                step={1}
                currentValue={textSet.rotation}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
              <SliderField
                attribute="tiltX"
                label="Horizontal Tilt (3D)"
                min={-90}
                max={90}
                step={1}
                currentValue={textSet.tiltX}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
              />
              <SliderField
                attribute="tiltY"
                label="Vertical Tilt (3D)"
                min={-90}
                max={90}
                step={1}
                currentValue={textSet.tiltY}
                handleAttributeChange={(attribute, value) =>
                  handleAttributeChange(textSet.id, attribute, value)
                }
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
  );
};

export default TextCustomizer;