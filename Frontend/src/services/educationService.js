const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";

const API_PATH = "/api/education";

/* ===============================
   GET ALL EDUCATION
   =============================== */
export async function getAllEducation() {
  const response = await fetch(`${API_BASE_URL}${API_PATH}`);

  if (!response.ok) {
    throw new Error("Failed to fetch all education details");
  }

  return response.json();
}

/* ===============================
   GET EDUCATION BY USER
   =============================== */
export async function getEducationByUser(userId) {
  const response = await fetch(`${API_BASE_URL}${API_PATH}/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch education details");
  }

  return response.json();
}

/* ===============================
   ADD EDUCATION
   =============================== */
export async function addEducation(payload) {
  const response = await fetch(`${API_BASE_URL}${API_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add education details");
  }

  return response.json();
}

/* =====================================================
   UPDATE EDUCATION (BY USER ID)
   ===================================================== */
export async function updateEducationByUser(userId, payload) {
  const response = await fetch(`${API_BASE_URL}${API_PATH}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update education");
  }

  return response.json();
}

/* ===============================
   DELETE EDUCATION (BY USER ID)
   =============================== */
export async function deleteEducationByUser(userId) {
  const response = await fetch(`${API_BASE_URL}${API_PATH}/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete education");
  }

  return response.json();
}

/* =====================================================
   UPDATE EDUCATION (BY RECORD ID)
   ===================================================== */
export async function updateEducationById(id, payload) {
  const response = await fetch(`${API_BASE_URL}${API_PATH}/record/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update education record");
  }

  return response.json();
}

/* ===============================
   DELETE EDUCATION (BY RECORD ID)
   =============================== */
export async function deleteEducationById(id) {
  const response = await fetch(`${API_BASE_URL}${API_PATH}/record/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete education record");
  }

  return response.json();
}

// Fallback aliases for compatibility with Education.jsx if it uses them
export const updateEducation = updateEducationByUser;
export const deleteEducation = deleteEducationByUser;
