import { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import { api, type GasMeter } from "../../lib/api";

interface ManualRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManualRechargeModal({ isOpen, onClose, onSuccess }: ManualRechargeModalProps) {
  const [meterId, setMeterId] = useState<number | "">("");
  const [amount, setAmount] = useState("50.00");
  const [paymentMethod, setPaymentMethod] = useState("MOBILE_BANKING");
  const [meters, setMeters] = useState<GasMeter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getMeters().then((data) => {
        setMeters(data);
        if (data.length > 0 && !meterId) {
          setMeterId(data[0].id);
        }
      }).catch(() => {});
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterId) {
      setError("Please select a target meter");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.createRecharge(Number(meterId), Number(amount), paymentMethod);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to process recharge");
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
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Issue Manual Recharge</h3>
            <p className="text-xs text-muted-foreground">Generate DLMS/STS recharge token and credit meter</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Gas Meter</label>
            <select
              required
              value={meterId}
              onChange={(e) => setMeterId(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {meters.length === 0 && <option value="">No meters available</option>}
              {meters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.meterNumber} ({m.serialNumber}) — {m.customer ? `${m.customer.firstName} ${m.customer.lastName}` : "Unassigned"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Recharge Amount (BDT / ৳)</label>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-lg"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="MOBILE_BANKING">Mobile Banking (bKash / Nagad / Rocket)</option>
              <option value="CREDIT_CARD">Credit / Debit Card</option>
              <option value="WALLET">Digital Wallet</option>
              <option value="CASH_COUNTER">Counter Cash</option>
            </select>
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
              disabled={loading || meters.length === 0}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Generate Token & Credit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
