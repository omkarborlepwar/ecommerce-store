'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/auth/login?redirect=/account/orders'); return }
      setUser(d.user)
    })
  }, [router])

  useEffect(() => {
    if (!user) return
    fetch('/api/orders').then(r => r.json()).then(data => { setOrders(data); setLoading(false) })
  }, [user])

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', shipped: 'bg-blue-100 text-blue-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><p>Loading orders...</p></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {searchParams.get('success') && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">Order placed successfully!</div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                    <span className="flex-1">{item.product.name} x {item.quantity}</span>
                    <span>₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-3 flex justify-between">
                <span className="text-sm text-gray-500">Shipping: {order.address}, {order.city} {order.zip}</span>
                <span className="font-bold">Total: ₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  )
}
