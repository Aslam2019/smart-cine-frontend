import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'

const MOVIES = {
  '1': { _id:'1', title:'Karuppu',     genre:['Action','Thriller'],  language:'Tamil', duration:165, year:2026, rating:8.2, description:'An intense action thriller that follows a fearless cop taking on a powerful criminal empire in the streets of Tamil Nadu. Raw, gritty, and relentlessly paced.', youtubeKey:'JpVl_-1YgIo', certificate:'UA', formats:['2D','3D','Dolby'], bgColor:'#2A0A0A' },
  '2': { _id:'2', title:'Jananayagan', genre:['Political Drama'],    language:'Tamil', duration:180, year:2026, rating:8.7, description:'A sweeping political saga that chronicles the extraordinary rise of a common man who becomes the voice of millions.', youtubeKey:'fJaAYcERf3Y', certificate:'UA', formats:['2D','IMAX'], bgColor:'#0A0A2A' },
  '3': { _id:'3', title:'Mankatha',    genre:['Crime','Thriller'],   language:'Tamil', duration:158, year:2011, rating:8.5, description:'The ultimate heist thriller. A corrupt cop, a stolen money bag, and a web of betrayals that will keep you guessing until the final frame.', youtubeKey:'a3rB6he7q4c', certificate:'A',  formats:['2D'], bgColor:'#0A2A0A' },
  '4': { _id:'4', title:'Vallavan',    genre:['Romance','Action'],   language:'Tamil', duration:163, year:2006, rating:7.8, description:'A high-voltage romantic action film featuring a charming hero caught between two loves and a deadly enemy. Iconic music and unforgettable style.', youtubeKey:'67SslBLzyBw', certificate:'UA', formats:['2D'], bgColor:'#2A200A' }
}

const THEATRES = [
  { _id:'t1', name:'LA Cinema',       amenities:['Dolby Atmos','4K Laser'],      times:['10:00 AM','1:30 PM','4:45 PM','8:00 PM'] },
  { _id:'t2', name:'Ramba Theatre',   amenities:['Dolby Digital','HD Screen'],   times:['9:30 AM','12:45 PM','4:00 PM','7:30 PM'] },
  { _id:'t3', name:'Sona Mina',       amenities:['3D Enabled','Snack Bar'],      times:['10:30 AM','2:00 PM','5:15 PM','9:00 PM'] },
  { _id:'t4', name:'Kalaiarangam',    amenities:['Large Screen','AC Hall'],      times:['11:00 AM','3:00 PM','6:30 PM'] },
  { _id:'t5', name:'Cauvery Theatre', amenities:['Dolby Sound','Premium Seats'], times:['9:00 AM','12:30 PM','3:45 PM','7:00 PM'] }
]

// Generate next 7 days
function getNext7Days() {
  const days = []
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push({
      date: d.toISOString().split('T')[0],
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      num: d.getDate(),
      month: monthNames[d.getMonth()],
      full: d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
    })
  }
  return days
}

export default function MovieDetailPage() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const { user }                  = useAuth()
  const [movie, setMovie]         = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selected, setSelected]   = useState({ theatreId:'', theatreName:'', time:'' })
  const [authOpen, setAuthOpen]   = useState(false)
  const [hoverPlay, setHoverPlay] = useState(false)
  const days = getNext7Days()

  useEffect(() => {
    setShowPopup(false)
    setSelected({ theatreId:'', theatreName:'', time:'' })
    setSelectedDate(days[0])
    const found = MOVIES[id] || MOVIES['1']
    setMovie(found)
  }, [id])

  if (!movie) return (
    <div style={{ paddingTop:70, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0A0A0F', color:'#606070' }}>
      🎬 Loading...
    </div>
  )

  const thumbHD  = `https://img.youtube.com/vi/${movie.youtubeKey}/maxresdefault.jpg`
  const thumbSD  = `https://img.youtube.com/vi/${movie.youtubeKey}/hqdefault.jpg`
  const watchUrl = `https://www.youtube.com/watch?v=${movie.youtubeKey}`
  const embedUrl = `https://www.youtube-nocookie.com/embed/${movie.youtubeKey}?autoplay=1&rel=0&modestbranding=1`

  const selectTime = (theatreId, theatreName, time) => {
    setSelected({ theatreId, theatreName, time })
    toast.success(`✅ ${theatreName} — ${time}`)
  }

  const bookNow = () => {
    if (!selectedDate) { toast.error('Please select a date!'); return }
    if (!selected.time) { toast.error('Please select a showtime!'); return }
    if (!user) { setAuthOpen(true); return }
    navigate('/book/direct', {
      state: {
        movie,
        theatre: { _id: selected.theatreId, name: selected.theatreName },
        time: selected.time,
        date: selectedDate
      }
    })
  }

  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>

      {/* VIDEO POPUP */}
      {showPopup && (
        <div onClick={() => setShowPopup(false)} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.95)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:900, position:'relative' }}>
            <button onClick={() => setShowPopup(false)} style={{ position:'absolute', top:-50, right:0, background:'#E8192C', border:'none', color:'#fff', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.5rem', letterSpacing:2, marginBottom:'.75rem', color:'#fff' }}>{movie.title.toUpperCase()} — OFFICIAL TRAILER</div>
            <div style={{ position:'relative', paddingTop:'56.25%', background:'#000', borderRadius:12, overflow:'hidden' }}>
              <iframe src={embedUrl} title={`${movie.title} Trailer`} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <div style={{ marginTop:'1rem', textAlign:'center' }}>
              <a href={watchUrl} target="_blank" rel="noreferrer" style={{ color:'#E8192C', fontWeight:700, fontSize:'.85rem', textDecoration:'none' }}>🎬 Open on YouTube ↗</a>
            </div>
          </div>
        </div>
      )}

      {/* THUMBNAIL HERO */}
      <div style={{ position:'relative', width:'100%', overflow:'hidden', background:movie.bgColor }}>
        <img src={thumbHD} alt={movie.title} style={{ width:'100%', maxHeight:'70vh', objectFit:'cover', display:'block', opacity:0.7 }} onError={e => { e.target.src = thumbSD }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(10,10,15,0.9) 30%,rgba(10,10,15,0.3) 100%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:120, background:'linear-gradient(to top,#0A0A0F,transparent)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 5%' }}>
          <div style={{ maxWidth:600 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,7vw,6rem)', letterSpacing:2, lineHeight:0.95, color:'#fff', marginBottom:'1rem' }}>{movie.title.toUpperCase()}</div>
            <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
              {movie.genre.map(g => <span key={g} style={{ padding:'4px 12px', borderRadius:20, fontSize:'.78rem', fontWeight:600, background:'rgba(232,25,44,0.8)', color:'#fff' }}>{g}</span>)}
              <span style={{ padding:'4px 12px', borderRadius:20, fontSize:'.78rem', background:'rgba(0,0,0,0.5)', color:'#F5C842', fontWeight:600 }}>★ {movie.rating}</span>
            </div>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <button onClick={() => setShowPopup(true)} onMouseEnter={() => setHoverPlay(true)} onMouseLeave={() => setHoverPlay(false)}
                style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.85rem 2rem', background: hoverPlay ? '#B01020' : '#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'1rem', cursor:'pointer', borderRadius:8, transform: hoverPlay ? 'scale(1.05)' : 'scale(1)', transition:'all 0.2s' }}>
                <span style={{ fontSize:'1.3rem' }}>▶</span> Watch Trailer
              </button>
              <a href={watchUrl} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.85rem 1.5rem', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', color:'#fff', textDecoration:'none', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'.9rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)' }}>
                🎬 YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MOVIE INFO */}
      <div style={{ padding:'2.5rem 5%' }}>
        <p style={{ color:'#A0A0B0', lineHeight:1.8, fontSize:'1rem', marginBottom:'2rem', fontWeight:300, maxWidth:700 }}>{movie.description}</p>
        <div style={{ display:'flex', gap:'2rem', marginBottom:'2.5rem', flexWrap:'wrap' }}>
          {[
            { label:'Duration', val:`${Math.floor(movie.duration/60)}h ${movie.duration%60}m` },
            { label:'Language', val:movie.language },
            { label:'Certificate', val:movie.certificate },
            { label:'Year', val:movie.year },
            { label:'Rating', val:`★ ${movie.rating}` }
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize:'.7rem', color:'#606070', letterSpacing:2, textTransform:'uppercase', marginBottom:'.25rem' }}>{item.label}</div>
              <div style={{ fontWeight:600, color:'#F0F0F5', fontSize:'.95rem' }}>{item.val}</div>
            </div>
          ))}
        </div>

        <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom:'2.5rem' }} />

        {/* ══ STEP 1: SELECT DATE ══ */}
        <div style={{ marginBottom:'2.5rem' }}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2, marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
            <span style={{ background:'#E8192C', color:'#fff', width:36, height:36, borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontFamily:'Outfit,sans-serif', fontWeight:700 }}>1</span>
            SELECT DATE
          </h3>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            {days.map(d => {
              const isSelected = selectedDate?.date === d.date
              return (
                <div key={d.date} onClick={() => setSelectedDate(d)}
                  style={{
                    padding:'.75rem 1.25rem', borderRadius:12, cursor:'pointer',
                    border: `2px solid ${isSelected ? '#E8192C' : 'rgba(255,255,255,0.08)'}`,
                    background: isSelected ? 'rgba(232,25,44,0.12)' : '#111118',
                    textAlign:'center', minWidth:80, transition:'all .2s',
                    transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isSelected ? '0 8px 25px rgba(232,25,44,0.2)' : 'none'
                  }}
                  onMouseEnter={e => { if(!isSelected) { e.currentTarget.style.borderColor='rgba(232,25,44,0.4)'; e.currentTarget.style.transform='translateY(-2px)' } }}
                  onMouseLeave={e => { if(!isSelected) { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='translateY(0)' } }}>
                  <div style={{ fontSize:'.7rem', color: isSelected ? '#E8192C' : '#606070', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:'.25rem' }}>{d.day}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', color: isSelected ? '#E8192C' : '#F0F0F5', lineHeight:1 }}>{d.num}</div>
                  <div style={{ fontSize:'.72rem', color: isSelected ? '#E8192C' : '#A0A0B0', marginTop:'.2rem', fontWeight:500 }}>{d.month}</div>
                </div>
              )
            })}
          </div>
          {selectedDate && (
            <div style={{ marginTop:'.75rem', fontSize:'.85rem', color:'#A0A0B0' }}>
              Selected: <span style={{ color:'#E8192C', fontWeight:700 }}>{selectedDate.full}</span>
            </div>
          )}
        </div>

        {/* ══ STEP 2: SELECT THEATRE & TIME ══ */}
        <div style={{ marginBottom:'2.5rem' }}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2, marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
            <span style={{ background:'#E8192C', color:'#fff', width:36, height:36, borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontFamily:'Outfit,sans-serif', fontWeight:700 }}>2</span>
            SELECT THEATRE & TIME
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {THEATRES.map(theatre => (
              <div key={theatre._id}
                style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', transition:'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(232,25,44,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                <div>
                  <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'.25rem' }}>{theatre.name}</div>
                  <div style={{ fontSize:'.78rem', color:'#606070' }}>{theatre.amenities.join(' · ')}</div>
                </div>
                <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
                  {theatre.times.map(time => {
                    const isSel = selected.theatreId === theatre._id && selected.time === time
                    return (
                      <button key={time} onClick={() => selectTime(theatre._id, theatre.name, time)}
                        style={{ padding:'6px 14px', borderRadius:6, cursor:'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:600, transition:'all .2s', border:'none', background: isSel ? '#E8192C' : '#1A1A24', color: isSel ? '#fff' : '#F0F0F5', outline: isSel ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedDate && selected.time && (
          <div style={{ background:'rgba(232,25,44,0.08)', border:'1px solid rgba(232,25,44,0.3)', borderRadius:12, padding:'1.25rem', marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'.8rem', color:'#606070', letterSpacing:2, textTransform:'uppercase', marginBottom:'.75rem', fontWeight:600 }}>Your Selection</div>
            <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
              <div><div style={{ fontSize:'.72rem', color:'#606070' }}>DATE</div><div style={{ fontWeight:700, color:'#F0F0F5', marginTop:'.2rem' }}>{selectedDate.full}</div></div>
              <div><div style={{ fontSize:'.72rem', color:'#606070' }}>THEATRE</div><div style={{ fontWeight:700, color:'#F0F0F5', marginTop:'.2rem' }}>{selected.theatreName}</div></div>
              <div><div style={{ fontSize:'.72rem', color:'#606070' }}>TIME</div><div style={{ fontWeight:700, color:'#E8192C', marginTop:'.2rem' }}>{selected.time}</div></div>
            </div>
          </div>
        )}

        {/* BOOK BUTTON */}
        <button onClick={bookNow}
          style={{ width:'100%', padding:'1.1rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:2, cursor:'pointer', borderRadius:8, transition:'all .25s' }}
          onMouseEnter={e => { e.target.style.background='#B01020'; e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 8px 30px rgba(232,25,44,0.4)' }}
          onMouseLeave={e => { e.target.style.background='#E8192C'; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none' }}>
          🎟️ SELECT SEATS & SNACKS →
        </button>

        <div style={{ display:'flex', gap:'.5rem', marginTop:'1.25rem', flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:'.78rem', color:'#606070' }}>Available in:</span>
          {movie.formats.map(f => <span key={f} style={{ fontSize:'.75rem', padding:'3px 10px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#A0A0B0' }}>{f}</span>)}
        </div>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
