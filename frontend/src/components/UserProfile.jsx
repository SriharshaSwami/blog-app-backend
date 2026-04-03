import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cardClass, pageTitleClass, bodyText, primaryBtn, ghostBtn } from '../styles/common'
import { useAuth } from '../store/authStore'
import axios from 'axios'

function UserProfile() {
  const loading = useAuth(state => state.loading)
  const currentUser = useAuth(state => state.currentUser)
  const [articles, setArticles] = useState([])
  const [showArticles, setShowArticles] = useState(() => {
    return sessionStorage.getItem("userShowArticles") === "true"
  })
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    if (showArticles && articles.length === 0) {
      readAllArticles()
    }
  }, [])

  const readAllArticles = async () => {
    setFetchError(null)
    try {
      let res = await axios.get('http://localhost:4000/user-api/articles', { withCredentials: true })
      setArticles(res.data.payload || [])
      setShowArticles(true)
      sessionStorage.setItem("userShowArticles", "true")
    } catch (err) {
      setFetchError(err.response?.data?.error || 'Failed to fetch articles')
    }
  }

  const toggleShowArticles = () => {
    if (showArticles) {
      setShowArticles(false)
      sessionStorage.setItem("userShowArticles", "false")
    } else {
      readAllArticles()
    }
  }

  return (
    <div className={pageWrapper}>
      <div className={cardClass + ' text-center mb-16 py-12 border border-[#e8e8ed]'}>
        <h2 className={pageTitleClass}>Hello, {currentUser?.firstName || 'User'}</h2>
        
        <div className="relative w-28 h-28 mx-auto my-8">
            {currentUser && (currentUser.profileImageUrl || currentUser.profileImage) ? (
            <img
                className="rounded-full w-full h-full object-cover border-4 border-white shadow-sm"
                src={currentUser.profileImageUrl || currentUser.profileImage}
                alt="Profile"
            />
            ) : (
                <div className="w-full h-full rounded-full bg-[#0066cc] flex items-center justify-center text-white text-3xl font-bold">
                    {currentUser?.firstName?.charAt(0)}
                </div>
            )}
        </div>

        <p className={bodyText + " mb-10 text-lg"}>Discover new stories and manage your saved insights.</p>
        
        <div className="flex justify-center gap-4">
            <button className={primaryBtn + ' !px-10 !py-3 !text-base'} onClick={toggleShowArticles} disabled={loading}>
            {loading ? 'Crunching data...' : (showArticles ? 'Hide Insights' : 'Explore Articles')}
            </button>
        </div>

        {fetchError && <p className={errorClass + ' mt-6'}>{fetchError}</p>}
      </div>

      {showArticles && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <h3 className={headingClass + " mb-8"}>Latest Publications</h3>
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20'>
            {articles.length === 0 && <p className={emptyStateClass}>No articles found.</p>}
            {articles.map(article => (
                <div key={article._id || article.id} className={cardClass + ' flex flex-col border border-transparent hover:border-[#d2d2d7] !p-6'}>
                <span className={tagClass + " mb-3"}>{article.category}</span>
                <h3 className={articleTitle + ' mb-3 line-clamp-2'}>{article.title}</h3>
                <p className={articleExcerpt + ' mb-6 flex-grow line-clamp-3'}>
                    {article.content}
                </p>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#e8e8ed]">
                    <div className={timestampClass}>
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    </div>
                    <Link to={`/article/${article._id}`} state={article} className={ghostBtn}>
                    Read more &rarr;
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile