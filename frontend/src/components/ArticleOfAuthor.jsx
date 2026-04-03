import React from 'react'
import AddArticle from './AddArticle'

function ArticleOfAuthor({ showAddForm = false }) {
  if (showAddForm) {
    return <AddArticle />
  }

  return (
    <div>
      <h3>ArticleOfAuthor</h3>
      <p>Author articles will come from API data.</p>
    </div>
  )
}

export default ArticleOfAuthor
