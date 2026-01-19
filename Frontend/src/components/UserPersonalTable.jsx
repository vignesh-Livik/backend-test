import React, { useEffect, useState, useMemo } from "react";
import {
  getAllUsers,
  deletePersonalDetails,
} from "../services/personalDetailsService";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiGlobe,
  FiUsers,
  FiPhoneCall,
  FiMap,
  FiTrendingUp,
  FiDownload,
  FiRefreshCw,
  FiChevronRight,
  FiDroplet,
} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import PersonalViewdetails from "../../src/components/PersonalViewDetails"; // Import the new component

const UserPersonalTable = ({ onEdit }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deletePersonalDetails(userId);
        fetchUsers();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleViewDetails = (user) => {
    // Map ALL fields from your Prisma schema
    const transformedUser = {
      // Basic Info
      id: user.id || "",
      userId: user.userId || "",
      firstName: user.userPersonalDetails?.firstName || "",
      lastName: user.userPersonalDetails?.lastName || "",
      gender: user.userPersonalDetails?.gender || "",
      dateOfBirth: user.userPersonalDetails?.dateOfBirth || "",

      // Contact Info
      personalEmail: user.userPersonalDetails?.personalEmail || "",
      phoneNumber: user.userPersonalDetails?.phoneNumber || "",
      alternatePhone: user.userPersonalDetails?.alternatePhone || "",

      // Address Info
      addressLine1: user.userPersonalDetails?.addressLine1 || "",
      addressLine2: user.userPersonalDetails?.addressLine2 || "",
      city: user.userPersonalDetails?.city || "",
      state: user.userPersonalDetails?.state || "",
      pincode: user.userPersonalDetails?.pincode || "",

      // Additional Info
      maritalStatus: user.userPersonalDetails?.maritalStatus || "",
      bloodGroup: user.userPersonalDetails?.bloodGroup || "",
      nationality: user.userPersonalDetails?.nationality || "",

      // System Info
      createdAt: user.createdAt || "",
      updatedAt: user.updatedAt || "",
    };

    setSelectedUser(transformedUser);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (users.length === 0) return null;

    const totalUsers = users.length;

    // Calculate average age
    let totalAge = 0;
    let ageCount = 0;

    users.forEach((user) => {
      if (user.userPersonalDetails?.dateOfBirth) {
        const birthDate = new Date(user.userPersonalDetails.dateOfBirth);
        const ageDiff = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        totalAge += age;
        ageCount++;
      }
    });

    const averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : "N/A";

    // Count by gender
    const genderCounts = users.reduce((acc, user) => {
      const gender = user.userPersonalDetails?.gender || "Not specified";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    // Count users with email
    const usersWithEmail = users.filter(
      (user) => user.userPersonalDetails?.personalEmail
    ).length;

    // Count users with phone
    const usersWithPhone = users.filter(
      (user) => user.userPersonalDetails?.phoneNumber
    ).length;

    return {
      totalUsers,
      averageAge,
      genderCounts,
      usersWithEmail,
      usersWithPhone,
      emailPercentage: Math.round((usersWithEmail / totalUsers) * 100),
      phonePercentage: Math.round((usersWithPhone / totalUsers) * 100),
    };
  }, [users]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter((user) => {
      const details = user.userPersonalDetails;
      const searchLower = searchTerm.toLowerCase();

      return (
        details?.firstName?.toLowerCase().includes(searchLower) ||
        details?.lastName?.toLowerCase().includes(searchLower) ||
        details?.personalEmail?.toLowerCase().includes(searchLower) ||
        details?.phoneNumber?.includes(searchTerm) ||
        user.userId?.toString().includes(searchTerm)
      );
    });
  }, [users, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl">
        <div className="flex items-center justify-center mb-4">
          <FiUser className="mr-2 text-2xl" />
          <span className="text-lg font-semibold">{error}</span>
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Use the new PersonalViewdetails modal */}
      <PersonalViewdetails
        isOpen={isModalOpen}
        onClose={closeModal}
        userData={selectedUser}
      />

      <div className="space-y-6">
        {/* Header with Search and Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-gray-600">Manage all user personal details</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={fetchUsers}
                className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={<FiUsers className="h-6 w-6" />}
                title="Total Users"
                value={stats.totalUsers}
                change="+12%"
                color="blue"
              />
              <StatCard
                icon={<FiCalendar className="h-6 w-6" />}
                title="Average Age"
                value={stats.averageAge}
                unit="years"
                color="green"
              />
              <StatCard
                icon={<FiMail className="h-6 w-6" />}
                title="Email Coverage"
                value={stats.emailPercentage}
                unit="%"
                color="purple"
              />
              <StatCard
                icon={<FiPhone className="h-6 w-6" />}
                title="Phone Coverage"
                value={stats.phonePercentage}
                unit="%"
                color="orange"
              />
            </div>
          )}
        </div>

        {/* User Cards Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FiUser className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Start by adding your first user"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => {
              const details = user.userPersonalDetails;
              return (
                <div
                  key={user.userId}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
                          <FiUser className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {details?.firstName} {details?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {user.userId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(user.userId)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm truncate">
                          {details?.personalEmail || "No email"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">
                          {details?.phoneNumber || "No phone"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm truncate">
                          {details?.city || "No location"}
                        </span>
                      </div>
                      {details?.dateOfBirth && (
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">
                            {new Date(details.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            details?.gender === "Male"
                              ? "bg-blue-100 text-blue-800"
                              : details?.gender === "Female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {details?.gender || "Unknown"}
                        </span>
                        {details?.bloodGroup && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            {details.bloodGroup}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        View Full Profile
                        <FiChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {users.length}
              </span>{" "}
              users
              {searchTerm && (
                <span className="ml-2">
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Export functionality (you can implement this)
                  console.log("Export users");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiDownload className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
              >
                <FiRefreshCw className="h-4 w-4" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, unit, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div
      className={`p-5 rounded-xl border ${colorClasses[color]} transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2 rounded-lg ${
            color === "blue"
              ? "bg-blue-100"
              : color === "green"
              ? "bg-green-100"
              : color === "purple"
              ? "bg-purple-100"
              : "bg-orange-100"
          }`}
        >
          {icon}
        </div>
        {change && (
          <span
            className={`text-sm font-medium ${
              change.startsWith("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-800">{value}</span>
          {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default UserPersonalTable;
