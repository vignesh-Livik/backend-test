import { useEffect, useState } from "react";
import LeaveModal from "../../components/LeaveModal";

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

  const onClose = () => {
    setOpenModal(false);
    setEditLeave(null);
    setViewMode(false);
  };

  const viewLeave = (leave) => {
    setEditLeave(leave);
    setViewMode(true);
    setOpenModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toISOString().slice(0, 10);
  };

  const fetchLeaves = async () => {
    const res = await fetch(`${BASE_URL}/api/leaves/all`);
    const data = await res.json();
    setLeaves(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/leaves/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete leave");
      }
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Error deleting leave");
    }
  };

  const UpdateLeave = (leave) => {
    setEditLeave(leave);
    setOpenModal(true);
    setViewMode(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Leave Management</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Leave
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Days
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewLeave(leave)}
                        className="text-blue-600 hover:underline hover:text-blue-800"
                      >
                        {leave.id}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-xs">
                            {leave.user?.email?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="truncate max-w-[180px]">
                          {leave.user?.email || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {formatDate(leave.startDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                        {formatDate(leave.endDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center justify-center">
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs font-medium">
                          {leave.totalDays}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            leave.leaveType === "SICKLEAVE"
                              ? "bg-red-100 text-red-800"
                              : leave.leaveType === "EARNEDLEAVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {leave.leaveType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="flex items-center justify-center">
                        <span>{leave.reason}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setEditLeave(leave);
                            setViewMode(false);
                            setOpenModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          Edit
                        </button>

                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(leave.id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {leaves.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No leave requests
                </h3>
                <p className="text-gray-500">
                  Get started by creating a new leave request
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <LeaveModal
        isOpen={openModal}
        onClose={onClose}
        onSuccess={fetchLeaves}
        editLeave={editLeave}
        viewMode={viewMode}
      />
    </div>
  );
}

export default LeaveManagement;
