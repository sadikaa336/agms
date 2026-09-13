import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Q as ArrowDownLeft, X as ArrowUpRight, _ as RefreshCw, d as Terminal } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logs-DVea-mlH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LogsPage() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchLogs = () => {
		setLoading(true);
		api.getCommunicationLogs().then(setLogs).catch((err) => console.error("Failed to fetch logs:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchLogs();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Communication Logs",
		subtitle: "DLMS/COSEM raw TCP/IP frame telemetry recorded on port 5000",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center mb-4 flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Frame Auditor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: fetchLogs,
					className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
					title: "Refresh",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground font-mono bg-accent/60 px-3 py-1.5 rounded-lg border border-border flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Socket: 0.0.0.0:5000" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			loading,
			rows: logs,
			emptyTitle: "No Communication Packets Logged",
			emptyDescription: "No DLMS/COSEM frames have been recorded yet. When a prepaid gas meter or test client transmits APDU packets to socket port 5000, raw frames, translation XML, and acknowledgements will appear here automatically.",
			columns: [
				{
					key: "createdAt",
					header: "Timestamp",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[12px] text-muted-foreground",
						children: r.createdAt ? new Date(r.createdAt).toLocaleTimeString() : "—"
					})
				},
				{
					key: "direction",
					header: "Direction",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-1.5 text-[12px] font-semibold",
						children: r.direction === "INCOMING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "h-3.5 w-3.5 text-[oklch(0.5_0.15_160)]" }), " IN"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 text-primary" }), " OUT"] })
					})
				},
				{
					key: "meter",
					header: "Meter Device",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[13px] font-medium text-foreground",
						children: r.meter ? r.meter.meterNumber : "Unknown / Broadcast"
					})
				},
				{
					key: "packetData",
					header: "Payload / Frame",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[12px] text-muted-foreground truncate max-w-[340px] inline-block",
						children: r.packetData
					})
				},
				{
					key: "retryCount",
					header: "Retries",
					align: "right",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-foreground/80",
						children: r.retryCount
					})
				},
				{
					key: "status",
					header: "Status",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						tone: r.status === "SUCCESS" ? "success" : "error",
						children: r.status
					})
				}
			]
		})]
	});
}
//#endregion
export { LogsPage as component };
