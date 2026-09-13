import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useAuth } from "./auth-context-Bn8DClbS.mjs";
import { _ as RefreshCw, j as Layers, m as ShieldAlert, n as X, u as Trash2, x as Plus } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tariffs-B3W9UsmW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewTariffModal({ isOpen, onClose, onSuccess }) {
	const [name, setName] = (0, import_react.useState)("");
	const [unitPrice, setUnitPrice] = (0, import_react.useState)("0.85");
	const [vatPercentage, setVatPercentage] = (0, import_react.useState)("5.00");
	const [fixedCharge, setFixedCharge] = (0, import_react.useState)("2.50");
	const [serviceCharge, setServiceCharge] = (0, import_react.useState)("1.00");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await api.createTariff({
				name,
				unitPrice: Number(unitPrice),
				vatPercentage: Number(vatPercentage),
				fixedCharge: Number(fixedCharge),
				serviceCharge: Number(serviceCharge),
				isActive: true
			});
			onSuccess();
			onClose();
			setName("");
		} catch (err) {
			setError(err.message || "Failed to create tariff");
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "New Tariff Plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Configure pricing, tax and fixed charges"
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
							children: "Plan Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							placeholder: "e.g. Commercial Tier-1",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Unit Price (৳ / m³)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.01",
								value: unitPrice,
								onChange: (e) => setUnitPrice(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "VAT (%)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.1",
								value: vatPercentage,
								onChange: (e) => setVatPercentage(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Monthly Fixed Charge (৳)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.1",
								value: fixedCharge,
								onChange: (e) => setFixedCharge(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Service Charge (৳)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.1",
								value: serviceCharge,
								onChange: (e) => setServiceCharge(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
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
								children: loading ? "Saving..." : "Create Tariff"
							})]
						})
					]
				})
			]
		})
	});
}
function TariffsPage() {
	const { canManageTariffs } = useAuth();
	const [tariffs, setTariffs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const fetchTariffs = () => {
		setLoading(true);
		api.getTariffs().then(setTariffs).catch((err) => console.error("Failed to fetch tariffs:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchTariffs();
	}, []);
	const handleDelete = async (id) => {
		if (!canManageTariffs()) {
			alert("Permission denied: Super Admin role required to modify tariffs.");
			return;
		}
		if (!confirm("Are you sure you want to delete this tariff plan?")) return;
		try {
			await api.deleteTariff(id);
			fetchTariffs();
		} catch (err) {
			alert(err.message || "Failed to delete tariff");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Tariff Management",
		subtitle: "Unit price, VAT %, monthly fixed, and service charges",
		children: [
			!canManageTariffs() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View-only mode: Only Super Administrators have permission to modify gas pricing, VAT, and charges." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center mb-4 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Rate Configurations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchTariffs,
						className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
						title: "Refresh",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					})]
				}), canManageTariffs() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setModalOpen(true),
					className: "h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Tariff"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: tariffs,
				emptyTitle: "No Tariffs Configured",
				emptyDescription: "No gas tariff plans exist in the database. Define unit rates, tax percentages, and fixed charges to calculate billing index for meters.",
				emptyActionLabel: canManageTariffs() ? "Create First Tariff" : void 0,
				onEmptyAction: canManageTariffs() ? () => setModalOpen(true) : void 0,
				columns: [
					{
						key: "name",
						header: "Plan Name",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-foreground",
							children: r.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[12px] text-muted-foreground",
							children: ["ID #", r.id]
						})] })
					},
					{
						key: "unitPrice",
						header: "Unit Price (৳ / m³)",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums font-semibold text-foreground",
							children: [
								"৳",
								Number(r.unitPrice).toFixed(2),
								" / m³"
							]
						})
					},
					{
						key: "vatPercentage",
						header: "VAT (%)",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-foreground/80",
							children: [Number(r.vatPercentage).toFixed(2), "%"]
						})
					},
					{
						key: "fixedCharge",
						header: "Fixed Charge (৳)",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-foreground/80",
							children: ["৳", Number(r.fixedCharge).toFixed(2)]
						})
					},
					{
						key: "serviceCharge",
						header: "Service Charge (৳)",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-foreground/80",
							children: ["৳", Number(r.serviceCharge).toFixed(2)]
						})
					},
					{
						key: "active",
						header: "Status",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							tone: r.isActive ? "success" : "muted",
							children: r.isActive ? "Active" : "Disabled"
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => canManageTariffs() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete(r.id),
							className: "h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Super Admin Only: Delete Tariff",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "—"
						})
					}
				]
			}),
			canManageTariffs() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewTariffModal, {
				isOpen: modalOpen,
				onClose: () => setModalOpen(false),
				onSuccess: fetchTariffs
			})
		]
	});
}
//#endregion
export { TariffsPage as component };
