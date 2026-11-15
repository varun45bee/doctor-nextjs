/**
 * Verified Clinic Knowledge Base for Dr. Pratima Agale Homeopathy
 * Ground truth documentation for RAG semantic retrieval.
 */

export interface KnowledgeDocument {
  id: string;
  category: "doctor_profile" | "clinic_info" | "consultation" | "conditions" | "appointment_policy" | "homeopathy_faq";
  title: string;
  keywords: string[];
  content: string;
}

export const CLINIC_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "doctor_profile",
    category: "doctor_profile",
    title: "Dr. Pratima Agale - Doctor Profile & Qualifications",
    keywords: [
      "dr pratima", "doctor", "pratima agale", "qualifications", "experience",
      "specialist", "bhms", "md homeopathy", "gold medalist", "background", "who is doctor"
    ],
    content: `Dr. Pratima Agale is a senior consulting homeopath with over 15 years of clinical excellence. She holds BHMS and MD (Homeopathy) qualifications, and is a Gold Medalist in Homeopathic Therapeutics. She specializes in women's hormonal health (PCOD/PCOS, thyroid disorders, menopause), pediatric immunity, chronic skin conditions (eczema, psoriasis), allergies, migraines, and lifestyle-induced chronic disorders. Her clinical approach emphasizes classical individualized homeopathy, treating the root constitutional cause of disease rather than merely suppressing symptoms.`
  },
  {
    id: "clinic_mode_100_percent_online",
    category: "clinic_info",
    title: "Clinic Practice Mode - 100% Online Global Clinic",
    keywords: [
      "clinic address", "location", "physical clinic", "visit clinic", "in person",
      "offline", "where is clinic", "address", "walk in", "hospital", "center"
    ],
    content: `Dr. Pratima Agale Clinic operates as a 100% ONLINE GLOBAL CLINIC. All patient consultations are conducted exclusively via secure high-definition online video and audio calls. There are NO physical in-clinic visits, walk-ins, or physical hospital branches. Genuine, individualized homeopathic remedies are dispensed from verified homeopathic pharmacies and couriered directly to the patient's doorstep across India (via tracked express courier) and internationally. Patients can consult from the comfort of their home from anywhere in the world.`
  },
  {
    id: "clinic_hours_and_timings",
    category: "clinic_info",
    title: "Clinic Operating Hours & Schedule",
    keywords: [
      "clinic hours", "timings", "opening hours", "when open", "working days",
      "sunday open", "schedule", "availability", "time slots", "closed"
    ],
    content: `Online consultation appointments are scheduled Monday through Saturday, between 10:00 AM and 7:00 PM IST (Indian Standard Time). The clinic is closed on Sundays and major public holidays. Consultations are by prior appointment only to allow thorough 30-45 minute dedicated clinical time per case.`
  },
  {
    id: "consultation_process_and_delivery",
    category: "consultation",
    title: "Online Consultation Process & Doorstep Medicine Delivery",
    keywords: [
      "consultation process", "how it works", "video call", "medicine delivery",
      "courier", "doorstep delivery", "shipping", "remedies", "prescription", "how to consult"
    ],
    content: `The consultation process consists of 4 simple steps:
1. Online Booking: Select date and time slot on the website and provide your 10-digit mobile number.
2. In-Depth Video Consultation: A comprehensive 30–45 minute clinical video session covering physical symptoms, emotional health, medical history, diet, and lifestyle modalities.
3. Individualized Remedy Selection: Classical constitutional prescription prepared according to high pharmaceutical standards.
4. Doorstep Delivery: Medicines are securely packaged and dispatched via express courier with real-time tracking directly to your address within 2-4 business days across India.`
  },
  {
    id: "pcod_pcos_womens_health",
    category: "conditions",
    title: "Homeopathy for PCOD, PCOS & Hormonal Balance",
    keywords: [
      "pcod", "pcos", "irregular periods", "ovarian cysts", "hormonal",
      "facial hair", "weight gain", "infertility", "period pain", "women health"
    ],
    content: `Dr. Pratima Agale has extensive clinical expertise in treating PCOD and PCOS naturally through constitutional homeopathy. Homeopathy stimulates the body's natural endocrine balance, aiding normal ovulation, regulating menstrual cycles, and addressing associated concerns like hirsutism, cystic acne, and weight resistance without synthetic hormone replacement.`
  },
  {
    id: "thyroid_disorders",
    category: "conditions",
    title: "Homeopathic Management of Thyroid Disorders",
    keywords: [
      "thyroid", "hypothyroid", "hyperthyroid", "tsh", "t3", "t4",
      "hashimoto", "weight gain", "fatigue", "hair loss"
    ],
    content: `Homeopathy provides a gentle, constitutional approach to thyroid dysfunctions (including Hypothyroidism and Hashimoto's thyroiditis). Remedies work synergistically to improve metabolism, reduce chronic fatigue, stabilize mood, and stimulate the neuro-endocrine axis, allowing many patients to gradually reduce synthetic thyroxine requirements under medical monitoring.`
  },
  {
    id: "pediatric_child_immunity",
    category: "conditions",
    title: "Pediatric Care & Child Immunity",
    keywords: [
      "child", "kids", "pediatric", "immunity", "frequent cold", "cough",
      "tonsillitis", "adenoids", "child health", "baby", "toddler"
    ],
    content: `Homeopathy is exceptionally safe and gentle for infants, toddlers, and children. It is highly effective for recurrent upper respiratory infections, allergic rhinitis, enlarged tonsils, adenoids, and low immunity. Because homeopathic sweet globule remedies have zero bitter taste and zero side effects, children accept them willingly without trauma.`
  },
  {
    id: "chronic_skin_allergies",
    category: "conditions",
    title: "Homeopathy for Chronic Skin Diseases & Allergies",
    keywords: [
      "skin", "eczema", "psoriasis", "allergies", "urticaria", "hives",
      "itching", "dermatitis", "fungal", "acne", "rash"
    ],
    content: `Skin disorders in homeopathy are understood as external expressions of internal constitutional disharmony. Rather than suppressing with external steroid creams, individualized internal homeopathic remedies treat the allergic diathesis and immune hypersensitivity, offering lasting remission in chronic eczema, psoriasis, hives, and chronic allergic rhinitis.`
  },
  {
    id: "appointment_booking_and_lookup",
    category: "appointment_policy",
    title: "How to Book and Check Appointments",
    keywords: [
      "book appointment", "check appointment", "status", "cancel", "reschedule",
      "phone number", "how to book", "booking link", "check status"
    ],
    content: `Patients can book an appointment directly using the 'Book Appointment' button on the website. No Google account or complex signup is required—simply enter full name, 10-digit mobile number, email, and choose an available time slot. To check appointment status, view prescriptions, or track progress logs anytime, go to the 'Check Appointment' page (/check-appointment) and enter your registered mobile number.`
  },
  {
    id: "homeopathy_safety_and_allopathy",
    category: "homeopathy_faq",
    title: "Homeopathy Safety, Side Effects & Combining with Allopathy",
    keywords: [
      "safe", "side effects", "allopathy", "english medicine", "steroids",
      "can take with allopathy", "natural", "is homeopathy safe"
    ],
    content: `Homeopathic remedies are non-toxic, non-addictive, and free from conventional chemical side effects when prescribed by a qualified physician. Homeopathic medicines do not contain steroids. Homeopathy can safely be taken alongside conventional allopathic medicines (such as blood pressure, diabetes, or thyroid drugs) with a simple 30-minute time separation between doses. Patients should never abruptly stop their prescribed allopathic medications without consulting their physician.`
  }
];

