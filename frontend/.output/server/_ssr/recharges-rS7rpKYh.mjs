import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { U as CreditCard, _ as RefreshCw, n as X } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recharges-rS7rpKYh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManualRechargeModal({ isOpen, onClose, onSuccess }) {
	const [meterId, setMeterId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("50.00");
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("MOBILE_BANKING");
	const [meters, setMeters] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			api.getMeters().then((data) => {
				setMeters(data);
				if (data.length > 0 && !meterId) setMeterId(data[0].id);
			}).catch(() => {});
			setError(null);
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!meterId) {
			setError("Please select a target meter");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await api.createRecharge(Number(meterId), Number(amount), paymentMethod);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.message || "Failed to process recharge");
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "Issue Manual Recharge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Generate DLMS/STS recharge token and credit meter"
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
							children: "Target Gas Meter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							required: true,
							value: meterId,
							onChange: (e) => setMeterId(Number(e.target.value)),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
							children: [meters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No meters available"
							}), meters.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: m.id,
								children: [
									m.meterNumber,
									" (",
									m.serialNumber,
									") — ",
									m.customer ? `${m.customer.firstName} ${m.customer.lastName}` : "Unassigned"
								]
							}, m.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Recharge Amount (BDT / ৳)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "number",
							min: "1",
							step: "0.01",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-lg"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Payment Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: paymentMethod,
							onChange: (e) => setPaymentMethod(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "MOBILE_BANKING",
									children: "Mobile Banking (bKash / Nagad / Rocket)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "CREDIT_CARD",
									children: "Credit / Debit Card"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "WALLET",
									children: "Digital Wallet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "CASH_COUNTER",
									children: "Counter Cash"
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
								disabled: loading || meters.length === 0,
								className: "h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50",
								children: loading ? "Processing..." : "Generate Token & Credit"
							})]
						})
					]
				})
			]
		})
	});
}
function RechargesPage() {
	const [recharges, setRecharges] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const fetchRecharges = () => {
		setLoading(true);
		api.getRecharges().then(setRecharges).catch((err) => console.error("Failed to fetch recharges:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchRecharges();
	}, []);
	const totalAmount = recharges.reduce((sum, r) => sum + (r.amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Recharges",
		subtitle: `${recharges.length} transactions · ৳${totalAmount.toFixed(2)} total settled`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center mb-4 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Tokens & Settlements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchRecharges,
						className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
						title: "Refresh",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setModalOpen(true),
					className: "h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Manual Recharge"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: recharges,
				emptyTitle: "No Recharges Recorded",
				emptyDescription: "There are no recharge transactions in the system yet. Click below to issue a 20-digit DLMS recharge token and allocate monetary balance to a meter.",
				emptyActionLabel: "Issue First Recharge",
				onEmptyAction: () => setModalOpen(true),
				columns: [
					{
						key: "id",
						header: "Ref #",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[13px] text-muted-foreground",
							children: ["#RCG-", r.id]
						})
					},
					{
						key: "meter",
						header: "Meter Device",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[13px] font-medium text-foreground",
							children: r.meter ? r.meter.meterNumber : "—"
						}), r.meter?.serialNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground",
							children: ["SN: ", r.meter.serialNumber]
						})] })
					},
					{
						key: "amount",
						header: "Amount (৳)",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold tabular-nums text-foreground",
							children: ["৳", Number(r.amount).toFixed(2)]
						})
					},
					{
						key: "method",
						header: "Payment Method",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2.5 py-1 rounded-md bg-accent text-foreground font-medium",
							children: r.paymentMethod
						})
					},
					{
						key: "token",
						header: "DLMS / STS Token",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[12px] text-primary tracking-wider font-semibold",
							children: r.token
						})
					},
					{
						key: "date",
						header: "Timestamp",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-[12px]",
							children: r.createdAt ? new Date(r.createdAt).toLocaleString() : "Just now"
						})
					},
					{
						key: "status",
						header: "Status",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							tone: r.status === "SUCCESSFUL" ? "success" : "error",
							children: r.status
						})
					}
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualRechargeModal, {
				isOpen: modalOpen,
				onClose: () => setModalOpen(false),
				onSuccess: fetchRecharges
			})
		]
	});
}
//#endregion
export { RechargesPage as component };
