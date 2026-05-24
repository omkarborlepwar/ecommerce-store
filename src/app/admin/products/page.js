'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminProducts() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: 'General', stock: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user || d.user.role !== 'admin') { router.push('/'); return }
      setUser(d.user)
    })
  }, [router])

  const loadProducts = () => {
    fetch('/api/admin/products').then(r => r.json()).then(data => { setProducts(data); setLoading(false) })
  }

  useEffect(() => { if (user) loadProducts() }, [user])

  const resetForm = () => setForm({ name: '', description: '', price: '', image: '', category: 'General', stock: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }

    if (editing) {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...payload })
      })
    } else {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }
    setShowForm(false); setEditing(null); resetForm()
    loadProducts()
  }

  const handleEdit = (product) => {
    setForm({ name: product.name, description: product.description, price: product.price.toString(), image: product.image, category: product.category, stock: product.stock.toString() })
    setEditing(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    loadProducts()
  }

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(!showForm) }} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6 space-y-4">
          <h2 className="font-semibold">{editing ? 'Edit Product' : 'New Product'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                {['General', 'Electronics', 'Fashion', 'Home', 'Sports'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows="3" required />
            </div>
          </div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            {editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{product.category}</td>
                  <td className="p-4 text-sm">₹{Number(product.price).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-sm">{product.stock}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(product)} className="text-primary-600 hover:underline text-sm mr-3">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
