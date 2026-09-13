import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as Database, L as Flame, P as Gauge, U as CreditCard, W as Coins, Z as ArrowRight, a as Users, i as WifiOff, l as TriangleAlert, r as Wifi, x as Plus } from "../_libs/lucide-react.mjs";
import { n as Card, r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, p as Legend, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DS-aPm5N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, delta, positive = true, icon: Icon, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-[14px] border border-border p-6 shadow-[var(--shadow-card)] flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[13px] text-muted-foreground font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 grid place-items-center rounded-xl bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "h-[18px] w-[18px] text-primary",
						strokeWidth: 1.75
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[36px] leading-none font-bold tracking-tight text-foreground tabular-nums",
					children: value
				}), suffix && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground font-medium",
					children: suffix
				})]
			}),
			delta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: ["inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", positive ? "bg-[oklch(0.75_0.15_160/0.12)] text-[oklch(0.5_0.15_160)]" : "bg-[oklch(0.7_0.19_15/0.12)] text-[oklch(0.55_0.19_15)]"].join(" "),
				children: [
					positive ? "▲" : "▼",
					" ",
					delta,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground font-normal",
						children: "vs last week"
					})
				]
			})
		]
	});
}
var pieColors = [
	"var(--primary)",
	"var(--warning)",
	"var(--destructive)"
];
var fmt = (n) => (n ?? 0).toLocaleString();
function Dashboard() {
	const [stats, setStats] = (0, import_react.useState)({
		totalCustomers: 0,
		totalMeters: 0,
		activeMeters: 0,
		offlineMeters: 0,
		alarms: 0,
		todayConsumption: 0,
		totalRecharge: 0,
		revenue: 0,
		meterStatusSeries: [
			{
				name: "Online",
				value: 0
			},
			{
				name: "Idle/Warning",
				value: 0
			},
			{
				name: "Offline",
				value: 0
			}
		],
		consumptionSeries: [
			{
				d: "Mon",
				usage: 0,
				revenue: 0
			},
			{
				d: "Tue",
				usage: 0,
				revenue: 0
			},
			{
				d: "Wed",
				usage: 0,
				revenue: 0
			},
			{
				d: "Thu",
				usage: 0,
				revenue: 0
			},
			{
				d: "Fri",
				usage: 0,
				revenue: 0
			},
			{
				d: "Sat",
				usage: 0,
				revenue: 0
			},
			{
				d: "Sun",
				usage: 0,
				revenue: 0
			}
		],
		recentActivity: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		api.getDashboardStats().then((data) => {
			setStats(data);
		}).catch((err) => {
			console.info("Dashboard using live default state:", err.message);
		}).finally(() => setLoading(false));
	}, []);
	const isSystemEmpty = stats.totalMeters === 0 && stats.totalCustomers === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Overview",
		subtitle: "Live database status of your prepaid gas metering network",
		children: [
			!loading && isSystemEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: "Clean Database Initialized"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5 max-w-xl",
						children: "All mock data has been removed. Get started by registering your first customer, adding a meter device, or configuring tariff plans."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/customers",
						className: "h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add First Customer"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/meters",
						className: "h-10 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-accent transition",
						children: ["Add Meter ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Customers",
						value: fmt(stats.totalCustomers),
						delta: "Live",
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active Meters",
						value: fmt(stats.activeMeters),
						delta: "Live",
						icon: Wifi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Offline Meters",
						value: fmt(stats.offlineMeters),
						delta: "Live",
						positive: stats.offlineMeters === 0,
						icon: WifiOff
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Alarms / Closed",
						value: stats.alarms,
						delta: "Live",
						positive: stats.alarms === 0,
						icon: TriangleAlert
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Today's Consumption",
						value: fmt(stats.todayConsumption),
						suffix: "m³",
						delta: "Today",
						icon: Flame
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Today's Recharge",
						value: `৳${fmt(stats.totalRecharge)}`,
						delta: "Today",
						icon: CreditCard
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Revenue (MTD)",
						value: `৳${fmt(stats.revenue)}`,
						delta: "Month",
						icon: Coins
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Meters",
						value: fmt(stats.totalMeters),
						delta: "Live",
						icon: Gauge
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 xl:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[17px] font-semibold text-foreground",
							children: "Consumption & Revenue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-muted-foreground mt-0.5",
							children: "Past 7 days aggregated from database"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[300px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: stats.consumptionSeries,
							margin: {
								left: -10,
								right: 8,
								top: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "g1",
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "g2",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--secondary)",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--secondary)",
										stopOpacity: 0
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									strokeDasharray: "3 6",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "d",
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
									fill: "url(#g1)",
									name: "Usage (m³)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "revenue",
									stroke: "var(--secondary)",
									strokeWidth: 2.5,
									fill: "url(#g2)",
									name: "Revenue (BDT)"
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[17px] font-semibold text-foreground",
						children: "Fleet Health"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-muted-foreground mt-0.5 mb-4",
						children: "Device status breakdown"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[220px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: stats.meterStatusSeries,
								innerRadius: 60,
								outerRadius: 90,
								paddingAngle: 3,
								dataKey: "value",
								children: stats.meterStatusSeries.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
									fill: pieColors[i % pieColors.length],
									stroke: "var(--card)",
									strokeWidth: 3
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 12,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconType: "circle",
								wrapperStyle: {
									fontSize: 12,
									paddingTop: 8
								}
							})
						] }) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-2",
						children: stats.meterStatusSeries.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2.5 w-2.5 rounded-full",
									style: { background: pieColors[i % pieColors.length] }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: s.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium tabular-nums",
								children: fmt(s.value)
							})]
						}, s.name))
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 xl:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "xl:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[17px] font-semibold text-foreground",
							children: "Revenue by Day"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-muted-foreground mt-0.5",
							children: "7-day recharge totals"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							tone: "success",
							children: "DLMS Server Listening (Port 5000)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[260px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: stats.consumptionSeries,
							margin: {
								left: -10,
								right: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									strokeDasharray: "3 6",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "d",
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "revenue",
									fill: "var(--primary)",
									radius: [
										8,
										8,
										0,
										0
									],
									maxBarSize: 36,
									name: "Revenue (BDT)"
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[17px] font-semibold text-foreground",
						children: "Recent Activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground font-mono",
						children: "Live Stream"
					})]
				}), stats.recentActivity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-muted-foreground text-sm",
					children: "No recent activity recorded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3.5",
					children: stats.recentActivity.map((a) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
								tone: a.status === "success" ? "success" : a.status === "error" ? "error" : "info",
								children: a.type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground truncate",
									children: a.detail
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: a.when
								})]
							})]
						}, a.id);
					})
				})] })]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
