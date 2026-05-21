import { Link } from "wouter";
import { motion } from "framer-motion";
import { GitBranch, DollarSign, MoreVertical, Pause, CheckCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  unpaidInvoiceCount?: number;
}

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", variant: "success" as const, icon: Activity },
  PAUSED: { label: "Paused", variant: "warning" as const, icon: Pause },
  COMPLETED: { label: "Completed", variant: "secondary" as const, icon: CheckCircle },
};

export function ProjectCard({ project, unpaidInvoiceCount = 0 }: ProjectCardProps) {
  const statusCfg = STATUS_CONFIG[project.status];
  const StatusIcon = statusCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <Link href={`/projects/${project.id}`}>
        <a className="block">
          <div className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-base leading-tight pr-2">{project.name}</h3>
              <Badge variant={statusCfg.variant} className="flex-shrink-0 gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusCfg.label}
              </Badge>
            </div>

            {project.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {project.githubRepoFullName ? (
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  <span className="font-mono truncate max-w-[140px]">{project.githubRepoFullName}</span>
                </span>
              ) : (
                <span className="text-muted-foreground/60">No GitHub connected</span>
              )}

              {unpaidInvoiceCount > 0 && (
                <Badge variant="warning" className="gap-1">
                  <DollarSign className="h-3 w-3" />
                  {unpaidInvoiceCount} unpaid
                </Badge>
              )}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Updated {formatRelative(project.updatedAt)}
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
}
