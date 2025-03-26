import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  _req: NextRequest
) {
  const { searchParams } = new URL(_req.url)
  const id = searchParams.get('id')
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ message: 'Missing message ID' }, { status: 400 })
    }

    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    })

    if (!message) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 })
    }

    if (message.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await prisma.message.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

