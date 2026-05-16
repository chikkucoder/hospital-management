const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const AppError = require("../utils/AppError");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hospital/emr/lab-reports", // Folder in Cloudinary
    allowed_formats: ["pdf", "jpg", "jpeg", "png"], // Allowed file formats
    public_id: (req, file) => {
      // Generate unique public ID
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const originalName = file.originalname.split(".")[0];
      return `${originalName}_${timestamp}_${randomString}`;
    },
    resource_type: "auto", // Automatically detect resource type
    transformation: [
      {
        // Add transformations if needed
        quality: "auto:good",
      },
    ],
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type: ${file.mimetype}. Only PDF, JPEG, and PNG files are allowed.`, 400), false);
  }
};

// Multer configuration
const multer = require("multer");

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files per request
  },
  // Error handling
  fileLimit: (req, file, cb) => {
    if (req.files && req.files.length >= 10) {
      cb(new AppError("Maximum 10 files allowed per request", 400), false);
    } else {
      cb(null, true);
    }
  },
});

// Upload single file
const uploadSingle = upload.single("file");

// Upload multiple files
const uploadMultiple = upload.array("files", 10);

// Helper function to handle upload errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("File size exceeds 5MB limit", 400));
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return next(new AppError("Maximum 10 files allowed per request", 400));
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new AppError("Unexpected file field", 400));
    }
  }
  next(error);
};

// Get file info from Cloudinary response
const getFileInfo = (file) => {
  return {
    url: file.path, // Cloudinary URL
    publicId: file.filename, // Cloudinary public ID
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
  };
};

module.exports = {
  cloudinary,
  upload,
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  getFileInfo,
};
