import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectEditor } from "./ProjectEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  Eye,
  EyeOff,
  Calendar
} from "lucide-react";

export function Dashboard() {
  const userProjects = useQuery(api.projects.getUserProjects);
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectPublic, setNewProjectPublic] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      const projectId = await createProject({
        title: newProjectTitle.trim(),
        isPublic: newProjectPublic,
      });
      
      toast.success("Project created successfully!");
      setNewProjectTitle("");
      setNewProjectPublic(false);
      setIsCreating(false);
      setEditingProject(projectId);
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await deleteProject({ projectId: projectToDelete as any });
        toast.success("Project deleted successfully!");
        setProjectToDelete(null);
      } catch (error) {
        toast.error("Failed to delete project");
        console.error(error);
      }
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      // Create a duplicate by creating a new project with the same data
      const originalProject = userProjects?.find(p => p._id === projectId);
      if (originalProject) {
        await createProject({
          title: `${originalProject.title} (Copy)`,
          isPublic: false, // Always make copies private
        });
        toast.success("Project duplicated successfully!");
      }
    } catch (error) {
      toast.error("Failed to duplicate project");
      console.error(error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (editingProject) {
    return (
      <ProjectEditor
        projectId={editingProject}
        onBack={() => setEditingProject(null)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <header className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Projects
        </h1>
        <Button onClick={() => setIsCreating(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </header>

      {/* Create Project Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Enter project title..."
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={newProjectPublic}
                  onCheckedChange={setNewProjectPublic}
                />
                <Label htmlFor="public">Make project public</Label>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectTitle("");
                  setNewProjectPublic(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Projects Grid */}
      {userProjects === undefined ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : userProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Create your first text behind image project to get started</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {project.processedImageUrl ? (
                  <img
                    src={project.processedImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : project.originalImageUrl ? (
                  <img
                    src={project.originalImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.isPublic && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {project.textLayers.length} text layer{project.textLayers.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProject(project._id)}
                    className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
