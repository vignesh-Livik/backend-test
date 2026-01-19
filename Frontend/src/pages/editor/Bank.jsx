import { useState, useEffect } from "react";
import BankDetailsViewModal from "../../components/BankDetailsView";
import BankDetailsModal from "../../components/BankDetailsForm";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const Bank = () => {
  const [bankDetailsList, setBankDetailsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchAllBankDetails();
  }, []);

  const fetchAllBankDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/bank`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch bank details: HTTP ${response.status}`
        );
      }

      const data = await response.json();
      setBankDetailsList(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bank/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed: HTTP ${response.status}`);
      }

      setBankDetailsList((prev) =>
        prev.filter((item) => item.userId !== userId)
      );
      setShowDeleteConfirm(null);
      alert("Bank details deleted successfully!");
    } catch (err) {
      alert("Failed to delete bank details: " + err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const filteredBankDetails = bankDetailsList.filter(
    (bank) =>
      bank.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.accountNo.includes(searchTerm) ||
      bank.ifscCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewModal = (userId) => {
    setSelectedUserId(userId);
    setViewOpen(true);
  };

  const openAddModal = () => {
    setSelectedUserId(null);
    setFormMode("add");
    setFormOpen(true);
  };

  const openEditModal = (userId) => {
    setSelectedUserId(userId);
    setFormMode("edit");
    setFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bank Details</h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-10 gap-6">
        <div className="relative w-full lg:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍︎
          </span>
          <input
            type="text"
            placeholder="Search by User ID, Bank, IFSC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
        w-full pl-11 pr-4 py-3
        border border-gray-400 rounded-xl
        focus:outline-none focus:ring focus:ring-black focus:border-black
        transition
      "
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={fetchAllBankDetails}
            className="
        px-5 py-3
        bg-white border border-gray-300
        rounded-xl text-gray-700 font-medium
        hover:bg-gray-100
        active:scale-95 transition
      "
          >
            🔄 Refresh
          </button>
          <button
            onClick={openAddModal}
            className="
        px-6 py-3
        bg-blue-600 text-white font-semibold
        rounded-xl shadow-md
        hover:bg-blue-700 hover:shadow-lg
        active:scale-95 transition
      "
          >
            ✚ Add Bank Details
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">User ID</th>
                <th className="px-6 py-4 text-left">Bank Name</th>
                <th className="px-6 py-4 text-left">Account No</th>
                <th className="px-6 py-4 text-left">IFSC</th>
                <th className="px-6 py-4 text-left">Branch</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBankDetails.map((bank) => (
                <tr key={bank.userId} className="border-t">
                  <td className="px-6 py-4">{bank.userId}</td>
                  <td className="px-6 py-4">{bank.bankName}</td>
                  <td className="px-6 py-4">{bank.accountNo}</td>
                  <td className="px-6 py-4">{bank.ifscCode}</td>
                  <td className="px-6 py-4">
                    {bank.branchName} – {bank.branchLocation}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openViewModal(bank.userId)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(bank.userId)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(bank.userId)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl">
            <p className="mb-4">
              Delete bank details for <b>{showDeleteConfirm}</b>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BankDetailsViewModal
        isOpen={viewOpen}
        userId={selectedUserId}
        onClose={() => setViewOpen(false)}
      />

      <BankDetailsModal
        isOpen={formOpen}
        mode={formMode}
        userId={selectedUserId}
        onClose={(refresh) => {
          setFormOpen(false);
          if (refresh) fetchAllBankDetails();
        }}
      />
    </div>
  );
};

export default Bank;
