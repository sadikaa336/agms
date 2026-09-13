import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-Bn8DClbS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_CONFIG = {
	SUPER_ADMIN: {
		label: "Super Admin",
		description: "Full system authority, tariffs, RBAC users, fleet and financials",
		badgeTone: "primary"
	},
	FIELD_ENGINEER: {
		label: "Field Engineer",
		description: "Meter installation, remote valve control, socket frame diagnostics",
		badgeTone: "warning"
	},
	SUPPORT_STAFF: {
		label: "Support Staff",
		description: "Customer registration, manual token issuance, billing queries",
		badgeTone: "success"
	},
	CONSUMER: {
		label: "Consumer",
		description: "Personal gas meter dashboard, balance tracking and online recharge",
		badgeTone: "info"
	}
};
var DEFAULT_USERS = {
	SUPER_ADMIN: {
		id: 1,
		username: "superadmin",
		email: "superadmin@gasflow.local",
		role: "SUPER_ADMIN"
	},
	FIELD_ENGINEER: {
		id: 2,
		username: "engineer",
		email: "engineer@gasflow.local",
		role: "FIELD_ENGINEER"
	},
	SUPPORT_STAFF: {
		id: 3,
		username: "support",
		email: "support@gasflow.local",
		role: "SUPPORT_STAFF"
	},
	CONSUMER: {
		id: 4,
		username: "consumer",
		email: "consumer@gasflow.local",
		role: "CONSUMER",
		customerId: 1
	}
};
function getStoredAuthUser() {
	if (typeof window === "undefined") return null;
	const saved = sessionStorage.getItem("gasflow_auth_user");
	if (saved) try {
		return JSON.parse(saved);
	} catch {
		return null;
	}
	return null;
}
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(() => {
		return getStoredAuthUser();
	});
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("gasflow_auth_user");
			if (user) sessionStorage.setItem("gasflow_auth_user", JSON.stringify(user));
			else sessionStorage.removeItem("gasflow_auth_user");
		}
	}, [user]);
	const switchRole = (newRole) => {
		const newUser = DEFAULT_USERS[newRole];
		setUser(newUser);
	};
	const login = (userData) => {
		setUser(userData);
	};
	const logout = () => {
		setUser(null);
		if (typeof window !== "undefined") {
			sessionStorage.removeItem("gasflow_auth_user");
			localStorage.removeItem("gasflow_auth_user");
		}
	};
	const role = user ? user.role : "SUPER_ADMIN";
	const isAuthenticated = user !== null;
	const canManageUsers = () => user?.role === "SUPER_ADMIN";
	const canManageTariffs = () => user?.role === "SUPER_ADMIN";
	const canControlValve = () => user?.role === "SUPER_ADMIN" || user?.role === "FIELD_ENGINEER";
	const canDeleteMeters = () => user?.role === "SUPER_ADMIN";
	const canManageCustomers = () => user?.role === "SUPER_ADMIN" || user?.role === "SUPPORT_STAFF";
	const canIssueRecharge = () => user?.role === "SUPER_ADMIN" || user?.role === "SUPPORT_STAFF" || user?.role === "CONSUMER";
	const canViewLogs = () => user?.role === "SUPER_ADMIN" || user?.role === "FIELD_ENGINEER";
	const canAccessReports = () => user?.role === "SUPER_ADMIN" || user?.role === "FIELD_ENGINEER" || user?.role === "SUPPORT_STAFF";
	const isConsumer = () => user?.role === "CONSUMER";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
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
			isConsumer
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as a, getStoredAuthUser as i, DEFAULT_USERS as n, ROLE_CONFIG as r, AuthProvider as t };
