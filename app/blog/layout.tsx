import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Homeopathy Knowledge Hub | Latest Health Articles & Tips",
  description: "Stay informed with genuine health articles, homeopathy tips, and wellness guides from Dr. Pratima Agale Homeopathy Kalyan.",
  alternates: { canonical: "https://pratimaagale.in/blog" },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
