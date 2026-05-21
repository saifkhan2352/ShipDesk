import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { useProjects, useCreateProject } from "@/hooks/useProjects";
import { useInvoices } from "@/hooks/useInvoices";
import { toast } from "@/hooks/use-toast";

export function DashboardPage() {
  const [showNewProject, setShowNewProject] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: projects, isLoading } = useProjects(showArchived ? "COMPLETED" : undefined);
  const { data: invoicesData } = useInvoices();
  const createProject = useCreateProject();

  const unpaidByProject = (invoicesData?.invoices || []).reduce<Record<string, number>>(
    (acc, inv) => {
      if (inv.status !== "PAID") {
        acc[inv.projectId] = (acc[inv.projectId] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createProject.mutateAsync({ name: newName.trim(), description: newDesc || undefined });
      setNewName("");
      setNewDesc("");
      setShowNewProject(false);
      toast({ title: "Project created" });
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: { error?: string } } })?.response?.data;
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: errData?.error === "ACTIVE_PROJECT_LIMIT_REACHED"
          ? "You've reached the 50 active project limit."
          : "Please try again.",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {projects?.length || 0} {showArchived ? "archived" : "active"} project{projects?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show active" : "Show archived"}
          </Button>
          <Button size="sm" onClick={() => setShowNewProject(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <OnboardingChecklist />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <p className="text-muted-foreground mb-4">
            {showArchived ? "No archived projects." : "No projects yet. Create your first one!"}
          </p>
          {!showArchived && (
            <Button onClick={() => setShowNewProject(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Create Project
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              unpaidInvoiceCount={unpaidByProject[project.id] || 0}
            />
          ))}
        </div>
      )}

      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Project Name *</Label>
              <Input
                id="proj-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Client Website Redesign"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief description of this project..."
                maxLength={500}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || createProject.isPending}
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
