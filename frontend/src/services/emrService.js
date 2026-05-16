import axios from "axios";

const API_BASE_URL = "/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Prescription Services
export const prescriptionService = {
  createPrescription: async (prescriptionData) => {
    const response = await api.post("/emr/prescriptions", prescriptionData);
    return response.data;
  },

  getPrescriptions: async (params = {}) => {
    const response = await api.get("/emr/prescriptions", { params });
    return response.data;
  },

  getPrescriptionById: async (id) => {
    const response = await api.get(`/emr/prescriptions/${id}`);
    return response.data;
  },

  updatePrescription: async (id, updates) => {
    const response = await api.put(`/emr/prescriptions/${id}`, updates);
    return response.data;
  },
};

// Medical Record Services
export const medicalRecordService = {
  createMedicalRecord: async (recordData) => {
    const response = await api.post("/emr/medical-records", recordData);
    return response.data;
  },

  getMedicalRecords: async (params = {}) => {
    const response = await api.get("/emr/medical-records", { params });
    return response.data;
  },

  getMedicalRecordById: async (id) => {
    const response = await api.get(`/emr/medical-records/${id}`);
    return response.data;
  },

  getPatientMedicalHistory: async (patientId, params = {}) => {
    const response = await api.get(`/emr/patients/${patientId}/medical-history`, {
      params,
    });
    return response.data;
  },
};

// Medicine Services
export const medicineService = {
  createMedicine: async (medicineData) => {
    const response = await api.post("/medicines", medicineData);
    return response.data;
  },

  getMedicines: async (params = {}) => {
    const response = await api.get("/medicines", { params });
    return response.data;
  },

  getMedicineById: async (id) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },

  updateMedicine: async (id, updates) => {
    const response = await api.put(`/medicines/${id}`, updates);
    return response.data;
  },

  updateStock: async (id, stockData) => {
    const response = await api.put(`/medicines/${id}/stock`, stockData);
    return response.data;
  },

  getLowStockMedicines: async () => {
    const response = await api.get("/medicines/low-stock/alerts");
    return response.data;
  },
};

// Lab Services
export const labService = {
  // Lab Tests
  createLabTest: async (testData) => {
    const response = await api.post("/lab-tests", testData);
    return response.data;
  },

  getLabTests: async (params = {}) => {
    const response = await api.get("/lab-tests", { params });
    return response.data;
  },

  getLabTestById: async (id) => {
    const response = await api.get(`/lab-tests/${id}`);
    return response.data;
  },

  // Lab Reports
  createLabReport: async (reportData) => {
    const response = await api.post("/lab-reports", reportData);
    return response.data;
  },

  getLabReports: async (params = {}) => {
    const response = await api.get("/lab-reports", { params });
    return response.data;
  },

  getLabReportById: async (id) => {
    const response = await api.get(`/lab-reports/${id}`);
    return response.data;
  },

  updateLabReportStatus: async (id, statusData) => {
    const response = await api.put(`/lab-reports/${id}/status`, statusData);
    return response.data;
  },

  getPatientLabReports: async (patientId, params = {}) => {
    const response = await api.get(`/patients/${patientId}/lab-reports`, {
      params,
    });
    return response.data;
  },
};

export default api;
