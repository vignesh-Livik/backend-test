const BASE_URL = "http://localhost:3000/api";

/* ===============================
   GET EDUCATION BY USER
   =============================== */
export async function getEducationByUser(userId) {
  const response = await fetch(
    `${BASE_URL}/users/${userId}/education`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch education details");
  }

  return response.json();
}

/* ===============================
   ADD EDUCATION
   =============================== */
export async function addEducation(userId, payload) {
  const response = await fetch(
    `${BASE_URL}/users/${userId}/education`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to add education details");
  }

  return response.json();
}

/* =====================================================
   🔥 UPDATE EDUCATION (BY EDUCATION ID – REQUIRED)
   ===================================================== */
export async function updateEducation(id, payload) {
  const response = await fetch(
    `${BASE_URL}/education/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update education");
  }

  return response.json();
}

/* =====================================================
   🔥 DELETE EDUCATION (BY EDUCATION ID – REQUIRED)
   ===================================================== */
export async function deleteEducation(id) {
  const response = await fetch(
    `${BASE_URL}/education/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to delete education");
  }

  return response.json();
}

/* ===============================
   (OPTIONAL) BULK OPERATIONS
   =============================== */
export async function updateEducationByUser(userId, payload) {
  return fetch(`${BASE_URL}/users/${userId}/education`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteEducationByUser(userId) {
  return fetch(`${BASE_URL}/users/${userId}/education`, {
    method: "DELETE",
  });
}
