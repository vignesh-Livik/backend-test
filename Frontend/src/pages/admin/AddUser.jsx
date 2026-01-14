
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add User</h2>

      <UserForm
        selectedUser={null}
        refreshUsers={() => navigate("/")}
        clearSelection={() => {}}
        isOpen={true} 
        onClose={() => {}} 
      />
    </div>
  );
}

export default AddUser;