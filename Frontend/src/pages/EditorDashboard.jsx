import React, { useEffect, useState } from "react";
import { getAllAssignments } from "../services/assignmentService";
import {
  getUserProfile,
  updatePersonalDetails,
  createPersonalDetails,
  deletePersonalDetails,
} from "../services/personalDetailsService";
import { bankDetailsService } from "../services/bankDetailsService";
import {
  getEducationByUser,
  addEducation,
  updateEducationById,
  deleteEducationByUser,
} from "../services/educationService";
import {
  getLeavesByUser,
  updateLeaveStatus,
  deleteLeave,
} from "../services/leaveService";
import {
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  X,
  Save,
  Building,
  CreditCard,
  GraduationCap,
  Briefcase,
  FileText,
  PhoneCall,
  Home,
  Heart,
  Flag,
  BookOpen,
  Award,
  Banknote,
  Loader2,
  Plus,
  Minus,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const EditorDashboard = () => {
  const [assignedViewers, setAssignedViewers] = useState([]);
  const [selectedViewer, setSelectedViewer] = useState(null);
  const [viewerDetails, setViewerDetails] = useState({
    userPersonalDetails: null,
    bankDetails: null,
    eduDetails: [],
    leaveManagements: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  useEffect(() => {
    const fetchAssignedViewers = async () => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("auth"));

        if (!storedUser) {
          setError("User not logged in. Please log in first.");
          setLoading(false);
          return;
        }

        const editorId = storedUser.id || storedUser.userId;

        if (!editorId) {
          setError("User ID missing");
          setLoading(false);
          return;
        }

        const assignmentsRes = await getAllAssignments();
        const assignments = assignmentsRes.data;

        const viewerAssignments = assignments.filter(
          (a) => a.editorId == editorId,
        );

        if (viewerAssignments.length === 0) {
          setError("No viewers assigned to you yet");
          setLoading(false);
          return;
        }

        const viewers = viewerAssignments.map((assignment) => ({
          userId: assignment.user?.userId || assignment.viewerId,
          email: assignment.user?.email || "No email",
          role: "VIEWER",
          joinDate: assignment.user?.createdAt || new Date().toISOString(),
          assignmentId: assignment.id,
          assignmentCreatedAt: assignment.createdAt,
          assignmentUpdatedAt: assignment.updatedAt,
        }));

        console.log("📋 Found assigned viewers:", viewers);
        setAssignedViewers(viewers);

        if (viewers.length > 0 && !selectedViewer) {
          setSelectedViewer(viewers[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("EditorDashboard Error:", err);
        setError("Failed to load assigned viewers");
        setLoading(false);
      }
    };

    fetchAssignedViewers();
  }, []);

  const fetchAllViewerDetails = async (userId) => {
    if (!userId) return;

    setIsFetchingDetails(true);
    try {
      console.log(`📡 Fetching details for user ID: ${userId}`);

      const [personalRes, bankRes, educationRes, leavesRes] =
        await Promise.allSettled([
          getUserProfile(userId),
          bankDetailsService.getBankDetailsByUserId(userId),
          getEducationByUser(userId),
          getLeavesByUser(userId),
        ]);

      console.log("🔍 API Response Details:");
      console.log("1. Personal Response:", personalRes);
      console.log("2. Bank Response:", bankRes);
      console.log("3. Education Response:", educationRes);
      console.log("4. Leaves Response:", leavesRes);

      let personalDetails = null;
      if (personalRes.status === "fulfilled" && personalRes.value) {
        personalDetails = personalRes.value.userPersonalDetails || null;
        console.log("✅ Extracted Personal Details:", personalDetails);
      }

      const newDetails = {
        userPersonalDetails: personalDetails,
        bankDetails: bankRes.status === "fulfilled" ? bankRes.value : null,
        eduDetails:
          educationRes.status === "fulfilled" ? educationRes.value : [],
        leaveManagements:
          leavesRes.status === "fulfilled" ? leavesRes.value : [],
      };

      console.log("📋 Final Viewer Details:", newDetails);
      setViewerDetails(newDetails);
    } catch (err) {
      console.error("❌ Error fetching viewer details:", err);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleSelectViewer = (viewer) => {
    setSelectedViewer(viewer);
    setViewerDetails({
      userPersonalDetails: null,
      bankDetails: null,
      eduDetails: [],
      leaveManagements: [],
    });
    setIsEditing(false);
    setShowFullProfile(false);
    setEditingEducationId(null);
    setIsEditingEducation(false);
    fetchAllViewerDetails(viewer.userId);
  };

  const handleEdit = async () => {
    if (selectedViewer) {
      if (!viewerDetails.userPersonalDetails && !isFetchingDetails) {
        await fetchAllViewerDetails(selectedViewer.userId);
      }
      setIsEditing(true);
      setActiveSection("personal");
      setEditingEducationId(null);
      setIsEditingEducation(false);
    }
  };

  const handleEditEducation = (educationId) => {
    console.log("📝 Editing education record:", educationId);
    setEditingEducationId(educationId);
    setIsEditingEducation(true);
    setActiveSection("education");
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    if (!selectedViewer) return;

    try {
      console.log("💾 Saving data for user:", selectedViewer.userId);
      console.log("📤 Data to save:", updatedData);
      console.log("✏️ Editing Education ID:", editingEducationId);
      console.log("📝 Is Editing Education?", isEditingEducation);

      // Save personal details if they exist
      if (updatedData.userPersonalDetails) {
        console.log("📋 Processing personal details...");

        const hasPersonalData = Object.values(
          updatedData.userPersonalDetails,
        ).some(
          (value) => value !== "" && value !== null && value !== undefined,
        );

        if (hasPersonalData) {
          // Check if personal details already exist
          if (
            viewerDetails.userPersonalDetails &&
            viewerDetails.userPersonalDetails.id
          ) {
            console.log("🔄 Updating existing personal details");
            await updatePersonalDetails(
              selectedViewer.userId,
              updatedData.userPersonalDetails,
            );
          } else {
            console.log("🆕 Creating new personal details");
            await createPersonalDetails(
              selectedViewer.userId,
              updatedData.userPersonalDetails,
            );
          }
        } else {
          console.log("⚠️ No personal details to save");
        }
      }

      // Save bank details if they exist
      if (updatedData.bankDetails) {
        console.log("💰 Processing bank details...");

        const hasBankData = Object.values(updatedData.bankDetails).some(
          (value) => value !== "" && value !== null && value !== undefined,
        );

        if (hasBankData) {
          // Check if bank details already exist
          if (viewerDetails.bankDetails && viewerDetails.bankDetails.id) {
            console.log("🔄 Updating existing bank details");
            await bankDetailsService.updateBankDetails(
              selectedViewer.userId,
              updatedData.bankDetails,
            );
          } else {
            console.log("🆕 Creating new bank details");
            await bankDetailsService.createBankDetails({
              userId: selectedViewer.userId,
              ...updatedData.bankDetails,
            });
          }
        } else {
          console.log("⚠️ No bank details to save");
        }
      }

      // Save education details if they exist
      if (updatedData.educationDetails) {
        console.log("📚 Processing education details...");

        const hasEducationData = Object.values(
          updatedData.educationDetails,
        ).some(
          (value) => value !== "" && value !== null && value !== undefined,
        );

        if (hasEducationData) {
          // If we're editing an existing education record
          if (editingEducationId) {
            console.log(
              "🔄 Updating existing education record:",
              editingEducationId,
            );
            await updateEducationById(editingEducationId, {
              userId: selectedViewer.userId,
              ...updatedData.educationDetails,
            });
          }
          // If user clicked main Edit button and has education records, update the first one
          else if (
            viewerDetails.eduDetails &&
            viewerDetails.eduDetails.length > 0 &&
            !isEditingEducation
          ) {
            const firstEduRecord = viewerDetails.eduDetails[0];
            console.log(
              "🔄 Updating first education record:",
              firstEduRecord.id,
            );
            await updateEducationById(firstEduRecord.id, {
              userId: selectedViewer.userId,
              ...updatedData.educationDetails,
            });
          }
          // Otherwise create a new education record
          else {
            console.log("🆕 Creating new education record");
            await addEducation({
              userId: selectedViewer.userId,
              ...updatedData.educationDetails,
            });
          }
        } else {
          console.log("⚠️ No education details to save");
        }
      }

      // Refresh data
      console.log("🔄 Refreshing viewer details");
      await fetchAllViewerDetails(selectedViewer.userId);
      setIsEditing(false);
      setEditingEducationId(null);
      setIsEditingEducation(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);

      let errorMessage = "Failed to update profile";

      if (err.response) {
        console.error("❌ Server error response:", err.response);

        if (err.response.data) {
          errorMessage =
            err.response.data.message || JSON.stringify(err.response.data);
        } else if (err.response.status === 500) {
          errorMessage =
            "Server error. Please check if all required fields are filled correctly.";
        }
      } else if (err.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
        console.error("❌ No response:", err.request);
      } else {
        errorMessage = err.message || "Unknown error occurred";
        console.error("❌ Error message:", err.message);
      }

      alert(`❌ ${errorMessage}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingEducationId(null);
    setIsEditingEducation(false);
  };

  const handleDelete = () => {
    if (selectedViewer) {
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedViewer) return;

    try {
      await Promise.allSettled([
        deletePersonalDetails(selectedViewer.userId),
        bankDetailsService.deleteBankDetails(selectedViewer.userId),
        deleteEducationByUser(selectedViewer.userId),
      ]);

      setShowDeleteModal(false);

      const updatedViewers = assignedViewers.filter(
        (viewer) => viewer.userId !== selectedViewer.userId,
      );
      setAssignedViewers(updatedViewers);

      if (updatedViewers.length > 0) {
        setSelectedViewer(updatedViewers[0]);
      } else {
        setSelectedViewer(null);
      }

      setViewerDetails({
        userPersonalDetails: null,
        bankDetails: null,
        eduDetails: [],
        leaveManagements: [],
      });

      alert("✅ Viewer and associated data deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting viewer:", err);
      alert("❌ Failed to delete viewer");
    }
  };

  const handleViewFullProfile = () => {
    if (selectedViewer?.userId) {
      fetchAllViewerDetails(selectedViewer.userId);
    }
    setShowFullProfile(true);
  };

  const handleDeleteEducation = async (educationId) => {
    if (
      !window.confirm("Are you sure you want to delete this education record?")
    )
      return;

    try {
      console.log("Deleting education record:", educationId);

      await fetchAllViewerDetails(selectedViewer.userId);
      alert("✅ Education record deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting education:", err);
      alert("❌ Failed to delete education record");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (err) {
      console.error("Date formatting error:", err);
      return "";
    }
  };

  if (loading) return <p className="p-6">Loading assigned viewers...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Assigned Viewers</h1>
          <p className="text-gray-600 mt-1">
            Total: {assignedViewers.length} viewer
            {assignedViewers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Viewers List */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg bg-white shadow-md">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Assigned Viewers</h3>
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {assignedViewers.length}
                </span>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {assignedViewers.length === 0 ? (
                <div className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No viewers assigned</p>
                </div>
              ) : (
                <div className="divide-y">
                  {assignedViewers.map((viewer) => (
                    <div
                      key={viewer.userId}
                      onClick={() => handleSelectViewer(viewer)}
                      className={`p-4 cursor-pointer transition ${
                        selectedViewer?.userId === viewer.userId
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {viewer.email?.charAt(0).toUpperCase() || "V"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{viewer.email}</p>
                          <p className="text-sm text-gray-600 truncate">
                            ID: {viewer.userId}
                          </p>
                        </div>
                        {selectedViewer?.userId === viewer.userId && (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          Assigned: {formatDate(viewer.assignmentCreatedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns - Selected Viewer Details */}
        <div className="lg:col-span-3">
          {selectedViewer ? (
            <div>
              {/* Action Buttons Card */}
              <div className="border rounded-lg p-4 bg-white shadow-md mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedViewer.email}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Viewer ID: {selectedViewer.userId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleViewFullProfile}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      disabled={isFetchingDetails}
                      title="View Full Profile"
                    >
                      {isFetchingDetails ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">View Profile</span>
                    </button>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                      title="Edit Profile"
                      disabled={isFetchingDetails}
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="Delete Viewer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewer Details Card */}
              <div className="border rounded-lg p-6 bg-white shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold text-xl">
                          {selectedViewer.email?.charAt(0).toUpperCase() || "V"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {selectedViewer.email}
                        </h3>
                        <p className="text-gray-600">
                          Viewer ID: {selectedViewer.userId}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {selectedViewer.role}
                          </span>
                          <span className="text-sm text-gray-500">
                            Joined: {formatDate(selectedViewer.joinDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Email</span>
                          </div>
                          <p className="font-medium">{selectedViewer.email}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Viewer ID
                            </span>
                          </div>
                          <p className="font-medium">{selectedViewer.userId}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Info */}
                  <div>
                    <div className="p-4 bg-blue-50 rounded-lg mb-6">
                      <h4 className="font-semibold text-blue-700 mb-2">
                        Assignment Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Assignment ID
                          </span>
                          <span className="font-medium text-sm">
                            #{selectedViewer.assignmentId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Assigned Date
                          </span>
                          <span className="text-sm text-gray-700">
                            {formatDate(selectedViewer.assignmentCreatedAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Last Updated
                          </span>
                          <span className="text-sm text-gray-700">
                            {formatDate(selectedViewer.assignmentUpdatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {viewerDetails.userPersonalDetails && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Personal Details Available
                          </span>
                        </div>
                        <p className="text-green-600 text-sm">
                          Click "View Profile" button to see complete details
                          including bank, education, and leave records.
                        </p>
                      </div>
                    )}

                    {/* Stats Summary */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Education
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {viewerDetails.eduDetails.length}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Leaves</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {viewerDetails.leaveManagements.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-12 bg-gray-50 border-gray-200 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Viewer Selected
              </h3>
              <p className="text-gray-500">
                Select a viewer from the list on the left to view and manage
                their details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Profile Modal */}
      {showFullProfile && selectedViewer && (
        <FullProfileModal
          viewer={selectedViewer}
          viewerDetails={viewerDetails}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowFullProfile(false)}
          onEdit={handleEdit}
          onEditEducation={handleEditEducation}
          onDeleteEducation={handleDeleteEducation}
          isFetchingDetails={isFetchingDetails}
          formatDate={formatDate}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditing && selectedViewer && (
        <EditProfileModal
          viewer={selectedViewer}
          viewerDetails={viewerDetails}
          editingEducationId={editingEducationId}
          isEditingEducation={isEditingEducation}
          onClose={handleCancelEdit}
          onSave={handleSave}
          formatDateForInput={formatDateForInput}
          isFetchingDetails={isFetchingDetails}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedViewer && (
        <DeleteConfirmationModal
          viewer={selectedViewer}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

// Full Profile Modal Component
function FullProfileModal({
  viewer,
  viewerDetails,
  activeTab,
  setActiveTab,
  onClose,
  onEdit,
  onEditEducation,
  onDeleteEducation,
  isFetchingDetails,
  formatDate,
}) {
  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "bank", label: "Bank", icon: CreditCard },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "leaves", label: "Leaves", icon: Briefcase },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {viewer.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Viewer Profile</h2>
                <p className="text-gray-600">
                  ID: {viewer.userId} | {viewer.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isFetchingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2">Loading profile details...</span>
            </div>
          ) : (
            <>
              {activeTab === "personal" && (
                <PersonalDetailsTab
                  viewerDetails={viewerDetails}
                  formatDate={formatDate}
                />
              )}

              {activeTab === "bank" && (
                <BankDetailsTab viewerDetails={viewerDetails} />
              )}

              {activeTab === "education" && (
                <EducationDetailsTab
                  viewerDetails={viewerDetails}
                  onEditEducation={onEditEducation}
                  onDeleteEducation={onDeleteEducation}
                  formatDate={formatDate}
                />
              )}

              {activeTab === "leaves" && (
                <LeaveDetailsTab
                  viewerDetails={viewerDetails}
                  formatDate={formatDate}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Personal Details Tab Component
function PersonalDetailsTab({ viewerDetails, formatDate }) {
  const personal = viewerDetails.userPersonalDetails;

  if (!personal) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No personal details available</p>
        <p className="text-gray-400 text-sm mt-2">
          Personal details can be added using the Edit button above
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">
                {personal.firstName} {personal.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium">{personal.gender || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">{formatDate(personal.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Marital Status</p>
              <p className="font-medium">{personal.maritalStatus || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="font-medium">{personal.bloodGroup || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nationality</p>
              <p className="font-medium">{personal.nationality || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Personal Email</p>
              <p className="font-medium">{personal.personalEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{personal.phoneNumber}</p>
            </div>
            {personal.alternatePhone && (
              <div>
                <p className="text-sm text-gray-600">Alternate Phone</p>
                <p className="font-medium">{personal.alternatePhone}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Address Line 1</p>
              <p className="font-medium">{personal.addressLine1}</p>
            </div>
            {personal.addressLine2 && (
              <div>
                <p className="text-sm text-gray-600">Address Line 2</p>
                <p className="font-medium">{personal.addressLine2}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-medium">{personal.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="font-medium">{personal.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pincode</p>
                <p className="font-medium">{personal.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bank Details Tab Component
function BankDetailsTab({ viewerDetails }) {
  const bank = viewerDetails.bankDetails;

  if (!bank) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No bank details available</p>
        <p className="text-gray-400 text-sm mt-2">
          Bank details can be added using the Edit button above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Bank Name</p>
            <p className="font-medium">{bank.bankName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Number</p>
            <p className="font-medium font-mono">
              {bank.accountNo || bank.accountNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">IFSC Code</p>
            <p className="font-medium font-mono">{bank.ifscCode}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Branch Name</p>
            <p className="font-medium">{bank.branchName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Branch Location</p>
            <p className="font-medium">{bank.branchLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Education Details Tab Component
function EducationDetailsTab({
  viewerDetails,
  onEditEducation,
  onDeleteEducation,
  formatDate,
}) {
  const eduDetails = viewerDetails.eduDetails || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Education Details
        </h3>
      </div>

      {eduDetails.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No education details available</p>
          <p className="text-gray-400 text-sm mt-2">
            Education details can be added using the Edit button
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {eduDetails.map((edu, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{edu.qualification}</h3>
                  {edu.specialization && (
                    <p className="text-gray-600">{edu.specialization}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditEducation(edu.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteEducation(edu.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Institution</p>
                    <p className="font-medium">{edu.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Board/University</p>
                    <p className="font-medium">{edu.boardOrUniversity}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Year of Passing</p>
                    <p className="font-medium">{edu.yearOfPassing}</p>
                  </div>
                  {edu.percentage && (
                    <div>
                      <p className="text-sm text-gray-600">Percentage</p>
                      <p className="font-medium">{edu.percentage}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Leave Details Tab Component
function LeaveDetailsTab({ viewerDetails, formatDate }) {
  const leaves = viewerDetails.leaveManagements || [];

  if (leaves.length === 0) {
    return (
      <div className="text-center py-8">
        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No leave records available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leaves.map((leave, index) => (
        <div key={index} className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">{leave.leaveType}</h3>
              <p className="text-sm text-gray-600">{leave.reason}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                leave.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : leave.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : leave.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : leave.status === "CANCELLED"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
              }`}
            >
              {leave.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{formatDate(leave.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="font-medium">{formatDate(leave.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="font-medium">{leave.totalDays} days</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({
  viewer,
  viewerDetails,
  editingEducationId,
  isEditingEducation,
  onClose,
  onSave,
  formatDateForInput,
  isFetchingDetails,
  activeSection,
  setActiveSection,
}) {
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Find the education record being edited
  const educationToEdit = viewerDetails.eduDetails?.find(
    (edu) => edu.id === editingEducationId,
  );

  const [formData, setFormData] = useState(() => {
    console.log("🔄 Initializing form data from viewerDetails:", viewerDetails);
    console.log("📝 Editing Education ID:", editingEducationId);
    console.log("🎓 Education to edit:", educationToEdit);

    // For education: if editing a specific record, use its data
    // If editing from main Edit button, use the first education record or empty
    let educationData;

    if (editingEducationId && educationToEdit) {
      // Editing specific education record
      educationData = {
        qualification: educationToEdit.qualification || "",
        specialization: educationToEdit.specialization || "",
        institution: educationToEdit.institution || "",
        boardOrUniversity: educationToEdit.boardOrUniversity || "",
        yearOfPassing: educationToEdit.yearOfPassing || "",
        percentage: educationToEdit.percentage || "",
      };
    } else if (
      viewerDetails.eduDetails &&
      viewerDetails.eduDetails.length > 0
    ) {
      // Main Edit button clicked - use first education record
      const firstEdu = viewerDetails.eduDetails[0];
      educationData = {
        qualification: firstEdu.qualification || "",
        specialization: firstEdu.specialization || "",
        institution: firstEdu.institution || "",
        boardOrUniversity: firstEdu.boardOrUniversity || "",
        yearOfPassing: firstEdu.yearOfPassing || "",
        percentage: firstEdu.percentage || "",
      };
    } else {
      // No education records exist
      educationData = {
        qualification: "",
        specialization: "",
        institution: "",
        boardOrUniversity: "",
        yearOfPassing: "",
        percentage: "",
      };
    }

    return {
      userPersonalDetails: viewerDetails.userPersonalDetails
        ? {
            firstName: viewerDetails.userPersonalDetails.firstName || "",
            lastName: viewerDetails.userPersonalDetails.lastName || "",
            gender: viewerDetails.userPersonalDetails.gender || "",
            dateOfBirth:
              formatDateForInput(
                viewerDetails.userPersonalDetails.dateOfBirth,
              ) || "",
            personalEmail:
              viewerDetails.userPersonalDetails.personalEmail ||
              viewer.email ||
              "",
            phoneNumber: viewerDetails.userPersonalDetails.phoneNumber || "",
            alternatePhone:
              viewerDetails.userPersonalDetails.alternatePhone || "",
            addressLine1: viewerDetails.userPersonalDetails.addressLine1 || "",
            addressLine2: viewerDetails.userPersonalDetails.addressLine2 || "",
            city: viewerDetails.userPersonalDetails.city || "",
            state: viewerDetails.userPersonalDetails.state || "",
            pincode: viewerDetails.userPersonalDetails.pincode || "",
            maritalStatus:
              viewerDetails.userPersonalDetails.maritalStatus || "",
            bloodGroup: viewerDetails.userPersonalDetails.bloodGroup || "",
            nationality:
              viewerDetails.userPersonalDetails.nationality || "Indian",
          }
        : {
            firstName: "",
            lastName: "",
            gender: "",
            dateOfBirth: "",
            personalEmail: viewer.email || "",
            phoneNumber: "",
            alternatePhone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
            maritalStatus: "",
            bloodGroup: "",
            nationality: "Indian",
          },
      bankDetails: viewerDetails.bankDetails
        ? {
            bankName: viewerDetails.bankDetails.bankName || "",
            accountNo:
              viewerDetails.bankDetails.accountNo ||
              viewerDetails.bankDetails.accountNumber ||
              "",
            ifscCode: viewerDetails.bankDetails.ifscCode || "",
            branchName: viewerDetails.bankDetails.branchName || "",
            branchLocation: viewerDetails.bankDetails.branchLocation || "",
          }
        : {
            bankName: "",
            accountNo: "",
            ifscCode: "",
            branchName: "",
            branchLocation: "",
          },
      educationDetails: educationData,
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("📤 Form data to be submitted:", formData);
      console.log("👤 User ID:", viewer.userId);
      console.log("✏️ Editing Education ID:", editingEducationId);
      console.log("📝 Is Editing Education?", isEditingEducation);
      console.log("🎯 Active Section:", activeSection);
      await onSave(formData);
      setFormChanged(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalChange = (field, value) => {
    console.log(`📝 Changing personal ${field}: ${value}`);
    setFormChanged(true);
    setFormData((prev) => ({
      ...prev,
      userPersonalDetails: {
        ...prev.userPersonalDetails,
        [field]: value,
      },
    }));
  };

  const handleBankChange = (field, value) => {
    console.log(`📝 Changing bank ${field}: ${value}`);
    setFormChanged(true);
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
  };

  const handleEducationChange = (field, value) => {
    console.log(`📝 Changing education ${field}: ${value}`);
    setFormChanged(true);
    setFormData((prev) => ({
      ...prev,
      educationDetails: {
        ...prev.educationDetails,
        [field]: value,
      },
    }));
  };

  const sections = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "bank", label: "Bank Details", icon: CreditCard },
    { id: "education", label: "Education", icon: GraduationCap },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Edit Viewer Profile</h2>
              <p className="text-sm text-gray-600">
                {viewer.email} | ID: {viewer.userId}
              </p>
              {activeSection === "education" && (
                <div className="mt-1">
                  {editingEducationId ? (
                    <span className="text-sm text-blue-600">
                      ✏️ Editing existing education record
                    </span>
                  ) : viewerDetails.eduDetails &&
                    viewerDetails.eduDetails.length > 0 ? (
                    <span className="text-sm text-blue-600">
                      📝 Updating first education record
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">
                      🆕 Adding new education record
                    </span>
                  )}
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-1/4 border-r p-4">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-2 ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="w-3/4 p-6 overflow-y-auto">
            {isFetchingDetails ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2">Loading viewer details...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {activeSection === "personal" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        Personal Details
                      </h3>
                      <div className="text-sm text-gray-500">
                        {viewerDetails.userPersonalDetails
                          ? "Editing existing details"
                          : "Adding new details"}
                      </div>
                    </div>

                    {/* Personal Details Form Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.userPersonalDetails.firstName}
                          onChange={(e) =>
                            handlePersonalChange("firstName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.userPersonalDetails.lastName}
                          onChange={(e) =>
                            handlePersonalChange("lastName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Gender *
                        </label>
                        <select
                          value={formData.userPersonalDetails.gender}
                          onChange={(e) =>
                            handlePersonalChange("gender", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          value={formData.userPersonalDetails.dateOfBirth}
                          onChange={(e) =>
                            handlePersonalChange("dateOfBirth", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.userPersonalDetails.phoneNumber}
                          onChange={(e) =>
                            handlePersonalChange("phoneNumber", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Alternate Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.userPersonalDetails.alternatePhone}
                          onChange={(e) =>
                            handlePersonalChange(
                              "alternatePhone",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Personal Email *
                        </label>
                        <input
                          type="email"
                          value={formData.userPersonalDetails.personalEmail}
                          onChange={(e) =>
                            handlePersonalChange(
                              "personalEmail",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter personal email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Marital Status
                        </label>
                        <select
                          value={formData.userPersonalDetails.maritalStatus}
                          onChange={(e) =>
                            handlePersonalChange(
                              "maritalStatus",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Blood Group
                        </label>
                        <select
                          value={formData.userPersonalDetails.bloodGroup}
                          onChange={(e) =>
                            handlePersonalChange("bloodGroup", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Nationality
                        </label>
                        <input
                          type="text"
                          value={formData.userPersonalDetails.nationality}
                          onChange={(e) =>
                            handlePersonalChange("nationality", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="e.g., Indian"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Address Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            value={formData.userPersonalDetails.addressLine1}
                            onChange={(e) =>
                              handlePersonalChange(
                                "addressLine1",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            placeholder="Enter address line 1"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            value={formData.userPersonalDetails.addressLine2}
                            onChange={(e) =>
                              handlePersonalChange(
                                "addressLine2",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter address line 2 (optional)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={formData.userPersonalDetails.city}
                            onChange={(e) =>
                              handlePersonalChange("city", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={formData.userPersonalDetails.state}
                            onChange={(e) =>
                              handlePersonalChange("state", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={formData.userPersonalDetails.pincode}
                            onChange={(e) =>
                              handlePersonalChange("pincode", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                            placeholder="Enter pincode"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "bank" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Bank Details</h3>
                      <div className="text-sm text-gray-500">
                        {viewerDetails.bankDetails
                          ? "Editing existing details"
                          : "Adding new details"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.bankName}
                          onChange={(e) =>
                            handleBankChange("bankName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="e.g., State Bank of India"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.accountNo}
                          onChange={(e) =>
                            handleBankChange("accountNo", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.ifscCode}
                          onChange={(e) =>
                            handleBankChange("ifscCode", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="e.g., SBIN0001234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Branch Name *
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.branchName}
                          onChange={(e) =>
                            handleBankChange("branchName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter branch name"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">
                          Branch Location *
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.branchLocation}
                          onChange={(e) =>
                            handleBankChange("branchLocation", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="Enter branch location"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "education" && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {editingEducationId ||
                        (viewerDetails.eduDetails &&
                          viewerDetails.eduDetails.length > 0 &&
                          !isEditingEducation)
                          ? "Edit Education Record"
                          : "Add New Education"}
                      </h3>
                      <p className="text-gray-600">
                        Fill in the academic qualification details below
                      </p>
                      <div className="mt-2">
                        <div className="text-sm text-gray-500">
                          User ID: {viewer.userId}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Qualification Level *
                        </label>
                        <select
                          value={formData.educationDetails.qualification}
                          onChange={(e) =>
                            handleEducationChange(
                              "qualification",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                        >
                          <option value="">Select qualification level</option>
                          <option value="High School">High School</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Associate Degree">
                            Associate Degree
                          </option>
                          <option value="Bachelor's Degree">
                            Bachelor's Degree
                          </option>
                          <option value="Master's Degree">
                            Master's Degree
                          </option>
                          <option value="Doctorate">Doctorate</option>
                          <option value="Post Graduate">Post Graduate</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institution Name *
                        </label>
                        <input
                          type="text"
                          value={formData.educationDetails.institution}
                          onChange={(e) =>
                            handleEducationChange("institution", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="e.g., Massachusetts Institute of Technology, Cambridge University, CBSE"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Enter the full name of the educational institution
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board / University *
                        </label>
                        <input
                          type="text"
                          value={formData.educationDetails.boardOrUniversity}
                          onChange={(e) =>
                            handleEducationChange(
                              "boardOrUniversity",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          required
                          placeholder="e.g., Cambridge University, CBSE"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization / Major
                        </label>
                        <input
                          type="text"
                          value={formData.educationDetails.specialization}
                          onChange={(e) =>
                            handleEducationChange(
                              "specialization",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="e.g., Computer Science, Business Administration"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Optional field
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year of Passing *
                          </label>
                          <select
                            value={formData.educationDetails.yearOfPassing}
                            onChange={(e) =>
                              handleEducationChange(
                                "yearOfPassing",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                          >
                            <option value="">Select passing year</option>
                            {Array.from({ length: 50 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Percentage / CGPA
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={formData.educationDetails.percentage}
                              onChange={(e) =>
                                handleEducationChange(
                                  "percentage",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded pr-10"
                              placeholder="e.g., 85.5"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                            <span className="absolute right-3 top-2 text-gray-500">
                              %
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Enter percentage between 0-100 or leave blank if not
                            applicable
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6 mt-6 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      formChanged
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={
                      !formChanged
                        ? "Make changes to enable save"
                        : "Save all changes"
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ viewer, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">
            Delete Viewer?
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to delete viewer{" "}
            <strong>{viewer.email}</strong>? This will delete all associated
            data including personal details, bank info, and leave records.
          </p>
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-red-600 text-center">
              ⚠️ This action is permanent and cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Viewer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorDashboard;
