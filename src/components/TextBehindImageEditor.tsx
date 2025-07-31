'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileUpload } from '@/components/ui/file-upload';
import TextCustomizer from './editor/text-customizer';
import CompareSlider from './compare-slider';

import { PlusIcon } from 'lucide-react';

interface TextBehindImageEditorProps {
  projectId: string;
  onBack: () => void;
}

export function TextBehindImageEditor({
  projectId,
  onBack,
}: TextBehindImageEditorProps) {
  const project = useQuery(api.projects.getProject, {
    projectId: projectId as any,
  });
  const updateProjectImage = useMutation(api.projects.updateProjectImage);
  const updateProjectTextLayers = useMutation(
    api.projects.updateProjectTextLayers
  );
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );
  const [textSets, setTextSets] = useState<Array<any>>([]);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (project?.textLayers) {
      setTextSets(project.textLayers);
    }
    if (project?.originalImageUrl) {
      setSelectedImage(project.originalImageUrl);
      setIsImageSetupDone(true);
    }
  }, [project]);

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (file) {
      try {
        // Get upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload file
        const result = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error('Upload failed');
        }

        const { storageId } = await result.json();

        // Update project with image
        await updateProjectImage({
          projectId: projectId as any,
          originalImageStorageId: storageId,
        });

        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setIsProcessingImage(true);
        setProcessingMessage('Uploading image...');
        await setupImage(imageUrl);

        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
        console.error(error);
      }
    }
  };

  const setupImage = async (imageUrl: string) => {
    try {
      setProcessingMessage(
        'Removing background... This may take 10-30 seconds for high quality results'
      );
      const { removeBackground } = await import('@imgly/background-removal');
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);
      setProcessingMessage(
        'Background removed successfully! You can now add text.'
      );
      setTimeout(() => {
        setIsProcessingImage(false);
        setProcessingMessage('');
      }, 2000);
    } catch (error) {
      setProcessingMessage(
        'Failed to remove background. You can still add text to your image.'
      );
      setTimeout(() => {
        setIsProcessingImage(false);
        setProcessingMessage('');
      }, 3000);
    }
  };

  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    const newTextSet = {
      id: newId,
      text: 'edit',
      fontFamily: 'Inter',
      top: 0,
      left: 0,
      color: 'white',
      fontSize: 200,
      fontWeight: 800,
      opacity: 1,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      shadowSize: 4,
      rotation: 0,
      tiltX: 0,
      tiltY: 0,
      letterSpacing: 0,
    };
    const updatedTextSets = [...textSets, newTextSet];
    setTextSets(updatedTextSets);
    saveTextLayers(updatedTextSets);
  };

  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    const updatedTextSets = textSets.map((set) =>
      set.id === id ? { ...set, [attribute]: value } : set
    );
    setTextSets(updatedTextSets);
    saveTextLayers(updatedTextSets);
  };

  const duplicateTextSet = (textSet: any) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    const duplicatedTextSet = { ...textSet, id: newId };
    const updatedTextSets = [...textSets, duplicatedTextSet];
    setTextSets(updatedTextSets);
    saveTextLayers(updatedTextSets);
  };

  const removeTextSet = (id: number) => {
    const updatedTextSets = textSets.filter((set) => set.id !== id);
    setTextSets(updatedTextSets);
    saveTextLayers(updatedTextSets);
  };

  const saveTextLayers = async (layers: any[]) => {
    try {
      await updateProjectTextLayers({
        projectId: projectId as any,
        textLayers: layers,
      });
    } catch (error) {
      toast.error('Failed to save changes');
      console.error(error);
    }
  };

  const handleEditMoreImages = () => {
    // Reset all states to start fresh
    setSelectedImage(null);
    setIsImageSetupDone(false);
    setRemovedBgImageUrl(null);
    setTextSets([]);
    setIsProcessingImage(false);
    setIsSavingImage(false);
    setProcessingMessage('');
    onBack();
  };

  const saveCompositeImage = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    setIsSavingImage(true);
    setProcessingMessage('Preparing your image for download...');

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = 'anonymous';

    const triggerDownload = () => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'text-behind-image.png';
      link.href = dataUrl;
      link.click();

      setProcessingMessage('Image downloaded successfully!');
      setTimeout(() => {
        setIsSavingImage(false);
        setProcessingMessage('');
      }, 2000);
    };

    const drawForegroundAndDownload = () => {
      // Draw the removed background image on top if available
      if (removedBgImageUrl) {
        const fgImg = new (window as any).Image();
        fgImg.crossOrigin = 'anonymous';
        fgImg.onload = () => {
          ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
          triggerDownload();
        };
        fgImg.onerror = () => {
          setProcessingMessage('Compositing layers...');
          triggerDownload();
        };
        fgImg.src = removedBgImageUrl;
      } else {
        // No foreground image, trigger download immediately
        triggerDownload();
      }
    };

    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Calculate the scaling factor between original image and preview display
      // Preview container is 400px min-height, and image uses objectFit="contain"
      const previewContainerHeight = 400;
      const imageAspectRatio = bgImg.width / bgImg.height;

      // Calculate actual displayed size in preview (considering objectFit="contain")
      let previewDisplayHeight, previewDisplayWidth;
      if (imageAspectRatio > 1) {
        // Wide image - height will be constrained
        previewDisplayHeight = Math.min(previewContainerHeight, bgImg.height);
        previewDisplayWidth = previewDisplayHeight * imageAspectRatio;
      } else {
        // Tall image - height will be constrained to container
        previewDisplayHeight = previewContainerHeight;
        previewDisplayWidth = previewDisplayHeight * imageAspectRatio;
      }

      // Scale factor: how much bigger the original is compared to preview
      const scaleFactor = bgImg.height / previewDisplayHeight;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      textSets.forEach((textSet) => {
        ctx.save();

        // Set up text properties with proper scaling
        const scaledFontSize = (textSet.fontSize / 10) * scaleFactor;
        const scaledLetterSpacing = (textSet.letterSpacing / 10) * scaleFactor;
        const scaledShadowSize = (textSet.shadowSize / 10) * scaleFactor;

        ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = `${scaledLetterSpacing}px`;

        // Add text shadow to match preview
        ctx.shadowColor = textSet.shadowColor;
        ctx.shadowOffsetX = scaledShadowSize;
        ctx.shadowOffsetY = scaledShadowSize;
        ctx.shadowBlur = scaledShadowSize * 2;

        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (50 - textSet.top)) / 100;

        // Move to position first
        ctx.translate(x, y);

        // Apply 3D transforms
        const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
        const tiltYRad = (-textSet.tiltY * Math.PI) / 180;

        // Use a simpler transform that maintains the visual tilt
        ctx.transform(
          Math.cos(tiltYRad),
          Math.sin(0),
          -Math.sin(0),
          Math.cos(tiltXRad),
          0,
          0
        );

        // Apply rotation last
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        if (textSet.letterSpacing === 0) {
          // Use standard text rendering if no letter spacing
          ctx.fillText(textSet.text, 0, 0);
        } else {
          // Manual letter spacing implementation
          const chars = textSet.text.split('');
          let currentX = 0;
          // Calculate total width to center properly (use the already calculated scaledLetterSpacing)
          const totalWidth = chars.reduce(
            (width: number, char: string, i: number) => {
              const charWidth = ctx.measureText(char).width;
              return (
                width +
                charWidth +
                (i < chars.length - 1 ? scaledLetterSpacing : 0)
              );
            },
            0
          );

          const startX = -totalWidth / 2;
          currentX = startX;

          chars.forEach((char: string, i: number) => {
            ctx.fillText(char, currentX, 0);
            const charWidth = ctx.measureText(char).width;
            currentX +=
              charWidth + (i < chars.length - 1 ? scaledLetterSpacing : 0);
          });
        }

        ctx.restore();
      });

      drawForegroundAndDownload();
    };

    bgImg.onerror = () => {
      setProcessingMessage('Failed to process image. Please try again.');
      setTimeout(() => {
        setIsSavingImage(false);
        setProcessingMessage('');
      }, 3000);
    };

    bgImg.src = selectedImage || '';
  };

  if (project === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Project not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!selectedImage ? (
        // Phase 1: Centered File Upload
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-2xl">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </div>
      ) : isProcessingImage ? (
        // Phase 2: Processing State
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-lg font-medium text-gray-700">
                  {processingMessage || 'Processing your image...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Phase 3: Split Layout with Header
        <div className="flex flex-col h-screen">
          <header className="flex items-center justify-between p-6 border-b border-gray-200/60 bg-white/90 backdrop-blur-xl">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {project.title}
            </h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={saveCompositeImage}
                className="hidden md:flex"
                disabled={isSavingImage || isProcessingImage}
                variant="outline"
              >
                {isSavingImage ? 'Saving...' : 'Save image'}
              </Button>
              <Button
                onClick={handleEditMoreImages}
                variant="outline"
                className="hidden md:flex"
              >
                Back to Dashboard
              </Button>
            </div>
          </header>

          <div className="flex flex-col md:flex-row gap-6 flex-1 p-6">
            {/* Left Side - Image Preview */}
            <div className="flex flex-col w-full md:w-1/2 gap-4">
              {/* Mobile buttons */}
              <div className="flex items-center gap-2 md:hidden">
                <Button
                  onClick={saveCompositeImage}
                  disabled={isSavingImage || isProcessingImage}
                  size="sm"
                >
                  {isSavingImage ? 'Saving...' : 'Save image'}
                </Button>
                <Button
                  onClick={handleEditMoreImages}
                  variant="outline"
                  size="sm"
                >
                  Back to Dashboard
                </Button>
              </div>

              {/* Status Messages */}
              {(isProcessingImage || isSavingImage || processingMessage) && (
                <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    {(isProcessingImage || isSavingImage) && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                    <p className="text-sm text-blue-800">
                      {processingMessage || 'Processing...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Preview Container */}
              <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="absolute top-0 left-0 w-full h-full object-contain z-10"
                  />
                )}

                {textSets.map((textSet) => (
                  <div
                    key={textSet.id}
                    className="absolute text-center select-none pointer-events-none z-20"
                    style={{
                      top: `${50 - textSet.top}%`,
                      left: `${textSet.left + 50}%`,
                      transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg) perspective(1000px) rotateX(${textSet.tiltX}deg) rotateY(${textSet.tiltY}deg)`,
                      fontSize: `${textSet.fontSize / 10}px`,
                      fontFamily: textSet.fontFamily,
                      color: textSet.color,
                      fontWeight: textSet.fontWeight,
                      opacity: textSet.opacity,
                      textShadow: `${textSet.shadowSize / 10}px ${textSet.shadowSize / 10}px ${(textSet.shadowSize * 2) / 10}px ${textSet.shadowColor}`,
                      letterSpacing: `${textSet.letterSpacing / 10}px`,
                    }}
                  >
                    {textSet.text}
                  </div>
                ))}

                {removedBgImageUrl && (
                  <img
                    src={removedBgImageUrl}
                    alt="Removed bg"
                    className="absolute top-0 left-0 w-full h-full object-contain z-30"
                  />
                )}
              </div>
            </div>

            {/* Right Side - Text Editor */}
            <div className="w-full md:w-1/2 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Text Layers</h2>
                <Button onClick={addNewTextSet} size="sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <Accordion type="single" collapsible className="space-y-2">
                  {textSets.map((textSet) => (
                    <TextCustomizer
                      key={textSet.id}
                      textSet={textSet}
                      handleAttributeChange={handleAttributeChange}
                      removeTextSet={removeTextSet}
                      duplicateTextSet={duplicateTextSet}
                      userId={'user-1'}
                    />
                  ))}
                </Accordion>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
