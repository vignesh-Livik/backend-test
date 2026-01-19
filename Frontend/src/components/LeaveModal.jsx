// import { useState } from "react";

// function LeaveModal({ isOpen, onClose, onSuccess, editLeave }) {
//   const [formData, setFormData] = useState({
//     userId: "",
//     startDate: "",
//     endDate: "",
//     leaveType: "SICKLEAVE",
//     reason: "",
//   });

//   // ✅ Correct change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       userId: formData.userId, // must exist in User table
//       startDate: formData.startDate, // Date
//       endDate: formData.endDate, // Date
//       leaveType: formData.leaveType, // ENUM
//       reason: formData.reason,
//       totalDays: 1, // can calculate later
//     };

//     try {
//       const res = await fetch("http://localhost:3000/api/leaves", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         console.error("Backend error:", err);
//         throw new Error("Failed to apply leave");
//       }

//       onSuccess(); // refresh table
//       onClose(); // close modal
//     } catch (err) {
//       console.error(err);
//       alert("Error applying leave");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div>
//       <h2 className="text-lg font-medium font-bold">Add Leave</h2>

//       <form onSubmit={handleSubmit}>
//         <label>
//           User Id:
//           <input
//             type="text"
//             name="userId"
//             value={formData.userId}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           From Date:
//           <input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           To Date:
//           <input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Leave Type:
//           <select
//             name="leaveType"
//             value={formData.leaveType}
//             onChange={handleChange}
//           >
//             <option value="SICKLEAVE">Sick Leave</option>
//             <option value="EARNEDLEAVE">Earned Leave</option>
//             <option value="CASUALLEAVE">Casual Leave</option>
//           </select>
//         </label>

//         <label>
//           Reason:
//           <textarea
//             name="reason"
//             value={formData.reason}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <button type="submit">Submit</button>
//         <button type="button" onClick={onClose}>
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// }

// export default LeaveModal;

import { useState, useEffect } from "react";

function LeaveModal({ isOpen, onClose, onSuccess, editLeave }) {
  const [formData, setFormData] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    leaveType: "SICKLEAVE",
    reason: "",
  });

  // ✅ Correct change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (editLeave) {
      setFormData({
        userId: editLeave.userId || "",
        startDate: new Date(editLeave.startDate).toISOString().slice(0, 10),
        endDate: new Date(editLeave.endDate).toISOString().slice(0, 10),
        leaveType: editLeave.leaveType || "SICKLEAVE",
        reason: editLeave.reason || "",
      });
    }
  }, [editLeave]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      leaveType: formData.leaveType,
      reason: formData.reason,
      totalDays: 1,
    };

    const isEdit = Boolean(editLeave);

    const url = isEdit
      ? `http://localhost:3000/api/leaves/status/${editLeave.id}`
      : "http://localhost:3000/api/leaves";

    const method = isEdit ? "PUT" : "POST";

    const body = isEdit
      ? {
          startDate: formData.startDate,
          endDate: formData.endDate,
          leaveType: formData.leaveType,
          reason: formData.reason,
        }
      : { ...payload, userId: formData.userId };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed save leave");
      }
      await onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving leave");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-2xl">
          <div className=" px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editLeave ? "Edit Leave" : "Apply for Leave"}
              </h2>

              <button
                onClick={() => {
                  onClose();
                }}
                className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-red/50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details to request leave
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  User ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                    className="block w-76 pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter user ID"
                  />
                </div>
              </div>
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  User ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                    className="block w-76 pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter user ID"
                  />
                </div>
              </div> */}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  From Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  To Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="SICKLEAVE" className="py-2">
                    Sick Leave
                  </option>
                  <option value="EARNEDLEAVE" className="py-2">
                    Earned Leave
                  </option>
                  <option value="CASUALLEAVE" className="py-2">
                    Casual Leave
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reason <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Please provide a reason for your leave..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
              >
                {editLeave ? "Update Leave" : "Submit Request"}
              </button>
            </div>
          </form>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Your request will be reviewed by HR within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveModal;
