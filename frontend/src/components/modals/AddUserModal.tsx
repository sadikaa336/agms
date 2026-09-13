import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { api } from "../../lib/api";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SUPPORT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createUser({
        username,
        email,
        passwordHash: password,
        role,
      });
      onSuccess();
      onClose();
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to create user");
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
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Add Portal User</h3>
            <p className="text-xs text-muted-foreground">Grant access and assign role</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label>
            <input
              required
              placeholder="e.g. operator_1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <input
              required
              type="email"
              placeholder="operator@gasflow.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="SUPER_ADMIN">Super Admin (Full Administrative Authority)</option>
              <option value="FIELD_ENGINEER">Field Engineer / Operator (Valve Control & Socket Telemetry)</option>
              <option value="SUPPORT_STAFF">Support Staff (Customer Care & Manual Recharges)</option>
              <option value="CONSUMER">Consumer (Subscriber Account)</option>
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
              disabled={loading}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
