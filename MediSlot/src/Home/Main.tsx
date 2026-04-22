import { useEffect, useState } from "react";
import {useAppointmentQuery,useMarkNoShowAppointments,useAppointmentsMutation} from "../Feature/Appointments/queries";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Shared/Component/Loader/Loader";
import Button from "../Shared/Component/Button/Button";
import { Grid } from "../Shared/Component/Grid/Index";
import { Checkbox, type CheckboxChangeEvent } from "primereact/checkbox";

export default function Main() {
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useAppointmentQuery();
    const { mutate: markNoShow, isPending: isMarkingNoShow } = useMarkNoShowAppointments();
    const { mutate: markAppeared } = useAppointmentsMutation();
    const [selected, setSelected] = useState<number[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    
    useEffect(() => {
        if (!data || data.length === 0) return;
        const hasBooked = data.some(a => a.status === "Booked");
        if (hasBooked && !isMarkingNoShow) {
            markNoShow(undefined, {
                onSuccess: () => {
                    refetch();
                }
            });
        }
    }, [data, isMarkingNoShow, markNoShow, refetch]);
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader />
            </div>
        );
    }

    return (
        <div className="mt-10 px-6 text-white">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold">
                    Today Appointment List
                </h1>
                <Button
                    caption="+ Add Appointment"
                    type="button"
                    onClick={() => navigate("/Appointments/create")}
                />
            </div>

            {!data || data.length === 0 ? (
                <div className="text-center py-10">
                    No Appointment Found
                </div>
            ) : (
                <Grid<Master.Appointment & Record<string, unknown>>
                    data={data}
                    filterMode="today"
                    showDateFilter={false}
                    columns={[
                        { field: "name", header: "Name" },
                        { field: "phone", header: "Phone" },
                        { field: "age", header: "Age" },
                        { field: "description", header: "Description" },
                        { field: "appointmentDate", header: "Appointment Date" },
                        { field: "timeSlot", header: "Time Slot" },

                        {
                            field: "status",
                            header: "Status",
                            render: (_: unknown, row: Master.Appointment) => (
                                <span
                                    className={
                                        row.status === "Appeared"
                                            ? "text-green-400"
                                            : row.status === "NoShow"
                                                ? "text-red-400"
                                                : "text-blue-400"
                                    }
                                >
                                    {row.status}
                                </span>
                            ),
                        },

                        {
                            header: "Select",
                            render: (_: unknown, row: Master.Appointment) => (
                                <Checkbox
                                    onChange={(e: CheckboxChangeEvent) => {
                                        if (row.status !== "NoShow") return;

                                        if (e.checked) {
                                            setSelected(prev =>
                                                prev.includes(row.id)
                                                    ? prev
                                                    : [...prev, row.id]
                                            );
                                        } else {
                                            setSelected(prev =>
                                                prev.filter(id => id !== row.id)
                                            );
                                        }
                                    }}
                                    checked={selected.includes(row.id)}
                                    disabled={row.status !== "NoShow"}
                                />
                            ),
                        },

                        {
                            header: "Action",
                            render: (_: unknown, row: Master.Appointment) => (
                                <Button
                                    caption="Apply"
                                    type="button"
                                    loading={loadingId === row.id}
                                    disabled={
                                        row.status !== "NoShow" ||
                                        !selected.includes(row.id)
                                    }
                                    onClick={() => {
                                        setLoadingId(row.id);

                                        markAppeared(row.id, {
                                            onSuccess: () => {
                                                setLoadingId(null);
                                                setSelected(prev =>
                                                    prev.filter(id => id !== row.id)
                                                );
                                                refetch();
                                            },
                                            onError: () => {
                                                setLoadingId(null);
                                            },
                                        });
                                    }}
                                />
                            ),
                        },
                    ]}
                />
            )}
        </div>
    );
}