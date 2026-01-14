import { useLocation, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";

function EditUser() {
  const { state } = useLocation(); 
  const navigate = useNavigate();

  if (!state) {
    return <p>User not found</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <UserForm
        selectedUser={state}
        onSubmit={(updatedUser) => {
          navigate("/dashboard/admin");
        }}
        isOpen={true}
        onClose={() => navigate("/dashboard/admin")}
      />
    </div>
  );
}

export default EditUser;
