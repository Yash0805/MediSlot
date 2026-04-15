import { Navigate, Route, Routes } from "react-router-dom";
import List from "./Pages/List";
import Create from "./Pages/Create";
import Report from "./Pages/Report";
import Calendar from "./Pages/Calendar/Calendar";


export default function Appointment() {
    return (
        <Routes>
            <Route index element={<Navigate to="list" />} />
            <Route path="list" element={<List />} />
            <Route path="create" element={<Create />} />
            <Route path="report" element={<Report />} />
            <Route path="calendar" element={<Calendar />}/>
        </Routes>
    )
}