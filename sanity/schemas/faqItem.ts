import { defineField, defineType } from 'sanity'

export const schema = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'PCOS', value: 'pcos' },
          { title: 'Thyroid', value: 'thyroid' },
          { title: 'Skin', value: 'skin' },
          { title: 'Hair', value: 'hair' },
        ],
      },
    }),
  ],
})
