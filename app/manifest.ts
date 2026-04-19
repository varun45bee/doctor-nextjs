import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dr. Pratima Agale Homeopathy',
    short_name: 'Dr. Pratima',
    description: 'Expert Homeopathy Clinic in Kalyan & Mumbai by Dr. Pratima Agale (BHMS, MD)',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#5a7f5a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
