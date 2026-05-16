const API_BASE = "/api";

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

// ==================== Prescription Service ====================

export const prescriptionService = {
  createPrescription: async (data) => {
    return apiRequest("/emr/prescriptions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getPrescriptions: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/prescriptions${query ? `?${query}` : ""}`);
  },

  getPrescriptionById: async (id) => {
    return apiRequest(`/emr/prescriptions/${id}`);
  },

  updatePrescription: async (id, data) => {
    return apiRequest(`/emr/prescriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==================== Medical Record Service ====================

export const medicalRecordService = {
  createMedicalRecord: async (data) => {
    return apiRequest("/emr/medical-records", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMedicalRecords: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/medical-records${query ? `?${query}` : ""}`);
  },

  getMedicalRecordById: async (id) => {
    return apiRequest(`/emr/medical-records/${id}`);
  },

  getPatientMedicalHistory: async (patientId) => {
    return apiRequest(`/emr/patients/${patientId}/medical-history`);
  },
};

// ==================== Patient Service ====================

export const patientService = {
  getPatients: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/patients${query ? `?${query}` : ""}`);
  },

  getPatientById: async (id) => {
    return apiRequest(`/patients/${id}`);
  },

  searchPatients: async (query) => {
    return apiRequest(`/emr/patients/search?q=${encodeURIComponent(query)}`);
  },
};

// ==================== Appointment Service ====================

export const appointmentService = {
  getAppointments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/appointments${query ? `?${query}` : ""}`);
  },

  getAppointmentById: async (id) => {
    return apiRequest(`/appointments/${id}`);
  },

  updateAppointment: async (id, data) => {
    return apiRequest(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==================== Doctor Service ====================

export const doctorService = {
  getDoctors: async () => {
    return apiRequest("/doctors");
  },

  getDoctorById: async (id) => {
    return apiRequest(`/doctors/${id}`);
  },
};

// ==================== Medicine Database Service ====================

export const medicineService = {
  searchMedicines: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/medicines${query ? `?${query}` : ""}`);
  },

  getMedicineById: async (id) => {
    return apiRequest(`/emr/medicines/${id}`);
  },
};

// ==================== Lab Test Service ====================

export const labTestService = {
  getCatalog: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/lab-tests/catalog${query ? `?${query}` : ""}`);
  },

  createOrders: async (data) => {
    return apiRequest("/emr/lab-tests/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/lab-tests/orders${query ? `?${query}` : ""}`);
  },

  updateOrder: async (id, data) => {
    return apiRequest(`/emr/lab-tests/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==================== File Upload Service ====================

export const fileUploadService = {
  uploadFile: async (data) => {
    return apiRequest("/emr/files/upload", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getFiles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/files${query ? `?${query}` : ""}`);
  },

  getFileById: async (id) => {
    return apiRequest(`/emr/files/${id}`);
  },

  deleteFile: async (id) => {
    return apiRequest(`/emr/files/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== Allergy Service ====================

export const allergyService = {
  getAllergies: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/allergies${query ? `?${query}` : ""}`);
  },

  addAllergy: async (data) => {
    return apiRequest("/emr/allergies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  removeAllergy: async (id) => {
    return apiRequest(`/emr/allergies/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== Drug Interaction Service ====================

export const drugInteractionService = {
  checkInteractions: async (medicines) => {
    return apiRequest("/emr/drug-interactions/check", {
      method: "POST",
      body: JSON.stringify({ medicines }),
    });
  },
};

// ==================== Vital Signs Service ====================

export const vitalSignsService = {
  recordVitalSigns: async (data) => {
    return apiRequest("/emr/vital-signs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getVitalSignsHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/emr/vital-signs${query ? `?${query}` : ""}`);
  },
};