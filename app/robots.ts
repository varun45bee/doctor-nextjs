import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/privacy-policy', '/_next/static/', '/_next/image'],
      disallow: ['/api/', '/studio'],
    },
    host: 'https://www.pratimaagale.in',
    sitemap: 'https://www.pratimaagale.in/sitemap.xml',
  }
}