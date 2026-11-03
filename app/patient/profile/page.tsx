"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  FileHeart,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import PatientAvatar from "@/components/patient/PatientAvatar";
import {
  UserProfile,
  BloodGroup,
  Gender,
  calculateProfileCompletion,
} from "@/lib/types/patient";
import { updatePatientProfile } from "@/lib/services/patient-profile";
import { uploadProfilePhoto } from "@/lib/storage/patient-storage";

const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function PatientProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: "",
    email: "",
    phone: "",
    photoURL: "",
    dateOfBirth: "",
    gender: "prefer_not_to_say",
    address: "",
    emergencyContact: "",
    emergencyRelationship: "",
    bloodGroup: "Unknown",
    allergies: "",
    currentMedications: "",
    chronicDiseases: "",
    previousSurgeries: "",
    previousInjuries: "",
    medicalHistory: "",
    previousTreatments: "",
    lifestyleInformation: "",
  });

  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || user?.displayName || "",
        email: userProfile.email || user?.email || "",
        phone: userProfile.phone || "",
        photoURL: userProfile.photoURL || user?.photoURL || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        gender: userProfile.gender || "prefer_not_to_say",
        address: userProfile.address || "",
        emergencyContact: userProfile.emergencyContact || "",
        emergencyRelationship: userProfile.emergencyRelationship || "",
        bloodGroup: userProfile.bloodGroup || "Unknown",
        allergies: userProfile.allergies || "",
        currentMedications: userProfile.currentMedications || "",
        chronicDiseases: userProfile.chronicDiseases || "",
        previousSurgeries: userProfile.previousSurgeries || "",
        previousInjuries: userProfile.previousInjuries || "",
        medicalHistory: userProfile.medicalHistory || "",
        previousTreatments: userProfile.previousTreatments || "",
        lifestyleInformation: userProfile.lifestyleInformation || "",
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      }));
    }
  }, [userProfile, user]);

  const completionPercentage = useMemo(() => {
    return calculateProfileCompletion(formData);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processPhotoUpload = async (file: File) => {
    if (!user) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid image file (JPEG, PNG, or WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Profile photo size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setPhotoUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewPhoto(objectUrl);

    try {
      const downloadUrl = await uploadProfilePhoto(user.uid, file);
      
      // Update both Firestore Profile and Firebase Auth user instance
      await updatePatientProfile(user.uid, { photoURL: downloadUrl });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: downloadUrl }).catch((e) => {
          console.warn("Auth updateProfile notice:", e);
        });
      }

      setFormData((prev) => ({ ...prev, photoURL: downloadUrl }));
      setPreviewPhoto(null);
      await refreshProfile();
      setSuccessMessage("Profile photo uploaded and synced successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Photo upload error:", err);
      setPreviewPhoto(null);
      setErrorMessage(err.message || "Failed to upload photo. Please check your network and try again.");
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processPhotoUpload(file);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setPhotoUploading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      setPreviewPhoto(null);
      await updatePatientProfile(user.uid, { photoURL: "" });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: "" }).catch(() => {});
      }
      setFormData((prev) => ({ ...prev, photoURL: "" }));
      await refreshProfile();
      setSuccessMessage("Profile photo removed. Initial avatar active.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to remove photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processPhotoUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updatePatientProfile(user.uid, formData);
      await refreshProfile();
      setSuccessMessage("Your profile and medical history have been updated.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Completion Meter */}
      <div
        className="rounded-3xl border p-6 sm:p-8 shadow-sm"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-900/60 text-sage-800 dark:text-sage-200 border border-sage-200 dark:border-sage-800 inline-block mb-2">
              Confidential Medical Dossier
            </span>
            <h1
              className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Patient Profile & Medical History
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Providing comprehensive medical background helps Dr. Pratima Agale accurately evaluate constitutional homeopathic remedies.
            </p>
          </div>

          {/* Completion Gauge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-200 dark:text-zinc-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    completionPercentage >= 80
                      ? "text-emerald-500"
                      : completionPercentage >= 50
                      ? "text-sage-500"
                      : "text-amber-500"
                  }
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-xs text-[var(--text-primary)]">
                {completionPercentage}%
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Profile Strength
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                {completionPercentage >= 80
                  ? "Fully complete for evaluation"
                  : "Fill key details to assist Dr. Agale"}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal & Contact Information */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-6"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
            <div className="p-2.5 rounded-2xl bg-sage-50 dark:bg-sage-950/40 text-sage-600 dark:text-sage-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                1. Personal Details
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Contact information for consultation reminders & Google Meet invites.
              </p>
            </div>
          </div>

          {/* Enterprise Photo Upload & Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            {/* Interactive Avatar Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !photoUploading && fileInputRef.current?.click()}
              className={`relative cursor-pointer group transition-all duration-200 rounded-full ${
                isDragging ? "scale-105 ring-4 ring-sage-500" : ""
              }`}
              title="Click or drag an image to update photo"
            >
              <PatientAvatar
                src={previewPhoto || formData.photoURL}
                name={formData.fullName || user?.displayName}
                size="xl"
                className="shadow-md transition-opacity group-hover:opacity-90"
              />

              {/* Hover / Drag Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Camera className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-semibold">Change</span>
              </div>

              {/* Uploading Spinner Overlay */}
              {photoUploading && (
                <div className="absolute inset-0 rounded-full bg-black/70 flex flex-col items-center justify-center text-white z-10 backdrop-blur-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-white mb-1" />
                  <span className="text-[10px] font-medium tracking-wide">Uploading...</span>
                </div>
              )}
            </div>

            {/* Actions & Guidelines */}
            <div className="space-y-2 text-center sm:text-left flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{photoUploading ? "Uploading..." : "Upload New Photo"}</span>
                </button>

                {(formData.photoURL || previewPhoto) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={photoUploading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Drag and drop or click to upload. Formats: <strong className="font-medium text-[var(--text-secondary)]">JPG, PNG, WEBP</strong> (Max 5MB).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
            {/* Full Name */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName || ""}
                onChange={handleChange}
                placeholder="Patient's Full Legal Name"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled
                value={formData.email || ""}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Phone Number (WhatsApp notifications) *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || "prefer_not_to_say"}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup || "Unknown"}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Residential Address */}
            <div className="md:col-span-2">
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Residential Address / City
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Street address, City, State, Country"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact || ""}
                onChange={handleChange}
                placeholder="+91 9822000000"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Emergency Relationship */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Relationship (e.g. Spouse, Parent)
              </label>
              <input
                type="text"
                name="emergencyRelationship"
                value={formData.emergencyRelationship || ""}
                onChange={handleChange}
                placeholder="Spouse / Parent / Sibling"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical & Medical Background */}
        <div
          className="rounded-3xl border p-6 sm:p-8 shadow-sm space-y-6"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <FileHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                2. Clinical & Medical History
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Essential for totality of symptoms and personalized constitutional remedy selection.
              </p>
            </div>
          </div>

          <div className="space-y-5 text-xs sm:text-sm">
            {/* Allergies */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Known Allergies (Food, Environmental, Medication)
              </label>
              <textarea
                rows={2}
                name="allergies"
                value={formData.allergies || ""}
                onChange={handleChange}
                placeholder="e.g. Dust, Pollen, Penicillin, Peanuts, Sulfa drugs, None"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Current Medications */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Current Medications & Supplements
              </label>
              <textarea
                rows={2}
                name="currentMedications"
                value={formData.currentMedications || ""}
                onChange={handleChange}
                placeholder="e.g. Thyroxine 50mcg, Metformin, Vitamin D3, Homeopathic remedies"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Chronic Conditions */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Chronic Diseases or Existing Diagnoses
              </label>
              <textarea
                rows={2}
                name="chronicDiseases"
                value={formData.chronicDiseases || ""}
                onChange={handleChange}
                placeholder="e.g. Psoriasis, Asthma, Hypertension, Diabetes, Thyroid, Migraines"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Past Surgeries & Injuries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                  Previous Surgeries
                </label>
                <textarea
                  rows={2}
                  name="previousSurgeries"
                  value={formData.previousSurgeries || ""}
                  onChange={handleChange}
                  placeholder="e.g. Appendectomy in 2018, Gallbladder"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                  Previous Major Injuries
                </label>
                <textarea
                  rows={2}
                  name="previousInjuries"
                  value={formData.previousInjuries || ""}
                  onChange={handleChange}
                  placeholder="e.g. Wrist fracture, Head concussion"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
            </div>

            {/* Medical History & Present Complaints */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Present Complaints & Detailed Health History
              </label>
              <textarea
                rows={3}
                name="medicalHistory"
                value={formData.medicalHistory || ""}
                onChange={handleChange}
                placeholder="Describe your primary symptoms, when they began, factors that aggravate or relieve them..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            {/* Lifestyle & Habits */}
            <div>
              <label className="block font-medium text-[var(--text-primary)] mb-1.5">
                Lifestyle, Diet & Sleep Patterns
              </label>
              <textarea
                rows={2}
                name="lifestyleInformation"
                value={formData.lifestyleInformation || ""}
                onChange={handleChange}
                placeholder="e.g. Vegetarian diet, 6-7 hrs sleep, sedentary desk job, daily walking"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-sm transition-all shadow-md active:scale-95 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving Profile..." : "Save Medical Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

