import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";
import { Loader } from "../../../Shared/Component/Loader/Loader";
import Button from "../../../Shared/Component/Button/Button";
import { useReportQuery } from "../queries";
import { Grid } from "../../../Shared/Component/Report/Index";

export default function Report() {
    const navigate = useNavigate();
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const singleDate = dates && dates[0] && !dates[1] ? formatDate(dates[0]) : undefined;
    const fromDate = dates && dates[0] && dates[1] ? formatDate(dates[0]) : undefined;
    const toDate = dates && dates[0] && dates[1] ? formatDate(dates[1]) : undefined;
    const { data, isLoading } = useReportQuery(
        singleDate,
        fromDate,
        toDate
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader />
            </div>
        );
    }

    return (
        <div className="mt-10 px-6 text-white">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Appointment Report</h1>

                <Button
                    caption="Back to List"
                    type="button"
                    onClick={() => navigate("/Appointments")}
                />
            </div>

            <div className="mb-6 flex items-center gap-2">
                <Calendar
                    value={dates}
                    onChange={(e) => setDates(e.value)}
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                    placeholder="Select date "
                    className="bg-sky-800 border border-sky-600 rounded px-2 py-2"
                />

                <button
                    className="px-3 py-2 border border-sky-500 rounded hover:bg-sky-700"
                    onClick={() => setDates(null)}
                >
                    Clear
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-sky-800 p-4 rounded-2xl">
                    <h3 className="text-sm text-sky-300">Total</h3>
                    <p className="text-2xl font-bold">
                        {data?.totalAppointments ?? 0}
                    </p>
                </div>

                <div className="bg-green-800 p-4 rounded-2xl">
                    <h3 className="text-sm text-green-300">Appeared</h3>
                    <p className="text-2xl font-bold">
                        {data?.appearedCount ?? 0}
                    </p>
                </div>

                <div className="bg-red-800 p-4 rounded-2xl">
                    <h3 className="text-sm text-red-300">No Show</h3>
                    <p className="text-2xl font-bold">
                        {data?.noShowCount ?? 0}
                    </p>
                </div>
            </div>

            <Grid
                data={
                    (data?.appointments ?? []) as (Master.Appointment &
                        Record<string, unknown>)[]
                }
                columns={[
                    { field: "name", header: "Name", filter: true },
                    { field: "phone", header: "Phone", filter: true },
                    { field: "age", header: "Age" },
                    { field: "description", header: "Description" },
                    {
                        field: "appointmentDate",
                        header: "Date",
                        render: (value: unknown) =>
                            new Date(value as string).toLocaleDateString(),
                    },
                    {
                        field: "timeSlot",
                        header: "Time",
                        render: (value: unknown) =>
                            new Date(`1970-01-01T${value as string}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                    },
                    {
                        field: "status",
                        header: "Status",
                        render: (value: unknown) => (
                            <span
                                className={
                                    value === "Appeared"
                                        ? "text-green-400 font-semibold"
                                        : value === "NoShow"
                                            ? "text-red-400 font-semibold"
                                            : "text-yellow-400 font-semibold"
                                }
                            >
                                {value as string}
                            </span>
                        ),
                    },
                ]}
                loading={isLoading}
                rowKey={(row) => row.id}
            />
        </div>
    );
}
function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
}