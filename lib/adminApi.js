const configuredUrl = process.env.NEXT_PUBLIC_API_URL;

function getApiBaseUrl() {
  const base = (configuredUrl && configuredUrl.trim()) || "http://localhost:5000";
  const clean = base.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
}

export async function adminApiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const cleanPath = String(path).replace(/^\/+/, "");

  let token = null;
  if (typeof window !== "undefined") {
    token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("destin_admin_token") ||
      localStorage.getItem("admin_token") ||
      null;
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}/${cleanPath}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Backend server se connect nahi ho pa raha. Check karein ki Backend port 5000 par running hai.");
  }

  const contentType = response.headers.get("content-type") || "";
  let result;

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    throw new Error(`Server returned HTML error (${response.status}). Endpoint sahi se load nahi hua.`);
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || `Request failed with status ${response.status}`);
  }

  return result;
}