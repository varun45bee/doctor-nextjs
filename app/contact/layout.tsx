import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact & Book Appointment | Dr. Pratima Agale Homeopathy Kalyan",
  description: "Book your homeopathy consultation with Dr. Pratima Agale in Kalyan or Andheri. Reach us via phone, WhatsApp, or email for holistic healthcare.",
  alternates: { canonical: "https://pratimaagale.in/contact" },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
