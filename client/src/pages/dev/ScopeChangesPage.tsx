import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScopeChangeCard } from "@/components/scope/ScopeChangeCard";
import { QuoteForm } from "@/components/scope/QuoteForm";
import { useScopeChanges, useSubmitQuote, useMarkScopeChangePaid } from "@/hooks/useScopeChanges";
import { toast } from "@/hooks/use-toast";
import { ScopeChange, Currency } from "@/types";

const STATUSES = ["all", "PENDING", "QUOTED", "APPROVED", "DECLINED", "PAID"];

export function ScopeChangesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [quoteTarget, setQuoteTarget] = useState<ScopeChange | null>(null);

  const { data: scopeChanges, isLoading } = useScopeChanges(
    undefined,
    statusFilter === "all" ? undefined : statusFilter
  );
  const submitQuote = useSubmitQuote();
  const markPaid = useMarkScopeChangePaid();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scope Changes</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (scopeChanges || []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          {statusFilter === "all"
            ? "No scope change requests yet."
            : `No ${statusFilter.toLowerCase()} scope changes.`}
        </div>
      ) : (
        <div className="space-y-3">
          {(scopeChanges || []).map((sc) => (
            <ScopeChangeCard
              key={sc.id}
              sc={sc}
              onWriteQuote={setQuoteTarget}
              onMarkPaid={(id) => {
                markPaid.mutate(id);
                toast({ title: "Marked as paid" });
              }}
            />
          ))}
        </div>
      )}

      <QuoteForm
        scopeChange={quoteTarget}
        onClose={() => setQuoteTarget(null)}
        onSubmit={async ({ id, quoteDescription, quotePrice, quoteCurrency }) => {
          await submitQuote.mutateAsync({ id, quoteDescription, quotePrice, quoteCurrency });
          setQuoteTarget(null);
          toast({ title: "Quote sent to client" });
        }}
      />
    </div>
  );
}
