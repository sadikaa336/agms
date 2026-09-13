import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, Card, StatusPill } from "../components/admin-layout";
import { api, type GasMeter } from "../lib/api";
import { useAuth, getStoredAuthUser } from "../lib/auth-context";
import { Flame, CreditCard, Power, PhoneCall, CheckCircle2, AlertCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/consumer")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = getStoredAuthUser();
      if (!stored) {
        throw redirect({ to: "/login" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Consumer Portal — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Check prepaid balance, gas consumption and recharge tokens online." },
      { property: "og:title", content: "Consumer Portal — Automated Prepaid Gas Meter Management Software" },
    ],
  }),
  component: ConsumerPage,
});

function ConsumerPage() {
  const { user } = useAuth();
  const [meter, setMeter] = useState<GasMeter | null>(null);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState("20.00");
  const [rechargeSuccess, setRechargeSuccess] = useState<string | null>(null);
  const [rechargeLoading, setRechargeLoading] = useState(false);

  useEffect(() => {
    // Fetch user's meter from the database
    api
      .getMeters()
      .then((meters) => {
        if (meters.length > 0) {
          // If consumer has an assigned meter, find it, or pick first
          const found =
            (user?.customerId ? meters.find((m) => m.customer?.id === user.customerId) : null) ||
            meters[0];
          setMeter(found);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [user?.customerId]);

  const handleSelfRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meter) return;
    setRechargeLoading(true);
    setRechargeSuccess(null);
    try {
      const res = await api.createRecharge(meter.id, Number(rechargeAmount), "DIGITAL_WALLET");
      setRechargeSuccess(`Recharge successful! Token generated: ${res.token}`);
    } catch (err: any) {
      alert(err.message || "Failed to process recharge");
    } finally {
      setRechargeLoading(false);
    }
  };

  const sampleUsage = [
    { day: "Mon", usage: 0.32 },
    { day: "Tue", usage: 0.45 },
    { day: "Wed", usage: 0.28 },
    { day: "Thu", usage: 0.51 },
    { day: "Fri", usage: 0.39 },
    { day: "Sat", usage: 0.62 },
    { day: "Sun", usage: 0.48 },
  ];

  return (
    <AdminLayout
      title="Consumer Portal"
      subtitle={`Welcome back, ${user?.username ?? "Consumer"} · Account ID #${user?.id ?? "—"}`}
    >
      {/* Consumer KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-medium">
                Remaining Balance
              </div>
              <div className="text-2xl font-bold tabular-nums text-foreground mt-0.5">
                ৳{meter?.balance !== undefined ? Number(meter.balance).toFixed(2) : "45.80"}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)]">
              <Power className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-medium">
                Valve Status
              </div>
              <div className="text-2xl font-bold text-foreground mt-0.5">
                {meter?.valveStatus || "OPEN"}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-accent text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-medium">
                Today's Usage
              </div>
              <div className="text-2xl font-bold tabular-nums text-foreground mt-0.5">0.48 m³</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center bg-accent text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground uppercase tracking-wider font-medium">
                Assigned Meter
              </div>
              <div className="text-base font-mono font-bold text-foreground mt-0.5">
                {meter?.meterNumber || "MTR-2410"}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Usage Trend */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-foreground">My Weekly Consumption</h3>
              <p className="text-[12px] text-muted-foreground">Volume consumed in Cubic Meters (m³)</p>
            </div>
            <StatusPill tone="success">Meter Active</StatusPill>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={sampleUsage} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="usage" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gCons)" name="Usage (m³)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Online Self-Recharge Card */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="text-[16px] font-semibold text-foreground">Quick Online Recharge</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Add credit directly to your gas meter index using Mobile Banking or Cards.
          </p>

          {rechargeSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary text-xs font-mono font-medium border border-primary/20">
              {rechargeSuccess}
            </div>
          )}

          <form onSubmit={handleSelfRecharge} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Select Amount (BDT / ৳)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {["10.00", "20.00", "50.00"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmount(amt)}
                    className={[
                      "h-9 rounded-lg text-xs font-semibold border transition",
                      rechargeAmount === amt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent",
                    ].join(" ")}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
              <input
                required
                type="number"
                step="0.01"
                min="5"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Payment Channel
              </label>
              <select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none">
                <option>Mobile Banking (bKash / Nagad)</option>
                <option>VISA / Mastercard Debit</option>
                <option>Digital Wallet</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={rechargeLoading}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              {rechargeLoading ? "Authorizing Payment..." : "Instant Recharge Now"}
            </button>
          </form>

          {/* Emergency Support Hotline */}
          <div className="mt-6 pt-4 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
              <PhoneCall className="h-3.5 w-3.5 text-primary" />
              24/7 Gas Support Hotline
            </div>
            <div className="text-xs text-muted-foreground">
              Dial <span className="font-semibold text-foreground">16499</span> for gas leak emergencies or service disruption.
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
