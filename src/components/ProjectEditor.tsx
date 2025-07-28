import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface TextLayer {
  id: number;
  text: string;
  fontFamily: string;
  top: number;
  left: number;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  shadowColor: string;
  shadowSize: number;
  rotation: number;
  tiltX: number;
  tiltY: number;
  letterSpacing: number;
}

interface ProjectEditorProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectEditor({ projectId, onBack }: ProjectEditorProps) {
  const project = useQuery(api.projects.getProject, { projectId: projectId as any });
  const updateProjectImage = useMutation(api.projects.updateProjectImage);
  const updateProjectTextLayers = useMutation(api.projects.updateProjectTextLayers);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project?.textLayers) {
      setTextLayers(project.textLayers);
    }
  }, [project]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Upload failed");
      }
      
      const { storageId } = await result.json();
      
      // Update project with image
      await updateProjectImage({
        projectId: projectId as any,
        originalImageStorageId: storageId,
      });
      
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now(),
      text: "New Text",
      fontFamily: "Arial",
      top: 50,
      left: 50,
      color: "#ffffff",
      fontSize: 24,
      fontWeight: 400,
      opacity: 1,
      shadowColor: "#000000",
      shadowSize: 2,
      rotation: 0,
      tiltX: 0,
      tiltY: 0,
      letterSpacing: 0,
    };
    
    const updatedLayers = [...textLayers, newLayer];
    setTextLayers(updatedLayers);
    setSelectedLayer(newLayer.id);
    saveTextLayers(updatedLayers);
  };

  const updateTextLayer = (id: number, updates: Partial<TextLayer>) => {
    const updatedLayers = textLayers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    );
    setTextLayers(updatedLayers);
    saveTextLayers(updatedLayers);
  };

  const deleteTextLayer = (id: number) => {
    const updatedLayers = textLayers.filter(layer => layer.id !== id);
    setTextLayers(updatedLayers);
    setSelectedLayer(null);
    saveTextLayers(updatedLayers);
  };

  const saveTextLayers = async (layers: TextLayer[]) => {
    try {
      await updateProjectTextLayers({
        projectId: projectId as any,
        textLayers: layers,
      });
    } catch (error) {
      toast.error("Failed to save changes");
      console.error(error);
    }
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
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded">
          Go Back
        </button>
      </div>
    );
  }

  const selectedLayerData = textLayers.find(layer => layer.id === selectedLayer);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">{project.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
          <button
            onClick={addTextLayer}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add Text
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow-lg h-full relative overflow-hidden">
            {project.originalImageUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={project.originalImageUrl}
                  alt="Project"
                  className="w-full h-full object-contain"
                />
                {/* Text Layers */}
                {textLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`absolute cursor-pointer select-none ${
                      selectedLayer === layer.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      top: `${layer.top}%`,
                      left: `${layer.left}%`,
                      color: layer.color,
                      fontSize: `${layer.fontSize}px`,
                      fontFamily: layer.fontFamily,
                      fontWeight: layer.fontWeight,
                      opacity: layer.opacity,
                      textShadow: `${layer.shadowSize}px ${layer.shadowSize}px 4px ${layer.shadowColor}`,
                      transform: `rotate(${layer.rotation}deg) rotateX(${layer.tiltX}deg) rotateY(${layer.tiltY}deg)`,
                      letterSpacing: `${layer.letterSpacing}px`,
                      zIndex: selectedLayer === layer.id ? 10 : 1,
                    }}
                    onClick={() => setSelectedLayer(layer.id)}
                  >
                    {layer.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Upload an image to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          
          {selectedLayerData ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  value={selectedLayerData.text}
                  onChange={(e) => updateTextLayer(selectedLayer!, { text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  value={selectedLayerData.fontFamily}
                  onChange={(e) => updateTextLayer(selectedLayer!, { fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={selectedLayerData.fontSize}
                  onChange={(e) => updateTextLayer(selectedLayer!, { fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{selectedLayerData.fontSize}px</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={selectedLayerData.color}
                  onChange={(e) => updateTextLayer(selectedLayer!, { color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position X</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedLayerData.left}
                  onChange={(e) => updateTextLayer(selectedLayer!, { left: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{selectedLayerData.left}%</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position Y</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedLayerData.top}
                  onChange={(e) => updateTextLayer(selectedLayer!, { top: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{selectedLayerData.top}%</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedLayerData.opacity}
                  onChange={(e) => updateTextLayer(selectedLayer!, { opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{Math.round(selectedLayerData.opacity * 100)}%</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={selectedLayerData.rotation}
                  onChange={(e) => updateTextLayer(selectedLayer!, { rotation: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{selectedLayerData.rotation}°</span>
              </div>

              <button
                onClick={() => deleteTextLayer(selectedLayer!)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Layer
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Select a text layer to edit its properties</p>
            </div>
          )}

          {/* Text Layers List */}
          <div className="mt-8">
            <h4 className="text-md font-semibold mb-2">Text Layers</h4>
            <div className="space-y-2">
              {textLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedLayer === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div className="font-medium truncate">{layer.text}</div>
                  <div className="text-sm text-gray-500">{layer.fontFamily} • {layer.fontSize}px</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
