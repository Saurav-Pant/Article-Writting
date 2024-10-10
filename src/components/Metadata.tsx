import { Metadata } from 'next'

type Props = {
    params: { id: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/article/${params.id}`)
        const data = await response.json()

        return {
            title: data.article.title,
            description: data.article.content.substring(0, 150),
        }
    } catch (error) {
        console.error('Error fetching metadata:', error)
        return {
            title: 'Article',
            description: 'Article description',
        }
    }
}
