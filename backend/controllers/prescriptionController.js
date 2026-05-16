const prescriptionService = require("../services/prescriptionService");
const AppError = require("../utils/AppError");

class PrescriptionController {
  /**
   * Create a new prescription
   * POST /api/prescriptions
   */
  async createPrescription(req, res, next) {
    try {
      const prescriptionData = {
        ...req.body,
        doctor: req.user.id, // Get doctor ID from authenticated user
      };

      const prescription = await prescriptionService.createPrescription(prescriptionData);

      res.status(201).json({
        success: true,
        data: prescription,
        message: "Prescription created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all prescriptions for a patient
   * GET /api/prescriptions?patient=:id
   */
  async getPrescriptionsByPatient(req, res, next) {
    try {
      const { patient } = req.query;
      
      if (!patient) {
        return next(new AppError("Patient ID is required", 400));
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || "createdAt",
        order: req.query.order || "desc",
      };

      const result = await prescriptionService.getPrescriptionsByPatient(patient, options);

      res.status(200).json({
        success: true,
        data: result.prescriptions,
        pagination: result.pagination,
        message: "Prescriptions retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get prescription by ID
   * GET /api/prescriptions/:id
   */
  async getPrescriptionById(req, res, next) {
    try {
      const { id } = req.params;

      const prescription = await prescriptionService.getPrescriptionById(id);

      res.status(200).json({
        success: true,
        data: prescription,
        message: "Prescription retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get prescriptions by doctor
   * GET /api/prescriptions/doctor/my-prescriptions
   */
  async getPrescriptionsByDoctor(req, res, next) {
    try {
      const doctorId = req.user.id; // Get doctor ID from authenticated user

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || "createdAt",
        order: req.query.order || "desc",
      };

      const result = await prescriptionService.getPrescriptionsByDoctor(doctorId, options);

      res.status(200).json({
        success: true,
        data: result.prescriptions,
        pagination: result.pagination,
        message: "Prescriptions retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search prescriptions
   * POST /api/prescriptions/search
   */
  async searchPrescriptions(req, res, next) {
    try {
      const searchParams = req.body;
      
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || "createdAt",
        order: req.query.order || "desc",
      };

      const result = await prescriptionService.searchPrescriptions(searchParams, options);

      res.status(200).json({
        success: true,
        data: result.prescriptions,
        pagination: result.pagination,
        searchParams: result.searchParams,
        message: "Prescriptions search completed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrescriptionController();
