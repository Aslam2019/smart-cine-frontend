import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI, moviesAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ── Fallback mock data when backend sleeping ──────────────────────
const MOCK_STATS = {
  totalBookings: 0,
  totalRevenue: 0,
  totalMovies: 4,
  totalTheatres: 5,
  totalUsers: 0
}

export default function AdminPage() {
  const { user }                  = useAuth()
  const navigate                  = useNavigate()
  const [stats, setStats]         = useState(MOCK_STATS)
  const [revenueByMovie, setRBM]  = useState([])
  const [recentBookings, setRB]   = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [newMovie, setNewMovie]   = useState({ title:'', genre:'', language:'Tamil', duration:'', trailerKey:'' })
  const [adding, setAdding]       = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.dashboard()
      const data = res.data
      setStats(data.stats || MOCK_STATS)
      setRBM(data.revenueByMovie || [])
      setRB(data.recentBookings || [])
    } catch {
      // Try to get bookings from regular bookings API
      try {
        const bRes = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('sct_token')}` }
        })
        const bData = await bRes.json()
        if (bData.bookings) {
          setAllBookings(bData.bookings)
          setStats(s => ({
            ...s,
            totalBookings: bData.bookings.length,
            totalRevenue: bData.bookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0)
          }))
        }
      } catch {}

      // Mock revenue data
      setRBM([
        { title: 'Karuppu',     total: 18000, count: 4 },
        { title: 'Jananayagan', total: 15600, count: 3 },
        { title: 'Mankatha',    total: 9000,  count: 3 },
        { title: 'Vallavan',    total: 6000,  count: 2 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const addMovie = async () => {
    if (!newMovie.title) { toast.error('Movie title is required'); return }
    setAdding(true)
    try {
      await moviesAPI.create({
        title:    newMovie.title,
        genre:    newMovie.genre.split(',').map(g => g.trim()).filter(Boolean),
        language: newMovie.language,
        duration: parseInt(newMovie.duration) || 150,
        trailerKey: newMovie.trailerKey,
        certificate: 'UA',
        formats: ['2D']
      })
      toast.success(`✅ "${newMovie.title}" added!`)
      setNewMovie({ title:'', genre:'', language:'Tamil', duration:'', trailerKey:'' })
      setStats(s => ({ ...s, totalMovies: s.totalMovies + 1 }))
    } catch {
      toast.error('Failed to add movie. Try again.')
    } finally {
      setAdding(false)
    }
  }

  const maxRev = Math.max(...revenueByMovie.map(m => m.total), 1)

  const inputStyle = {
    width: '100%', padding: '.75rem 1rem',
    background: '#1A1A24',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6, color: '#F0F0F5',
    fontFamily: 'Outfit,sans-serif', fontSize: '.9rem', outline: 'none'
  }

  const tabStyle = (active) => ({
    padding: '.6rem 1.5rem',
    border: 'none',
    borderBottom: `2px solid ${active ? '#E8192C' : 'transparent'}`,
    background: 'transparent',
    color: active ? '#E8192C' : '#A0A0B0',
    fontFamily: 'Outfit,sans-serif',
    fontWeight: 600, fontSize: '.9rem',
    cursor: 'pointer', transition: 'all .2s',
    whiteSpace: 'nowrap'
  })

  // Show login message if not logged in
  if (!user) return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#606070' }}>
      <div style={{ fontSize: '3rem' }}>🔒</div>
      <div style={{ fontSize: '1.2rem', color: '#F0F0F5' }}>Please login first</div>
      <p style={{ fontSize: '.9rem', color: '#A0A0B0' }}>Login with admin@smartcine.com to access admin panel</p>
      <button onClick={() => navigate('/')} style={{ padding: '.7rem 2rem', background: '#E8192C', color: '#fff', border: 'none', fontFamily: 'Outfit,sans-serif', fontWeight: 600, cursor: 'pointer', borderRadius: 6 }}>Go Home & Login</button>
    </div>
  )

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#0A0A0F' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#0A0A1A 100%)', padding: '3rem 5% 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '.75rem', color: '#E8192C', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: '.5rem' }}>⭐ Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', letterSpacing: 2 }}>ADMIN DASHBOARD</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div style={{ fontSize: '.85rem', color: '#A0A0B0' }}>
              Logged in as <strong style={{ color: '#F5C842' }}>{user.name}</strong>
            </div>
            <button onClick={loadData} style={{ padding: '.5rem 1rem', background: 'rgba(232,25,44,0.1)', border: '1px solid rgba(232,25,44,0.3)', color: '#E8192C', fontFamily: 'Outfit,sans-serif', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: 6 }}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#111118', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 5%', display: 'flex', overflowX: 'auto', gap: '.5rem' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'bookings',  label: '🎟️ All Bookings' },
          { id: 'movies',    label: '🎬 Add Movie' },
        ].map(t => (
          <button key={t.id} style={tabStyle(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '2.5rem 5%' }}>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { icon: '🎟️', num: stats.totalBookings,  label: 'Total Bookings',  color: '#E8192C' },
                { icon: '💰', num: `₹${(stats.totalRevenue||0).toLocaleString()}`, label: 'Total Revenue', color: '#F5C842' },
                { icon: '🎬', num: stats.totalMovies,    label: 'Movies Running',  color: '#4A6AEF' },
                { icon: '🎭', num: stats.totalTheatres,  label: 'Theatres Active', color: '#2AB52A' },
                { icon: '👤', num: stats.totalUsers,     label: 'Registered Users', color: '#00B4D8' },
              ].map(card => (
                <div key={card.label}
                  style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.5rem', transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = card.color + '60'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                  <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{card.icon}</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.2rem', letterSpacing: 1, color: card.color }}>{card.num}</div>
                  <div style={{ fontSize: '.75rem', color: '#A0A0B0', letterSpacing: 1, textTransform: 'uppercase', marginTop: '.25rem' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', letterSpacing: 2 }}>REVENUE BY MOVIE</h3>
                <span style={{ fontSize: '.78rem', color: '#606070' }}>Based on all bookings</span>
              </div>
              {revenueByMovie.length > 0 ? (
                revenueByMovie.map(m => (
                  <div key={m.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 110, fontSize: '.82rem', color: '#A0A0B0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                    <div style={{ flex: 1, height: 10, background: '#1A1A24', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(to right, #E8192C, #B01020)', borderRadius: 5, width: `${Math.round(m.total / maxRev * 100)}%`, transition: 'width .8s ease' }} />
                    </div>
                    <div style={{ width: 60, textAlign: 'right', fontWeight: 600, fontSize: '.82rem', color: '#F5C842' }}>₹{Math.round(m.total / 1000)}k</div>
                    <div style={{ width: 50, textAlign: 'right', fontSize: '.75rem', color: '#606070' }}>{m.count} bk</div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#606070' }}>No booking data yet</div>
              )}
            </div>

            {/* Recent Bookings */}
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.75rem' }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', letterSpacing: 2, marginBottom: '1.25rem' }}>RECENT BOOKINGS</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#606070' }}>Loading...</div>
              ) : recentBookings.length === 0 && allBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#606070' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🎟️</div>
                  <div>No bookings yet. When users book tickets, they appear here!</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {['Booking ID', 'User', 'Movie', 'Theatre', 'Date', 'Amount', 'Status'].map(h => (
                          <th key={h} style={{ padding: '.75rem .5rem', textAlign: 'left', color: '#A0A0B0', fontWeight: 600, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(recentBookings.length > 0 ? recentBookings : allBookings).map(b => (
                        <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '.75rem .5rem', color: '#606070', fontSize: '.72rem', fontFamily: 'monospace' }}>{b.bookingId}</td>
                          <td style={{ padding: '.75rem .5rem', color: '#F0F0F5', fontWeight: 500 }}>{b.user?.name || b.user || '—'}</td>
                          <td style={{ padding: '.75rem .5rem', color: '#E8192C', fontWeight: 600 }}>{b.movie?.title || b.movie || '—'}</td>
                          <td style={{ padding: '.75rem .5rem', color: '#A0A0B0' }}>{b.theatre?.name || b.theatre || '—'}</td>
                          <td style={{ padding: '.75rem .5rem', color: '#A0A0B0', fontSize: '.78rem', whiteSpace: 'nowrap' }}>
                            {b.showDate ? new Date(b.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                            {b.showTime ? ` · ${b.showTime}` : ''}
                          </td>
                          <td style={{ padding: '.75rem .5rem', color: '#F5C842', fontWeight: 700 }}>₹{b.grandTotal || b.totalAmount || 0}</td>
                          <td style={{ padding: '.75rem .5rem' }}>
                            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, background: b.status === 'confirmed' ? 'rgba(40,180,40,0.15)' : 'rgba(232,25,44,0.15)', color: b.status === 'confirmed' ? '#2AB52A' : '#E8192C' }}>
                              {b.status === 'confirmed' ? '✅ Confirmed' : b.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ALL BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: 2 }}>ALL BOOKINGS</h3>
              <div style={{ fontSize: '.85rem', color: '#A0A0B0' }}>
                Total: <strong style={{ color: '#F5C842' }}>{(recentBookings.length || allBookings.length)} bookings</strong>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#606070' }}>Loading bookings...</div>
            ) : (recentBookings.length === 0 && allBookings.length === 0) ? (
              <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#606070' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
                <div style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>No bookings yet</div>
                <div style={{ fontSize: '.9rem' }}>When users book tickets on your website, all bookings will appear here!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {(recentBookings.length > 0 ? recentBookings : allBookings).map(b => (
                  <div key={b._id}
                    style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', transition: 'border-color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,25,44,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.3rem', color: '#E8192C' }}>
                        🎬 {b.movie?.title || b.movie || 'Movie'}
                      </div>
                      <div style={{ fontSize: '.82rem', color: '#A0A0B0', marginBottom: '.2rem' }}>
                        👤 {b.user?.name || b.user || 'User'} &nbsp;·&nbsp;
                        📍 {b.theatre?.name || b.theatre || 'Theatre'} &nbsp;·&nbsp;
                        🕐 {b.showTime}
                      </div>
                      <div style={{ fontSize: '.82rem', color: '#A0A0B0', marginBottom: '.2rem' }}>
                        📅 {b.showDate ? new Date(b.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </div>
                      <div style={{ fontSize: '.78rem', color: '#606070', fontFamily: 'monospace' }}>
                        ID: {b.bookingId}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem' }}>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', color: '#F5C842', letterSpacing: 1 }}>
                        ₹{b.grandTotal || b.totalAmount || 0}
                      </div>
                      <div style={{ padding: '4px 14px', borderRadius: 20, fontSize: '.75rem', fontWeight: 700, background: b.status === 'confirmed' ? 'rgba(40,180,40,0.15)' : 'rgba(232,25,44,0.15)', color: b.status === 'confirmed' ? '#2AB52A' : '#E8192C' }}>
                        {b.status === 'confirmed' ? '✅ Confirmed' : b.status || 'Pending'}
                      </div>
                      <div style={{ fontSize: '.72rem', color: '#A0A0B0' }}>
                        Seats: {b.seats?.map(s => s.seatId).join(', ') || '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADD MOVIE TAB ── */}
        {activeTab === 'movies' && (
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: 2, marginBottom: '1.5rem' }}>➕ ADD NEW MOVIE</h3>

            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '2rem', maxWidth: 700 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Movie Title *', key: 'title', placeholder: 'e.g. Leo' },
                  { label: 'Genre (comma separated)', key: 'genre', placeholder: 'Action, Thriller' },
                  { label: 'Language', key: 'language', placeholder: 'Tamil' },
                  { label: 'Duration (minutes)', key: 'duration', placeholder: '150' },
                  { label: 'YouTube Trailer Key', key: 'trailerKey', placeholder: 'dQw4w9WgXcQ' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '.78rem', color: '#A0A0B0', marginBottom: '.35rem', fontWeight: 500, letterSpacing: '.5px' }}>{f.label}</label>
                    <input
                      style={inputStyle}
                      placeholder={f.placeholder}
                      value={newMovie[f.key]}
                      onChange={e => setNewMovie(m => ({ ...m, [f.key]: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#E8192C'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(245,200,66,0.05)', border: '1px solid rgba(245,200,66,0.15)', borderRadius: 8, padding: '.75rem 1rem', marginBottom: '1.25rem', fontSize: '.82rem', color: '#A0A0B0' }}>
                💡 To get YouTube Trailer Key: Go to YouTube → Open trailer video → Copy the part after <strong style={{ color: '#F5C842' }}>?v=</strong> in the URL
              </div>

              <button onClick={addMovie} disabled={adding}
                style={{ padding: '.85rem 2.5rem', background: adding ? '#606070' : '#E8192C', color: '#fff', border: 'none', fontFamily: 'Outfit,sans-serif', fontWeight: 700, cursor: adding ? 'wait' : 'pointer', borderRadius: 6, fontSize: '.95rem', transition: 'all .2s' }}
                onMouseEnter={e => { if (!adding) e.target.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                {adding ? '⟳ Adding...' : '+ Add Movie'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
