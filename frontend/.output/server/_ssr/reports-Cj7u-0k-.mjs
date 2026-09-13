import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { B as FileChartColumnIncreasing, R as FileText, V as Download, z as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { n as Card, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-Cj7u-0k-.js
var import_jsx_runtime = require_jsx_runtime();
var reports = [
	{
		type: "meters",
		title: "Meter Fleet Inventory",
		desc: "All device IDs, serial numbers, locations and valve states",
		icon: FileChartColumnIncreasing
	},
	{
		type: "customers",
		title: "Customer Registry",
		desc: "Registered customers, contact info and assigned meters",
		icon: FileText
	},
	{
		type: "recharges",
		title: "Recharge Transactions",
		desc: "All issued DLMS/STS tokens, amounts and payment methods",
		icon: FileText
	},
	{
		type: "revenue",
		title: "Revenue Breakdown",
		desc: "Aggregated financial settlement logs from the database",
		icon: FileSpreadsheet
	}
];
function ReportsPage() {
	const handleExport = (type) => {
		window.open(`/api/reports/export/${type}`, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Reports",
		subtitle: "Export real database records in CSV / Spreadsheet formats",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6",
			children: reports.map((r) => {
				const Icon = r.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 grid place-items-center rounded-xl bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-5 w-5 text-primary",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[16px] font-semibold text-foreground",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] text-muted-foreground mt-1",
							children: r.desc
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex gap-2 flex-wrap",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleExport(r.type),
							className: "h-9 px-4 rounded-[10px] bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition text-sm inline-flex items-center gap-2 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Download CSV Export"]
						})
					})
				] }, r.title);
			})
		})
	});
}
//#endregion
export { ReportsPage as component };
