import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    let visitor = await prisma.visitor.findFirst()
    
    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          count: 1
        }
      })
    } else {
      visitor = await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          count: visitor.count + 1
        }
      })
    }

    return NextResponse.json({ count: visitor.count })
  } catch (error) {
    console.error('Failed to update visitor count:', error)
    return NextResponse.json({ error: 'Failed to update visitor count' }, { status: 500 })
  }
}
