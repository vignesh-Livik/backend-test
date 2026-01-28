import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthProvider";

const DashboardLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed left-0 top-0 h-screen w-55">
        <Sidebar />
      </div>
      <div className="ml-55 flex flex-col flex-1 h-screen">
        <main className="flex-1 overflow-y-auto bg-gray-100 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
