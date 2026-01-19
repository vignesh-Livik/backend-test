import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../api/userApi";
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
  Filter,
  MoreVertical,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon: Icon, trend, description }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
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

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-3 h-3" />;
      case "EDITOR":
        return <Edit className="w-3 h-3" />;
      case "VIEWER":
        return <Eye className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center font-bold text-blue-700 text-lg">
              {getInitial(user.email)}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getRoleColor(
                user.role
              )} flex items-center justify-center border-2 border-white`}
            >
              {getRoleIcon(user.role)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 truncate max-w-[180px]">
              {user.email}
            </h3>
            <div className="flex items-center mt-1">
              <User className="w-3 h-3 text-gray-400 mr-1" />
              <p className="text-xs text-gray-500 font-mono">
                ID: {user.userId}
              </p>
            </div>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-lg transition-opacity">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center text-sm">
          <Shield className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600">Role:</span>
          <span
            className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600">Joined:</span>
          <span className="ml-2 font-medium">
            {new Date(user.joinDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Mail className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600 truncate">{user.email}</span>
        </div>
      </div>

      <div className="flex gap-2 border-t pt-4">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
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

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const editorCount = users.filter((u) => u.role === "EDITOR").length;
  const viewerCount = users.filter((u) => u.role === "VIEWER").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <div className="flex items-center text-gray-500 mt-1">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-blue-600">Users</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-user")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserPlus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between mt-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by email, ID, or role..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          trend="+12%"
          description="Active system users"
        />
        <StatCard
          title="Administrators"
          value={adminCount}
          icon={Shield}
          description="Full system access"
        />
        <StatCard
          title="Editors"
          value={editorCount}
          icon={Edit}
          trend="+8%"
          description="Content management"
        />
        <StatCard
          title="Viewers"
          value={viewerCount}
          icon={Eye}
          description="Read-only access"
        />
      </div>

      {/* USERS SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Users</h2>
            <p className="text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">{users.length}</span>{" "}
            users
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first user
            </p>
            <button
              onClick={() => navigate("/admin/add-user")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add First User
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
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
