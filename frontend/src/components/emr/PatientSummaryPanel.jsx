import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronRightIcon, UserIcon, PhoneIcon, CalendarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { prescriptionService } from "../../services/emrService";
import api from "../../services/emrService";

const PatientSummaryPanel = ({ patientId }) => {
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  // Fetch patient data via the API service
  const { data: patient, isLoading: patientLoading, error: patientError } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    },
    enabled: !!patientId,
  });

  // Fetch prescriptions/history via the prescription service
  const { data: prescriptionsData, isLoading: prescriptionsLoading, error: prescriptionsError } = useQuery({
    queryKey: ["prescriptions", patientId],
    queryFn: async () => {
      const response = await prescriptionService.getPrescriptions({ patient: patientId });
      return response.data?.prescriptions || [];
    },
    enabled: !!patientId,
  });

  const isLoading = patientLoading || prescriptionsLoading;
  const isError = patientError || prescriptionsError;

  const toggleAppointment = (appointmentId) => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Skeleton loader for patient details
  const PatientSkeleton = () => (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  );

  // Skeleton loader for appointment history
  const HistorySkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  if (isError) {
    return (
      <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-500">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-red-400 mb-2" />
          <p className="text-sm font-medium">Error loading patient data</p>
          <p className="text-xs mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Patient Details Card */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient info</h3>

        {patientLoading ? (
          <PatientSkeleton />
        ) : patient ? (
          <div className="space-y-4">
            {/* Name and Patient ID */}
            <div>
              <h4 className="text-xl font-bold text-gray-900">{patient.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                {patient.patientId && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ID: {patient.patientId}
                  </span>
                )}
              </div>
            </div>

            {/* Age, Gender, Blood Group */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-600">
                {patient.age} years, {patient.gender}
              </span>
              {patient.bloodGroup && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {patient.bloodGroup}
                </span>
              )}
            </div>

            {/* Emergency Contact */}
            {patient.emergencyContact && (
              <div className="flex items-center space-x-2 text-sm">
                <PhoneIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Emergency Contact</p>
                  <p className="font-medium text-gray-900">{patient.emergencyContact}</p>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="space-y-2 text-sm">
              {patient.phone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Phone: </span>
                  <span className="font-medium text-gray-900">{patient.phone}</span>
                </div>
              )}
              {patient.address && (
                <div className="text-gray-600">
                  <span className="font-medium">Address: </span>
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>Patient information not available</p>
          </div>
        )}
      </div>

      {/* Appointment History */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>

        <div className="space-y-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {prescriptionsLoading ? (
            <HistorySkeleton />
          ) : prescriptionsData && prescriptionsData.length > 0 ? (
            prescriptionsData.map((prescription) => (
              <div key={prescription._id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleAppointment(prescription._id)}
                  className="w-full px-3 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {expandedAppointment === prescription._id ? (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatDate(prescription.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Dr. {prescription.doctor?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {prescription.medicines?.length || 0} meds
                  </span>
                </button>

                {expandedAppointment === prescription._id && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <div className="pt-3 space-y-3">
                      {/* Full Diagnosis */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Diagnosis</p>
                        <p className="text-sm text-gray-600">{prescription.diagnosis}</p>
                      </div>

                      {/* Symptoms List */}
                      {prescription.symptoms && prescription.symptoms.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Symptoms</p>
                          <div className="flex flex-wrap gap-1">
                            {prescription.symptoms.map((symptom, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medicines List */}
                      {prescription.medicines && prescription.medicines.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Medicines</p>
                          <div className="space-y-1">
                            {prescription.medicines.map((medicine, index) => (
                              <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1.5">
                                <span className="font-medium">{medicine.name}</span>
                                <span className="ml-1">- {medicine.dosage} ({medicine.duration})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {prescription.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                          <p className="text-xs text-gray-600">{prescription.notes}</p>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {formatDateTime(prescription.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium">No past visits</p>
              <p className="text-xs mt-1">Patient has no previous appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryPanel;
