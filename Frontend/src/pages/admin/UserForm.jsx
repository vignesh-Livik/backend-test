import React, { useEffect, useState } from "react";
import { createUser, updateUser } from "../../api/userApi";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Shield,
  Calendar,
  Save,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

function UserForm() {
  const navigate = useNavigate();
  const { state: selectedUser } = useLocation();

  const [form, setForm] = useState({
    userId: "",
    email: "",
    password: "",
    role: "",
    joinDate: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setForm({
        userId: selectedUser.userId,
        email: selectedUser.email,
        password: "",
        role: selectedUser.role,
        joinDate: selectedUser.joinDate?.slice(0, 10),
      });
    }
  }, [selectedUser]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUser) {
      await updateUser(selectedUser.userId, {
        email: form.email,
        role: form.role,
      });
    } else {
      await createUser(form);
    }

    navigate("/dashboard/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/admin")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                selectedUser
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {selectedUser ? (
                <User className="w-8 h-8" />
              ) : (
                <UserPlus className="w-8 h-8" />
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedUser ? "Update User" : "Create New User"}
              </h1>
              <p className="text-gray-600">
                {selectedUser
                  ? "Modify existing user information"
                  : "Add a new user to the system"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* User ID Field */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="userId"
                value={form.userId}
                onChange={handleChange}
                placeholder="Enter unique user ID"
                disabled={!!selectedUser}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                  ${
                    selectedUser
                      ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-900"
                  }`}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2" />
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field (only for new users) */}
          {!selectedUser && (
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter secure password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 8 characters with letters and numbers
              </p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 mr-2" />
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">Select a role</option>
                <option value="ADMIN" className="py-2">
                  Administrator
                </option>
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Join Date (only for new users) */}
          {!selectedUser && (
            <div className="mb-8">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Join Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="joinDate"
                  value={form.joinDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 text-white rounded-lg transition-all flex items-center justify-center
                ${
                  selectedUser
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                } focus:ring-2 focus:ring-offset-2`}
            >
              {selectedUser ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update User
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>

        {/* Form Status Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                selectedUser ? "bg-blue-500" : "bg-green-500"
              }`}
            ></div>
            {selectedUser ? "Editing existing user" : "Creating new user"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
