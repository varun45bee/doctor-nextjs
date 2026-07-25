import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: ['/api/'],
      },
      {
        userAgent: '*',
        disallow: ['*'],
        host: '*.vercel.app',
      },
    ],
    sitemap: 'https://www.pratimaagale.in/sitemap.xml',
  }
}