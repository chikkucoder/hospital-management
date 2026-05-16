const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const AppError = require("../utils/AppError");

class PrescriptionService {
  /**
   * Create a new prescription
   * @param {Object} prescriptionData - Prescription data
   * @param {String} prescriptionData.patient - Patient ID
   * @param {String} prescriptionData.doctor - Doctor ID
   * @param {String} prescriptionData.appointment - Appointment ID
   * @param {String} prescriptionData.diagnosis - Diagnosis
   * @param {Array} prescriptionData.symptoms - Symptoms array
   * @param {Array} prescriptionData.medicines - Medicines array
   * @param {String} prescriptionData.notes - Optional notes
   * @returns {Promise<Object>} Created prescription
   */
  async createPrescription(prescriptionData) {
    const { patient, doctor, appointment, diagnosis, symptoms, medicines, notes } = prescriptionData;

    // Validate required fields
    if (!patient || !doctor || !appointment || !diagnosis || !medicines) {
      throw new AppError("Missing required fields: patient, doctor, appointment, diagnosis, medicines", 400);
    }

    // Validate medicines array
    if (!Array.isArray(medicines) || medicines.length === 0) {
      throw new AppError("At least one medicine is required", 400);
    }

    // Validate each medicine
    for (const medicine of medicines) {
      if (!medicine.name || !medicine.dosage || !medicine.duration) {
        throw new AppError("Each medicine must have name, dosage, and duration", 400);
      }
    }

    // Verify appointment exists and belongs to the patient and doctor
    const appointmentDoc = await Appointment.findById(appointment);
    if (!appointmentDoc) {
      throw new AppError("Appointment not found", 404);
    }

    // Verify patient exists
    const patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      throw new AppError("Patient not found", 404);
    }

    // Verify doctor exists
    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      throw new AppError("Doctor not found", 404);
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({ appointment });
    if (existingPrescription) {
      throw new AppError("Prescription already exists for this appointment", 400);
    }

    // Create prescription
    const prescription = new Prescription({
      patient,
      doctor,
      appointment,
      diagnosis,
      symptoms: symptoms || [],
      medicines,
      notes: notes || "",
    });

    await prescription.save();

    // Populate related data for response
    await prescription.populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "appointment", select: "scheduledAt" },
    ]);

    return prescription;
  }

  /**
   * Get all prescriptions for a patient
   * @param {String} patientId - Patient ID
   * @param {Object} options - Query options
   * @param {Number} options.page - Page number (default: 1)
   * @param {Number} options.limit - Limit per page (default: 10)
   * @param {String} options.sort - Sort field (default: createdAt)
   * @param {String} options.order - Sort order (default: desc)
   * @returns {Promise<Object>} Prescriptions with pagination
   */
  async getPrescriptionsByPatient(patientId, options = {}) {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = options;

    // Verify patient exists
    const patientDoc = await Patient.findById(patientId);
    if (!patientDoc) {
      throw new AppError("Patient not found", 404);
    }

    // Build query
    const query = { patient: patientId };
    const skip = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };

    // Get prescriptions
    const prescriptions = await Prescription.find(query)
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Prescription.countDocuments(query);

    return {
      prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get prescription by ID
   * @param {String} prescriptionId - Prescription ID
   * @returns {Promise<Object>} Prescription details
   */
  async getPrescriptionById(prescriptionId) {
    const prescription = await Prescription.findById(prescriptionId)
      .populate("patient", "name age gender phone")
      .populate("doctor", "name specialty qualification")
      .populate("appointment", "scheduledAt");

    if (!prescription) {
      throw new AppError("Prescription not found", 404);
    }

    return prescription;
  }

  /**
   * Get prescriptions by doctor
   * @param {String} doctorId - Doctor ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Prescriptions with pagination
   */
  async getPrescriptionsByDoctor(doctorId, options = {}) {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = options;

    // Verify doctor exists
    const doctorDoc = await Doctor.findById(doctorId);
    if (!doctorDoc) {
      throw new AppError("Doctor not found", 404);
    }

    // Build query
    const query = { doctor: doctorId };
    const skip = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };

    // Get prescriptions
    const prescriptions = await Prescription.find(query)
      .populate("patient", "name age gender")
      .populate("appointment", "scheduledAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Prescription.countDocuments(query);

    return {
      prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Search prescriptions
   * @param {Object} searchParams - Search parameters
   * @param {String} searchParams.patient - Patient ID (optional)
   * @param {String} searchParams.doctor - Doctor ID (optional)
   * @param {String} searchParams.diagnosis - Diagnosis search term (optional)
   * @param {Date} searchParams.dateFrom - Start date (optional)
   * @param {Date} searchParams.dateTo - End date (optional)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchPrescriptions(searchParams, options = {}) {
    const { patient, doctor, diagnosis, dateFrom, dateTo } = searchParams;
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = options;

    // Build query
    const query = {};
    
    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;
    if (diagnosis) {
      query.diagnosis = { $regex: diagnosis, $options: "i" };
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = dateFrom;
      if (dateTo) query.createdAt.$lte = dateTo;
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };

    // Get prescriptions
    const prescriptions = await Prescription.find(query)
      .populate("patient", "name age gender")
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Prescription.countDocuments(query);

    return {
      prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      searchParams,
    };
  }
}

module.exports = new PrescriptionService();
