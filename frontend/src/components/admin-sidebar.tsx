import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Gauge,
  Receipt,
  CreditCard,
  Activity,
  UserCog,
  FileBarChart,
  Radio,
  Flame,
  Home,
  Sliders,
  MapPin,
  LogOut,
} from "lucide-react";
import { useAuth, ROLE_CONFIG } from "../lib/auth-context";

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const roleConfig = ROLE_CONFIG[role];

  const getNavItems = () => {
    if (role === "CONSUMER") {
      return [
        { to: "/consumer", label: "My Gas Meter", icon: Home },
        { to: "/recharges", label: "Recharge History", icon: CreditCard },
      ];
    }
    if (role === "FIELD_ENGINEER") {
      return [
        { to: "/", label: "Dashboard", icon: LayoutDashboard },
        { to: "/simulator", label: "Meter Simulator", icon: Sliders },
        { to: "/meters", label: "Meter Hardware", icon: Gauge },
        { to: "/monitoring", label: "Live Telemetry", icon: Activity },
        { to: "/locations", label: "Locations & Zoning", icon: MapPin },
        { to: "/logs", label: "DLMS Frame Logs", icon: Radio },
        { to: "/reports", label: "Fleet Reports", icon: FileBarChart },
      ];
    }
    if (role === "SUPPORT_STAFF") {
      return [
        { to: "/", label: "Dashboard", icon: LayoutDashboard },
        { to: "/simulator", label: "Meter Simulator", icon: Sliders },
        { to: "/customers", label: "Customers", icon: Users },
        { to: "/locations", label: "Locations & Zoning", icon: MapPin },
        { to: "/meters", label: "Meter Registry", icon: Gauge },
        { to: "/recharges", label: "Manual Recharge", icon: CreditCard },
        { to: "/reports", label: "Billing Reports", icon: FileBarChart },
      ];
    }
    // SUPER_ADMIN (Full)
    return [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/simulator", label: "Meter Simulator", icon: Sliders },
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/locations", label: "Locations & Zoning", icon: MapPin },
      { to: "/meters", label: "Meters", icon: Gauge },
      { to: "/monitoring", label: "Live Monitoring", icon: Activity },
      { to: "/tariffs", label: "Tariffs", icon: Receipt },
      { to: "/recharges", label: "Recharges", icon: CreditCard },
      { to: "/reports", label: "Reports", icon: FileBarChart },
      { to: "/logs", label: "Communication", icon: Radio },
      { to: "/users", label: "Users & Roles", icon: UserCog },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[250px] flex-col border-r border-sidebar-border bg-sidebar z-30">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[14px] font-semibold tracking-tight leading-tight">Automated Gas Meter</div>
          <div className="text-[10px] text-muted-foreground">Prepaid Management Software</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <div className="px-3 pt-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {role === "CONSUMER" ? "Consumer Portal" : "Management"}
        </div>
        {navItems.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-foreground/70 hover:bg-accent/60 hover:text-foreground",
              ].join(" ")}
            >
              <Icon
                className={["h-[18px] w-[18px]", active ? "text-primary" : "text-muted-foreground"].join(
                  " "
                )}
                strokeWidth={1.75}
              />
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Active User Card & Current Role */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-xl bg-accent/60 p-2.5 flex items-center gap-2.5 border border-border/40">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold uppercase shrink-0">
            {(user?.username || "AD").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate text-foreground">
              {user?.username || "Administrator"}
            </div>
            <div className="text-[10px] font-medium text-primary truncate">
              {roleConfig.label}
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 grid place-items-center transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}