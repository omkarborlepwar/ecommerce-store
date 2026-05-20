'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) router.push('/auth/login?redirect=/account')
      else setUser(d.user)
    })
  }, [router])

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <p><span className="text-gray-500">Name:</span> {user.name}</p>
        <p><span className="text-gray-500">Email:</span> {user.email}</p>
        <p><span className="text-gray-500">Role:</span> {user.role}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/account/orders" className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg">My Orders</h3>
          <p className="text-sm text-gray-500">View your order history</p>
        </Link>
        <Link href="/products" className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg">Shop</h3>
          <p className="text-sm text-gray-500">Browse our products</p>
        </Link>
      </div>
    </div>
  )
}
