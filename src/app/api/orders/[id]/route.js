import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(request, { params }) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
    include: { items: { include: { product: true } } }
  })
  return NextResponse.json(order)
}
