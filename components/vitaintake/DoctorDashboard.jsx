// "use client";
// // components/vitaintake/DoctorDashboard.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Doctor-facing case report dashboard
// // ─────────────────────────────────────────────────────────────────────────────

// import { useState } from "react";
// import { URGENCY_CONFIG } from "@/lib/vitaintake";
// import styles from "./vitaintake.module.css";

// // ── Field renderer ────────────────────────────────────────────────────────────
// function Field({ label, value }) {
//   if (!value || value === "N/A" || value === "") return null;
//   return (
//     <div className={styles.field}>
//       <div className={styles.fieldLabel}>{label}</div>
//       <div className={styles.fieldValue}>{value}</div>
//     </div>
//   );
// }

// // ── Section card ──────────────────────────────────────────────────────────────
// function Card({ children, span }) {
//   return (
//     <div className={styles.card} style={{ gridColumn: span ? "1 / -1" : undefined }}>
//       {children}
//     </div>
//   );
// }

// // ── Main DoctorDashboard ──────────────────────────────────────────────────────
// export default function DoctorDashboard({ report }) {
//   const [tab, setTab] = useState("overview");
//   const [notes, setNotes] = useState("");
//   const [saved, setSaved] = useState(false);

//   if (!report) {
//     return (
//       <div className={styles.emptyDashboard}>
//         <div className={styles.emptyIcon}>📋</div>
//         <h2 className={styles.emptyTitle}>No Case Reports Yet</h2>
//         <p className={styles.emptySub}>
//           Once a patient completes the AI intake interview, their full case
//           study will appear here.
//         </p>
//       </div>
//     );
//   }

//   const urgency = URGENCY_CONFIG[report.urgencyLevel] || URGENCY_CONFIG.Routine;
//   const TABS = [
//     { key: "overview",  label: "📋 Overview"      },
//     { key: "history",   label: "🗂 History"        },
//     { key: "mental",    label: "🧠 Mental Profile" },
//     { key: "insights",  label: "✨ AI Insights"    },
//   ];

//   function handleSave() {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//     // TODO: wire up to your DB/API (Prisma, Supabase, etc.)
//     console.log("Saving case report + notes:", { report, notes });
//   }

//   return (
//     <div className={styles.dashboard}>
//       {/* ── Dashboard Header ── */}
//       <div className={styles.dashHeader}>
//         <div className={styles.dashHeaderIcon}>🌿</div>
//         <div className={styles.dashHeaderInfo}>
//           <div className={styles.dashHeaderTag}>Doctor Dashboard · VitaIntake</div>
//           <h1 className={styles.dashHeaderName}>
//             {report.patientName || "Patient"} — Case Report
//           </h1>
//           <div className={styles.dashHeaderMeta}>
//             {[report.age && `${report.age} yrs`, report.gender, report.occupation]
//               .filter(Boolean)
//               .join(" · ")}
//           </div>
//         </div>
//         <div
//           className={styles.urgencyBadge}
//           style={{
//             background: urgency.bg,
//             color: urgency.color,
//             border: `1px solid ${urgency.dot}33`,
//           }}
//         >
//           <span
//             className={styles.urgencyDot}
//             style={{ background: urgency.dot }}
//           />
//           {report.urgencyLevel}
//         </div>
//       </div>

//       {/* ── Tabs ── */}
//       <div className={styles.tabs}>
//         {TABS.map(({ key, label }) => (
//           <button
//             key={key}
//             onClick={() => setTab(key)}
//             className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* ── Tab Content ── */}
//       <div className={styles.tabContent}>

//         {/* OVERVIEW */}
//         {tab === "overview" && (
//           <div className={styles.grid}>
//             <Card span>
//               <div className={styles.sectionLabel}>Chief Complaint</div>
//               <div className={styles.complaint}>{report.chiefComplaint}</div>
//               {report.complaintDuration && (
//                 <div className={styles.duration}>
//                   Duration: {report.complaintDuration}
//                 </div>
//               )}
//               {report.complaintOnset && (
//                 <div className={styles.duration}>
//                   Onset: {report.complaintOnset}
//                 </div>
//               )}
//               {report.location && (
//                 <div className={styles.duration}>
//                   Location: {report.location}
//                 </div>
//               )}
//             </Card>

//             <Card>
//               <div className={styles.sectionLabel} style={{ color: "#c62828" }}>
//                 ▲ Worse From
//               </div>
//               <div className={styles.modalityText} style={{ color: "#b71c1c" }}>
//                 {report.modalities?.worse || "—"}
//               </div>
//             </Card>
//             <Card>
//               <div className={styles.sectionLabel} style={{ color: "#2e7d32" }}>
//                 ▼ Better From
//               </div>
//               <div className={styles.modalityText} style={{ color: "#1b5e20" }}>
//                 {report.modalities?.better || "—"}
//               </div>
//             </Card>

//             <Card>
//               <Field label="Thermal Profile" value={report.thermalProfile} />
//               <Field label="Perspiration" value={report.perspiration} />
//             </Card>
//             <Card>
//               <Field label="Appetite & Thirst" value={report.appetiteThirst} />
//               <Field label="Bowel / Urinary" value={report.bowelUrinary} />
//             </Card>

//             <Card span>
//               <Field label="Sleep Profile" value={report.sleepProfile} />
//               <Field label="Associated Symptoms" value={report.associatedSymptoms} />
//               <Field label="Allergies" value={report.allergies} />
//             </Card>
//           </div>
//         )}

//         {/* HISTORY */}
//         {tab === "history" && (
//           <div className={styles.grid}>
//             <Card span>
//               <Field label="Past Medical History" value={report.pastHistory} />
//             </Card>
//             <Card span>
//               <Field label="Recurring Illnesses" value={report.recurringIllnesses} />
//             </Card>
//             <Card span>
//               <Field label="Family History" value={report.familyHistory} />
//             </Card>
//             <Card>
//               <Field label="Skin / Hair / Nails" value={report.skinHairNails} />
//             </Card>
//             <Card>
//               <Field label="Constitution & Vitality" value={report.constitution} />
//             </Card>
//           </div>
//         )}

//         {/* MENTAL PROFILE */}
//         {tab === "mental" && (
//           <div className={styles.grid}>
//             <Card span>
//               <Field
//                 label="Mental & Emotional Profile"
//                 value={report.mentalEmotional}
//               />
//             </Card>
//             <Card>
//               <Field label="Fears & Phobias" value={report.fears} />
//             </Card>
//             <Card>
//               <Field
//                 label="Significant Life Events"
//                 value={report.lifeEvents}
//               />
//             </Card>
//           </div>
//         )}

//         {/* AI INSIGHTS */}
//         {tab === "insights" && (
//           <div className={styles.insightsGrid}>
//             {/* AI Observations */}
//             <div className={styles.observationsCard}>
//               <div className={styles.observationsHeader}>
//                 <span>✨</span>
//                 <span>AI Homeopathic Observations</span>
//               </div>
//               <p className={styles.observationsText}>{report.aiObservations}</p>
//             </div>

//             {/* Rubrics */}
//             {report.suggestedRubrics?.length > 0 && (
//               <div className={styles.rubricsCard}>
//                 <div className={styles.sectionLabel}>
//                   Suggested Rubrics (Repertory)
//                 </div>
//                 <div className={styles.rubricsList}>
//                   {report.suggestedRubrics.map((r, i) => (
//                     <div key={i} className={styles.rubric}>
//                       {r}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Possible Remedies */}
//             {report.possibleRemedies?.length > 0 && (
//               <div className={styles.rubricsCard}>
//                 <div className={styles.sectionLabel}>
//                   Remedies to Consider
//                 </div>
//                 <div className={styles.rubricsList}>
//                   {report.possibleRemedies.map((r, i) => (
//                     <div key={i} className={styles.remedy}>
//                       {r}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Doctor Notes */}
//             <div className={styles.notesCard}>
//               <div className={styles.sectionLabel}>
//                 Doctor&apos;s Treatment Notes
//               </div>
//               <textarea
//                 className={styles.notesTextarea}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Add your prescription, remedy selection, potency, dose, and follow-up plan here…"
//                 rows={6}
//               />
//               <div className={styles.notesFooter}>
//                 <div className={styles.followUp}>
//                   Recommended follow-up: {report.recommendedFollowUp}
//                 </div>
//                 <div className={styles.notesActions}>
//                   <button className={styles.saveBtn} onClick={handleSave}>
//                     {saved ? "✓ Saved!" : "💾 Save Notes"}
//                   </button>
//                   <button className={styles.printBtn} onClick={() => window.print()}>
//                     🖨️ Print Report
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
