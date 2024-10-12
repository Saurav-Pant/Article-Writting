"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import BlurFade from "@/components/ui/blur-fade";


interface Article {
    id: string;
    createdAt: string;
    title: string;
}

const getArticles = async () => {
    const res = await fetch('/api/article', {
        method: 'GET',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch articles');
    }

    const data = await res.json();
    return data.articles;
};

const deleteArticle = async (id: string) => {
    const res = await fetch(`/api/article/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete article');
    }

    return await res.json();
};

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
        <ul className="space-y-2">
            {[...Array(5)].map((_, index) => (
                <li key={index} className="flex items-start justify-between">
                    <div className="flex items-start w-full">
                        <div className="w-32 h-6 bg-gray-100 rounded sm:w-20 sm:h-5 xs:w-16 xs:h-4"></div>
                        <div className="ml-2 h-6 bg-gray-100 rounded w-2/3 sm:w-1/2 sm:h-5 xs:w-1/3 xs:h-4"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-100 rounded-full sm:w-4 sm:h-4 xs:w-3 xs:h-3"></div>
                </li>
            ))}
        </ul>
    </div>
);

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/');
            } else {
                fetchArticles();
            }
        };

        checkSession();
    }, [router]);

    const fetchArticles = async () => {
        try {
            const articlesData = await getArticles();
            setArticles(articlesData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteArticle(id);
            toast.success('Article deleted successfully');
            fetchArticles();
        } catch (err: any) {
            toast.error('Failed to delete article');
            console.error(err);
        }
    };

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {loading ? (
                <SkeletonLoader />
            ) : articles.length === 0 ? (
                <div>No articles found.</div>
            ) : (
                <>
                  <BlurFade delay={0.05} inView>
                    <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Articles</h1>
                    </BlurFade>
                    <ul className="space-y-2">
                        {articles.map((article) => (
                                <BlurFade delay={0.05*3} inView>
                            <li key={article.id} className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <span className="w-32 flex-shrink-0 text-gray-500">
                                        {new Date(article.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
                                        {article.title}
                                    </Link>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            onClick={() => setSelectedArticleId(article.id)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Delete article"
                                            >
                                            <Trash2 size={20} />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-black text-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this article? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    if (selectedArticleId) {
                                                        handleDelete(selectedArticleId);
                                                        setSelectedArticleId(null);
                                                    }
                                                }}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700
                                                focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50
                                                transition-transform transform hover:scale-105 active:scale-95"
                                                >
                                                Yes, Delete
                                            </AlertDialogAction>
                                            <AlertDialogCancel asChild>
                                                <button className="bg-gray-300 text-black px-4 py-2 rounded  focus:outline-none                                                transition-transform transform hover:scale-105 active:scale-95">
                                                    Cancel
                                                </button>
                                            </AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                                                </BlurFade>
                        ))}
                    </ul>
                </>
            )}
            <ToastContainer />
        </div>
    );
};

export default ArticlesPage;
