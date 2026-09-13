import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Activity, P as Gauge, _ as RefreshCw, i as WifiOff, l as TriangleAlert, r as Wifi, x as Plus } from "../_libs/lucide-react.mjs";
import { n as Card, r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/monitoring-B79pSINl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MonitoringPage() {
	const [meters, setMeters] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchMeters = () => {
		setLoading(true);
		api.getMeters().then(setMeters).catch((err) => console.error("Failed to fetch monitoring meters:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchMeters();
		const interval = setInterval(fetchMeters, 1e4);
		return () => clearInterval(interval);
	}, []);
	const onlineMeters = meters.filter((m) => m.status === "ACTIVE");
	const offlineMeters = meters.filter((m) => m.status !== "ACTIVE");
	const alarms = meters.filter((m) => m.valveStatus === "CLOSED");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Live Monitoring",
		subtitle: `Real-time socket telemetry · Refreshing every 10s`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-[oklch(0.75_0.15_160/0.15)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, {
							className: "h-5 w-5 text-[oklch(0.5_0.15_160)]",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] text-muted-foreground",
						children: "Online Devices"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold tabular-nums",
						children: onlineMeters.length
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, {
							className: "h-5 w-5 text-muted-foreground",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] text-muted-foreground",
						children: "Offline Devices"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold tabular-nums",
						children: offlineMeters.length
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-xl grid place-items-center bg-[oklch(0.81_0.145_78/0.2)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							className: "h-5 w-5 text-[oklch(0.5_0.13_78)]",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] text-muted-foreground",
						children: "Alarms / Valve Closed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold tabular-nums",
						children: alarms.length
					})] })]
				}) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-4 flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[17px] font-semibold text-foreground",
				children: "Meter Fleet Grid"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-muted-foreground",
				children: "Active device connection & valve state"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: fetchMeters,
					className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
					title: "Refresh",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatusPill, {
					tone: "info",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), " Live Socket 5000"]
				})]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-16 text-center text-muted-foreground text-sm animate-pulse",
			children: "Querying meter fleet..."
		}) : meters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto h-14 w-14 rounded-2xl bg-accent/60 grid place-items-center mb-4 text-primary border border-border/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
						className: "h-7 w-7 text-primary/80",
						strokeWidth: 1.5
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-[17px] font-semibold text-foreground mb-1",
					children: "No Meters to Monitor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-muted-foreground mb-5 max-w-sm mx-auto",
					children: "Your fleet is currently empty. Register meters to start receiving DLMS telemetry and monitor live connectivity."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/meters",
					className: "h-10 px-5 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Go to Meters"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",
			children: meters.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-border p-4 hover:border-primary/40 hover:shadow-md transition bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[13px] font-semibold text-foreground",
						children: m.meterNumber
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: m.customer ? `${m.customer.firstName} ${m.customer.lastName}` : "Unassigned"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						tone: m.status === "ACTIVE" ? "success" : "muted",
						children: m.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 pt-3 border-t border-border/60 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-wider text-muted-foreground",
						children: "Valve"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: ["text-xs font-semibold px-2 py-0.5 rounded", m.valveStatus === "OPEN" ? "bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)]" : "bg-destructive/15 text-destructive"].join(" "),
						children: m.valveStatus
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Firmware"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-mono text-muted-foreground",
							children: m.firmwareVersion || "v1.0"
						})]
					})]
				})]
			}, m.id))
		})] })]
	});
}
//#endregion
export { MonitoringPage as component };
