const AUTH_KEY = "finly-session";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(AUTH_KEY);
}

export function login(username: string) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ username, ts: Date.now() })
  );
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}


