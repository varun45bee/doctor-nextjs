"use client"

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { useAuth } from '@/lib/auth-context'

export default function StudioPage() {
  const { user, loading, isDoctor } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isDoctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-serif mb-4 text-red-600">Access Denied</h1>
          <p className="text-sage-600 mb-4">You must be a verified doctor to access the Studio.</p>
          <a href="/doctor" className="text-sage-600 underline hover:text-sage-800">
            Go to Doctor Login
          </a>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
