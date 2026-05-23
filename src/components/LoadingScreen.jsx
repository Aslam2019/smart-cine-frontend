export default function LoadingScreen() {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#0A0A0F', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'4rem', letterSpacing:'5px', animation:'pulseDot 1.5s ease-in-out infinite', color:'#F0F0F5' }}>
        SMART <span style={{ color:'#E8192C' }}>CINE</span>
      </div>
      <div style={{ width:200, height:2, background:'#1A1A24', borderRadius:1, marginTop:'2rem', overflow:'hidden' }}>
        <div className="loading-bar" style={{ height:'100%', background:'#E8192C', borderRadius:1 }} />
      </div>
      <div style={{ fontSize:'.8rem', color:'#606070', letterSpacing:'3px', textTransform:'uppercase', marginTop:'1rem' }}>
        Trichy's Premier Cinema Experience
      </div>
      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1}50%{opacity:.5} }
        @keyframes loadBar { from{width:0}to{width:100%} }
        .loading-bar { animation: loadBar 2s ease forwards; }
      `}</style>
    </div>
  )
}
