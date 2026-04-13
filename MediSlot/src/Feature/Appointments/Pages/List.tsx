import { useNavigate } from "react-router-dom";
import { Loader } from "../../../Shared/Component/Loader/Loader";
import { useAppointmentQuery, useAppointmentsMutation } from "../queries";
import Button from "../../../Shared/Component/Button/Button";
import { Grid } from "../../../Shared/Component/Grid/Index";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";

export default function List() {
    const navigate = useNavigate();
    const { data, isLoading } = useAppointmentQuery();
    const { mutate } = useAppointmentsMutation();
    const [selected, setSelected] = useState<number[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);

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
                    Appointment List
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
                <Grid
                    data={data as (Master.Appointment & Record<string, unknown>)[]}
                    columns={[
                        { field: "name", header: "Name" },
                        { field: "phone", header: "Phone" },
                        { field: "age", header: "Age" },
                        { field: "description", header: "Description" },
                        { field: "appointmentDate", header: "Appointment Date" },
                        { field: "timeSlot", header: "Time Slot" },
                        { field: "status", header: "Status" },

                        {
                            header: "Select",
                            render: (_, row) => (
                                <Checkbox
                                    onChange={(e) => {
                                        if (row.status === "Appeared") return;
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
                                    checked={
                                        row.status === "Appeared" || selected.includes(row.id)
                                    }
                                    disabled={row.status === "Appeared"}
                                />
                            ),
                        },

                        {
                            header: "Action",
                            render: (_, row) => (
                                <Button
                                    caption="Apply"
                                    type="button"
                                    loading={loadingId === row.id}
                                    disabled={row.status === "Appeared" || !selected.includes(row.id)}
                                    onClick={() => {
                                        setLoadingId(row.id);
                                        mutate(row.id, {
                                            onSuccess: () => {
                                                setLoadingId(null);
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