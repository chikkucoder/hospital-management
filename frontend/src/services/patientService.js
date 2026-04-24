import { apiRequest } from "./api";

export const patientService = {
  getAll: () => apiRequest("/patients"),
  getById: (id) => apiRequest(`/patients/${id}`),
  create: (data) => apiRequest("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
};
