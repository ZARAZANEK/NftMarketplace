'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOutIcon, SaveIcon, UserIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

interface User {
  username: string
  email: string
  createdAt: string
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ username: '', email: '' })
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const hasReloaded = url.searchParams.get('reloaded') === '1'
    if (!hasReloaded) {
      url.searchParams.set('reloaded', '1')
      window.location.replace(url.toString())
      return
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signin')
        return
      }

      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data)
          setFormData({
            username: data.username || '',
            email: data.email || '',
          })
          localStorage.setItem('user', JSON.stringify(data))
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/signin')
        }
      } catch (err) {
        console.error(err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/signin')
      }
    }

    fetchUser()
  }, [mounted, router, API_URL])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/signin')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signin')
        return
      }

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: formData.username }),
      })

      if (res.ok) {
        const updated = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (updated.ok) {
          const data = await updated.json()
          setUser(data)
          setFormData({ username: data.username || '', email: data.email || '' })
          localStorage.setItem('user', JSON.stringify(data))
        }
        setMessage({ text: 'Username updated successfully', type: 'success' })
      } else {
        setMessage({ text: 'Failed to update username', type: 'error' })
      }
    } catch (err) {
      console.error(err)
      setMessage({ text: 'Something went wrong', type: 'error' })
    }
  }

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-500 animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl py-12 mx-auto">
      {/* решта JSX без змін */}
    </div>
  )
}

export default UserProfile
