const labReportService = require("../services/labReportService");
const AppError = require("../utils/AppError");

class LabReportController {
  /**
   * Create a new lab report
   * POST /api/lab-reports
   */
  async createLabReport(req, res, next) {
    try {
      const labReportData = {
        ...req.body,
        uploadedBy: req.user.id, // Get uploader ID from authenticated user
      };

      const labReport = await labReportService.createLabReport(labReportData);

      res.status(201).json({
        success: true,
        data: labReport,
        message: "Lab report created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all lab reports for a patient
   * GET /api/lab-reports?patient=:id
   */
  async getLabReportsByPatient(req, res, next) {
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
        status: req.query.status,
      };

      const result = await labReportService.getLabReportsByPatient(patient, options);

      res.status(200).json({
        success: true,
        data: result.labReports,
        pagination: result.pagination,
        message: "Lab reports retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab report by ID
   * GET /api/lab-reports/:id
   */
  async getLabReportById(req, res, next) {
    try {
      const { id } = req.params;

      const labReport = await labReportService.getLabReportById(id);

      res.status(200).json({
        success: true,
        data: labReport,
        message: "Lab report retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update lab report status
   * PUT /api/lab-reports/:id/status
   */
  async updateLabReportStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return next(new AppError("Status is required", 400));
      }

      const labReport = await labReportService.updateLabReportStatus(id, status);

      res.status(200).json({
        success: true,
        data: labReport,
        message: "Lab report status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab reports by uploader
   * GET /api/lab-reports/my-uploads
   */
  async getLabReportsByUploader(req, res, next) {
    try {
      const uploaderId = req.user.id; // Get uploader ID from authenticated user

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || "createdAt",
        order: req.query.order || "desc",
        status: req.query.status,
      };

      const result = await labReportService.getLabReportsByUploader(uploaderId, options);

      res.status(200).json({
        success: true,
        data: result.labReports,
        pagination: result.pagination,
        message: "Lab reports retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search lab reports
   * POST /api/lab-reports/search
   */
  async searchLabReports(req, res, next) {
    try {
      const searchParams = req.body;
      
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || "createdAt",
        order: req.query.order || "desc",
      };

      const result = await labReportService.searchLabReports(searchParams, options);

      res.status(200).json({
        success: true,
        data: result.labReports,
        pagination: result.pagination,
        searchParams: result.searchParams,
        message: "Lab reports search completed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get lab reports statistics
   * GET /api/lab-reports/statistics
   */
  async getLabReportsStatistics(req, res, next) {
    try {
      const filters = {
        patient: req.query.patient,
        uploadedBy: req.user.id, // Default to current user
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo) : undefined,
      };

      const stats = await labReportService.getLabReportsStatistics(filters);

      res.status(200).json({
        success: true,
        data: stats,
        message: "Lab reports statistics retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LabReportController();
