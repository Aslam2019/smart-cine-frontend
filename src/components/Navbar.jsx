import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocation as useGeoLocation } from '../hooks/useLocation'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [authOpen, setAuthOpen]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const { user, logout }            = useAuth()
  const { locationName }            = useGeoLocation()
  const navigate                    = useNavigate()
  const location                    = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Home',     to: '/' },
    { label: 'Movies',   to: '/movies' },
    { label: 'Theatres', to: '/theatres' },
    { label: 'Profile',  to: '/profile' },
    ...(user?.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : [])
  ]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 5%', height:70,
        background: scrolled ? 'rgba(10,10,15,0.98)' : 'rgba(10,10,15,0.85)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)',
        transition:'background .3s'
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:'3px', color:'#F0F0F5', textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          SMART <span style={{ color:'#E8192C' }}>CINE</span>
          <span style={{ fontSize:'1rem', color:'rgba(255,255,255,0.3)', fontFamily:'Outfit,sans-serif', fontWeight:300, letterSpacing:1 }}>TRICHY</span>
        </Link>

        {/* Desktop Links */}
        <ul style={{ display:'flex', gap:'2rem', listStyle:'none', margin:0 }} className="hidden md:flex">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} style={{
                color: isActive(to) ? '#E8192C' : '#A0A0B0',
                textDecoration:'none', fontSize:'.9rem', fontWeight:500,
                letterSpacing:'.5px', transition:'color .2s'
              }}
                onMouseEnter={e => { if(!isActive(to)) e.target.style.color = '#E8192C' }}
                onMouseLeave={e => { if(!isActive(to)) e.target.style.color = '#A0A0B0' }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          {/* Location badge */}
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.8rem', color:'#F5C842', background:'rgba(245,200,66,0.1)', padding:'.35rem .8rem', borderRadius:20, border:'1px solid rgba(245,200,66,0.2)', cursor:'pointer', whiteSpace:'nowrap' }}>
            📍 {locationName}
          </div>

          {/* Auth button */}
          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
              <span style={{ fontSize:'.85rem', color:'#A0A0B0' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                style={{ padding:'.4rem 1rem', border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'#A0A0B0', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', cursor:'pointer', borderRadius:4, transition:'all .2s' }}
                onMouseEnter={e => { e.target.style.borderColor='#E8192C'; e.target.style.color='#E8192C' }}
                onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.15)'; e.target.style.color='#A0A0B0' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              style={{ padding:'.5rem 1.2rem', border:'1px solid #E8192C', background:'transparent', color:'#E8192C', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:600, cursor:'pointer', borderRadius:4, transition:'all .2s' }}
              onMouseEnter={e => { e.target.style.background='#E8192C'; e.target.style.color='#fff' }}
              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color='#E8192C' }}>
              Sign In
            </button>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{ background:'none', border:'none', color:'#F0F0F5', fontSize:'1.5rem', cursor:'pointer' }}>
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:'fixed', top:70, left:0, right:0, zIndex:999, background:'rgba(10,10,15,0.98)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'1rem 5%' }}>
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ display:'block', color:'#A0A0B0', textDecoration:'none', padding:'.75rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'.95rem', fontWeight:500 }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}
