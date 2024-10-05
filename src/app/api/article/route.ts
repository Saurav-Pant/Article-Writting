import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/server/auth';

const prisma = new PrismaClient()

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const articles = await prisma.article.findMany({
            where: { authorId: user.id },
            select: { id: true, title: true, createdAt: true, content: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ articles }, { status: 200 });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: 'An error occurred while fetching the articles' }, { status: 500 });
    }
}
