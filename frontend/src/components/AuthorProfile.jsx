import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  cardClass, 
  pageTitleClass, 
  bodyText, 
  secondaryBtn, 
  primaryBtn,
  pageWrapper,
  headingClass
} from '../styles/common'
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
    <div className={pageWrapper}>
      <div className={cardClass + ' text-center mb-16 py-12 border border-[#e8e8ed]'}>
        <h2 className={pageTitleClass}>Author Workspace</h2>
        <p className={bodyText + " mb-10 text-lg max-w-xl mx-auto"}>Manage your publications, draft new stories, and engage with your readers.</p>

        <div className="flex justify-center gap-4">
          <button 
            className={primaryBtn + " !px-10 !py-3 !text-base"}
            onClick={toggleShowArticles}
          >
            {showArticles ? 'Hide My Articles' : 'View My Articles'}
          </button>
          <Link to="/add-article" className={secondaryBtn + " !px-10 !py-3 !text-base"}>
            + New Story
          </Link>
        </div>
      </div>

      {showArticles && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className={headingClass + " mb-8"}>Your Publications</h3>
            <AuthorArticles />
        </div>
      )}
    </div>
  )
}

export default AuthorProfile