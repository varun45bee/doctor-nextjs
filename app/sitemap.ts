import { MetadataRoute } from 'next'
import { getAllBlogPosts, getAllConditions } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pratimaagale.in'

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
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/cancellation-policy',
    '/pcos-treatment-kalyan',
    '/thyroid-homeopathy-kalyan',
    '/hair-fall-treatment-kalyan',
    '/migraine-homeopathy-kalyan',
    '/eczema-homeopathy-kalyan',
    '/arthritis-homeopathy-kalyan',
    '/homeopathy-doctor-kalyan',
    '/homeopathy-doctor-dombivli',
    '/homeopathy-doctor-thane',
    '/homeopathy-doctor-mumbai',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog routes from Sanity
  const blogPosts = await getAllBlogPosts()
  const blogRoutes = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Condition routes from Sanity
  const conditions = await getAllConditions()
  const conditionRoutes = conditions.map((condition: any) => ({
    url: `${baseUrl}/conditions/${condition.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogRoutes, ...conditionRoutes]
}
