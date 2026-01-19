import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Assignment from "./pages/admin/Assignment";
import LeaveManagement from "./pages/editor/LeaveManagement";
import AddUser from "./pages/admin/AddUser";
import EditUser from "./pages/admin/EditUser";
import EditorDashboard from "./pages/EditorDashboard";
import Personal from "./pages/editor/Personal";
import Education from "./pages/editor/Education";
import Bank from "./pages/editor/Bank";
import ViewerDashboard from "./pages/ViewerDashboard";
import BankDetailsForm from "./components/BankDetailsForm";
import BankDetailsView from "./components/BankDetailsView";
import Login from "./pages/auth/login";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="admin" replace />} />
        <Route path="admin">
          <Route index element={<AdminDashboard />} />
          <Route path="assignments" element={<Assignment />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="edit-user/:id" element={<EditUser />} />
        </Route>
        <Route path="editor">
          <Route index element={<EditorDashboard />} />
          <Route path="personal" element={<Personal />} />
          <Route path="education" element={<Education />} />
          <Route path="bank" element={<Bank />}>
            <Route path="bank/create" element={<BankDetailsForm />} />
            <Route path="bank/view/:userId" element={<BankDetailsView />} />
            <Route
              path="bank/edit/:userId"
              element={<BankDetailsForm isEdit />}
            />
          </Route>
        </Route>
        <Route path="viewer" element={<ViewerDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
