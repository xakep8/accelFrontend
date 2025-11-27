/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("accessToken");
}

/**
 * Set the authentication token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

/**
 * Remove the authentication token (logout)
 */
export function clearAuthToken(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function refreshAuthToken(
  providedRefreshToken?: string
): Promise<boolean> {
  const tokenToUse = providedRefreshToken;
  if (!tokenToUse) return false;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh-tokens`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokenToUse }),
      }
    );

    if (!response.ok) return false;

    const data = await response.json();
    const newAccess = data?.access?.token;
    const newRefresh = data?.refresh?.token;

    if (newAccess) setAuthToken(newAccess);
    if (newRefresh) localStorage.setItem("refreshToken", newRefresh);

    return true;
  } catch (error) {
    console.error("Error refreshing auth token:", error);
    return false;
  }
}

const buildHeaders = (tkn?: string, opts: RequestInit = {}) => {
  const headers = new Headers(opts.headers);
  if (tkn) headers.set("Authorization", `Bearer ${tkn}`);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
};

/**
 * Make an authenticated fetch request with Authorization bearer token
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ensure we have a token; if missing, try refresh first
  let token = getAuthToken();
  if (!token) {
    const refreshed = await refreshAuthToken();
    if (refreshed) token = getAuthToken();
  }

  let response = await fetch(url, {
    ...options,
    headers: buildHeaders(token ?? undefined, options),
  });

  // On 401, attempt a single refresh then retry once
  if (response.status === 401) {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      const newToken = getAuthToken();
      response = await fetch(url, {
        ...options,
        headers: buildHeaders(newToken ?? undefined, options),
      });
    }
    // If still unauthorized or refresh failed, clear tokens
    if (!response.ok) {
      clearAuthToken();
    }
  }

  return response;
}
