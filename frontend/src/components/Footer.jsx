import React from 'react'
import { mutedText, divider, pageWrapper } from '../styles/common'

function Footer() {
  return (
    <footer className={pageWrapper + " !py-8 mt-auto"}>
      <div className={divider}></div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className={mutedText}>
          Copyright © 2026 Blog App Inc. All rights reserved.
        </p>
        <div className="flex gap-6">
            <span className={mutedText + " hover:text-[#1d1d1f] cursor-pointer transition-colors"}>Privacy Policy</span>
            <span className={mutedText + " hover:text-[#1d1d1f] cursor-pointer transition-colors"}>Terms of Use</span>
            <span className={mutedText + " hover:text-[#1d1d1f] cursor-pointer transition-colors"}>Legal</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
