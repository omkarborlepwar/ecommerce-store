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
    create: { name: 'Rahul Sharma', email: 'user@store.com', password: userPassword, role: 'customer' }
  })

  const products = [
    { name: 'iPhone 15', description: 'Apple iPhone 15 with 48MP camera, A16 Bionic chip, and 6.1-inch Super Retina display.', price: 79999, image: 'https://images.unsplash.com/photo-1696446702182-438b4214fe38?w=500', category: 'Electronics', stock: 15 },
    { name: 'Samsung Galaxy Watch 6', description: 'Smartwatch with fitness tracking, heart rate monitor, and 3-day battery.', price: 24999, image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72d9?w=500', category: 'Electronics', stock: 20 },
    { name: 'Woodland Leather Backpack', description: 'Genuine leather backpack with 15.6-inch laptop compartment and USB charging port.', price: 3999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', category: 'Fashion', stock: 25 },
    { name: 'Campus Running Shoes', description: 'Lightweight mesh running shoes with memory foam sole for all-day comfort.', price: 1999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Sports', stock: 30 },
    { name: 'Prestige Pressure Cooker', description: '5-liter stainless steel pressure cooker with safety valve and 5-year warranty.', price: 2499, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', category: 'Home', stock: 22 },
    { name: 'Ray-Ban Sunglasses', description: 'Premium polarized UV400 aviator sunglasses with gold frame.', price: 5499, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'Fashion', stock: 35 },
    { name: 'Yoga Mat Premium', description: 'Extra thick 6mm non-slip exercise yoga mat with carrying strap and alignment lines.', price: 1499, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', category: 'Sports', stock: 40 },
    { name: 'Philips LED Desk Lamp', description: 'LED desk lamp with 3 brightness levels, USB charging port, and eye-care technology.', price: 2499, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', category: 'Home', stock: 18 },
    { name: 'JBL Bluetooth Speaker', description: 'Portable waterproof speaker with 20-hour battery and deep bass.', price: 4999, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', category: 'Electronics', stock: 25 },
    { name: 'Peter England Shirt', description: 'Premium 100% cotton formal shirt, wrinkle-free and breathable fabric.', price: 1299, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', category: 'Fashion', stock: 50 },
    { name: 'Milton Water Bottle', description: 'Stainless steel insulated 1L bottle, keeps water cold for 24 hours.', price: 999, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', category: 'Sports', stock: 45 },
    { name: 'Pothos Plant Pot', description: 'Set of 3 ceramic plant pots with bamboo stand — perfect for home decor.', price: 1599, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', category: 'Home', stock: 15 }
  ]

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.product.createMany({ data: products })

  console.log('Database seeded successfully!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
