import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { generateTicketPDF } from '../utils/generatePDF'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, logout }          = useAuth()
  const navigate                  = useNavigate()
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [authOpen, setAuthOpen]   = useState(false)
  const [activeTab, setActiveTab] = useState('bookings')

  useEffect(() => {
    if (!user) { setLoading(false); return }
    bookingsAPI.getAll()
      .then(res => setBookings(res.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [user])

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '?'

  const downloadTicket = (b) => {
    generateTicketPDF({
      bookingId:  b.bookingId,
      movie:      b.movie?.title || 'Movie',
      theatre:    b.theatre?.name || 'Theatre',
      date:       new Date(b.showDate).toLocaleDateString('en-IN',{ day:'2-digit', month:'short', year:'numeric' }),
      time:       b.showTime,
      seats:      b.seats?.map(s => s.seatId).join(', ') || '',
      language:   b.language || 'Tamil',
      certificate:'UA',
      rating:     '8.0',
      genre:      'Tamil Cinema',
      format:     b.format || '2D',
      seatTotal:  b.totalAmount || 0,
      snackTotal: 0,
      conv:       b.convenienceFee || 0,
      gst:        b.gst || 0,
      payable:    b.grandTotal || b.totalAmount || 0,
      snackItems: []
    })
    toast.success('📄 PDF ticket opening...')
  }

  const tabStyle = (active) => ({
    padding: '.6rem 1.5rem',
    border: 'none',
    borderBottom: `2px solid ${active ? '#E8192C' : 'transparent'}`,
    background: 'transparent',
    color: active ? '#E8192C' : '#A0A0B0',
    fontFamily: 'Outfit,sans-serif',
    fontWeight: 600, fontSize: '.9rem',
    cursor: 'pointer', transition: 'all .2s'
  })

  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0A0A0F 0%,#1A0A1A 100%)', padding:'4rem 5% 3rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'.75rem', color:'#E8192C', letterSpacing:3, textTransform:'uppercase', fontWeight:600, marginBottom:'.75rem' }}>Account</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,7vw,5rem)', letterSpacing:2 }}>MY PROFILE</h1>
      </div>

      <div style={{ padding:'3rem 5%' }}>

        {/* Profile card */}
        <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'2rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ width:80, height:80, background:'linear-gradient(135deg,#E8192C,#B01020)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', color:'#fff', flexShrink:0, boxShadow:'0 8px 25px rgba(232,25,44,0.3)' }}>
            {initials}
          </div>
          {user ? (
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:'1.3rem', marginBottom:'.25rem' }}>{user.name}</div>
              <div style={{ color:'#A0A0B0', fontSize:'.9rem', marginBottom:'.25rem' }}>📧 {user.email}</div>
              {user.phone && <div style={{ color:'#A0A0B0', fontSize:'.85rem' }}>📱 +91 {user.phone}</div>}
              <div style={{ display:'flex', gap:'.5rem', marginTop:'.75rem', flexWrap:'wrap' }}>
                <div style={{ padding:'3px 12px', background: user.role==='admin' ? 'rgba(245,200,66,0.15)' : 'rgba(232,25,44,0.1)', color: user.role==='admin' ? '#F5C842' : '#E8192C', borderRadius:20, fontSize:'.75rem', fontWeight:700 }}>
                  {user.role === 'admin' ? '⭐ Admin' : '🎬 Cinema Member'}
                </div>
                <div style={{ padding:'3px 12px', background:'rgba(255,255,255,0.05)', color:'#A0A0B0', borderRadius:20, fontSize:'.75rem', fontWeight:600 }}>
                  {bookings.length} Booking{bookings.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight:600, fontSize:'1.1rem', marginBottom:'.5rem' }}>Not signed in</div>
              <div style={{ color:'#A0A0B0', fontSize:'.9rem', marginBottom:'1rem' }}>Sign in to view your bookings</div>
              <button onClick={() => setAuthOpen(true)} style={{ padding:'.7rem 2rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontWeight:600, cursor:'pointer', borderRadius:6 }}>Sign In</button>
            </div>
          )}
          {user && (
            <button onClick={() => { logout(); navigate('/') }}
              style={{ padding:'.6rem 1.5rem', background:'transparent', color:'#A0A0B0', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Outfit,sans-serif', cursor:'pointer', borderRadius:6, fontSize:'.85rem', transition:'all .2s', alignSelf:'flex-start' }}
              onMouseEnter={e => { e.target.style.borderColor='#E8192C'; e.target.style.color='#E8192C' }}
              onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.color='#A0A0B0' }}>
              Sign Out
            </button>
          )}
        </div>

        {/* Tabs */}
        {user && (
          <>
            <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:'1.5rem' }}>
              <button style={tabStyle(activeTab==='bookings')} onClick={() => setActiveTab('bookings')}>🎟️ Booking History</button>
              <button style={tabStyle(activeTab==='stats')} onClick={() => setActiveTab('stats')}>📊 My Stats</button>
            </div>

            {/* ── STATS TAB ── */}
            {activeTab === 'stats' && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
                {[
                  { icon:'🎬', label:'Movies Watched', val: bookings.filter(b=>b.status==='confirmed').length },
                  { icon:'💺', label:'Total Seats', val: bookings.reduce((s,b)=>s+(b.seats?.length||0),0) },
                  { icon:'💰', label:'Total Spent', val: `₹${bookings.reduce((s,b)=>s+(b.grandTotal||0),0).toLocaleString()}` },
                  { icon:'🎭', label:'Fav Theatre', val: (() => { const t={}; bookings.forEach(b=>{ const n=b.theatre?.name||'?'; t[n]=(t[n]||0)+1 }); return Object.entries(t).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'None' })() },
                ].map(s => (
                  <div key={s.label} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1.5rem', textAlign:'center', transition:'border-color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(232,25,44,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                    <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', color:'#E8192C', letterSpacing:1 }}>{s.val}</div>
                    <div style={{ fontSize:'.75rem', color:'#606070', letterSpacing:1, textTransform:'uppercase', marginTop:'.25rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {activeTab === 'bookings' && (
              <>
                {loading ? (
                  <div style={{ textAlign:'center', padding:'3rem', color:'#606070' }}>Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'3rem', textAlign:'center', color:'#606070' }}>
                    <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎬</div>
                    <div style={{ fontSize:'1rem', marginBottom:'1.5rem' }}>No bookings yet</div>
                    <button onClick={() => navigate('/movies')} style={{ padding:'.7rem 2rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontWeight:600, cursor:'pointer', borderRadius:6 }}>Browse Movies</button>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                    {bookings.map(b => (
                      <div key={b._id}
                        style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1.25rem', transition:'border-color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(232,25,44,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>

                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'.3rem', color:'#F0F0F5' }}>
                              🎬 {b.movie?.title || 'Movie'}
                            </div>
                            <div style={{ fontSize:'.82rem', color:'#A0A0B0', marginBottom:'.2rem' }}>
                              📍 {b.theatre?.name} &nbsp;·&nbsp; 🕐 {b.showTime}
                            </div>
                            <div style={{ fontSize:'.82rem', color:'#A0A0B0', marginBottom:'.2rem' }}>
                              📅 {new Date(b.showDate).toLocaleDateString('en-IN',{ day:'2-digit', month:'short', year:'numeric' })}
                            </div>
                            <div style={{ fontSize:'.82rem', color:'#A0A0B0' }}>
                              💺 Seats: {b.seats?.map(s=>s.seatId).join(', ')} &nbsp;·&nbsp; 💰 ₹{b.grandTotal}
                            </div>
                          </div>

                          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.5rem' }}>
                            <div style={{ padding:'4px 14px', borderRadius:20, fontSize:'.75rem', fontWeight:700, background: b.status==='confirmed' ? 'rgba(40,180,40,0.15)' : 'rgba(232,25,44,0.15)', color: b.status==='confirmed' ? '#2AB52A' : '#E8192C' }}>
                              {b.status === 'confirmed' ? '✅ Confirmed' : b.status?.toUpperCase()}
                            </div>
                            <div style={{ fontSize:'.7rem', color:'#606070', letterSpacing:1 }}>{b.bookingId}</div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display:'flex', gap:'.5rem', marginTop:'1rem', flexWrap:'wrap' }}>
                          <button
                            onClick={() => downloadTicket(b)}
                            style={{ padding:'.5rem 1.1rem', background:'linear-gradient(135deg,#1A1A24,#22222E)', color:'#F0F0F5', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'.8rem', cursor:'pointer', borderRadius:6, transition:'all .2s', display:'flex', alignItems:'center', gap:'.4rem' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor='#E8192C'; e.currentTarget.style.color='#E8192C' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#F0F0F5' }}>
                            📄 Download PDF
                          </button>
                          <button
                            onClick={() => {
                              const text = `🎬 *Smart Cine Trichy*\n\nMovie: ${b.movie?.title}\nTheatre: ${b.theatre?.name}\nDate: ${new Date(b.showDate).toLocaleDateString('en-IN')}\nTime: ${b.showTime}\nSeats: ${b.seats?.map(s=>s.seatId).join(', ')}\nBooking ID: ${b.bookingId}`
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                            }}
                            style={{ padding:'.5rem 1.1rem', background:'rgba(37,211,102,0.1)', color:'#25D366', border:'1px solid rgba(37,211,102,0.2)', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'.8rem', cursor:'pointer', borderRadius:6, transition:'all .2s', display:'flex', alignItems:'center', gap:'.4rem' }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(37,211,102,0.2)' }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(37,211,102,0.1)' }}>
                            💬 Share WhatsApp
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
