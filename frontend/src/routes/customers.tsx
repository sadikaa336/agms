import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { DataTable } from "../components/data-table";
import { api, type Customer } from "../lib/api";
import { RegisterCustomerModal } from "../components/modals/RegisterCustomerModal";
import { UserPlus, Trash2, RefreshCw, MapPin, Building, FolderKanban } from "lucide-react";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Manage prepaid gas customers, profiles, and meter assignments." },
      { property: "og:title", content: "Customers — Automated Prepaid Gas Meter Management Software" },
      { property: "og:description", content: "Manage prepaid gas customers, profiles, and meter assignments." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    api
      .getCustomers()
      .then(setCustomers)
      .catch((err) => console.error("Failed to fetch customers:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.deleteCustomer(id);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || "Failed to delete customer");
    }
  };

  return (
    <AdminLayout
      title="Customers"
      subtitle={`${customers.length} registered profiles with zoning & smart meter assignments`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Directory</span>
          <button
            onClick={fetchCustomers}
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
          <UserPlus className="h-4 w-4" /> Register Customer
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={customers}
        emptyTitle="No Customers Registered"
        emptyDescription="There are no customer profiles in your database yet. Register your first customer to start assigning prepaid gas meters and tracking consumption."
        emptyActionLabel="Register First Customer"
        onEmptyAction={() => setModalOpen(true)}
        columns={[
          {
            key: "name",
            header: "Customer",
            render: (r) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent grid place-items-center text-xs font-semibold text-primary shrink-0">
                  {r.firstName[0]}
                  {r.lastName[0]}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {r.firstName} {r.lastName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.email || `ID #${r.id}`}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "phone",
            header: "Phone",
            render: (r) => <span className="text-foreground/90 font-mono text-xs">{r.phone}</span>,
          },
          {
            key: "divisionDistrict",
            header: "Division / District",
            render: (r) => (
              <div className="text-xs">
                <div className="font-medium text-foreground">
                  {r.district || "—"}
                </div>
                {r.division && (
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Building className="h-2.5 w-2.5 text-blue-500" />
                    {r.division}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "areaProject",
            header: "Area & Project",
            render: (r) => (
              <div className="text-xs">
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>{r.area || "—"}</span>
                </div>
                {r.projectName && (
                  <div
                    className="text-[11px] text-primary flex items-center gap-1 truncate max-w-[170px]"
                    title={r.projectName}
                  >
                    <FolderKanban className="h-2.5 w-2.5 text-amber-500 shrink-0" />
                    <span className="truncate">{r.projectName}</span>
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "address",
            header: "Street Address",
            render: (r) => (
              <span className="text-xs text-foreground/80 max-w-[180px] truncate inline-block">
                {r.address || "—"}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: () => <StatusPill tone="success">Active</StatusPill>,
          },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (r) => (
              <button
                onClick={() => handleDelete(r.id)}
                className="h-8 w-8 rounded-lg grid place-items-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                title="Delete Customer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />

      <RegisterCustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCustomers}
      />
    </AdminLayout>
  );
}