'use client'

import { useState, useRef, useEffect } from 'react'
import { Bold, List, Quote, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

export default function Page() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession()
            if (!session) {
                window.location.href = '/'
            } else {
                setSession(session)
            }
        }
        fetchSession()
    }, [])



    if (!session) {
        return null
    }

    return <MonospacedDarkEditor />
}

function MonospacedDarkEditor() {
    const [id, setId] = useState<string | null>(null)
    const [title, setTitle] = useState('Title')
    const [date, setDate] = useState('2024-05-22')
    const [content, setContent] = useState('Start Writting....')
    const [isSaving, setIsSaving] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadArticle = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');
            if (articleId) {
                try {
                    const response = await fetch(`/api/article/${articleId}`);
                    if (response.ok) {
                        const article = await response.json();
                        setId(article.id);
                        setTitle(article.title);
                        setDate(article.date.split('T')[0]);
                        setContent(article.content);
                        if (contentRef.current) {
                            contentRef.current.innerHTML = article.content;
                        }
                    }
                } catch (error) {
                    console.error('Error loading article:', error);
                }
            }
        };
        loadArticle();
    }, []);


    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = content
        }
    }, [])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)

    const handleContentChange = () => {
        if (contentRef.current) {
            setContent(contentRef.current.innerHTML)
        }
    }

    const formatText = (command: string) => {
        document.execCommand(command, false, undefined)
        contentRef.current?.focus()
    }

    const handleTab = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            document.execCommand('insertHTML', false, '&emsp;&emsp;')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        handleTab(e)
        if (e.shiftKey && e.key === '"') {
            e.preventDefault()
            wrapSelectedTextWithQuotes()
        }
    }

    const wrapSelectedTextWithQuotes = () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            if (selectedText.startsWith('"') && selectedText.endsWith('"')) {
                const unquotedText = selectedText.slice(1, -1);
                range.deleteContents();
                range.insertNode(document.createTextNode(unquotedText));
            } else {
                const quotedText = `"${selectedText}"`;
                range.deleteContents();
                range.insertNode(document.createTextNode(quotedText));
            }

            contentRef.current?.focus();
        }
    };

    const saveBlogPost = async () => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    title,
                    date,
                    content,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save blog post')
            }

            const savedPost = await response.json()
            setId(savedPost.id)
            toast.success('Blog post saved successfully!')
        } catch (error:any) {
            console.error('Error saving blog post:', error)
            toast.error(`Failed to save blog post: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen text-white p-8 font-mono">
            <div className="max-w-3xl mx-auto space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="text-4xl font-bold mb-4 w-full bg-transparent text-white outline-none transition-all focus:border-white border-b border-transparent"
                />
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="text-gray-400 bg-transparent w-full outline-none transition-all border-b border-transparent focus:border-white"
                />
                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={() => formatText('bold')}
                        className="p-2 rounded transition-colors hover:bg-gray-700"
                        aria-label="Bold"
                    >
                        <Bold size={20} />
                    </button>
                    <button
                        onClick={() => formatText('insertUnorderedList')}
                        className="p-2 rounded transition-colors hover:bg-gray-700"
                        aria-label="Insert Unordered List"
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={wrapSelectedTextWithQuotes}
                        className="p-2 rounded transition-colors hover:bg-gray-700"
                        aria-label="Insert Quotes"
                    >
                        <Quote size={20} />
                    </button>
                    <button
                        onClick={saveBlogPost}
                        disabled={isSaving}
                        className="p-2 rounded transition-colors bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed ml-auto"
                        aria-label="Save Blog Post"
                    >
                        <Save size={20} />
                    </button>
                </div>
                <div
                    ref={contentRef}
                    contentEditable
                    onInput={handleContentChange}
                    onKeyDown={handleKeyDown}
                    className="min-h-[50vh] focus:outline-none prose prose-invert max-w-none text-base leading-relaxed text-white"
                    aria-label="Blog post content"
                />
            </div>
        </div>
    )
}
