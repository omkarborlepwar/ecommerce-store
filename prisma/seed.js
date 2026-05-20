const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@store.com', password: adminPassword, role: 'admin' }
  })

  await prisma.user.upsert({
    where: { email: 'user@store.com' },
    update: {},
    create: { name: 'John Doe', email: 'user@store.com', password: userPassword, role: 'customer' }
  })

  const products = [
    { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.', price: 149.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Electronics', stock: 25 },
    { name: 'Smart Watch', description: 'Fitness tracker with heart rate monitor, GPS, and 7-day battery.', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Electronics', stock: 15 },
    { name: 'Leather Backpack', description: 'Handcrafted genuine leather backpack with laptop compartment.', price: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'Fashion', stock: 30 },
    { name: 'Running Shoes', description: 'Lightweight mesh running shoes with responsive cushioning.', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Sports', stock: 20 },
    { name: 'Coffee Maker', description: 'Programmable 12-cup drip coffee maker with thermal carafe.', price: 79.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', category: 'Home', stock: 18 },
    { name: 'Sunglasses', description: 'Polarized UV400 protection aviator sunglasses.', price: 59.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'Fashion', stock: 40 },
    { name: 'Yoga Mat', description: 'Non-slip exercise yoga mat with carrying strap.', price: 34.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', category: 'Sports', stock: 35 },
    { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness and USB charging.', price: 44.99, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', category: 'Home', stock: 22 },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360-degree sound.', price: 69.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', category: 'Electronics', stock: 28 },
    { name: 'Cotton T-Shirt', description: 'Premium 100% organic cotton crew neck t-shirt.', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', category: 'Fashion', stock: 50 },
    { name: 'Water Bottle', description: 'Stainless steel insulated bottle, keeps drinks cold 24h.', price: 24.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', category: 'Sports', stock: 45 },
    { name: 'Plant Pot Set', description: 'Set of 3 ceramic plant pots with drainage holes.', price: 39.99, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', category: 'Home', stock: 12 }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name },
      update: {},
      create: { ...product, id: undefined }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
