'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

function ProductsContent() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    let url = '/api/products'
    const params = []
    if (category && category !== 'all') params.push(`category=${encodeURIComponent(category)}`)
    if (search) params.push(`search=${encodeURIComponent(search)}`)
    if (params.length) url += '?' + params.join('&')
    fetch(url).then(r => r.json()).then(data => { setProducts(data); setLoading(false) })
  }, [category, search])

  const categories = ['all', 'Electronics', 'Fashion', 'Home', 'Sports']

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
      {search && <p className="text-gray-500 mb-6">Search results for: &quot;{search}&quot;</p>}

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(c => (
          <a key={c} href={c === 'all' ? '/products' : `/products?category=${c}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {c === 'all' ? 'All' : c}
          </a>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found</p>
          <a href="/products" className="text-primary-600 hover:underline mt-2 inline-block">View all products</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><p>Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  )
}
