import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { getUserById } from "../services/userApi";
import LeaveModal from "../components/LeaveModal";

const ViewerDashboard = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const { user } = useAuth();

  const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

  const fetchDetails = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await getUserById(user.id);

      console.log("[DEBUG] ViewerDashboard - Full response:", res.data);
      console.log(
        "[DEBUG] ViewerDashboard - Leave managements:",
        res.data.leaveManagements,
      );
      setDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/leaves/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete leave");
      fetchDetails();
    } catch (err) {
      console.error(err);
      alert("Error deleting leave");
    }
  };

  const handleEdit = (leave) => {
    setEditLeave(leave);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (leave) => {
    setEditLeave(leave);
    setViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditLeave(null);
  };

  useEffect(() => {
    fetchDetails();
  }, [user]);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "bank", label: "Bank Details", icon: "🏦" },
    { id: "leaves", label: "Leave History", icon: "📅" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Viewer Dashboard
        </h1>
        <p className="text-gray-600">View-only access to user information</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-white shadow-lg border border-gray-200 text-blue-600"
                : "text-gray-600 hover:bg-white/50"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          {loading ? (
            <Loader />
          ) : (
            <>
              {activeTab === "personal" && (
                <PersonalView
                  data={details.userPersonalDetails}
                  user={details}
                />
              )}

              {activeTab === "education" && (
                <EducationView data={details.eduDetails} />
              )}

              {activeTab === "bank" && <BankView data={details.bankDetails} />}

              {activeTab === "leaves" && (
                <LeavesView
                  data={details.leaveManagements}
                  onAdd={() => {
                    setEditLeave(null);
                    setViewMode(false);
                    setIsModalOpen(true);
                  }}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </div>

      <LeaveModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchDetails}
        editLeave={editLeave}
        viewMode={viewMode}
        initialUserId={user.id}
      />
    </div>
  );
};

const PersonalView = ({ data, user }) => {
  if (!data) return <p>No personal details</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {data.firstName} {data.lastName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard label="Gender" value={data.gender} icon="👤" />
        <InfoCard
          label="Date of Birth"
          value={new Date(data.dateOfBirth).toDateString()}
          icon="🎂"
        />
        <InfoCard label="Phone" value={data.phoneNumber} icon="📱" />
        <InfoCard label="Marital Status" value={data.maritalStatus} icon="💍" />
        <InfoCard label="Blood Group" value={data.bloodGroup} icon="🩸" />
        <InfoCard label="Nationality" value={data.nationality} icon="🌍" />
      </div>
    </div>
  );
};

const EducationView = ({ data = [] }) => {
  if (!data.length) return <p>No education records</p>;

  return (
    <div className="space-y-6">
      {data.map((edu) => (
        <div key={edu.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              label="Qualification"
              value={edu.qualification}
              icon="🎓"
            />
            <InfoCard label="Institution" value={edu.institution} icon="🏫" />
            <InfoCard
              label="Year of Passing"
              value={edu.yearOfPassing}
              icon="📅"
            />
            <InfoCard label="Percentage" value={edu.percentage} icon="📅" />
          </div>
        </div>
      ))}
    </div>
  );
};

const BankView = ({ data }) => {
  if (!data) return <p>No bank details</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <InfoCard label="Bank Name" value={data.bankName} icon="🏦" />
      <InfoCard label="Account No" value={data.accountNo} icon="💳" />
      <InfoCard label="IFSC" value={data.ifscCode} icon="🔢" />
      <InfoCard label="Branch" value={data.branchName} icon="🏢" />
    </div>
  );
};

const LeavesView = ({ data = [], onAdd, onEdit, onView, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-xl font-bold text-gray-800">Leave History</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <span className="text-lg">+</span> Apply Leave
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Processed By
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {!data.length ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No leave records found
                  </td>
                </tr>
              ) : (
                data.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onView(leave)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {leave.leaveType}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-600">
                        {formatDate(leave.startDate)} →{" "}
                        {formatDate(leave.endDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {leave.totalDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          leave.status === "APPROVED"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : leave.status === "REJECTED"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-600 font-medium">
                        {leave.status === "APPROVED"
                          ? leave.approvedBy || "-"
                          : leave.status === "REJECTED"
                            ? leave.rejectedBy || "-"
                            : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => onEdit(leave)}
                          disabled={leave.status !== "PENDING"}
                          className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => onDelete(leave.id)}
                          disabled={leave.status !== "PENDING"}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xl">{icon}</span>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

const Loader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Loading details...</p>
    </div>
  </div>
);

export default ViewerDashboard;
