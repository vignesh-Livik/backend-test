import React, { useEffect, useState } from "react";
// import { createUser, updateUser } from "../api/userApi";

function UserForm({
  selectedUser,
  refreshUsers,
  clearSelection,
  isOpen,
  onClose,
}) {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

    refreshUsers();
    clearSelection();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          {selectedUser ? "Update User" : "Create User"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="userId"
            placeholder="User ID"
            value={form.userId}
            onChange={handleChange}
            disabled={!!selectedUser}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {!selectedUser && (
            <input
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          )}

          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {!selectedUser && (
            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {selectedUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;