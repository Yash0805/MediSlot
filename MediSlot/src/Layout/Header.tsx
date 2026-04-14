import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <div className="w-full  bg-linear-to-br from-sky-800 to-sky-900 shadow px-6 py-4 flex justify-between items-center">

      <h1 className="text-2xl md:text-3xl font-bold 
       bg-white
        text-transparent bg-clip-text">
        MediSlot
      </h1>
      <div className="flex justify-center">
        <Link to="" className="block px-4 text-white font-bold hover:bg-sky-600 hover:text-white rounded transition duration-200">
          Home
        </Link>
        <Link to="Appointments/list" className="block px-4 text-white font-bold hover:bg-sky-600 hover:text-white rounded transition duration-200">
          List
        </Link>
        <Link to="Appointments/calendar" className="block px-4 text-white font-bold hover:bg-sky-600 hover:text-white rounded transition duration-200">
          Calendar
        </Link>
        <Link to="Appointments/report" className="block px-4  text-white font-bold hover:bg-sky-600 hover:text-white rounded transition duration-200">
          Report
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className=" text-lg font-semibold 
        bg-white
        text-transparent bg-clip-text">Admin</span>
        <div className="w-9 h-9 bg-sky-200 rounded-full flex items-center justify-center">👤</div>
      </div>

    </div>
  );
};

export default Header;