import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { E as MapPin, I as FolderKanban, J as Building, T as Navigation, _ as RefreshCw, n as X, s as UserPlus, u as Trash2 } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
import { t as DataTable } from "./data-table-BHmxasGg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-CzfTmLsh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterCustomerModal({ isOpen, onClose, onSuccess }) {
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [nationalId, setNationalId] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [locations, setLocations] = (0, import_react.useState)({
		divisions: [],
		districts: [],
		areas: [],
		projects: []
	});
	const [selectedDivision, setSelectedDivision] = (0, import_react.useState)("");
	const [selectedDistrict, setSelectedDistrict] = (0, import_react.useState)("");
	const [selectedArea, setSelectedArea] = (0, import_react.useState)("");
	const [selectedProject, setSelectedProject] = (0, import_react.useState)("");
	const [loadingLocations, setLoadingLocations] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			setLoadingLocations(true);
			api.getLocationsSummary().then((res) => {
				setLocations(res);
			}).catch((err) => console.warn("Failed to load locations:", err)).finally(() => setLoadingLocations(false));
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const availableDistricts = locations.districts.filter((dist) => {
		if (!selectedDivision) return false;
		const div = locations.divisions.find((d) => d.name === selectedDivision);
		return div ? dist.divisionId === div.id : dist.divisionName === selectedDivision;
	});
	const availableAreas = locations.areas.filter((area) => {
		if (!selectedDistrict) return false;
		const dist = locations.districts.find((d) => d.name === selectedDistrict);
		return dist ? area.districtId === dist.id : area.districtName === selectedDistrict;
	});
	const availableProjects = locations.projects.filter((proj) => {
		if (!selectedArea) return true;
		const ar = locations.areas.find((a) => a.name === selectedArea);
		return ar ? proj.areaId === ar.id || proj.areaName === selectedArea || !proj.areaId : true;
	});
	const handleDivisionChange = (divName) => {
		setSelectedDivision(divName);
		setSelectedDistrict("");
		setSelectedArea("");
		setSelectedProject("");
	};
	const handleDistrictChange = (distName) => {
		setSelectedDistrict(distName);
		setSelectedArea("");
		setSelectedProject("");
	};
	const handleAreaChange = (arName) => {
		setSelectedArea(arName);
		const matchingProj = locations.projects.find((p) => {
			const ar = locations.areas.find((a) => a.name === arName);
			return ar ? p.areaId === ar.id : false;
		});
		if (matchingProj) setSelectedProject(matchingProj.name);
		else setSelectedProject("");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await api.createCustomer({
				firstName,
				lastName,
				phone,
				email: email || void 0,
				nationalId: nationalId || void 0,
				address: address || void 0,
				division: selectedDivision || void 0,
				district: selectedDistrict || void 0,
				area: selectedArea || void 0,
				projectName: selectedProject || void 0
			});
			onSuccess();
			onClose();
			setFirstName("");
			setLastName("");
			setPhone("");
			setEmail("");
			setNationalId("");
			setAddress("");
			setSelectedDivision("");
			setSelectedDistrict("");
			setSelectedArea("");
			setSelectedProject("");
		} catch (err) {
			setError(err.message || "Failed to register customer");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl rounded-2xl bg-card border border-border p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto",
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "Register Customer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Create customer account and assign zoning & project details"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "First Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "e.g. Tariqul",
								value: firstName,
								onChange: (e) => setFirstName(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Last Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "e.g. Islam",
								value: lastName,
								onChange: (e) => setLastName(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Phone Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "+880 1712 345678",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Email (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								placeholder: "customer@example.com",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "National ID / Passport (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "e.g. 1992837461298",
							value: nationalId,
							onChange: (e) => setNationalId(e.target.value),
							className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), "Zoning & Project Information"]
									}), loadingLocations && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Loading locations..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-3 w-3 text-blue-500" }), " Division"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedDivision,
										onChange: (e) => handleDivisionChange(e.target.value),
										className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select Division"
										}), locations.divisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: d.name,
											children: d.name
										}, d.id))]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3 w-3 text-indigo-500" }), " District"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedDistrict,
										disabled: !selectedDivision,
										onChange: (e) => handleDistrictChange(e.target.value),
										className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: selectedDivision ? "Select District" : "Select Division first"
										}), availableDistricts.map((dist) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: dist.name,
											children: dist.name
										}, dist.id))]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-emerald-500" }), " Area / Zone"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedArea,
										disabled: !selectedDistrict,
										onChange: (e) => handleAreaChange(e.target.value),
										className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: selectedDistrict ? "Select Area / Zone" : "Select District first"
										}), availableAreas.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: area.name,
											children: [
												area.name,
												" ",
												area.postalCode ? `(${area.postalCode})` : ""
											]
										}, area.id))]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-3 w-3 text-amber-500" }), " Project / Grid"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedProject,
										onChange: (e) => setSelectedProject(e.target.value),
										className: "w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select Project (Optional)"
										}), availableProjects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: p.name,
											children: [
												p.name,
												" ",
												p.code ? `[${p.code}]` : ""
											]
										}, p.id))]
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted-foreground mb-1 block",
							children: "Detailed Address (House, Road, Apartment)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							placeholder: "e.g. House 42, Road 7/A, Flat 4B",
							rows: 2,
							value: address,
							onChange: (e) => setAddress(e.target.value),
							className: "w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
								disabled: loading,
								className: "h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50",
								children: loading ? "Registering..." : "Register Customer"
							})]
						})
					]
				})
			]
		})
	});
}
function CustomersPage() {
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const fetchCustomers = () => {
		setLoading(true);
		api.getCustomers().then(setCustomers).catch((err) => console.error("Failed to fetch customers:", err)).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		fetchCustomers();
	}, []);
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this customer?")) return;
		try {
			await api.deleteCustomer(id);
			fetchCustomers();
		} catch (err) {
			alert(err.message || "Failed to delete customer");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Customers",
		subtitle: `${customers.length} registered profiles with zoning & smart meter assignments`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 flex-wrap mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Directory"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: fetchCustomers,
						className: "p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground",
						title: "Refresh",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setModalOpen(true),
					className: "h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), " Register Customer"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading,
				rows: customers,
				emptyTitle: "No Customers Registered",
				emptyDescription: "There are no customer profiles in your database yet. Register your first customer to start assigning prepaid gas meters and tracking consumption.",
				emptyActionLabel: "Register First Customer",
				onEmptyAction: () => setModalOpen(true),
				columns: [
					{
						key: "name",
						header: "Customer",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-9 w-9 rounded-full bg-accent grid place-items-center text-xs font-semibold text-primary shrink-0",
								children: [r.firstName[0], r.lastName[0]]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium text-foreground",
								children: [
									r.firstName,
									" ",
									r.lastName
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: r.email || `ID #${r.id}`
							})] })]
						})
					},
					{
						key: "phone",
						header: "Phone",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground/90 font-mono text-xs",
							children: r.phone
						})
					},
					{
						key: "divisionDistrict",
						header: "Division / District",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium text-foreground",
								children: r.district || "—"
							}), r.division && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-2.5 w-2.5 text-blue-500" }), r.division]
							})]
						})
					},
					{
						key: "areaProject",
						header: "Area & Project",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 font-medium text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.area || "—" })]
							}), r.projectName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-primary flex items-center gap-1 truncate max-w-[170px]",
								title: r.projectName,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-2.5 w-2.5 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: r.projectName
								})]
							})]
						})
					},
					{
						key: "address",
						header: "Street Address",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-foreground/80 max-w-[180px] truncate inline-block",
							children: r.address || "—"
						})
					},
					{
						key: "status",
						header: "Status",
						render: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							tone: "success",
							children: "Active"
						})
					},
					{
						key: "actions",
						header: "Actions",
						align: "right",
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDelete(r.id),
							className: "h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition",
							title: "Delete Customer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					}
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterCustomerModal, {
				isOpen: modalOpen,
				onClose: () => setModalOpen(false),
				onSuccess: fetchCustomers
			})
		]
	});
}
//#endregion
export { CustomersPage as component };
