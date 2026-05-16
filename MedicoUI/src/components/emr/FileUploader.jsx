import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image, File, Loader2, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { cn } from "../../lib/utils";

const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/dicom",
    "application/dicom",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(fileName) {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "dicom"].includes(ext)) return Image;
    if (["pdf"].includes(ext)) return FileText;
    return File;
}

export default function FileUploader({ files = [], onFilesChange, onRemove, isUploading = false, reportType, onReportTypeChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError(`File type "${file.type || "unknown"}" is not supported. Allowed: PDF, JPEG, PNG, DICOM, DOC`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError(`File "${file.name}" exceeds 50MB limit (${formatFileSize(file.size)})`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleFiles = useCallback(
        (newFiles) => {
            const validFiles = Array.from(newFiles).filter(validateFile);
            if (validFiles.length > 0) {
                onFilesChange([...files, ...validFiles]);
            }
        },
        [files, onFilesChange]
    );

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleInputChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = "";
    };

    const REPORT_CATEGORIES = [
        "Lab Report",
        "X-Ray / MRI Scan",
        "CT Scan",
        "Ultrasound",
        "Discharge Summary",
        "Vaccination Record",
        "Consent Form",
        "Prescription Copy",
        "Referral Letter",
        "Other Document",
    ];

    return (
        <div className="space-y-6">
            {/* Report Category Selector */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Report Category
                </label>
                <select
                    value={reportType}
                    onChange={(e) => onReportTypeChange?.(e.target.value)}
                    className="w-full h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-700"
                >
                    {REPORT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "relative border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 group",
                    isDragging
                        ? "border-blue-400 bg-blue-50/50 scale-[1.02] shadow-lg shadow-blue-500/10"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/20",
                    isUploading && "opacity-50 pointer-events-none"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
                    onChange={handleInputChange}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-sm font-bold text-blue-600">Uploading files...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                            <Upload className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-700">
                                Drag & drop files here
                            </p>
                            <p className="text-xs font-medium text-gray-400 mt-1">
                                or <span className="text-blue-500 font-bold">browse</span> to upload
                            </p>
                        </div>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            PDF, JPEG, PNG, DICOM • Max 50MB
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-xs font-bold text-red-600">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto p-1 text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        {files.length} file{files.length > 1 ? "s" : ""} selected
                    </p>
                    <div className="space-y-2">
                        {files.map((file, idx) => {
                            const Icon = getFileIcon(file.name);
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group hover:bg-blue-50/50 hover:border-blue-100 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {file.uploaded && (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove?.(idx);
                                            }}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}