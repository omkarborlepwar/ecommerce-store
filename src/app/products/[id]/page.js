'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => {
      if (!r.ok) { router.push('/products'); return null }
      return r.json()
    }).then(data => { setProduct(data); setLoading(false) })
  }, [id, router])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  )

  if (!product) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link> / <Link href="/products" className="hover:text-primary-600">Products</Link> / <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-600 mt-4">₹{Number(product.price).toLocaleString('en-IN')}</p>

          <div className="mt-2">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 text-sm">Out of Stock</span>
            )}
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

          {product.stock > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
              </div>
              <button onClick={() => { addItem(product, quantity); router.push('/cart') }} className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Add to Cart
              </button>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">✔ Free shipping on orders over ₹500</p>
            <p className="text-sm text-gray-600">✔ 30-day easy returns</p>
            <p className="text-sm text-gray-600">✔ Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  )
}
