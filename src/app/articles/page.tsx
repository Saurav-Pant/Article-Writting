"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      {[...Array(2)].map((_, index) => (
        <li key={index} className="flex items-start justify-between">
          <div className="flex items-start w-full">
            <div className="w-32 h-6 bg-gray-100 rounded"></div>
            <div className="ml-2 h-6 bg-gray-100 rounded w-2/3"></div>
          </div>
          <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
        </li>
      ))}
    </ul>
  </div>
);

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchArticles();
  }, []);

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
          <h1 className="text-2xl font-bold mb-4
          text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Articles</h1>
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article.id} className="flex items-start justify-between">
                <div className="flex items-start">
                  <span className="w-32 flex-shrink-0 text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/articles/${article.id}`} className="text-blue-600 hover:underline">
                    {article.title}
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete article"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <ToastContainer />
    </div>
  );
}
