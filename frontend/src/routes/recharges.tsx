import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import { api, type Recharge } from "../lib/api";
import { ManualRechargeModal } from "../components/modals/ManualRechargeModal";
import { CreditCard, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/recharges")({
  head: () => ({
    meta: [
      { title: "Recharges — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Track prepaid gas recharges, tokens, payment methods and failed transactions." },
      { property: "og:title", content: "Recharges — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Track prepaid gas recharges and payment transactions." },
    ],
  }),
  component: RechargesPage,
});

function RechargesPage() {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRecharges = () => {
    setLoading(true);
    api
      .getRecharges()
      .then(setRecharges)
      .catch((err) => console.error("Failed to fetch recharges:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecharges();
  }, []);

  const totalAmount = recharges.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <AdminLayout
      title="Recharges"
      subtitle={`${recharges.length} transactions · ৳${totalAmount.toFixed(2)} total settled`}
    >
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Tokens & Settlements</span>
          <button
            onClick={fetchRecharges}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
        >
          <CreditCard className="h-4 w-4" /> Manual Recharge
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={recharges}
        emptyTitle="No Recharges Recorded"
        emptyDescription="There are no recharge transactions in the system yet. Click below to issue a 20-digit DLMS recharge token and allocate monetary balance to a meter."
        emptyActionLabel="Issue First Recharge"
        onEmptyAction={() => setModalOpen(true)}
        columns={[
          {
            key: "id",
            header: "Ref #",
            render: (r) => <span className="font-mono text-[13px] text-muted-foreground">#RCG-{r.id}</span>,
          },
          {
            key: "meter",
            header: "Meter Device",
            render: (r) => (
              <div>
                <span className="font-mono text-[13px] font-medium text-foreground">
                  {r.meter ? r.meter.meterNumber : "—"}
                </span>
                {r.meter?.serialNumber && (
                  <div className="text-[11px] text-muted-foreground">SN: {r.meter.serialNumber}</div>
                )}
              </div>
            ),
          },
          {
            key: "amount",
            header: "Amount (৳)",
            align: "right",
            render: (r) => (
              <span className="font-semibold tabular-nums text-foreground">৳{Number(r.amount).toFixed(2)}</span>
            ),
          },
          {
            key: "method",
            header: "Payment Method",
            render: (r) => (
              <span className="text-xs px-2.5 py-1 rounded-md bg-accent text-foreground font-medium">
                {r.paymentMethod}
              </span>
            ),
          },
          {
            key: "token",
            header: "DLMS / STS Token",
            render: (r) => (
              <span className="font-mono text-[12px] text-primary tracking-wider font-semibold">
                {r.token}
              </span>
            ),
          },
          {
            key: "date",
            header: "Timestamp",
            render: (r) => (
              <span className="text-muted-foreground text-[12px]">
                {r.createdAt ? new Date(r.createdAt).toLocaleString() : "Just now"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <StatusPill tone={r.status === "SUCCESSFUL" ? "success" : "error"}>{r.status}</StatusPill>
            ),
          },
        ]}
      />

      <ManualRechargeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchRecharges}
      />
    </AdminLayout>
  );
}