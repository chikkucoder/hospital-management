const API_BASE = "/api/lab-reports";

const apiCall = async (url, options = {}) => {
  const token = JSON.parse(localStorage.getItem("medico_session") || "{}")?.token;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

// ─── Local fallback data ──────────────────────────────────────────
const getLocalLabReports = () => {
  try {
    return JSON.parse(localStorage.getItem("medico_lab_reports") || "[]");
  } catch {
    return [];
  }
};
const saveLocalLabReports = (data) => localStorage.setItem("medico_lab_reports", JSON.stringify(data));

// ─── Lab Reports CRUD ────────────────────────────────────────────
const getAllLabReports = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.patient) query.set("patient", params.patient);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    if (params.status) query.set("status", params.status);
    if (params.sort) query.set("sort", params.sort);
    if (params.order) query.set("order", params.order);
    return await apiCall(`${API_BASE}?${query.toString()}`);
  } catch {
    const reports = getLocalLabReports();
    return { success: true, data: reports, pagination: { currentPage: 1, totalPages: 1, totalReports: reports.length } };
  }
};

const getLabReportById = async (id) => {
  try {
    return await apiCall(`${API_BASE}/${id}`);
  } catch {
    const reports = getLocalLabReports();
    return { success: true, data: reports.find((r) => r.id === id || r._id === id) || null };
  }
};

const createLabReport = async (data) => {
  try {
    return await apiCall(API_BASE, { method: "POST", body: JSON.stringify(data) });
  } catch {
    const reports = getLocalLabReports();
    const record = {
      ...data,
      id: `LAB-${Date.now().toString(36).toUpperCase()}`,
      _id: `LAB-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: data.status || "pending",
    };
    reports.push(record);
    saveLocalLabReports(reports);
    return { success: true, data: record };
  }
};

const updateLabReportStatus = async (id, status) => {
  try {
    return await apiCall(`${API_BASE}/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
  } catch {
    const reports = getLocalLabReports();
    const idx = reports.findIndex((r) => r.id === id || r._id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      saveLocalLabReports(reports);
    }
    return { success: true, data: reports[idx] };
  }
};

const searchLabReports = async (searchParams, options = {}) => {
  try {
    const query = new URLSearchParams();
    if (options.page) query.set("page", options.page);
    if (options.limit) query.set("limit", options.limit);
    return await apiCall(`${API_BASE}/search?${query.toString()}`, {
      method: "POST",
      body: JSON.stringify(searchParams),
    });
  } catch {
    const reports = getLocalLabReports();
    let filtered = [...reports];
    if (searchParams.status) filtered = filtered.filter((r) => r.status === searchParams.status);
    if (searchParams.patient) filtered = filtered.filter((r) => r.patient === searchParams.patient || r.patientId === searchParams.patient);
    return { success: true, data: filtered, pagination: { currentPage: 1, totalPages: 1, totalReports: filtered.length } };
  }
};

const getLabReportsStatistics = async (filters = {}) => {
  try {
    const query = new URLSearchParams();
    if (filters.patient) query.set("patient", filters.patient);
    if (filters.dateFrom) query.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) query.set("dateTo", filters.dateTo);
    return await apiCall(`${API_BASE}/statistics?${query.toString()}`);
  } catch {
    const reports = getLocalLabReports();
    return {
      success: true,
      data: {
        totalReports: reports.length,
        pendingReports: reports.filter((r) => r.status === "pending").length,
        completedReports: reports.filter((r) => r.status === "completed").length,
        inProgressReports: reports.filter((r) => r.status === "in_progress").length,
      },
    };
  }
};

// ─── Upload with progress ────────────────────────────────────────
const uploadLabReport = async (formData, onProgress) => {
  try {
    const token = JSON.parse(localStorage.getItem("medico_session") || "{}")?.token;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/upload`);
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            reject(new Error(JSON.parse(xhr.responseText).message || "Upload failed"));
          } catch {
            reject(new Error("Upload failed"));
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  } catch {
    // Fallback: simulate upload
    const file = formData.get("file");
    const patientId = formData.get("patientId");
    const reportType = formData.get("type") || "General Report";
    const notes = formData.get("notes") || "";
    const status = formData.get("status") || "pending";
    const reports = getLocalLabReports();
    const record = {
      id: `LAB-${Date.now().toString(36).toUpperCase()}`,
      _id: `LAB-${Date.now().toString(36).toUpperCase()}`,
      patientId,
      patient: patientId,
      fileName: file?.name || "uploaded-file",
      fileUrl: file ? URL.createObjectURL(file) : "",
      type: reportType,
      notes,
      status,
      uploadedBy: JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Lab Staff",
      createdAt: new Date().toISOString(),
      fileSize: file?.size || 0,
    };
    reports.push(record);
    saveLocalLabReports(reports);
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (progress >= 100) {
          clearInterval(interval);
          onProgress(100);
        } else {
          onProgress(progress);
        }
      }, 200);
    }
    return { success: true, data: record };
  }
};

export const labService = {
  getAllLabReports,
  getLabReportById,
  createLabReport,
  updateLabReportStatus,
  searchLabReports,
  getLabReportsStatistics,
  uploadLabReport,
};

export default labService;