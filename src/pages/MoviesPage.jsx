import { useEffect, useState } from 'react'
import { moviesAPI } from '../api'
import MovieCard from '../components/MovieCard'

export default function MoviesPage() {
  const [movies, setMovies]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    moviesAPI.getNowShowing()
      .then(res => setMovies(res.data.movies || []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [])

  const genres = ['all', 'Action', 'Drama', 'Thriller', 'Romance', 'Crime']

  const filtered = movies.filter(m => {
    const matchGenre = filter === 'all' || m.genre?.some(g => g.toLowerCase().includes(filter.toLowerCase()))
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
    return matchGenre && matchSearch
  })

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', background: '#0A0A0F' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#1A0A0F 100%)', padding: '4rem 5% 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '.75rem', color: '#E8192C', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: '.75rem' }}>
          🎬 Now Showing
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,7vw,6rem)', letterSpacing: 2, lineHeight: 1, marginBottom: '1rem' }}>
          ALL MOVIES
        </h1>
        <p style={{ color: '#A0A0B0', fontSize: '1rem', fontWeight: 300 }}>
          Currently running in Trichy theatres
        </p>
      </div>

      <div style={{ padding: '3rem 5%' }}>

        {/* Search + Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="🔍 Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '.7rem 1.2rem', background: '#111118',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: '#F0F0F5', fontFamily: 'Outfit,sans-serif', fontSize: '.9rem',
              outline: 'none', minWidth: 220, flex: 1
            }}
            onFocus={e => e.target.style.borderColor = '#E8192C'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {genres.map(g => (
              <button key={g} onClick={() => setFilter(g)}
                style={{
                  padding: '.5rem 1.2rem', borderRadius: 20, cursor: 'pointer',
                  fontFamily: 'Outfit,sans-serif', fontSize: '.82rem', fontWeight: 600,
                  transition: 'all .2s', border: 'none',
                  background: filter === g ? '#E8192C' : '#111118',
                  color: filter === g ? '#fff' : '#A0A0B0',
                  outline: filter === g ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}>
                {g === 'all' ? 'All Genres' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: '.85rem', color: '#606070', marginBottom: '1.5rem' }}>
          Showing {filtered.length} movie{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#606070' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
            <div style={{ fontSize: '1.1rem' }}>Loading movies...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#606070' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <div style={{ fontSize: '1.1rem' }}>No movies found</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem' }}>
            {filtered.map((m, i) => <MovieCard key={m._id} movie={m} idx={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
