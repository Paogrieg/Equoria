export const API_BASE = "http://localhost:8000/api";

export function getToken() {
  return localStorage.getItem("eq_token") || "";
}

export async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}