import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { moviesAPI } from '../api'
import MovieCard from '../components/MovieCard'
import TheatreCard from '../components/TheatreCard'

const FALLBACK_MOVIES = [
  { _id:'1', title:'Karuppu', genre:['Action','Thriller'], language:'Tamil', duration:165, year:2026, rating:{ tmdb:8.2 } },
  { _id:'2', title:'Jananayagan', genre:['Political Drama'], language:'Tamil', duration:180, year:2026, rating:{ tmdb:8.7 } },
  { _id:'3', title:'Mankatha', genre:['Crime','Thriller'], language:'Tamil', duration:158, year:2011, rating:{ tmdb:8.5 } },
  { _id:'4', title:'Vallavan', genre:['Romance','Action'], language:'Tamil', duration:163, year:2006, rating:{ tmdb:7.8 } }
]

const FALLBACK_THEATRES = [
  { _id:'t1', name:'LA Cinema', address:{ full:'#12, Salai Rd, Srirangam, Trichy' }, amenities:['Dolby Atmos','4K Laser','Recliner Seats','Food Court'], rating:4.6, emoji:'🎬', gradient:'linear-gradient(135deg,#1A0505,#2D0808)', distance:2.1, times:['10:00 AM','1:30 PM','4:45 PM','8:00 PM'] },
  { _id:'t2', name:'Ramba Theatre', address:{ full:'#78, Anna Salai, Cantonment, Trichy' }, amenities:['Dolby Digital','HD Screen','Parking'], rating:4.2, emoji:'🎭', gradient:'linear-gradient(135deg,#050A1A,#080D2D)', distance:3.5, times:['9:30 AM','12:45 PM','4:00 PM','7:30 PM'] },
  { _id:'t3', name:'Sona Mina', address:{ full:'#45, Bharathidasan Rd, Woraiyur, Trichy' }, amenities:['3D Enabled','Snack Bar','Couples Seats'], rating:4.0, emoji:'⭐', gradient:'linear-gradient(135deg,#1A1505,#2D2008)', distance:4.2, times:['10:30 AM','2:00 PM','5:15 PM','9:00 PM'] },
  { _id:'t4', name:'Kalaiarangam', address:{ full:'Teppakulam, Trichy' }, amenities:['Large Screen','AC Hall'], rating:3.9, emoji:'🏛️', gradient:'linear-gradient(135deg,#0A1505,#0D2008)', distance:5.1, times:['11:00 AM','3:00 PM','6:30 PM'] },
  { _id:'t5', name:'Cauvery Theatre', address:{ full:'#23, Mettu St, K.K. Nagar, Trichy' }, amenities:['Dolby Sound','Premium Seating'], rating:4.4, emoji:'🌊', gradient:'linear-gradient(135deg,#05151A,#08202D)', distance:6.3, times:['9:00 AM','12:30 PM','3:45 PM','7:00 PM'] }
]

export default function HomePage() {
  const [movies, setMovies]   = useState(FALLBACK_MOVIES)
  const [loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState('Trichy, TN')
  const navigate = useNavigate()

  useEffect(() => {
    moviesAPI.getNowShowing()
      .then(res => {
        const data = res.data.movies
        if (data && data.length > 0) setMovies(data)
      })
      .catch(() => {})

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationName('Trichy, TN'),
        () => setLocationName('Trichy (approx)')
      )
    }
  }, [])

  return (
    <div style={{ paddingTop:70 }}>

      {/* HERO */}
      <section style={{ height:'100vh', position:'relative', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0A0A0F 0%,#1A0A0F 40%,#0F0A1A 100%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px)', backgroundSize:'60px 60px', animation:'gridMove 20s linear infinite' }} />
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:700, height:700, background:'radial-gradient(circle,rgba(232,25,44,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, padding:'0 5%', maxWidth:750 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(232,25,44,0.15)', border:'1px solid rgba(232,25,44,0.3)', padding:'.4rem 1rem', borderRadius:20, fontSize:'.8rem', color:'#E8192C', letterSpacing:2, fontWeight:600, marginBottom:'1.5rem' }}>
            <span style={{ width:6, height:6, background:'#E8192C', borderRadius:'50%', animation:'pulseDot 2s infinite' }} />
            🎬 NOW PLAYING IN TRICHY
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(4rem,9vw,8rem)', lineHeight:.95, letterSpacing:2 }}>
            THE CINEMA<br />EXPERIENCE<br /><span style={{ color:'#E8192C' }}>REIMAGINED</span>
          </h1>
          <p style={{ fontSize:'1.1rem', color:'#A0A0B0', margin:'1.5rem 0 2.5rem', lineHeight:1.7, fontWeight:300 }}>
            Premium movie booking for Trichy's finest theatres. Discover movies, book seats, and enjoy world-class entertainment.
          </p>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/movies')}
              style={{ padding:'.9rem 2.5rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:600, cursor:'pointer', borderRadius:4, transition:'all .25s' }}
              onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 8px 30px rgba(232,25,44,0.3)' }}
              onMouseLeave={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none' }}>
              Browse Movies
            </button>
            <button onClick={() => navigate('/theatres')}
              style={{ padding:'.9rem 2.5rem', background:'transparent', color:'#F0F0F5', border:'1px solid rgba(255,255,255,0.15)', fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:500, cursor:'pointer', borderRadius:4, transition:'all .25s' }}
              onMouseEnter={e => { e.target.style.borderColor='#E8192C'; e.target.style.color='#E8192C' }}
              onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.15)'; e.target.style.color='#F0F0F5' }}>
              Find Theatres
            </button>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'3rem', left:'5%', display:'flex', gap:'4rem' }}>
          {[{ num:'5', label:'Theatres' },{ num:'4+', label:'Movies' },{ num:'1K+', label:'Seats' }].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.5rem', color:'#E8192C', letterSpacing:1 }}>{s.num}</div>
              <div style={{ fontSize:'.75rem', color:'#606070', letterSpacing:2, textTransform:'uppercase', marginTop:'.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION BAR */}
      <div style={{ background:'#111118', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'1rem 5%', display:'flex', alignItems:'center', gap:'2rem', overflowX:'auto', whiteSpace:'nowrap' }}>
        <span style={{ fontSize:'.85rem', color:'#606070', flexShrink:0 }}>📍 {locationName} · Nearby:</span>
        {FALLBACK_THEATRES.map((t, i) => (
          <div key={t._id} onClick={() => navigate('/theatres')}
            style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.85rem', color: i===0 ? '#E8192C' : '#A0A0B0', cursor:'pointer', flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.color='#E8192C'}
            onMouseLeave={e => e.currentTarget.style.color= i===0 ? '#E8192C' : '#A0A0B0'}>
            🎭 {t.name}
            <span style={{ fontSize:'.7rem', color:'#F5C842', background:'rgba(245,200,66,0.1)', padding:'2px 8px', borderRadius:10 }}>{t.distance} km</span>
          </div>
        ))}
      </div>

      {/* MOVIES SECTION */}
      <section style={{ padding:'6rem 5%' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontSize:'.75rem', color:'#E8192C', letterSpacing:3, textTransform:'uppercase', fontWeight:600, display:'flex', alignItems:'center', gap:10, marginBottom:'.75rem' }}>
            Now Showing <div style={{ flex:1, maxWidth:60, height:1, background:'#E8192C' }} />
          </div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', letterSpacing:2, lineHeight:1 }}>CURRENT RELEASES</h2>
          <p style={{ color:'#A0A0B0', fontSize:'1rem', marginTop:'.75rem', fontWeight:300 }}>Catch the latest blockbusters playing in Trichy's top theatres</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.5rem' }}>
          {movies.map((m, i) => <MovieCard key={m._id} movie={m} idx={i} />)}
        </div>
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <button onClick={() => navigate('/movies')} style={{ padding:'.9rem 2.5rem', background:'transparent', color:'#F0F0F5', border:'1px solid rgba(255,255,255,0.15)', fontFamily:'Outfit,sans-serif', fontSize:'1rem', cursor:'pointer', borderRadius:4, transition:'all .25s' }}
            onMouseEnter={e => { e.target.style.borderColor='#E8192C'; e.target.style.color='#E8192C' }}
            onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.15)'; e.target.style.color='#F0F0F5' }}>
            View All Movies →
          </button>
        </div>
      </section>

      {/* THEATRES SECTION */}
      <section style={{ padding:'6rem 5%', background:'#111118' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontSize:'.75rem', color:'#E8192C', letterSpacing:3, textTransform:'uppercase', fontWeight:600, display:'flex', alignItems:'center', gap:10, marginBottom:'.75rem' }}>
            Venues <div style={{ flex:1, maxWidth:60, height:1, background:'#E8192C' }} />
          </div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.5rem,5vw,4rem)', letterSpacing:2, lineHeight:1 }}>FEATURED THEATRES</h2>
          <p style={{ color:'#A0A0B0', fontSize:'1rem', marginTop:'.75rem', fontWeight:300 }}>Premium cinema halls across Trichy district</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.5rem' }}>
          {FALLBACK_THEATRES.slice(0,4).map(t => (
            <TheatreCard key={t._id} theatre={t} onSelectTime={() => navigate('/movies')} />
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <button onClick={() => navigate('/theatres')} style={{ padding:'.9rem 2.5rem', background:'transparent', color:'#F0F0F5', border:'1px solid rgba(255,255,255,0.15)', fontFamily:'Outfit,sans-serif', fontSize:'1rem', cursor:'pointer', borderRadius:4, transition:'all .25s' }}
            onMouseEnter={e => { e.target.style.borderColor='#E8192C'; e.target.style.color='#E8192C' }}
            onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.15)'; e.target.style.color='#F0F0F5' }}>
            View All Theatres →
          </button>
        </div>
      </section>

      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)} }
        @keyframes gridMove { 0%{transform:translateY(0)}100%{transform:translateY(60px)} }
      `}</style>
    </div>
  )
}
