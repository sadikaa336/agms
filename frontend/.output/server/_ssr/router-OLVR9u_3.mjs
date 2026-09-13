import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { i as getStoredAuthUser, t as AuthProvider } from "./auth-context-Bn8DClbS.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-OLVR9u_3.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BG45exms.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error("Application Error:", error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Automated Prepaid Gas Meter Management Software" },
			{
				name: "description",
				content: "Enterprise DLMS/COSEM prepaid gas metering platform — monitor meters, manage customers, tariffs, recharges and reports in real time."
			},
			{
				name: "author",
				content: "Automated Prepaid Gas Meter Management Software"
			},
			{
				property: "og:title",
				content: "Automated Prepaid Gas Meter Management Software"
			},
			{
				property: "og:description",
				content: "Enterprise DLMS/COSEM prepaid gas metering platform — monitor meters, manage customers, tariffs, recharges and reports."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "apple-touch-icon",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$12 = () => import("./routes-DS-aPm5N.mjs");
var Route$12 = createFileRoute("/")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const user = getStoredAuthUser();
			if (!user) throw redirect({ to: "/login" });
			if (user.role === "CONSUMER") throw redirect({ to: "/consumer" });
		}
	},
	head: () => ({ meta: [
		{ title: "Dashboard — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Real-time overview of prepaid gas meters, consumption, revenue and alarms."
		},
		{
			property: "og:title",
			content: "Dashboard — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Real-time overview of prepaid gas meters, consumption and revenue."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./consumer-ChDr3qu6.mjs");
var Route$11 = createFileRoute("/consumer")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			if (!getStoredAuthUser()) throw redirect({ to: "/login" });
		}
	},
	head: () => ({ meta: [
		{ title: "Consumer Portal — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Check prepaid balance, gas consumption and recharge tokens online."
		},
		{
			property: "og:title",
			content: "Consumer Portal — Automated Prepaid Gas Meter Management Software"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./customers-CzfTmLsh.mjs");
var Route$10 = createFileRoute("/customers")({
	head: () => ({ meta: [
		{ title: "Customers — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Manage prepaid gas customers, profiles, and meter assignments."
		},
		{
			property: "og:title",
			content: "Customers — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Manage prepaid gas customers, profiles, and meter assignments."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./locations-DidKnH6B.mjs");
var Route$9 = createFileRoute("/locations")({
	head: () => ({ meta: [
		{ title: "Locations & Zoning — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Manage geographic divisions, districts, areas, and smart prepaid gas projects."
		},
		{
			property: "og:title",
			content: "Locations & Zoning — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Manage geographic divisions, districts, areas, and smart prepaid gas projects."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./login-C2OYHqVB.mjs");
var Route$8 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Sign In — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Authenticate to access the Automated Prepaid Gas Meter Management Software."
		},
		{
			property: "og:title",
			content: "Sign In — Automated Prepaid Gas Meter Management Software"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./logs-DVea-mlH.mjs");
var Route$7 = createFileRoute("/logs")({
	head: () => ({ meta: [
		{ title: "Communication Logs — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Inspect DLMS/COSEM frames, retries and errors between meters and the server."
		},
		{
			property: "og:title",
			content: "Communication Logs — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Inspect DLMS/COSEM frames and communication errors."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./meters-BTC9SRok.mjs");
var Route$6 = createFileRoute("/meters")({
	head: () => ({ meta: [
		{ title: "Meters — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Manage DLMS/COSEM prepaid gas meters, firmware, and remote actions."
		},
		{
			property: "og:title",
			content: "Meters — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Manage prepaid gas meters, firmware, and remote actions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./monitoring-B79pSINl.mjs");
var Route$5 = createFileRoute("/monitoring")({
	head: () => ({ meta: [
		{ title: "Live Monitoring — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Real-time fleet monitoring of prepaid gas meters and communication status."
		},
		{
			property: "og:title",
			content: "Live Monitoring — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Real-time fleet monitoring of prepaid gas meters."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./recharges-rS7rpKYh.mjs");
var Route$4 = createFileRoute("/recharges")({
	head: () => ({ meta: [
		{ title: "Recharges — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Track prepaid gas recharges, tokens, payment methods and failed transactions."
		},
		{
			property: "og:title",
			content: "Recharges — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Track prepaid gas recharges and payment transactions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./reports-Cj7u-0k-.mjs");
var Route$3 = createFileRoute("/reports")({
	head: () => ({ meta: [
		{ title: "Reports — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Generate consumption, revenue and communication reports as PDF, Excel or CSV."
		},
		{
			property: "og:title",
			content: "Reports — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Generate consumption and revenue reports."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./simulator-BblbQI9u.mjs");
var Route$2 = createFileRoute("/simulator")({
	head: () => ({ meta: [
		{ title: "Meter Hardware Simulator — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Interactive DLMS/COSEM smart prepaid gas meter device simulator."
		},
		{
			property: "og:title",
			content: "Meter Hardware Simulator — Automated Prepaid Gas Meter Management Software"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./tariffs-B3W9UsmW.mjs");
var Route$1 = createFileRoute("/tariffs")({
	head: () => ({ meta: [
		{ title: "Tariffs — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Configure unit price, VAT, fixed and service charges for prepaid gas billing."
		},
		{
			property: "og:title",
			content: "Tariffs — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Configure prepaid gas tariff plans, VAT and service charges."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./users-DLGbbqq6.mjs");
var Route = createFileRoute("/users")({
	head: () => ({ meta: [
		{ title: "Users & Roles — Automated Prepaid Gas Meter Management Software" },
		{
			name: "description",
			content: "Manage admin users, roles and permissions for the metering platform."
		},
		{
			property: "og:title",
			content: "Users & Roles — Automated Prepaid Gas Meter Management Software"
		},
		{
			property: "og:description",
			content: "Manage admin users, roles and permissions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$12.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$13
	}),
	ConsumerRoute: Route$11.update({
		id: "/consumer",
		path: "/consumer",
		getParentRoute: () => Route$13
	}),
	CustomersRoute: Route$10.update({
		id: "/customers",
		path: "/customers",
		getParentRoute: () => Route$13
	}),
	LocationsRoute: Route$9.update({
		id: "/locations",
		path: "/locations",
		getParentRoute: () => Route$13
	}),
	LoginRoute: Route$8.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$13
	}),
	LogsRoute: Route$7.update({
		id: "/logs",
		path: "/logs",
		getParentRoute: () => Route$13
	}),
	MetersRoute: Route$6.update({
		id: "/meters",
		path: "/meters",
		getParentRoute: () => Route$13
	}),
	MonitoringRoute: Route$5.update({
		id: "/monitoring",
		path: "/monitoring",
		getParentRoute: () => Route$13
	}),
	RechargesRoute: Route$4.update({
		id: "/recharges",
		path: "/recharges",
		getParentRoute: () => Route$13
	}),
	ReportsRoute: Route$3.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => Route$13
	}),
	SimulatorRoute: Route$2.update({
		id: "/simulator",
		path: "/simulator",
		getParentRoute: () => Route$13
	}),
	TariffsRoute: Route$1.update({
		id: "/tariffs",
		path: "/tariffs",
		getParentRoute: () => Route$13
	}),
	UsersRoute: Route.update({
		id: "/users",
		path: "/users",
		getParentRoute: () => Route$13
	})
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
