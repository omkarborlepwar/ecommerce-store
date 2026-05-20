'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data)
      setFeatured(data.slice(0, 4))
    })
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Style</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Shop the latest trends with confidence. Quality products, fast delivery, and unbeatable prices.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">Shop Now</Link>
            <Link href="/products?category=Electronics" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">Electronics</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {['Electronics', 'Fashion', 'Home', 'Sports'].map(cat => (
            <Link key={cat} href={`/products?category=${cat}`} className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-4xl mb-2">{cat === 'Electronics' ? '⚡' : cat === 'Fashion' ? '👕' : cat === 'Home' ? '🏠' : '⚽'}</div>
              <h3 className="font-semibold text-gray-900">{cat}</h3>
              <p className="text-sm text-gray-500">Browse collection</p>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        {products.length > 4 && (
          <div className="text-center mt-10">
            <Link href="/products" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">View All Products</Link>
          </div>
        )}
      </section>

      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500">On orders over $50</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
              <p className="text-sm text-gray-500">SSL encrypted payments</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
