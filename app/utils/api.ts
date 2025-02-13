export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  console.log("Using API URL:", process.env.NEXT_PUBLIC_BACKEND_URL); // ✅ Debug log

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is missing. Check AWS Amplify settings.");
    return null;
  }

  const url = new URL(
    endpoint.replace(/^\//, ""), // Remove leading slash from endpoint
    backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl // Ensure no trailing slash
  ).toString();

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
  });
}