const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, PDFs, and documents are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder = "medical-records") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

// Process multiple file uploads
const processMultipleUploads = async (files, folder = "medical-records") => {
  const uploadPromises = files.map(async (file) => {
    const uploadResult = await uploadToCloudinary(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, folder);
    
    return {
      filename: file.originalname,
      originalName: file.originalname,
      fileUrl: uploadResult.url,
      fileType: file.mimetype,
      fileSize: uploadResult.size,
      uploadedAt: new Date(),
    };
  });

  return Promise.all(uploadPromises);
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  processMultipleUploads,
};
