import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, delta, positive = true, icon: Icon, suffix }: { label: string; value: string | number; delta?: string; positive?: boolean; icon: LucideIcon; suffix?: string }) {
  return (
    <div className="bg-card rounded-[14px] border border-border p-6 shadow-[var(--shadow-card)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="text-[13px] text-muted-foreground font-medium">{label}</div>
        <div className="h-10 w-10 grid place-items-center rounded-xl bg-accent">
          <Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-[36px] leading-none font-bold tracking-tight text-foreground tabular-nums">{value}</div>
        {suffix && <div className="text-sm text-muted-foreground font-medium">{suffix}</div>}
      </div>
      {delta && (
        <div className={["inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", positive ? "bg-[oklch(0.75_0.15_160/0.12)] text-[oklch(0.5_0.15_160)]" : "bg-[oklch(0.7_0.19_15/0.12)] text-[oklch(0.55_0.19_15)]"].join(" ")}>
          {positive ? "▲" : "▼"} {delta}
          <span className="text-muted-foreground font-normal">vs last week</span>
        </div>
      )}
    </div>
  );
}