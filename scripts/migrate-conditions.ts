import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

// Sample condition data from pcod-pcos/page.tsx
const conditions = [
  {
    slug: 'pcod-pcos',
    name: 'PCOD / PCOS',
    icon: '🌸',
    category: "Women's Health",
    description: 'Polycystic Ovarian Disease (PCOD) affects 1 in 5 Indian women, making it the most common hormonal disorder of the reproductive age. PCOD causes cysts on the ovaries, menstrual irregularities, hormonal imbalance, and a cascade of symptoms affecting fertility, metabolism, skin, and mental health.',
    symptoms: [
      'Irregular, missed, or very heavy periods',
      'Weight gain — especially around the abdomen',
      'Excess facial or body hair (hirsutism)',
      'Acne and oily skin',
      'Hair thinning on the scalp',
      'Difficulty conceiving',
      'Mood swings, anxiety, or depression',
    ],
    treatmentApproach: 'Homeopathy treats PCOD constitutionally — addressing the specific hormonal, metabolic, and emotional pattern unique to each woman. Rather than suppressing the cycle with synthetic hormones, homeopathic remedies stimulate the body\'s own hormonal intelligence to restore ovarian function. Treatment is combined with lifestyle and dietary guidance for optimal results.',
    faqs: [
      {
        question: 'Can PCOD be permanently cured with homeopathy?',
        answer: 'Many women achieve complete hormonal regulation and remain symptom-free after completing treatment. PCOD has a constitutional component, so lifestyle maintenance is important. But yes, lasting remission is achievable.',
      },
      {
        question: 'Can I conceive while on homeopathic treatment for PCOD?',
        answer: 'Yes. Dr. Agale has helped many PCOD patients conceive naturally. The remedies are safe during pregnancy and are actually continued to support the pregnancy if needed.',
      },
      {
        question: 'Do I need to stop the OCP to start homeopathy?',
        answer: 'Not immediately. Treatment can begin alongside OCP. As your cycle normalizes, you can gradually taper the OCP under your gynecologist\'s guidance.',
      },
    ],
    keywords: [
      'PCOD homeopathy kalyan',
      'PCOS treatment homeopathy mumbai',
      'PCOD natural treatment',
      'pcos homeopathy doctor kalyan',
    ],
    metaTitle: 'PCOD / PCOS Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale',
    metaDescription: 'Expert homeopathic treatment for PCOD / PCOS in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. PCOD homeopathy kalyan, PCOS treatment homeopathy mumbai.',
  },
]

async function migrateConditions() {
  console.log('Starting condition migration...')

  for (const condition of conditions) {
    console.log(`Migrating: ${condition.name}`)

    try {
      const doc = {
        _type: 'condition',
        name: condition.name,
        slug: {
          _type: 'slug',
          current: condition.slug,
        },
        icon: condition.icon,
        category: condition.category,
        description: condition.description,
        symptoms: condition.symptoms,
        treatmentApproach: condition.treatmentApproach,
        faqs: condition.faqs,
        keywords: condition.keywords,
        metaTitle: condition.metaTitle,
        metaDescription: condition.metaDescription,
      }

      await client.create(doc)
      console.log(`✅ Successfully migrated: ${condition.name}`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${condition.name}:`, error)
    }
  }

  console.log('Condition migration complete!')
}

migrateConditions().catch(console.error)
