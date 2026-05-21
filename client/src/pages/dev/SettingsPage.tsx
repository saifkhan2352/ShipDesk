import { WorkspaceSettingsForm } from "@/components/workspace/WorkspaceSettingsForm";

export function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workspace Settings</h1>
      <WorkspaceSettingsForm />
    </div>
  );
}
