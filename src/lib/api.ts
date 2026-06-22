export let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

if (typeof window !== "undefined") {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    API_BASE_URL = envUrl;
    console.log("[DEV] NEXT_PUBLIC_API_URL dynamically loaded from env:", API_BASE_URL);
  } else {
    const hostname = window.location.hostname;
    if (
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      (hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.") ||
        hostname.endsWith(".local"))
    ) {
      API_BASE_URL = `http://${hostname}:4000/api/v1`;
      console.log("[DEV] Computed local network API URL:", API_BASE_URL);
    }
  }
}

export function handleAuthError(status: number): boolean {
  if (status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login?expired=true";
    return true;
  }
  return false;
}

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = typeof args[0] === "string" 
      ? args[0] 
      : args[0] instanceof Request 
      ? args[0].url 
      : "";
      
    if (!url.includes("/admin/login")) {
      handleAuthError(response.status);
    }
    return response;
  };
}
