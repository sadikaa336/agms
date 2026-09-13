import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import { api, type GasMeter } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { AddMeterModal } from "../components/modals/AddMeterModal";
import { Plus, Power, Trash2, RefreshCw, Lock, Sliders } from "lucide-react";

export const Route = createFileRoute("/meters")({
  head: () => ({
    meta: [
      { title: "Meters — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Manage DLMS/COSEM prepaid gas meters, firmware, and remote actions." },
      { property: "og:title", content: "Meters — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Manage prepaid gas meters, firmware, and remote actions." },
    ],
  }),
  component: MetersPage,
});

function MetersPage() {
  const { canControlValve, canDeleteMeters, role } = useAuth();
  const [meters, setMeters] = useState<GasMeter[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchMeters = () => {
    setLoading(true);
    api
      .getMeters()
      .then(setMeters)
      .catch((err) => {
        console.error("Failed to fetch meters:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  const handleToggleValve = async (m: GasMeter) => {
    if (!canControlValve()) {
      alert("Permission denied: Valve operation restricted to Field Engineers and Super Admins.");
      return;
    }
    const targetStatus = m.valveStatus === "OPEN" ? "CLOSED" : "OPEN";
    setActionLoadingId(m.id);
    try {
      await api.toggleValve(m.id, targetStatus as "OPEN" | "CLOSED");
      fetchMeters();
    } catch (err: any) {
      alert(err.message || "Failed to toggle valve");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteMeter = async (id: number) => {
    if (!canDeleteMeters()) {
      alert("Permission denied: Only Super Admins may delete meters.");
      return;
    }
    if (!confirm("Are you sure you want to remove this gas meter?")) return;
    try {
      await api.deleteMeter(id);
      fetchMeters();
    } catch (err: any) {
      alert(err.message || "Failed to delete meter");
    }
  };

  const activeCount = meters.filter((m) => m.status === "ACTIVE").length;
  const totalBalance = meters.reduce((sum, m) => sum + (m.balance || 0), 0);

  return (
    <AdminLayout
      title="Meters"
      subtitle={`${meters.length} registered · ${activeCount} active · ৳${totalBalance.toFixed(2)} total balance`}
    >
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="text-[13px] text-muted-foreground flex items-center gap-2">
          <span>DLMS/COSEM · TCP/IP Socket (Port 5000)</span>
          <button
            onClick={fetchMeters}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/simulator"
            className="h-10 px-4 rounded-[10px] border border-border bg-card text-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-accent transition"
          >
            <Sliders className="h-4 w-4 text-primary" /> Hardware Simulator
          </Link>

          {canControlValve() && (
            <button
              onClick={() => setModalOpen(true)}
              className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Meter
            </button>
          )}
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={meters}
        emptyTitle="No Gas Meters Registered"
        emptyDescription="Your device inventory is empty. Register your first DLMS/COSEM meter to enable real-time telemetry, remote valve shutoff, and token recharge."
        emptyActionLabel={canControlValve() ? "Register First Meter" : undefined}
        onEmptyAction={canControlValve() ? () => setModalOpen(true) : undefined}
        columns={[
          {
            key: "meterNumber",
            header: "Meter Device",
            render: (r) => (
              <div>
                <div className="font-mono text-[13px] font-medium text-foreground">{r.meterNumber}</div>
                <div className="text-[12px] text-muted-foreground">SN: {r.serialNumber}</div>
              </div>
            ),
          },
          {
            key: "communicationId",
            header: "Comm ID",
            render: (r) => <span className="font-mono text-[12px] text-foreground/80">{r.communicationId}</span>,
          },
          {
            key: "customer",
            header: "Customer",
            render: (r) =>
              r.customer ? (
                <div>
                  <div className="font-medium text-foreground">
                    {r.customer.firstName} {r.customer.lastName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{r.customer.phone}</div>
                </div>
              ) : (
                <span className="text-muted-foreground text-xs italic">Unassigned</span>
              ),
          },
          {
            key: "reading",
            header: "Current Reading",
            align: "right",
            render: (r) => (
              <div className="text-right">
                <span className="font-mono font-bold text-foreground tabular-nums text-[13px]">
                  {(r.reading !== undefined && r.reading !== null ? Number(r.reading) : 0).toFixed(3)}
                </span>
                <span className="text-[11px] text-muted-foreground ml-1">m³</span>
              </div>
            ),
          },
          {
            key: "balance",
            header: "Available Balance",
            align: "right",
            render: (r) => {
              const bal = r.balance !== undefined && r.balance !== null ? Number(r.balance) : 0;
              const isLow = bal <= 0;
              return (
                <div className="text-right">
                  <span
                    className={`font-semibold tabular-nums font-mono text-xs px-2 py-0.5 rounded-md inline-block ${
                      isLow
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                        : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    }`}
                  >
                    ৳{bal.toFixed(2)}
                  </span>
                </div>
              );
            },
          },
          {
            key: "location",
            header: "Location",
            render: (r) => (
              <span className="text-xs text-foreground/80 max-w-[180px] truncate inline-block">
                {r.installationLocation || "Not specified"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <StatusPill tone={r.status === "ACTIVE" ? "success" : "muted"}>{r.status}</StatusPill>
            ),
          },
          {
            key: "valve",
            header: "Valve Control",
            render: (r) =>
              canControlValve() ? (
                <button
                  onClick={() => handleToggleValve(r)}
                  disabled={actionLoadingId === r.id}
                  className={[
                    "h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition",
                    r.valveStatus === "OPEN"
                      ? "bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)] hover:bg-[oklch(0.75_0.15_160/0.25)]"
                      : "bg-destructive/10 text-destructive hover:bg-destructive/20",
                  ].join(" ")}
                  title="Field Engineer / Super Admin remote action"
                >
                  <Power className="h-3 w-3" />
                  {r.valveStatus === "OPEN" ? "Valve Open" : "Valve Closed"}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded">
                  <Lock className="h-3 w-3" /> {r.valveStatus}
                </span>
              ),
          },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (r) =>
              canDeleteMeters() ? (
                <button
                  onClick={() => handleDeleteMeter(r.id)}
                  className="h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Super Admin Only: Delete Meter"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              ),
          },
        ]}
      />

      {canControlValve() && (
        <AddMeterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchMeters}
        />
      )}
    </AdminLayout>
  );
}