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
        const res = await fetch('http://localhost:5000/api/auth/profile', {
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
  }, [mounted, router])

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

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: formData.username }),
      })

      if (res.ok) {
        const updated = await fetch('http://localhost:5000/api/auth/profile', {
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
      <div
        className={`overflow-hidden border rounded-md shadow-lg transition-colors duration-300
          ${theme === 'dark'
            ? 'bg-gray-900 border-gray-700 text-white'
            : 'bg-white border-gray-200 text-black'}`}
      >
        <div
          className={`flex items-center p-6 border-b transition-colors duration-300
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
        >
          <div
            className={`flex items-center justify-center w-16 h-16 mr-4 border-2 rounded-full shadow
              ${theme === 'dark'
                ? 'bg-gray-700 border-purple-500 shadow-purple-500/50'
                : 'bg-gray-100 border-blue-500 shadow-blue-500/30'}`}
          >
            <UserIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-blue-500'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm opacity-70">Manage your account information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-md text-sm font-medium
                ${message.type === 'success'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-black focus:ring-blue-500'}`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className={`w-full px-4 py-2 border rounded-md opacity-70 cursor-not-allowed
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-gray-400'
                  : 'bg-gray-100 border-gray-300 text-gray-500'}`}
            />
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className={`flex items-center px-6 py-3 font-medium rounded-md transition-colors duration-300
                ${theme === 'dark'
                  ? 'bg-gray-800 border border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-black'
                  : 'bg-white border border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white'}`}
            >
              <LogOutIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
            <button
              type="submit"
              className={`flex items-center px-6 py-3 font-medium rounded-md transition-colors duration-300
                ${theme === 'dark'
                  ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-600/40'
                  : 'bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/40'}`}
            >
              <SaveIcon className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserProfile
