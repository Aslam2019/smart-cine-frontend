import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [authOpen, setAuthOpen]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { user, logout }          = useAuth()
  const navigate                  = useNavigate()
  const location                  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location])

 const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Movies',   to: '/movies' },
  { label: 'Theatres', to: '/theatres' },
  { label: 'Profile',  to: '/profile' },
  { label: 'Admin',    to: '/admin' },
]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      {/* MAIN NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4%', height: 60,
        background: scrolled ? 'rgba(10,10,15,0.98)' : 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background .3s'
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: '1.6rem', letterSpacing: '3px',
          color: '#F0F0F5', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 6,
          flexShrink: 0
        }}>
          SMART <span style={{ color: '#E8192C' }}>CINE</span>
        </Link>

        {/* Desktop Links — hidden on mobile */}
        <ul style={{
          display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0,
          '@media(max-width:768px)': { display: 'none' }
        }} className="desktop-nav">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} style={{
                color: isActive(to) ? '#E8192C' : '#A0A0B0',
                textDecoration: 'none', fontSize: '.88rem', fontWeight: 500,
                letterSpacing: '.5px', transition: 'color .2s'
              }}
                onMouseEnter={e => { if (!isActive(to)) e.target.style.color = '#E8192C' }}
                onMouseLeave={e => { if (!isActive(to)) e.target.style.color = '#A0A0B0' }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          {/* Auth button — desktop */}
          <div className="desktop-nav">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ fontSize: '.82rem', color: '#A0A0B0' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <button onClick={logout}
                  style={{ padding: '.35rem .8rem', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#A0A0B0', fontFamily: 'Outfit,sans-serif', fontSize: '.78rem', cursor: 'pointer', borderRadius: 4 }}
                  onMouseEnter={e => { e.target.style.borderColor = '#E8192C'; e.target.style.color = '#E8192C' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#A0A0B0' }}>
                  Out
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)}
                style={{ padding: '.4rem 1rem', border: '1px solid #E8192C', background: 'transparent', color: '#E8192C', fontFamily: 'Outfit,sans-serif', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', borderRadius: 4, transition: 'all .2s' }}
                onMouseEnter={e => { e.target.style.background = '#E8192C'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#E8192C' }}>
                Sign In
              </button>
            )}
          </div>

          {/* Hamburger menu — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-nav"
            style={{
              background: menuOpen ? 'rgba(232,25,44,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${menuOpen ? 'rgba(232,25,44,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: menuOpen ? '#E8192C' : '#F0F0F5',
              width: 38, height: 38, borderRadius: 8,
              cursor: 'pointer', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s'
            }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 999,
          background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '1rem 0',
          animation: 'slideDown .2s ease'
        }}>
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '.9rem 5%',
                color: isActive(to) ? '#E8192C' : '#F0F0F5',
                textDecoration: 'none',
                fontSize: '1rem', fontWeight: isActive(to) ? 700 : 400,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background .15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,25,44,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span>{label}</span>
              {isActive(to) && <span style={{ color: '#E8192C', fontSize: '.8rem' }}>●</span>}
            </Link>
          ))}

          {/* Auth section in mobile menu */}
          <div style={{ padding: '1rem 5% .5rem' }}>
            {user ? (
              <div>
                <div style={{ fontSize: '.82rem', color: '#A0A0B0', marginBottom: '.75rem' }}>
                  Signed in as <strong style={{ color: '#F0F0F5' }}>{user.name}</strong>
                </div>
                <button onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}
                  style={{ width: '100%', padding: '.75rem', background: 'transparent', color: '#E8192C', border: '1px solid rgba(232,25,44,0.3)', fontFamily: 'Outfit,sans-serif', fontWeight: 600, cursor: 'pointer', borderRadius: 8, fontSize: '.9rem' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => { setAuthOpen(true); setMenuOpen(false) }}
                style={{ width: '100%', padding: '.85rem', background: '#E8192C', color: '#fff', border: 'none', fontFamily: 'Outfit,sans-serif', fontWeight: 700, cursor: 'pointer', borderRadius: 8, fontSize: '1rem', letterSpacing: '.5px' }}>
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav  { display: none !important; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav  { display: flex !important; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
