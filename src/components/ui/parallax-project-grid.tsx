'use client';
import { useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export type ProjectCardData = {
  _id: string;
  title: string;
  processedImageUrl?: string | null;
  originalImageUrl?: string | null;
  textLayers: any[];
  isPublic: boolean;
  updatedAt: number;
};

const ProjectCard = ({
  project,
  index,
  hovered,
  setHovered,
  onEdit,
  onDelete,
  isDeleting,
  className,
}: {
  project: ProjectCardData;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  isDeleting: boolean;
  className?: string;
}) => {
  const getImageSrc = () => {
    if (project.processedImageUrl) return project.processedImageUrl;
    if (project.originalImageUrl) return project.originalImageUrl;
    return null;
  };

  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onEdit(project._id)}
      className={cn(
        'rounded-xl relative bg-white overflow-hidden w-full transition-all duration-300 ease-out shadow-lg hover:shadow-xl cursor-pointer',
        hovered !== null && hovered !== index && 'blur-sm scale-[0.98]',
        isDeleting && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Project Image */}
      <div className="relative w-full h-80 bg-gray-100">
        {getImageSrc() ? (
          <img
            src={getImageSrc()!}
            alt={project.title}
            className="w-full h-full object-cover object-center"
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
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300',
            hovered === index ? 'opacity-100' : 'opacity-0'
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
          'absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300',
          hovered === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
};

export const ParallaxProjectGrid = ({
  projects,
  onEdit,
  onDelete,
  deletingProjects,
  className,
}: {
  projects: ProjectCardData[];
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  deletingProjects: Set<string>;
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ['start start', 'end start'],
  });

  const translateYFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateXFirst = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const translateYThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXThird = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotateXThird = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const third = Math.ceil(projects.length / 3);

  const firstPart = projects.slice(0, third);
  const secondPart = projects.slice(third, 2 * third);
  const thirdPart = projects.slice(2 * third);

  return (
    <div
      className={cn('h-[40rem] items-start overflow-y-auto w-full', className)}
      ref={gridRef}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-10 py-40 px-10">
        {/* First Column - Animated */}
        <div className="grid gap-10">
          {firstPart.map((project, idx) => (
            <motion.div
              style={{
                y: translateYFirst,
                x: translateXFirst,
                rotateZ: rotateXFirst,
              }}
              key={'grid-1' + project._id}
            >
              <ProjectCard
                project={project}
                index={idx}
                hovered={hovered}
                setHovered={setHovered}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingProjects.has(project._id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Second Column - Static */}
        <div className="grid gap-10">
          {secondPart.map((project, idx) => (
            <motion.div key={'grid-2' + project._id}>
              <ProjectCard
                project={project}
                index={firstPart.length + idx}
                hovered={hovered}
                setHovered={setHovered}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingProjects.has(project._id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Third Column - Animated */}
        <div className="grid gap-10">
          {thirdPart.map((project, idx) => (
            <motion.div
              style={{
                y: translateYThird,
                x: translateXThird,
                rotateZ: rotateXThird,
              }}
              key={'grid-3' + project._id}
            >
              <ProjectCard
                project={project}
                index={firstPart.length + secondPart.length + idx}
                hovered={hovered}
                setHovered={setHovered}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={deletingProjects.has(project._id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};