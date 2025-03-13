export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  
  console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);

  if (!backendUrl) {
    console.error("NEXT_PUBLIC_API_URL is missing.");
    return null;
  }

  console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);


  const url = new URL(
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
    backendUrl
  ).toString();

  console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);


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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}