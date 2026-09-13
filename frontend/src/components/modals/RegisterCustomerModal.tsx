import { useState, useEffect } from "react";
import { X, UserPlus, MapPin, Building, Navigation, FolderKanban } from "lucide-react";
import { api, type LocationsSummary } from "../../lib/api";

interface RegisterCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterCustomerModal({ isOpen, onClose, onSuccess }: RegisterCustomerModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");

  // Location zoning states
  const [locations, setLocations] = useState<LocationsSummary>({
    divisions: [],
    districts: [],
    areas: [],
    projects: [],
  });
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoadingLocations(true);
      api
        .getLocationsSummary()
        .then((res) => {
          setLocations(res);
        })
        .catch((err) => console.warn("Failed to load locations:", err))
        .finally(() => setLoadingLocations(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered lists for cascading dropdowns
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
    if (!selectedArea) return true; // Show all if no area selected
    const ar = locations.areas.find((a) => a.name === selectedArea);
    return ar ? proj.areaId === ar.id || proj.areaName === selectedArea || !proj.areaId : true;
  });

  const handleDivisionChange = (divName: string) => {
    setSelectedDivision(divName);
    setSelectedDistrict("");
    setSelectedArea("");
    setSelectedProject("");
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    setSelectedArea("");
    setSelectedProject("");
  };

  const handleAreaChange = (arName: string) => {
    setSelectedArea(arName);
    // If a project is strictly linked to this area, auto-select or leave open
    const matchingProj = locations.projects.find((p) => {
      const ar = locations.areas.find((a) => a.name === arName);
      return ar ? p.areaId === ar.id : false;
    });
    if (matchingProj) {
      setSelectedProject(matchingProj.name);
    } else {
      setSelectedProject("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createCustomer({
        firstName,
        lastName,
        phone,
        email: email || undefined,
        nationalId: nationalId || undefined,
        address: address || undefined,
        division: selectedDivision || undefined,
        district: selectedDistrict || undefined,
        area: selectedArea || undefined,
        projectName: selectedProject || undefined,
      });
      onSuccess();
      onClose();
      // reset form
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
    } catch (err: any) {
      setError(err.message || "Failed to register customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-card border border-border p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Register Customer</h3>
            <p className="text-xs text-muted-foreground">
              Create customer account and assign zoning & project details
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name</label>
              <input
                required
                placeholder="e.g. Tariqul"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name</label>
              <input
                required
                placeholder="e.g. Islam"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number</label>
              <input
                required
                placeholder="+880 1712 345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email (Optional)</label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">National ID / Passport (Optional)</label>
            <input
              placeholder="e.g. 1992837461298"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Hierarchical Location & Zoning Selection */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Zoning & Project Information
              </span>
              {loadingLocations && (
                <span className="text-[10px] text-muted-foreground">Loading locations...</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Division Select */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Building className="h-3 w-3 text-blue-500" /> Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Division</option>
                  {locations.divisions.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-indigo-500" /> District
                </label>
                <select
                  value={selectedDistrict}
                  disabled={!selectedDivision}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  <option value="">
                    {selectedDivision ? "Select District" : "Select Division first"}
                  </option>
                  {availableDistricts.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Area Select */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-500" /> Area / Zone
                </label>
                <select
                  value={selectedArea}
                  disabled={!selectedDistrict}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  <option value="">
                    {selectedDistrict ? "Select Area / Zone" : "Select District first"}
                  </option>
                  {availableAreas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name} {area.postalCode ? `(${area.postalCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Select */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <FolderKanban className="h-3 w-3 text-amber-500" /> Project / Grid
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Project (Optional)</option>
                  {availableProjects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} {p.code ? `[${p.code}]` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Detailed Address (House, Road, Apartment)
            </label>
            <textarea
              placeholder="e.g. House 42, Road 7/A, Flat 4B"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-accent transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
