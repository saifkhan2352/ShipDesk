import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScopeChanges, useSubmitQuote, useMarkScopeChangePaid } from "@/hooks/useScopeChanges";
import { toast } from "@/hooks/use-toast";
import { formatRelative } from "@/lib/utils";
import { Currency, ScopeChange } from "@/types";

const STATUS_COLORS: Record<string, "warning" | "info" | "success" | "destructive" | "secondary"> = {
  PENDING: "warning",
  QUOTED: "info",
  APPROVED: "info",
  DECLINED: "destructive",
  PAID: "success",
};

export function ScopeChangesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [showQuoteModal, setShowQuoteModal] = useState<ScopeChange | null>(null);
  const [quoteForm, setQuoteForm] = useState({ quoteDescription: "", quotePrice: "", quoteCurrency: "USD" as Currency });

  const { data: scopeChanges, isLoading } = useScopeChanges(
    undefined,
    statusFilter === "all" ? undefined : statusFilter
  );
  const submitQuote = useSubmitQuote();
  const markPaid = useMarkScopeChangePaid();

  const statuses = ["all", "PENDING", "QUOTED", "APPROVED", "DECLINED", "PAID"];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scope Changes</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : (scopeChanges || []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">No scope changes found.</div>
      ) : (
        <div className="space-y-3">
          {(scopeChanges || []).map((sc) => (
            <div key={sc.id} className="border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{sc.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{sc.description}</p>
                </div>
                <Badge variant={STATUS_COLORS[sc.status] || "secondary"}>{sc.status}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="text-xs">{sc.urgency}</Badge>
                <span className="text-xs text-muted-foreground">{formatRelative(sc.submittedAt)}</span>
                {sc.status === "PENDING" && (
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => setShowQuoteModal(sc)}>
                    Write Quote
                  </Button>
                )}
                {sc.status === "APPROVED" && (
                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => { markPaid.mutate(sc.id); toast({ title: "Marked as paid" }); }}>
                    Mark Paid
                  </Button>
                )}
              </div>
              {sc.quotePrice && (
                <p className="text-sm font-medium mt-2 text-primary">
                  Quote: {sc.quoteCurrency} {sc.quotePrice}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!showQuoteModal} onOpenChange={() => setShowQuoteModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Write Quote</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Request: <strong>{showQuoteModal?.title}</strong></p>
            <div className="space-y-2">
              <Label>Quote Description *</Label>
              <Textarea
                value={quoteForm.quoteDescription}
                onChange={(e) => setQuoteForm({ ...quoteForm, quoteDescription: e.target.value })}
                placeholder="Describe the work included..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" value={quoteForm.quotePrice} onChange={(e) => setQuoteForm({ ...quoteForm, quotePrice: e.target.value })} placeholder="500.00" />
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
                await submitQuote.mutateAsync({ id: showQuoteModal.id, quoteDescription: quoteForm.quoteDescription, quotePrice: parseFloat(quoteForm.quotePrice), quoteCurrency: quoteForm.quoteCurrency });
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
