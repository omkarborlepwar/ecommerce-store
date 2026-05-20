'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, totalPrice, loading } = useCart()

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><p>Loading cart...</p></div>

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">Start Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cart.length} items)</h1>

      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
            <Link href={`/products/${item.id}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-primary-600">{item.name}</Link>
              <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
              <span className="px-3 py-1 font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
            </div>
            <div className="text-right">
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6 mt-6">
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-2xl text-primary-600">${totalPrice.toFixed(2)}</span>
        </div>
        {totalPrice < 50 && <p className="text-sm text-gray-500 mt-1">Add ${(50 - totalPrice).toFixed(2)} more for free shipping</p>}
        <Link href="/checkout" className="block text-center bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mt-4">
          Proceed to Checkout
        </Link>
        <Link href="/products" className="block text-center text-gray-600 py-2 mt-2 hover:text-primary-600">Continue Shopping</Link>
      </div>
    </div>
  )
}
