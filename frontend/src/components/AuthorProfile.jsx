import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { cardClass, pageTitleClass, bodyText, secondaryBtn } from '../styles/common'
import AuthorArticles from './AuthorArticles'

function AuthorProfile() {
  const [showArticles, setShowArticles] = useState(() => {
    return sessionStorage.getItem("authorShowArticles") === "true"
  })

  const toggleShowArticles = () => {
    const newVal = !showArticles
    setShowArticles(newVal)
    sessionStorage.setItem("authorShowArticles", newVal)
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <div className={cardClass + ' text-center mb-12'}>
        <h2 className={pageTitleClass}>Author Profile</h2>
        <p className={bodyText + " mb-8"}>Welcome to your author dashboard. Manage your stories and insights here.</p>

        <div className="flex justify-center gap-6">
          <button 
            className="bg-[#0066cc] text-white font-semibold px-8 py-2.5 rounded-full hover:bg-[#004499] transition-colors"
            onClick={toggleShowArticles}
          >
            {showArticles ? 'Hide My Articles' : 'My Articles'}
          </button>
          <Link to="/add-article" className={secondaryBtn + " !px-8 !py-2.5"}>
            + Add New Article
          </Link>
        </div>
      </div>

      {showArticles && (
        <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-[#1d1d1f]">Your Publications</h3>
            <AuthorArticles />
        </div>
      )}
    </div>
  )
}

export default AuthorProfile