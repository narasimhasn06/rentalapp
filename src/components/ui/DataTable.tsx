"use client";

import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "right";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Row click opens the detail panel (spec/foundations.md A2). Buttons inside a row must use DataTableActions to avoid also firing this. */
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  /** Rendered instead of the table body when `rows` is empty — pass an EmptyState. */
  emptyState?: ReactNode;
}

/** A2 "Data table": sticky header, sortable columns, hover fill, 48px rows. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  sortKey,
  sortDirection = "asc",
  onSortChange,
  emptyState,
}: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <div className="rounded-md border border-line bg-surface shadow-1">{emptyState}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface shadow-1">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`sticky top-0 z-10 border-b border-line bg-surface px-4 py-3 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange?.(col.key)}
                    className="inline-flex items-center gap-1 text-label uppercase text-muted hover:text-ink"
                  >
                    {col.header}
                    <span aria-hidden="true" className="inline-block w-3">
                      {sortKey === col.key ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                    </span>
                  </button>
                ) : (
                  <span className="text-label uppercase text-muted">{col.header}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`h-12 border-b border-line last:border-b-0 ${
                onRowClick ? "cursor-pointer hover:bg-canvas" : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 text-body tabular-nums ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Wrap row-level action buttons (edit, remind, delete, ...) in this so a
 * click on them doesn't also trigger the row's onClick and open the
 * detail panel (spec/foundations.md A2 "Data table": "buttons inside the
 * row stop the click from propagating").
 */
export function DataTableActions({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
