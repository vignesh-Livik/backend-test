import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_PNG.png";
import { useAuth } from "../context/AuthProvider";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role;

  const logout = () => {
    sessionStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <aside className="w-55 bg-gray-800 text-white p-3 flex flex-col h-screen text-sm">
      <div className="flex justify-center mb-10">
        <img src={logo} alt="logo" className="h-20 w-20 object-contain" />
      </div>

      <nav className="space-y-2">
        {role === "ADMIN" && (
          <>
            <NavLink to="/admin" end className={mainLink}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/assignments" className={mainLink}>
              Assignments
            </NavLink>
            <NavLink to="/admin/leave-management" className={mainLink}>
              Leave Management
            </NavLink>
            <NavLink to="/admin/personal" className={mainLink}>
              Users Management
            </NavLink>
            <NavLink to="/admin/education" className={mainLink}>
              Education Details
            </NavLink>
            <NavLink to="/admin/bank" className={mainLink}>
              Bank Details
            </NavLink>
          </>
        )}

        {role === "EDITOR" && (
          <>
            <NavLink to="/editor" end className={mainLink}>
              Dashboard
            </NavLink>
          </>
        )}

        {role === "VIEWER" && (
          <NavLink to="/viewer" end className={mainLink}>
            Viewer Dashboard
          </NavLink>
        )}
      </nav>
      <div className="mt-auto border-t border-gray-700 pt-4">
        <div className="mb-4 flex flex-col gap-2 rounded-lg bg-gray-700/50 p-3">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold truncate">{user?.email}</p>
          <p className="text-md lowercase  tracking-wide ">{user.role}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500  py-3 text-md font-medium text-white hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

const mainLink = ({ isActive }) =>
  `block px-3 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"}`;

export default Sidebar;
