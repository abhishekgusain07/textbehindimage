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
    <div className="flex flex-col min-h-screen" style={{ background: `linear-gradient(to bottom right, var(--bg-secondary), var(--bg-primary), var(--bg-tertiary))` }}>
      <header className="flex items-center justify-between p-6 backdrop-blur-xl" style={{ borderBottom: `1px solid var(--border-primary)`, background: 'var(--bg-card)' }}>
        <h1 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--text-blue), var(--text-purple))` }}>
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
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-accent)' }}>
            <svg className="w-12 h-12" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No projects yet</h3>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Create your first text behind image project to get started</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 font-semibold rounded-lg transition-colors"
            style={{ 
              background: 'var(--btn-primary)',
              color: 'var(--text-white)'
            }}
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <div key={project._id} className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="aspect-video relative" style={{ background: 'var(--bg-accent)' }}>
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
                  <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
                  <div className="flex gap-2">
                    {project.isPublic && (
                      <span className="px-2 py-1 text-xs rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-green)' }}>
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {project.textLayers.length} text layer{project.textLayers.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProject(project._id)}
                    className="flex-1 px-3 py-2 text-sm rounded transition-colors"
                    style={{ 
                      background: 'var(--btn-primary)',
                      color: 'var(--text-white)'
                    }}
                    disabled={deletingProjects.has(project._id)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    disabled={deletingProjects.has(project._id)}
                    className="px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{ 
                      color: 'var(--text-red)',
                      border: `1px solid var(--text-red)`
                    }}
                  >
                    {deletingProjects.has(project._id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--text-red)' }}></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
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
