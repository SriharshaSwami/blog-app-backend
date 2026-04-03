import React from 'react'
import { cardClass, pageTitleClass, bodyText } from '../styles/common'

function AdminProfile() {
  return (
    <div className={cardClass + ' text-center'}>
      <h2 className={pageTitleClass}>Admin Profile</h2>
      <p className={bodyText}>Welcome to your admin dashboard.</p>
    </div>
  )
}

export default AdminProfile