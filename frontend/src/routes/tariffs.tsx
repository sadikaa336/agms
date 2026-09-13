import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import { api, type Tariff } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { NewTariffModal } from "../components/modals/NewTariffModal";
import { Plus, Trash2, RefreshCw, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/tariffs")({
  head: () => ({
    meta: [
      { title: "Tariffs — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Configure unit price, VAT, fixed and service charges for prepaid gas billing." },
      { property: "og:title", content: "Tariffs — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Configure prepaid gas tariff plans, VAT and service charges." },
    ],
  }),
  component: TariffsPage,
});

function TariffsPage() {
  const { canManageTariffs } = useAuth();
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTariffs = () => {
    setLoading(true);
    api
      .getTariffs()
      .then(setTariffs)
      .catch((err) => console.error("Failed to fetch tariffs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!canManageTariffs()) {
      alert("Permission denied: Super Admin role required to modify tariffs.");
      return;
    }
    if (!confirm("Are you sure you want to delete this tariff plan?")) return;
    try {
      await api.deleteTariff(id);
      fetchTariffs();
    } catch (err: any) {
      alert(err.message || "Failed to delete tariff");
    }
  };

  return (
    <AdminLayout
      title="Tariff Management"
      subtitle="Unit price, VAT %, monthly fixed, and service charges"
    >
      {!canManageTariffs() && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>View-only mode: Only Super Administrators have permission to modify gas pricing, VAT, and charges.</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rate Configurations</span>
          <button
            onClick={fetchTariffs}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {canManageTariffs() && (
          <button
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Tariff
          </button>
        )}
      </div>

      <DataTable
        loading={loading}
        rows={tariffs}
        emptyTitle="No Tariffs Configured"
        emptyDescription="No gas tariff plans exist in the database. Define unit rates, tax percentages, and fixed charges to calculate billing index for meters."
        emptyActionLabel={canManageTariffs() ? "Create First Tariff" : undefined}
        onEmptyAction={canManageTariffs() ? () => setModalOpen(true) : undefined}
        columns={[
          {
            key: "name",
            header: "Plan Name",
            render: (r) => (
              <div>
                <div className="font-semibold text-foreground">{r.name}</div>
                <div className="text-[12px] text-muted-foreground">ID #{r.id}</div>
              </div>
            ),
          },
          {
            key: "unitPrice",
            header: "Unit Price (৳ / m³)",
            align: "right",
            render: (r) => (
              <span className="tabular-nums font-semibold text-foreground">
                ৳{Number(r.unitPrice).toFixed(2)} / m³
              </span>
            ),
          },
          {
            key: "vatPercentage",
            header: "VAT (%)",
            align: "right",
            render: (r) => (
              <span className="tabular-nums text-foreground/80">{Number(r.vatPercentage).toFixed(2)}%</span>
            ),
          },
          {
            key: "fixedCharge",
            header: "Fixed Charge (৳)",
            align: "right",
            render: (r) => (
              <span className="tabular-nums text-foreground/80">৳{Number(r.fixedCharge).toFixed(2)}</span>
            ),
          },
          {
            key: "serviceCharge",
            header: "Service Charge (৳)",
            align: "right",
            render: (r) => (
              <span className="tabular-nums text-foreground/80">৳{Number(r.serviceCharge).toFixed(2)}</span>
            ),
          },
          {
            key: "active",
            header: "Status",
            render: (r) => (
              <StatusPill tone={r.isActive ? "success" : "muted"}>
                {r.isActive ? "Active" : "Disabled"}
              </StatusPill>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (r) =>
              canManageTariffs() ? (
                <button
                  onClick={() => handleDelete(r.id)}
                  className="h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Super Admin Only: Delete Tariff"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              ),
          },
        ]}
      />

      {canManageTariffs() && (
        <NewTariffModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchTariffs}
        />
      )}
    </AdminLayout>
  );
}