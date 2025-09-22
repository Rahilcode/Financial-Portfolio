export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("token");
}

export function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
