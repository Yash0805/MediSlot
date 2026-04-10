import { useState } from "react";

interface Column<T> {
  field: keyof T;
  header: string;
  filter?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface GridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  rowKey: (row: T) => string | number;
}

export default function Grid<T>({
  data,
  columns,
  loading,
  rowKey,
}: GridProps<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});

const filteredData = data.filter((row) => {
  return columns.every((col) => {
    if (!col.filter) return true;

    const rawValue = row[col.field];

    let value = "";

    if (col.field === "appointmentDate" && rawValue) {
      const d = new Date(String(rawValue));
      value = d.toLocaleDateString("en-IN"); 
    } else {
      value = String(rawValue ?? "");
    }

    value = value.toLowerCase();
    const filterValue = (filters[col.field as string] || "").toLowerCase();

    return value.includes(filterValue);
  });
});

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  return (
    <div className="overflow-auto border border-sky-700 rounded-xl">
      <table className="w-full text-sm text-left text-white">

        <thead className="bg-sky-800">
          <tr>
            {columns.map((col) => (
              <th key={String(col.field)} className="p-3 border-b border-sky-700">
                {col.header}
              </th>
            ))}
          </tr>

          <tr>
            {columns.map((col) => (
              <th key={String(col.field)} className="p-2">
                {col.filter && (
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-2 py-1 text-black rounded"
                    value={filters[col.field as string] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [col.field as string]: e.target.value,
                      }))
                    }
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-4 text-gray-400"
              >
                No records found
              </td>
            </tr>
          ) : (
            filteredData.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-sky-800 hover:bg-sky-900"
              >
                {columns.map((col) => {
                  const value = row[col.field];

                  return (
                    <td key={String(col.field)} className="p-3">
                      {col.render
                        ? col.render(value, row)
                        : String(value ?? "-")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}