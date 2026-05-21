import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace, useUpdateWorkspace } from "@/hooks/useWorkspace";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const PRESET_COLORS = [
  "#6366F1", "#8B5CF6", "#0EA5E9", "#10B981",
  "#F59E0B", "#F43F5E", "#475569", "#18181B",
];

export function SettingsPage() {
  const { data: workspace, isLoading } = useWorkspace();
  const updateWorkspace = useUpdateWorkspace();

  const [name, setName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setAgencyName(workspace.agencyName || "");
      setPrimaryColor(workspace.primaryColor || "#6366F1");
      setLogoUrl(workspace.logoUrl || "");
    }
  }, [workspace]);

  const handleLogoUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Max 2 MB" });
      return;
    }
    setUploadingLogo(true);
    try {
      const sigResp = await api.get("/api/workspace/logo-upload-signature");
      const sig = sigResp.data as { apiKey: string; timestamp: number; signature: string; folder: string; uploadPreset: string; cloudName: string };
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sig.apiKey);
      formData.append("timestamp", String(sig.timestamp));
      formData.append("signature", sig.signature);
      formData.append("folder", sig.folder);
      formData.append("upload_preset", sig.uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: formData });
      const data = await res.json() as { secure_url: string };
      setLogoUrl(data.secure_url);
      toast({ title: "Logo uploaded" });
    } catch {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateWorkspace.mutateAsync({ name, agencyName: agencyName || null, primaryColor, logoUrl: logoUrl || null });
      toast({ title: "Settings saved" });
    } catch {
      toast({ variant: "destructive", title: "Failed to save settings" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workspace Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Workspace Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label>Agency Name</Label>
              <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Shown to clients" maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label>Portal Subdomain</Label>
              <div className="flex items-center gap-2">
                <Input value={workspace?.slug || ""} disabled className="font-mono bg-muted" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">.portal.shipdesk.io</span>
              </div>
              <p className="text-xs text-muted-foreground">Subdomain cannot be changed after creation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                {logoUrl && <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain rounded border" />}
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" disabled={uploadingLogo} type="button" asChild>
                    <span>
                      {uploadingLogo ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</> : "Change Logo"}
                    </span>
                  </Button>
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleLogoUpload(f);
                  }} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-md border-2 transition-transform ${primaryColor === color ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setPrimaryColor(color)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-32 font-mono text-sm" />
                <div className="w-8 h-8 rounded border" style={{ backgroundColor: primaryColor }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={!name || updateWorkspace.isPending} className="w-full">
          {updateWorkspace.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
