globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/admin-layout-qqjE2JPe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f27-n+ZwOAuAtOYQrDMBlJU6EBH6rf8\"",
		"mtime": "2026-09-11T16:17:03.438Z",
		"size": 12071,
		"path": "../public/assets/admin-layout-qqjE2JPe.js"
	},
	"/assets/api-BMT0iQKV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a94-3i0UOy+cIy7bSm9MsAU300MKY6c\"",
		"mtime": "2026-09-11T16:17:03.440Z",
		"size": 2708,
		"path": "../public/assets/api-BMT0iQKV.js"
	},
	"/assets/arrow-right-DSx589q4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-s/Bp6EON6dF1rUMsYnZAQoagC/I\"",
		"mtime": "2026-09-11T16:17:03.440Z",
		"size": 154,
		"path": "../public/assets/arrow-right-DSx589q4.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"273-DN62is7oSmu60UO1lOL+4hSq07Y\"",
		"mtime": "2026-09-11T11:49:34.214Z",
		"size": 627,
		"path": "../public/favicon.ico"
	},
	"/assets/auth-context-BTO8UqXF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2916-fBPIPMGV3P4adYF7w4B6sKogjuA\"",
		"mtime": "2026-09-11T16:17:03.441Z",
		"size": 10518,
		"path": "../public/assets/auth-context-BTO8UqXF.js"
	},
	"/assets/coins-DCoFc3RT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-/8N7iGWcflnycNC7avxRy6XDgX4\"",
		"mtime": "2026-09-11T16:17:03.443Z",
		"size": 274,
		"path": "../public/assets/coins-DCoFc3RT.js"
	},
	"/assets/consumer-5XDyzwfF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f27-h+gzMDyGzzMWcrmBnqP/pbgXWwU\"",
		"mtime": "2026-09-11T16:17:03.444Z",
		"size": 7975,
		"path": "../public/assets/consumer-5XDyzwfF.js"
	},
	"/assets/customers-B9EIJzr9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"325b-JomaNri+tkuF6D8tCCt3o137I2M\"",
		"mtime": "2026-09-11T16:17:03.445Z",
		"size": 12891,
		"path": "../public/assets/customers-B9EIJzr9.js"
	},
	"/assets/data-table-CSqqRTkl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cea-o2IcSMh/CUqtnY5lt2iWZuPnVFs\"",
		"mtime": "2026-09-11T16:17:03.446Z",
		"size": 3306,
		"path": "../public/assets/data-table-CSqqRTkl.js"
	},
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"23e-xUAwomLNk39Jo1fGKVmIUeDofPI\"",
		"mtime": "2026-09-11T11:49:34.205Z",
		"size": 574,
		"path": "../public/favicon.svg"
	},
	"/assets/flame-D6q4Kxef.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"565-awpdCnC7VRMGWXS8+BPK8NCQncE\"",
		"mtime": "2026-09-11T16:17:03.446Z",
		"size": 1381,
		"path": "../public/assets/flame-D6q4Kxef.js"
	},
	"/assets/AreaChart-OJbiucgo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d005-TAXsKhpVoFA6s5LROZiGWIFH5fw\"",
		"mtime": "2026-09-11T16:17:03.435Z",
		"size": 380933,
		"path": "../public/assets/AreaChart-OJbiucgo.js"
	},
	"/assets/key-round-Cz1PkCBb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"158-mA7Zoxp7Ns0bs9vq7TU1c+8WJs0\"",
		"mtime": "2026-09-11T16:17:03.447Z",
		"size": 344,
		"path": "../public/assets/key-round-Cz1PkCBb.js"
	},
	"/assets/layers-D1-9MHft.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19a-POH4r4KEJ1ZT1nBg9hVe4MP/LUs\"",
		"mtime": "2026-09-11T16:17:03.448Z",
		"size": 410,
		"path": "../public/assets/layers-D1-9MHft.js"
	},
	"/assets/link-Cbmdbd5h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a8f-sxAr50JGrAwrV7tAZTxiIesMXb8\"",
		"mtime": "2026-09-11T16:17:03.448Z",
		"size": 27279,
		"path": "../public/assets/link-Cbmdbd5h.js"
	},
	"/assets/locations-DClGIg5B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7372-ToINbz8BjYGT2DNsdCfst18AEA8\"",
		"mtime": "2026-09-11T16:17:03.449Z",
		"size": 29554,
		"path": "../public/assets/locations-DClGIg5B.js"
	},
	"/assets/lock-B-rUkILC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-z9I1VXnyWEu5pZOeBRVhUzpgo/U\"",
		"mtime": "2026-09-11T16:17:03.450Z",
		"size": 195,
		"path": "../public/assets/lock-B-rUkILC.js"
	},
	"/assets/login-D7jw0_ik.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1294-GYMIYfj2RHpRGZEWUmtjfaN1wHc\"",
		"mtime": "2026-09-11T16:17:03.451Z",
		"size": 4756,
		"path": "../public/assets/login-D7jw0_ik.js"
	},
	"/assets/logs-D0DzhUf4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca2-Rlq8ou4DCljXa0beKF/JVlZ+i4o\"",
		"mtime": "2026-09-11T16:17:03.454Z",
		"size": 3234,
		"path": "../public/assets/logs-D0DzhUf4.js"
	},
	"/assets/meters-DRbVmSKz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b49-08Hpe4m8ewr9Izb33dmA8uJ3ATE\"",
		"mtime": "2026-09-11T16:17:03.455Z",
		"size": 11081,
		"path": "../public/assets/meters-DRbVmSKz.js"
	},
	"/assets/monitoring-yeFa34Ir.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1620-y6rC2nQE48hgp/9U+6qJbH3lDd0\"",
		"mtime": "2026-09-11T16:17:03.455Z",
		"size": 5664,
		"path": "../public/assets/monitoring-yeFa34Ir.js"
	},
	"/assets/index-C3L-kYfR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d9cf-PeoBF5nTTsdNXvLwVGoeLFoxTiY\"",
		"mtime": "2026-09-11T16:17:03.434Z",
		"size": 317903,
		"path": "../public/assets/index-C3L-kYfR.js"
	},
	"/assets/navigation-BlQL3ek5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a5-6AyOpheQFrkhLPIerlnhuwYiZ0A\"",
		"mtime": "2026-09-11T16:17:03.456Z",
		"size": 933,
		"path": "../public/assets/navigation-BlQL3ek5.js"
	},
	"/assets/plus-BKYHyY1i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-Io1kmL+FjLpmkX77C/YHcMU8Cd0\"",
		"mtime": "2026-09-11T16:17:03.470Z",
		"size": 142,
		"path": "../public/assets/plus-BKYHyY1i.js"
	},
	"/assets/power-DhCtuCjU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-gMndXss0lrUh1EhAC5ytSTSr5f8\"",
		"mtime": "2026-09-11T16:17:03.473Z",
		"size": 162,
		"path": "../public/assets/power-DhCtuCjU.js"
	},
	"/assets/recharges-C4fmUxdg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b67-+YAFUomrhS28uggNGbMti0ANSxU\"",
		"mtime": "2026-09-11T16:17:03.474Z",
		"size": 7015,
		"path": "../public/assets/recharges-C4fmUxdg.js"
	},
	"/assets/refresh-cw-D-f-8ddy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-m6EW7gEtoRRr1Aj/DGs/2BoZQJY\"",
		"mtime": "2026-09-11T16:17:03.477Z",
		"size": 310,
		"path": "../public/assets/refresh-cw-D-f-8ddy.js"
	},
	"/assets/reports-dSWwwviS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a12-oq1C/uDTbuuuWmGazTjVqQoZTqY\"",
		"mtime": "2026-09-11T16:17:03.482Z",
		"size": 2578,
		"path": "../public/assets/reports-dSWwwviS.js"
	},
	"/assets/rolldown-runtime-QTnfLwEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-wnqLLSlp3SaE+lbe74bKNe5Rpds\"",
		"mtime": "2026-09-11T16:17:03.495Z",
		"size": 694,
		"path": "../public/assets/rolldown-runtime-QTnfLwEv.js"
	},
	"/assets/shield-alert-D1P4xwNl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"156-u/ZP1Z+lssdZOvcXlCs8ntVybL0\"",
		"mtime": "2026-09-11T16:17:03.498Z",
		"size": 342,
		"path": "../public/assets/shield-alert-D1P4xwNl.js"
	},
	"/assets/routes-DrCe8ac7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d75-+n1K3dEiwwG1HY8w+JBmqdMfDm8\"",
		"mtime": "2026-09-11T16:17:03.497Z",
		"size": 36213,
		"path": "../public/assets/routes-DrCe8ac7.js"
	},
	"/assets/simulator-C-EDQWif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6320-Rx5IACOQQg4NeMEq3zos9ApCCRU\"",
		"mtime": "2026-09-11T16:17:03.498Z",
		"size": 25376,
		"path": "../public/assets/simulator-C-EDQWif.js"
	},
	"/assets/tariffs-CA35aoIR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"203f-FUsvCUGJ+tBkTlLM6sQQ0VUiw/4\"",
		"mtime": "2026-09-11T16:17:03.499Z",
		"size": 8255,
		"path": "../public/assets/tariffs-CA35aoIR.js"
	},
	"/assets/trash-2-DfFSERZa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-WYkGfLx21EP2Mg6hkNrsi3z5/Mc\"",
		"mtime": "2026-09-11T16:17:03.500Z",
		"size": 317,
		"path": "../public/assets/trash-2-DfFSERZa.js"
	},
	"/assets/user-plus-DyKHiiSL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12b-F3eEwr1pdOcUj5/0BDIwEZjbJ38\"",
		"mtime": "2026-09-11T16:17:03.501Z",
		"size": 299,
		"path": "../public/assets/user-plus-DyKHiiSL.js"
	},
	"/assets/styles-B0Rkhno8.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19f65-aNMVAwJWpW5Gwofn9KR1hQVYCrk\"",
		"mtime": "2026-09-11T16:17:03.509Z",
		"size": 106341,
		"path": "../public/assets/styles-B0Rkhno8.css"
	},
	"/assets/users-BuklWGPx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2145-X8MVVCJT8rhcc+DDM03RiZsSd9A\"",
		"mtime": "2026-09-11T16:17:03.502Z",
		"size": 8517,
		"path": "../public/assets/users-BuklWGPx.js"
	},
	"/assets/wifi-B_7QvDi4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e1-GtJ3MRbbHKziLjtOz/uKsCesngY\"",
		"mtime": "2026-09-11T16:17:03.503Z",
		"size": 481,
		"path": "../public/assets/wifi-B_7QvDi4.js"
	},
	"/assets/wifi-off-DCR98O0c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c1-L/rOOW/tXP1YanlIqnF2BWtZ8rg\"",
		"mtime": "2026-09-11T16:17:03.507Z",
		"size": 449,
		"path": "../public/assets/wifi-off-DCR98O0c.js"
	},
	"/assets/x-RK1XQpXv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-QA5dAjIY+dt1CsAvSQCb9LBTG34\"",
		"mtime": "2026-09-11T16:17:03.507Z",
		"size": 143,
		"path": "../public/assets/x-RK1XQpXv.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_WuNX3B = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_WuNX3B
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
