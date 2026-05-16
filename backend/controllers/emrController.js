const Prescription = require("../models/Prescription");
const MedicalRecord = require("../models/MedicalRecord");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Prescription Controllers
exports.createPrescription = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      diagnosis,
      symptoms,
      medicines,
      notes,
      vitalSigns,
      followUpDate,
    } = req.body;

    // Verify appointment exists and belongs to the patient and doctor
    const appointmentDoc = await Appointment.findById(appointment);
    if (!appointmentDoc) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Create prescription
    const prescription = new Prescription({
      patient,
      doctor,
      appointment,
      diagnosis,
      symptoms,
      medicines,
      notes,
      vitalSigns,
      followUpDate,
    });

    await prescription.save();

    // Populate related data for response
    await prescription.populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "appointment", select: "scheduledAt" },
    ]);

    res.status(201).json({
      success: true,
      data: prescription,
      message: "Prescription created successfully",
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Error creating prescription",
      error: error.message,
    });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const { patient, doctor, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (status) filter.status = status;

    const prescriptions = await Prescription.find(filter)
      .populate("patient", "name age gender")
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(filter);

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPrescriptions: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("patient", "name age gender phone address")
      .populate("doctor", "name specialty qualification")
      .populate("appointment", "scheduledAt");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching prescription",
      error: error.message,
    });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "appointment", select: "scheduledAt" },
    ]);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.json({
      success: true,
      data: prescription,
      message: "Prescription updated successfully",
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message,
    });
  }
};

// Medical Record Controllers
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      recordType,
      title,
      description,
      clinicalNotes,
      diagnosis,
      treatment,
      isConfidential,
    } = req.body;

    // Verify appointment exists
    const appointmentDoc = await Appointment.findById(appointment);
    if (!appointmentDoc) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const medicalRecord = new MedicalRecord({
      patient,
      doctor,
      appointment,
      recordType,
      title,
      description,
      clinicalNotes,
      diagnosis,
      treatment,
      isConfidential,
    });

    await medicalRecord.save();

    // Populate related data for response
    await medicalRecord.populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "appointment", select: "scheduledAt" },
    ]);

    res.status(201).json({
      success: true,
      data: medicalRecord,
      message: "Medical record created successfully",
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating medical record",
      error: error.message,
    });
  }
};

exports.getMedicalRecords = async (req, res) => {
  try {
    const { patient, doctor, recordType, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (recordType) filter.recordType = recordType;

    const medicalRecords = await MedicalRecord.find(filter)
      .populate("patient", "name age gender")
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        medicalRecords,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};

exports.getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await MedicalRecord.findById(id)
      .populate("patient", "name age gender phone address")
      .populate("doctor", "name specialty qualification")
      .populate("appointment", "scheduledAt");

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    res.json({
      success: true,
      data: medicalRecord,
    });
  } catch (error) {
    console.error("Error fetching medical record:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medical record",
      error: error.message,
    });
  }
};

exports.getPatientMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Get all prescriptions for the patient
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort({ createdAt: -1 });

    // Get all medical records for the patient
    const medicalRecords = await MedicalRecord.find({ patient: patientId })
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort({ createdAt: -1 });

    // Get patient information
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      data: {
        patient,
        prescriptions,
        medicalRecords,
        summary: {
          totalPrescriptions: prescriptions.length,
          totalMedicalRecords: medicalRecords.length,
          lastVisit: prescriptions.length > 0 ? prescriptions[0].createdAt : null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching patient medical history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient medical history",
      error: error.message,
    });
  }
};
