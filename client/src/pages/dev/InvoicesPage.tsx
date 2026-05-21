import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { useInvoices, useMarkInvoicePaid, useDeleteInvoice } from "@/hooks/useInvoices";
import { toast } from "@/hooks/use-toast";

const STATUS_TABS = ["all", "UNPAID", "PAID", "OVERDUE"] as const;

export function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useInvoices(
    undefined,
    statusFilter === "all" ? undefined : statusFilter
  );
  const markPaid = useMarkInvoicePaid();
  const deleteInvoice = useDeleteInvoice();

  const invoices = data?.invoices || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm">
            {statusFilter === "all" ? "No invoices yet. Create one to get started." : `No ${statusFilter.toLowerCase()} invoices.`}
          </p>
          {statusFilter === "all" && (
            <Button variant="outline" className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> Create your first invoice
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onMarkPaid={(id) => {
                markPaid.mutate(id);
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

      <InvoiceForm
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
