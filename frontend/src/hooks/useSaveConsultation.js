import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

// Create axios instance for API calls
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

const useSaveConsultation = ({ 
  formData, 
  files = [], 
  patientId, 
  doctorId, 
  appointmentId,
  onSuccess,
  onError
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileProgress, setFileProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, index }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileProgress((prev) => ({
              ...prev,
              [index]: { progress, status: "uploading" },
            }));
          },
        });

        setFileProgress((prev) => ({
          ...prev,
          [index]: { progress: 100, status: "completed" },
        }));

        return response.data;
      } catch (error) {
        setFileProgress((prev) => ({
          ...prev,
          [index]: { progress: 0, status: "error", error: error.message },
        }));
        throw error;
      }
    },
    onError: (error, variables) => {
      const { index } = variables;
      setErrors((prev) => ({
        ...prev,
        [`file-${index}`]: `File upload failed: ${error.message}`,
      }));
    },
  });

  // Lab report creation mutation
  const createLabReportMutation = useMutation({
    mutationFn: async ({ fileUrl, fileName, index }) => {
      try {
        const response = await api.post("/lab-reports", {
          patient: patientId,
          appointment: appointmentId,
          test: "uploaded-document", // You might want to make this dynamic
          reportUrl: fileUrl,
          status: "pending",
          uploadedBy: doctorId,
        });

        return response.data;
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [`lab-report-${index}`]: `Lab report creation failed: ${error.message}`,
        }));
        throw error;
      }
    },
  });

  // Prescription creation mutation
  const createPrescriptionMutation = useMutation({
    mutationFn: async () => {
      try {
        const prescriptionData = {
          diagnosis: formData.diagnosis,
          symptoms: formData.symptoms || [],
          medicines: formData.medicines || [],
          notes: formData.notes || "",
          patient: patientId,
          doctor: doctorId,
          appointment: appointmentId,
        };

        const response = await api.post("/emr/prescriptions", prescriptionData);
        return response.data;
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          prescription: `Prescription creation failed: ${error.message}`,
        }));
        throw error;
      }
    },
  });

  // Appointment status update mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await api.put(`/appointments/${appointmentId}`, {
          status: "completed",
        });
        return response.data;
      } catch (error) {
        // Don't fail the entire flow if appointment update fails
        console.error("Failed to update appointment status:", error);
        return null;
      }
    },
  });

  // Retry failed file upload
  const retryFileUpload = async (index) => {
    const file = files[index];
    if (!file) return;

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`file-${index}`];
      delete newErrors[`lab-report-${index}`];
      return newErrors;
    });

    setFileProgress((prev) => ({
      ...prev,
      [index]: { progress: 0, status: "pending" },
    }));

    try {
      await uploadFileMutation.mutateAsync({ file, index });
      
      // If upload succeeded, create lab report
      const uploadedFile = uploadedFiles[index];
      if (uploadedFile) {
        await createLabReportMutation.mutateAsync({
          fileUrl: uploadedFile.url,
          fileName: uploadedFile.originalName,
          index,
        });
      }
    } catch (error) {
      // Error is already handled in the mutation
    }
  };

  // Main save function
  const save = async () => {
    // 1. Validate form data
    if (!formData.diagnosis || !formData.medicines || formData.medicines.length === 0) {
      toast.error("Please complete all required fields");
      setErrors({ form: "Diagnosis and at least one medicine are required" });
      return;
    }

    // 2. Set loading state
    setIsSaving(true);
    setErrors({});
    setUploadedFiles([]);

    try {
      // 3. Upload files (if any)
      let uploadedFileUrls = [];
      if (files.length > 0) {
        toast.loading("Uploading files...", { id: "upload-progress" });

        // Upload files sequentially
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          try {
            const uploadResult = await uploadFileMutation.mutateAsync({ file, index: i });
            
            // Store uploaded file info
            const fileInfo = {
              url: uploadResult.data.url,
              publicId: uploadResult.data.publicId,
              originalName: uploadResult.data.originalName,
              index: i,
            };
            
            setUploadedFiles((prev) => [...prev, fileInfo]);
            uploadedFileUrls.push(fileInfo);
            
            // Create lab report for this file
            await createLabReportMutation.mutateAsync({
              fileUrl: fileInfo.url,
              fileName: fileInfo.originalName,
              index: i,
            });
            
          } catch (error) {
            // Continue with other files if one fails
            console.error(`Failed to upload file ${i}:`, error);
          }
        }

        toast.dismiss("upload-progress");
        
        // Check if any files failed to upload
        const failedUploads = files.filter((_, index) => 
          fileProgress[index]?.status === "error"
        );
        
        if (failedUploads.length > 0) {
          toast.error(`${failedUploads.length} file(s) failed to upload`);
          setIsSaving(false);
          return;
        }
      }

      // 4. Create prescription
      toast.loading("Creating prescription...", { id: "prescription-progress" });
      
      const prescriptionResult = await createPrescriptionMutation.mutateAsync();
      toast.dismiss("prescription-progress");

      // 5. Update appointment status
      await updateAppointmentMutation.mutateAsync();

      // 6. Success
      toast.success("Consultation saved successfully!");
      setIsSaving(false);
      setErrors({});
      
      if (onSuccess) {
        onSuccess({
          prescription: prescriptionResult.data,
          uploadedFiles: uploadedFileUrls,
        });
      }

    } catch (error) {
      toast.dismiss("upload-progress");
      toast.dismiss("prescription-progress");
      
      // Handle different error scenarios
      if (errors.prescription) {
        // Prescription failed after files were uploaded
        toast.error("Files uploaded but prescription failed. Please retry.");
      } else {
        // General error
        toast.error("Failed to save consultation. Please try again.");
      }
      
      setIsSaving(false);
      
      if (onError) {
        onError(error);
      }
    }
  };

  // Cancel save operation
  const cancel = () => {
    setIsSaving(false);
    setErrors({});
    setFileProgress({});
    setUploadedFiles([]);
    toast.dismiss("upload-progress");
    toast.dismiss("prescription-progress");
  };

  return {
    save,
    cancel,
    isSaving,
    errors,
    fileProgress,
    uploadedFiles,
    retryFileUpload,
    hasFiles: files.length > 0,
    hasErrors: Object.keys(errors).length > 0,
    canRetry: files.some((_, index) => fileProgress[index]?.status === "error"),
  };
};

export default useSaveConsultation;
