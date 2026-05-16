const LabReport = require("../models/LabReport");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const LabTest = require("../models/LabTest");
const User = require("../models/User");
const AppError = require("../utils/AppError");

class LabReportService {
  /**
   * Create a new lab report
   * @param {Object} labReportData - Lab report data
   * @param {String} labReportData.patient - Patient ID
   * @param {String} labReportData.appointment - Appointment ID
   * @param {String} labReportData.test - Lab test ID
   * @param {String} labReportData.reportUrl - Report URL from Cloudinary
   * @param {String} labReportData.status - Status (pending/completed)
   * @param {String} labReportData.uploadedBy - User ID who uploaded
   * @returns {Promise<Object>} Created lab report
   */
  async createLabReport(labReportData) {
    const { patient, appointment, test, reportUrl, status = "pending", uploadedBy } = labReportData;

    // Validate required fields
    if (!patient || !appointment || !test || !reportUrl || !uploadedBy) {
      throw new AppError("Missing required fields: patient, appointment, test, reportUrl, uploadedBy", 400);
    }

    // Validate status
    if (!["pending", "in_progress", "completed"].includes(status)) {
      throw new AppError("Status must be either 'pending', 'in_progress', or 'completed'", 400);
    }

    // Verify patient exists
    const patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      throw new AppError("Patient not found", 404);
    }

    // Verify appointment exists and belongs to the patient
    const appointmentDoc = await Appointment.findById(appointment);
    if (!appointmentDoc) {
      throw new AppError("Appointment not found", 404);
    }

    if (appointmentDoc.patient.toString() !== patient) {
      throw new AppError("Appointment does not belong to the specified patient", 400);
    }

    // Verify lab test exists
    const labTestDoc = await LabTest.findById(test);
    if (!labTestDoc) {
      throw new AppError("Lab test not found", 404);
    }

    // Verify uploader exists
    const uploaderDoc = await User.findById(uploadedBy);
    if (!uploaderDoc) {
      throw new AppError("Uploader not found", 404);
    }

    // Create lab report
    const labReport = new LabReport({
      patient,
      appointment,
      test,
      reportUrl,
      status,
      uploadedBy,
    });

    await labReport.save();

    // Populate related data for response
    await labReport.populate([
      { path: "patient", select: "name age gender" },
      { path: "appointment", select: "scheduledAt" },
      { path: "test", select: "name category code" },
      { path: "uploadedBy", select: "name email role" },
    ]);

    return labReport;
  }

  /**
   * Get all lab reports for a patient
   * @param {String} patientId - Patient ID
   * @param {Object} options - Query options
   * @param {Number} options.page - Page number (default: 1)
   * @param {Number} options.limit - Limit per page (default: 10)
   * @param {String} options.sort - Sort field (default: createdAt)
   * @param {String} options.order - Sort order (default: desc)
   * @param {String} options.status - Filter by status (optional)
   * @returns {Promise<Object>} Lab reports with pagination
   */
  async getLabReportsByPatient(patientId, options = {}) {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc", status } = options;

    // Verify patient exists
    const patientDoc = await Patient.findById(patientId);
    if (!patientDoc) {
      throw new AppError("Patient not found", 404);
    }

    // Build query
    const query = { patient: patientId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };

    // Get lab reports
    const labReports = await LabReport.find(query)
      .populate("test", "name category code")
      .populate("uploadedBy", "name role")
      .populate("appointment", "scheduledAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await LabReport.countDocuments(query);

    return {
      labReports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get lab report by ID
   * @param {String} labReportId - Lab report ID
   * @returns {Promise<Object>} Lab report details
   */
  async getLabReportById(labReportId) {
    const labReport = await LabReport.findById(labReportId)
      .populate("patient", "name age gender phone")
      .populate("appointment", "scheduledAt")
      .populate("test", "name category code description normalRange")
      .populate("uploadedBy", "name email role");

    if (!labReport) {
      throw new AppError("Lab report not found", 404);
    }

    return labReport;
  }

  /**
   * Update lab report status
   * @param {String} labReportId - Lab report ID
   * @param {String} status - New status (pending/completed)
   * @returns {Promise<Object>} Updated lab report
   */
  async updateLabReportStatus(labReportId, status) {
    // Validate status
    if (!["pending", "in_progress", "completed"].includes(status)) {
      throw new AppError("Status must be either 'pending', 'in_progress', or 'completed'", 400);
    }

    const labReport = await LabReport.findById(labReportId);
    if (!labReport) {
      throw new AppError("Lab report not found", 404);
    }

    // Update status
    labReport.status = status;
    await labReport.save();

    // Populate related data for response
    await labReport.populate([
      { path: "patient", select: "name age gender" },
      { path: "test", select: "name category" },
      { path: "uploadedBy", select: "name role" },
    ]);

    return labReport;
  }

  /**
   * Get lab reports by uploader
   * @param {String} uploaderId - User ID who uploaded the reports
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Lab reports with pagination
   */
  async getLabReportsByUploader(uploaderId, options = {}) {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc", status } = options;

    // Verify uploader exists
    const uploaderDoc = await User.findById(uploaderId);
    if (!uploaderDoc) {
      throw new AppError("Uploader not found", 404);
    }

    // Build query
    const query = { uploadedBy: uploaderId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };

    // Get lab reports
    const labReports = await LabReport.find(query)
      .populate("patient", "name age gender")
      .populate("test", "name category")
      .populate("appointment", "scheduledAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await LabReport.countDocuments(query);

    return {
      labReports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Search lab reports
   * @param {Object} searchParams - Search parameters
   * @param {String} searchParams.patient - Patient ID (optional)
   * @param {String} searchParams.test - Lab test ID (optional)
   * @param {String} searchParams.uploadedBy - Uploader ID (optional)
   * @param {String} searchParams.status - Status filter (optional)
   * @param {Date} searchParams.dateFrom - Start date (optional)
   * @param {Date} searchParams.dateTo - End date (optional)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchLabReports(searchParams, options = {}) {
    const { patient, test, uploadedBy, status, dateFrom, dateTo } = searchParams;
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = options;

    // Build query
    const query = {};
    
    if (patient) query.patient = patient;
    if (test) query.test = test;
    if (uploadedBy) query.uploadedBy = uploadedBy;
    if (status) query.status = status;
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = dateFrom;
      if (dateTo) query.createdAt.$lte = dateTo;
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sort]: order === "desc" ? -1 : 1 };

    // Get lab reports
    const labReports = await LabReport.find(query)
      .populate("patient", "name age gender")
      .populate("test", "name category")
      .populate("uploadedBy", "name role")
      .populate("appointment", "scheduledAt")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await LabReport.countDocuments(query);

    return {
      labReports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      searchParams,
    };
  }

  /**
   * Get lab reports statistics
   * @param {Object} filters - Filter options
   * @param {String} filters.patient - Patient ID (optional)
   * @param {String} filters.uploadedBy - Uploader ID (optional)
   * @param {Date} filters.dateFrom - Start date (optional)
   * @param {Date} filters.dateTo - End date (optional)
   * @returns {Promise<Object>} Statistics
   */
  async getLabReportsStatistics(filters = {}) {
    const { patient, uploadedBy, dateFrom, dateTo } = filters;

    // Build match stage for aggregation
    const matchStage = {};
    if (patient) matchStage.patient = new mongoose.Types.ObjectId(patient);
    if (uploadedBy) matchStage.uploadedBy = new mongoose.Types.ObjectId(uploadedBy);
    
    // Date range filter
    if (dateFrom || dateTo) {
      matchStage.createdAt = {};
      if (dateFrom) matchStage.createdAt.$gte = dateFrom;
      if (dateTo) matchStage.createdAt.$lte = dateTo;
    }

    // Aggregation pipeline
    const pipeline = [];
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          pendingReports: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          completedReports: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
        }
      }
    );

    const result = await LabReport.aggregate(pipeline);
    const stats = result[0] || {
      totalReports: 0,
      pendingReports: 0,
      completedReports: 0,
    };

    return stats;
  }
}

module.exports = new LabReportService();
