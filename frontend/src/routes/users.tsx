import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import { api, type UserAccount } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { AddUserModal } from "../components/modals/AddUserModal";
import { UserPlus, Trash2, RefreshCw, ShieldAlert, Shield } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Manage admin users, roles and permissions for the metering platform." },
      { property: "og:title", content: "Users & Roles — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Manage admin users, roles and permissions." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { canManageUsers } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    api
      .getUsers()
      .then(setUsers)
      .catch((err) => console.error("Failed to fetch users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (canManageUsers()) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [canManageUsers()]);

  const handleDelete = async (id: number) => {
    if (!canManageUsers()) return;
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  if (!canManageUsers()) {
    return (
      <AdminLayout
        title="Users & Roles"
        subtitle="Role-Based Access Control (RBAC) System"
      >
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive grid place-items-center mx-auto mb-4 border border-destructive/20">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Access Restricted</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Only <strong>Super Administrators</strong> have the authority to invite users, assign RBAC roles, and manage credentials.
          </p>
          <div className="p-4 rounded-xl bg-accent/60 border border-border text-xs text-muted-foreground text-left">
            <div className="font-semibold text-foreground mb-1">Testing Tip:</div>
            Use the <strong>Role Switcher</strong> in the top navigation bar to select <strong>Super Admin</strong> to test user management and RBAC administration.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users & Roles" subtitle="Team access and Role-Based Access Control (RBAC)">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Accounts</span>
          <button
            onClick={fetchUsers}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={users}
        emptyTitle="No Additional Users"
        emptyDescription="Only system records exist. Add administrative or support team members to grant RBAC access to the portal."
        emptyActionLabel="Create First User"
        onEmptyAction={() => setModalOpen(true)}
        columns={[
          {
            key: "username",
            header: "User Account",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold uppercase">
                  {r.username.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{r.username}</div>
                  <div className="text-[12px] text-muted-foreground">{r.email}</div>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role / Scope",
            render: (r) => (
              <span
                className={[
                  "inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-semibold",
                  r.role === "SUPER_ADMIN"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : r.role === "FIELD_ENGINEER"
                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    : r.role === "SUPPORT_STAFF"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-sky-500/10 text-sky-600 border border-sky-500/20",
                ].join(" ")}
              >
                {r.role}
              </span>
            ),
          },
          {
            key: "createdAt",
            header: "Created Date",
            render: (r) => (
              <span className="text-muted-foreground text-[12px]">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "System Init"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (r) => (
              <button
                onClick={() => handleDelete(r.id)}
                className="h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                title="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />

      <AddUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </AdminLayout>
  );
}