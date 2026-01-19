import { useEffect, useState } from "react";
import { bankDetailsService } from "../services/bankDetailsService";

const BankDetailsViewModal = ({ isOpen, userId, onClose }) => {
  const [bankDetails, setBankDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchBankDetails();
    }
  }, [isOpen, userId]);

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const data = await bankDetailsService.getBankDetailsByUserId(userId);
      setBankDetails(data);
    } catch (error) {
      alert(error.message || "Failed to fetch bank details");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Bank Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !bankDetails ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              No Bank Details Found
            </h2>
            <p className="text-gray-600 mb-6">
              Bank details not found for user {userId}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="bg-linear-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-lg mr-3 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">B</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {bankDetails.bankName}
                    </h2>
                    <p className="text-blue-200">Bank Account Information</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-200">User ID</p>
                  <p className="font-mono font-bold">{bankDetails.userId}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon="💳"
                  title="Account Number"
                  value={bankDetails.accountNo}
                  color="blue"
                />
                <InfoCard
                  icon="🔢"
                  title="IFSC Code"
                  value={bankDetails.ifscCode}
                  color="green"
                />
                <InfoCard
                  icon="🏦"
                  title="Branch Name"
                  value={bankDetails.branchName}
                  color="purple"
                />
                <InfoCard
                  icon="📍"
                  title="Branch Location"
                  value={bankDetails.branchLocation}
                  color="orange"
                />
              </div>
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountNo)}
                    className="px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    Copy Account Number
                  </button>
                  <button
                    onClick={() => copyToClipboard(bankDetails.ifscCode)}
                    className="px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    Copy IFSC Code
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
const InfoCard = ({ icon, title, value, color }) => (
  <div className={`bg-${color}-50 rounded-xl p-5 border border-${color}-100`}>
    <div className="flex items-center mb-3">
      <span className={`text-${color}-600 mr-2`}>{icon}</span>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-xl font-bold font-mono">{value}</p>
  </div>
);

export default BankDetailsViewModal;
