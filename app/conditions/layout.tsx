import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "All Conditions Treated | Homeopathy Doctor Kalyan – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) treats 50+ conditions in Kalyan — skin diseases, PCOS, thyroid, child immunity, arthritis, migraines, anxiety & more. Female homeopathy specialist serving Kalyan, Thane, Dombivli & Mumbai.",
  keywords: [
    "homeopathy for all diseases kalyan",
    "psoriasis homeopathy kalyan",
    "vitiligo homeopathy kalyan",
    "hair loss homeopathy kalyan",
    "PCOS homeopathy kalyan",
    "thyroid homeopathy kalyan",
    "child immunity homeopathy kalyan",
    "ADHD homeopathy kalyan",
    "arthritis homeopathy kalyan",
    "migraine homeopathy kalyan",
    "IBS homeopathy kalyan",
    "anxiety homeopathy kalyan",
    "obesity homeopathy kalyan",
    "best homeopathy clinic kalyan",
    "homeopathy doctor kalyan west",
    "homeopathy doctor dombivli",
  ],
  alternates: { canonical: "https://pratimaagale.in/conditions" },
}

export default function ConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
