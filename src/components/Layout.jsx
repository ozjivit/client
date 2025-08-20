import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'
import '../App.css'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { totalQuantity } = useCart()
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <div className="site-wrapper">
      <header className="navbar">
        <div className="brand">
          <NavLink to="/" className="logo">TB Beauty</NavLink>
        </div>
        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => { setOpen(false); setProfileOpen(false) }}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/rewards">Rewards</NavLink>
        </nav>
        <div className="nav-icons">
          <Link to="/search" className="icon-btn" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="profile" onClick={(e) => e.stopPropagation()}>
            <button
              className="icon-btn profile-btn"
              aria-label="Account"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              {user ? (
                <span className="avatar-circle" aria-hidden="true">{(user.username || user.email || '?').charAt(0).toUpperCase()}</span>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" fill="currentColor"/>
                </svg>
              )}
            </button>
            {profileOpen && (
              <div className="profile-menu" role="menu">
                {user ? (
                  <>
                    <div className="profile-header">Signed in as <strong>{user.username}</strong></div>
                    <button className="menu-item" onClick={() => { setProfileOpen(false); logout() }}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="menu-item" onClick={() => setProfileOpen(false)}>Login</Link>
                    <Link to="/signup" className="menu-item" onClick={() => setProfileOpen(false)}>Sign up</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Link to="/cart" className="icon-btn cart-icon" aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-1 5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
              <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
            </svg>
            {totalQuantity > 0 && <span className="cart-badge-dot" aria-hidden="true">{totalQuantity}</span>}
          </Link>
          <button className="nav-toggle icon-btn" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">TB Beauty</div>
          <div className="footer-meta">© {new Date().getFullYear()} TB Beauyt. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
} 