import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { theatresAPI } from '../api'
import TheatreCard from '../components/TheatreCard'
import { useLocation } from '../hooks/useLocation'

export default function TheatresPage() {
  const [theatres, setTheatres] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const navigate                = useNavigate()
  const { nearbyTheatres }      = useLocation()

  useEffect(() => {
    theatresAPI.getAll()
      .then(res => setTheatres(res.data.theatres || []))
      .catch(() => setTheatres([]))
      .finally(() => setLoading(false))
  }, [])

  // Merge distances from nearby hook
  const withDistance = theatres.map(t => {
    const nearby = nearbyTheatres.find(n => n._id === t._id)
    return nearby ? { ...t, distance: nearby.distance } : t
  }).sort((a, b) => (a.distance || 99) - (b.distance || 99))

  const filtered = withDistance.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.address?.area || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#0A0A0F' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#0F0A1A 100%)', padding: '4rem 5% 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '.75rem', color: '#E8192C', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: '.75rem' }}>
          📍 Trichy District
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,7vw,6rem)', letterSpacing: 2, lineHeight: 1, marginBottom: '1rem' }}>
          ALL THEATRES
        </h1>
        <p style={{ color: '#A0A0B0', fontSize: '1rem', fontWeight: 300 }}>
          Premium cinema halls — sorted by your location
        </p>
      </div>

      <div style={{ padding: '3rem 5%' }}>

        {/* Search */}
        <div style={{ marginBottom: '2.5rem' }}>
          <input
            placeholder="🔍 Search theatre or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '.8rem 1.2rem', background: '#111118',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: '#F0F0F5', fontFamily: 'Outfit,sans-serif', fontSize: '.95rem',
              outline: 'none', width: '100%', maxWidth: 400
            }}
            onFocus={e => e.target.style.borderColor = '#E8192C'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {/* Info bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '.75rem 1.25rem', background: 'rgba(245,200,66,0.05)', border: '1px solid rgba(245,200,66,0.15)', borderRadius: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>📍</span>
          <span style={{ fontSize: '.85rem', color: '#A0A0B0' }}>
            Showing <strong style={{ color: '#F5C842' }}>{filtered.length} theatres</strong> near you · Sorted by distance
          </span>
        </div>

        {/* Theatres Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#606070' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
            <div>Loading theatres...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.5rem' }}>
            {filtered.map(t => (
              <TheatreCard key={t._id} theatre={t}
                onSelectTime={(theatre, time) => navigate('/movies')} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
