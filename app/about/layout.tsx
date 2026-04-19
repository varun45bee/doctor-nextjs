import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Dr. Pratima Agale | MD Homeopathy Doctor Kalyan",
  description: "Learn more about Dr. Pratima Agale (BHMS, MD), a leading homeopathy expert in Kalyan and Mumbai with 4+ years of experience in natural, root-cause healing.",
  alternates: { canonical: "https://pratimaagale.in/about" },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
