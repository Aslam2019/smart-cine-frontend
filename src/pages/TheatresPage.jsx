import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TheatreCard from '../components/TheatreCard'

const FALLBACK_THEATRES = [
  { _id:'t1', name:'LA Cinema', address:{ full:'#12, Salai Rd, Srirangam, Trichy – 620006' }, amenities:['Dolby Atmos','4K Laser','Recliner Seats','Food Court'], location:{ coordinates:[78.6930,10.8651] }, rating:4.6, emoji:'🎬', gradient:'linear-gradient(135deg,#1A0505 0%,#2D0808 100%)', distance:2.1, times:['10:00 AM','1:30 PM','4:45 PM','8:00 PM'] },
  { _id:'t2', name:'Ramba Theatre', address:{ full:'#78, Anna Salai, Cantonment, Trichy – 620001' }, amenities:['Dolby Digital','HD Screen','Parking'], location:{ coordinates:[78.6856,10.8050] }, rating:4.2, emoji:'🎭', gradient:'linear-gradient(135deg,#050A1A 0%,#080D2D 100%)', distance:3.5, times:['9:30 AM','12:45 PM','4:00 PM','7:30 PM'] },
  { _id:'t3', name:'Sona Mina', address:{ full:'#45, Bharathidasan Rd, Woraiyur, Trichy – 620003' }, amenities:['3D Enabled','Snack Bar','Couples Seats'], location:{ coordinates:[78.7130,10.7905] }, rating:4.0, emoji:'⭐', gradient:'linear-gradient(135deg,#1A1505 0%,#2D2008 100%)', distance:4.2, times:['10:30 AM','2:00 PM','5:15 PM','9:00 PM'] },
  { _id:'t4', name:'Kalaiarangam', address:{ full:'Municipal Corp Complex, Teppakulam, Trichy – 620002' }, amenities:['Large Screen','AC Hall','Cultural Events'], location:{ coordinates:[78.6957,10.8100] }, rating:3.9, emoji:'🏛️', gradient:'linear-gradient(135deg,#0A1505 0%,#0D2008 100%)', distance:5.1, times:['11:00 AM','3:00 PM','6:30 PM'] },
  { _id:'t5', name:'Cauvery Theatre', address:{ full:'#23, Mettu St, K.K. Nagar, Trichy – 620021' }, amenities:['Dolby Sound','Premium Seating','Online Booking'], location:{ coordinates:[78.7052,10.8215] }, rating:4.4, emoji:'🌊', gradient:'linear-gradient(135deg,#05151A 0%,#08202D 100%)', distance:6.3, times:['9:00 AM','12:30 PM','3:45 PM','7:00 PM'] }
]

export default function TheatresPage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = FALLBACK_THEATRES.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.address?.full || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ paddingTop:70, minHeight:'100vh', background:'#0A0A0F' }}>
      <div style={{ background:'linear-gradient(135deg,#0A0A0F 0%,#0F0A1A 100%)', padding:'4rem 5% 3rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'.75rem', color:'#E8192C', letterSpacing:3, textTransform:'uppercase', fontWeight:600, marginBottom:'.75rem' }}>📍 Trichy District</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(3rem,7vw,6rem)', letterSpacing:2, lineHeight:1, marginBottom:'1rem' }}>ALL THEATRES</h1>
        <p style={{ color:'#A0A0B0', fontSize:'1rem', fontWeight:300 }}>Premium cinema halls — sorted by your location</p>
      </div>

      <div style={{ padding:'3rem 5%' }}>
        <div style={{ marginBottom:'2.5rem' }}>
          <input placeholder="🔍 Search theatre or area..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding:'.8rem 1.2rem', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#F0F0F5', fontFamily:'Outfit,sans-serif', fontSize:'.95rem', outline:'none', width:'100%', maxWidth:400 }}
            onFocus={e => e.target.style.borderColor='#E8192C'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', padding:'.75rem 1.25rem', background:'rgba(245,200,66,0.05)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:8 }}>
          <span style={{ fontSize:'1.2rem' }}>📍</span>
          <span style={{ fontSize:'.85rem', color:'#A0A0B0' }}>
            Showing <strong style={{ color:'#F5C842' }}>{filtered.length} theatres</strong> near you · Sorted by distance
          </span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.5rem' }}>
          {filtered.map(t => (
            <TheatreCard key={t._id} theatre={t}
              onSelectTime={(theatre, time) => navigate('/movies')} />
          ))}
        </div>
      </div>
    </div>
  )
}
