import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, Github, Users, Mail, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "@/components/reports/ReportCard";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { GenerateReportButton } from "@/components/reports/GenerateReportButton";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { ScopeChangeCard } from "@/components/scope/ScopeChangeCard";
import { QuoteForm } from "@/components/scope/QuoteForm";
import { MessageThread } from "@/components/messages/MessageThread";
import { FileList } from "@/components/files/FileList";
import { useProject } from "@/hooks/useProjects";
import { useReport, useReports, useUpdateReport } from "@/hooks/useReports";
import { useInvoices, useMarkInvoicePaid, useDeleteInvoice } from "@/hooks/useInvoices";
import { useScopeChanges, useSubmitQuote, useMarkScopeChangePaid } from "@/hooks/useScopeChanges";
import { useMessages, useSendMessage, useMarkMessagesRead } from "@/hooks/useMessages";
import { useFiles, useCreateFile, useDeleteFile, useUploadSignature } from "@/hooks/useFiles";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { ScopeChange } from "@/types";

function ReportViewerDialog({
  reportId,
  onClose,
}: {
  reportId: string;
  onClose: () => void;
}) {
  const { data: report, isLoading } = useReport(reportId);
  const updateReport = useUpdateReport();

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!report) return null;

  return (
    <ReportViewer
      report={report}
      canEdit
      onPublish={(id) => {
        updateReport.mutate({ id, data: { status: "PUBLISHED" } });
        onClose();
        toast({ title: "Report published to client" });
      }}
      onEdit={(id, content) => {
        updateReport.mutate({ id, data: { content: { rawMarkdown: content } } });
        toast({ title: "Report saved" });
      }}
      isPublishing={updateReport.isPending}
    />
  );
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showReportViewer, setShowReportViewer] = useState<string | null>(null);
  const [quoteTarget, setQuoteTarget] = useState<ScopeChange | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: project, isLoading } = useProject(id);
  const { data: reportsData } = useReports(id);
  const { data: invoicesData } = useInvoices(id);
  const { data: scopeChanges } = useScopeChanges(id);
  const { data: messagesData } = useMessages(id);
  const { data: files } = useFiles(id);
  const { data: uploadSig } = useUploadSignature(id);

  const markRead = useMarkMessagesRead();
  const sendMessage = useSendMessage();
  const markInvoicePaid = useMarkInvoicePaid();
  const deleteInvoice = useDeleteInvoice();
  const submitQuote = useSubmitQuote();
  const markScopePaid = useMarkScopeChangePaid();
  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();

  const reports = reportsData?.reports || [];
  const invoices = invoicesData?.invoices || [];
  const messages = messagesData?.messages || [];

  const handleUploadFile = async (file: File) => {
    if (!uploadSig) {
      toast({ variant: "destructive", title: "Upload signature unavailable", description: "Configure Cloudinary to enable file uploads." });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", uploadSig.apiKey);
    formData.append("timestamp", String(uploadSig.timestamp));
    formData.append("signature", uploadSig.signature);
    formData.append("folder", uploadSig.folder);
    formData.append("upload_preset", uploadSig.uploadPreset);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${uploadSig.cloudName}/raw/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json() as {
        secure_url: string; public_id: string; bytes: number; format: string;
      };
      await createFile.mutateAsync({
        projectId: id,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        cloudinaryPublicId: data.public_id,
        cloudinarySecureUrl: data.secure_url,
      });
      toast({ title: "File uploaded" });
    } catch {
      toast({ variant: "destructive", title: "Upload failed" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Project not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const hasGitHub = !!project.githubRepoFullName;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{project.name}</h1>
            <Badge
              variant={
                project.status === "ACTIVE" ? "success" :
                project.status === "PAUSED" ? "warning" : "secondary"
              }
            >
              {project.status}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowInviteModal(true)}>
              <Users className="h-4 w-4" /> Invite Client
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowInvoiceModal(true)}>
              <Plus className="h-4 w-4" /> Invoice
            </Button>
            <GenerateReportButton projectId={id} hasGitHub={hasGitHub} size="sm" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-card px-6 overflow-x-auto">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            if (v === "messages") markRead.mutate(id);
          }}
        >
          <TabsList className="bg-transparent border-none rounded-none h-auto p-0 gap-0">
            {["overview", "reports", "files", "messages", "invoices", "scope-changes", "settings"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none capitalize px-4 py-3 text-sm"
              >
                {tab === "scope-changes" ? "Scope Changes" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="px-0 py-0 mt-0">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {reports.filter((r) => r.status === "PUBLISHED").length} published
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Unpaid Invoices</p>
                  <p className="text-2xl font-bold">{invoices.filter((i) => i.status !== "PAID").length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">of {invoices.length} total</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Scope Changes</p>
                  <p className="text-2xl font-bold">{(scopeChanges || []).length}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(scopeChanges || []).filter((s) => s.status === "PENDING").length} pending
                  </p>
                </div>
              </div>

              {project.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">GitHub</p>
                {hasGitHub ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{project.githubRepoFullName}</span>
                    <Badge variant="success" className="text-xs">Connected</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Badge variant="warning" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      No GitHub connected
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" asChild>
                      <a href="/api/github/connect"><Github className="h-3 w-3" /> Connect</a>
                    </Button>
                  </div>
                )}
              </div>

              {reports.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Latest Report</p>
                  <ReportCard report={reports[0]} onClick={() => setShowReportViewer(reports[0].id)} />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="px-0 py-0 mt-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Reports</h2>
                <GenerateReportButton projectId={id} hasGitHub={hasGitHub} size="sm" variant="outline" />
              </div>
              {reports.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  <p>No reports yet.</p>
                  {!hasGitHub && (
                    <p className="mt-2 text-xs">Connect a GitHub repository to start generating reports.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <ReportCard key={r.id} report={r} onClick={() => setShowReportViewer(r.id)} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Files */}
          <TabsContent value="files" className="px-0 py-0 mt-0">
            <div className="p-6">
              <FileList
                files={files || []}
                onUpload={handleUploadFile}
                onDelete={(fileId) => deleteFile.mutate({ projectId: id, fileId })}
                uploading={createFile.isPending}
              />
            </div>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages" className="px-0 py-0 mt-0">
            <div className="h-[600px] flex flex-col">
              <MessageThread
                messages={messages}
                currentSenderType="DEVELOPER"
                onSend={(body) => sendMessage.mutate({ projectId: id, body })}
                isSending={sendMessage.isPending}
              />
            </div>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices" className="px-0 py-0 mt-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Invoices</h2>
                <Button size="sm" className="gap-1.5" onClick={() => setShowInvoiceModal(true)}>
                  <Plus className="h-4 w-4" /> New Invoice
                </Button>
              </div>
              {invoices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No invoices yet.</div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <InvoiceCard
                      key={inv.id}
                      invoice={inv}
                      onMarkPaid={(id) => {
                        markInvoicePaid.mutate(id);
                        toast({ title: "Marked as paid" });
                      }}
                      onDelete={(id) => {
                        deleteInvoice.mutate(id);
                        toast({ title: "Invoice deleted" });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scope Changes */}
          <TabsContent value="scope-changes" className="px-0 py-0 mt-0">
            <div className="p-6">
              <h2 className="font-semibold mb-4">Scope Changes</h2>
              {(scopeChanges || []).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No scope change requests from clients yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {(scopeChanges || []).map((sc) => (
                    <ScopeChangeCard
                      key={sc.id}
                      sc={sc}
                      onWriteQuote={setQuoteTarget}
                      onMarkPaid={(id) => {
                        markScopePaid.mutate(id);
                        toast({ title: "Marked as paid" });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="px-0 py-0 mt-0">
            <div className="p-6 space-y-6">
              <h2 className="font-semibold">Project Settings</h2>

              <div>
                <p className="text-sm font-medium mb-2">GitHub Repository</p>
                {hasGitHub ? (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{project.githubRepoFullName}</span>
                    <Badge variant="success">Connected</Badge>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <a href="/api/github/connect">
                      <Github className="h-4 w-4" /> Connect GitHub
                    </a>
                  </Button>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Project ID</p>
                <p className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1.5 rounded w-fit">{project.id}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Viewer Dialog */}
      <Dialog open={!!showReportViewer} onOpenChange={() => setShowReportViewer(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {showReportViewer && (
            <ReportViewerDialog
              reportId={showReportViewer}
              onClose={() => setShowReportViewer(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Form */}
      <InvoiceForm
        open={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        defaultProjectId={id}
      />

      {/* Quote Form */}
      <QuoteForm
        scopeChange={quoteTarget}
        onClose={() => setQuoteTarget(null)}
        onSubmit={async ({ id: scId, quoteDescription, quotePrice, quoteCurrency }) => {
          await submitQuote.mutateAsync({ id: scId, quoteDescription, quotePrice, quoteCurrency });
          setQuoteTarget(null);
          toast({ title: "Quote sent to client" });
        }}
      />

      {/* Invite Client Dialog */}
      <Dialog open={showInviteModal} onOpenChange={() => setShowInviteModal(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Client Email *</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="client@example.com"
                onKeyDown={(e) => e.key === "Enter" && inviteEmail && (
                  api.post(`/api/projects/${id}/invite`, { email: inviteEmail })
                    .then(() => { setInviteEmail(""); setShowInviteModal(false); toast({ title: "Invitation sent" }); })
                    .catch(() => toast({ variant: "destructive", title: "Failed to send invitation" }))
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              A magic link will be emailed to this address granting access to the client portal for this project.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button
              disabled={!inviteEmail}
              onClick={async () => {
                try {
                  await api.post(`/api/projects/${id}/invite`, { email: inviteEmail });
                  setInviteEmail("");
                  setShowInviteModal(false);
                  toast({ title: "Invitation sent", description: `Magic link sent to ${inviteEmail}` });
                } catch {
                  toast({ variant: "destructive", title: "Failed to send invitation" });
                }
              }}
            >
              <Mail className="h-4 w-4 mr-2" /> Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
