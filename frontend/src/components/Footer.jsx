import React from 'react'
import { mutedText, cardClass } from '../styles/common'

function Footer() {
  return (
    <div className={cardClass + ' ' + mutedText + ' text-center py-3'}>
      Blog app footer component
    </div>
  )
}

export default Footer
