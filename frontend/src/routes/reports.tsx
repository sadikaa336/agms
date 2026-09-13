import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, Card } from "../components/admin-layout";
import { Download, FileSpreadsheet, FileText, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Generate consumption, revenue and communication reports as PDF, Excel or CSV." },
      { property: "og:title", content: "Reports — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Generate consumption and revenue reports." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  { type: "meters", title: "Meter Fleet Inventory", desc: "All device IDs, serial numbers, locations and valve states", icon: FileBarChart },
  { type: "customers", title: "Customer Registry", desc: "Registered customers, contact info and assigned meters", icon: FileText },
  { type: "recharges", title: "Recharge Transactions", desc: "All issued DLMS/STS tokens, amounts and payment methods", icon: FileText },
  { type: "revenue", title: "Revenue Breakdown", desc: "Aggregated financial settlement logs from the database", icon: FileSpreadsheet },
];

function ReportsPage() {
  const handleExport = (type: string) => {
    window.open(`/api/reports/export/${type}`, "_blank");
  };

  return (
    <AdminLayout title="Reports" subtitle="Export real database records in CSV / Spreadsheet formats">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.title}>
              <div className="h-11 w-11 grid place-items-center rounded-xl bg-accent">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              </div>
              <div className="mt-4">
                <h3 className="text-[16px] font-semibold text-foreground">{r.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1">{r.desc}</p>
              </div>
              <div className="mt-5 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleExport(r.type)}
                  className="h-9 px-4 rounded-[10px] bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition text-sm inline-flex items-center gap-2 font-medium"
                >
                  <Download className="h-3.5 w-3.5" /> Download CSV Export
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
}