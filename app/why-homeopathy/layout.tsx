import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Why Choose Homeopathy? | Natural Healing – Dr. Pratima Agale MD Kalyan",
  description: "Understand why homeopathy works — safe, side-effect-free, treats root cause. Dr. Pratima Agale (BHMS, MD Homeopathy) explains the science of natural healing. Serving Kalyan, Thane & Mumbai.",
  keywords: [
    "why choose homeopathy kalyan",
    "homeopathy vs allopathy",
    "is homeopathy safe kalyan",
    "how homeopathy works",
    "homeopathy benefits kalyan",
    "natural treatment kalyan",
    "alternative medicine kalyan",
    "homeopathy safe for children",
    "homeopathy safe during pregnancy",
  ],
  alternates: { canonical: "https://pratimaagale.in/why-homeopathy" },
}

export default function WhyHomeopathyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
