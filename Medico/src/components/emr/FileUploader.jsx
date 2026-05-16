import { useState, useRef } from "react";
import { Upload, X, FileText, Image, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { fileUploadService } from "../../services/emrService";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/dicom",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/")) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
};

const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileUploader({ patientId, appointmentId, onUploadComplete }) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [category, setCategory] = useState("other");
    const [description, setDescription] = useState("");
    const fileInputRef = useRef(null);

    const handleFileSelection = (selectedFiles) => {
        const newFiles = Array.from(selectedFiles).map((file) => ({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            status: "pending", // pending | uploading | done | error
            error: null,
            uploadedId: null,
        }));

        // Validate
        const validated = newFiles.map((f) => {
            if (f.size > MAX_FILE_SIZE) {
                return { ...f, status: "error", error: "File exceeds 10MB limit" };
            }
            if (!ALLOWED_TYPES.includes(f.type) && f.type !== "") {
                return { ...f, status: "error", error: "Unsupported file type" };
            }
            return f;
        });

        setFiles((prev) => [...prev, ...validated]);
    };

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const uploadAllFiles = async () => {
        const pendingFiles = files.filter((f) => f.status === "pending");
        if (pendingFiles.length === 0) return;

        setUploading(true);

        for (const fileObj of pendingFiles) {
            setFiles((prev) =>
                prev.map((f) => (f.id === fileObj.id ? { ...f, status: "uploading" } : f))
            );

            try {
                const reader = new FileReader();
                const fileData = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(fileObj.file);
                });

                const res = await fileUploadService.uploadFile({
                    patient: patientId,
                    appointment: appointmentId,
                    fileName: fileObj.name,
                    fileType: fileObj.type,
                    fileSize: fileObj.size,
                    fileData,
                    category,
                    description,
                });

                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileObj.id
                            ? { ...f, status: "done", uploadedId: res.data?.id }
                            : f
                    )
                );
            } catch (err) {
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileObj.id
                            ? { ...f, status: "error", error: err.message || "Upload failed" }
                            : f
                    )
                );
            }
        }

        setUploading(false);
        onUploadComplete?.();
    };

    const doneCount = files.filter((f) => f.status === "done").length;
    const pendingCount = files.filter((f) => f.status === "pending").length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Attachments</h4>
                {doneCount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600">{doneCount} uploaded</span>
                )}
            </div>

            {/* Category & Description */}
            <div className="grid grid-cols-2 gap-2">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                    <option value="lab_report">Lab Report</option>
                    <option value="imaging">Imaging</option>
                    <option value="prescription">Prescription</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="consent_form">Consent Form</option>
                    <option value="other">Other</option>
                </select>
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-3 py-2 text-[10px] font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileSelection(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragOver
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                    }`}
            >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-500">Drag & drop files here</p>
                <p className="text-[10px] text-gray-400 mt-1">or click to browse · Max 10MB</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileSelection(e.target.files)}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx,.txt"
                />
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((f) => (
                        <div
                            key={f.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${f.status === "error"
                                    ? "bg-red-50 border-red-100"
                                    : f.status === "done"
                                        ? "bg-emerald-50 border-emerald-100"
                                        : "bg-gray-50 border-gray-100"
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${f.status === "error" ? "bg-red-100 text-red-500" :
                                    f.status === "done" ? "bg-emerald-100 text-emerald-600" :
                                        "bg-gray-200 text-gray-500"
                                }`}>
                                {f.status === "uploading" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : f.status === "done" ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : f.status === "error" ? (
                                    <AlertCircle className="w-4 h-4" />
                                ) : (
                                    getFileIcon(f.type)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-700 truncate">{f.name}</p>
                                <p className="text-[10px] text-gray-400">
                                    {formatFileSize(f.size)}
                                    {f.status === "error" && (
                                        <span className="text-red-500 ml-1">· {f.error}</span>
                                    )}
                                </p>
                            </div>
                            {f.status === "pending" && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                                    className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {pendingCount > 0 && (
                <button
                    onClick={uploadAllFiles}
                    disabled={uploading || !patientId}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" /> Upload {pendingCount} File{pendingCount !== 1 ? "s" : ""}
                        </>
                    )}
                </button>
            )}
        </div>
    );
}