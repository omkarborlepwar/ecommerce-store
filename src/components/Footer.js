import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ShopWave</h3>
            <p className="text-sm">India ka apna store — quality products at best prices. Fast shipping across India and excellent customer service.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
              <li><Link href="/account" className="hover:text-white">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link href="/products?category=Fashion" className="hover:text-white">Fashion</Link></li>
              <li><Link href="/products?category=Home" className="hover:text-white">Home</Link></li>
              <li><Link href="/products?category=Sports" className="hover:text-white">Sports</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>care@shopwave.in</li>
              <li>1800-123-SHOP</li>
              <li>B-42, Sector 62, Noida,</li>
              <li>Uttar Pradesh 201309</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
