import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useAuth } from "./auth-context-Bn8DClbS.mjs";
import { _ as RefreshCw, m as ShieldAlert, n as X, s as UserPlus, u as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-DLGbbqq6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddUserModal({ isOpen, onClose, onSuccess }) {
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("SUPPORT");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await api.createUser({
				username,
				email,
				passwordHash: password,
				role
			});
			onSuccess();
			onClose();
			setUsername("");
			setEmail("");
			setPassword("");
		} catch (err) {
			setError(err.message || "Failed to create user");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "Add Portal User"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Grant access and assign role"
					})] })]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 rounded-xl bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Username"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							placeholder: "e.g. operator_1",
							value: username,
							onChange: (e) => setUsername(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							placeholder: "operator@gasflow.local",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "password",
							placeholder: "••••••••",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: role,
							onChange: (e) => setRole(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SUPER_ADMIN",
									children: "Super Admin (Full Administrative Authority)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "FIELD_ENGINEER",
									children: "Field Engineer / Operator (Valve Control & Socket Telemetry)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SUPPORT_STAFF",
									children: "Support Staff (Customer Care & Manual Recharges)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "CONSUMER",
									children: "Consumer (Subscriber Account)"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "h-10 px-4 rounded-lg border border-border text-sm hover:bg-accent transition",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50",
								children: loading ? "Creating..." : "Create User"
							})]
						})
					]
				})
			]
		})
	});
}
function UsersPage() {
	const { canManageUsers } = useAuth();
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const fetchUsers = () => {
		setLoading(true);
		api.getUsers().then(setUsers).catch((err) => console.error("Failed to fetch users:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		if (canManageUsers()) fetchUsers();
		else setLoading(false);
	}, [canManageUsers()]);
	const handleDelete = async (id) => {
		if (!canManageUsers()) return;
		if (!confirm("Are you sure you want to remove this user?")) return;
		try {
			await api.deleteUser(id);
			fetchUsers();
		} catch (err) {
			alert(err.message || "Failed to delete user");
		}
	};
	if (!canManageUsers()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Users & Roles",
		subtitle: "Role-Based Access Control (RBAC) System",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-16 text-center max-w-md mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 w-16 rounded-2xl bg-destructive/10 text-destructive grid place-items-center mx-auto mb-4 border border-destructive/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl font-bold text-foreground mb-2",
					children: "Access Restricted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground leading-relaxed mb-6",
					children: [
						"Only ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Super Administrators" }),
						" have the authority to invite users, assign RBAC roles, and manage credentials."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl bg-accent/60 border border-border text-xs text-muted-foreground text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-foreground mb-1",
							children: "Testing Tip:"
						}),
						"Use the ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Role Switcher" }),
						" in the top navigation bar to select ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Super Admin" }),
						" to test user management and RBAC administration."
					]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Users & Roles",
		subtitle: "Team access and Role-Based Access Control (RBAC)",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center mb-4 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Accounts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchUsers,
						className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
						title: "Refresh",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setModalOpen(true),
					className: "h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), " Add User"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: users,
				emptyTitle: "No Additional Users",
				emptyDescription: "Only system records exist. Add administrative or support team members to grant RBAC access to the portal.",
				emptyActionLabel: "Create First User",
				onEmptyAction: () => setModalOpen(true),
				columns: [
					{
						key: "username",
						header: "User Account",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold uppercase",
								children: r.username.slice(0, 2)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-foreground",
								children: r.username
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[12px] text-muted-foreground",
								children: r.email
							})] })]
						})
					},
					{
						key: "role",
						header: "Role / Scope",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: ["inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-semibold", r.role === "SUPER_ADMIN" ? "bg-primary/10 text-primary border border-primary/20" : r.role === "FIELD_ENGINEER" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : r.role === "SUPPORT_STAFF" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-sky-500/10 text-sky-600 border border-sky-500/20"].join(" "),
							children: r.role
						})
					},
					{
						key: "createdAt",
						header: "Created Date",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-[12px]",
							children: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "System Init"
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete(r.id),
							className: "h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Delete User",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					}
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddUserModal, {
				isOpen: modalOpen,
				onClose: () => setModalOpen(false),
				onSuccess: fetchUsers
			})
		]
	});
}
//#endregion
export { UsersPage as component };
