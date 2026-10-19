const configuredUrl = process.env.NEXT_PUBLIC_API_URL;

function getApiBaseUrl() {
  if (!configuredUrl?.trim()) {
    throw new Error(
      "API URL is not configured. Please check your .env.local file."
    );
  }

  const base = configuredUrl.trim().replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
}

// Universal Owner API request helper
export async function ownerApiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const cleanPath = String(path).replace(/^\/+/, "");

  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("destin_owner_token");
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    // FormData me Content-Type browser khud boundary ke saath lagata hai
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Plain object aaye to JSON bana do, FormData aur string waise hi jaayein
  let body = options.body;

  if (body && !isFormData && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${baseUrl}/${cleanPath}`, {
      ...options,
      headers,
      body,
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check your connection."
    );
  }

  const responseText = await response.text();

  let result;

  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch {
    const error = new Error(
      `Server returned a non-JSON response (HTTP ${response.status}). ` +
        `Response: ${responseText.slice(0, 300) || "(empty response)"}`
    );

    error.status = response.status;
    throw error;
  }

  if (!response.ok || result?.success === false) {
    const error = new Error(
      result?.message ||
        result?.error ||
        `Request failed with status ${response.status}.`
    );

    error.status = response.status;
    throw error;
  }

  return result;
}

// ==========================================
// RESORT OWNER API HELPERS
// ==========================================

// Authentication
export const ownerLogin = (creds) =>
  ownerApiRequest("owner/auth/login", {
    method: "POST",
    body: JSON.stringify(creds),
  });

export const ownerRegister = (data) =>
  ownerApiRequest("owner/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getOwnerMe = () => ownerApiRequest("owner/auth/me");

// Properties
export const getMyProperties = () =>
  ownerApiRequest("owner/properties");

export const createProperty = (data) =>
  ownerApiRequest("owner/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProperty = (id, data) =>
  ownerApiRequest(`owner/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const submitPropertyForReview = (id) =>
  ownerApiRequest(`owner/properties/${id}/submit`, {
    method: "POST",
  });

// Rooms
export const getPropertyRooms = (propertyId) =>
  ownerApiRequest(`owner/properties/${propertyId}/rooms`);

export const createPropertyRoom = (propertyId, data) =>
  ownerApiRequest(`owner/properties/${propertyId}/rooms`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Availability Calendar
export const getRoomAvailability = (
  propertyId,
  roomId,
  from,
  to
) =>
  ownerApiRequest(
    `owner/properties/${propertyId}/rooms/${roomId}/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );

export const upsertRoomAvailability = (
  propertyId,
  roomId,
  data
) =>
  ownerApiRequest(
    `owner/properties/${propertyId}/rooms/${roomId}/availability`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

// Bookings
export const getOwnerBookings = () =>
  ownerApiRequest("owner/bookings");