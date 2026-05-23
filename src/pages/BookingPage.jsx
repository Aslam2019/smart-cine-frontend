import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookingsAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import SeatLayout from '../components/SeatLayout'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'
import { generateTicketPDF } from '../utils/generatePDF'

// ══════════════════════════════════════════
// SNACKS DATA WITH AI GENERATED IMAGES
// ══════════════════════════════════════════
const SNACKS = [
  {
    id: 's1', name: 'Popcorn (Butter)', price: 120, category: 'Snacks',
    emoji: '🍿',
    desc: 'Classic salted butter popcorn',
    color: '#F5C842',
    bg: 'linear-gradient(135deg,#2A1F05,#3D2E08)'
  },
  {
    id: 's2', name: 'Popcorn (Caramel)', price: 140, category: 'Snacks',
    emoji: '🍿',
    desc: 'Sweet caramel coated popcorn',
    color: '#D4860A',
    bg: 'linear-gradient(135deg,#2A1505,#3D200A)'
  },
  {
    id: 's3', name: 'Sandwich', price: 80, category: 'Snacks',
    emoji: '🥪',
    desc: 'Veg / Chicken grilled sandwich',
    color: '#8BC34A',
    bg: 'linear-gradient(135deg,#0D1F05,#162E08)'
  },
  {
    id: 's4', name: 'Black Forest Cake', price: 150, category: 'Desserts',
    emoji: '🎂',
    desc: 'Creamy black forest pastry slice',
    color: '#E91E63',
    bg: 'linear-gradient(135deg,#2A0510,#3D0818)'
  },
  {
    id: 's5', name: 'Donuts', price: 90, category: 'Desserts',
    emoji: '🍩',
    desc: 'Glazed & chocolate donuts',
    color: '#FF7043',
    bg: 'linear-gradient(135deg,#2A0D05,#3D1508)'
  },
  {
    id: 's6', name: 'Cold Coffee', price: 100, category: 'Beverages',
    emoji: '☕',
    desc: 'Chilled cold coffee with ice cream',
    color: '#795548',
    bg: 'linear-gradient(135deg,#1A0F05,#2D1A08)'
  },
  {
    id: 's7', name: 'Hot Tea', price: 40, category: 'Beverages',
    emoji: '🍵',
    desc: 'Masala / Ginger / Lemon tea',
    color: '#FF8F00',
    bg: 'linear-gradient(135deg,#2A1505,#3D2008)'
  },
  {
    id: 's8', name: 'Fresh Juice', price: 80, category: 'Beverages',
    emoji: '🧃',
    desc: 'Orange / Mango / Watermelon juice',
    color: '#FF6D00',
    bg: 'linear-gradient(135deg,#2A1005,#3D1A08)'
  },
  {
    id: 's9', name: 'Egg Puffs', price: 30, category: 'Snacks',
    emoji: '🥐',
    desc: 'Flaky pastry with spiced egg filling',
    color: '#FFC107',
    bg: 'linear-gradient(135deg,#2A1A05,#3D2808)'
  },
  {
    id: 's10', name: 'Chicken Puffs', price: 40, category: 'Snacks',
    emoji: '🥐',
    desc: 'Crispy puff with spiced chicken filling',
    color: '#FF5722',
    bg: 'linear-gradient(135deg,#2A0D05,#3D1508)'
  },
  {
    id: 's11', name: 'Nachos & Salsa', price: 110, category: 'Snacks',
    emoji: '🌮',
    desc: 'Crispy nachos with cheese & salsa dip',
    color: '#CDDC39',
    bg: 'linear-gradient(135deg,#1A1F05,#262E08)'
  },
  {
    id: 's12', name: 'Pepsi / Coke', price: 60, category: 'Beverages',
    emoji: '🥤',
    desc: 'Chilled soft drinks 300ml',
    color: '#2196F3',
    bg: 'linear-gradient(135deg,#05101A,#08182D)'
  },
  {
    id: 's13', name: 'Mineral Water', price: 20, category: 'Beverages',
    emoji: '💧',
    desc: 'Chilled mineral water 500ml',
    color: '#00BCD4',
    bg: 'linear-gradient(135deg,#05181A,#08252D)'
  },
  {
    id: 's14', name: 'Combo Meal', price: 250, category: 'Combos',
    emoji: '🎁',
    desc: 'Popcorn + Cold drink + Puffs',
    color: '#9C27B0',
    bg: 'linear-gradient(135deg,#150520,#200830)'
  },
  {
    id: 's15', name: 'Family Combo', price: 450, category: 'Combos',
    emoji: '🎪',
    desc: '2 Popcorn + 4 Drinks + 4 Puffs',
    color: '#E8192C',
    bg: 'linear-gradient(135deg,#2A0508,#3D080D)'
  }
]

const SNACK_CATEGORIES = ['All', 'Snacks', 'Beverages', 'Desserts', 'Combos']

const PRICES = { vip:350, gold:200, silver:120 }
const LETTERS = 'ABCDEFGHIJKL'
const PRESET_BOOKED = [2,5,8,14,20,33,45,62,78,90]

function generateSeats() {
  const seats = []
  const layout = [
    { cat:'vip',    rows:2, cols:10 },
    { cat:'gold',   rows:4, cols:10 },
    { cat:'silver', rows:6, cols:10 },
  ]
  let ri=0, idx=1
  layout.forEach(({ cat, rows, cols }) => {
    for (let r=0; r<rows; r++, ri++) {
      for (let c=1; c<=cols; c++, idx++) {
        seats.push({ seatId:`${LETTERS[ri]}${c}`, row:LETTERS[ri], number:c, category:cat, price:PRICES[cat], status: PRESET_BOOKED.includes(idx) ? 'booked' : 'available' })
      }
    }
  })
  return seats
}

// ── Snack Image Card ──────────────────────────────────────────────
function SnackCard({ snack, qty, onAdd, onRemove }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: snack.bg,
        border: `1px solid ${qty > 0 ? snack.color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14, overflow: 'hidden', transition: 'all .25s',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? `0 12px 40px rgba(0,0,0,0.4)` : 'none',
        position: 'relative'
      }}>

      {/* Image area with big emoji */}
      <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circle behind emoji */}
        <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: snack.color, opacity: 0.12 }} />
        <div style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', background: snack.color, opacity: 0.1 }} />

        {/* Big emoji as food image */}
        <span style={{ fontSize: '3.5rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))', transition: 'transform .2s', transform: hover ? 'scale(1.15)' : 'scale(1)' }}>
          {snack.emoji}
        </span>

        {/* Qty badge */}
        {qty > 0 && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: snack.color, color: '#000', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 800 }}>
            {qty}
          </div>
        )}

        {/* Popular badge */}
        {['s1','s4','s14','s15'].includes(snack.id) && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: snack.color, padding: '2px 8px', borderRadius: 10, fontSize: '.6rem', fontWeight: 700, color: '#000', letterSpacing: 1 }}>
            HOT 🔥
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '.75rem 1rem' }}>
        <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#F0F0F5', marginBottom: '.2rem' }}>{snack.name}</div>
        <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '.6rem', lineHeight: 1.4 }}>{snack.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: snack.color }}>₹{snack.price}</span>

          {/* Add/Remove controls */}
          {qty === 0 ? (
            <button onClick={() => onAdd(snack)}
              style={{ padding: '5px 14px', background: snack.color, color: '#000', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: '.78rem', fontFamily: 'Outfit,sans-serif', transition: 'transform .1s' }}
              onMouseEnter={e => e.target.style.transform='scale(1.05)'}
              onMouseLeave={e => e.target.style.transform='scale(1)'}>
              + Add
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <button onClick={() => onRemove(snack)}
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.1)', border: `1px solid ${snack.color}`, color: snack.color, borderRadius: '50%', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif' }}>
                −
              </button>
              <span style={{ fontWeight: 800, fontSize: '.9rem', color: snack.color, minWidth: 16, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => onAdd(snack)}
                style={{ width: 28, height: 28, background: snack.color, border: 'none', color: '#000', borderRadius: '50%', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif' }}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Booking Page ─────────────────────────────────────────────
export default function BookingPage() {
  const location   = useLocation()
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const { movie, theatre, time, date } = location.state || {}

  const [step, setStep]           = useState('seats')   // seats | snacks | payment | ticket
  const [seats]                   = useState(generateSeats)
  const [selected, setSelected]   = useState([])
  const [seatTotal, setSeatTotal] = useState(0)
  const [snackFilter, setSnackFilter] = useState('All')
  const [snackCart, setSnackCart] = useState({})
  const [payMethod, setPayMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [booking, setBooking]     = useState(null)
  const [countdown, setCountdown] = useState(600)
  const timerRef                  = useRef(null)

  useEffect(() => {
    if (step !== 'seats') return
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current); toast.error('Session expired!'); navigate(-1); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step])

  const mins = String(Math.floor(countdown/60)).padStart(2,'0')
  const secs = String(countdown%60).padStart(2,'0')

  const handleSeatSelection = (sel, total) => { setSelected(sel); setSeatTotal(total) }

  const snackTotal = Object.entries(snackCart).reduce((sum, [id, qty]) => {
    const s = SNACKS.find(s => s.id === id)
    return sum + (s ? s.price * qty : 0)
  }, 0)

  const snackCount = Object.values(snackCart).reduce((a, b) => a + b, 0)

  const addSnack = (snack) => {
    setSnackCart(prev => ({ ...prev, [snack.id]: (prev[snack.id] || 0) + 1 }))
    toast.success(`${snack.emoji} ${snack.name} added!`, { duration: 1200 })
  }

  const removeSnack = (snack) => {
    setSnackCart(prev => {
      const next = { ...prev }
      if (next[snack.id] > 1) next[snack.id]--
      else delete next[snack.id]
      return next
    })
  }

  const filteredSnacks = snackFilter === 'All' ? SNACKS : SNACKS.filter(s => s.category === snackFilter)

  const grandTotal = seatTotal + snackTotal
  const conv  = Math.round(grandTotal * 0.02)
  const gst   = Math.round(grandTotal * 0.18)
  const payable = grandTotal + conv + gst

  const goToSnacks = () => {
    if (!selected.length) { toast.error('Please select at least one seat'); return }
    clearInterval(timerRef.current)
    setStep('snacks')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPayment = () => {
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const processPayment = async () => {
    setProcessing(true)
    try {
      await new Promise(r => setTimeout(r, 2000))
      let bookingRes = null
      try {
        bookingRes = await bookingsAPI.create({
          movieId: movie?._id,
          theatreId: theatre?._id,
          showDate: date?.date || new Date().toISOString(),
          showTime: time,
          seatIds: selected.map(s => s.seatId),
          paymentMethod: payMethod,
          language: movie?.language || 'Tamil'
        })
      } catch {}

      const bookId = bookingRes?.data?.booking?.bookingId || ('SCT' + Date.now().toString(36).toUpperCase())

      // Build snack summary
      const snackSummary = Object.entries(snackCart)
        .filter(([id, qty]) => qty > 0)
        .map(([id, qty]) => {
          const s = SNACKS.find(s => s.id === id)
          return `${s.emoji} ${s.name} x${qty}`
        }).join(', ')

      setBooking({
        bookingId: bookId,
        movie: movie?.title || 'Movie',
        theatre: theatre?.name || 'Theatre',
        date: date?.full || new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
        time,
        seats: selected.map(s => s.seatId).join(', '),
        seatTotal, snackTotal, conv, gst, payable,
        snackSummary,
        snackItems: Object.entries(snackCart).filter(([,q]) => q > 0).map(([id, qty]) => ({ ...SNACKS.find(s=>s.id===id), qty }))
      })
      setStep('ticket')
      toast.success('🎉 Booking Confirmed!')
    } catch {
      toast.error('Payment failed. Try again.')
    } finally {
      setProcessing(false)
    }
  }

  // ── TICKET ────────────────────────────────────────────────────────
  if (step === 'ticket' && booking) return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F', padding:'2rem 5%' }}>
      <div style={{ maxWidth:480, margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'4rem', animation:'bounceIn .6s ease' }}>✅</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.5rem', letterSpacing:2, color:'#F5C842', margin:'.5rem 0' }}>BOOKING CONFIRMED!</h2>
          <p style={{ color:'#A0A0B0', fontSize:'.9rem' }}>Your ticket & snacks are ready</p>
        </div>

        {/* Ticket card */}
        <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, overflow:'hidden', marginBottom:'1.5rem' }}>
          <div style={{ background:'#E8192C', padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', letterSpacing:3, color:'#fff' }}>SMART CINE TRICHY</div>
            <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.7)', letterSpacing:2, marginTop:4 }}>OFFICIAL TICKET</div>
          </div>
          <div style={{ padding:'1.5rem' }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2, color:'#E8192C', marginBottom:'.75rem' }}>{booking.movie.toUpperCase()}</div>
            {[
              { label:'Theatre',   val: booking.theatre },
              { label:'Date',      val: booking.date },
              { label:'Show Time', val: booking.time },
              { label:'Seats',     val: booking.seats },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'.4rem 0', borderBottom:'1px dashed rgba(255,255,255,0.07)', fontSize:'.85rem' }}>
                <span style={{ color:'#A0A0B0' }}>{row.label}</span>
                <span style={{ fontWeight:600 }}>{row.val}</span>
              </div>
            ))}

            {/* Snacks in ticket */}
            {booking.snackSummary && (
              <div style={{ padding:'.6rem 0', borderBottom:'1px dashed rgba(255,255,255,0.07)', fontSize:'.82rem' }}>
                <span style={{ color:'#A0A0B0', display:'block', marginBottom:'.25rem' }}>Snacks</span>
                <span style={{ fontWeight:500, color:'#F5C842' }}>{booking.snackSummary}</span>
              </div>
            )}

            {/* Price breakdown */}
            <div style={{ marginTop:'.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'.3rem 0', fontSize:'.82rem', color:'#A0A0B0' }}>
                <span>Seat Amount</span><span>₹{booking.seatTotal}</span>
              </div>
              {booking.snackTotal > 0 && (
                <div style={{ display:'flex', justifyContent:'space-between', padding:'.3rem 0', fontSize:'.82rem', color:'#A0A0B0' }}>
                  <span>Snacks</span><span>₹{booking.snackTotal}</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'.3rem 0', fontSize:'.82rem', color:'#A0A0B0' }}>
                <span>Conv. Fee + GST</span><span>₹{booking.conv + booking.gst}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'.5rem 0', fontSize:'1rem', fontWeight:800, color:'#F5C842', borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:'.25rem' }}>
                <span>Total Paid</span><span>₹{booking.payable}</span>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'1.25rem 0' }}>
              <QRCodeSVG
                value={JSON.stringify({ id:booking.bookingId, movie:booking.movie, seats:booking.seats, date:booking.date })}
                size={130}
                fgColor="#E8192C"
                bgColor="#0A0A0F"
                style={{ border:'4px solid #1A1A24', borderRadius:8, padding:8, background:'#0A0A0F' }}
              />
              <div style={{ fontSize:'.72rem', color:'#606070', letterSpacing:2, marginTop:'.75rem' }}>
                BOOKING ID: {booking.bookingId}
              </div>
            </div>

            <div style={{ background:'#1A1A24', padding:'.75rem', textAlign:'center', borderRadius:8, fontSize:'.75rem', color:'#A0A0B0' }}>
              🎬 Show this QR at the theatre entrance · 🍿 Collect snacks at the counter
            </div>
          </div>
        </div>

        {/* PDF Download Button */}
        <button
          onClick={() => {
            generateTicketPDF({
              ...booking,
              genre: movie?.genre?.[0] || 'Tamil Cinema',
              language: movie?.language || 'Tamil',
              certificate: movie?.certificate || 'UA',
              rating: movie?.rating || '8.0',
              format: '2D'
            })
            toast.success('🖨️ PDF ticket opening...', { icon: '📄' })
          }}
          style={{
            width: '100%', padding: '1rem', marginBottom: '.75rem',
            background: 'linear-gradient(135deg,#1A1A24,#22222E)',
            color: '#F0F0F5', border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'Outfit,sans-serif', fontWeight: 700,
            cursor: 'pointer', borderRadius: 8, fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            transition: 'all .2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#E8192C'; e.currentTarget.style.color='#E8192C' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.color='#F0F0F5' }}>
          📄 Download PDF Ticket
        </button>

        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={() => navigate('/profile')} style={{ flex:1, padding:'.9rem', background:'#111118', color:'#F0F0F5', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Outfit,sans-serif', fontWeight:600, cursor:'pointer', borderRadius:8 }}>My Bookings</button>
          <button onClick={() => navigate('/')} style={{ flex:1, padding:'.9rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontWeight:600, cursor:'pointer', borderRadius:8 }}>Home</button>
        </div>
      </div>
      <style>{`@keyframes bounceIn{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
    </div>
  )

  // ── PAYMENT ───────────────────────────────────────────────────────
  if (step === 'payment') return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'2rem 5%' }}>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.5rem', letterSpacing:2, marginBottom:'1.5rem' }}>CHECKOUT</h2>

        {/* Order summary */}
        <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1.25rem', marginBottom:'1.5rem' }}>
          <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'.75rem', color:'#E8192C' }}>{movie?.title}</div>
          <div style={{ fontSize:'.85rem', color:'#A0A0B0', marginBottom:'.25rem' }}>📍 {theatre?.name} · 🕐 {time} · 📅 {date?.full}</div>
          <div style={{ fontSize:'.85rem', color:'#A0A0B0', marginBottom:'.75rem' }}>💺 Seats: {selected.map(s=>s.seatId).join(', ')}</div>

          {snackCount > 0 && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'.75rem', marginBottom:'.75rem' }}>
              <div style={{ fontSize:'.78rem', color:'#606070', letterSpacing:1, textTransform:'uppercase', marginBottom:'.5rem' }}>Snacks Ordered</div>
              {Object.entries(snackCart).filter(([,q])=>q>0).map(([id,qty]) => {
                const s = SNACKS.find(s=>s.id===id)
                return (
                  <div key={id} style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', padding:'.25rem 0', color:'#A0A0B0' }}>
                    <span>{s.emoji} {s.name} × {qty}</span>
                    <span>₹{s.price * qty}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'.75rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', color:'#A0A0B0', marginBottom:'.25rem' }}><span>Seats</span><span>₹{seatTotal}</span></div>
            {snackTotal > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', color:'#A0A0B0', marginBottom:'.25rem' }}><span>Snacks</span><span>₹{snackTotal}</span></div>}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', color:'#A0A0B0', marginBottom:'.25rem' }}><span>Conv. Fee (2%)</span><span>₹{conv}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', color:'#A0A0B0', marginBottom:'.5rem' }}><span>GST (18%)</span><span>₹{gst}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'1.1rem', fontWeight:800, color:'#F5C842' }}><span>Total Payable</span><span>₹{payable}</span></div>
          </div>
        </div>

        {/* Payment options */}
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem', marginBottom:'1.5rem' }}>
          {[
            { id:'upi',        icon:'📱', label:'UPI / GPay / PhonePe', desc:'Instant UPI transfer' },
            { id:'card',       icon:'💳', label:'Credit / Debit Card',  desc:'Visa, Mastercard, RuPay' },
            { id:'netbanking', icon:'🏦', label:'Net Banking',          desc:'All major banks' },
            { id:'wallet',     icon:'👛', label:'Wallets',              desc:'Paytm, Amazon Pay' },
          ].map(opt => (
            <div key={opt.id} onClick={() => setPayMethod(opt.id)}
              style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.25rem', background: payMethod===opt.id ? 'rgba(232,25,44,0.07)' : '#111118', border:`1px solid ${payMethod===opt.id ? '#E8192C' : 'rgba(255,255,255,0.08)'}`, borderRadius:10, cursor:'pointer', transition:'all .2s' }}>
              <span style={{ fontSize:'1.5rem', width:40, textAlign:'center' }}>{opt.icon}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:'.95rem' }}>{opt.label}</div>
                <div style={{ fontSize:'.78rem', color:'#A0A0B0', marginTop:2 }}>{opt.desc}</div>
              </div>
              {payMethod===opt.id && <span style={{ marginLeft:'auto', color:'#E8192C', fontSize:'1.2rem' }}>✓</span>}
            </div>
          ))}
        </div>

        <button onClick={processPayment} disabled={processing}
          style={{ width:'100%', padding:'1.1rem', background: processing ? '#606070' : '#E8192C', color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:2, cursor: processing ? 'wait' : 'pointer', borderRadius:8 }}>
          {processing ? '⟳ PROCESSING...' : `PAY ₹${payable}`}
        </button>
        <button onClick={() => setStep('snacks')} style={{ width:'100%', marginTop:'.75rem', padding:'.8rem', background:'transparent', color:'#A0A0B0', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Outfit,sans-serif', cursor:'pointer', borderRadius:8 }}>← Back</button>
      </div>
    </div>
  )

  // ── SNACKS STEP ───────────────────────────────────────────────────
  if (step === 'snacks') return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>
      <div style={{ padding:'2.5rem 5%' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2rem,5vw,3rem)', letterSpacing:2 }}>
              🍿 ADD SNACKS
            </h2>
            <p style={{ color:'#A0A0B0', fontSize:'.9rem', marginTop:'.25rem' }}>
              {movie?.title} · {theatre?.name} · {date?.full} · {time}
            </p>
          </div>

          {/* Cart summary top */}
          {snackCount > 0 && (
            <div style={{ background:'rgba(232,25,44,0.1)', border:'1px solid rgba(232,25,44,0.3)', borderRadius:10, padding:'.75rem 1.25rem', textAlign:'right' }}>
              <div style={{ fontSize:'.75rem', color:'#A0A0B0' }}>{snackCount} item{snackCount>1?'s':''} added</div>
              <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#F5C842' }}>₹{snackTotal}</div>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
          {SNACK_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSnackFilter(cat)}
              style={{ padding:'.5rem 1.25rem', borderRadius:20, cursor:'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.82rem', fontWeight:600, transition:'all .2s', border:'none', background: snackFilter===cat ? '#E8192C' : '#111118', color: snackFilter===cat ? '#fff' : '#A0A0B0', outline: snackFilter===cat ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
              {cat === 'All' ? '🍽️ All' : cat === 'Snacks' ? '🍿 Snacks' : cat === 'Beverages' ? '🥤 Beverages' : cat === 'Desserts' ? '🍰 Desserts' : '🎁 Combos'}
            </button>
          ))}
        </div>

        {/* Snacks Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {filteredSnacks.map(snack => (
            <SnackCard
              key={snack.id}
              snack={snack}
              qty={snackCart[snack.id] || 0}
              onAdd={addSnack}
              onRemove={removeSnack}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ position:'sticky', bottom:'1.5rem', background:'rgba(17,17,24,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:'.78rem', color:'#606070', marginBottom:'.25rem' }}>
              {selected.length} seat{selected.length>1?'s':''} · {snackCount > 0 ? `${snackCount} snack item${snackCount>1?'s':''}` : 'No snacks yet'}
            </div>
            <div style={{ fontWeight:800, fontSize:'1.2rem', color:'#F5C842' }}>
              Total: ₹{grandTotal}
              <span style={{ fontSize:'.75rem', color:'#606070', fontWeight:400, marginLeft:'.5rem' }}>+taxes</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:'.75rem' }}>
            <button onClick={() => setStep('seats')} style={{ padding:'.8rem 1.5rem', background:'transparent', color:'#A0A0B0', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Outfit,sans-serif', fontWeight:600, cursor:'pointer', borderRadius:8, fontSize:'.9rem' }}>← Seats</button>
            <button onClick={goToPayment}
              style={{ padding:'.8rem 2rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.3rem', letterSpacing:1, cursor:'pointer', borderRadius:8, transition:'all .2s' }}
              onMouseEnter={e => e.target.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform='translateY(0)'}>
              {snackCount > 0 ? `CHECKOUT ₹${payable}` : 'SKIP & CHECKOUT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── SEATS STEP ────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'2rem 5%' }}>

        {/* Header */}
        <div style={{ marginBottom:'1.5rem' }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2 }}>SELECT SEATS</h2>
          <p style={{ color:'#A0A0B0', fontSize:'.88rem', marginTop:'.25rem' }}>
            {movie?.title} · {theatre?.name} · {date?.full} · {time}
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'2rem', fontSize:'.8rem' }}>
          {[{ num:1, label:'Seats', active:true },{ num:2, label:'Snacks', active:false },{ num:3, label:'Pay', active:false }].map((s, i) => (
            <div key={s.num} style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background: s.active ? '#E8192C' : '#1A1A24', border:`1px solid ${s.active ? '#E8192C' : 'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.8rem', color: s.active ? '#fff' : '#606070' }}>{s.num}</div>
              <span style={{ color: s.active ? '#F0F0F5' : '#606070', fontWeight: s.active ? 600 : 400 }}>{s.label}</span>
              {i < 2 && <div style={{ width:30, height:1, background:'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        {/* Seat layout */}
        <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem' }}>
          <SeatLayout seats={seats} onSelectionChange={handleSeatSelection} />
        </div>

        {/* Summary */}
        <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'1.25rem', marginBottom:'1rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'.4rem 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'.88rem' }}>
            <span style={{ color:'#A0A0B0' }}>Selected Seats</span>
            <span>{selected.length ? selected.map(s=>s.seatId).join(', ') : 'None selected'}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'.4rem 0', fontSize:'.88rem' }}>
            <span style={{ color:'#A0A0B0' }}>Seat Total</span>
            <span style={{ color:'#E8192C', fontWeight:700, fontSize:'1rem' }}>₹{seatTotal}</span>
          </div>
        </div>

        {/* Timer */}
        <div style={{ textAlign:'center', fontSize:'.82rem', color:'#A0A0B0', marginBottom:'1rem' }}>
          ⏱ Session expires in <span style={{ color:'#F5C842', fontWeight:700, fontSize:'1.1rem', fontFamily:"'Bebas Neue',sans-serif" }}>{mins}:{secs}</span>
        </div>

        {/* Next button */}
        <button onClick={goToSnacks}
          style={{ width:'100%', padding:'1.1rem', background:'#E8192C', color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:2, cursor:'pointer', borderRadius:8, transition:'all .25s' }}
          onMouseEnter={e => { e.target.style.background='#B01020'; e.target.style.transform='translateY(-2px)' }}
          onMouseLeave={e => { e.target.style.background='#E8192C'; e.target.style.transform='translateY(0)' }}>
          NEXT → ADD SNACKS 🍿
        </button>
      </div>
    </div>
  )
}
