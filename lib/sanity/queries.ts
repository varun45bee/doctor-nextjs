import { client } from './client'

export async function getAllBlogPosts() {
  return await client.fetch(`
    *[_type == "blogPost" && published == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      coverImage,
      excerpt,
      category,
      tags,
      publishedAt,
      readTime,
      metaTitle,
      metaDescription,
      keywords
    }
  `)
}

export async function getBlogPostBySlug(slug: string) {
  return await client.fetch(`
    *[_type == "blogPost" && slug.current == $slug && published == true][0] {
      _id,
      title,
      slug,
      coverImage,
      excerpt,
      category,
      tags,
      publishedAt,
      readTime,
      body,
      faqs,
      metaTitle,
      metaDescription,
      keywords
    }
  `, { slug })
}

export async function getAllConditions() {
  return await client.fetch(`
    *[_type == "condition"] | order(name asc) {
      _id,
      name,
      slug,
      shortName,
      icon,
      hero,
      description,
      symptoms,
      treatmentApproach,
      faqs,
      relatedConditions,
      metaTitle,
      metaDescription,
      keywords
    }
  `)
}

export async function getConditionBySlug(slug: string) {
  return await client.fetch(`
    *[_type == "condition" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      shortName,
      icon,
      hero,
      description,
      symptoms,
      treatmentApproach,
      faqs,
      relatedConditions,
      metaTitle,
      metaDescription,
      keywords
    }
  `, { slug })
}

export async function getTestimonials() {
  return await client.fetch(`
    *[_type == "testimonial"] | order(_createdAt desc) {
      _id,
      patientName,
      location,
      text,
      rating
    }
  `)
}

export async function getFaqs() {
  return await client.fetch(`
    *[_type == "faqItem"] | order(category asc) {
      _id,
      question,
      answer,
      category
    }
  `)
}

export async function getSiteSettings() {
  return await client.fetch(`
    *[_type == "siteSettings"][0] {
      siteName,
      tagline,
      phone,
      whatsappNumber,
      email,
      address,
      geo,
      openingHours,
      socialLinks,
      medicalDisclaimer,
      whyChooseUs,
      stats
    }
  `)
}
