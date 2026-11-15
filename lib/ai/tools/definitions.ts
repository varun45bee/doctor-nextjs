/**
 * Tool / Function Calling Definitions for Nirvana Health AI
 * Compatible with Groq / OpenAI function calling schema.
 */

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

export const NIRVANA_TOOLS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "get_clinic_info",
      description: "Get verified practice details, operating hours, 100% online model, and delivery coverage for Dr. Pratima Agale Clinic.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_doctor_profile",
      description: "Get Dr. Pratima Agale's verified medical qualifications, clinical specialties, and years of experience.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_consultation_info",
      description: "Get step-by-step information on how the online video consultation works, case-taking duration, and doorstep medicine courier process.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_appointment_slots",
      description: "Check available consultation time slots for a specific date (YYYY-MM-DD).",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "Date in YYYY-MM-DD format (Monday to Saturday only).",
          },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_appointment",
      description: "Book an online video consultation for a patient directly into the clinic system.",
      parameters: {
        type: "object",
        properties: {
          patientName: {
            type: "string",
            description: "Full name of the patient (at least 2 characters).",
          },
          patientPhone: {
            type: "string",
            description: "10-digit mobile number of the patient.",
          },
          patientEmail: {
            type: "string",
            description: "Email address for sending consultation link and confirmation.",
          },
          date: {
            type: "string",
            description: "Appointment date in YYYY-MM-DD format.",
          },
          time: {
            type: "string",
            description: "Time slot in HH:mm format (e.g. 10:00, 15:00).",
          },
          condition: {
            type: "string",
            description: "Primary health concern or condition (e.g. PCOD, Migraine, Child Immunity).",
          },
        },
        required: ["patientName", "patientPhone", "date", "time"],
      },
    },
  },
];

