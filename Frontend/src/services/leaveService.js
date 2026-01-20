const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * Apply Leave
 * Matches backend: exports.applyLeave
 * POST /api/leaves/apply
 */
export const applyLeave = async (leaveData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/leaves`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaveData),
    });

    return await response.json();
  } catch (error) {
    console.error("Apply Leave Error:", error);
    throw error;
  }
};

/**
 * Get leaves by user
 * Matches backend: exports.getLeavesByUser
 * GET /api/leaves/user/:userId
 */
export const getLeavesByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/leaves/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Get Leaves By User Error:", error);
    throw error;
  }
};

/**
 * Get all leaves (Admin / HR)
 * Matches backend: exports.getAllLeaves
 * GET /api/leaves/all
 */
export const getAllLeaves = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/leaves/all`);
    return await response.json();
  } catch (error) {
    console.error("Get All Leaves Error:", error);
    throw error;
  }
};

/**
 * Update leave status (Approve / Reject / Cancel)
 * Matches backend: exports.updateLeaveStatus
 * PUT /api/leaves/:id
 */
export const updateLeaveStatus = async (leaveId, data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/leaves/${leaveId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("Update Leave Status Error:", error);
    throw error;
  }
};

/**
 * Delete leave
 * Matches backend: exports.deleteLeave
 * DELETE /api/leaves/:id
 */
export const deleteLeave = async (leaveId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/leaves/${leaveId}`, {
      method: "DELETE",
    });

    return await response.json();
  } catch (error) {
    console.error("Delete Leave Error:", error);
    throw error;
  }
};
