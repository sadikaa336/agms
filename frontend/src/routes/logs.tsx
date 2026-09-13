import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import { api, type CommunicationLog } from "../lib/api";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Terminal } from "lucide-react";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Communication Logs — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Inspect DLMS/COSEM frames, retries and errors between meters and the server." },
      { property: "og:title", content: "Communication Logs — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Inspect DLMS/COSEM frames and communication errors." },
    ],
  }),
  component: LogsPage,
});

function LogsPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api
      .getCommunicationLogs()
      .then(setLogs)
      .catch((err) => console.error("Failed to fetch logs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout
      title="Communication Logs"
      subtitle="DLMS/COSEM raw TCP/IP frame telemetry recorded on port 5000"
    >
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Frame Auditor</span>
          <button
            onClick={fetchLogs}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground font-mono bg-accent/60 px-3 py-1.5 rounded-lg border border-border flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span>Socket: 0.0.0.0:5000</span>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={logs}
        emptyTitle="No Communication Packets Logged"
        emptyDescription="No DLMS/COSEM frames have been recorded yet. When a prepaid gas meter or test client transmits APDU packets to socket port 5000, raw frames, translation XML, and acknowledgements will appear here automatically."
        columns={[
          {
            key: "createdAt",
            header: "Timestamp",
            render: (r) => (
              <span className="font-mono text-[12px] text-muted-foreground">
                {r.createdAt ? new Date(r.createdAt).toLocaleTimeString() : "—"}
              </span>
            ),
          },
          {
            key: "direction",
            header: "Direction",
            render: (r) => (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold">
                {r.direction === "INCOMING" ? (
                  <>
                    <ArrowDownLeft className="h-3.5 w-3.5 text-[oklch(0.5_0.15_160)]" /> IN
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" /> OUT
                  </>
                )}
              </span>
            ),
          },
          {
            key: "meter",
            header: "Meter Device",
            render: (r) => (
              <span className="font-mono text-[13px] font-medium text-foreground">
                {r.meter ? r.meter.meterNumber : "Unknown / Broadcast"}
              </span>
            ),
          },
          {
            key: "packetData",
            header: "Payload / Frame",
            render: (r) => (
              <span className="font-mono text-[12px] text-muted-foreground truncate max-w-[340px] inline-block">
                {r.packetData}
              </span>
            ),
          },
          {
            key: "retryCount",
            header: "Retries",
            align: "right",
            render: (r) => <span className="tabular-nums text-foreground/80">{r.retryCount}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <StatusPill tone={r.status === "SUCCESS" ? "success" : "error"}>{r.status}</StatusPill>
            ),
          },
        ]}
      />
    </AdminLayout>
  );
}