import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "SUPER_ADMIN" | "FIELD_ENGINEER" | "SUPPORT_STAFF" | "CONSUMER";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
  customerId?: number;
}

export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; description: string; badgeTone: "primary" | "warning" | "success" | "info" }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    description: "Full system authority, tariffs, RBAC users, fleet and financials",
    badgeTone: "primary",
  },
  FIELD_ENGINEER: {
    label: "Field Engineer",
    description: "Meter installation, remote valve control, socket frame diagnostics",
    badgeTone: "warning",
  },
  SUPPORT_STAFF: {
    label: "Support Staff",
    description: "Customer registration, manual token issuance, billing queries",
    badgeTone: "success",
  },
  CONSUMER: {
    label: "Consumer",
    description: "Personal gas meter dashboard, balance tracking and online recharge",
    badgeTone: "info",
  },
};

export const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  SUPER_ADMIN: {
    id: 1,
    username: "superadmin",
    email: "superadmin@gasflow.local",
    role: "SUPER_ADMIN",
  },
  FIELD_ENGINEER: {
    id: 2,
    username: "engineer",
    email: "engineer@gasflow.local",
    role: "FIELD_ENGINEER",
  },
  SUPPORT_STAFF: {
    id: 3,
    username: "support",
    email: "support@gasflow.local",
    role: "SUPPORT_STAFF",
  },
  CONSUMER: {
    id: 4,
    username: "consumer",
    email: "consumer@gasflow.local",
    role: "CONSUMER",
    customerId: 1,
  },
};

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (newRole: UserRole) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  // Permissions
  canManageUsers: () => boolean;
  canManageTariffs: () => boolean;
  canControlValve: () => boolean;
  canDeleteMeters: () => boolean;
  canManageCustomers: () => boolean;
  canIssueRecharge: () => boolean;
  canViewLogs: () => boolean;
  canAccessReports: () => boolean;
  isConsumer: () => boolean;
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const saved = sessionStorage.getItem("gasflow_auth_user");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return getStoredAuthUser();
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear legacy persistent localStorage to prevent bypassing login on initial start
      localStorage.removeItem("gasflow_auth_user");
      if (user) {
        sessionStorage.setItem("gasflow_auth_user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("gasflow_auth_user");
      }
    }
  }, [user]);

  const switchRole = (newRole: UserRole) => {
    const newUser = DEFAULT_USERS[newRole];
    setUser(newUser);
  };

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("gasflow_auth_user");
      localStorage.removeItem("gasflow_auth_user");
    }
  };

  const role: UserRole = user ? user.role : "SUPER_ADMIN";
  const isAuthenticated = user !== null;

  // Permission checkers
  const canManageUsers = () => user?.role === "SUPER_ADMIN";
  const canManageTariffs = () => user?.role === "SUPER_ADMIN";
  const canControlValve = () => user?.role === "SUPER_ADMIN" || user?.role === "FIELD_ENGINEER";
  const canDeleteMeters = () => user?.role === "SUPER_ADMIN";
  const canManageCustomers = () => user?.role === "SUPER_ADMIN" || user?.role === "SUPPORT_STAFF";
  const canIssueRecharge = () =>
    user?.role === "SUPER_ADMIN" || user?.role === "SUPPORT_STAFF" || user?.role === "CONSUMER";
  const canViewLogs = () => user?.role === "SUPER_ADMIN" || user?.role === "FIELD_ENGINEER";
  const canAccessReports = () =>
    user?.role === "SUPER_ADMIN" || user?.role === "FIELD_ENGINEER" || user?.role === "SUPPORT_STAFF";
  const isConsumer = () => user?.role === "CONSUMER";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        switchRole,
        login,
        logout,
        canManageUsers,
        canManageTariffs,
        canControlValve,
        canDeleteMeters,
        canManageCustomers,
        canIssueRecharge,
        canViewLogs,
        canAccessReports,
        isConsumer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
