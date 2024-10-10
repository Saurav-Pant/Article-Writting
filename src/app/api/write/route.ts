import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/auth'
const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, title, date, content } = await request.json()
        const formattedDate = new Date(date)

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        let article
        if (id) {
            article = await prisma.article.update({
                where: { id },
                data: {
                    title,
                    date: formattedDate,
                    content,
                    authorId: user.id,
                },
            })
        } else {
            article = await prisma.article.create({
                data: {
                    title,
                    date: formattedDate,
                    content,
                    authorId: user.id,
                },
            })
        }

        return NextResponse.json(article, { status: 201 })
    } catch (error) {
        console.error('Error creating or updating blog post:', error)
        return NextResponse.json({ error: 'Error creating or updating blog post' }, { status: 500 })
    }
}
