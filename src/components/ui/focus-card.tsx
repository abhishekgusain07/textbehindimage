"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Globe, Lock } from "lucide-react";

export const ProjectCard = React.memo(
  ({
    project,
    index,
    hovered,
    setHovered,
    onEdit,
    onDelete,
    isDeleting,
  }: {
    project: ProjectCardData;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onEdit: (projectId: string) => void;
    onDelete: (projectId: string) => void;
    isDeleting: boolean;
  }) => {
    const getImageSrc = () => {
      if (project.processedImageUrl) return project.processedImageUrl;
      if (project.originalImageUrl) return project.originalImageUrl;
      return null;
    };

    const formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", 
        day: "numeric",
      });
    };

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onEdit(project._id)}
        className={cn(
          "rounded-xl relative bg-white overflow-hidden h-80 w-full transition-all duration-300 ease-out shadow-lg hover:shadow-xl cursor-pointer",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        {/* Full Image Container */}
        <div className="relative h-full bg-gray-100">
          {getImageSrc() ? (
            <img
              src={getImageSrc()!}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <svg 
                className="w-16 h-16 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
          
          {/* Project Title Overlay - Only visible on hover */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0"
            )}
          >
            <h3 className="font-semibold text-white text-lg truncate">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300",
            hovered === index ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project._id);
            }}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            disabled={isDeleting}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
            size="sm"
            variant="destructive"
            className="bg-red-500/80 hover:bg-red-600/80 text-white backdrop-blur-sm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export type ProjectCardData = {
  _id: string;
  title: string;
  processedImageUrl?: string;
  originalImageUrl?: string;
  textLayers: any[];
  isPublic: boolean;
  updatedAt: number;
};

export function FocusCards({ 
  projects, 
  onEdit, 
  onDelete,
  deletingProjects 
}: { 
  projects: ProjectCardData[];
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  deletingProjects: Set<string>;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 w-full">
      {projects.map((project, index) => (
        <ProjectCard
          key={project._id}
          project={project}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingProjects.has(project._id)}
        />
      ))}
    </div>
  );
}