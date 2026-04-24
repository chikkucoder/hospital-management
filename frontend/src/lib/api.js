// Backend API client. Configure VITE_API_URL in .env (default http://localhost:5000/api)
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "aarogya_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me"),

  // Patients
  listPatients: () => request("/patients"),
  // Appointments
  listAppointments: (patientId) =>
    request(`/appointments${patientId ? `?patient=${patientId}` : ""}`),
  // Services
  listServices: () => request("/services"),
  // Bills
  listBills: () => request("/bills"),
  getBill: (id) => request(`/bills/${id}`),
  createBill: (data) => request("/bills", { method: "POST", body: JSON.stringify(data) }),
  deleteBill: (id) => request(`/bills/${id}`, { method: "DELETE" }),
  payBill: (id, data) => request(`/bills/${id}/payments`, { method: "POST", body: JSON.stringify(data) }),

  // Reports
  reportSummary: (from, to) =>
    request(`/reports/summary${from || to ? `?from=${from || ""}&to=${to || ""}` : ""}`),
};
