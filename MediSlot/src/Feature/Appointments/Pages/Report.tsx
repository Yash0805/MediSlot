import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";
import { useState } from "react";



export default function Report() {
    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);

    return (
        <div className="card flex justify-content-center">
            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection />
        </div>

    )
}
