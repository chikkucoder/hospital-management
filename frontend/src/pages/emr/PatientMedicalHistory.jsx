import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { medicalRecordService, prescriptionService } from "../../services/emrService";

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    try {
      const response = await medicalRecordService.getPatientMedicalHistory(patientId);
      setMedicalHistory(response.data);
    } catch (error) {
      toast.error("Failed to fetch medical history");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!medicalHistory) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600">Unable to load patient medical history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {medicalHistory.patient.name}
              </h1>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Age:</span> {medicalHistory.patient.age}
                </div>
                <div>
                  <span className="font-medium">Gender:</span> {medicalHistory.patient.gender}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {medicalHistory.patient.phone}
                </div>
                <div>
                  <span className="font-medium">Address:</span> {medicalHistory.patient.address}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Visit</div>
              <div className="text-lg font-medium text-gray-900">
                {medicalHistory.summary.lastVisit
                  ? formatDate(medicalHistory.summary.lastVisit)
                  : "No visits recorded"}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium">Total Prescriptions</div>
              <div className="text-2xl font-bold text-blue-900">
                {medicalHistory.summary.totalPrescriptions}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">Medical Records</div>
              <div className="text-2xl font-bold text-green-900">
                {medicalHistory.summary.totalMedicalRecords}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium">Active Status</div>
              <div className="text-2xl font-bold text-purple-900">Active</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("prescriptions")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "prescriptions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Prescriptions ({medicalHistory.summary.totalPrescriptions})
              </button>
              <button
                onClick={() => setActiveTab("medical-records")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === "medical-records"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Medical Records ({medicalHistory.summary.totalMedicalRecords})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {medicalHistory.prescriptions.slice(0, 3).map((prescription) => (
                      <div key={prescription._id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">Prescription</div>
                            <div className="text-sm text-gray-600">{prescription.diagnosis}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Dr. {prescription.doctor.name} ({prescription.doctor.specialty})
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {formatDateTime(prescription.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {medicalHistory.medicalRecords.slice(0, 3).map((record) => (
                      <div key={record._id} className="border-l-4 border-green-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{record.title}</div>
                            <div className="text-sm text-gray-600">{record.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Dr. {record.doctor.name} ({record.doctor.specialty})
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {formatDateTime(record.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicalHistory.prescriptions.flatMap((prescription) =>
                      prescription.medicines.map((medicine, index) => (
                        <div key={`${prescription._id}-${index}`} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{medicine.name}</div>
                          <div className="text-sm text-gray-600">
                            {medicine.dosage} - {medicine.duration}
                          </div>
                          {medicine.instructions && (
                            <div className="text-xs text-gray-500 mt-1">{medicine.instructions}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                {medicalHistory.prescriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">No prescriptions found</div>
                  </div>
                ) : (
                  medicalHistory.prescriptions.map((prescription) => (
                    <div key={prescription._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Diagnosis</h4>
                          <p className="text-gray-700">{prescription.diagnosis}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {formatDateTime(prescription.createdAt)}
                        </div>
                      </div>

                      {prescription.symptoms && prescription.symptoms.length > 0 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Symptoms</h5>
                          <div className="flex flex-wrap gap-2">
                            {prescription.symptoms.map((symptom, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <h5 className="font-medium text-gray-900 mb-2">Medicines</h5>
                        <div className="space-y-2">
                          {prescription.medicines.map((medicine, index) => (
                            <div key={index} className="bg-gray-50 rounded p-2">
                              <div className="font-medium text-gray-900">{medicine.name}</div>
                              <div className="text-sm text-gray-600">
                                {medicine.dosage} - {medicine.duration}
                              </div>
                              {medicine.instructions && (
                                <div className="text-xs text-gray-500">{medicine.instructions}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.vitalSigns && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-2">Vital Signs</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {prescription.vitalSigns.bloodPressure && (
                              <div>
                                <span className="font-medium">BP:</span>{" "}
                                {prescription.vitalSigns.bloodPressure.systolic}/
                                {prescription.vitalSigns.bloodPressure.diastolic}
                              </div>
                            )}
                            {prescription.vitalSigns.heartRate && (
                              <div>
                                <span className="font-medium">HR:</span> {prescription.vitalSigns.heartRate}
                              </div>
                            )}
                            {prescription.vitalSigns.temperature && (
                              <div>
                                <span className="font-medium">Temp:</span>{" "}
                                {prescription.vitalSigns.temperature}°F
                              </div>
                            )}
                            {prescription.vitalSigns.weight && (
                              <div>
                                <span className="font-medium">Weight:</span> {prescription.vitalSigns.weight}kg
                              </div>
                            )}
                            {prescription.vitalSigns.height && (
                              <div>
                                <span className="font-medium">Height:</span> {prescription.vitalSigns.height}cm
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {prescription.notes && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Notes</h5>
                          <p className="text-gray-700 text-sm">{prescription.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          Dr. {prescription.doctor.name} ({prescription.doctor.specialty})
                        </div>
                        {prescription.followUpDate && (
                          <div>Follow-up: {formatDate(prescription.followUpDate)}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "medical-records" && (
              <div className="space-y-4">
                {medicalHistory.medicalRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">No medical records found</div>
                  </div>
                ) : (
                  medicalHistory.medicalRecords.map((record) => (
                    <div key={record._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{record.title}</h4>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {record.recordType.replace("_", " ").toUpperCase()}
                            </span>
                            {record.isConfidential && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                CONFIDENTIAL
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{record.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {formatDateTime(record.createdAt)}
                        </div>
                      </div>

                      {record.diagnosis && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Diagnosis</h5>
                          <div className="text-sm">
                            <div>
                              <span className="font-medium">Primary:</span> {record.diagnosis.primary}
                            </div>
                            {record.diagnosis.secondary && record.diagnosis.secondary.length > 0 && (
                              <div>
                                <span className="font-medium">Secondary:</span>{" "}
                                {record.diagnosis.secondary.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {record.treatment && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Treatment Plan</h5>
                          <p className="text-gray-700 text-sm">{record.treatment}</p>
                        </div>
                      )}

                      {record.clinicalNotes && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Clinical Notes</h5>
                          <p className="text-gray-700 text-sm">{record.clinicalNotes}</p>
                        </div>
                      )}

                      {record.attachments && record.attachments.length > 0 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-2">Attachments</h5>
                          <div className="space-y-2">
                            {record.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                <div className="flex items-center gap-2">
                                  <div className="text-blue-500">
                                    {attachment.fileType === "pdf" ? "📄" : "🖼️"}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {attachment.originalName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {(attachment.fileSize / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => window.open(attachment.fileUrl, "_blank")}
                                  className="text-blue-500 hover:text-blue-700 text-sm"
                                >
                                  View
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Dr. {record.doctor.name} ({record.doctor.specialty})
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
