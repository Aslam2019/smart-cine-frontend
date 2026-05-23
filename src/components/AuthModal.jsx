import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ══════════════════════════════════════════
// OTP AUTH MODAL - Full Flow
// Step 1: Enter phone/email
// Step 2: Enter OTP (simulated)
// Step 3: Enter name (if new user)
// ══════════════════════════════════════════

export default function AuthModal({ onClose }) {
  const [mode, setMode]         = useState('phone')   // phone | otp | name | email
  const [phone, setPhone]       = useState('')
  const [email, setEmail]       = useState('')
  const [otp, setOtp]           = useState(['','','','','',''])
  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [loading, setLoading]   = useState(false)
  const [timer, setTimer]       = useState(0)
  const [isNewUser, setIsNewUser] = useState(false)
  const [loginType, setLoginType] = useState('phone') // phone | email
  const { login, register }     = useAuth()

  // Generate 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Start resend timer
  const startTimer = () => {
    setTimer(30)
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
  }

  // Send OTP
  const sendOTP = async () => {
    if (loginType === 'phone') {
      if (!phone || phone.length !== 10) { toast.error('Enter valid 10-digit phone number'); return }
    } else {
      if (!email || !email.includes('@')) { toast.error('Enter valid email address'); return }
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500)) // simulate API call
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    setLoading(false)
    setMode('otp')
    startTimer()

    // Show OTP in toast for demo purposes
    toast.success(`OTP sent! Demo OTP: ${newOtp}`, { duration: 10000, icon: '📱' })
  }

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index+1}`)?.focus()
    }
    // Auto verify when all 6 digits entered
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      verifyOTP(newOtp.join(''))
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index-1}`)?.focus()
    }
  }

  // Verify OTP
  const verifyOTP = async (enteredOtp) => {
    const code = enteredOtp || otp.join('')
    if (code.length !== 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    if (code === generatedOtp) {
      // Check if new user (simulate - if phone starts with odd digit = new user)
      const firstDigit = loginType === 'phone' ? parseInt(phone[0]) : 0
      const isNew = firstDigit % 2 !== 0
      setIsNewUser(isNew)
      setLoading(false)
      if (isNew) {
        setMode('name')
      } else {
        // Existing user - login directly
        await completeLogin()
      }
    } else {
      setLoading(false)
      toast.error('Invalid OTP! Please try again')
      setOtp(['','','','','',''])
      document.getElementById('otp-0')?.focus()
    }
  }

  // Complete login for existing user
  const completeLogin = async () => {
    setLoading(true)
    try {
      const identifier = loginType === 'phone' ? phone + '@smartcine.com' : email
      const pwd = loginType === 'phone' ? `SCT${phone}` : `SCT${email}`
      const userName = loginType === 'phone' ? `User ${phone.slice(-4)}` : email.split('@')[0]
      try {
        await login(identifier, pwd)
      } catch {
        try {
          await register(userName, identifier, pwd, loginType === 'phone' ? phone : '')
        } catch {
          // Backend sleeping - save locally
          const localUser = { name: userName, email: identifier, phone: loginType==='phone' ? phone : '', role:'user', id: Date.now().toString() }
          localStorage.setItem('sct_user', JSON.stringify(localUser))
          localStorage.setItem('sct_token', 'local_token_' + Date.now())
        }
      }
      toast.success('🎬 Welcome to Smart Cine Trichy!')
      onClose()
      window.location.reload()
    } catch (err) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Complete registration for new user
  const completeRegistration = async () => {
    if (!name.trim()) { toast.error('Please enter your name'); return }
    setLoading(true)
    try {
      const identifier = loginType === 'phone' ? phone + '@smartcine.com' : email
      const pwd = loginType === 'phone' ? `SCT${phone}` : `SCT${email}`
      try {
        await register(name, identifier, pwd, loginType === 'phone' ? phone : '')
      } catch {
        // Backend sleeping - save locally
        const localUser = { name, email: identifier, phone: loginType==='phone' ? phone : '', role:'user', id: Date.now().toString() }
        localStorage.setItem('sct_user', JSON.stringify(localUser))
        localStorage.setItem('sct_token', 'local_token_' + Date.now())
      }
      toast.success('🎉 Welcome to Smart Cine Trichy!')
      onClose()
      window.location.reload()
    } catch (err) {
      toast.error('Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (timer > 0) return
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    setOtp(['','','','','',''])
    startTimer()
    toast.success(`New OTP sent! Demo OTP: ${newOtp}`, { duration: 10000, icon: '📱' })
    document.getElementById('otp-0')?.focus()
  }

  // Styles
  const inputStyle = {
    width: '100%', padding: '.8rem 1rem',
    background: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, color: '#F0F0F5',
    fontFamily: 'Outfit,sans-serif', fontSize: '1rem',
    outline: 'none', transition: 'border-color .2s'
  }

  const focusStyle = (e) => e.target.style.borderColor = '#E8192C'
  const blurStyle  = (e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>

      <div style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, width:'100%', maxWidth:420, padding:'2.5rem', position:'relative', animation:'slideUp .3s ease' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:'1rem', right:'1rem', width:36, height:36, background:'#1A1A24', border:'1px solid rgba(255,255,255,0.08)', color:'#A0A0B0', borderRadius:'50%', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:3, marginBottom:'.25rem' }}>
            SMART <span style={{ color:'#E8192C' }}>CINE</span>
          </div>

          {/* Progress dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:'1rem' }}>
            {['phone','otp','name'].map((s, i) => (
              <div key={s} style={{ width: mode === s ? 24 : 8, height:8, borderRadius:4, background: (mode === s || (s==='phone' && (mode==='otp'||mode==='name')) || (s==='otp' && mode==='name')) ? '#E8192C' : 'rgba(255,255,255,0.1)', transition:'all .3s' }} />
            ))}
          </div>
        </div>

        {/* ── STEP 1: PHONE / EMAIL ── */}
        {mode === 'phone' && (
          <>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2, textAlign:'center', marginBottom:'.5rem' }}>
              {loginType === 'phone' ? 'ENTER PHONE' : 'ENTER EMAIL'}
            </h2>
            <p style={{ textAlign:'center', color:'#A0A0B0', fontSize:'.85rem', marginBottom:'2rem' }}>
              We'll send you a 6-digit OTP to verify
            </p>

            {/* Toggle phone/email */}
            <div style={{ display:'flex', background:'#1A1A24', borderRadius:10, padding:4, marginBottom:'1.5rem' }}>
              {[{ id:'phone', label:'📱 Phone' },{ id:'email', label:'📧 Email' }].map(t => (
                <button key={t.id} onClick={() => setLoginType(t.id)}
                  style={{ flex:1, padding:'.6rem', border:'none', borderRadius:8, cursor:'pointer', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'.85rem', transition:'all .2s', background: loginType===t.id ? '#E8192C' : 'transparent', color: loginType===t.id ? '#fff' : '#A0A0B0' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {loginType === 'phone' ? (
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ fontSize:'.8rem', color:'#A0A0B0', marginBottom:'.4rem', display:'block', fontWeight:500 }}>Mobile Number</label>
                <div style={{ display:'flex', gap:'.5rem' }}>
                  <div style={{ padding:'.8rem', background:'#1A1A24', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#A0A0B0', fontSize:'.9rem', whiteSpace:'nowrap' }}>🇮🇳 +91</div>
                  <input
                    type="tel" maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                    onFocus={focusStyle} onBlur={blurStyle}
                    onKeyDown={e => e.key === 'Enter' && sendOTP()}
                    style={{ ...inputStyle, flex:1, letterSpacing:2 }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ fontSize:'.8rem', color:'#A0A0B0', marginBottom:'.4rem', display:'block', fontWeight:500 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={focusStyle} onBlur={blurStyle}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  style={inputStyle}
                />
              </div>
            )}

            <button onClick={sendOTP} disabled={loading}
              style={{ width:'100%', padding:'1rem', background: loading ? '#606070' : '#E8192C', color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.4rem', letterSpacing:2, cursor: loading ? 'wait' : 'pointer', borderRadius:8, transition:'all .2s' }}>
              {loading ? '⟳ SENDING OTP...' : 'SEND OTP →'}
            </button>

            <p style={{ textAlign:'center', fontSize:'.78rem', color:'#606070', marginTop:'1.25rem', lineHeight:1.6 }}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </>
        )}

        {/* ── STEP 2: OTP VERIFICATION ── */}
        {mode === 'otp' && (
          <>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2, textAlign:'center', marginBottom:'.5rem' }}>VERIFY OTP</h2>
            <p style={{ textAlign:'center', color:'#A0A0B0', fontSize:'.85rem', marginBottom:'.5rem' }}>
              OTP sent to {loginType === 'phone' ? `+91 ${phone}` : email}
            </p>
            <button onClick={() => { setMode('phone'); setOtp(['','','','','','']) }}
              style={{ display:'block', margin:'0 auto .5rem', background:'none', border:'none', color:'#E8192C', cursor:'pointer', fontSize:'.8rem', fontFamily:'Outfit,sans-serif' }}>
              ✏️ Change {loginType === 'phone' ? 'number' : 'email'}
            </button>

            {/* Demo OTP hint */}
            <div style={{ background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.2)', borderRadius:8, padding:'.6rem 1rem', marginBottom:'1.5rem', textAlign:'center' }}>
              <span style={{ fontSize:'.75rem', color:'#F5C842' }}>🎭 Demo Mode — Check the notification for OTP</span>
            </div>

            {/* 6 OTP boxes */}
            <div style={{ display:'flex', gap:'.5rem', justifyContent:'center', marginBottom:'1.5rem' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="tel" maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width:48, height:56, textAlign:'center',
                    background:'#1A1A24',
                    border: `2px solid ${digit ? '#E8192C' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius:10, color:'#F0F0F5',
                    fontSize:'1.5rem', fontWeight:700,
                    outline:'none', transition:'all .2s',
                    fontFamily:'Outfit,sans-serif'
                  }}
                  onFocus={e => e.target.style.borderColor = '#E8192C'}
                  onBlur={e => e.target.style.borderColor = digit ? '#E8192C' : 'rgba(255,255,255,0.1)'}
                />
              ))}
            </div>

            <button onClick={() => verifyOTP()} disabled={loading || otp.join('').length < 6}
              style={{ width:'100%', padding:'1rem', background: loading ? '#606070' : (otp.join('').length < 6 ? '#1A1A24' : '#E8192C'), color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.4rem', letterSpacing:2, cursor: loading ? 'wait' : 'pointer', borderRadius:8, transition:'all .2s', marginBottom:'1rem' }}>
              {loading ? '⟳ VERIFYING...' : 'VERIFY OTP ✓'}
            </button>

            {/* Resend */}
            <div style={{ textAlign:'center', fontSize:'.85rem', color:'#A0A0B0' }}>
              Didn't receive OTP?{' '}
              <span
                onClick={resendOTP}
                style={{ color: timer > 0 ? '#606070' : '#E8192C', cursor: timer > 0 ? 'default' : 'pointer', fontWeight:600 }}>
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </span>
            </div>
          </>
        )}

        {/* ── STEP 3: NAME (New Users Only) ── */}
        {mode === 'name' && (
          <>
            <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
              <div style={{ fontSize:'3rem', marginBottom:'.5rem' }}>🎉</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2rem', letterSpacing:2, marginBottom:'.5rem' }}>WELCOME!</h2>
              <p style={{ color:'#A0A0B0', fontSize:'.85rem' }}>OTP verified! Let's set up your account</p>
            </div>

            <div style={{ marginBottom:'1.25rem' }}>
              <label style={{ fontSize:'.8rem', color:'#A0A0B0', marginBottom:'.4rem', display:'block', fontWeight:500 }}>Your Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={focusStyle} onBlur={blurStyle}
                onKeyDown={e => e.key === 'Enter' && completeRegistration()}
                style={inputStyle}
                autoFocus
              />
            </div>

            <div style={{ background:'rgba(232,25,44,0.05)', border:'1px solid rgba(232,25,44,0.15)', borderRadius:8, padding:'.75rem', marginBottom:'1.25rem', fontSize:'.82rem', color:'#A0A0B0' }}>
              📱 Phone: <span style={{ color:'#F0F0F5', fontWeight:600 }}>
                {loginType === 'phone' ? `+91 ${phone}` : email}
              </span> ✅
            </div>

            <button onClick={completeRegistration} disabled={loading}
              style={{ width:'100%', padding:'1rem', background: loading ? '#606070' : '#E8192C', color:'#fff', border:'none', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.4rem', letterSpacing:2, cursor: loading ? 'wait' : 'pointer', borderRadius:8 }}>
              {loading ? '⟳ CREATING ACCOUNT...' : 'START BOOKING 🎬'}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
