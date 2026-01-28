import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Assignment from "./pages/admin/Assignment";
import LeaveManagement from "./pages/editor/LeaveManagement";
import EditorDashboard from "./pages/EditorDashboard";
import Personal from "./pages/editor/Personal";
import Education from "./pages/editor/Education";
import Bank from "./pages/editor/Bank";
import ViewerDashboard from "./pages/ViewerDashboard";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import AddUser from "./pages/admin/AddUser";
import EditUser from "./pages/admin/EditUser";
import Userdata from "./json/Mohan/Userdata";
import Vicky from "./json/vignesh/Vicky";
import Table from "./json/vignesh/Table";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="admin">
                <Route index element={<AdminDashboard />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="edit-user/:id" element={<EditUser />} />
                <Route path="assignments" element={<Assignment />} />
                <Route path="leave-management" element={<LeaveManagement />} />
                <Route path="add-user" element={<AddUser />} />
                <Route path="edit-user/:id" element={<EditUser />} />
                <Route path="personal" element={<Personal />} />
                <Route path="education" element={<Education />} />
                <Route path="bank" element={<Bank />} />
                <Route path="mohan" element={<Userdata />}></Route>
                <Route path="vicky" element={<Vicky />} />
                <Route path="vicky/table" element={<Table />} />
              </Route>
            </Route>
            <Route element={<RoleProtectedRoute allowedRoles={["EDITOR"]} />}>
              <Route path="editor">
                <Route index element={<EditorDashboard />} />
                {/* <Route path="personal" element={<Personal />} />
              <Route path="education" element={<Education />} />
              <Route path="bank" element={<Bank />} /> */}
              </Route>
            </Route>
            <Route element={<RoleProtectedRoute allowedRoles={["VIEWER"]} />}>
              <Route path="viewer" element={<ViewerDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
