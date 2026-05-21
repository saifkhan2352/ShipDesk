import { usePortalBranding } from "@/hooks/usePortalBranding";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientPortalLayoutProps {
  children: React.ReactNode;
  workspaceSlug: string;
}

export function ClientPortalLayout({ children, workspaceSlug }: ClientPortalLayoutProps) {
  const { data: branding } = usePortalBranding(workspaceSlug);

  const logout = useMutation({
    mutationFn: () => api.post("/api/portal/auth/logout").then((r) => r.data),
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  return (
    <div className="min-h-screen bg-background" style={branding ? { "--color-primary": branding.primaryColor } as React.CSSProperties : {}}>
      <header className="border-b bg-card h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {branding?.logoUrl ? (
            <img src={branding.logoUrl} alt="Agency logo" className="h-8 w-auto object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
          )}
          <span className="font-semibold text-sm">
            {branding?.agencyName || "Client Portal"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout.mutate()}
          className="text-muted-foreground gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
