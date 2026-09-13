import { type ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

export function AdminLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    } else if (role === "CONSUMER") {
      navigate({ to: "/consumer" });
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-medium">Authenticating, redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:pl-[250px]">
        <AdminTopbar title={title} subtitle={subtitle} />
        <main className="p-6 md:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={["bg-card rounded-[14px] border border-border p-6 shadow-[var(--shadow-card)]", className].join(" ")}>
      {children}
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "success" | "warning" | "error" | "info" | "muted"; children: ReactNode }) {
  const map: Record<string, string> = {
    success: "bg-[oklch(0.75_0.15_160/0.12)] text-[oklch(0.5_0.15_160)]",
    warning: "bg-[oklch(0.81_0.145_78/0.18)] text-[oklch(0.5_0.13_78)]",
    error: "bg-[oklch(0.7_0.19_15/0.12)] text-[oklch(0.55_0.19_15)]",
    info: "bg-[oklch(0.68_0.16_250/0.12)] text-[oklch(0.5_0.16_250)]",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span className={["inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", map[tone]].join(" ")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}