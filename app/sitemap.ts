import { MetadataRoute } from 'next'
import { blogPosts } from './blog/blog-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pratimaagale.in'

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/why-homeopathy',
    '/conditions',
    '/services/womens-health',
    '/services/pediatric',
    '/services/chronic-disease',
    '/patient-journey',
    '/case-studies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog routes
  const blogRoutes = Object.keys(blogPosts).map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
