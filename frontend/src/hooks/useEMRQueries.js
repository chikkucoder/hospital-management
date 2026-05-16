import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

// API base instance
const api = axios.create({
  baseURL: "/api",
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
const emrAPI = {
  // Patient APIs
  getPatient: (id) => api.get(`/patients/${id}`),
  
  // Appointment APIs
  getAppointment: (id) => api.get(`/appointments/${id}`),
  
  // Prescription APIs (EMR module)
  getPrescriptions: (params) => api.get("/emr/prescriptions", { params }),
  createPrescription: (data) => api.post("/emr/prescriptions", data),
  
  // Medical Record APIs (EMR module)
  getMedicalRecords: (params) => api.get("/emr/medical-records", { params }),
  createMedicalRecord: (data) => api.post("/emr/medical-records", data),
  
  // File Upload APIs
  uploadFile: (formData) => api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  
  // Lab Report APIs
  createLabReport: (data) => api.post("/lab-reports", data),
};

// Query hooks
export const usePatient = (patientId) => {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => emrAPI.getPatient(patientId),
    enabled: !!patientId,
    select: (response) => response.data,
    onError: (error) => {
      toast.error(`Failed to fetch patient: ${error.response?.data?.error?.message || error.message}`);
    },
  });
};

export const useAppointment = (appointmentId) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => emrAPI.getAppointment(appointmentId),
    enabled: !!appointmentId,
    select: (response) => response.data,
    onError: (error) => {
      toast.error(`Failed to fetch appointment: ${error.response?.data?.error?.message || error.message}`);
    },
  });
};

export const usePatientPrescriptions = (patientId) => {
  return useQuery({
    queryKey: ["prescriptions", patientId],
    queryFn: () => emrAPI.getPrescriptions({ patient: patientId }),
    enabled: !!patientId,
    select: (response) => response.data,
    onError: (error) => {
      toast.error(`Failed to fetch prescriptions: ${error.response?.data?.error?.message || error.message}`);
    },
  });
};

// Mutation hooks
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: emrAPI.createPrescription,
    onSuccess: (response) => {
      toast.success("Prescription saved successfully");
      queryClient.invalidateQueries(["prescriptions"]);
      return response.data;
    },
    onError: (error) => {
      toast.error(`Failed to save prescription: ${error.response?.data?.error?.message || error.message}`);
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: emrAPI.uploadFile,
    onSuccess: (response) => {
      toast.success("File uploaded successfully");
      return response.data;
    },
    onError: (error) => {
      toast.error(`Failed to upload file: ${error.response?.data?.error?.message || error.message}`);
    },
  });
};

export const useCreateLabReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: emrAPI.createLabReport,
    onSuccess: (response) => {
      toast.success("Lab report saved successfully");
      queryClient.invalidateQueries(["lab-reports"]);
      return response.data;
    },
    onError: (error) => {
      toast.error(`Failed to save lab report: ${error.response?.data?.error?.message || error.message}`);
    },
  });
};

// Combined hook for EMR page data
export const useEMRData = (appointmentId) => {
  const appointmentQuery = useAppointment(appointmentId);
  const patientId = appointmentQuery.data?.patient;
  
  const patientQuery = usePatient(patientId);
  const prescriptionsQuery = usePatientPrescriptions(patientId);
  
  return {
    appointment: appointmentQuery,
    patient: patientQuery,
    prescriptions: prescriptionsQuery,
    isLoading: appointmentQuery.isLoading || patientQuery.isLoading || prescriptionsQuery.isLoading,
    isError: appointmentQuery.isError || patientQuery.isError || prescriptionsQuery.isError,
    error: appointmentQuery.error || patientQuery.error || prescriptionsQuery.error,
  };
};
