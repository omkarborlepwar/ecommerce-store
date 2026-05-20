import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  let where = {}
  if (category && category !== 'all') where.category = category
  if (search) where.name = { contains: search }

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}
