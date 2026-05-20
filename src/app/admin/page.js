'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user || d.user.role !== 'admin') { router.push('/'); return }
      setUser(d.user)
    })
  }, [router])

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json())
    ]).then(([products, orders]) => {
      const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
      setStats({ products: products.length, orders: orders.length, revenue })
    })
  }, [user])

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold text-primary-600">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/products" className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Manage Products</h2>
          <p className="text-sm text-gray-500">Add, edit, or remove products</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Manage Orders</h2>
          <p className="text-sm text-gray-500">View and update order status</p>
        </Link>
      </div>
    </div>
  )
}
