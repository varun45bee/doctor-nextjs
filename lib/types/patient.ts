export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type UserRole = "patient" | "doctor" | "admin";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  photoURL?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: Gender;
  address?: string;
  emergencyContact?: string;
  emergencyRelationship?: string;
  bloodGroup?: BloodGroup;

  // Medical Information
  allergies?: string;
  currentMedications?: string;
  chronicDiseases?: string;
  previousSurgeries?: string;
  previousInjuries?: string;
  medicalHistory?: string;
  previousTreatments?: string;
  lifestyleInformation?: string;

  // System & Metadata
  role: UserRole;
  profileCompleted: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type MedicalRecordType =
  | "prescription"
  | "lab_report"
  | "scan"
  | "discharge_summary"
  | "other";

export interface MedicalRecord {
  id: string;
  userId: string;
  type: MedicalRecordType;
  title: string;
  description?: string;
  documentURL: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  recordDate?: string; // Date of the medical record
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Calculates profile completion percentage based on filled key fields.
 */
export function calculateProfileCompletion(profile: Partial<UserProfile> | null): number {
  if (!profile) return 0;

  const fieldsToCheck: (keyof UserProfile)[] = [
    "fullName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "address",
    "emergencyContact",
    "bloodGroup",
    "allergies",
    "medicalHistory",
  ];

  let filledCount = 0;
  for (const field of fieldsToCheck) {
    const val = profile[field];
    if (val !== undefined && val !== null && String(val).trim() !== "" && String(val) !== "Unknown") {
      filledCount++;
    }
  }

  return Math.round((filledCount / fieldsToCheck.length) * 100);
}

