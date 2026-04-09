import { Outlet } from "react-router-dom";
import Header from "./Header";

const Mainlayout = () => {
  return (

    <div className="flex flex-col flex-1 bg-neutral-900 ">
      <Header />
      <main className="p-6 min-h-screen overflow-y-visible">
        <Outlet />
      </main>
    </div>

  );
};

export default Mainlayout;