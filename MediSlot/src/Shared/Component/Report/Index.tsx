import { useState, useMemo } from "react";

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
}

export function Grid<T extends Record<string, unknown>>({
    data,
    columns,
    pageSize = 5,
    rowKey,
    loading = false,
}: GridProps<T>) {

    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);
    const filteredData = useMemo(() => {
        return data.filter((item) =>
            columns.every((c) => {
                if (!c.field || !columnFilters[c.field as string]) return true;
                const value = item[c.field];
                return String(value)
                    .toLowerCase()
                    .includes(columnFilters[c.field as string].toLowerCase());
            })
        );
    }, [data, columnFilters, columns]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    return (
        <div className="relative">
            <table className="w-full text-left text-white">
                <thead className="bg-sky-900/70 text-sm uppercase">
                    <tr>
                        {columns.map((c, i) => (
                            <th key={i} className="px-6 py-3">
                                <div className="flex flex-col gap-2">
                                    <span>{c.header}</span>
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
                                No Data Found.
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((item, index) => (
                            <tr
                                key={rowKey ? rowKey(item) : index}
                                className={`border-b border-sky-700/50 ${index % 2 === 0 ? "bg-sky-800/30" : "bg-sky-800/10"
                                    }`}
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
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <span className="text-white text-sm">
                    Showing {(page - 1) * rowsPerPage + 1} to{" "}
                    {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length}
                </span>

                <div className="flex items-center gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 border border-sky-500 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="text-white">
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border border-sky-500 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}