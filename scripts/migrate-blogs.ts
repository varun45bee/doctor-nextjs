import { createClient } from '@sanity/client'
import { blogPosts } from '../app/blog/blog-data'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function migrateBlogs() {
  console.log('Starting blog migration...')

  for (const [slug, blog] of Object.entries(blogPosts)) {
    console.log(`Migrating: ${blog.title}`)

    try {
      // Convert sections to Portable Text blocks
      const body = blog.sections.map(section => ({
        _type: 'block',
        children: [{
          _type: 'span',
          text: section.content,
        }],
        style: 'normal',
        markDefs: [],
      }))

      // Add intro as first block
      body.unshift({
        _type: 'block',
        children: [{
          _type: 'span',
          text: blog.intro,
        }],
        style: 'normal',
        markDefs: [],
      })

      // Add conclusion as last block
      body.push({
        _type: 'block',
        children: [{
          _type: 'span',
          text: blog.conclusion,
        }],
        style: 'normal',
        markDefs: [],
      })

      const doc = {
        _type: 'blogPost',
        title: blog.title,
        slug: {
          _type: 'slug',
          current: slug,
        },
        excerpt: blog.subtitle,
        coverImage: null, // Add image URL if available
        publishedAt: new Date(blog.publishDate).toISOString(),
        author: blog.author,
        tags: blog.tags,
        body,
        faqs: blog.faqs.map(faq => ({
          question: faq.q,
          answer: faq.a,
        })),
        keywords: blog.tags,
        metaTitle: blog.title,
        metaDescription: blog.subtitle,
      }

      await client.create(doc)
      console.log(`✅ Successfully migrated: ${blog.title}`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${blog.title}:`, error)
    }
  }

  console.log('Blog migration complete!')
}

migrateBlogs().catch(console.error)
