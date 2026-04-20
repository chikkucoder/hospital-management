import { apiRequest } from "./api";

export function fetchPatients() {
  return apiRequest("/api/patients");
}

export function createPatient(payload) {
  return apiRequest("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
