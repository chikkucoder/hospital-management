import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ArrowLeftIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

// Components
import PatientSummaryPanel from "../../components/emr/PatientSummaryPanel";
import ConsultationForm from "../../components/emr/ConsultationForm";
import PrescriptionBuilder from "../../components/emr/PrescriptionBuilder";
import FileUploadSection from "../../components/emr/FileUploadSection";

// Hooks
import { useEMRData, useCreatePrescription, useUploadFile, useCreateLabReport } from "../../hooks/useEMRQueries";

// Create a client for this component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const EMRPageContent = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeSection, setActiveSection] = useState("consultation"); // consultation, prescription, files
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data fetching
  const { appointment, patient, prescriptions, isLoading, isError } = useEMRData(appointmentId);
  
  // Mutations
  const createPrescriptionMutation = useCreatePrescription();
  const uploadFileMutation = useUploadFile();
  const createLabReportMutation = useCreateLabReport();

  // Handle consultation form submission
  const handleConsultationSubmit = async (data) => {
    if (!appointment?.data || !patient?.data) {
      toast.error("Patient or appointment data not available");
      return;
    }

    setIsSubmitting(true);
    try {
      // First upload any files
      const uploadedFileUrls = [];
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          
          const uploadResult = await uploadFileMutation.mutateAsync(formData);
          uploadedFileUrls.push(uploadResult.url);
        }
      }

      // Create lab reports for uploaded files
      if (uploadedFileUrls.length > 0) {
        for (const fileUrl of uploadedFileUrls) {
          await createLabReportMutation.mutateAsync({
            patient: patient.data._id,
            appointment: appointment.data._id,
            test: "uploaded-document", // You might want to make this dynamic
            reportUrl: fileUrl,
            status: "completed",
          });
        }
      }

      toast.success("Consultation saved successfully");
      
      // Navigate back or to next step
      navigate(`/appointments/${appointmentId}`);
    } catch (error) {
      console.error("Error saving consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle prescription submission
  const handlePrescriptionSubmit = async (data) => {
    if (!appointment?.data || !patient?.data) {
      toast.error("Patient or appointment data not available");
      return;
    }

    setIsSubmitting(true);
    try {
      const prescriptionData = {
        ...data,
        patient: patient.data._id,
        doctor: appointment.data.doctor,
        appointment: appointment.data._id,
      };

      await createPrescriptionMutation.mutateAsync(prescriptionData);
      
      // Handle file uploads if any
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          
          const uploadResult = await uploadFileMutation.mutateAsync(formData);
          await createLabReportMutation.mutateAsync({
            patient: patient.data._id,
            appointment: appointment.data._id,
            test: "prescription-document",
            reportUrl: uploadResult.url,
            status: "completed",
          });
        }
      }

      toast.success("Prescription saved successfully");
      navigate(`/appointments/${appointmentId}`);
    } catch (error) {
      console.error("Error saving prescription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file changes
  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EMR data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <ClipboardDocumentListIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading EMR</h2>
          <p className="text-gray-600 mb-4">Unable to load patient or appointment data</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                EMR Consultation
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {patient?.data && (
                <div className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{patient.data.name}</span>
                </div>
              )}
              {appointment?.data && (
                <div className="text-sm text-gray-600">
                  Appointment: <span className="font-medium">
                    {new Date(appointment.data.scheduledAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Section Tabs for Mobile */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveSection("consultation")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeSection === "consultation"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Consultation
            </button>
            <button
              onClick={() => setActiveSection("prescription")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeSection === "prescription"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Prescription
            </button>
            <button
              onClick={() => setActiveSection("files")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeSection === "files"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Files
            </button>
          </div>
        </div>

        {/* Desktop Layout - 3 Panel */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Left Panel - Patient Summary */}
          <PatientSummaryPanel
            patient={patient?.data}
            prescriptions={prescriptions?.data?.prescriptions || []}
            isLoading={isLoading}
          />

          {/* Center Panel - Consultation Form */}
          <div className="lg:col-span-2">
            <ConsultationForm
              onSubmit={handleConsultationSubmit}
              isSubmitting={isSubmitting && activeSection === "consultation"}
            />
          </div>

          {/* Right Panel - Prescription Builder */}
          <PrescriptionBuilder
            onSubmit={handlePrescriptionSubmit}
            isSubmitting={isSubmitting && activeSection === "prescription"}
          />
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-6">
          {/* Patient Summary - Always visible on mobile */}
          <PatientSummaryPanel
            patient={patient?.data}
            prescriptions={prescriptions?.data?.prescriptions || []}
            isLoading={isLoading}
          />

          {/* Dynamic Content Based on Active Section */}
          {activeSection === "consultation" && (
            <ConsultationForm
              onSubmit={handleConsultationSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {activeSection === "prescription" && (
            <PrescriptionBuilder
              onSubmit={handlePrescriptionSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {activeSection === "files" && (
            <FileUploadSection
              onFilesChange={handleFilesChange}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
            />
          )}
        </div>

        {/* File Upload Section - Always visible on desktop, conditional on mobile */}
        <div className={`mt-6 ${activeSection === "files" ? "block lg:hidden" : "hidden lg:block"}`}>
          <FileUploadSection
            onFilesChange={handleFilesChange}
            uploadedFiles={uploadedFiles}
            onRemoveFile={handleRemoveFile}
          />
        </div>

        {/* Global Submit Status */}
        {isSubmitting && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component with QueryClientProvider
const EMRPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <EMRPageContent />
    </QueryClientProvider>
  );
};

export default EMRPage;
