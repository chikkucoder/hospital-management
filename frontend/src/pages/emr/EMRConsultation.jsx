import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { prescriptionService, medicalRecordService } from "../../services/emrService";
import api from "../../services/emrService";

const EMRConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("prescription");

  // Patient and appointment data (would be fetched based on appointmentId)
  const [appointment, setAppointment] = useState(null);

  // Prescription form state
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    symptoms: [],
    medicines: [{ name: "", dosage: "", duration: "", instructions: "" }],
    notes: "",
    vitalSigns: {
      bloodPressure: { systolic: "", diastolic: "" },
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
    },
    followUpDate: "",
  });

  // Medical record form state
  const [medicalRecordForm, setMedicalRecordForm] = useState({
    recordType: "consultation",
    title: "",
    description: "",
    clinicalNotes: "",
    diagnosis: { primary: "", secondary: [] },
    treatment: "",
    isConfidential: false,
  });

  // Symptom input
  const [symptomInput, setSymptomInput] = useState("");
  const [secondaryDiagnosisInput, setSecondaryDiagnosisInput] = useState("");

  useEffect(() => {
    // Fetch appointment details
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      const appointmentData = response.data?.data || response.data;
      setAppointment(appointmentData);
    } catch (error) {
      toast.error("Failed to fetch appointment details");
      console.error("Error fetching appointment:", error);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: updatedMedicines,
    });
  };

  const addMedicine = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [
        ...prescriptionForm.medicines,
        { name: "", dosage: "", duration: "", instructions: "" },
      ],
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: updatedMedicines,
    });
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setPrescriptionForm({
        ...prescriptionForm,
        symptoms: [...prescriptionForm.symptoms, symptomInput.trim()],
      });
      setSymptomInput("");
    }
  };

  const removeSymptom = (index) => {
    const updatedSymptoms = prescriptionForm.symptoms.filter((_, i) => i !== index);
    setPrescriptionForm({
      ...prescriptionForm,
      symptoms: updatedSymptoms,
    });
  };

  const addSecondaryDiagnosis = () => {
    if (secondaryDiagnosisInput.trim()) {
      setMedicalRecordForm({
        ...medicalRecordForm,
        diagnosis: {
          ...medicalRecordForm.diagnosis,
          secondary: [...medicalRecordForm.diagnosis.secondary, secondaryDiagnosisInput.trim()],
        },
      });
      setSecondaryDiagnosisInput("");
    }
  };

  const removeSecondaryDiagnosis = (index) => {
    const updatedSecondary = medicalRecordForm.diagnosis.secondary.filter((_, i) => i !== index);
    setMedicalRecordForm({
      ...medicalRecordForm,
      diagnosis: {
        ...medicalRecordForm.diagnosis,
        secondary: updatedSecondary,
      },
    });
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!appointment) return;

    setLoading(true);
    try {
      const prescriptionData = {
        ...prescriptionForm,
        patient: appointment.patient.id,
        doctor: appointment.doctor.id,
        appointment: appointment.id,
      };

      await prescriptionService.createPrescription(prescriptionData);
      toast.success("Prescription created successfully");
      navigate(`/appointments/${appointmentId}`);
    } catch (error) {
      toast.error("Failed to create prescription");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMedicalRecordSubmit = async (e) => {
    e.preventDefault();
    if (!appointment) return;

    setLoading(true);
    try {
      const recordData = {
        ...medicalRecordForm,
        patient: appointment.patient.id,
        doctor: appointment.doctor.id,
        appointment: appointment.id,
      };

      await medicalRecordService.createMedicalRecord(recordData);
      toast.success("Medical record created successfully");
      navigate(`/appointments/${appointmentId}`);
    } catch (error) {
      toast.error("Failed to create medical record");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EMR Consultation</h1>
              <p className="text-gray-600 mt-1">
                Patient: {appointment.patient.name} | Age: {appointment.patient.age} |
                Gender: {appointment.patient.gender}
              </p>
            </div>
            <button
              onClick={() => navigate(`/appointments/${appointmentId}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back to Appointment
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("prescription")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === "prescription"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Prescription
              </button>
              <button
                onClick={() => setActiveTab("medical-record")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === "medical-record"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Medical Record
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "prescription" && (
              <form onSubmit={handlePrescriptionSubmit} className="space-y-6">
                {/* Vital Signs */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Blood Pressure (Systolic)
                      </label>
                      <input
                        type="number"
                        value={prescriptionForm.vitalSigns.bloodPressure.systolic}
                        onChange={(e) =>
                          setPrescriptionForm({
                            ...prescriptionForm,
                            vitalSigns: {
                              ...prescriptionForm.vitalSigns,
                              bloodPressure: {
                                ...prescriptionForm.vitalSigns.bloodPressure,
                                systolic: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Blood Pressure (Diastolic)
                      </label>
                      <input
                        type="number"
                        value={prescriptionForm.vitalSigns.bloodPressure.diastolic}
                        onChange={(e) =>
                          setPrescriptionForm({
                            ...prescriptionForm,
                            vitalSigns: {
                              ...prescriptionForm.vitalSigns,
                              bloodPressure: {
                                ...prescriptionForm.vitalSigns.bloodPressure,
                                diastolic: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
                      <input
                        type="number"
                        value={prescriptionForm.vitalSigns.heartRate}
                        onChange={(e) =>
                          setPrescriptionForm({
                            ...prescriptionForm,
                            vitalSigns: {
                              ...prescriptionForm.vitalSigns,
                              heartRate: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={prescriptionForm.vitalSigns.temperature}
                        onChange={(e) =>
                          setPrescriptionForm({
                            ...prescriptionForm,
                            vitalSigns: {
                              ...prescriptionForm.vitalSigns,
                              temperature: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                      <input
                        type="number"
                        value={prescriptionForm.vitalSigns.weight}
                        onChange={(e) =>
                          setPrescriptionForm({
                            ...prescriptionForm,
                            vitalSigns: {
                              ...prescriptionForm.vitalSigns,
                              weight: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                      <input
                        type="number"
                        value={prescriptionForm.vitalSigns.height}
                        onChange={(e) =>
                          setPrescriptionForm({
                            ...prescriptionForm,
                            vitalSigns: {
                              ...prescriptionForm.vitalSigns,
                              height: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSymptom())}
                      placeholder="Enter symptom"
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSymptom}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prescriptionForm.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                  <textarea
                    value={prescriptionForm.diagnosis}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })
                    }
                    rows={3}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Medicines */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                  {prescriptionForm.medicines.map((medicine, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={medicine.name}
                        onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                        required
                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                        required
                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={medicine.duration}
                        onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                        required
                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Instructions"
                        value={medicine.instructions}
                        onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Medicine
                  </button>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={prescriptionForm.notes}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Follow-up Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                  <input
                    type="date"
                    value={prescriptionForm.followUpDate}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, followUpDate: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Prescription"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "medical-record" && (
              <form onSubmit={handleMedicalRecordSubmit} className="space-y-6">
                {/* Record Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Record Type</label>
                  <select
                    value={medicalRecordForm.recordType}
                    onChange={(e) =>
                      setMedicalRecordForm({ ...medicalRecordForm, recordType: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="lab_report">Lab Report</option>
                    <option value="imaging">Imaging</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="follow_up">Follow Up</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={medicalRecordForm.title}
                    onChange={(e) =>
                      setMedicalRecordForm({ ...medicalRecordForm, title: e.target.value })
                    }
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={medicalRecordForm.description}
                    onChange={(e) =>
                      setMedicalRecordForm({ ...medicalRecordForm, description: e.target.value })
                    }
                    rows={4}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Diagnosis</label>
                  <input
                    type="text"
                    value={medicalRecordForm.diagnosis.primary}
                    onChange={(e) =>
                      setMedicalRecordForm({
                        ...medicalRecordForm,
                        diagnosis: { ...medicalRecordForm.diagnosis, primary: e.target.value },
                      })
                    }
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Diagnosis</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={secondaryDiagnosisInput}
                      onChange={(e) => setSecondaryDiagnosisInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSecondaryDiagnosis())}
                      placeholder="Enter secondary diagnosis"
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSecondaryDiagnosis}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medicalRecordForm.diagnosis.secondary.map((diagnosis, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {diagnosis}
                        <button
                          type="button"
                          onClick={() => removeSecondaryDiagnosis(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
                  <textarea
                    value={medicalRecordForm.treatment}
                    onChange={(e) =>
                      setMedicalRecordForm({ ...medicalRecordForm, treatment: e.target.value })
                    }
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Clinical Notes</label>
                  <textarea
                    value={medicalRecordForm.clinicalNotes}
                    onChange={(e) =>
                      setMedicalRecordForm({ ...medicalRecordForm, clinicalNotes: e.target.value })
                    }
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Confidential */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={medicalRecordForm.isConfidential}
                    onChange={(e) =>
                      setMedicalRecordForm({ ...medicalRecordForm, isConfidential: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Mark as confidential</label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Medical Record"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMRConsultation;
