export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("backendUrl:", backendUrl);

  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is missing.");
    return null;
  }

  let url;
  try {
    url = new URL(
      endpoint.replace(/^\//, ""),
      backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl
    ).toString();
    console.log("Constructed URL:", url);
  } catch (error) {
    console.error("Invalid base URL:", error);
    return null;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}