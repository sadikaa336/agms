import { useState, useEffect } from "react";
import { X, Gauge } from "lucide-react";
import { api, type Customer } from "../../lib/api";

interface AddMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMeterModal({ isOpen, onClose, onSuccess }: AddMeterModalProps) {
  const [meterNumber, setMeterNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [communicationId, setCommunicationId] = useState("");
  const [firmwareVersion, setFirmwareVersion] = useState("v2.4.1");
  const [installationLocation, setInstallationLocation] = useState("");
  const [customerId, setCustomerId] = useState<number | "">("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getCustomers().then(setCustomers).catch(() => {});
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setMeterNumber(`MTR-${randomSuffix}`);
      setSerialNumber(`SN-DLMS-${randomSuffix}`);
      setCommunicationId(`COMM-${randomSuffix}`);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createMeter(
        {
          meterNumber,
          serialNumber,
          communicationId,
          firmwareVersion,
          installationLocation,
          status: "ACTIVE",
          valveStatus: "CLOSED",
        },
        customerId ? Number(customerId) : undefined
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create meter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Add New Gas Meter</h3>
            <p className="text-xs text-muted-foreground">Register a new DLMS/COSEM device (Initial Reading: 0.000 m³, Balance: ৳0.00, Valve: CLOSED)</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Meter Number</label>
              <input
                required
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Serial Number</label>
              <input
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Communication ID</label>
              <input
                required
                value={communicationId}
                onChange={(e) => setCommunicationId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Firmware Version</label>
              <input
                value={firmwareVersion}
                onChange={(e) => setFirmwareVersion(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Assign to Customer (Optional)</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : "")}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">-- No Customer Assigned --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Installation Location</label>
            <input
              placeholder="e.g., Sector 7, Block B, Dhaka"
              value={installationLocation}
              onChange={(e) => setInstallationLocation(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              {loading ? "Adding..." : "Add Meter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
