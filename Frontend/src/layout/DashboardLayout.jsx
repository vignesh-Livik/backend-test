
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed left-0 top-0 h-screen w-[220px]">
        <Sidebar />
      </div>
      <div className="ml-[220px] flex flex-col flex-1 h-screen">
        <main className="flex-1 overflow-y-auto bg-gray-100 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
