import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Agentic AI PAS</h1>
        <p className="text-lg text-gray-600">For Women's Health</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
