import { useState } from "react";
import { X, Layers } from "lucide-react";
import { api } from "../../lib/api";

interface NewTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewTariffModal({ isOpen, onClose, onSuccess }: NewTariffModalProps) {
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("0.85");
  const [vatPercentage, setVatPercentage] = useState("5.00");
  const [fixedCharge, setFixedCharge] = useState("2.50");
  const [serviceCharge, setServiceCharge] = useState("1.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createTariff({
        name,
        unitPrice: Number(unitPrice),
        vatPercentage: Number(vatPercentage),
        fixedCharge: Number(fixedCharge),
        serviceCharge: Number(serviceCharge),
        isActive: true,
      });
      onSuccess();
      onClose();
      setName("");
    } catch (err: any) {
      setError(err.message || "Failed to create tariff");
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
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">New Tariff Plan</h3>
            <p className="text-xs text-muted-foreground">Configure pricing, tax and fixed charges</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Plan Name</label>
            <input
              required
              placeholder="e.g. Commercial Tier-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Unit Price (৳ / m³)</label>
              <input
                required
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">VAT (%)</label>
              <input
                type="number"
                step="0.1"
                value={vatPercentage}
                onChange={(e) => setVatPercentage(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Monthly Fixed Charge (৳)</label>
              <input
                type="number"
                step="0.1"
                value={fixedCharge}
                onChange={(e) => setFixedCharge(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Service Charge (৳)</label>
              <input
                type="number"
                step="0.1"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
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
              {loading ? "Saving..." : "Create Tariff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
