import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}
