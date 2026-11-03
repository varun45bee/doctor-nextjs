"use client";

import { useEffect, useState, useRef } from "react";
import {
  UploadCloud,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  MedicalRecord,
  MedicalRecordType,
} from "@/lib/types/patient";
import {
  getMedicalRecords,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "@/lib/services/patient-profile";
import { uploadMedicalDocument } from "@/lib/storage/patient-storage";

const RECORD_TYPES: { value: MedicalRecordType; label: string }[] = [
  { value: "prescription", label: "Prescription" },
  { value: "lab_report", label: "Lab Report / Blood Test" },
  { value: "scan", label: "Scan / X-Ray / MRI / USG" },
  { value: "discharge_summary", label: "Discharge Summary" },
  { value: "other", label: "Other Medical Record" },
];

export default function MedicalHistoryPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MedicalRecordType>("lab_report");
  const [description, setDescription] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadRecords = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await getMedicalRecords(user.uid);
      setRecords(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  const openAddModal = () => {
    setEditingRecord(null);
    setTitle("");
    setType("lab_report");
    setDescription("");
    setRecordDate(new Date().toISOString().split("T")[0]);
    setSelectedFile(null);
    setErrorMessage("");
    setShowModal(true);
  };

  const openEditModal = (rec: MedicalRecord) => {
    setEditingRecord(rec);
    setTitle(rec.title);
    setType(rec.type);
    setDescription(rec.description || "");
    setRecordDate(rec.recordDate || "");
    setSelectedFile(null);
    setErrorMessage("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      if (editingRecord) {
        // Edit existing record
        await updateMedicalRecord(user.uid, editingRecord.id, {
          title,
          type,
          description,
          recordDate,
        });
        setSuccessMessage("Medical record updated successfully.");
      } else {
        // Adding new record requires file
        if (!selectedFile) {
          throw new Error("Please select a document or report to upload.");
        }

        const uploaded = await uploadMedicalDocument(user.uid, selectedFile);
        await addMedicalRecord(user.uid, {
          title,
          type,
          description,
          recordDate,
          documentURL: uploaded.url,
          fileName: uploaded.fileName,
          fileSize: uploaded.fileSize,
          fileType: uploaded.fileType,
        });
        setSuccessMessage("Medical record uploaded successfully.");
      }

      setShowModal(false);
      await loadRecords();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this medical record?")) {
      return;
    }

    try {
      await deleteMedicalRecord(user.uid, recordId);
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      setSuccessMessage("Record deleted.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to delete record.");
    }
  };

  const filteredRecords = records.filter(
    (r) => typeFilter === "all" || r.type === typeFilter
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner */}
      <div
        className="rounded-3xl border p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 inline-block mb-2">
            Secure Health Repository
          </span>
          <h1
            className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Medical Documents & Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Keep all your diagnostic reports, lab test files, scans, and past prescriptions in one place for Dr. Pratima Agale to review.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              typeFilter === "all"
                ? "bg-sage-600 text-white"
                : "border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
            }`}
          >
            All ({records.length})
          </button>
          {RECORD_TYPES.map((t) => {
            const count = records.filter((r) => r.type === t.value).length;
            return (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  typeFilter === t.value
                    ? "bg-sage-600 text-white"
                    : "border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {t.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
          <p className="text-xs text-[var(--text-muted)]">Loading documents...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div
          className="rounded-3xl border p-12 text-center"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <FolderOpen className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
          <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">
            No medical records found
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto mt-1 mb-6">
            Upload your blood test reports, clinical scans, or previous prescriptions to share them securely with Dr. Pratima Agale.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-600 text-white text-xs font-semibold shadow-sm hover:bg-sage-700 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Your First File</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="rounded-2xl border p-5 flex flex-col justify-between shadow-sm hover:shadow transition-shadow"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sage-100 dark:bg-sage-950 text-sage-800 dark:text-sage-200 border border-sage-200 dark:border-sage-800">
                    {rec.type.replace("_", " ")}
                  </span>
                  {rec.recordDate && (
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {rec.recordDate}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-[var(--text-primary)] line-clamp-1 mb-1.5">
                  {rec.title}
                </h3>

                {rec.description && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                    {rec.description}
                  </p>
                )}

                {rec.fileName && (
                  <p className="text-[11px] text-[var(--text-muted)] truncate mb-4">
                    📎 {rec.fileName} {rec.fileSize ? `(${(rec.fileSize / 1024 / 1024).toFixed(1)} MB)` : ""}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                <a
                  href={rec.documentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-600 dark:text-sage-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open File</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(rec)}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
                    title="Edit record notes"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-5"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                {editingRecord ? "Edit Record Details" : "Upload Medical Document"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs px-2.5 py-1 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Title */}
              <div>
                <label className="block font-medium text-[var(--text-primary)] mb-1">
                  Record Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Thyroid Profile Test, Skin Biopsy, Discharge Report"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              {/* Type & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    Document Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MedicalRecordType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    {RECORD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    Date of Record / Test
                  </label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium text-[var(--text-primary)] mb-1">
                  Notes or Doctor Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key findings or reason for test..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              {/* File Upload (if new) */}
              {!editingRecord && (
                <div>
                  <label className="block font-medium text-[var(--text-primary)] mb-1">
                    Document File (PDF or Image) *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-4 text-center cursor-pointer hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 mx-auto text-sage-600 mb-1" />
                    {selectedFile ? (
                      <p className="text-xs font-semibold text-emerald-600">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Click to select PDF, JPG, PNG or WEBP (Max 15MB)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs shadow transition-all disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingRecord ? "Save Changes" : "Upload Document"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

