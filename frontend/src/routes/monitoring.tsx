import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, Card, StatusPill } from "../components/admin-layout";
import { api, type GasMeter } from "../lib/api";
import { Activity, Wifi, WifiOff, AlertTriangle, RefreshCw, Plus, Gauge } from "lucide-react";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Real-time fleet monitoring of prepaid gas meters and communication status." },
      { property: "og:title", content: "Live Monitoring — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Real-time fleet monitoring of prepaid gas meters." },
    ],
  }),
  component: MonitoringPage,
});

function MonitoringPage() {
  const [meters, setMeters] = useState<GasMeter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeters = () => {
    setLoading(true);
    api
      .getMeters()
      .then(setMeters)
      .catch((err) => console.error("Failed to fetch monitoring meters:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMeters();
    // Refresh every 10 seconds for real-time fleet observation
    const interval = setInterval(fetchMeters, 10000);
    return () => clearInterval(interval);
  }, []);

  const onlineMeters = meters.filter((m) => m.status === "ACTIVE");
  const offlineMeters = meters.filter((m) => m.status !== "ACTIVE");
  const alarms = meters.filter((m) => m.valveStatus === "CLOSED");

  return (
    <AdminLayout
      title="Live Monitoring"
      subtitle={`Real-time socket telemetry · Refreshing every 10s`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-[oklch(0.75_0.15_160/0.15)]">
              <Wifi className="h-5 w-5 text-[oklch(0.5_0.15_160)]" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[13px] text-muted-foreground">Online Devices</div>
              <div className="text-2xl font-bold tabular-nums">{onlineMeters.length}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-muted">
              <WifiOff className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[13px] text-muted-foreground">Offline Devices</div>
              <div className="text-2xl font-bold tabular-nums">{offlineMeters.length}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-[oklch(0.81_0.145_78/0.2)]">
              <AlertTriangle className="h-5 w-5 text-[oklch(0.5_0.13_78)]" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[13px] text-muted-foreground">Alarms / Valve Closed</div>
              <div className="text-2xl font-bold tabular-nums">{alarms.length}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-[17px] font-semibold text-foreground">Meter Fleet Grid</h3>
            <p className="text-[13px] text-muted-foreground">Active device connection & valve state</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMeters}
              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <StatusPill tone="info">
              <Activity className="h-3 w-3" /> Live Socket 5000
            </StatusPill>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-sm animate-pulse">
            Querying meter fleet...
          </div>
        ) : meters.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/60 grid place-items-center mb-4 text-primary border border-border/50">
              <Gauge className="h-7 w-7 text-primary/80" strokeWidth={1.5} />
            </div>
            <h4 className="text-[17px] font-semibold text-foreground mb-1">No Meters to Monitor</h4>
            <p className="text-[13px] text-muted-foreground mb-5 max-w-sm mx-auto">
              Your fleet is currently empty. Register meters to start receiving DLMS telemetry and monitor live connectivity.
            </p>
            <Link
              to="/meters"
              className="h-10 px-5 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Go to Meters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {meters.map((m) => (
              <div
                key={m.id}
                className="rounded-[14px] border border-border p-4 hover:border-primary/40 hover:shadow-md transition bg-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[13px] font-semibold text-foreground">{m.meterNumber}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {m.customer ? `${m.customer.firstName} ${m.customer.lastName}` : "Unassigned"}
                    </div>
                  </div>
                  <StatusPill tone={m.status === "ACTIVE" ? "success" : "muted"}>
                    {m.status}
                  </StatusPill>
                </div>
                <div className="mt-3 pt-3 border-t border-border/60 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Valve</div>
                    <span
                      className={[
                        "text-xs font-semibold px-2 py-0.5 rounded",
                        m.valveStatus === "OPEN"
                          ? "bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)]"
                          : "bg-destructive/15 text-destructive",
                      ].join(" ")}
                    >
                      {m.valveStatus}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Firmware</div>
                    <div className="text-[12px] font-mono text-muted-foreground">{m.firmwareVersion || "v1.0"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}