import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Health Conditions Treated | Homeopathy Specialist Kalyan",
  description: "Browse 40+ health conditions treated naturally with homeopathy by Dr. Pratima Agale, including PCOD, Skin Disorders, Pediatric Care, and Chronic Diseases.",
  alternates: { canonical: "https://pratimaagale.in/conditions" },
}

export default function ConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
