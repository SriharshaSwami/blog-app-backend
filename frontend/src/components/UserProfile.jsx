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
    <div className='max-w-6xl mx-auto'>
      <div className={cardClass + ' text-center mb-8'}>
        <h2 className={pageTitleClass}>User Profile</h2>
        {currentUser && (currentUser.profileImageUrl || currentUser.profileImage) && (
          <img
            className="mx-auto rounded-full w-24 h-24 object-cover border border-[#d2d2d7] mb-4"
            src={currentUser.profileImageUrl || currentUser.profileImage}
            alt="Profile"
          />
        )}
        <p className={bodyText}>Welcome to your user dashboard.</p>
        <button className={primaryBtn + ' mt-6'} onClick={toggleShowArticles} disabled={loading}>
          {loading ? 'Loading...' : (showArticles ? 'Hide articles' : 'Read all articles')}
        </button>
        {fetchError && <p className='text-red-600 mt-2 text-sm'>{fetchError}</p>}
      </div>

      {showArticles && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 pb-10'>
          {articles.length === 0 && <p className='col-span-full text-center text-gray-500 py-10'>No articles found.</p>}
          {articles.map(article => (
            <div key={article._id || article.id} className={cardClass + ' flex flex-col'}>
              <h3 className='text-xl font-semibold mb-3 tracking-tight'>{article.title}</h3>
              <p className={bodyText + ' mb-4 flex-grow'}>
                {article.content?.slice(0, 150) || ''}
                {article.content && article.content.length > 150 ? '...' : ''}
              </p>
              
              <div className="flex justify-between items-center mt-auto border-t border-[#d2d2d7]/30 pt-4">
                <div className='text-[10px] text-gray-400 uppercase tracking-widest'>
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
                </div>
                <Link to={`/article/${article._id}`} state={article} className={primaryBtn + " !px-4 !py-1 !text-xs"}>
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserProfile