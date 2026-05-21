import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Zap, Plus, Check, Loader2, AlertTriangle, Send,
  Github, Users, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportCard } from "@/components/reports/ReportCard";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import { MessageThread } from "@/components/messages/MessageThread";
import { FileList } from "@/components/files/FileList";
import { useProject } from "@/hooks/useProjects";
import { useReport, useReports, useGenerateReport, useUpdateReport } from "@/hooks/useReports";
import { useInvoices, useCreateInvoice, useMarkInvoicePaid, useDeleteInvoice } from "@/hooks/useInvoices";
import { useScopeChanges, useSubmitQuote } from "@/hooks/useScopeChanges";
import { useMessages, useSendMessage, useMarkMessagesRead } from "@/hooks/useMessages";
import { useFiles, useCreateFile, useDeleteFile, useUploadSignature } from "@/hooks/useFiles";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { Currency, ScopeChange } from "@/types";

function GenerateReportModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const generate = useGenerateReport();
  const [step, setStep] = useState<"idle" | "fetching" | "analyzing" | "writing" | "done" | "error">("idle");

  const handleGenerate = async () => {
    setStep("fetching");
    await new Promise((r) => setTimeout(r, 1000));
    setStep("analyzing");
    await new Promise((r) => setTimeout(r, 1000));
    setStep("writing");
    try {
      await generate.mutateAsync(projectId);
      setStep("done");
      await new Promise((r) => setTimeout(r, 1500));
      onClose();
      toast({ title: "Report generated", description: "Your draft is ready to review." });
    } catch {
      setStep("error");
      toast({ variant: "destructive", title: "Generation failed", description: "Try again or check GitHub connection." });
    }
  };

  const steps = [
    { key: "fetching", label: "Fetching GitHub activity" },
    { key: "analyzing", label: "Analyzing commits" },
    { key: "writing", label: "Writing summary" },
  ];
  const stepIndex = ["fetching", "analyzing", "writing"].indexOf(step);

  if (step === "idle") {
    return (
      <>
        <DialogHeader><DialogTitle>Generate Report</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          ShipDesk will fetch this week's GitHub activity and generate a draft report using AI. You can edit and publish it afterward.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleGenerate} className="gap-2"><Zap className="h-4 w-4" /> Generate</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader><DialogTitle>Generating Report...</DialogTitle></DialogHeader>
      <div className="py-4 space-y-3">
        {steps.map((s, i) => {
          const isDone = stepIndex > i || step === "done";
          const isActive = stepIndex === i && step !== "done" && step !== "error";
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                {isDone ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <span className={`text-sm ${isActive ? "text-foreground font-medium" : isDone ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
        {step === "error" && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4" />
            Failed to generate report.
          </div>
        )}
      </div>
      {step === "error" && (
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleGenerate}>Retry</Button>
        </DialogFooter>
      )}
    </>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showReportViewer, setShowReportViewer] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState<ScopeChange | null>(null);

  const { data: project, isLoading } = useProject(id);
  const { data: reportsData } = useReports(id);
  const { data: invoicesData } = useInvoices(id);
  const { data: scopeChanges } = useScopeChanges(id);
  const { data: messagesData } = useMessages(id);
  const { data: files } = useFiles(id);
  const { data: uploadSig } = useUploadSignature(id);

  const markRead = useMarkMessagesRead();
  const sendMessage = useSendMessage();
  const generateReport = useGenerateReport();
  const updateReport = useUpdateReport();
  const createInvoice = useCreateInvoice();
  const markInvoicePaid = useMarkInvoicePaid();
  const deleteInvoice = useDeleteInvoice();
  const submitQuote = useSubmitQuote();
  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();

  const [invoiceForm, setInvoiceForm] = useState({
    title: "", description: "", amount: "", currency: "USD" as Currency, dueDate: ""
  });
  const [inviteEmail, setInviteEmail] = useState("");

  const [quoteForm, setQuoteForm] = useState({
    quoteDescription: "", quotePrice: "", quoteCurrency: "USD" as Currency
  });

  const reports = reportsData?.reports || [];
  const invoices = invoicesData?.invoices || [];
  const messages = messagesData?.messages || [];

  const selectedReport = reports.find((r) => r.id === showReportViewer);

  const handleUploadFile = async (file: File) => {
    if (!uploadSig) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", uploadSig.apiKey);
    formData.append("timestamp", String(uploadSig.timestamp));
    formData.append("signature", uploadSig.signature);
    formData.append("folder", uploadSig.folder);
    formData.append("upload_preset", uploadSig.uploadPreset);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${uploadSig.cloudName}/raw/upload`, { method: "POST", body: formData });
      const data = await res.json() as { secure_url: string; public_id: string; bytes: number; format: string };
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

  return (
    <div className="flex flex-col h-full">
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
            <Badge variant={
              project.status === "ACTIVE" ? "success" :
              project.status === "PAUSED" ? "warning" : "secondary"
            }>
              {project.status}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setShowInviteModal(true); }}>
              <Users className="h-4 w-4" /> Invite Client
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setShowInvoiceModal(true); }}>
              <Plus className="h-4 w-4" /> Invoice
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setShowGenerateModal(true)}>
              <Zap className="h-4 w-4" /> Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b bg-card px-6 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v);
          if (v === "messages") markRead.mutate(id);
        }}>
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

          <TabsContent value="overview" className="px-0 py-0 mt-0">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Unpaid Invoices</p>
                  <p className="text-2xl font-bold">{invoices.filter((i) => i.status !== "PAID").length}</p>
                </div>
                <div className="bg-card border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Scope Changes</p>
                  <p className="text-2xl font-bold">{(scopeChanges || []).length}</p>
                </div>
              </div>

              {project.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1">GitHub</p>
                {project.githubRepoFullName ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{project.githubRepoFullName}</span>
                    <Badge variant="success" className="text-xs">Connected</Badge>
                  </div>
                ) : (
                  <Badge variant="warning" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    No GitHub connected
                  </Badge>
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

          <TabsContent value="reports" className="px-0 py-0 mt-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Reports</h2>
                <Button size="sm" className="gap-1.5" onClick={() => setShowGenerateModal(true)}>
                  <Zap className="h-4 w-4" /> Generate
                </Button>
              </div>
              {reports.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No reports yet.</div>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="relative">
                      <ReportCard report={r} onClick={() => setShowReportViewer(r.id)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

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
                      onMarkPaid={(id) => markInvoicePaid.mutate(id)}
                      onDelete={(id) => deleteInvoice.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scope-changes" className="px-0 py-0 mt-0">
            <div className="p-6">
              <h2 className="font-semibold mb-4">Scope Changes</h2>
              {(scopeChanges || []).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No scope changes yet.</div>
              ) : (
                <div className="space-y-3">
                  {(scopeChanges || []).map((sc) => (
                    <div key={sc.id} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{sc.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{sc.description}</p>
                        </div>
                        <Badge variant={
                          sc.status === "PAID" ? "success" :
                          sc.status === "APPROVED" ? "info" :
                          sc.status === "PENDING" ? "warning" :
                          sc.status === "DECLINED" ? "destructive" : "secondary"
                        }>
                          {sc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {sc.urgency} URGENCY
                        </Badge>
                        {sc.status === "PENDING" && (
                          <Button size="sm" variant="outline" onClick={() => setShowQuoteModal(sc)}>
                            Write Quote
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="px-0 py-0 mt-0">
            <div className="p-6 space-y-4">
              <h2 className="font-semibold">Project Settings</h2>
              <div>
                <p className="text-sm font-medium mb-1">GitHub Repository</p>
                {project.githubRepoFullName ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="gap-1">
                      <Github className="h-3 w-3" />
                      {project.githubRepoFullName}
                    </Badge>
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
                <p className="text-xs font-mono text-muted-foreground">{project.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showGenerateModal} onOpenChange={() => setShowGenerateModal(false)}>
        <DialogContent>
          <GenerateReportModal projectId={id} onClose={() => setShowGenerateModal(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!showReportViewer} onOpenChange={() => setShowReportViewer(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          {selectedReport && <ReportViewer reportId={selectedReport.id} onPublish={() => {
            updateReport.mutate({ id: selectedReport.id, data: { status: "PUBLISHED" } });
            setShowReportViewer(null);
            toast({ title: "Report published" });
          }} />}
        </DialogContent>
      </Dialog>

      <Dialog open={showInvoiceModal} onOpenChange={() => setShowInvoiceModal(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={invoiceForm.title} onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })} placeholder="Website Redesign — Phase 2" maxLength={150} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={invoiceForm.description} onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })} placeholder="Invoice details..." rows={2} className="resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input type="number" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} placeholder="1500.00" min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={invoiceForm.currency} onValueChange={(v) => setInvoiceForm({ ...invoiceForm, currency: v as Currency })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "GBP", "CAD", "AUD"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>Cancel</Button>
            <Button
              disabled={!invoiceForm.title || !invoiceForm.amount || createInvoice.isPending}
              onClick={async () => {
                await createInvoice.mutateAsync({
                  projectId: id,
                  title: invoiceForm.title,
                  description: invoiceForm.description || undefined,
                  amount: parseFloat(invoiceForm.amount),
                  currency: invoiceForm.currency,
                  dueDate: invoiceForm.dueDate ? new Date(invoiceForm.dueDate).toISOString() : undefined,
                });
                setInvoiceForm({ title: "", description: "", amount: "", currency: "USD", dueDate: "" });
                setShowInvoiceModal(false);
                toast({ title: "Invoice created" });
              }}
            >
              {createInvoice.isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInviteModal} onOpenChange={() => setShowInviteModal(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Client</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Client Email *</Label>
              <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="client@example.com" />
            </div>
            <p className="text-xs text-muted-foreground">
              A magic link will be sent to this email granting access to this project's portal.
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
                  toast({ title: "Invitation sent" });
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

      <Dialog open={!!showQuoteModal} onOpenChange={() => setShowQuoteModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Write Quote</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              <strong>{showQuoteModal?.title}</strong>: {showQuoteModal?.description}
            </p>
            <div className="space-y-2">
              <Label>Quote Description *</Label>
              <Textarea value={quoteForm.quoteDescription} onChange={(e) => setQuoteForm({ ...quoteForm, quoteDescription: e.target.value })} placeholder="Describe what's included in the quote..." rows={3} className="resize-none" maxLength={10000} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" value={quoteForm.quotePrice} onChange={(e) => setQuoteForm({ ...quoteForm, quotePrice: e.target.value })} placeholder="500.00" min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={quoteForm.quoteCurrency} onValueChange={(v) => setQuoteForm({ ...quoteForm, quoteCurrency: v as Currency })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "GBP", "CAD", "AUD"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuoteModal(null)}>Cancel</Button>
            <Button
              disabled={!quoteForm.quoteDescription || !quoteForm.quotePrice || submitQuote.isPending}
              onClick={async () => {
                if (!showQuoteModal) return;
                await submitQuote.mutateAsync({
                  id: showQuoteModal.id,
                  quoteDescription: quoteForm.quoteDescription,
                  quotePrice: parseFloat(quoteForm.quotePrice),
                  quoteCurrency: quoteForm.quoteCurrency,
                });
                setShowQuoteModal(null);
                setQuoteForm({ quoteDescription: "", quotePrice: "", quoteCurrency: "USD" });
                toast({ title: "Quote sent" });
              }}
            >
              Send Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportViewer({ reportId, onPublish }: { reportId: string; onPublish: () => void }) {
  const { data: report, isLoading } = useReport(reportId);

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (!report) return null;

  const content = report.content;

  return (
    <div className="space-y-4">
      {content.generationWarning && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          AI could not structure this report — raw output is shown below.
        </div>
      )}
      {content.summary && (
        <div>
          <h4 className="font-semibold text-sm mb-1">Summary</h4>
          <p className="text-sm text-muted-foreground">{content.summary}</p>
        </div>
      )}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{content.rawMarkdown}</ReactMarkdown>
      </div>
      {report.status === "DRAFT" && (
        <div className="flex justify-end pt-2 border-t">
          <Button onClick={onPublish} className="gap-2">
            <Send className="h-4 w-4" /> Publish to Client
          </Button>
        </div>
      )}
    </div>
  );
}

