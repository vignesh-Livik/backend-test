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
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import PersonalViewdetails from "../../src/components/PersonalViewDetails";

// Import the UserPersonalForm component
import UserPersonalForm from "./UserPersonalForm";

const UserPersonalTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // New state for form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  // State to control which section is expanded
  const [showIncompleteSection, setShowIncompleteSection] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      console.log("Fetched users data:", data); // Debug log
      setUsers(data.data || data);
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
        fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleViewDetails = (user) => {
    const transformedUser = {
      id: user.id || "",
      userId: user.userId || "",
      firstName: user.userPersonalDetails?.firstName || "",
      lastName: user.userPersonalDetails?.lastName || "",
      gender: user.userPersonalDetails?.gender || "",
      dateOfBirth: user.userPersonalDetails?.dateOfBirth || "",
      personalEmail: user.userPersonalDetails?.personalEmail || "",
      phoneNumber: user.userPersonalDetails?.phoneNumber || "",
      alternatePhone: user.userPersonalDetails?.alternatePhone || "",
      addressLine1: user.userPersonalDetails?.addressLine1 || "",
      addressLine2: user.userPersonalDetails?.addressLine2 || "",
      city: user.userPersonalDetails?.city || "",
      state: user.userPersonalDetails?.state || "",
      pincode: user.userPersonalDetails?.pincode || "",
      maritalStatus: user.userPersonalDetails?.maritalStatus || "",
      bloodGroup: user.userPersonalDetails?.bloodGroup || "",
      nationality: user.userPersonalDetails?.nationality || "",
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

  // Handle edit user
  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setIsFormOpen(true);
  };

  // Handle create new user
  const handleCreateUser = () => {
    setEditingUserId(null);
    setIsFormOpen(true);
  };

  // Handle form saved - refresh user list
  const handleFormSaved = () => {
    fetchUsers(); // Refresh the user list
    setIsFormOpen(false);
    setEditingUserId(null);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUserId(null);
  };

  // Helper function to check if a user has all three required fields
  const hasRequiredFields = (user) => {
    const details = user.userPersonalDetails;
    
    // Check for first name (can be firstName, lastName, or fullName)
    const hasFirstName = Boolean(
      details?.firstName || 
      details?.lastName || 
      details?.fullName || 
      user.name
    );
    
    // Check for phone number
    const hasPhone = Boolean(
      details?.phoneNumber || 
      details?.phone || 
      user.phone
    );
    
    // Check for location (city or address)
    const hasLocation = Boolean(
      details?.city || 
      details?.state || 
      details?.addressLine1
    );
    
    return hasFirstName && hasPhone && hasLocation;
  };

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    const details = user.userPersonalDetails;
    
    // Try different possible name fields
    if (details?.firstName && details?.lastName) {
      return `${details.firstName} ${details.lastName}`;
    }
    if (details?.firstName) {
      return details.firstName;
    }
    if (details?.lastName) {
      return details.lastName;
    }
    if (details?.fullName) {
      return details.fullName;
    }
    if (user.name) {
      return user.name;
    }
    // Return a default name if no name is found
    return `User ${user.userId || user.id}`;
  };

  // Helper function to get user phone
  const getUserPhone = (user) => {
    const details = user.userPersonalDetails;
    return details?.phoneNumber || details?.phone || user.phone || "No phone";
  };

  // Helper function to get user location
  const getUserLocation = (user) => {
    const details = user.userPersonalDetails;
    if (details?.city && details?.state) {
      return `${details.city}, ${details.state}`;
    }
    if (details?.city) {
      return details.city;
    }
    if (details?.state) {
      return details.state;
    }
    if (details?.addressLine1) {
      return details.addressLine1;
    }
    return "No location";
  };

  // Helper function to get user email (for display)
  const getUserEmail = (user) => {
    const details = user.userPersonalDetails;
    return details?.personalEmail || details?.email || user.email || "No email";
  };

  // Helper function to get missing fields for incomplete users
  const getMissingFields = (user) => {
    const details = user.userPersonalDetails;
    const missingFields = [];
    
    // Check name
    if (!details?.firstName && !details?.lastName && !details?.fullName && !user.name) {
      missingFields.push("Name");
    }
    
    // Check phone
    if (!details?.phoneNumber && !details?.phone && !user.phone) {
      missingFields.push("Phone");
    }
    
    // Check location
    if (!details?.city && !details?.state && !details?.addressLine1) {
      missingFields.push("Location");
    }
    
    return missingFields;
  };

  // Filter users into complete and incomplete
  const { completeUsers, incompleteUsers } = useMemo(() => {
    const complete = users.filter(user => hasRequiredFields(user));
    const incomplete = users.filter(user => !hasRequiredFields(user));
    return { completeUsers: complete, incompleteUsers: incomplete };
  }, [users]);

  const stats = useMemo(() => {
    if (users.length === 0) return null;

    const totalUsers = users.length;
    const completeCount = completeUsers.length;
    const incompleteCount = incompleteUsers.length;
    
    let totalAge = 0;
    let ageCount = 0;

    completeUsers.forEach((user) => {
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

    const genderCounts = completeUsers.reduce((acc, user) => {
      const gender = user.userPersonalDetails?.gender || "Not specified";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const usersWithEmail = completeUsers.filter(
      (user) => {
        const details = user.userPersonalDetails;
        return details?.personalEmail || details?.email || user.email;
      }
    ).length;

    const usersWithPhone = completeUsers.filter(
      (user) => {
        const details = user.userPersonalDetails;
        return details?.phoneNumber || details?.phone || user.phone;
      }
    ).length;

    const completionPercentage = Math.round((completeCount / totalUsers) * 100);

    return {
      totalUsers,
      completeCount,
      incompleteCount,
      completionPercentage,
      averageAge,
      genderCounts,
      usersWithEmail,
      usersWithPhone,
      emailPercentage: Math.round((usersWithEmail / completeCount) * 100) || 0,
      phonePercentage: Math.round((usersWithPhone / completeCount) * 100) || 0,
    };
  }, [users, completeUsers, incompleteUsers]);

  // Filter complete users based on search
  const filteredCompleteUsers = useMemo(() => {
    if (!searchTerm) return completeUsers;

    const searchLower = searchTerm.toLowerCase();
    
    return completeUsers.filter((user) => {
      const displayName = getUserDisplayName(user).toLowerCase();
      const email = getUserEmail(user).toLowerCase();
      const phone = getUserPhone(user);
      const location = getUserLocation(user).toLowerCase();
      const userId = user.userId?.toString() || user.id?.toString();

      return (
        displayName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchTerm) ||
        location.includes(searchLower) ||
        userId.includes(searchTerm)
      );
    });
  }, [completeUsers, searchTerm]);

  // Filter incomplete users based on search
  const filteredIncompleteUsers = useMemo(() => {
    if (!searchTerm) return incompleteUsers;

    const searchLower = searchTerm.toLowerCase();
    
    return incompleteUsers.filter((user) => {
      const displayName = getUserDisplayName(user).toLowerCase();
      const email = getUserEmail(user).toLowerCase();
      const phone = getUserPhone(user);
      const location = getUserLocation(user).toLowerCase();
      const userId = user.userId?.toString() || user.id?.toString();

      return (
        displayName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchTerm) ||
        location.includes(searchLower) ||
        userId.includes(searchTerm)
      );
    });
  }, [incompleteUsers, searchTerm]);

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
      {/* View Details Modal */}
      <PersonalViewdetails
        isOpen={isModalOpen}
        onClose={closeModal}
        userData={selectedUser}
      />

      {/* User Form Modal */}
      {isFormOpen && (
        <UserPersonalForm
          userId={editingUserId}
          onClose={handleFormClose}
          onSaved={handleFormSaved}
        />
      )}

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
                  placeholder="Search all users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
              >
                <FiUser className="h-4 w-4" />
                Create User
              </button>
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
                color="blue"
              />
              <StatCard
                icon={<FiCheckCircle className="h-6 w-6" />}
                title="Complete Profiles"
                value={stats.completeCount}
                color="green"
              />
              <StatCard
                icon={<FiXCircle className="h-6 w-6" />}
                title="Incomplete Profiles"
                value={stats.incompleteCount}
                color="red"
              />
              <StatCard
                icon={<FiCalendar className="h-6 w-6" />}
                title="Average Age"
                value={stats.averageAge}
                unit="years"
                color="purple"
              />
            </div>
          )}
        </div>

        {/* Complete Profiles Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiCheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Complete Profiles
                </h2>
                <p className="text-gray-600">
                  Users with Name, Phone, and Location information
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {filteredCompleteUsers.length} users
              </span>
            </div>
          </div>

          {/* Complete User Cards Grid */}
          {filteredCompleteUsers.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <FiCheckCircle className="mx-auto h-12 w-12 text-green-300 mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                {searchTerm ? "No matching complete profiles found" : "No complete profiles available"}
              </h3>
              <p className="text-green-600">
                {searchTerm 
                  ? "Try a different search term" 
                  : "All users are currently missing required information"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompleteUsers.map((user) => {
                const details = user.userPersonalDetails;
                const displayName = getUserDisplayName(user);
                const phone = getUserPhone(user);
                const location = getUserLocation(user);
                const email = getUserEmail(user);
                
                return (
                  <div
                    key={user.userId || user.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-green-200"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl mr-4">
                            <FiUser className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {displayName}
                            </h3>
                            <p className="text-xs text-gray-500">
                              ID: {user.userId || user.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user.userId || user.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <FiUser className="h-3 w-3 mr-2 text-green-500" />
                          <span className="text-sm">{displayName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiPhone className="h-3 w-3 mr-2 text-green-500" />
                          <span className="text-sm">{phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiMapPin className="h-3 w-3 mr-2 text-green-500" />
                          <span className="text-sm truncate">{location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-green-50 border-t border-green-100">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1 h-3 w-3" />
                          Complete
                        </span>
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="text-green-600 hover:text-green-800 text-xs font-medium flex items-center"
                        >
                          View Profile
                          <FiChevronRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Incomplete Profiles Section - Collapsible */}
        {incompleteUsers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Incomplete Section Header */}
            <button
              onClick={() => setShowIncompleteSection(!showIncompleteSection)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-4 ${showIncompleteSection ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <FiXCircle className={`h-5 w-5 ${showIncompleteSection ? 'text-red-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Incomplete Profiles
                    </h2>
                    <p className="text-gray-600">
                      Users missing Name, Phone, or Location etc... information
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mr-3">
                    {filteredIncompleteUsers.length} users
                  </span>
                  <FiChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${showIncompleteSection ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </button>

            {/* Incomplete User Cards Grid (Collapsible) */}
            {showIncompleteSection && (
              <div className="px-6 pb-6">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">
                    These users are missing one or more required fields. Click "Edit" to complete their profiles.
                  </p>
                </div>
                
                {filteredIncompleteUsers.length === 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <FiXCircle className="mx-auto h-12 w-12 text-red-300 mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      {searchTerm ? "No matching incomplete profiles found" : "All incomplete profiles are filtered"}
                    </h3>
                    <p className="text-red-600">
                      {searchTerm ? "Try a different search term" : "All users now have complete profiles!"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredIncompleteUsers.map((user) => {
                      const details = user.userPersonalDetails;
                      const displayName = getUserDisplayName(user);
                      const phone = getUserPhone(user);
                      const location = getUserLocation(user);
                      const missingFields = getMissingFields(user);
                      
                      return (
                        <div
                          key={user.userId || user.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-red-200"
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl mr-4">
                                  <FiUser className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800">
                                    {displayName}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    ID: {user.userId || user.id}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEditUser(user.userId || user.id)}
                                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit User"
                                >
                                  <FiEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user.userId || user.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <FiUser className="h-3 w-3 mr-2 text-red-500" />
                                <span className="text-sm">{displayName.includes("User") ? "No name" : displayName}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <FiPhone className="h-3 w-3 mr-2 text-red-500" />
                                <span className="text-sm">{phone}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <FiMapPin className="h-3 w-3 mr-2 text-red-500" />
                                <span className="text-sm truncate">{location}</span>
                              </div>
                            </div>

                            {/* Missing Fields Badges */}
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-1">
                                {missingFields.map((field, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                  >
                                    <FiAlertCircle className="mr-1 h-3 w-3" />
                                    Missing {field}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="px-5 py-3 bg-red-50 border-t border-red-100">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FiXCircle className="mr-1 h-3 w-3" />
                                Incomplete
                              </span>
                              <button
                                onClick={() => handleEditUser(user.userId || user.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center"
                              >
                                Complete Profile
                                <FiChevronRight className="ml-1 h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              Showing{" "}
              <span className="font-semibold text-green-700">
                {filteredCompleteUsers.length}
              </span>{" "}
              complete and{" "}
              <span className="font-semibold text-red-700">
                {showIncompleteSection ? filteredIncompleteUsers.length : incompleteUsers.length}
              </span>{" "}
              incomplete users
              {searchTerm && (
                <span className="ml-2">
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-600 font-medium">
                {completeUsers.length} complete
              </span>
              {" • "}
              <span className="text-red-600 font-medium">
                {incompleteUsers.length} incomplete
              </span>
              {" • "}
              <span className="text-blue-600 font-medium">
                {users.length} total
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, title, value, change, unit, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
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
              : color === "red"
              ? "bg-red-100"
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