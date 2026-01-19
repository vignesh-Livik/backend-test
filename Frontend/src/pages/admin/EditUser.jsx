import { useParams, useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/userApi";
import UserForm from "../admin/UserForm";
import { useEffect, useState } from "react";

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAllUsers().then((res) => {
      const found = res.data.data.find((u) => u.userId === id);
      setUser(found);
    });
  }, [id]);

  if (!user) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>

      <UserForm
        selectedUser={user}
        refreshUsers={() => navigate("/")}
        clearSelection={() => {}}
        isOpen={true} // ✅ FIX
        onClose={() => {}} // ✅ FIX
      />
    </div>
  );
}

export default EditUserPage;
