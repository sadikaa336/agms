import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import {
  api,
  type LocationsSummary,
  type Division,
  type District,
  type Area,
  type Project,
} from "../lib/api";
import {
  MapPin,
  Building,
  Navigation,
  FolderKanban,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  X,
  Layers,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations & Zoning — Automated Prepaid Gas Meter Management Software" },
      {
        name: "description",
        content: "Manage geographic divisions, districts, areas, and smart prepaid gas projects.",
      },
      { property: "og:title", content: "Locations & Zoning — Automated Prepaid Gas Meter Management Software" },
      {
        property: "og:description",
        content: "Manage geographic divisions, districts, areas, and smart prepaid gas projects.",
      },
    ],
  }),
  component: LocationsPage,
});

type TabType = "all" | "divisions" | "districts" | "areas" | "projects";

function LocationsPage() {
  const [data, setData] = useState<LocationsSummary>({
    divisions: [],
    districts: [],
    areas: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [addDivisionOpen, setAddDivisionOpen] = useState(false);
  const [addDistrictOpen, setAddDistrictOpen] = useState(false);
  const [addAreaOpen, setAddAreaOpen] = useState(false);
  const [addProjectOpen, setAddProjectOpen] = useState(false);

  // Form states
  const [divisionName, setDivisionName] = useState("");
  const [districtDivId, setDistrictDivId] = useState<number | "">("");
  const [districtName, setDistrictName] = useState("");
  const [areaDistId, setAreaDistId] = useState<number | "">("");
  const [areaName, setAreaName] = useState("");
  const [areaPostalCode, setAreaPostalCode] = useState("");
  const [projectAreaId, setProjectAreaId] = useState<number | "">("");
  const [projectName, setProjectName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchLocations = () => {
    setLoading(true);
    api
      .getLocationsSummary()
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.error("Failed to load locations:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Handlers
  const handleAddDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisionName.trim()) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await api.createDivision({ name: divisionName.trim() });
      setDivisionName("");
      setAddDivisionOpen(false);
      fetchLocations();
    } catch (err: any) {
      setActionError(err.message || "Failed to add division");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!districtDivId || !districtName.trim()) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await api.createDistrict({
        divisionId: Number(districtDivId),
        name: districtName.trim(),
      });
      setDistrictName("");
      setDistrictDivId("");
      setAddDistrictOpen(false);
      fetchLocations();
    } catch (err: any) {
      setActionError(err.message || "Failed to add district");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaDistId || !areaName.trim()) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await api.createArea({
        districtId: Number(areaDistId),
        name: areaName.trim(),
        postalCode: areaPostalCode.trim() || undefined,
      });
      setAreaName("");
      setAreaPostalCode("");
      setAreaDistId("");
      setAddAreaOpen(false);
      fetchLocations();
    } catch (err: any) {
      setActionError(err.message || "Failed to add area");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await api.createProject({
        areaId: projectAreaId ? Number(projectAreaId) : null,
        name: projectName.trim(),
        code: projectCode.trim() || undefined,
        description: projectDesc.trim() || undefined,
        status: "ACTIVE",
      });
      setProjectName("");
      setProjectCode("");
      setProjectDesc("");
      setProjectAreaId("");
      setAddProjectOpen(false);
      fetchLocations();
    } catch (err: any) {
      setActionError(err.message || "Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (
    type: "division" | "district" | "area" | "project",
    id: number,
    name: string
  ) => {
    if (!confirm(`Are you sure you want to delete ${type} "${name}"?`)) return;
    try {
      if (type === "division") await api.deleteDivision(id);
      if (type === "district") await api.deleteDistrict(id);
      if (type === "area") await api.deleteArea(id);
      if (type === "project") await api.deleteProject(id);
      fetchLocations();
    } catch (err: any) {
      alert(err.message || `Failed to delete ${type}`);
    }
  };

  const q = searchQuery.toLowerCase().trim();

  const filteredDivisions = data.divisions.filter((d) =>
    d.name.toLowerCase().includes(q)
  );
  const filteredDistricts = data.districts.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      (d.divisionName && d.divisionName.toLowerCase().includes(q))
  );
  const filteredAreas = data.areas.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      (a.postalCode && a.postalCode.toLowerCase().includes(q)) ||
      (a.districtName && a.districtName.toLowerCase().includes(q)) ||
      (a.divisionName && a.divisionName.toLowerCase().includes(q))
  );
  const filteredProjects = data.projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.code && p.code.toLowerCase().includes(q)) ||
      (p.areaName && p.areaName.toLowerCase().includes(q))
  );

  return (
    <AdminLayout
      title="Location & Zoning Management"
      subtitle="Configure Divisions, Districts, Areas, and Gas Project addresses for customer assignments"
    >
      {/* Top Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{data.divisions.length}</div>
            <div className="text-xs text-muted-foreground font-medium">Divisions</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{data.districts.length}</div>
            <div className="text-xs text-muted-foreground font-medium">Districts</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{data.areas.length}</div>
            <div className="text-xs text-muted-foreground font-medium">Areas / Zones</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{data.projects.length}</div>
            <div className="text-xs text-muted-foreground font-medium">Active Projects</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs, Search & Action Buttons */}
      <div className="bg-card border border-border rounded-xl p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Overview", icon: Layers, count: null },
            { id: "divisions", label: "Divisions", icon: Building, count: data.divisions.length },
            { id: "districts", label: "Districts", icon: Navigation, count: data.districts.length },
            { id: "areas", label: "Areas", icon: MapPin, count: data.areas.length },
            { id: "projects", label: "Projects", icon: FolderKanban, count: data.projects.length },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
                {t.count !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <div className="relative flex-1 md:w-56">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            onClick={fetchLocations}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition"
            title="Refresh list"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Contextual Add Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActionError(null);
                setAddDivisionOpen(true);
              }}
              className="h-8 px-2.5 rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-400 hover:bg-blue-600/20 text-xs font-medium flex items-center gap-1 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Division
            </button>
            <button
              onClick={() => {
                setActionError(null);
                setAddDistrictOpen(true);
              }}
              className="h-8 px-2.5 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600/20 text-xs font-medium flex items-center gap-1 transition"
            >
              <Plus className="h-3.5 w-3.5" /> District
            </button>
            <button
              onClick={() => {
                setActionError(null);
                setAddAreaOpen(true);
              }}
              className="h-8 px-2.5 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 text-xs font-medium flex items-center gap-1 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Area
            </button>
            <button
              onClick={() => {
                setActionError(null);
                setAddProjectOpen(true);
              }}
              className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:bg-primary/90 transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Project
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB: Hierarchy cards */}
      {activeTab === "all" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Summary of Hierarchy */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                Geographic Zoning Structure
              </h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Prepaid gas meter installations are mapped according to this 4-tier hierarchy.
                When registering customers, their addresses link directly to these database records.
              </p>

              <div className="space-y-3">
                {data.divisions.map((div) => {
                  const divDistricts = data.districts.filter((d) => d.divisionId === div.id);
                  return (
                    <div
                      key={div.id}
                      className="border border-border/70 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition"
                    >
                      <div className="flex items-center justify-between font-semibold text-xs text-foreground">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-blue-500" />
                          <span>{div.name} Division</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {divDistricts.length} {divDistricts.length === 1 ? "district" : "districts"}
                        </span>
                      </div>

                      {divDistricts.length > 0 && (
                        <div className="mt-2 pl-4 border-l-2 border-primary/20 space-y-2">
                          {divDistricts.map((dist) => {
                            const distAreas = data.areas.filter((a) => a.districtId === dist.id);
                            return (
                              <div key={dist.id} className="text-xs">
                                <div className="flex items-center justify-between text-foreground/90 font-medium">
                                  <div className="flex items-center gap-1.5">
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    <span>{dist.name}</span>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">
                                    {distAreas.length} areas
                                  </span>
                                </div>

                                {distAreas.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-1.5 pl-4">
                                    {distAreas.map((area) => (
                                      <span
                                        key={area.id}
                                        className="inline-flex items-center gap-1 text-[11px] bg-background border border-border px-2 py-0.5 rounded text-foreground/80"
                                      >
                                        <MapPin className="h-2.5 w-2.5 text-emerald-500" />
                                        {area.name}
                                        {area.postalCode && (
                                          <span className="text-[10px] text-muted-foreground">
                                            ({area.postalCode})
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {data.divisions.length === 0 && !loading && (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No divisions configured yet. Click "+ Division" above to add your first division.
                  </div>
                )}
              </div>
            </div>

            {/* Active Projects List */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-amber-500" />
                  Smart Gas Projects
                </h3>
                <button
                  onClick={() => {
                    setActionError(null);
                    setAddProjectOpen(true);
                  }}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> New Project
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Piping infrastructure, residential zones, and industrial clusters currently active.
              </p>

              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-border/80 rounded-lg p-3.5 bg-background shadow-xs hover:border-primary/40 transition flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-foreground">{proj.name}</span>
                        {proj.code && (
                          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                            {proj.code}
                          </span>
                        )}
                        <StatusPill tone="success">{proj.status}</StatusPill>
                      </div>
                      {proj.description && (
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                          {proj.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground/90 mt-2">
                        {proj.areaName && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-emerald-500" />
                            Area: {proj.areaName}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete("project", proj.id, proj.name)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {data.projects.length === 0 && !loading && (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No projects registered yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIVISIONS TAB */}
      {activeTab === "divisions" && (
        <DataTable
          loading={loading}
          rows={filteredDivisions}
          emptyTitle="No Divisions Found"
          emptyDescription="Add divisions (e.g. Dhaka, Chittagong, Sylhet) to create regional zones."
          emptyActionLabel="Add Division"
          onEmptyAction={() => {
            setActionError(null);
            setAddDivisionOpen(true);
          }}
          columns={[
            {
              key: "id",
              header: "ID",
              render: (r: Division) => (
                <span className="text-xs font-mono text-muted-foreground">#{r.id}</span>
              ),
            },
            {
              key: "name",
              header: "Division Name",
              render: (r: Division) => (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-xs text-foreground">{r.name}</span>
                </div>
              ),
            },
            {
              key: "districtsCount",
              header: "Linked Districts",
              render: (r: Division) => {
                const count = data.districts.filter((d) => d.divisionId === r.id).length;
                return (
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "District" : "Districts"}
                  </span>
                );
              },
            },
            {
              key: "createdAt",
              header: "Created",
              render: (r: Division) => (
                <span className="text-xs text-muted-foreground">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              align: "right",
              render: (r: Division) => (
                <button
                  onClick={() => handleDelete("division", r.id, r.name)}
                  className="h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Delete Division"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ),
            },
          ]}
        />
      )}

      {/* DISTRICTS TAB */}
      {activeTab === "districts" && (
        <DataTable
          loading={loading}
          rows={filteredDistricts}
          emptyTitle="No Districts Found"
          emptyDescription="Add districts linked to their parent divisions."
          emptyActionLabel="Add District"
          onEmptyAction={() => {
            setActionError(null);
            setAddDistrictOpen(true);
          }}
          columns={[
            {
              key: "id",
              header: "ID",
              render: (r: District) => (
                <span className="text-xs font-mono text-muted-foreground">#{r.id}</span>
              ),
            },
            {
              key: "name",
              header: "District Name",
              render: (r: District) => (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-xs text-foreground">{r.name}</span>
                </div>
              ),
            },
            {
              key: "division",
              header: "Parent Division",
              render: (r: District) => (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                  {r.divisionName || `Division #${r.divisionId}`}
                </span>
              ),
            },
            {
              key: "areasCount",
              header: "Linked Areas",
              render: (r: District) => {
                const count = data.areas.filter((a) => a.districtId === r.id).length;
                return (
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "Area" : "Areas"}
                  </span>
                );
              },
            },
            {
              key: "actions",
              header: "Actions",
              align: "right",
              render: (r: District) => (
                <button
                  onClick={() => handleDelete("district", r.id, r.name)}
                  className="h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Delete District"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ),
            },
          ]}
        />
      )}

      {/* AREAS TAB */}
      {activeTab === "areas" && (
        <DataTable
          loading={loading}
          rows={filteredAreas}
          emptyTitle="No Areas Found"
          emptyDescription="Add municipal areas, thanas, or neighborhoods with optional postal codes."
          emptyActionLabel="Add Area"
          onEmptyAction={() => {
            setActionError(null);
            setAddAreaOpen(true);
          }}
          columns={[
            {
              key: "id",
              header: "ID",
              render: (r: Area) => (
                <span className="text-xs font-mono text-muted-foreground">#{r.id}</span>
              ),
            },
            {
              key: "name",
              header: "Area Name",
              render: (r: Area) => (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-xs text-foreground">{r.name}</span>
                </div>
              ),
            },
            {
              key: "postalCode",
              header: "Postal Code",
              render: (r: Area) => (
                <span className="text-xs font-mono text-muted-foreground">
                  {r.postalCode || "—"}
                </span>
              ),
            },
            {
              key: "district",
              header: "District",
              render: (r: Area) => (
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                  {r.districtName || `District #${r.districtId}`}
                </span>
              ),
            },
            {
              key: "division",
              header: "Division",
              render: (r: Area) => (
                <span className="text-xs text-muted-foreground">{r.divisionName || "—"}</span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              align: "right",
              render: (r: Area) => (
                <button
                  onClick={() => handleDelete("area", r.id, r.name)}
                  className="h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Delete Area"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ),
            },
          ]}
        />
      )}

      {/* PROJECTS TAB */}
      {activeTab === "projects" && (
        <DataTable
          loading={loading}
          rows={filteredProjects}
          emptyTitle="No Projects Found"
          emptyDescription="Register smart gas piping projects and distribution grids."
          emptyActionLabel="Add Project"
          onEmptyAction={() => {
            setActionError(null);
            setAddProjectOpen(true);
          }}
          columns={[
            {
              key: "name",
              header: "Project Name",
              render: (r: Project) => (
                <div>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-xs text-foreground">{r.name}</span>
                  </div>
                  {r.description && (
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {r.description}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "code",
              header: "Project Code",
              render: (r: Project) => (
                <span className="text-xs font-mono text-muted-foreground">
                  {r.code || "—"}
                </span>
              ),
            },
            {
              key: "area",
              header: "Area / Zone",
              render: (r: Project) => (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  {r.areaName || "Unassigned"}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (r: Project) => <StatusPill tone="success">{r.status}</StatusPill>,
            },
            {
              key: "actions",
              header: "Actions",
              align: "right",
              render: (r: Project) => (
                <button
                  onClick={() => handleDelete("project", r.id, r.name)}
                  className="h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Delete Project"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ),
            },
          ]}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD DIVISION */}
      {/* ========================================================================= */}
      {addDivisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
            <button
              onClick={() => setAddDivisionOpen(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 grid place-items-center">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Add Division</h3>
                <p className="text-xs text-muted-foreground">e.g. Dhaka, Chittagong, Sylhet</p>
              </div>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20">
                {actionError}
              </div>
            )}

            <form onSubmit={handleAddDivision} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Division Name
                </label>
                <input
                  required
                  placeholder="e.g. Barisal"
                  value={divisionName}
                  onChange={(e) => setDivisionName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddDivisionOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Division"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD DISTRICT */}
      {/* ========================================================================= */}
      {addDistrictOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
            <button
              onClick={() => setAddDistrictOpen(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 grid place-items-center">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Add District</h3>
                <p className="text-xs text-muted-foreground">Belongs to a selected Division</p>
              </div>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20">
                {actionError}
              </div>
            )}

            <form onSubmit={handleAddDistrict} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Parent Division
                </label>
                <select
                  required
                  value={districtDivId}
                  onChange={(e) => setDistrictDivId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Division</option>
                  {data.divisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  District Name
                </label>
                <input
                  required
                  placeholder="e.g. Gazipur"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddDistrictOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create District"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD AREA */}
      {/* ========================================================================= */}
      {addAreaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
            <button
              onClick={() => setAddAreaOpen(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 grid place-items-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Add Area / Zone</h3>
                <p className="text-xs text-muted-foreground">Upazila, Thana, or Neighborhood Zone</p>
              </div>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20">
                {actionError}
              </div>
            )}

            <form onSubmit={handleAddArea} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Parent District
                </label>
                <select
                  required
                  value={areaDistId}
                  onChange={(e) => setAreaDistId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select District</option>
                  {data.districts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name} ({dist.divisionName || "Division"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Area / Thana Name
                </label>
                <input
                  required
                  placeholder="e.g. Dhanmondi, Banani, Mirpur"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Postal Code (Optional)
                </label>
                <input
                  placeholder="e.g. 1205"
                  value={areaPostalCode}
                  onChange={(e) => setAreaPostalCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddAreaOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Area"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD PROJECT */}
      {/* ========================================================================= */}
      {addProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
            <button
              onClick={() => setAddProjectOpen(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 grid place-items-center">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Add Smart Gas Project</h3>
                <p className="text-xs text-muted-foreground">Piping network, cluster or development project</p>
              </div>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20">
                {actionError}
              </div>
            )}

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Project Name
                </label>
                <input
                  required
                  placeholder="e.g. Bashundhara Smart Gas Grid"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Project Code (Optional)
                  </label>
                  <input
                    placeholder="PRJ-BAS-01"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Target Area
                  </label>
                  <select
                    value={projectAreaId}
                    onChange={(e) =>
                      setProjectAreaId(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select Area (Optional)</option>
                    {data.areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.districtName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Residential pipeline details or scope"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddProjectOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border text-xs hover:bg-accent transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
