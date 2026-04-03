import React from 'react'
import { cardClass, pageTitleClass, bodyText } from '../styles/common'

function Home() {
  return (
    <div className={cardClass + ' text-center'}>
      <h1 className={pageTitleClass + ' mb-3'}>Home</h1>
      <p className={bodyText}>Blog platform frontend setup completed.</p>
    </div>
  )
}

export default Home
