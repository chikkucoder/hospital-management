import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { 
  CloudArrowUpIcon, 
  XMarkIcon, 
  DocumentIcon, 
  PhotoIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

// File validation
const validateFile = (file) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only PDF, JPEG, and PNG files are allowed.`
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`
    };
  }
  
  return { valid: true };
};

const FileUploadSection = ({ patientId, appointmentId, doctorId, onUploadComplete }) => {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Create axios instance for uploads
  const uploadAPI = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files);
    }
  }, [stagedFiles]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files);
    }
  }, [stagedFiles]);

  const handleFileSelection = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(" "));
      setTimeout(() => setError(""), 5000);
    }

    if (validFiles.length > 0) {
      const newStagedFiles = [...stagedFiles, ...validFiles];
      setStagedFiles(newStagedFiles);
      
      // Initialize upload status for new files
      const newStatus = {};
      const newProgress = {};
      validFiles.forEach(file => {
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        newStatus[fileId] = "pending";
        newProgress[fileId] = 0;
      });
      setUploadStatus(prev => ({ ...prev, ...newStatus }));
      setUploadProgress(prev => ({ ...prev, ...newProgress }));
    }
  };

  const removeFile = (index) => {
    const newFiles = stagedFiles.filter((_, i) => i !== index);
    setStagedFiles(newFiles);
    setError("");
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileId = (file) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <PhotoIcon className="h-8 w-8 text-green-500" />;
    } else if (fileType === "application/pdf") {
      return <DocumentIcon className="h-8 w-8 text-red-500" />;
    } else {
      return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const uploadSingleFile = async (file) => {
    const fileId = getFileId(file);
    
    try {
      // Upload file
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await uploadAPI.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      });

      const fileUrl = uploadResponse.data.url;

      // Create lab report
      await uploadAPI.post("/lab-reports", {
        patient: patientId,
        appointment: appointmentId,
        test: "uploaded-document",
        reportUrl: fileUrl,
        status: "pending",
        uploadedBy: doctorId
      });

      setUploadStatus(prev => ({ ...prev, [fileId]: "success" }));
      return fileUrl;

    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(prev => ({ ...prev, [fileId]: "error" }));
      throw error;
    }
  };

  const retryUpload = async (file) => {
    const fileId = getFileId(file);
    setUploadStatus(prev => ({ ...prev, [fileId]: "pending" }));
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    try {
      await uploadSingleFile(file);
    } catch (error) {
      // Error already handled in uploadSingleFile
    }
  };

  const uploadAllFiles = async () => {
    if (stagedFiles.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      const uploadPromises = stagedFiles.map(file => uploadSingleFile(file));
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results.filter(result => result.status === "fulfilled");
      const failed = results.filter(result => result.status === "rejected");

      if (successful.length > 0) {
        const urls = successful.map(result => result.value);
        onUploadComplete(urls);
      }

      if (failed.length > 0) {
        setError(`${failed.length} file(s) failed to upload. Please retry.`);
      }

    } catch (error) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileStatusIcon = (fileId) => {
    const status = uploadStatus[fileId];
    
    switch (status) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "error":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case "pending":
      case "uploading":
        return (
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
        <CloudArrowUpIcon className="h-5 w-5 text-blue-500" />
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isUploading ? "Uploading files..." : "Drop files here or click to browse"}
            </p>
            <p className="text-sm text-gray-500">
              PDF, JPG, PNG up to 5MB each
            </p>
          </div>
          {!isUploading && (
            <button
              type="button"
              onClick={openFileDialog}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Select Files
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Staged Files */}
      {stagedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Staged Files ({stagedFiles.length})
            </h4>
            <button
              onClick={uploadAllFiles}
              disabled={isUploading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isUploading ? "Uploading..." : "Upload All Files"}
            </button>
          </div>
          
          <div className="space-y-2">
            {stagedFiles.map((file, index) => {
              const fileId = getFileId(file);
              const progress = uploadProgress[fileId] || 0;
              const status = uploadStatus[fileId] || "pending";
              
              return (
                <div
                  key={fileId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                      
                      {/* Progress Bar */}
                      {(status === "pending" || status === "uploading") && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{progress}% uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getFileStatusIcon(fileId)}
                    
                    {status === "error" && (
                      <button
                        onClick={() => retryUpload(file)}
                        className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                        title="Retry upload"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {status === "pending" && !isUploading && (
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove file"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Upload Guidelines</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Supported formats: PDF, JPEG, PNG</li>
          <li>• Maximum file size: 5MB per file</li>
          <li>• Files are staged locally until you click "Upload All Files"</li>
          <li>• Each file creates a lab report entry</li>
          <li>• Ensure documents are clear and readable</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadSection;
