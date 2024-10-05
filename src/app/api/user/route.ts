import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, name, image } = await request.json()

    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: name,
        image: image,
      },
      create: {
        email: email,
        name: name,
        image: image,
      },
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error storing user:', error)
    return NextResponse.json({ error: 'Error storing user' }, { status: 500 })
  }
}
