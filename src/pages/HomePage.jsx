import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { moviesAPI } from '../api'
import { useLocation } from '../hooks/useLocation'
import MovieCard from '../components/MovieCard'
import TheatreCard from '../components/TheatreCard'

export default function HomePage() {
  const [movies, setMovies]   = useState([])
  const [loading, setLoading] = useState(true)
  const heroRef               = useRef(null)
  const navigate              = useNavigate()
  const { nearbyTheatres, locationName } = useLocation()

  const FALLBACK_MOVIES = [
  { _id:'1', title:'Karuppu', genre:['Action','Thriller'], language:'Tamil', duration:165, year:2026, rating:{ tmdb:8.2 } },
  { _id:'2', title:'Jananayagan', genre:['Political Drama'], language:'Tamil', duration:180, year:2026, rating:{ tmdb:8.7 } },
  { _id:'3', title:'Mankatha', genre:['Crime','Thriller'], language:'Tamil', duration:158, year:2011, rating:{ tmdb:8.5 } },
  { _id:'4', title:'Vallavan', genre:['Romance','Action'], language:'Tamil', duration:163, year:2006, rating:{ tmdb:7.8 } }
]

const FALLBACK_THEATRES = [
  { _id:'t1', name:'LA Cinema', address:{ full:'#12, Salai Rd, Srirangam, Trichy' }, amenities:['Dolby Atmos','4K Laser'], location:{ coordinates:[78.6930,10.8651] }, rating:4.6, emoji:'🎬', gradient:'linear-gradient(135deg,#1A0505,#2D0808)', distance:2.1 },
  { _id:'t2', name:'Ramba Theatre', address:{ full:'#78, Anna Salai, Cantonment, Trichy' }, amenities:['Dolby Digital','HD Screen'], location:{ coordinates:[78.6856,10.8050] }, rating:4.2, emoji:'🎭', gradient:'linear-gradient(135deg,#050A1A,#080D2D)', distance:3.5 },
  { _id:'t3', name:'Sona Mina', address:{ full:'#45, Bharathidasan Rd, Woraiyur, Trichy' }, amenities:['3D Enabled','Snack Bar'], location:{ coordinates:[78.7130,10.7905] }, rating:4.0, emoji:'⭐', gradient:'linear-gradient(135deg,#1A1505,#2D2008)', distance:4.2 },
  { _id:'t4', name:'Kalaiarangam', address:{ full:'Teppakulam, Trichy' }, amenities:['Large Screen','AC Hall'], location:{ coordinates:[78.6957,10.8100] }, rating:3.9, emoji:'🏛️', gradient:'linear-gradient(135deg,#0A1505,#0D2008)', distance:5.1 },
  { _id:'t5', name:'Cauvery Theatre', address:{ full:'#23, Mettu St, K.K. Nagar, Trichy' }, amenities:['Dolby Sound','Premium Seats'], location:{ coordinates:[78.7052,10.8215] }, rating:4.4, emoji:'🌊', gradient:'linear-gradient(135deg,#05151A,#08202D)', distance:6.3 }
]

const FALLBACK_MOVIES = [
  { _id:'1', title:'Karuppu', genre:['Action','Thriller'], language:'Tamil', duration:165, year:2026, rating:{ tmdb:8.2 } },
  { _id:'2', title:'Jananayagan', genre:['Political Drama'], language:'Tamil', duration:180, year:2026, rating:{ tmdb:8.7 } },
  { _id:'3', title:'Mankatha', genre:['Crime','Thriller'], language:'Tamil', duration:158, year:2011, rating:{ tmdb:8.5 } },
  { _id:'4', title:'Vallavan', genre:['Romance','Action'], language:'Tamil', duration:163, year:2006, rating:{ tmdb:7.8 } }
]

const FALLBACK_THEATRES = [
  { _id:'t1', name:'LA Cinema', address:{ full:'#12, Salai Rd, Srirangam, Trichy' }, amenities:['Dolby Atmos','4K Laser'], location:{ coordinates:[78.6930,10.8651] }, rating:4.6, emoji:'🎬', gradient:'linear-gradient(135deg,#1A0505,#2D0808)', distance:2.1 },
  { _id:'t2', name:'Ramba Theatre', address:{ full:'#78, Anna Salai, Cantonment, Trichy' }, amenities:['Dolby Digital','HD Screen'], location:{ coordinates:[78.6856,10.8050] }, rating:4.2, emoji:'🎭', gradient:'linear-gradient(135deg,#050A1A,#080D2D)', distance:3.5 },
  { _id:'t3', name:'Sona Mina', address:{ full:'#45, Bharathidasan Rd, Woraiyur, Trichy' }, amenities:['3D Enabled','Snack Bar'], location:{ coordinates:[78.7130,10.7905] }, rating:4.0, emoji:'⭐', gradient:'linear-gradient(135deg,#1A1505,#2D2008)', distance:4.2 },
  { _id:'t4', name:'Kalaiarangam', address:{ full:'Teppakulam, Trichy' }, amenities:['Large Screen','AC Hall'], location:{ coordinates:[78.6957,10.8100] }, rating:3.9, emoji:'🏛️', gradient:'linear-gradient(135deg,#0A1505,#0D2008)', distance:5.1 },
  { _id:'t5', name:'Cauvery Theatre', address:{ full:'#23, Mettu St, K.K. Nagar, Trichy' }, amenities:['Dolby Sound','Premium Seats'], location:{ coordinates:[78.7052,10.8215] }, rating:4.4, emoji:'🌊', gradient:'linear-gradient(135deg,#05151A,#08202D)', distance:6.3 }
]

useEffect(() => {
  moviesAPI.getNowShowing()
    .then(res => setMovies(res.data.movies?.length ? res.data.movies : FALLBACK_MOVIES))
    .catch(() => setMovies(FALLBACK_MOVIES))
    .finally(() => setLoading(false))
}, [])

  // Parallax on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ paddingTop: 70 }}>

      {/* ── HERO ── */}
      <section style={{ height:'100vh', position:'relative', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0A0A0F 0%,#1A0A0F 40%,#0F0A1A 100%)' }} />
        {/* Animated grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)', backgroundSize:'60px 60px', animation:'gridMove 20s linear infinite' }} />
        {/* Spotlight */}
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:700, height:700, background:'radial-gradient(circle,rgba(232,25,44,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, padding:'0 5%', maxWidth:750 }}>
          <div className="animate-fade-up" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(232,25,44,0.15)', border:'1px solid rgba(232,25,44,0.3)', padding:'.4rem 1rem', borderRadius:20, fontSize:'.8rem', color:'#E8192C', letterSpacing:2, fontWeight:600, marginBottom:'1.5rem' }}>
            <span style={{ width:6, height:6, background:'#E8192C', borderRadius:'50%', animation:'pulseDot 2s infinite' }} />
            🎬 NOW PLAYING IN TRICHY
          </div>
          <h1 className="animate-fade-up delay-100" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(4rem,9vw,8rem)', lineHeight:.95, letterSpacing:2, opacity:0 }}>
            THE CINEMA<br />EXPERIENCE<br /><span style={{ color:'#E8192C' }}>REIMAGINED</span>
          </h1>
          <p className="animate-fade-up delay-200" style={{ fontSize:'1.1rem', color:'#A0A0B0', margin:'1.5rem 0 2.5rem', lineHeight:1.7, fontWeight:300, opacity:0 }}>
            Premium movie booking for Trichy's finest theatres. Discover movies, book seats, and enjoy world-class entertainment — all in one place.
          </p>
          <div className="animate-fade-up delay-300" style={{ display:'flex', gap:'1rem', flexWrap:'wrap', opacity:0 }}>
            <button className="btn-primary" onClick={() => navigate('/movies')}>Browse Movies</button>
            <button className="btn-outline" onClick={() => navigate('/theatres')}>Find Theatres</button>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-400" style={{ position:'absolute', bottom:'3rem', left:'5%', display:'flex', gap:'4rem', opacity:0 }}>
          {[{ num:'5', label:'Theatres' }, { num:'12+', label:'Movies' }, { num:'4K', label:'Seats' }].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.5rem', color:'#E8192C', letterSpacing:1 }}>{s.num}</div>
              <div style={{ fontSize:'.75rem', color:'#606070', letterSpacing:2, textTransform:'uppercase', marginTop:'.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:'3rem', right:'5%', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:'.7rem', color:'#606070', letterSpacing:2, writingMode:'vertical-rl' }}>SCROLL</span>
          <div style={{ width:1, height:50, background:'linear-gradient(to bottom,#E8192C,transparent)', animation:'scrollAnim 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── LOCATION BAR ── */}
      <div style={{ background:'#111118', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'1rem 5%', display:'flex', alignItems:'center', gap:'2rem', overflowX:'auto', whiteSpace:'nowrap' }}>
        <span style={{ fontSize:'.85rem', color:'#606070', flexShrink:0 }}>📍 {locationName} · Nearby:</span>
        {nearbyTheatres.slice(0, 5).map((t, i) => (
          <div key={t._id || i}
            onClick={() => navigate('/theatres')}
            style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.85rem', color: i === 0 ? '#E8192C' : '#A0A0B0', cursor:'pointer', flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.color='#E8192C'}
            onMouseLeave={e => e.currentTarget.style.color= i===0 ? '#E8192C' : '#A0A0B0'}>
            🎭 {t.name}
            {t.distance && <span style={{ fontSize:'.7rem', color:'#F5C842', background:'rgba(245,200,66,0.1)', padding:'2px 8px', borderRadius:10 }}>{t.distance} km</span>}
          </div>
        ))}
      </div>

      {/* ── MOVIES ── */}
      <section style={{ padding:'6rem 5%' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div className="section-tag">Now Showing</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', letterSpacing:2, lineHeight:1 }}>CURRENT RELEASES</h2>
          <p style={{ color:'#A0A0B0', fontSize:'1rem', marginTop:'.75rem', fontWeight:300 }}>Catch the latest blockbusters playing in Trichy's top theatres</p>
        </div>
        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#606070', fontSize:'1.1rem' }}>Loading movies...</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.5rem' }}>
            {movies.map((m, i) => <MovieCard key={m._id} movie={m} idx={i} />)}
          </div>
        )}
      </section>

      {/* ── THEATRES ── */}
      <section style={{ padding:'6rem 5%', background:'#111118', margin:'0' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div className="section-tag">Venues</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', letterSpacing:2, lineHeight:1 }}>FEATURED THEATRES</h2>
          <p style={{ color:'#A0A0B0', fontSize:'1rem', marginTop:'.75rem', fontWeight:300 }}>Premium cinema halls across Trichy district, sorted by proximity</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.5rem' }}>
          {(nearbyTheatres.length ? nearbyTheatres : FALLBACK_THEATRES).slice(0, 4).map(t => (
            <TheatreCard key={t._id} theatre={t} onSelectTime={(th, time) => navigate(`/theatres`)} />
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <button className="btn-outline" onClick={() => navigate('/theatres')}>View All Theatres →</button>
        </div>
      </section>

      {/* ── WHY SECTION ── */}
      <section style={{ padding:'6rem 5%' }}>
        <div style={{ marginBottom:'3rem', textAlign:'center' }}>
          <div className="section-tag" style={{ justifyContent:'center' }}>Why Choose Us</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,4vw,3.5rem)', letterSpacing:2 }}>THE SMART CINE DIFFERENCE</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.5rem' }}>
          {[
            { emoji:'📍', title:'Location-Based', desc:'Automatically detects your location and shows nearest theatres in Trichy sorted by distance.' },
            { emoji:'🎬', title:'Auto Trailers', desc:'Click any movie to watch the trailer automatically. Immersive full-screen cinematic experience.' },
            { emoji:'🎟️', title:'Instant Booking', desc:'Select seats, pay securely, and get your QR ticket instantly. No queues, no hassle.' },
            { emoji:'⭐', title:'Premium Screens', desc:'All theatres feature premium sound systems including Dolby Atmos, 4K laser projection.' }
          ].map(item => (
            <div key={item.title} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.75rem', transition:'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(232,25,44,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
              <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>{item.emoji}</div>
              <h3 style={{ fontWeight:700, fontSize:'1.1rem', marginBottom:'.5rem', color:'#F0F0F5' }}>{item.title}</h3>
              <p style={{ color:'#A0A0B0', fontSize:'.9rem', lineHeight:1.6, fontWeight:300 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)} }
        @keyframes gridMove { 0%{transform:translateY(0)}100%{transform:translateY(60px)} }
        @keyframes scrollAnim { 0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(.5);opacity:.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)} }
        .animate-fade-up { animation: fadeUp 0.8s ease forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}
