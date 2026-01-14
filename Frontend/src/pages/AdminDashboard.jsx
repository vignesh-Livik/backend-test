import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./admin/DeleteModal";

const STATIC_USERS = [
  {
    userId: "U001",
    email: "admin@company.com",
    role: "ADMIN",
    joinDate: "2024-01-10",
  },
  {
    userId: "U002",
    email: "editor1@company.com",
    role: "EDITOR",
    joinDate: "2024-02-12",
  },
  {
    userId: "U003",
    email: "editor2@company.com",
    role: "EDITOR",
    joinDate: "2024-03-05",
  },
  {
    userId: "U004",
    email: "viewer1@company.com",
    role: "VIEWER",
    joinDate: "2024-04-01",
  },
];

function AdminDashboard() {
  const [users, setUsers] = useState(STATIC_USERS);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.userId !== deleteId));
    setDeleteId(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            User Management
          </h2>
          <p className="text-gray-500 mt-1">
            Manage all user accounts and permissions
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/admin/add-user")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          + Add New User
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 ">
        <StatCard title="Total Users" value={users.length} color="blue" />
        <StatCard
          title="Editors"
          value={users.filter((u) => u.role === "EDITOR").length}
          color="green"
        />
        <StatCard
          title="Viewers"
          value={users.filter((u) => u.role === "VIEWER").length}
          color="purple"
        />
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          {users.length === 0 ? (
            <EmptyState onAdd={() => navigate("/dashboard/admin/add-user")} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  key={user.userId}
                  user={user}
                  onEdit={() =>
                    navigate(`/dashboard/admin/edit-user/${user.userId}`, {
      state: user, // ✅ pass user data
    })
                  }
                  onDelete={() => setDeleteId(user.userId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      /> 
      
    </>
  );
}

export default AdminDashboard;
const StatCard = ({ title, value, color }) => (
  <div className={`bg-white shadow-lg rounded-xl p-5 border border-${color}-100`}>
    <p className={`text-sm font-medium text-${color}-600 uppercase`}>
      {title}
    </p>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);
const EmptyState = ({ onAdd }) => (
  <div className="text-center py-12">
    <h4 className="text-lg font-medium text-gray-700 mb-2">
      No users found
    </h4>
    <button
      onClick={onAdd}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Add First User
    </button>
  </div>
);



function UserCard({ user, onEdit, onDelete }) {
  const getInitial = (email) => email.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold text-lg">
              {getInitial(user.email)}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                user.role === "EDITOR" ? "bg-green-400" : "bg-blue-400"
              }`}
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user.email}</h3>
            <p className="text-xs text-gray-500">ID: {user.userId}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Role:</span>
          <span className="font-medium">{user.role}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Joined:</span>
          <span>{new Date(user.joinDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="flex-1 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
        >
          Edit
        </button>
        <div className="w-px bg-gray-200" />
        <button
          onClick={onDelete}
          className="flex-1 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}