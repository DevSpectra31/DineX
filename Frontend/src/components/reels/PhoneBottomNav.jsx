import React from 'react'
import { NavLink } from 'react-router-dom'
import { HomeIcon, SavedIcon } from './ReelIcons'

const PhoneBottomNav = () => {
  return (
    <nav className="phone-bottom-nav" aria-label="Bottom navigation">
      <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
        <HomeIcon />
        <span>home</span>
      </NavLink>

      <NavLink to="/saved" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
        <SavedIcon />
        <span>saved</span>
      </NavLink>
    </nav>
  )
}

export default PhoneBottomNav
