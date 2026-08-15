import { defineField, defineType } from 'sanity'

export const schema = defineType({
  name: 'condition',
  title: 'Condition / Treatment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'symptoms',
      title: 'Symptoms',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'treatmentApproach',
      title: 'Treatment Approach',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineField({
          name: 'faq',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'relatedConditions',
      title: 'Related Conditions',
      type: 'array',
      of: [
        defineField({
          name: 'related',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icon/Emoji',
      type: 'string',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
})
