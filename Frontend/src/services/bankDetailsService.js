const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    } else {
      throw new Error(`Server error: ${response.status}`);
    }
  }

  if (response.status === 204) {
    return { success: true };
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const bankDetailsService = {
  createBankDetails: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getBankDetailsByUserId: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/bank/${userId}`);
    return handleResponse(response);
  },

  getAllBankDetails: async () => {
    const response = await fetch(`${API_BASE_URL}/bank`);
    return handleResponse(response);
  },

  updateBankDetails: async (userId, data) => {
    const response = await fetch(`${API_BASE_URL}/api/bank/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteBankDetails: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/bank/${userId}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
