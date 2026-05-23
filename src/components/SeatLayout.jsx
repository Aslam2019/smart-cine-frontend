import { useState, useEffect } from 'react'

const PRICES = { vip: 350, gold: 200, silver: 120 }
const PRESET_BOOKED = [2, 5, 8, 14, 20, 33, 45, 62, 78, 90]

export default function SeatLayout({ seats, onSelectionChange, maxSeats = 8 }) {
  const [selected, setSelected] = useState([])

  const toggle = (seat) => {
    if (seat.status === 'booked') return
    setSelected(prev => {
      const exists = prev.find(s => s.seatId === seat.seatId)
      if (exists) return prev.filter(s => s.seatId !== seat.seatId)
      if (prev.length >= maxSeats) return prev
      return [...prev, seat]
    })
  }

  useEffect(() => {
    const total = selected.reduce((sum, s) => sum + s.price, 0)
    onSelectionChange?.(selected, total)
  }, [selected])

  const renderSection = (label, category, seatList) => {
    if (!seatList?.length) return null
    return (
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'.75rem' }}>
          <span style={{ fontSize:'.75rem', color:'#606070', letterSpacing:2, textTransform:'uppercase' }}>
            {label} · ₹{PRICES[category]}
          </span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
          {seatList.map(seat => {
            const isSelected = !!selected.find(s => s.seatId === seat.seatId)
            const isBooked = seat.status === 'booked'
            const isVip = category === 'vip'
            return (
              <button
                key={seat.seatId}
                onClick={() => toggle(seat)}
                title={`${label} ${seat.seatId} — ₹${seat.price}`}
                style={{
                  width:32, height:28, borderRadius:'4px 4px 2px 2px',
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  transition:'all .15s', fontSize:'.6rem', fontWeight:700,
                  border:'1px solid transparent',
                  background: isBooked
                    ? '#1A1A24'
                    : isSelected
                      ? (isVip ? '#F5C842' : '#E8192C')
                      : (isVip ? 'rgba(245,200,66,0.08)' : '#22222E'),
                  color: isBooked
                    ? '#606070'
                    : isSelected
                      ? (isVip ? '#000' : '#fff')
                      : (isVip ? '#F5C842' : '#606070'),
                  opacity: isBooked ? 0.5 : 1,
                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                  borderColor: isBooked
                    ? 'rgba(255,255,255,0.05)'
                    : isSelected
                      ? (isVip ? '#C4970A' : '#B01020')
                      : (isVip ? 'rgba(245,200,66,0.3)' : 'rgba(255,255,255,0.15)')
                }}>
                {seat.number}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // If seats is flat array, group by category
  const grouped = Array.isArray(seats)
    ? { vip: seats.filter(s=>s.category==='vip'), gold: seats.filter(s=>s.category==='gold'), silver: seats.filter(s=>s.category==='silver') }
    : seats

  return (
    <div>
      {/* Screen */}
      <div style={{ background:'linear-gradient(to bottom,rgba(232,25,44,0.3),transparent)', borderTop:'3px solid rgba(232,25,44,.5)', textAlign:'center', padding:'.4rem', fontSize:'.75rem', color:'#A0A0B0', borderRadius:4, marginBottom:'1.5rem', letterSpacing:3 }}>
        SCREEN
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {[
          { label:'Available', bg:'#22222E', border:'rgba(255,255,255,0.15)' },
          { label:'Selected', bg:'#E8192C', border:'#B01020' },
          { label:'Booked', bg:'#1A1A24', border:'rgba(255,255,255,0.05)', opacity:0.5 },
          { label:'VIP', bg:'rgba(245,200,66,0.08)', border:'rgba(245,200,66,0.3)' }
        ].map(item => (
          <div key={item.label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.75rem', color:'#A0A0B0' }}>
            <div style={{ width:16, height:14, borderRadius:2, background:item.bg, border:`1px solid ${item.border}`, opacity:item.opacity||1 }} />
            {item.label}
          </div>
        ))}
      </div>

      {renderSection('VIP', 'vip', grouped.vip)}
      {renderSection('GOLD', 'gold', grouped.gold)}
      {renderSection('SILVER', 'silver', grouped.silver)}
    </div>
  )
}
