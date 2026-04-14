import { useState, useMemo } from "react";
import { Calendar } from "primereact/calendar";

interface Action<T> {
  icon: string;
  onClick: (row: T) => void;
  className?: string;
}

interface Column<T, K extends keyof T = keyof T> {
  field?: K;
  header: string;
  render?: (value: T[K] | undefined, row: T) => React.ReactNode;
  filter?: boolean;
  filterPlaceholder?: string;
  actions?: Action<T>[];
}

interface GridProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  rowKey?: (row: T) => string | number;
  loading?: boolean;
  filterMode?: "all" | "today" | "future";
  showDateFilter?: boolean;
}

export function Grid<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 5,
  rowKey,
  loading = false,
  filterMode,
  showDateFilter = true,
}: GridProps<T>) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDateValue = item["appointmentDate" as keyof T];
      if (!itemDateValue) return true;

      const itemDate = new Date(itemDateValue as string);
      itemDate.setHours(0, 0, 0, 0);

      if (filterMode === "today") {
        if (itemDate.getTime() !== today.getTime()) return false;
      }

      if (filterMode === "future") {
        if (itemDate < today) return false;
      }

      if (showDateFilter && selectedDate) {
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        if (itemDate.getTime() !== selected.getTime()) return false;
      }

      const columnMatch = columns.every((c) => {
        if (!c.field || !columnFilters[c.field as string]) return true;
        const value = item[c.field];
        return String(value)
          .toLowerCase()
          .includes(columnFilters[c.field as string].toLowerCase());
      });

      return columnMatch;
    });
  }, [data, selectedDate, columnFilters, columns, today, filterMode, showDateFilter]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const v1 = a[sortField];
      const v2 = b[sortField];

      if (typeof v1 === "string" && typeof v2 === "string") {
        return asc ? v1.localeCompare(v2) : v2.localeCompare(v1);
      }

      if (v1! < v2!) return asc ? -1 : 1;
      if (v1! > v2!) return asc ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortField, asc]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  return (
    <div className="relative">
      {showDateFilter && (
        <div className="mb-4 flex items-center gap-2 text-white">
          <Calendar
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.value as Date);
              setPage(1);
            }}
            placeholder="Filter by date"
            className="bg-sky-800 border border-sky-600 rounded"
            dateFormat="yy-mm-dd"
            showIcon
            minDate={filterMode === "future" ? today : undefined}
          />

          <button
            className="px-3 py-2 border border-sky-500 rounded"
            onClick={() => setSelectedDate(null)}
          >
            Clear
          </button>
        </div>
      )}

      <table className="w-full text-left text-white">
        <thead className="bg-sky-900/70 text-sm uppercase">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="px-6 py-3">
                <div className="flex flex-col gap-2">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      if (!c.field) return;
                      setAsc(sortField === c.field ? !asc : true);
                      setSortField(c.field);
                    }}
                  >
                    {c.header}
                    {sortField === c.field && (asc ? " ↑" : " ↓")}
                  </span>

                  {c.filter && c.field && (
                    <input
                      type="text"
                      placeholder={c.filterPlaceholder || "Filter..."}
                      className="px-2 py-1 rounded bg-sky-800 border border-sky-600 text-xs"
                      value={columnFilters[c.field as string] || ""}
                      onChange={(e) =>
                        setColumnFilters((prev) => ({
                          ...prev,
                          [c.field as string]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6">
                No Appointment Found.
              </td>
            </tr>
          ) : (
            paginatedData.map((item, index) => (
              <tr
                key={rowKey ? rowKey(item) : index}
                className={`border-b border-sky-700/50 ${index % 2 === 0 ? "bg-sky-800/30" : "bg-sky-800/10"
                  } hover:bg-sky-700/40`}
              >
                {columns.map((c, i) => {
                  if (c.render) {
                    return (
                      <td key={i} className="px-6 py-4">
                        {c.render(c.field ? item[c.field] : undefined, item)}
                      </td>
                    );
                  }

                  if (c.field) {
                    return (
                      <td key={i} className="px-6 py-4">
                        {String(item[c.field])}
                      </td>
                    );
                  }

                  if (c.actions) {
                    return (
                      <td key={i} className="px-6 py-4 flex gap-2">
                        {c.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => action.onClick(item)}
                            className={
                              action.className ??
                              "px-2 py-1 border border-sky-500 rounded hover:bg-sky-700"
                            }
                          >
                            <i className={action.icon}></i>
                          </button>
                        ))}
                      </td>
                    );
                  }

                  return <td key={i}></td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/40">
          <span className="text-white">Loading...</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sky-400">
          <span>Rows:</span>
          <select
            className="bg-sky-800 text-white border border-sky-600 px-2 py-1 rounded"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <span className="text-white text-sm">
          Showing {(page - 1) * rowsPerPage + 1} to{" "}
          {Math.min(page * rowsPerPage, sortedData.length)} of {sortedData.length} entries
        </span>

        <div className="flex items-center gap-4">
          <button
            className="px-3 py-1 border border-sky-500 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span className="text-white">
            Page {page} of {totalPages || 1}
          </span>

          <button
            className="px-3 py-1 border border-sky-500 rounded disabled:opacity-50"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}