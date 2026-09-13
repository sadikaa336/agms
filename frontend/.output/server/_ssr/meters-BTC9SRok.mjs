import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useAuth } from "./auth-context-Bn8DClbS.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as Gauge, _ as RefreshCw, b as Power, f as SlidersVertical, k as Lock, n as X, u as Trash2, x as Plus } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meters-BTC9SRok.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddMeterModal({ isOpen, onClose, onSuccess }) {
	const [meterNumber, setMeterNumber] = (0, import_react.useState)("");
	const [serialNumber, setSerialNumber] = (0, import_react.useState)("");
	const [communicationId, setCommunicationId] = (0, import_react.useState)("");
	const [firmwareVersion, setFirmwareVersion] = (0, import_react.useState)("v2.4.1");
	const [installationLocation, setInstallationLocation] = (0, import_react.useState)("");
	const [customerId, setCustomerId] = (0, import_react.useState)("");
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			api.getCustomers().then(setCustomers).catch(() => {});
			const randomSuffix = Math.floor(1e3 + Math.random() * 9e3);
			setMeterNumber(`MTR-${randomSuffix}`);
			setSerialNumber(`SN-DLMS-${randomSuffix}`);
			setCommunicationId(`COMM-${randomSuffix}`);
			setError(null);
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await api.createMeter({
				meterNumber,
				serialNumber,
				communicationId,
				firmwareVersion,
				installationLocation,
				status: "ACTIVE",
				valveStatus: "CLOSED"
			}, customerId ? Number(customerId) : void 0);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.message || "Failed to create meter");
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "Add New Gas Meter"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Register a new DLMS/COSEM device (Initial Reading: 0.000 m³, Balance: ৳0.00, Valve: CLOSED)"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Meter Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: meterNumber,
								onChange: (e) => setMeterNumber(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Serial Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: serialNumber,
								onChange: (e) => setSerialNumber(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Communication ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: communicationId,
								onChange: (e) => setCommunicationId(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Firmware Version"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: firmwareVersion,
								onChange: (e) => setFirmwareVersion(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Assign to Customer (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: customerId,
							onChange: (e) => setCustomerId(e.target.value ? Number(e.target.value) : ""),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "-- No Customer Assigned --"
							}), customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.id,
								children: [
									c.firstName,
									" ",
									c.lastName,
									" (",
									c.phone,
									")"
								]
							}, c.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Installation Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "e.g., Sector 7, Block B, Dhaka",
							value: installationLocation,
							onChange: (e) => setInstallationLocation(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
								children: loading ? "Adding..." : "Add Meter"
							})]
						})
					]
				})
			]
		})
	});
}
function MetersPage() {
	const { canControlValve, canDeleteMeters, role } = useAuth();
	const [meters, setMeters] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [actionLoadingId, setActionLoadingId] = (0, import_react.useState)(null);
	const fetchMeters = () => {
		setLoading(true);
		api.getMeters().then(setMeters).catch((err) => {
			console.error("Failed to fetch meters:", err);
		}).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchMeters();
	}, []);
	const handleToggleValve = async (m) => {
		if (!canControlValve()) {
			alert("Permission denied: Valve operation restricted to Field Engineers and Super Admins.");
			return;
		}
		const targetStatus = m.valveStatus === "OPEN" ? "CLOSED" : "OPEN";
		setActionLoadingId(m.id);
		try {
			await api.toggleValve(m.id, targetStatus);
			fetchMeters();
		} catch (err) {
			alert(err.message || "Failed to toggle valve");
		} finally {
			setActionLoadingId(null);
		}
	};
	const handleDeleteMeter = async (id) => {
		if (!canDeleteMeters()) {
			alert("Permission denied: Only Super Admins may delete meters.");
			return;
		}
		if (!confirm("Are you sure you want to remove this gas meter?")) return;
		try {
			await api.deleteMeter(id);
			fetchMeters();
		} catch (err) {
			alert(err.message || "Failed to delete meter");
		}
	};
	const activeCount = meters.filter((m) => m.status === "ACTIVE").length;
	const totalBalance = meters.reduce((sum, m) => sum + (m.balance || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Meters",
		subtitle: `${meters.length} registered · ${activeCount} active · ৳${totalBalance.toFixed(2)} total balance`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[13px] text-muted-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DLMS/COSEM · TCP/IP Socket (Port 5000)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchMeters,
						className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
						title: "Refresh",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/simulator",
						className: "h-10 px-4 rounded-[10px] border border-border bg-card text-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-accent transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-4 w-4 text-primary" }), " Hardware Simulator"]
					}), canControlValve() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setModalOpen(true),
						className: "h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Meter"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: meters,
				emptyTitle: "No Gas Meters Registered",
				emptyDescription: "Your device inventory is empty. Register your first DLMS/COSEM meter to enable real-time telemetry, remote valve shutoff, and token recharge.",
				emptyActionLabel: canControlValve() ? "Register First Meter" : void 0,
				onEmptyAction: canControlValve() ? () => setModalOpen(true) : void 0,
				columns: [
					{
						key: "meterNumber",
						header: "Meter Device",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[13px] font-medium text-foreground",
							children: r.meterNumber
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[12px] text-muted-foreground",
							children: ["SN: ", r.serialNumber]
						})] })
					},
					{
						key: "communicationId",
						header: "Comm ID",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[12px] text-foreground/80",
							children: r.communicationId
						})
					},
					{
						key: "customer",
						header: "Customer",
						render: (r) => r.customer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium text-foreground",
							children: [
								r.customer.firstName,
								" ",
								r.customer.lastName
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: r.customer.phone
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-xs italic",
							children: "Unassigned"
						})
					},
					{
						key: "reading",
						header: "Current Reading",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-foreground tabular-nums text-[13px]",
								children: (r.reading !== void 0 && r.reading !== null ? Number(r.reading) : 0).toFixed(3)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground ml-1",
								children: "m³"
							})]
						})
					},
					{
						key: "balance",
						header: "Available Balance",
						align: "right",
						render: (r) => {
							const bal = r.balance !== void 0 && r.balance !== null ? Number(r.balance) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `font-semibold tabular-nums font-mono text-xs px-2 py-0.5 rounded-md inline-block ${bal <= 0 ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"}`,
									children: ["৳", bal.toFixed(2)]
								})
							});
						}
					},
					{
						key: "location",
						header: "Location",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-foreground/80 max-w-[180px] truncate inline-block",
							children: r.installationLocation || "Not specified"
						})
					},
					{
						key: "status",
						header: "Status",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							tone: r.status === "ACTIVE" ? "success" : "muted",
							children: r.status
						})
					},
					{
						key: "valve",
						header: "Valve Control",
						render: (r) => canControlValve() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleToggleValve(r),
							disabled: actionLoadingId === r.id,
							className: ["h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition", r.valveStatus === "OPEN" ? "bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)] hover:bg-[oklch(0.75_0.15_160/0.25)]" : "bg-destructive/10 text-destructive hover:bg-destructive/20"].join(" "),
							title: "Field Engineer / Super Admin remote action",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3 w-3" }), r.valveStatus === "OPEN" ? "Valve Open" : "Valve Closed"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }),
								" ",
								r.valveStatus
							]
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => canDeleteMeters() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDeleteMeter(r.id),
							className: "h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Super Admin Only: Delete Meter",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "—"
						})
					}
				]
			}),
			canControlValve() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddMeterModal, {
				isOpen: modalOpen,
				onClose: () => setModalOpen(false),
				onSuccess: fetchMeters
			})
		]
	});
}
//#endregion
export { MetersPage as component };
