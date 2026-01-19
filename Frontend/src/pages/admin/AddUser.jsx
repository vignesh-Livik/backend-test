import UserForm from "../admin/UserForm";
import { useNavigate } from "react-router-dom";

function AddUserPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add User</h2>

      <UserForm
        selectedUser={null}
        refreshUsers={() => navigate("/")}
        clearSelection={() => {}}
        isOpen={true} // ✅ FIX
        onClose={() => {}} // ✅ FIX
      />
    </div>
  );
}

export default AddUserPage;
