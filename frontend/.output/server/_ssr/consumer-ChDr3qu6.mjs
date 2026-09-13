import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useAuth } from "./auth-context-Bn8DClbS.mjs";
import { C as PhoneCall, G as CircleCheck, L as Flame, U as CreditCard, b as Power } from "../_libs/lucide-react.mjs";
import { n as Card, r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { a as XAxis, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consumer-ChDr3qu6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConsumerPage() {
	const { user } = useAuth();
	const [meter, setMeter] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [rechargeAmount, setRechargeAmount] = (0, import_react.useState)("20.00");
	const [rechargeSuccess, setRechargeSuccess] = (0, import_react.useState)(null);
	const [rechargeLoading, setRechargeLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		api.getMeters().then((meters) => {
			if (meters.length > 0) {
				const found = (user?.customerId ? meters.find((m) => m.customer?.id === user.customerId) : null) || meters[0];
				setMeter(found);
			}
		}).catch(() => {}).finally(() => setLoading(false));
	}, [user?.customerId]);
	const handleSelfRecharge = async (e) => {
		e.preventDefault();
		if (!meter) return;
		setRechargeLoading(true);
		setRechargeSuccess(null);
		try {
			const res = await api.createRecharge(meter.id, Number(rechargeAmount), "DIGITAL_WALLET");
			setRechargeSuccess(`Recharge successful! Token generated: ${res.token}`);
		} catch (err) {
			alert(err.message || "Failed to process recharge");
		} finally {
			setRechargeLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Consumer Portal",
		subtitle: `Welcome back, ${user?.username ?? "Consumer"} · Account ID #${user?.id ?? "—"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] text-muted-foreground uppercase tracking-wider font-medium",
						children: "Remaining Balance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold tabular-nums text-foreground mt-0.5",
						children: ["৳", meter?.balance !== void 0 ? Number(meter.balance).toFixed(2) : "45.80"]
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] text-muted-foreground uppercase tracking-wider font-medium",
						children: "Valve Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-foreground mt-0.5",
						children: meter?.valveStatus || "OPEN"
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-accent text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] text-muted-foreground uppercase tracking-wider font-medium",
						children: "Today's Usage"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold tabular-nums text-foreground mt-0.5",
						children: "0.48 m³"
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-accent text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] text-muted-foreground uppercase tracking-wider font-medium",
						children: "Assigned Meter"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-mono font-bold text-foreground mt-0.5",
						children: meter?.meterNumber || "MTR-2410"
					})] })]
				}) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 xl:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[16px] font-semibold text-foreground",
						children: "My Weekly Consumption"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] text-muted-foreground",
						children: "Volume consumed in Cubic Meters (m³)"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						tone: "success",
						children: "Meter Active"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[260px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: [
							{
								day: "Mon",
								usage: .32
							},
							{
								day: "Tue",
								usage: .45
							},
							{
								day: "Wed",
								usage: .28
							},
							{
								day: "Thu",
								usage: .51
							},
							{
								day: "Fri",
								usage: .39
							},
							{
								day: "Sat",
								usage: .62
							},
							{
								day: "Sun",
								usage: .48
							}
						],
						margin: {
							left: -10,
							right: 8,
							top: 8
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gCons",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--primary)",
									stopOpacity: .35
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--primary)",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								strokeDasharray: "3 6",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tickLine: false,
								axisLine: false,
								tick: {
									fill: "var(--muted-foreground)",
									fontSize: 12
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tickLine: false,
								axisLine: false,
								tick: {
									fill: "var(--muted-foreground)",
									fontSize: 12
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 12,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "usage",
								stroke: "var(--primary)",
								strokeWidth: 2.5,
								fill: "url(#gCons)",
								name: "Usage (m³)"
							})
						]
					}) })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[16px] font-semibold text-foreground",
						children: "Quick Online Recharge"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mb-4",
					children: "Add credit directly to your gas meter index using Mobile Banking or Cards."
				}),
				rechargeSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 p-3 rounded-xl bg-primary/10 text-primary text-xs font-mono font-medium border border-primary/20",
					children: rechargeSuccess
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSelfRecharge,
					className: "space-y-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground block mb-1",
								children: "Select Amount (BDT / ৳)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2 mb-2",
								children: [
									"10.00",
									"20.00",
									"50.00"
								].map((amt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setRechargeAmount(amt),
									className: ["h-9 rounded-lg text-xs font-semibold border transition", rechargeAmount === amt ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"].join(" "),
									children: ["৳", amt]
								}, amt))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.01",
								min: "5",
								value: rechargeAmount,
								onChange: (e) => setRechargeAmount(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground block mb-1",
							children: "Payment Channel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mobile Banking (bKash / Nagad)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "VISA / Mastercard Debit" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Digital Wallet" })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: rechargeLoading,
							className: "w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition shadow-sm",
							children: rechargeLoading ? "Authorizing Payment..." : "Instant Recharge Now"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 pt-4 border-t border-border/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold text-foreground mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "h-3.5 w-3.5 text-primary" }), "24/7 Gas Support Hotline"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Dial ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "16499"
							}),
							" for gas leak emergencies or service disruption."
						]
					})]
				})
			] })]
		})]
	});
}
//#endregion
export { ConsumerPage as component };
