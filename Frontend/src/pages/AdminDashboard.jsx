import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../services/userApi";
import DeleteModal from "./admin/DeleteModal";
import {
  Users,
  Edit,
  Eye,
  UserPlus,
  Trash2,
  User,
  Mail,
  Shield,
  Calendar,
  Search,
  MoreVertical,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon: Icon, trend, description }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center mt-4 text-sm">
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        <span className="text-green-600 font-medium">{trend}</span>
        <span className="text-gray-500 ml-2">from last month</span>
      </div>
    )}
  </div>
);

/* ================= USER CARD ================= */
function UserCard({ user, onEdit, onDelete }) {
  const getInitial = (email) => email.charAt(0).toUpperCase();

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "EDITOR":
        return "bg-blue-100 text-blue-800";
      case "VIEWER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-700">
            {getInitial(user.email)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 truncate">
              {user.email}
            </h3>
            <p className="text-xs text-gray-500">ID: {user.userId}</p>
          </div>
        </div>
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Shield className="w-4 h-4 text-gray-400 mr-2" />
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          {new Date(user.joinDate).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm">
          <Mail className="w-4 h-4 text-gray-400 mr-2" />
          {user.email}
        </div>
      </div>

      <div className="flex gap-2 border-t pt-4">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

/* ================= ADMIN DASHBOARD ================= */
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error("Fetch users failed", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteId);
      setDeleteId(null);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* 🔍 SEARCH LOGIC */
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(search) ||
      user.userId.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const editorCount = users.filter((u) => u.role === "EDITOR").length;
  const viewerCount = users.filter((u) => u.role === "VIEWER").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-xl mr-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <div className="flex items-center text-gray-500">
                Dashboard <ChevronRight className="mx-2 w-4 h-4" /> Users
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-user")}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* SEARCH */}
        <div className="mt-6 max-w-lg relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, ID, or role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 pl-12 pr-4 py-3 border rounded-xl"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={users.length} icon={Users} />
        <StatCard title="Admins" value={adminCount} icon={Shield} />
        <StatCard title="Editors" value={editorCount} icon={Edit} />
        <StatCard title="Viewers" value={viewerCount} icon={Eye} />
      </div>

      {/* USERS */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">All Users</h2>
          <span className="text-gray-500">
            Showing {filteredUsers.length} users
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No users match your search
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.userId}
                user={user}
                onEdit={() =>
                  navigate(`/admin/edit-user/${user.userId}`, {
                    state: user,
                  })
                }
                onDelete={() => setDeleteId(user.userId)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default AdminDashboard;
