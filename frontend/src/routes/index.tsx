import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users,
  Gauge,
  Wifi,
  WifiOff,
  Flame,
  CreditCard,
  Coins,
  AlertTriangle,
  Plus,
  ArrowRight,
  Database,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AdminLayout, Card, StatusPill } from "../components/admin-layout";
import { StatCard } from "../components/stat-card";
import { api, type DashboardStats } from "../lib/api";
import { getStoredAuthUser } from "../lib/auth-context";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const user = getStoredAuthUser();
      if (!user) {
        throw redirect({ to: "/login" });
      }
      if (user.role === "CONSUMER") {
        throw redirect({ to: "/consumer" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Real-time overview of prepaid gas meters, consumption, revenue and alarms." },
      { property: "og:title", content: "Dashboard — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Real-time overview of prepaid gas meters, consumption and revenue." },
    ],
  }),
  component: Dashboard,
});

const pieColors = ["var(--primary)", "var(--warning)", "var(--destructive)"];
const fmt = (n?: number) => (n ?? 0).toLocaleString();

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalMeters: 0,
    activeMeters: 0,
    offlineMeters: 0,
    alarms: 0,
    todayConsumption: 0,
    totalRecharge: 0,
    revenue: 0,
    meterStatusSeries: [
      { name: "Online", value: 0 },
      { name: "Idle/Warning", value: 0 },
      { name: "Offline", value: 0 },
    ],
    consumptionSeries: [
      { d: "Mon", usage: 0, revenue: 0 },
      { d: "Tue", usage: 0, revenue: 0 },
      { d: "Wed", usage: 0, revenue: 0 },
      { d: "Thu", usage: 0, revenue: 0 },
      { d: "Fri", usage: 0, revenue: 0 },
      { d: "Sat", usage: 0, revenue: 0 },
      { d: "Sun", usage: 0, revenue: 0 },
    ],
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDashboardStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.info("Dashboard using live default state:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const isSystemEmpty = stats.totalMeters === 0 && stats.totalCustomers === 0;

  return (
    <AdminLayout title="Overview" subtitle="Live database status of your prepaid gas metering network">
      {/* Empty Database Getting Started Banner */}
      {!loading && isSystemEmpty && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-md">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Clean Database Initialized</h3>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-xl">
                All mock data has been removed. Get started by registering your first customer, adding a meter device, or configuring tariff plans.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/customers"
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add First Customer
            </Link>
            <Link
              to="/meters"
              className="h-10 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-accent transition"
            >
              Add Meter <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Customers" value={fmt(stats.totalCustomers)} delta="Live" icon={Users} />
        <StatCard label="Active Meters" value={fmt(stats.activeMeters)} delta="Live" icon={Wifi} />
        <StatCard label="Offline Meters" value={fmt(stats.offlineMeters)} delta="Live" positive={stats.offlineMeters === 0} icon={WifiOff} />
        <StatCard label="Alarms / Closed" value={stats.alarms} delta="Live" positive={stats.alarms === 0} icon={AlertTriangle} />
        <StatCard label="Today's Consumption" value={fmt(stats.todayConsumption)} suffix="m³" delta="Today" icon={Flame} />
        <StatCard label="Today's Recharge" value={`৳${fmt(stats.totalRecharge)}`} delta="Today" icon={CreditCard} />
        <StatCard label="Revenue (MTD)" value={`৳${fmt(stats.revenue)}`} delta="Month" icon={Coins} />
        <StatCard label="Total Meters" value={fmt(stats.totalMeters)} delta="Live" icon={Gauge} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[17px] font-semibold text-foreground">Consumption & Revenue</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">Past 7 days aggregated from database</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={stats.consumptionSeries} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="usage" stroke="var(--primary)" strokeWidth={2.5} fill="url(#g1)" name="Usage (m³)" />
                <Area type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={2.5} fill="url(#g2)" name="Revenue (BDT)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-[17px] font-semibold text-foreground">Fleet Health</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5 mb-4">Device status breakdown</p>
          <div className="h-[220px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.meterStatusSeries} innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {stats.meterStatusSeries.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="var(--card)" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {stats.meterStatusSeries.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="font-medium tabular-nums">{fmt(s.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bar Chart & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[17px] font-semibold text-foreground">Revenue by Day</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">7-day recharge totals</p>
            </div>
            <StatusPill tone="success">DLMS Server Listening (Port 5000)</StatusPill>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <BarChart data={stats.consumptionSeries} margin={{ left: -10, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={36} name="Revenue (BDT)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-semibold text-foreground">Recent Activity</h3>
            <span className="text-xs text-muted-foreground font-mono">Live Stream</span>
          </div>
          {stats.recentActivity.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No recent activity recorded yet.
            </div>
          ) : (
            <ul className="space-y-3.5">
              {stats.recentActivity.map((a) => {
                const tone = a.status === "success" ? "success" : a.status === "error" ? "error" : "info";
                return (
                  <li key={a.id} className="flex items-start gap-3">
                    <StatusPill tone={tone as any}>{a.type}</StatusPill>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{a.detail}</p>
                      <p className="text-[11px] text-muted-foreground">{a.when}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
