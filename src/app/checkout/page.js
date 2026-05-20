'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, totalPrice, clearCart, loading } = useCart()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ address: '', city: '', zip: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) router.push('/auth/login?redirect=/checkout')
      else setUser(d.user)
    })
  }, [router])

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p>Loading...</p></div>

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-primary-600 hover:underline">Start shopping</Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.address || !form.city || !form.zip) { setMessage('Please fill in all fields'); return }
    setSubmitting(true)
    setMessage('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: totalPrice, ...form })
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      clearCart()
      router.push('/account/orders?success=true')
    } catch (err) {
      setMessage(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2 text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold">Shipping Details</h2>
        {user && <p className="text-sm text-gray-500">Logged in as: {user.name} ({user.email})</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="123 Main St" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="New York" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input type="text" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="10001" />
          </div>
        </div>

        {message && <p className={`text-sm ${message.includes('Failed') || message.includes('fill') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

        <button type="submit" disabled={submitting} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {submitting ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}
