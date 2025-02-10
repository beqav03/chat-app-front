export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fullUrl = `${backendUrl}${url}`;
    
    const token = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Ensure Authorization header is always valid
    };
  
    const response = await fetch(fullUrl, { ...options, headers });
  
    if (response.status === 401) { // Token expired
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        return fetchWithAuth(url, options); // Retry request with new token
      } else {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
        return null;
      }
    }
  
    return response;
  };
  
  const refreshToken = async (): Promise<boolean> => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const oldToken = localStorage.getItem("token");
  
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: oldToken ? `Bearer ${oldToken}` : "" },
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      return true;
    }
  
    return false;
  };  