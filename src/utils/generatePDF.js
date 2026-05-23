// ══════════════════════════════════════════════════
// PDF TICKET GENERATOR — Smart Cine Trichy
// Simple approach: creates HTML and downloads it
// User opens file → Ctrl+P → Save as PDF
// ══════════════════════════════════════════════════

export function generateTicketPDF(booking) {

  // Build snacks list
  const snackRows = booking.snackItems && booking.snackItems.length > 0
    ? booking.snackItems.map(s =>
        `<div class="snack-row">
          <span>${s.emoji || '🍿'} ${s.name} × ${s.qty}</span>
          <span>₹${s.price * s.qty}</span>
        </div>`
      ).join('')
    : `<div class="snack-row" style="color:#999;font-style:italic">
        <span>No snacks ordered</span><span></span>
       </div>`

  // Build QR svg
  const qr = makeQR(booking.bookingId || 'SCT000000')

  const totalPaid = booking.payable || booking.seatTotal || 0

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Smart Cine Ticket — ${booking.bookingId}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Outfit', 'Segoe UI', Arial, sans-serif;
    background: #f0f0f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
  }

  /* Top action bar */
  .action-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .action-bar p {
    font-size: 13px;
    color: #666;
    text-align: center;
    width: 100%;
    margin-bottom: 4px;
  }
  .btn-pdf {
    padding: 13px 28px;
    background: #E8192C;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 4px 20px rgba(232,25,44,0.35);
    transition: transform .1s;
  }
  .btn-pdf:hover { transform: translateY(-1px); }
  .btn-close {
    padding: 13px 22px;
    background: #222;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }

  /* Ticket container */
  .ticket {
    width: 100%;
    max-width: 460px;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 50px rgba(0,0,0,0.15);
  }

  /* Red header */
  .t-head {
    background: linear-gradient(135deg, #E8192C 0%, #B01020 100%);
    padding: 30px 28px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .t-head::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .t-head::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -40px;
    width: 150px; height: 150px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .logo-text {
    font-size: 30px;
    font-weight: 900;
    letter-spacing: 5px;
    color: #fff;
    position: relative;
  }
  .logo-text span { color: #FFE082; }
  .logo-sub {
    font-size: 9px;
    letter-spacing: 4px;
    color: rgba(255,255,255,0.55);
    margin-top: 5px;
    text-transform: uppercase;
    position: relative;
  }
  .official {
    display: inline-block;
    margin-top: 14px;
    padding: 5px 18px;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 30px;
    font-size: 9px;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.75);
    position: relative;
    text-transform: uppercase;
  }

  /* Body */
  .t-body { padding: 26px 28px; }

  /* Movie title */
  .movie-name {
    font-size: 30px;
    font-weight: 900;
    color: #E8192C;
    letter-spacing: 2px;
    text-transform: uppercase;
    line-height: 1.05;
    margin-bottom: 10px;
  }

  /* Badges */
  .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 22px; }
  .badge {
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .b-red  { background: #fff0f1; color: #E8192C; }
  .b-gold { background: #fffde7; color: #e65100; }
  .b-gray { background: #f5f5f5; color: #555; }

  /* Info rows */
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px dashed #eee;
    font-size: 13.5px;
  }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #aaa; font-weight: 600; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
  .info-val   { color: #111; font-weight: 700; text-align: right; }

  /* Dashed cut line */
  .cut-line {
    display: flex;
    align-items: center;
    margin: 20px -28px;
  }
  .cut-circle { width: 24px; height: 24px; background: #f0f0f5; border-radius: 50%; flex-shrink: 0; }
  .cut-dash   { flex: 1; border-top: 2px dashed #ddd; }
  .scissors   { color: #ccc; font-size: 18px; padding: 0 6px; }

  /* Section title */
  .sec-title {
    font-size: 10px;
    font-weight: 800;
    color: #bbb;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  /* Snacks */
  .snack-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 6px 0;
    border-bottom: 1px solid #f5f5f5;
    color: #444;
  }
  .snack-row:last-child { border-bottom: none; }

  /* Price box */
  .price-box {
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 14px 16px;
    margin: 16px 0;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    padding: 3px 0;
    color: #777;
  }
  .price-total {
    border-top: 2px solid #E8192C;
    margin-top: 10px;
    padding-top: 10px;
    font-size: 18px;
    font-weight: 900;
    color: #E8192C;
  }

  /* QR */
  .qr-section { text-align: center; padding: 20px 0 12px; }
  .qr-wrap {
    display: inline-block;
    padding: 14px;
    border: 3px solid #f0f0f0;
    border-radius: 16px;
    background: #fff;
  }
  .booking-id {
    font-size: 11px;
    color: #bbb;
    letter-spacing: 3px;
    margin-top: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* Footer */
  .t-foot {
    background: #111118;
    padding: 20px 28px;
    text-align: center;
  }
  .f-brand {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 8px;
  }
  .f-txt {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    line-height: 2;
  }

  /* Print styles */
  @media print {
    body { background: #fff; padding: 0; }
    .action-bar { display: none !important; }
    .ticket {
      box-shadow: none;
      border-radius: 0;
      max-width: 100%;
      width: 100%;
    }
  }
</style>
</head>
<body>

<!-- Action bar (hidden on print) -->
<div class="action-bar">
  <p>
    💡 Click <strong>🖨️ Print / Save as PDF</strong> →
    In the print window → <em>Destination</em> → choose <strong>"Save as PDF"</strong> → Click Save
  </p>
  <button class="btn-pdf" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">✕ Close</button>
</div>

<!-- TICKET -->
<div class="ticket">

  <!-- Header -->
  <div class="t-head">
    <div class="logo-text">SMART <span>CINE</span> TRICHY</div>
    <div class="logo-sub">Premium Cinema Experience · Trichy District</div>
    <div class="official">✦ Official E-Ticket ✦</div>
  </div>

  <!-- Body -->
  <div class="t-body">

    <!-- Movie name -->
    <div class="movie-name">${booking.movie || 'Movie'}</div>

    <!-- Badges -->
    <div class="badges">
      <span class="badge b-red">${booking.genre || 'Tamil Cinema'}</span>
      <span class="badge b-gold">${booking.language || 'Tamil'}</span>
      <span class="badge b-gray">${booking.certificate || 'UA'}</span>
      <span class="badge b-gray">★ ${booking.rating || '8.0'}</span>
    </div>

    <!-- Details -->
    <div class="info-row"><span class="info-label">Theatre</span><span class="info-val">${booking.theatre || ''}</span></div>
    <div class="info-row"><span class="info-label">Date</span><span class="info-val">${booking.date || ''}</span></div>
    <div class="info-row"><span class="info-label">Show Time</span><span class="info-val">${booking.time || ''}</span></div>
    <div class="info-row"><span class="info-label">Seats</span><span class="info-val">${booking.seats || ''}</span></div>
    <div class="info-row"><span class="info-label">Language</span><span class="info-val">${booking.language || 'Tamil'}</span></div>
    <div class="info-row"><span class="info-label">Format</span><span class="info-val">${booking.format || '2D'}</span></div>

    <!-- Cut line -->
    <div class="cut-line">
      <div class="cut-circle"></div>
      <div class="cut-dash"></div>
      <div class="scissors">✂</div>
      <div class="cut-dash"></div>
      <div class="cut-circle"></div>
    </div>

    <!-- Snacks -->
    <div class="sec-title">🍿 Snacks & Beverages</div>
    <div style="margin-bottom:16px">
      ${snackRows}
    </div>

    <!-- Price -->
    <div class="sec-title">💰 Price Breakdown</div>
    <div class="price-box">
      <div class="price-row"><span>Seat Amount</span><span>₹${booking.seatTotal || 0}</span></div>
      ${(booking.snackTotal || 0) > 0
        ? `<div class="price-row"><span>Snacks</span><span>₹${booking.snackTotal}</span></div>`
        : ''}
      <div class="price-row"><span>Convenience Fee</span><span>₹${booking.conv || 0}</span></div>
      <div class="price-row"><span>GST (18%)</span><span>₹${booking.gst || 0}</span></div>
      <div class="price-row price-total">
        <span>TOTAL PAID</span>
        <span>₹${totalPaid}</span>
      </div>
    </div>

    <!-- QR -->
    <div class="qr-section">
      <div class="sec-title">Scan at Theatre Entrance</div>
      <div class="qr-wrap">${qr}</div>
      <div class="booking-id">Booking ID : ${booking.bookingId || ''}</div>
    </div>

  </div>

  <!-- Footer -->
  <div class="t-foot">
    <div class="f-brand">SMART CINE TRICHY</div>
    <div class="f-txt">
      🎬 Show this QR at the theatre entrance<br>
      🍿 Collect snacks at the food counter<br>
      📍 Arrive 15 minutes before showtime<br>
      ☎ 0431-SMARTCINE
    </div>
  </div>

</div>

<script>
  // Auto open print dialog after page loads
  window.onload = function() {
    setTimeout(function() {
      window.print();
    }, 1000);
  };
<\/script>
</body>
</html>`

  // ── Method: Download as HTML file ──
  // This always works — no popup needed!
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `SmartCine-Ticket-${booking.bookingId || 'ticket'}.html`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Also try to open in new tab
  setTimeout(() => {
    const win = window.open(url, '_blank')
    if (!win) {
      // If popup blocked, just keep the download
      console.log('Popup blocked — file downloaded instead')
    }
  }, 300)

  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// ── Simple QR-style SVG generator ──────────────────
function makeQR(id) {
  const size  = 130
  const cells = 11
  const cs    = size / cells

  // Seed from booking ID
  let seed = 0
  for (let i = 0; i < id.length; i++) {
    seed = (seed * 31 + id.charCodeAt(i)) & 0xffffffff
  }

  const skip = (r, c) =>
    (r <= 3 && c <= 3) ||
    (r <= 3 && c >= cells - 4) ||
    (r >= cells - 4 && c <= 3)

  let dots = ''
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (skip(r, c)) continue
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      if (Math.abs(seed) % 2 === 0) {
        dots += `<rect
          x="${(c * cs + 1.5).toFixed(1)}"
          y="${(r * cs + 1.5).toFixed(1)}"
          width="${(cs - 2).toFixed(1)}"
          height="${(cs - 2).toFixed(1)}"
          fill="#E8192C" rx="2"/>`
      }
    }
  }

  // Corner squares
  const corner = (x, y) => {
    const s = cs * 3.2
    const inner = cs * 1.6
    const ox = x + (s - inner) / 2
    const oy = y + (s - inner) / 2
    return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="none" stroke="#E8192C" stroke-width="3" rx="4"/>
            <rect x="${ox}" y="${oy}" width="${inner}" height="${inner}" fill="#E8192C" rx="2"/>`
  }

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#fff"/>
    ${corner(3, 3)}
    ${corner(size - cs * 3.2 - 3, 3)}
    ${corner(3, size - cs * 3.2 - 3)}
    ${dots}
  </svg>`
}
