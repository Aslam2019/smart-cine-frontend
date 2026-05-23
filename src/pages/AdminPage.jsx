import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI, moviesAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { user }                  = useAuth()
  const navigate                  = useNavigate()
  const [stats, setStats]         = useState({ totalBookings:0, totalRevenue:0, totalMovies:4, totalTheatres:5, totalUsers:0 })
  const [revenueByMovie, setRBM]  = useState([])
  const [recentBookings, setRB]   = useState([])
  const [newMovie, setNewMovie]   = useState({ title:'', genre:'', language:'Tamil', duration:'', trailerKey:'' })
  const [loading, setLoading]     = useState(true)
  const [adding, setAdding]       = useState(false)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    adminAPI.dashboard()
      .then(res => {
        setStats(res.data.stats || {})
        setRBM(res.data.revenueByMovie || [])
        setRB(res.data.recentBookings || [])
      })
      .catch(() => {
        // Mock data if admin API not accessible
        setStats({ totalBookings:12, totalRevenue:48600, totalMovies:4, totalTheatres:5, totalUsers:8 })
        setRBM([
          { title:'Karuppu', total:18000, count:4 },
          { title:'Jananayagan', total:15600, count:3 },
          { title:'Mankatha', total:9000, count:3 },
          { title:'Vallavan', total:6000, count:2 },
        ])
      })
      .finally(() => setLoading(false))
  }, [user])

  const addMovie = async () => {
    if (!newMovie.title) { toast.error('Movie title is required'); return }
    setAdding(true)
    try {
      await moviesAPI.create({
        title: newMovie.title,
        genre: newMovie.genre.split(',').map(g => g.trim()).filter(Boolean),
        language: newMovie.language,
        duration: parseInt(newMovie.duration) || 150,
        trailerKey: newMovie.trailerKey,
        certificate: 'UA',
        formats: ['2D']
      })
      toast.success(`✅ "${newMovie.title}" added successfully!`)
      setNewMovie({ title:'', genre:'', language:'Tamil', duration:'', trailerKey:'' })
      setStats(s => ({ ...s, totalMovies: s.totalMovies + 1 }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add movie')
    } finally {
      setAdding(false)
    }
  }

  const maxRev = Math.max(...revenueByMovie.map(m => m.total), 1)

  const inputStyle = {
    width:'100%', padding:'.7rem 1rem', background:'#1A1A24',
    border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, color:'#F0F0F5',
    fontFamily:'Outfit,sans-serif', fontSize:'.9rem', outline:'none'
  }

  if (!user || user.role !== 'admin') return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', color:'#606070' }}>
      <div style={{ fontSize:'3rem' }}>🔒</div>
      <div style={{ fontSize:'1.2rem' }}>Admin access required</div>
      <button onClick={() => navigate('/')} style={{ padding:'.7rem 2rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontWeight:600, cursor:'pointer', borderRadius:6 }}>Go Home</button>
    </div>
  )

  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0A0A0F 0%,#0A0A1A 100%)', padding:'4rem 5% 3rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'.75rem', color:'#E8192C', letterSpacing:3, textTransform:'uppercase', fontWeight:600, marginBottom:'.75rem' }}>⭐ Admin</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,7vw,5rem)', letterSpacing:2 }}>DASHBOARD</h1>
      </div>

      <div style={{ padding:'3rem 5%' }}>

        {/* Stats Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
          {[
            { icon:'🎟️', num: stats.totalBookings, label:'Total Bookings' },
            { icon:'₹',  num: `${Math.round(stats.totalRevenue/1000)}k`, label:'Revenue' },
            { icon:'🎬', num: stats.totalMovies, label:'Movies Running' },
            { icon:'🎭', num: stats.totalTheatres, label:'Active Theatres' },
            { icon:'👤', num: stats.totalUsers, label:'Registered Users' },
          ].map(card => (
            <div key={card.label} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1.5rem', transition:'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(232,25,44,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
              <div style={{ fontSize:'2rem', marginBottom:'.75rem' }}>{card.icon}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.5rem', letterSpacing:1, color:'#E8192C' }}>{card.num}</div>
              <div style={{ fontSize:'.78rem', color:'#A0A0B0', letterSpacing:1, textTransform:'uppercase', marginTop:'.25rem' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        {revenueByMovie.length > 0 && (
          <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.75rem', marginBottom:'2rem' }}>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:2, marginBottom:'1.5rem' }}>REVENUE BY MOVIE</h3>
            {revenueByMovie.map(m => (
              <div key={m.title} style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'.9rem' }}>
                <div style={{ width:100, fontSize:'.82rem', color:'#A0A0B0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.title}</div>
                <div style={{ flex:1, height:8, background:'#1A1A24', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'#E8192C', borderRadius:4, width:`${Math.round(m.total/maxRev*100)}%`, transition:'width .8s ease' }} />
                </div>
                <div style={{ width:60, textAlign:'right', fontWeight:600, fontSize:'.82rem', color:'#F5C842' }}>₹{Math.round(m.total/1000)}k</div>
                <div style={{ width:40, textAlign:'right', fontSize:'.75rem', color:'#606070' }}>{m.count} bk</div>
              </div>
            ))}
          </div>
        )}

        {/* Add Movie */}
        <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.75rem', marginBottom:'2rem' }}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:2, marginBottom:'1.5rem' }}>
            ➕ ADD NEW MOVIE
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
            {[
              { label:'Movie Title *', key:'title', placeholder:'e.g. Leo' },
              { label:'Genre (comma separated)', key:'genre', placeholder:'Action, Thriller' },
              { label:'Language', key:'language', placeholder:'Tamil' },
              { label:'Duration (minutes)', key:'duration', placeholder:'150' },
              { label:'YouTube Trailer Key', key:'trailerKey', placeholder:'dQw4w9WgXcQ' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display:'block', fontSize:'.78rem', color:'#A0A0B0', marginBottom:'.35rem', fontWeight:500, letterSpacing:'.5px' }}>{f.label}</label>
                <input
                  style={inputStyle}
                  placeholder={f.placeholder}
                  value={newMovie[f.key]}
                  onChange={e => setNewMovie(m => ({ ...m, [f.key]: e.target.value }))}
                  onFocus={e => e.target.style.borderColor='#E8192C'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
                />
              </div>
            ))}
          </div>
          <div style={{ fontSize:'.8rem', color:'#606070', marginBottom:'1rem' }}>
            💡 Poster & details will be auto-fetched from TMDB if API key is set in backend .env
          </div>
          <button onClick={addMovie} disabled={adding}
            style={{ padding:'.85rem 2.5rem', background: adding ? '#606070' : '#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontWeight:700, cursor: adding ? 'wait' : 'pointer', borderRadius:6, fontSize:'.95rem', transition:'all .2s' }}>
            {adding ? '⟳ Adding...' : '+ Add Movie'}
          </button>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.75rem' }}>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:2, marginBottom:'1.25rem' }}>RECENT BOOKINGS</h3>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                    {['Booking ID','User','Movie','Theatre','Amount','Status'].map(h => (
                      <th key={h} style={{ padding:'.75rem .5rem', textAlign:'left', color:'#A0A0B0', fontWeight:600, letterSpacing:'.5px', fontSize:'.78rem', textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding:'.75rem .5rem', color:'#606070', fontSize:'.75rem' }}>{b.bookingId}</td>
                      <td style={{ padding:'.75rem .5rem' }}>{b.user?.name || '—'}</td>
                      <td style={{ padding:'.75rem .5rem', color:'#E8192C' }}>{b.movie?.title || '—'}</td>
                      <td style={{ padding:'.75rem .5rem', color:'#A0A0B0' }}>{b.theatre?.name || '—'}</td>
                      <td style={{ padding:'.75rem .5rem', color:'#F5C842', fontWeight:600 }}>₹{b.grandTotal}</td>
                      <td style={{ padding:'.75rem .5rem' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'.72rem', fontWeight:600, background:'rgba(40,180,40,0.15)', color:'#2AB52A' }}>
                          ✅ {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
