import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { cardClass, pageTitleClass, bodyText, primaryBtn, timestampClass, tagClass, divider, articlePageWrapper } from '../styles/common'

function ArticleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [article, setArticle] = useState(location.state || null)
    const [loading, setLoading] = useState(!location.state)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`http://localhost:4000/common-api/articles/${id}`, { withCredentials: true })
                console.log("Fetch success - Payload:", res.data.payload)
                setArticle(res.data.payload)
            } catch (err) {
                console.error("Fetch error:", err)
                setError(err.response?.data?.message || "Failed to load article")
            } finally {
                setLoading(false)
            }
        }

        // Fetch if we don't have the full article or if author is not populated
        const isAuthorPopulated = article?.author && typeof article.author === 'object';
        if (!article || !article.content || !isAuthorPopulated) {
            fetchArticle()
        }
    }, [id])

    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        })
    }

    const isEdited = article && article.updatedAt && new Date(article.updatedAt) > new Date(new Date(article.createdAt).getTime() + 1000)

    if (loading) return <div className="text-center py-20 text-[#6e6e73] animate-pulse">Loading article...</div>
    if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>
    
    if (!article) return (
        <div className="text-center py-20">
            <p className="text-red-500 font-semibold mb-4 text-lg">Article Not Found</p>
            <button onClick={() => navigate(-1)} className={primaryBtn}>Go Back</button>
        </div>
    )

    return (
        <div className={articlePageWrapper}>
            <button onClick={() => navigate(-1)} className="mb-10 text-[#0066cc] hover:text-[#004499] text-sm font-medium flex items-center gap-1.5 transition-all hover:-translate-x-1">
                ← Back
            </button>

            <header className="mb-12">
                <div className={tagClass + " mb-5 bg-[#0066cc]/5 text-[#0066cc] px-3 py-1 rounded-full text-[10px]"}>
                    {article.category}
                </div>
                <h1 className={pageTitleClass + " !text-4xl md:!text-5xl"}>{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                    <div className="flex items-center gap-2.5">
                        {article.author?.profileImageUrl ? (
                            <img src={article.author.profileImageUrl} alt={article.author.firstName} className="w-9 h-9 rounded-full object-cover border border-[#d2d2d7]" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-[#0066cc] flex items-center justify-center text-white text-xs font-bold">
                                {article.author?.firstName?.charAt(0)}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-[#1d1d1f]">
                                {article.author?.firstName} {article.author?.lastName || ''}
                            </span>
                            <span className="text-[11px] text-[#6e6e73] font-medium">Verified Author</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-[#d2d2d7] hidden sm:block"></div>

                    <div className="flex flex-col">
                        <span className={timestampClass + " font-medium text-[#1d1d1f]"}>
                            Published: {formatDate(article.createdAt)}
                        </span>
                        {isEdited && (
                            <span className="text-[10px] text-[#0066cc] font-medium uppercase tracking-wider">
                                Edited: {formatDate(article.updatedAt)}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className={divider}></div>

            <article className="prose prose-blue max-w-none">
                <div className={bodyText + " text-lg leading-relaxed whitespace-pre-wrap"}>
                    {article.content}
                </div>
            </article>

            <div className={divider}></div>

            {/* Comments Section placeholder */}
            <section className="mt-10">
                <h3 className="text-xl font-bold mb-6">Comments ({article.comments?.length || 0})</h3>
                {article.comments?.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {article.comments.map((comment, index) => (
                            <div key={index} className="bg-[#f5f5f7] p-4 rounded-xl">
                                <p className="text-sm font-semibold mb-1">User</p>
                                <p className="text-sm text-[#6e6e73]">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#a1a1a6] italic">No comments yet.</p>
                )}
            </section>
        </div>
    )
}

export default ArticleDetail
