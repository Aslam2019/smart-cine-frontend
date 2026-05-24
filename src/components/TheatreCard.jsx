import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// ══════════════════════════════════════════
// ADD YOUR IMAGE URLs HERE
// Get from Google Images → right click → Copy image address
// Paste between the quotes below
// ══════════════════════════════════════════
const THEATRE_IMAGES = {
  'LA Cinema':       '',
  'Ramba Theatre':   '',
  'Sona Mina':       '',
  'Kalaiarangam':    '',
  'Cauvery Theatre': ''
}

// Beautiful CSS cinema visuals for each theatre
const THEATRE_STYLES = {
  'LA Cinema': {
    gradient: 'linear-gradient(135deg, #0D0000 0%, #2D0505 40%, #1A0000 100%)',
    accentColor: '#E8192C',
    glowColor: 'rgba(232,25,44,0.4)',
    pattern: 'radial-gradient(ellipse at 20% 50%, rgba(232,25,44,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,25,44,0.1) 0%, transparent 50%)',
    icon: '🎬',
    tag: 'DOLBY ATMOS',
    tagColor: '#E8192C'
  },
  'Ramba Theatre': {
    gradient: 'linear-gradient(135deg, #00000D 0%, #05052D 40%, #00000D 100%)',
    accentColor: '#4A6AEF',
    glowColor: 'rgba(74,106,239,0.4)',
    pattern: 'radial-gradient(ellipse at 30% 60%, rgba(74,106,239,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(74,106,239,0.1) 0%, transparent 50%)',
    icon: '🎭',
    tag: 'DOLBY DIGITAL',
    tagColor: '#4A6AEF'
  },
  'Sona Mina': {
    gradient: 'linear-gradient(135deg, #0D0A00 0%, #2D2005 40%, #0D0A00 100%)',
    accentColor: '#F5C842',
    glowColor: 'rgba(245,200,66,0.4)',
    pattern: 'radial-gradient(ellipse at 25% 55%, rgba(245,200,66,0.15) 0%, transparent 60%), radial-gradient(ellipse at 75% 25%, rgba(245,200,66,0.1) 0%, transparent 50%)',
    icon: '⭐',
    tag: '3D CINEMA',
    tagColor: '#F5C842'
  },
  'Kalaiarangam': {
    gradient: 'linear-gradient(135deg, #000D05 0%, #052D10 40%, #000D05 100%)',
    accentColor: '#2AB52A',
    glowColor: 'rgba(42,181,42,0.4)',
    pattern: 'radial-gradient(ellipse at 35% 45%, rgba(42,181,42,0.15) 0%, transparent 60%), radial-gradient(ellipse at 65% 35%, rgba(42,181,42,0.1) 0%, transparent 50%)',
    icon: '🏛️',
    tag: 'GRAND HALL',
    tagColor: '#2AB52A'
  },
  'Cauvery Theatre': {
    gradient: 'linear-gradient(135deg, #00080D 0%, #05202D 40%, #00080D 100%)',
    accentColor: '#00B4D8',
    glowColor: 'rgba(0,180,216,0.4)',
    pattern: 'radial-gradient(ellipse at 20% 60%, rgba(0,180,216,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(0,180,216,0.1) 0%, transparent 50%)',
    icon: '🌊',
    tag: 'PREMIUM',
    tagColor: '#00B4D8'
  }
}

// Default style
const DEFAULT_STYLE = {
  gradient: 'linear-gradient(135deg,#1A1A24,#22222E)',
  accentColor: '#E8192C',
  glowColor: 'rgba(232,25,44,0.3)',
  pattern: '',
  icon: '🎭',
  tag: 'CINEMA',
  tagColor: '#E8192C'
}

function TheatreBanner({ theatre, imageUrl, style }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const showImage = imageUrl && !imgError

  return (
    <div style={{ width:'100%', height:220, position:'relative', overflow:'hidden' }}>

      {/* CSS Background — always shown as base */}
      <div style={{
        position: 'absolute', inset: 0,
        background: style.gradient,
        zIndex: 1
      }}>
        {/* Pattern overlay */}
        <div style={{ position:'absolute', inset:0, background: style.pattern }} />

        {/* Animated neon lines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, transparent, ${style.accentColor}, transparent)`,
          opacity: 0.8,
          animation: 'neonPulse 3s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, transparent, ${style.accentColor}, transparent)`,
          opacity: 0.5
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: style.accentColor, opacity: 0.06
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 150, height: 150, borderRadius: '50%',
          background: style.accentColor, opacity: 0.08
        }} />

        {/* Film strip decoration */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 20,
          background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 14px, ${style.accentColor}22 14px, ${style.accentColor}22 18px)`,
          opacity: 0.5
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 20,
          background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 14px, ${style.accentColor}22 14px, ${style.accentColor}22 18px)`,
          opacity: 0.5
        }} />

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          {/* Glow circle behind icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: style.glowColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px ${style.glowColor}`,
            animation: 'glowPulse 2s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '2.5rem' }}>{style.icon}</span>
          </div>

          {/* Theatre name */}
          <div style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: '1.5rem', letterSpacing: 4,
            color: 'rgba(255,255,255,0.85)',
            textShadow: `0 0 20px ${style.accentColor}`
          }}>
            {theatre.name.toUpperCase()}
          </div>

          {/* Tag line */}
          <div style={{
            padding: '3px 12px',
            border: `1px solid ${style.accentColor}`,
            borderRadius: 20, fontSize: '.65rem',
            color: style.accentColor, fontWeight: 700,
            letterSpacing: 3
          }}>
            {style.tag}
          </div>
        </div>
      </div>

      {/* Real image on top — if provided and loaded */}
      {showImage && (
        <img
          src={imageUrl}
          alt={theatre.name}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        />
      )}

      {/* Dark gradient at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to top, rgba(17,17,24,1), transparent)',
        zIndex: 3, pointerEvents: 'none'
      }} />

      {/* Rating badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 4,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '4px 12px', borderRadius: 20,
        fontSize: '.75rem', color: '#F5C842', fontWeight: 700
      }}>
        ⭐ {theatre.rating || '4.2'}
      </div>

      {/* Distance badge */}
      {theatre.distance && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 4,
          background: style.accentColor,
          padding: '4px 12px', borderRadius: 20,
          fontSize: '.75rem', color: '#fff', fontWeight: 700
        }}>
          📍 {theatre.distance} km
        </div>
      )}

      <style>{`
        @keyframes neonPulse {
          0%,100% { opacity: 0.8; }
          50% { opacity: 0.3; }
        }
        @keyframes glowPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default function TheatreCard({ theatre, onSelectTime }) {
  const navigate = useNavigate()
  const imageUrl = THEATRE_IMAGES[theatre.name] || theatre.images?.banner || ''
  const style    = THEATRE_STYLES[theatre.name] || DEFAULT_STYLE
  const times    = theatre.times || ['10:00 AM', '1:30 PM', '4:45 PM', '8:00 PM']

  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden',
        cursor: 'pointer', transition: 'all .3s',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.borderColor = style.accentColor + '60'
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = 'none'
      }}>

      {/* Theatre Banner */}
      <TheatreBanner theatre={theatre} imageUrl={imageUrl} style={style} />

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '.4rem', color: '#F0F0F5' }}>
          {theatre.name}
        </div>
        <div style={{ fontSize: '.82rem', color: '#A0A0B0', marginBottom: '.85rem', lineHeight: 1.5 }}>
          📍 {theatre.address?.full || `${theatre.address?.area || ''}, ${theatre.address?.city || 'Trichy'}`}
        </div>

        {/* Amenities */}
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {(theatre.amenities || []).slice(0, 4).map(a => (
            <span key={a} style={{
              fontSize: '.7rem', padding: '3px 10px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, color: '#A0A0B0',
              background: 'rgba(255,255,255,0.03)'
            }}>{a}</span>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '1rem' }} />

        <div style={{ fontSize: '.72rem', color: '#606070', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '.6rem', fontWeight: 600 }}>
          Today's Shows
        </div>

        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {times.map(t => (
            <button key={t}
              onClick={e => { e.stopPropagation(); onSelectTime?.(theatre, t) }}
              style={{
                padding: '5px 12px',
                background: '#1A1A24',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, fontSize: '.78rem',
                color: '#F0F0F5', cursor: 'pointer',
                transition: 'all .2s',
                fontFamily: 'Outfit,sans-serif', fontWeight: 500
              }}
              onMouseEnter={e => {
                e.target.style.background = style.accentColor
                e.target.style.borderColor = style.accentColor
                e.target.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.target.style.background = '#1A1A24'
                e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                e.target.style.color = '#F0F0F5'
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
