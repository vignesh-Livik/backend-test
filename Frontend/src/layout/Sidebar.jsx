// import { NavLink } from "react-router";

// const Sidebar = () => {
//   return (
//     <aside
//       style={{
//         width: "220px",
//         background: "#000",
//         color: "#fff",
//         padding: "20px",
//       }}
//     >
//       <h2 style={{ marginBottom: "30px" }}>MyApp</h2>

//       <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//         <NavLink to="/dashboard/admin" className={linkStyle}>
//           Admin
//         </NavLink>
//         <NavLink to="/dashboard/editor" style={linkStyle}>
//           Editor
//         </NavLink>
//         <NavLink to="/dashboard/viewer" style={linkStyle}>
//           Viewer
//         </NavLink>
//         <NavLink>
//             Logout
//         </NavLink>
//       </nav>
//     </aside>
//   );
// };

// const linkStyle = ({ isActive }) => ({
//   color: isActive ? "text-red-400" : "",
//   textDecoration: "none",
// });

// export default Sidebar;

// import { NavLink } from "react-router";
// import { useNavigate } from "react-router";

// const Sidebar = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <aside className="w-[220px] bg-gray-700 text-white p-5 flex flex-col h-screen">
//       <h2 className="mb-8 text-xl font-semibold">MyApp</h2>

//       {/* Menu */}
//       <nav className="flex flex-col gap-4">
//         <NavLink
//           to="/dashboard/admin"
//           className={({ isActive }) =>
//             `px-3 py-2 rounded-md transition ${
//               isActive ? "bg-blue-500" : "hover:bg-blue-800"
//             }`
//           }
//         >
//           Admin
//         </NavLink>

//         <NavLink
//           to="/dashboard/editor"
//           className={({ isActive }) =>
//             `px-3 py-2 rounded-md transition ${
//               isActive ? "bg-blue-500" : "hover:bg-blue-800"
//             }`
//           }
//         >
//           Editor
//         </NavLink>

//         <NavLink
//           to="/dashboard/viewer"
//           className={({ isActive }) =>
//             `px-3 py-2 rounded-md transition ${
//               isActive ? "bg-blue-500" : "hover:bg-blue-800"
//             }`
//           }
//         >
//           Viewer
//         </NavLink>
//       </nav>

//       {/* Logout at bottom */}
//       <button
//         onClick={logout}
//         className="mt-auto px-3 py-2 rounded-md bg-red-500 hover:bg-red-700 transition"
//       >
//         Logout
//       </button>
//     </aside>
//   );
// };

// export default Sidebar;

import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import logo from "../assets/Logo_PNG.png";
const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Auto-open based on active route
  useEffect(() => {
    if (location.pathname.includes("/admin")) {
      setOpenMenu("admin");
    } else if (location.pathname.includes("/editor")) {
      setOpenMenu("editor");
    }
  }, [location.pathname]);

  const isAdminActive = location.pathname.includes("/admin");
  const isEditorActive = location.pathname.includes("/editor");

  return (
    <aside className="w-[220px] bg-gray-800 text-white p-3 flex flex-col h-screen text-sm">
      <div className="flex justify-center mb-10">
        <img src={logo} alt="logo" className="h-20 w-20 object-contain" />
      </div>

      <nav className="space-y-3">
        {/* ADMIN */}
        <div>
          <button
            onClick={() => toggleMenu("admin")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded
              ${isAdminActive ? "bg-blue-600" : "hover:bg-gray-700"}
            `}
          >
            <span className="text-md">Admin</span>
            <span
              className={`text-xs transition-transform ${
                openMenu === "admin" ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          </button>

          <div
            className={`ml-3 overflow-hidden transition-all duration-200 ${
              openMenu === "admin" ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink to="/admin/assignments" className={subLink}>
              Assignments
            </NavLink>
            <NavLink to="/admin/leave-management" className={subLink}>
              Leave
            </NavLink>
          </div>
        </div>

        {/* EDITOR */}
        <div>
          <button
            onClick={() => toggleMenu("editor")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded
              ${isEditorActive ? "bg-blue-600" : "hover:bg-gray-700"}
            `}
          >
            <span>Editor</span>
            <span
              className={`text-xs transition-transform ${
                openMenu === "editor" ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          </button>

          <div
            className={`ml-3 overflow-hidden transition-all duration-200 ${
              openMenu === "editor" ? "max-h-24" : "max-h-0"
            }`}
          >
            <NavLink to="/editor/personal" className={subLink}>
              Personal
            </NavLink>
            <NavLink to="/editor/education" className={subLink}>
              Education
            </NavLink>
            <NavLink to="/editor/bank" className={subLink}>
              Bank
            </NavLink>
          </div>
        </div>

        {/* VIEWER */}
        <NavLink
          to="/viewer"
          className={({ isActive }) =>
            `block px-2 py-1.5 rounded ${
              isActive ? "bg-blue-600" : "hover:bg-gray-700"
            }`
          }
        >
          Viewer
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-auto px-2 py-1.5 rounded bg-red-500 hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
};

const subLink = ({ isActive }) =>
  `block px-2 py-1 mt-1 rounded text-sm ${
    isActive ? "bg-blue-600" : "hover:bg-gray-700"
  }`;

export default Sidebar;
