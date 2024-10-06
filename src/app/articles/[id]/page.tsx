"use client"
import ShinyButton from '@/components/ui/shiny-button'
import { Edit3Icon, SwitchCameraIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas'

interface Article {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function page({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setArticle(data.article)
          setEditedTitle(data.article.title)
          setEditedContent(data.article.content)
        } else {
          setError(data.error || 'Failed to fetch article')
        }
      } catch (err) {
        setError('An error occurred while fetching the article')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleSave = async () => {
    if (!editedTitle || !editedContent) return

    try {
      const response = await fetch(`/api/article/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setArticle(data.article)
        setIsEditing(false)
      } else {
        setError('Failed to update the article')
      }
    } catch (err) {
      setError('An error occurred while saving the article')
    }
  }

  const handleScreenshot = async () => {
    const articleElement = document.querySelector('.article-container')
    if (articleElement) {
        // @ts-ignore
      const canvas = await html2canvas(articleElement)
      const image = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      link.href = image
      link.download = 'article_screenshot.png'
      link.click()
    }
  }


const SkeletonLoader = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
      </div>
      <div className="absolute top-4 right-4 flex space-x-2">
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}
  if (loading) return <SkeletonLoader />
  if (error) return <div className="max-w-2xl mx-auto p-4 text-red-500">Error: {error}</div>
  if (!article) return <div className="max-w-2xl mx-auto p-4">Article not found</div>

  return (
    <div className="relative">
      <div className="max-w-2xl mx-auto p-4 article-container">
        {isEditing ? (
          <>
            <input
              className="text-3xl font-bold mb-4 w-full bg-transparent outline-none"
              value={editedTitle || ''}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <div
              className="text-gray-300 outline-none"
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={(e) => setEditedContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: editedContent || '' }}
            />
            <ShinyButton
              className="absolute top-4 right-28 bg-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Save
            </ShinyButton>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-500 mb-4">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
            <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: article.content }} />
            <div>
              <ShinyButton
                className="absolute top-4 right-28 bg-white px-4 py-2 rounded"
                onClick={() => setIsEditing(true)}
              >
                <Edit3Icon size={16} />
              </ShinyButton>
            </div>
          </>
        )}
      </div>
      {/* <ShinyButton
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded"
        onClick={handleScreenshot}
      >
        <SwitchCameraIcon size={16} />
      </ShinyButton> */}
    </div>
  )
}
