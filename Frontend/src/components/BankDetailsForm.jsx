import { useEffect, useState } from "react";
import { bankDetailsService } from "../services/bankDetailsService";

const initialFormState = {
  userId: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
  branchName: "",
  branchLocation: "",
};

const BankDetailsModal = ({ isOpen, onClose, mode = "add", userId }) => {
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "add") {
      setFormData(initialFormState);
      setErrors({});
    }

    if ((isEdit || isView) && userId) {
      fetchBankDetails();
    }
  }, [mode, userId, isOpen]);

  const fetchBankDetails = async () => {
    try {
      setIsFetching(true);
      const data = await bankDetailsService.getBankDetailsByUserId(userId);
      setFormData(data);
    } catch (err) {
      alert("Failed to load bank details");
      onClose();
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    if (isView) return;

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = "User ID required";
    if (!formData.bankName) newErrors.bankName = "Bank name required";
    if (!formData.accountNo) newErrors.accountNo = "Account number required";
    if (!formData.ifscCode) newErrors.ifscCode = "IFSC code required";
    if (!formData.branchName) newErrors.branchName = "Branch name required";
    if (!formData.branchLocation)
      newErrors.branchLocation = "Branch location required";

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (formData.ifscCode && !ifscRegex.test(formData.ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      if (isEdit) {
        await bankDetailsService.updateBankDetails(formData.userId, formData);
        alert("Bank details updated");
      } else {
        await bankDetailsService.createBankDetails(formData);
        alert("Bank details added");
      }
      onClose(true);
    } catch (err) {
      alert(err.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" && "Add Bank Details"}
          {mode === "edit" && "Edit Bank Details"}
          {mode === "view" && "View Bank Details"}
        </h2>

        {isFetching ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["userId", "User ID"],
                ["bankName", "Bank Name"],
                ["accountNo", "Account Number"],
                ["ifscCode", "IFSC Code"],
                ["branchName", "Branch Name"],
                ["branchLocation", "Branch Location"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    disabled={isView || (isEdit && name === "userId")}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    } ${isView ? "bg-gray-100" : ""}`}
                  />
                  {errors[name] && (
                    <p className="text-sm text-red-600">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>

              {!isView && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {isLoading ? "Saving..." : isEdit ? "Update" : "Save"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BankDetailsModal;
