import { schema } from './blogPost'
import { schema as conditionSchema } from './condition'
import { schema as testimonialSchema } from './testimonial'
import { schema as faqItemSchema } from './faqItem'
import { schema as siteSettingsSchema } from './siteSettings'

export const schemaTypes = [
  schema,
  conditionSchema,
  testimonialSchema,
  faqItemSchema,
  siteSettingsSchema,
]
