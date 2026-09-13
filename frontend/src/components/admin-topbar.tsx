import { Search, Shield, LogIn, LogOut, User } from "lucide-react";
import { useAuth, ROLE_CONFIG, type UserRole } from "../lib/auth-context";
import { Link, useNavigate } from "@tanstack/react-router";

export function AdminTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, role, switchRole, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const config = ROLE_CONFIG[role];

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="h-16 flex items-center gap-4 px-6 md:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-semibold text-foreground truncate">{title}</h1>
          {subtitle && <p className="text-[12px] text-muted-foreground truncate">{subtitle}</p>}
        </div>

        <div className="hidden md:flex items-center h-10 w-[300px] rounded-[10px] border border-border bg-card px-3.5 gap-2.5 focus-within:ring-2 focus-within:ring-ring/40 transition">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search meters, customers, tokens…"
            className="flex-1 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
          />
        </div>

        {/* Instant RBAC Demo Role Switcher */}
        <div className="flex items-center gap-2 bg-accent/60 p-1.5 rounded-xl border border-border">
          <Shield className="h-4 w-4 text-primary ml-1.5 shrink-0" />
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer pr-1"
            title="Switch active user role"
          >
            <option value="SUPER_ADMIN" className="bg-card text-foreground">
              Super Admin
            </option>
            <option value="FIELD_ENGINEER" className="bg-card text-foreground">
              Field Engineer
            </option>
            <option value="SUPPORT_STAFF" className="bg-card text-foreground">
              Support Staff
            </option>
            <option value="CONSUMER" className="bg-card text-foreground">
              Consumer Portal
            </option>
          </select>
        </div>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="h-10 px-3 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-xs font-medium inline-flex items-center gap-1.5 transition text-muted-foreground"
            title="Sign out of system"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="h-10 px-3 rounded-xl border border-border hover:bg-accent text-xs font-medium inline-flex items-center gap-1.5 transition text-foreground"
            title="Login as user"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}