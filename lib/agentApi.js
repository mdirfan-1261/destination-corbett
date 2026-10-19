
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

export async function agentApiRequest(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const cleanPath = String(path).replace(/^\/+/, "");

  let response;

  try {
    response = await fetch(`${baseUrl}/${cleanPath}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    const error = new Error(
      "The server returned an invalid response. Please try again."
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
