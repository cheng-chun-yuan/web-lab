import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 })
    }

    // Fetch user from DB using session.email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        author: user.name,
        content,
        avatar: user.avatar ?? null,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}