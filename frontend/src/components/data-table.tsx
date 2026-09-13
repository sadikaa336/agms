import type { ReactNode } from "react";
import { FolderOpen, Plus } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There is currently no data in this table. Add your first entry to get started.",
  emptyActionLabel,
  onEmptyAction,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/40">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={[
                    "px-6 py-3.5 whitespace-nowrap",
                    c.align === "right" ? "text-right" : "text-left",
                  ].join(" ")}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="h-14 border-b border-border/40">
                  <td colSpan={columns.length} className="px-6 py-4">
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-14 px-6 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center max-w-md">
                    <div className="h-14 w-14 rounded-2xl bg-accent/60 grid place-items-center mb-4 text-primary border border-border/50">
                      <FolderOpen className="h-7 w-7 text-primary/80" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-[17px] font-semibold text-foreground mb-1">{emptyTitle}</h4>
                    <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed text-center">
                      {emptyDescription}
                    </p>
                    {emptyActionLabel && onEmptyAction && (
                      <button
                        onClick={onEmptyAction}
                        className="h-10 px-5 rounded-[10px] bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
                      >
                        <Plus className="h-4 w-4" /> {emptyActionLabel}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={[
                    "h-14 transition-colors hover:bg-accent/40",
                    i !== rows.length - 1 ? "border-b border-border/60" : "",
                  ].join(" ")}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={["px-6 whitespace-nowrap", c.align === "right" ? "text-right" : ""].join(
                        " "
                      )}
                    >
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && rows.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border text-[12px] text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{rows.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button className="h-8 px-3 rounded-lg border border-border hover:bg-accent/60">Prev</button>
            <button className="h-8 px-3 rounded-lg border border-border bg-accent/60 text-foreground">
              1
            </button>
            <button className="h-8 px-3 rounded-lg border border-border hover:bg-accent/60">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}