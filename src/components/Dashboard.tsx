import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { TextBehindImageEditor } from "./TextBehindImageEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FocusCards } from "@/components/ui/focus-card";
import { Plus } from "lucide-react";

export function Dashboard() {
  const userProjects = useQuery(api.projects.getUserProjects);
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectPublic, setNewProjectPublic] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [deletingProjects, setDeletingProjects] = useState<Set<string>>(new Set());

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

  const handleDeleteProject = async (projectId: string) => {
    // Add project to deleting set for visual feedback
    setDeletingProjects(prev => new Set(prev).add(projectId));
    
    try {
      await deleteProject({ projectId: projectId as any });
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      // Remove project from deleting set
      setDeletingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
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
      <TextBehindImageEditor
        projectId={editingProject}
        onBack={() => setEditingProject(null)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="flex justify-end p-6">
        <Button 
          onClick={() => setIsCreating(true)} 
          size="lg"
          className="bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

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
      <div className="flex-1 p-6">
        {userProjects === undefined ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : userProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">No projects yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first text behind image project to get started with amazing visual effects</p>
            <Button
              onClick={() => setIsCreating(true)}
              size="lg"
              className="bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <FocusCards 
            projects={userProjects}
            onEdit={setEditingProject}
            onDelete={handleDeleteProject}
            deletingProjects={deletingProjects}
          />
        )}
      </div>
    </div>
  );
}
