import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as FolderOpen, x as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-table-BHmxasGg.js
var import_jsx_runtime = require_jsx_runtime();
function DataTable({ columns, rows, loading = false, emptyTitle = "No records found", emptyDescription = "There is currently no data in this table. Add your first entry to get started.", emptyActionLabel, onEmptyAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-[14px] border border-border bg-card shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/40",
					children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: ["px-6 py-3.5 whitespace-nowrap", c.align === "right" ? "text-right" : "text-left"].join(" "),
						children: c.header
					}, c.key))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "h-14 border-b border-border/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: columns.length,
						className: "px-6 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-full bg-muted/60 rounded animate-pulse" })
					})
				}, i)) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: columns.length,
					className: "py-14 px-6 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex flex-col items-center justify-center max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-14 w-14 rounded-2xl bg-accent/60 grid place-items-center mb-4 text-primary border border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, {
									className: "h-7 w-7 text-primary/80",
									strokeWidth: 1.5
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-[17px] font-semibold text-foreground mb-1",
								children: emptyTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-muted-foreground mb-5 leading-relaxed text-center",
								children: emptyDescription
							}),
							emptyActionLabel && onEmptyAction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onEmptyAction,
								className: "h-10 px-5 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
									" ",
									emptyActionLabel
								]
							})
						]
					})
				}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: ["h-14 transition-colors hover:bg-accent/40", i !== rows.length - 1 ? "border-b border-border/60" : ""].join(" "),
					children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: ["px-6 whitespace-nowrap", c.align === "right" ? "text-right" : ""].join(" "),
						children: c.render(r)
					}, c.key))
				}, r.id)) })]
			})
		}), !loading && rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-6 py-3.5 border-t border-border text-[12px] text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"Showing ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: rows.length
				}),
				" results"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "h-8 px-3 rounded-lg border border-border hover:bg-accent/60",
						children: "Prev"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "h-8 px-3 rounded-lg border border-border bg-accent/60 text-foreground",
						children: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "h-8 px-3 rounded-lg border border-border hover:bg-accent/60",
						children: "Next"
					})
				]
			})]
		})]
	});
}
//#endregion
export { DataTable as t };
