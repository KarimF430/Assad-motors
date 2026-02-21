'use client'

import { useState, useEffect } from 'react'

export default function ApiHealthCheck() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:5000/health')
        if (response.ok) {
          const data = await response.json()
          setStatus('success')
          setMessage(`Backend is healthy: ${data.status}`)
        } else {
          setStatus('error')
          setMessage(`Backend error: ${response.status}`)
        }
      } catch (error) {
        setStatus('error')
        setMessage(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    checkHealth()
  }, [])

  if (status === 'checking') {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm">
        🔍 Checking backend connection...
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-300 rounded-lg p-3 text-sm">
        ✅ {message}
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
      ❌ {message}
    </div>
  )
}
