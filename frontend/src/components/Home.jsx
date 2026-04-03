import React from 'react'
import { Link } from 'react-router-dom'
import { 
  pageTitleClass, 
  bodyText, 
  primaryBtn, 
  pageWrapper,
  section
} from '../styles/common'

function Home() {
  return (
    <div className={pageWrapper + " flex flex-col items-center text-center justify-center min-h-[70vh]"}>
      <div className={section}>
        <h1 className={pageTitleClass + " mb-6"}>
          The future of <span className="text-[#0066cc]">insights</span>.
        </h1>
        <p className={bodyText + " text-xl max-w-2xl mx-auto mb-10"}>
          A minimalist platform for thinkers, builders, and dreamers to share their stories with the world. Clean, focused, and powerful.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className={primaryBtn + " !px-10 !py-4 !text-base"}>
            Get Started
          </Link>
          <Link to="/login" className="text-[#0066cc] font-medium hover:underline text-lg flex items-center gap-1 opacity-90 hover:opacity-100">
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
