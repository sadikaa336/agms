import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { E as MapPin, I as FolderKanban, J as Building, T as Navigation, _ as RefreshCw, g as Search, j as Layers, n as X, q as ChevronRight, u as Trash2, x as Plus } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/locations-DidKnH6B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LocationsPage() {
	const [data, setData] = (0, import_react.useState)({
		divisions: [],
		districts: [],
		areas: [],
		projects: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [addDivisionOpen, setAddDivisionOpen] = (0, import_react.useState)(false);
	const [addDistrictOpen, setAddDistrictOpen] = (0, import_react.useState)(false);
	const [addAreaOpen, setAddAreaOpen] = (0, import_react.useState)(false);
	const [addProjectOpen, setAddProjectOpen] = (0, import_react.useState)(false);
	const [divisionName, setDivisionName] = (0, import_react.useState)("");
	const [districtDivId, setDistrictDivId] = (0, import_react.useState)("");
	const [districtName, setDistrictName] = (0, import_react.useState)("");
	const [areaDistId, setAreaDistId] = (0, import_react.useState)("");
	const [areaName, setAreaName] = (0, import_react.useState)("");
	const [areaPostalCode, setAreaPostalCode] = (0, import_react.useState)("");
	const [projectAreaId, setProjectAreaId] = (0, import_react.useState)("");
	const [projectName, setProjectName] = (0, import_react.useState)("");
	const [projectCode, setProjectCode] = (0, import_react.useState)("");
	const [projectDesc, setProjectDesc] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [actionError, setActionError] = (0, import_react.useState)(null);
	const fetchLocations = () => {
		setLoading(true);
		api.getLocationsSummary().then((res) => {
			setData(res);
		}).catch((err) => console.error("Failed to load locations:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchLocations();
	}, []);
	const handleAddDivision = async (e) => {
		e.preventDefault();
		if (!divisionName.trim()) return;
		setSubmitting(true);
		setActionError(null);
		try {
			await api.createDivision({ name: divisionName.trim() });
			setDivisionName("");
			setAddDivisionOpen(false);
			fetchLocations();
		} catch (err) {
			setActionError(err.message || "Failed to add division");
		} finally {
			setSubmitting(false);
		}
	};
	const handleAddDistrict = async (e) => {
		e.preventDefault();
		if (!districtDivId || !districtName.trim()) return;
		setSubmitting(true);
		setActionError(null);
		try {
			await api.createDistrict({
				divisionId: Number(districtDivId),
				name: districtName.trim()
			});
			setDistrictName("");
			setDistrictDivId("");
			setAddDistrictOpen(false);
			fetchLocations();
		} catch (err) {
			setActionError(err.message || "Failed to add district");
		} finally {
			setSubmitting(false);
		}
	};
	const handleAddArea = async (e) => {
		e.preventDefault();
		if (!areaDistId || !areaName.trim()) return;
		setSubmitting(true);
		setActionError(null);
		try {
			await api.createArea({
				districtId: Number(areaDistId),
				name: areaName.trim(),
				postalCode: areaPostalCode.trim() || void 0
			});
			setAreaName("");
			setAreaPostalCode("");
			setAreaDistId("");
			setAddAreaOpen(false);
			fetchLocations();
		} catch (err) {
			setActionError(err.message || "Failed to add area");
		} finally {
			setSubmitting(false);
		}
	};
	const handleAddProject = async (e) => {
		e.preventDefault();
		if (!projectName.trim()) return;
		setSubmitting(true);
		setActionError(null);
		try {
			await api.createProject({
				areaId: projectAreaId ? Number(projectAreaId) : null,
				name: projectName.trim(),
				code: projectCode.trim() || void 0,
				description: projectDesc.trim() || void 0,
				status: "ACTIVE"
			});
			setProjectName("");
			setProjectCode("");
			setProjectDesc("");
			setProjectAreaId("");
			setAddProjectOpen(false);
			fetchLocations();
		} catch (err) {
			setActionError(err.message || "Failed to add project");
		} finally {
			setSubmitting(false);
		}
	};
	const handleDelete = async (type, id, name) => {
		if (!confirm(`Are you sure you want to delete ${type} "${name}"?`)) return;
		try {
			if (type === "division") await api.deleteDivision(id);
			if (type === "district") await api.deleteDistrict(id);
			if (type === "area") await api.deleteArea(id);
			if (type === "project") await api.deleteProject(id);
			fetchLocations();
		} catch (err) {
			alert(err.message || `Failed to delete ${type}`);
		}
	};
	const q = searchQuery.toLowerCase().trim();
	const filteredDivisions = data.divisions.filter((d) => d.name.toLowerCase().includes(q));
	const filteredDistricts = data.districts.filter((d) => d.name.toLowerCase().includes(q) || d.divisionName && d.divisionName.toLowerCase().includes(q));
	const filteredAreas = data.areas.filter((a) => a.name.toLowerCase().includes(q) || a.postalCode && a.postalCode.toLowerCase().includes(q) || a.districtName && a.districtName.toLowerCase().includes(q) || a.divisionName && a.divisionName.toLowerCase().includes(q));
	const filteredProjects = data.projects.filter((p) => p.name.toLowerCase().includes(q) || p.code && p.code.toLowerCase().includes(q) || p.areaName && p.areaName.toLowerCase().includes(q));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Location & Zoning Management",
		subtitle: "Configure Divisions, Districts, Areas, and Gas Project addresses for customer assignments",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight",
							children: data.divisions.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Divisions"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight",
							children: data.districts.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Districts"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight",
							children: data.areas.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Areas / Zones"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight",
							children: data.projects.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-medium",
							children: "Active Projects"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-xl p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 bg-muted/60 p-1 rounded-lg w-full md:w-auto overflow-x-auto",
					children: [
						{
							id: "all",
							label: "Overview",
							icon: Layers,
							count: null
						},
						{
							id: "divisions",
							label: "Divisions",
							icon: Building,
							count: data.divisions.length
						},
						{
							id: "districts",
							label: "Districts",
							icon: Navigation,
							count: data.districts.length
						},
						{
							id: "areas",
							label: "Areas",
							icon: MapPin,
							count: data.areas.length
						},
						{
							id: "projects",
							label: "Projects",
							icon: FolderKanban,
							count: data.projects.length
						}
					].map((t) => {
						const Icon = t.icon;
						const active = activeTab === t.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab(t.id),
							className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label }),
								t.count !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`,
									children: t.count
								})
							]
						}, t.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full md:w-auto justify-end flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 md:w-56",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Filter locations...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								className: "w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: fetchLocations,
							className: "h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition",
							title: "Refresh list",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActionError(null);
										setAddDivisionOpen(true);
									},
									className: "h-8 px-2.5 rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-400 hover:bg-blue-600/20 text-xs font-medium flex items-center gap-1 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Division"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActionError(null);
										setAddDistrictOpen(true);
									},
									className: "h-8 px-2.5 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600/20 text-xs font-medium flex items-center gap-1 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " District"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActionError(null);
										setAddAreaOpen(true);
									},
									className: "h-8 px-2.5 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 text-xs font-medium flex items-center gap-1 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Area"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActionError(null);
										setAddProjectOpen(true);
									},
									className: "h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:bg-primary/90 transition shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Project"]
								})
							]
						})
					]
				})]
			}),
			activeTab === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }), "Geographic Zoning Structure"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-4 leading-relaxed",
								children: "Prepaid gas meter installations are mapped according to this 4-tier hierarchy. When registering customers, their addresses link directly to these database records."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [data.divisions.map((div) => {
									const divDistricts = data.districts.filter((d) => d.divisionId === div.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border/70 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between font-semibold text-xs text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-3.5 w-3.5 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [div.name, " Division"] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground",
												children: [
													divDistricts.length,
													" ",
													divDistricts.length === 1 ? "district" : "districts"
												]
											})]
										}), divDistricts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 pl-4 border-l-2 border-primary/20 space-y-2",
											children: divDistricts.map((dist) => {
												const distAreas = data.areas.filter((a) => a.districtId === dist.id);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-foreground/90 font-medium",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dist.name })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[10px] text-muted-foreground",
															children: [distAreas.length, " areas"]
														})]
													}), distAreas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex flex-wrap gap-1.5 mt-1.5 pl-4",
														children: distAreas.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1 text-[11px] bg-background border border-border px-2 py-0.5 rounded text-foreground/80",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-2.5 w-2.5 text-emerald-500" }),
																area.name,
																area.postalCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-[10px] text-muted-foreground",
																	children: [
																		"(",
																		area.postalCode,
																		")"
																	]
																})
															]
														}, area.id))
													})]
												}, dist.id);
											})
										})]
									}, div.id);
								}), data.divisions.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center py-6 text-xs text-muted-foreground",
									children: "No divisions configured yet. Click \"+ Division\" above to add your first division."
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-4 w-4 text-amber-500" }), "Smart Gas Projects"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setActionError(null);
										setAddProjectOpen(true);
									},
									className: "text-xs text-primary hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " New Project"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-4",
								children: "Piping infrastructure, residential zones, and industrial clusters currently active."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [data.projects.map((proj) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-border/80 rounded-lg p-3.5 bg-background shadow-xs hover:border-primary/40 transition flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-xs text-foreground",
													children: proj.name
												}),
												proj.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground",
													children: proj.code
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
													tone: "success",
													children: proj.status
												})
											]
										}),
										proj.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-1 line-clamp-2",
											children: proj.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-3 text-[11px] text-muted-foreground/90 mt-2",
											children: proj.areaName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-emerald-500" }),
													"Area: ",
													proj.areaName
												]
											})
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete("project", proj.id, proj.name),
										className: "text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition",
										title: "Delete Project",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								}, proj.id)), data.projects.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center py-6 text-xs text-muted-foreground",
									children: "No projects registered yet."
								})]
							})
						]
					})]
				})
			}),
			activeTab === "divisions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: filteredDivisions,
				emptyTitle: "No Divisions Found",
				emptyDescription: "Add divisions (e.g. Dhaka, Chittagong, Sylhet) to create regional zones.",
				emptyActionLabel: "Add Division",
				onEmptyAction: () => {
					setActionError(null);
					setAddDivisionOpen(true);
				},
				columns: [
					{
						key: "id",
						header: "ID",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-mono text-muted-foreground",
							children: ["#", r.id]
						})
					},
					{
						key: "name",
						header: "Division Name",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-xs text-foreground",
								children: r.name
							})]
						})
					},
					{
						key: "districtsCount",
						header: "Linked Districts",
						render: (r) => {
							const count = data.districts.filter((d) => d.divisionId === r.id).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									count,
									" ",
									count === 1 ? "District" : "Districts"
								]
							});
						}
					},
					{
						key: "createdAt",
						header: "Created",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete("division", r.id, r.name),
							className: "h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Delete Division",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})
					}
				]
			}),
			activeTab === "districts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: filteredDistricts,
				emptyTitle: "No Districts Found",
				emptyDescription: "Add districts linked to their parent divisions.",
				emptyActionLabel: "Add District",
				onEmptyAction: () => {
					setActionError(null);
					setAddDistrictOpen(true);
				},
				columns: [
					{
						key: "id",
						header: "ID",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-mono text-muted-foreground",
							children: ["#", r.id]
						})
					},
					{
						key: "name",
						header: "District Name",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-xs text-foreground",
								children: r.name
							})]
						})
					},
					{
						key: "division",
						header: "Parent Division",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium",
							children: r.divisionName || `Division #${r.divisionId}`
						})
					},
					{
						key: "areasCount",
						header: "Linked Areas",
						render: (r) => {
							const count = data.areas.filter((a) => a.districtId === r.id).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									count,
									" ",
									count === 1 ? "Area" : "Areas"
								]
							});
						}
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete("district", r.id, r.name),
							className: "h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Delete District",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})
					}
				]
			}),
			activeTab === "areas" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: filteredAreas,
				emptyTitle: "No Areas Found",
				emptyDescription: "Add municipal areas, thanas, or neighborhoods with optional postal codes.",
				emptyActionLabel: "Add Area",
				onEmptyAction: () => {
					setActionError(null);
					setAddAreaOpen(true);
				},
				columns: [
					{
						key: "id",
						header: "ID",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-mono text-muted-foreground",
							children: ["#", r.id]
						})
					},
					{
						key: "name",
						header: "Area Name",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-xs text-foreground",
								children: r.name
							})]
						})
					},
					{
						key: "postalCode",
						header: "Postal Code",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono text-muted-foreground",
							children: r.postalCode || "—"
						})
					},
					{
						key: "district",
						header: "District",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium",
							children: r.districtName || `District #${r.districtId}`
						})
					},
					{
						key: "division",
						header: "Division",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: r.divisionName || "—"
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete("area", r.id, r.name),
							className: "h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Delete Area",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})
					}
				]
			}),
			activeTab === "projects" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: filteredProjects,
				emptyTitle: "No Projects Found",
				emptyDescription: "Register smart gas piping projects and distribution grids.",
				emptyActionLabel: "Add Project",
				onEmptyAction: () => {
					setActionError(null);
					setAddProjectOpen(true);
				},
				columns: [
					{
						key: "name",
						header: "Project Name",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-xs text-foreground",
								children: r.name
							})]
						}), r.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground line-clamp-1 mt-0.5",
							children: r.description
						})] })
					},
					{
						key: "code",
						header: "Project Code",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono text-muted-foreground",
							children: r.code || "—"
						})
					},
					{
						key: "area",
						header: "Area / Zone",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium",
							children: r.areaName || "Unassigned"
						})
					},
					{
						key: "status",
						header: "Status",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							tone: "success",
							children: r.status
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete("project", r.id, r.name),
							className: "h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Delete Project",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})
					}
				]
			}),
			addDivisionOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAddDivisionOpen(false),
							className: "absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Add Division"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "e.g. Dhaka, Chittagong, Sylhet"
							})] })]
						}),
						actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20",
							children: actionError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddDivision,
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Division Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "e.g. Barisal",
								value: divisionName,
								onChange: (e) => setDivisionName(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setAddDivisionOpen(false),
									className: "h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: submitting,
									className: "h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50",
									children: submitting ? "Saving..." : "Create Division"
								})]
							})]
						})
					]
				})
			}),
			addDistrictOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAddDistrictOpen(false),
							className: "absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Add District"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Belongs to a selected Division"
							})] })]
						}),
						actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20",
							children: actionError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddDistrict,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "Parent Division"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									required: true,
									value: districtDivId,
									onChange: (e) => setDistrictDivId(e.target.value ? Number(e.target.value) : ""),
									className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Division"
									}), data.divisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: d.id,
										children: d.name
									}, d.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "District Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									placeholder: "e.g. Gazipur",
									value: districtName,
									onChange: (e) => setDistrictName(e.target.value),
									className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setAddDistrictOpen(false),
										className: "h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: submitting,
										className: "h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50",
										children: submitting ? "Saving..." : "Create District"
									})]
								})
							]
						})
					]
				})
			}),
			addAreaOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAddAreaOpen(false),
							className: "absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Add Area / Zone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Upazila, Thana, or Neighborhood Zone"
							})] })]
						}),
						actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20",
							children: actionError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddArea,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "Parent District"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									required: true,
									value: areaDistId,
									onChange: (e) => setAreaDistId(e.target.value ? Number(e.target.value) : ""),
									className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select District"
									}), data.districts.map((dist) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: dist.id,
										children: [
											dist.name,
											" (",
											dist.divisionName || "Division",
											")"
										]
									}, dist.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "Area / Thana Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									placeholder: "e.g. Dhanmondi, Banani, Mirpur",
									value: areaName,
									onChange: (e) => setAreaName(e.target.value),
									className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "Postal Code (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									placeholder: "e.g. 1205",
									value: areaPostalCode,
									onChange: (e) => setAreaPostalCode(e.target.value),
									className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setAddAreaOpen(false),
										className: "h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: submitting,
										className: "h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50",
										children: submitting ? "Saving..." : "Create Area"
									})]
								})
							]
						})
					]
				})
			}),
			addProjectOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAddProjectOpen(false),
							className: "absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Add Smart Gas Project"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Piping network, cluster or development project"
							})] })]
						}),
						actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20",
							children: actionError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddProject,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "Project Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									placeholder: "e.g. Bashundhara Smart Gas Grid",
									value: projectName,
									onChange: (e) => setProjectName(e.target.value),
									className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 block",
										children: "Project Code (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "PRJ-BAS-01",
										value: projectCode,
										onChange: (e) => setProjectCode(e.target.value),
										className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 block",
										children: "Target Area"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: projectAreaId,
										onChange: (e) => setProjectAreaId(e.target.value ? Number(e.target.value) : ""),
										className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select Area (Optional)"
										}), data.areas.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: a.id,
											children: [
												a.name,
												" (",
												a.districtName,
												")"
											]
										}, a.id))]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground mb-1 block",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									placeholder: "Residential pipeline details or scope",
									value: projectDesc,
									onChange: (e) => setProjectDesc(e.target.value),
									className: "w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setAddProjectOpen(false),
										className: "h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: submitting,
										className: "h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50",
										children: submitting ? "Saving..." : "Create Project"
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { LocationsPage as component };
