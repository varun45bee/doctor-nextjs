/**
 * Tool Executor for Nirvana Health AI
 * Executes backend actions safely on the server and returns structured real data.
 */

import { fetchAvailabilitySettings, fetchBookedSlotsForDate } from "../../firestore/availability.ts";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.ts";
import { createAppointmentLookup } from "../../appointment-lookup.ts";
import { isValidIndianMobileNumber } from "../../phone-validation.ts";

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
}

export async function executeNirvanaTool(
  toolName: string,
  args: Record<string, any>
): Promise<ToolExecutionResult> {
  try {
    switch (toolName) {
      case "get_clinic_info": {
        return {
          toolName,
          success: true,
          data: {
            practiceMode: "100% Online Global Clinic",
            consultationType: "Online Video Consultation & Phone Support",
            physicalVisits: "No physical in-person visits (exclusively digital global practice)",
            operatingHours: "Monday to Saturday, 10:00 AM – 7:00 PM IST (Closed Sundays)",
            medicineDelivery: "Tracked express courier delivery of genuine homeopathic remedies to patient doorstep across India & internationally",
            bookingUrl: "/#book",
            checkStatusUrl: "/check-appointment",
          },
        };
      }

      case "get_doctor_profile": {
        return {
          toolName,
          success: true,
          data: {
            name: "Dr. Pratima Agale",
            qualifications: "BHMS, MD (Homeopathy)",
            distinction: "Gold Medalist in Homeopathic Therapeutics",
            experience: "15+ Years Clinical Practice",
            specialties: [
              "Women's Hormonal Health (PCOD, PCOS, Thyroid, Infertility)",
              "Pediatric Care & Child Immunity (Recurrent infections, tonsils, adenoids)",
              "Chronic Skin Disorders & Allergies (Eczema, psoriasis, urticaria)",
              "Migraines & Stress-Related Chronic Disorders",
              "Digestive & Autoimmune Conditions",
            ],
            clinicalPhilosophy: "Classical individualized homeopathy treating the root cause rather than temporary suppression.",
          },
        };
      }

      case "get_consultation_info": {
        return {
          toolName,
          success: true,
          data: {
            format: "Secure online video session (30-45 minutes in-depth case taking)",
            inclusions: [
              "Detailed physical, emotional, and constitutional analysis",
              "Review of past medical records, lab reports, and current medications",
              "Individualized classical remedy formulation",
              "Doorstep tracked courier delivery of original medicines",
              "WhatsApp and portal follow-up care",
            ],
            deliveryTimeline: "2-4 business days across India",
          },
        };
      }

      case "check_appointment_slots": {
        const date = args.date;
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return {
            toolName,
            success: false,
            data: {},
            error: "Invalid date format. Expected YYYY-MM-DD.",
          };
        }

        const selectedDate = new Date(date + "T00:00:00");
        const dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 0) {
          return {
            toolName,
            success: true,
            data: {
              date,
              isWorkingDay: false,
              message: "The clinic is closed on Sundays. Please select a date between Monday and Saturday.",
              availableSlots: [],
            },
          };
        }

        const settings = await fetchAvailabilitySettings();
        const booked = await fetchBookedSlotsForDate(date);
        const allSlots = settings.slots && settings.slots.length > 0
          ? settings.slots
          : ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

        const availableSlots = allSlots.filter((slot) => !booked.includes(slot));

        return {
          toolName,
          success: true,
          data: {
            date,
            isWorkingDay: true,
            totalSlots: allSlots.length,
            availableSlotsCount: availableSlots.length,
            availableSlots,
            bookedSlots: booked,
          },
        };
      }

      case "create_appointment": {
        const { patientName, patientPhone, patientEmail, date, time, condition } = args;

        if (!patientName || typeof patientName !== "string" || patientName.trim().length < 2) {
          return { toolName, success: false, data: {}, error: "Patient name must be at least 2 characters." };
        }

        const cleanDigits = (patientPhone || "").replace(/\D/g, "");
        if (!cleanDigits || cleanDigits.length < 10) {
          return { toolName, success: false, data: {}, error: "A valid 10-digit mobile number is required." };
        }

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return { toolName, success: false, data: {}, error: "Valid date (YYYY-MM-DD) is required." };
        }

        if (!time || !/^\d{1,2}:\d{2}$/.test(time)) {
          return { toolName, success: false, data: {}, error: "Valid time slot (HH:mm) is required." };
        }

        // Direct write to Firestore
        const docRef = await addDoc(collection(db, "appointments"), {
          patientName: patientName.trim(),
          patientPhone: cleanDigits,
          patientEmail: (patientEmail || "").trim().toLowerCase(),
          appointmentDate: date,
          appointmentTime: time,
          consultationType: "online",
          status: "Pending",
          condition: condition || "General Consultation",
          doctorId: "default_doctor",
          bookedVia: "nirvana_ai_assistant",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Create phone lookup entry for /check-appointment
        try {
          await createAppointmentLookup({
            patientPhone: cleanDigits,
            patientName: patientName.trim(),
            appointmentDate: date,
            appointmentTime: time,
            appointmentId: docRef.id,
          });
        } catch (lookupErr) {
          console.warn("Could not create phone lookup doc:", lookupErr);
        }

        return {
          toolName,
          success: true,
          data: {
            appointmentId: docRef.id,
            patientName: patientName.trim(),
            patientPhone: cleanDigits,
            date,
            time,
            type: "Online Video Consultation",
            status: "Pending",
            statusCheckUrl: "/check-appointment",
            message: `Consultation booked for ${patientName} on ${date} at ${time}. You can track it anytime at /check-appointment using phone ${cleanDigits}.`,
          },
        };
      }

      default:
        return {
          toolName,
          success: false,
          data: {},
          error: `Unknown tool: ${toolName}`,
        };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`Tool execution error for ${toolName}:`, err);
    return {
      toolName,
      success: false,
      data: {},
      error: errorMsg,
    };
  }
}
