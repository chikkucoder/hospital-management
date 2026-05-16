const { getFileInfo } = require("../config/cloudinary");
const AppError = require("../utils/AppError");

class UploadController {
  /**
   * Upload single file
   * POST /api/upload
   */
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return next(new AppError("No file provided", 400));
      }

      // Get file info from Cloudinary response
      const fileInfo = getFileInfo(req.file);

      res.status(200).json({
        success: true,
        data: {
          url: fileInfo.url,
          publicId: fileInfo.publicId,
          originalName: fileInfo.originalName,
          size: fileInfo.size,
          mimeType: fileInfo.mimeType,
        },
        message: "File uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple files
   * POST /api/upload/multiple
   */
  async uploadMultipleFiles(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return next(new AppError("No files provided", 400));
      }

      // Get file info for all uploaded files
      const uploadedFiles = req.files.map(file => getFileInfo(file));

      res.status(200).json({
        success: true,
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length,
        },
        message: "Files uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete file from Cloudinary
   * DELETE /api/upload/:publicId
   */
  async deleteFile(req, res, next) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return next(new AppError("Public ID is required", 400));
      }

      const { cloudinary } = require("../config/cloudinary");

      // Delete file from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "ok") {
        res.status(200).json({
          success: true,
          data: { publicId },
          message: "File deleted successfully",
        });
      } else {
        return next(new AppError("Failed to delete file", 500));
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get file info
   * GET /api/upload/info/:publicId
   */
  async getFileInfo(req, res, next) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return next(new AppError("Public ID is required", 400));
      }

      const { cloudinary } = require("../config/cloudinary");

      // Get file info from Cloudinary
      const result = await cloudinary.api.resource(publicId);

      res.status(200).json({
        success: true,
        data: {
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format,
          size: result.bytes,
          createdAt: result.created_at,
          resourceType: result.resource_type,
        },
        message: "File info retrieved successfully",
      });
    } catch (error) {
      if (error.http_code === 404) {
        return next(new AppError("File not found", 404));
      }
      next(error);
    }
  }
}

module.exports = new UploadController();
