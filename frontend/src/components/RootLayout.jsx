import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { pageBackground, pageWrapper } from '../styles/common'
import { useAuth } from '../store/authStore'
import { loadingClass } from '../styles/common'
import { useEffect } from 'react'

function RootLayout() {
  const checkAuth = useAuth(state => state.checkAuth)
  const loading = useAuth(state => state.loading)
  //call the auth
  useEffect(() =>{
    //call check whenever page refreshed i.e RootLayout is rerendering
    console.log("RootLayout mounted, calling checkAuth...")
    checkAuth()
  }, [checkAuth])

  if(loading){
    return <p className= {loadingClass}>Loading...</p>
  }

  return (
    <div className={pageBackground + ' flex flex-col'}>
      <Header />
      <main className={pageWrapper + ' flex-1 w-full'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout