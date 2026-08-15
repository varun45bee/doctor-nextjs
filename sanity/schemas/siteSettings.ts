import { defineField, defineType } from 'sanity'

export const schema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'geo',
      title: 'Geolocation',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'array',
      of: [
        defineField({
          name: 'day',
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
            }),
            defineField({
              name: 'hours',
              title: 'Hours',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'medicalDisclaimer',
      title: 'Medical Disclaimer',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whyChooseUs',
      title: 'Why Choose Us Items',
      type: 'array',
      of: [
        defineField({
          name: 'item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Homepage Stats',
      type: 'object',
      fields: [
        defineField({
          name: 'patientsCount',
          title: 'Patients Count',
          type: 'number',
        }),
        defineField({
          name: 'yearsExperience',
          title: 'Years of Experience',
          type: 'number',
        }),
        defineField({
          name: 'conditionsCount',
          title: 'Conditions Count',
          type: 'number',
        }),
        defineField({
          name: 'successRate',
          title: 'Success Rate (%)',
          type: 'number',
        }),
      ],
    }),
  ],
})
