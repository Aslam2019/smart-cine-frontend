import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background:'#111118', borderTop:'1px solid rgba(255,255,255,0.08)', padding:'3rem 5% 2rem', textAlign:'center' }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:3, marginBottom:'.5rem' }}>
        SMART <span style={{ color:'#E8192C' }}>CINE</span> TRICHY
      </div>
      <p style={{ color:'#A0A0B0', fontSize:'.9rem', marginBottom:'.5rem' }}>
        Premium Cinema Booking for Trichy District
      </p>
      <div style={{ display:'flex', justifyContent:'center', gap:'1.5rem', margin:'1rem 0', flexWrap:'wrap' }}>
        {['LA Cinema', 'Ramba Theatre', 'Sona Mina', 'Kalaiarangam', 'Cauvery Theatre'].map(name => (
          <Link key={name} to="/theatres" style={{ color:'#606070', fontSize:'.8rem', textDecoration:'none', transition:'color .2s' }}
            onMouseEnter={e=>e.target.style.color='#E8192C'} onMouseLeave={e=>e.target.style.color='#606070'}>
            {name}
          </Link>
        ))}
      </div>
      <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'1.5rem 0' }} />
      <p style={{ color:'#606070', fontSize:'.8rem' }}>
        © 2025 Smart Cine Trichy. All rights reserved. · Built with ❤️ for Trichy cinema lovers.
      </p>
    </footer>
  )
}
