import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useCart } from '../state/CartContext.jsx'
import '../App.css'
import CartDrawer from './CartDrawer.jsx'
import { useUi } from '../state/UiContext.jsx'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { totalQuantity } = useCart()
  const { toggleCart } = useUi()
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (!profileRef.current) return
      if (!profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setProfileOpen(false)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])
  return (
    <div className="site-wrapper">
      <div className="announcement-bar" role="region" aria-label="Announcements">
        <div className="announcement-inner">
          <span>Free delivery over QAR 200</span>
          <span className="badge-dot" aria-hidden="true" />
          <span>Cash on Delivery available</span>
          <span className="badge-dot" aria-hidden="true" />
          <span>Support: +974 3080 069</span>
        </div>
      </div>
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
          <Link to="/search" className="icon-btn circle" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="profile" onClick={(e) => e.stopPropagation()} ref={profileRef}>
            <button
              className="icon-btn circle profile-btn"
              aria-label="Account"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
            >
              {user ? (
                <span className="avatar-circle" aria-hidden="true">{(user.username || user.email || '?').charAt(0).toUpperCase()}</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 20c0-3.3137 3.134  -6 7 -6s7 2.6863 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
            {profileOpen && (
              <div className="profile-menu" role="menu">
                {user ? (
                  <>
                    <div className="profile-header">Signed in as <strong>{user.username}</strong></div>
                    <NavLink to="/orders" className="menu-item" onClick={() => setProfileOpen(false)}>My Orders</NavLink>
                    {user?.isAdmin && <NavLink to="/admin" className="menu-item" onClick={() => setProfileOpen(false)}>Admin Dashboard</NavLink>}
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
          <button onClick={toggleCart} className="icon-btn cart-icon" aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-1 5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
              <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
            </svg>
            {totalQuantity > 0 && <span className="cart-badge-dot" aria-hidden="true">{totalQuantity}</span>}
          </button>
          <button className="nav-toggle icon-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
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
          <div className="footer-meta">© {new Date().getFullYear()} TB Beauty. All rights reserved.</div>
        </div>
      </footer>
      <CartDrawer />
    </div>
  )
} 