// ====== AUDIO ENGINE (Web Audio API) ======
let audioCtx = null;
let musicNodes = [];
let musicPlaying = false;
let musicInterval = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playNote(freq, startTime, duration, type='sine', vol=0.08, detune=0) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (detune) osc.detune.setValueAtTime(detune, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, startTime + duration * 0.9);
  osc.start(startTime);
  osc.stop(startTime + duration);
  musicNodes.push(osc);
}

function playDrum(startTime, kick=true) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  if (kick) {
    osc.frequency.setValueAtTime(120, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.15);
    gain.gain.setValueAtTime(0.35, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
    osc.start(startTime); osc.stop(startTime + 0.2);
  } else {
    // snare/bedug
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const g2 = audioCtx.createGain();
    g2.gain.setValueAtTime(0.18, startTime);
    g2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
    src.connect(g2); g2.connect(audioCtx.destination);
    src.start(startTime); src.stop(startTime + 0.1);
  }
}

// Takbiran / Lebaran melody - "Minal Aidin" feel
// Notes: C D E G A in pentatonic-ish
const NOTE = {
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00,
  A4:440.00, B4:493.88, C5:523.25, D5:587.33, E5:659.25,
  G5:783.99, A5:880.00
};

// Melody inspired by Lebaran takbir rhythm feel
const melody = [
  // bar 1 - "Allahu Akbar" motif feel
  [NOTE.G4, 0.0,  0.25], [NOTE.A4, 0.25, 0.25], [NOTE.C5, 0.5,  0.5 ],
  [NOTE.A4, 1.0,  0.25], [NOTE.G4, 1.25, 0.25], [NOTE.E4, 1.5,  0.5 ],
  // bar 2
  [NOTE.G4, 2.0,  0.25], [NOTE.A4, 2.25, 0.25], [NOTE.C5, 2.5,  0.25],
  [NOTE.D5, 2.75, 0.25], [NOTE.E5, 3.0,  0.5 ], [NOTE.C5, 3.5,  0.5 ],
  // bar 3
  [NOTE.A4, 4.0,  0.25], [NOTE.C5, 4.25, 0.25], [NOTE.D5, 4.5,  0.5 ],
  [NOTE.C5, 5.0,  0.25], [NOTE.A4, 5.25, 0.25], [NOTE.G4, 5.5,  0.5 ],
  // bar 4 - resolve
  [NOTE.E4, 6.0,  0.25], [NOTE.G4, 6.25, 0.25], [NOTE.A4, 6.5,  0.25],
  [NOTE.G4, 6.75, 0.25], [NOTE.G4, 7.0,  0.75], [NOTE.G4, 7.75, 0.25],
  // bar 5 - variation
  [NOTE.C5, 8.0,  0.5 ], [NOTE.E5, 8.5,  0.25], [NOTE.D5, 8.75, 0.25],
  [NOTE.C5, 9.0,  0.5 ], [NOTE.A4, 9.5,  0.5 ],
  // bar 6
  [NOTE.G4, 10.0, 0.25], [NOTE.A4, 10.25,0.25], [NOTE.C5, 10.5, 0.25],
  [NOTE.E5, 10.75,0.25], [NOTE.G5, 11.0, 0.5 ], [NOTE.E5, 11.5, 0.5 ],
  // bar 7
  [NOTE.D5, 12.0, 0.25], [NOTE.C5, 12.25,0.25], [NOTE.A4, 12.5, 0.5 ],
  [NOTE.G4, 13.0, 0.25], [NOTE.A4, 13.25,0.25], [NOTE.C5, 13.5, 0.5 ],
  // bar 8 - ending phrase
  [NOTE.E5, 14.0, 0.25], [NOTE.D5, 14.25,0.25], [NOTE.C5, 14.5, 0.25],
  [NOTE.A4, 14.75,0.25], [NOTE.G4, 15.0, 0.75],[NOTE.G4, 15.75,0.25],
];

// Bass / harmony line
const bass = [
  [NOTE.C4, 0.0,  0.5], [NOTE.C4, 0.5,  0.5], [NOTE.C4, 1.0, 0.5], [NOTE.C4, 1.5, 0.5],
  [NOTE.G4, 2.0,  0.5], [NOTE.G4, 2.5,  0.5], [NOTE.G4, 3.0, 0.5], [NOTE.G4, 3.5, 0.5],
  [NOTE.A4, 4.0,  0.5], [NOTE.A4, 4.5,  0.5], [NOTE.F4, 5.0, 0.5], [NOTE.F4, 5.5, 0.5],
  [NOTE.G4, 6.0,  0.5], [NOTE.G4, 6.5,  0.5], [NOTE.G4, 7.0, 0.5], [NOTE.G4, 7.5, 0.5],
  [NOTE.C4, 8.0,  0.5], [NOTE.C4, 8.5,  0.5], [NOTE.C4, 9.0, 0.5], [NOTE.C4, 9.5, 0.5],
  [NOTE.F4, 10.0, 0.5], [NOTE.F4, 10.5, 0.5], [NOTE.G4,11.0, 0.5], [NOTE.G4,11.5, 0.5],
  [NOTE.A4, 12.0, 0.5], [NOTE.A4, 12.5, 0.5], [NOTE.F4,13.0, 0.5], [NOTE.F4,13.5, 0.5],
  [NOTE.G4, 14.0, 0.5], [NOTE.G4, 14.5, 0.5], [NOTE.C4,15.0, 0.5], [NOTE.C4,15.5, 0.5],
];

const LOOP_DUR = 16; // seconds per loop

function scheduleMusic(startTime) {
  const now = audioCtx.currentTime;
  const t = startTime;

  // Melody (sine + slight square harmony)
  for (const [freq, when, dur] of melody) {
    playNote(freq, t + when, dur, 'sine', 0.09);
    playNote(freq, t + when, dur, 'triangle', 0.04, 5); // harmony detune
  }

  // Bass (triangle, lower octave)
  for (const [freq, when, dur] of bass) {
    playNote(freq / 2, t + when, dur, 'triangle', 0.06);
  }

  // Bedug rhythm: kick on 0, 2, 4, 6... snare on 1, 3, 5...
  for (let beat = 0; beat < 32; beat++) {
    const bt = t + beat * 0.5;
    if (beat % 4 === 0) playDrum(bt, true);
    if (beat % 4 === 2) playDrum(bt, false);
  }
}

let loopStart = 0;
let loopScheduled = false;

function startMusic() {
  if (!audioCtx) initAudio();
  if (musicPlaying) return;
  musicPlaying = true;
  loopStart = audioCtx.currentTime + 0.05;
  scheduleMusic(loopStart);

  // Schedule next loop ~0.5s before end
  musicInterval = setInterval(() => {
    if (!musicPlaying) return;
    const now = audioCtx.currentTime;
    const elapsed = now - loopStart;
    if (elapsed >= LOOP_DUR - 0.6) {
      loopStart += LOOP_DUR;
      scheduleMusic(loopStart);
    }
  }, 200);
}

function stopMusic() {
  musicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
  musicNodes = [];
}

// Jump SFX
function sfxJump() {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.type = 'sine';
  const now = audioCtx.currentTime;
  o.frequency.setValueAtTime(300, now);
  o.frequency.exponentialRampToValueAtTime(600, now + 0.12);
  g.gain.setValueAtTime(0.12, now);
  g.gain.linearRampToValueAtTime(0, now + 0.15);
  o.start(now); o.stop(now + 0.15);
}

// Collect SFX
function sfxCollect() {
  if (!audioCtx) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    const t = audioCtx.currentTime + i * 0.07;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.1, t);
    g.gain.linearRampToValueAtTime(0, t + 0.1);
    o.start(t); o.stop(t + 0.1);
  });
}

// Game Over SFX
function sfxGameOver() {
  if (!audioCtx) return;
  const notes = [400, 300, 200, 150];
  notes.forEach((f, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sawtooth';
    const t = audioCtx.currentTime + i * 0.12;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.12, t);
    g.gain.linearRampToValueAtTime(0, t + 0.15);
    o.start(t); o.stop(t + 0.15);
  });
}

// ====== FIREWORKS ======
const fwCanvas = document.getElementById('fwCanvas');
const fwCtx = fwCanvas.getContext('2d');
fwCanvas.width = window.innerWidth;
fwCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
});

let fireworks = [];
let fwActive = false;

function launchFirework() {
  if (!fwActive) return;
  const x = Math.random() * fwCanvas.width;
  const y = Math.random() * fwCanvas.height * 0.6;
  const colors = ['#FFD700','#FF6B35','#FF3E9A','#00E5FF','#76FF03','#FF1744'];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const count = 40 + Math.floor(Math.random()*30);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI*2/count)*i;
    const speed = 2 + Math.random()*4;
    fireworks.push({
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      color,
      life: 1,
      decay: 0.015 + Math.random()*0.015
    });
  }
  setTimeout(() => { if(fwActive) launchFirework(); }, 600 + Math.random()*800);
}

function drawFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  fireworks = fireworks.filter(p => p.life > 0);
  for (const p of fireworks) {
    fwCtx.globalAlpha = p.life;
    fwCtx.fillStyle = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, 2.5, 0, Math.PI*2);
    fwCtx.fill();
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.08;
    p.vx *= 0.97; p.vy *= 0.97;
    p.life -= p.decay;
  }
  fwCtx.globalAlpha = 1;
  requestAnimationFrame(drawFireworks);
}
drawFireworks();

// ====== GAME ======
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const GROUND = H - 40;
const PLAYER_W = 32, PLAYER_H = 48;

let gameState = 'idle'; // idle, playing, dead
let selectedChar = 'koko'; // koko | perempuan | gadis | anak | kakek
let score, thr, dist, speed, frame, obstacles, collectibles, bgX, bgX2, moonPulse;
let highScore = parseInt(localStorage.getItem('lebaranHighScore') || '0');
let player, keys = {};

// ====== STARS ======
const stars = Array.from({length:60}, () => ({
  x: Math.random()*W, y: Math.random()*(GROUND-40),
  r: 0.5+Math.random()*1.5, t: Math.random()*Math.PI*2
}));

function initGame() {
  score = 0; thr = 0; dist = 0; speed = 3.5; frame = 0;
  obstacles = []; collectibles = [];
  bgX = 0; bgX2 = W; moonPulse = 0;
  boostActive = false; boostFramesLeft = 0;
  document.getElementById('highScoreDisplay').textContent = highScore;
  player = {
    x: 80, y: GROUND - PLAYER_H,
    vy: 0, grounded: true,
    ducking: false,
    jumpCount: 0,
    invincible: 0,
    color: '#FFD700'
  };
}

// ====== DRAW HELPERS ======
function drawStar(x, y, r, t) {
  ctx.fillStyle = `rgba(255,255,220,${0.5+0.5*Math.sin(t)})`;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fill();
}

function drawMoon(t) {
  const grd = ctx.createRadialGradient(W-70, 38, 5, W-70, 38, 32);
  grd.addColorStop(0, '#FFFDE7');
  grd.addColorStop(0.6, '#FFE57A');
  grd.addColorStop(1, 'rgba(255,200,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(W-70, 38, 26 + Math.sin(t)*2, 0, Math.PI*2);
  ctx.fill();
  // crescent mask
  ctx.fillStyle = '#1a0533';
  ctx.beginPath();
  ctx.arc(W-56, 34, 20, 0, Math.PI*2);
  ctx.fill();
}

function drawGround() {
  // grass
  ctx.fillStyle = '#2D7A3A';
  ctx.fillRect(0, GROUND, W, H-GROUND);
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, GROUND, W, 6);
  // road
  ctx.fillStyle = '#1B5E20';
  ctx.fillRect(0, GROUND+6, W, H-GROUND-6);
}

function drawBg(t) {
  // sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
  sky.addColorStop(0, '#0d0124');
  sky.addColorStop(1, '#2d0a5a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, GROUND);

  // stars
  for (const s of stars) {
    s.t += 0.02;
    drawStar(s.x, s.y, s.r, s.t);
  }

  drawMoon(t);

  // mosque silhouette scrolling
  drawMosque(bgX, GROUND);
  drawMosque(bgX + 420, GROUND);
  drawMosque(bgX2, GROUND);
  drawMosque(bgX2 + 420, GROUND);
}

function drawMosque(x, ground) {
  const g = ground - 1;
  ctx.fillStyle = 'rgba(40,10,80,0.85)';
  // main dome
  ctx.beginPath();
  ctx.arc(x+60, g-60, 38, Math.PI, 0);
  ctx.lineTo(x+98, g);
  ctx.lineTo(x+22, g);
  ctx.fill();
  // minaret left
  ctx.fillRect(x, g-90, 16, 90);
  ctx.beginPath();
  ctx.moveTo(x+8, g-110);
  ctx.lineTo(x+18, g-90);
  ctx.lineTo(x-2, g-90);
  ctx.fill();
  // minaret right
  ctx.fillRect(x+104, g-90, 16, 90);
  ctx.beginPath();
  ctx.moveTo(x+112, g-110);
  ctx.lineTo(x+122, g-90);
  ctx.lineTo(x+102, g-90);
  ctx.fill();
  // crescent on dome
  ctx.fillStyle = 'rgba(255,200,0,0.7)';
  ctx.beginPath();
  ctx.arc(x+60, g-98, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'rgba(40,10,80,0.9)';
  ctx.beginPath();
  ctx.arc(x+63, g-100, 5.5, 0, Math.PI*2);
  ctx.fill();
}

// ===== CHARACTER DRAWING =====
function drawCharBase(x, y, ph, skinColor, bodyColor, accentColor) {
  // body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(x+4, y+18, PLAYER_W-8, ph-18, 6);
  ctx.fill();
  // head
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(x+PLAYER_W/2, y+12, 13, 0, Math.PI*2);
  ctx.fill();
  // eyes
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2-4, y+12, 2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2+4, y+12, 2, 0, Math.PI*2); ctx.fill();
  // smile
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x+PLAYER_W/2, y+15, 4, 0.2, Math.PI-0.2);
  ctx.stroke();
}

function drawKoko(x, y, ph, ducking) {
  // baju koko putih
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.roundRect(x+6, y+20, PLAYER_W-12, ph-30, 5); ctx.fill();
  ctx.fillStyle = '#FFD700';
  for (let i=0;i<3;i++) ctx.fillRect(x+PLAYER_W/2-1, y+24+i*8, 2, 3);
  drawCharBase(x, y, ph, '#FDBCB4', '#FFD700', '#FFD700');
  // peci
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(x+PLAYER_W/2, y+3, 12, 5, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x+PLAYER_W/2-12, y+2, 24, 4);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x+PLAYER_W/2-12, y+1, 24, 2);
  // legs
  ctx.fillStyle = ducking ? '#FFD700' : '#2D7A3A';
  if (!ducking) { ctx.fillRect(x+6, y+ph-12, 8, 14); ctx.fillRect(x+PLAYER_W-14, y+ph-12, 8, 14); }
}

function drawPerempuan(x, y, ph, ducking) {
  // mukena putih
  ctx.fillStyle = '#F8F8FF';
  ctx.beginPath(); ctx.roundRect(x+2, y+16, PLAYER_W-4, ph-16, 8); ctx.fill();
  // detail bordir
  ctx.strokeStyle = '#E8D5FF'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(x+4, y+18, PLAYER_W-8, 14, 4); ctx.stroke();
  drawCharBase(x, y, ph, '#FDBCB4', '#F8F8FF', '#9C27B0');
  // hijab/kerudung
  ctx.fillStyle = '#9C27B0';
  ctx.beginPath();
  ctx.arc(x+PLAYER_W/2, y+10, 14, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x+2, y+10, PLAYER_W-4, 16, 4); ctx.fill();
  // hiasan kerudung
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+10, 3, 0, Math.PI*2); ctx.fill();
  // mata
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2-4, y+14, 2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2+4, y+14, 2, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+17, 3, 0.2, Math.PI-0.2); ctx.stroke();
  // legs (tertutup mukena)
  ctx.fillStyle = '#F8F8FF';
  if (!ducking) { ctx.fillRect(x+6, y+ph-10, 8, 12); ctx.fillRect(x+PLAYER_W-14, y+ph-10, 8, 12); }
}

function drawAnak(x, y, ph, ducking) {
  const scale = 0.8;
  // baju warna-warni
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath(); ctx.roundRect(x+5, y+20, PLAYER_W-10, ph-22, 5); ctx.fill();
  // strip baju
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x+5, y+24, PLAYER_W-10, 3);
  drawCharBase(x, y+4, ph*scale, '#FDBCB4', '#FF6B35', '#FF6B35');
  // kepala lebih besar (anak-anak)
  ctx.fillStyle = '#FDBCB4';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+14, 14, 0, Math.PI*2); ctx.fill();
  // rambut
  ctx.fillStyle = '#3E2723';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+8, 12, Math.PI, 0); ctx.fill();
  ctx.fillRect(x+PLAYER_W/2-12, y+7, 24, 5);
  // mata besar
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2-5, y+14, 3.5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2+5, y+14, 3.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2-5, y+14, 2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2+5, y+14, 2, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+18, 4, 0.2, Math.PI-0.2); ctx.stroke();
  // celana pendek
  ctx.fillStyle = '#1565C0';
  if (!ducking) { ctx.fillRect(x+5, y+ph-14, 9, 15); ctx.fillRect(x+PLAYER_W-14, y+ph-14, 9, 15); }
}


function drawGadis(x, y, ph, ducking) {
  // baju gamis modern - pink/tosca
  ctx.fillStyle = '#E91E8C';
  ctx.beginPath(); ctx.roundRect(x+3, y+17, PLAYER_W-6, ph-17, 7); ctx.fill();
  // detail kerah
  ctx.fillStyle = '#FF80C0';
  ctx.beginPath(); ctx.roundRect(x+8, y+19, PLAYER_W-16, 10, 4); ctx.fill();
  // motif bunga kecil
  ctx.fillStyle = '#FF80C0';
  for (let i=0;i<3;i++) {
    ctx.beginPath(); ctx.arc(x+9, y+30+i*9, 2.5, 0, Math.PI*2); ctx.fill();
  }
  // head
  ctx.fillStyle = '#FDBCB4';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+12, 12, 0, Math.PI*2); ctx.fill();
  // hijab modern - tosca
  ctx.fillStyle = '#00BCD4';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+9, 13, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x+3, y+9, PLAYER_W-6, 14, [0,0,8,8]); ctx.fill();
  // rambut depan sedikit
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(x+PLAYER_W/2-6, y+8, 12, 3);
  // hijab bagian bawah / drapery
  ctx.fillStyle = '#00ACC1';
  ctx.beginPath(); ctx.moveTo(x+3, y+22); ctx.lineTo(x-4, y+35); ctx.lineTo(x+6, y+30); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W-3, y+22); ctx.lineTo(x+PLAYER_W+4, y+35); ctx.lineTo(x+PLAYER_W-6, y+30); ctx.closePath(); ctx.fill();
  // pin hijab
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+22, 2.5, 0, Math.PI*2); ctx.fill();
  // mata
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2-4, y+13, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2+4, y+13, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#5D4037';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2-4, y+13, 1.8, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2+4, y+13, 1.8, 0, Math.PI*2); ctx.fill();
  // bulu mata
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W/2-6, y+11); ctx.lineTo(x+PLAYER_W/2-4, y+10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W/2+6, y+11); ctx.lineTo(x+PLAYER_W/2+4, y+10); ctx.stroke();
  // senyum
  ctx.strokeStyle = '#E91E8C'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+16, 4, 0.2, Math.PI-0.2); ctx.stroke();
  // kaki (tertutup gamis)
  ctx.fillStyle = '#E91E8C';
  if (!ducking) { ctx.fillRect(x+6, y+ph-10, 8, 12); ctx.fillRect(x+PLAYER_W-14, y+ph-10, 8, 12); }
  // sepatu
  ctx.fillStyle = '#00BCD4';
  if (!ducking) { ctx.fillRect(x+5, y+ph+2, 10, 5); ctx.fillRect(x+PLAYER_W-15, y+ph+2, 10, 5); }
}

function drawKakek(x, y, ph, ducking) {
  // baju batik
  ctx.fillStyle = '#795548';
  ctx.beginPath(); ctx.roundRect(x+4, y+18, PLAYER_W-8, ph-18, 6); ctx.fill();
  // motif batik sederhana
  ctx.fillStyle = '#FFD700';
  for (let i=0;i<3;i++) for (let j=0;j<2;j++) {
    ctx.beginPath(); ctx.arc(x+9+j*12, y+22+i*9, 2, 0, Math.PI*2); ctx.fill();
  }
  drawCharBase(x, y, ph, '#D4A574', '#795548', '#795548');
  // rambut putih
  ctx.fillStyle = '#EEEEEE';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+6, 11, Math.PI, 0); ctx.fill();
  ctx.fillRect(x+PLAYER_W/2-11, y+5, 22, 5);
  // jenggot
  ctx.fillStyle = '#EEEEEE';
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+20, 7, 0, Math.PI); ctx.fill();
  // mata sipit (tua)
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W/2-7, y+11); ctx.lineTo(x+PLAYER_W/2-3, y+11); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W/2+3, y+11); ctx.lineTo(x+PLAYER_W/2+7, y+11); ctx.stroke();
  // senyum
  ctx.beginPath(); ctx.arc(x+PLAYER_W/2, y+16, 4, 0.3, Math.PI-0.3); ctx.stroke();
  // tongkat
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W+2, y+20); ctx.lineTo(x+PLAYER_W+2, y+ph+2); ctx.stroke();
  ctx.strokeStyle = '#795548'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x+PLAYER_W-2, y+20); ctx.lineTo(x+PLAYER_W+6, y+20); ctx.stroke();
  // sarung/celana
  ctx.fillStyle = '#4E342E';
  if (!ducking) { ctx.fillRect(x+6, y+ph-12, 8, 14); ctx.fillRect(x+PLAYER_W-14, y+ph-12, 8, 14); }
}

function drawPlayer(p) {
  const x = p.x, y = p.ducking ? p.y + PLAYER_H*0.4 : p.y;
  const ph = p.ducking ? PLAYER_H*0.6 : PLAYER_H;
  const blink = p.invincible > 0 && Math.floor(frame/4)%2===0;
  if (blink) return;
  ctx.save();
  if      (selectedChar === 'koko')      drawKoko(x, y, ph, p.ducking);
  else if (selectedChar === 'perempuan') drawPerempuan(x, y, ph, p.ducking);
  else if (selectedChar === 'gadis')     drawGadis(x, y, ph, p.ducking);
  else if (selectedChar === 'anak')      drawAnak(x, y, ph, p.ducking);
  else if (selectedChar === 'kakek')     drawKakek(x, y, ph, p.ducking);
  ctx.restore();
}

function drawRock(x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(w/2, h+4, w*0.5, 5, 0, 0, Math.PI*2);
  ctx.fill();
  // main rock body
  const grd = ctx.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, '#9E9E9E');
  grd.addColorStop(0.4, '#757575');
  grd.addColorStop(1, '#424242');
  ctx.fillStyle = grd;
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w*0.15, h);
  ctx.lineTo(0, h*0.6);
  ctx.lineTo(w*0.05, h*0.3);
  ctx.lineTo(w*0.25, 0);
  ctx.lineTo(w*0.55, h*0.05);
  ctx.lineTo(w*0.8, 0);
  ctx.lineTo(w, h*0.25);
  ctx.lineTo(w*0.95, h*0.65);
  ctx.lineTo(w*0.85, h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.moveTo(w*0.25, h*0.05);
  ctx.lineTo(w*0.5, h*0.08);
  ctx.lineTo(w*0.35, h*0.35);
  ctx.lineTo(w*0.15, h*0.25);
  ctx.closePath();
  ctx.fill();
  // crack
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w*0.5, h*0.1);
  ctx.lineTo(w*0.6, h*0.4);
  ctx.lineTo(w*0.55, h*0.6);
  ctx.stroke();
  ctx.restore();
}

function drawBedug(x, y) {
  ctx.save();
  ctx.translate(x, y);
  // drum body
  const grd = ctx.createLinearGradient(-20, 0, 20, 0);
  grd.addColorStop(0, '#5D4037');
  grd.addColorStop(0.5, '#8D6E63');
  grd.addColorStop(1, '#5D4037');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 32, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = '#3E2723'; ctx.lineWidth = 2;
  ctx.stroke();
  // drum head
  ctx.fillStyle = '#D7CCC8';
  ctx.beginPath();
  ctx.ellipse(0, -30, 20, 8, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2;
  ctx.stroke();
  // ropes
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5;
  for (let i=-3; i<=3; i++) {
    ctx.beginPath();
    ctx.moveTo(i*6, -30);
    ctx.lineTo(i*6, 30);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTHR(x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t)*0.15);
  // envelope
  ctx.fillStyle = '#E53935';
  ctx.strokeStyle = '#B71C1C';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-16, -10, 32, 22, 4);
  ctx.fill(); ctx.stroke();
  // flap
  ctx.fillStyle = '#EF5350';
  ctx.beginPath();
  ctx.moveTo(-16, -10);
  ctx.lineTo(0, 4);
  ctx.lineTo(16, -10);
  ctx.closePath();
  ctx.fill();
  // gold pattern
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(-13, -7, 26, 16, 2); ctx.stroke();
  // THR text
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 7px Nunito';
  ctx.textAlign = 'center';
  ctx.fillText('THR', 0, 7);
  // glow
  ctx.restore();
}

function drawFireworkItem(x, y, t) {
  // kembang api collectible
  ctx.save();
  ctx.translate(x, y);
  const rays = 8;
  for (let i=0;i<rays;i++) {
    const a = (Math.PI*2/rays)*i + t;
    ctx.strokeStyle = `hsl(${(i*45+t*30)%360},100%,65%)`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(a)*12, Math.sin(a)*12);
    ctx.stroke();
  }
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0,0,4,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}


function drawBird(x, y, wingPhase) {
  ctx.save();
  ctx.translate(x, y);
  const flap = Math.sin(wingPhase) * 10;
  // body
  ctx.fillStyle = '#5C4033';
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 7, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // tail
  ctx.fillStyle = '#4E342E';
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-20, -4);
  ctx.lineTo(-20, 5);
  ctx.closePath();
  ctx.fill();
  // left wing
  ctx.fillStyle = '#6D4C41';
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.quadraticCurveTo(-14, -10 + flap * 0.5, -18, -4 + flap * 0.5);
  ctx.quadraticCurveTo(-10, 2, -4, 2);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // right wing
  ctx.fillStyle = '#8D6E63';
  ctx.beginPath();
  ctx.moveTo(2, -2);
  ctx.quadraticCurveTo(14, -14 + flap, 20, -6 + flap);
  ctx.quadraticCurveTo(12, 4, 2, 3);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // head
  ctx.fillStyle = '#5C4033';
  ctx.strokeStyle = '#3E2723';
  ctx.beginPath();
  ctx.arc(13, -4, 6, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // eye
  ctx.fillStyle = '#FFF';
  ctx.beginPath(); ctx.arc(15, -5, 2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(15.5, -5, 1, 0, Math.PI*2); ctx.fill();
  // beak
  ctx.fillStyle = '#FFA000';
  ctx.beginPath();
  ctx.moveTo(18, -4);
  ctx.lineTo(25, -3);
  ctx.lineTo(18, -1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function spawnObstacle(f) {
  const t = Math.random();
  const phase = Math.min(1, f / 1200); // 0 = awal, 1 = susah banget

  // Early: rock only. Mid: bedug + single bird. Late: doubles, double bird
  if (phase < 0.2) {
    // awal banget: hanya batu kecil
    obstacles.push({type:'rock', x:W+30, y:GROUND-22, w:28, h:22});
  } else if (phase < 0.45) {
    // awal: batu + bedug
    if (t < 0.6) obstacles.push({type:'rock', x:W+30, y:GROUND-22, w:28, h:22});
    else         obstacles.push({type:'bedug', x:W+30, y:GROUND-64, w:40, h:64, platform:true});
  } else if (phase < 0.65) {
    // tengah: tambah burung tunggal
    if (t < 0.35) obstacles.push({type:'rock', x:W+30, y:GROUND-22, w:28, h:22});
    else if (t < 0.60) obstacles.push({type:'bedug', x:W+30, y:GROUND-64, w:40, h:64, platform:true});
    else {
      const birdY = GROUND - 80 - Math.random()*35;
      obstacles.push({type:'bird', x:W+40, y:birdY, w:44, h:22, wingPhase:0, wSpeed:0.18+Math.random()*0.1});
    }
  } else if (phase < 0.85) {
    // susah: kombinasi mulai muncul
    if (t < 0.25) obstacles.push({type:'rock', x:W+30, y:GROUND-22, w:28, h:22});
    else if (t < 0.45) obstacles.push({type:'bedug', x:W+30, y:GROUND-64, w:40, h:64, platform:true});
    else if (t < 0.70) {
      const birdY = GROUND - 80 - Math.random()*40;
      obstacles.push({type:'bird', x:W+40, y:birdY, w:44, h:22, wingPhase:0, wSpeed:0.2+Math.random()*0.1});
    } else {
      // batu + burung
      obstacles.push({type:'rock', x:W+30, y:GROUND-22, w:28, h:22});
      const birdY = GROUND - 90 - Math.random()*30;
      obstacles.push({type:'bird', x:W+90, y:birdY, w:44, h:22, wingPhase:1, wSpeed:0.22});
    }
  } else {
    // sangat susah: double burung, burung+batu, double batu
    if (t < 0.30) {
      // double burung ketinggian beda
      obstacles.push({type:'bird', x:W+40,  y:GROUND-80,  w:44, h:22, wingPhase:0,   wSpeed:0.22});
      obstacles.push({type:'bird', x:W+200, y:GROUND-115, w:44, h:22, wingPhase:1.5, wSpeed:0.25});
    } else if (t < 0.55) {
      // batu + burung atas
      obstacles.push({type:'rock', x:W+30, y:GROUND-22, w:28, h:22});
      obstacles.push({type:'bird', x:W+100, y:GROUND-100, w:44, h:22, wingPhase:0, wSpeed:0.24});
    } else if (t < 0.75) {
      // bedug + burung
      obstacles.push({type:'bedug', x:W+30, y:GROUND-64, w:40, h:64, platform:true});
      obstacles.push({type:'bird', x:W+120, y:GROUND-110, w:44, h:22, wingPhase:0.5, wSpeed:0.22});
    } else {
      // triple: 2 batu + burung
      obstacles.push({type:'rock', x:W+20,  y:GROUND-22, w:28, h:22});
      obstacles.push({type:'rock', x:W+80,  y:GROUND-22, w:28, h:22});
      const birdY = GROUND - 95 - Math.random()*25;
      obstacles.push({type:'bird', x:W+220, y:birdY, w:44, h:22, wingPhase:0, wSpeed:0.26});
    }
  }
}

function spawnCollectible() {
  const type = Math.random() < 0.7 ? 'thr' : 'kembang';
  const row = Math.floor(Math.random()*3);
  const ys = [GROUND-30, GROUND-65, GROUND-100];
  collectibles.push({type, x:W+20, y:ys[row], t:Math.random()*Math.PI*2, val: type==='thr' ? 50 : 20});
}

function rectOverlap(ax,ay,aw,ah, bx,by,bw,bh) {
  return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
}

let lastObstacle = 0, lastCollectible = 0;
let nextObstacleGap = 90, nextCollectibleGap = 60;

function gameLoop() {
  if (gameState !== 'playing') return;
  frame++;

  // speed boost timer
  if (boostActive) {
    boostFramesLeft--;
    if (boostFramesLeft <= 0) {
      speed = Math.max(speed - BOOST_AMOUNT, 3.5);
      boostActive = false;
    }
  }

  // speed increase: gradual
  if (frame % 400 === 0 && frame < 800) speed += 0.2;
  else if (frame % 250 === 0 && frame >= 800) speed += 0.35;
  dist = Math.floor(frame * speed / 10);

  // scroll bg
  bgX -= speed * 0.3;
  bgX2 -= speed * 0.3;
  if (bgX < -420) bgX = bgX2 + 420;
  if (bgX2 < -420) bgX2 = bgX + 420;

  // spawn
  lastObstacle++;
  lastCollectible++;
  if (lastObstacle >= nextObstacleGap) {
    spawnObstacle(frame);
    lastObstacle = 0;
    // early game: long gaps, late game: short gaps
    const baseGap = Math.max(45, 120 - Math.floor(frame / 80));
    const rand = Math.floor(Math.random() * Math.max(20, 60 - frame/60));
    nextObstacleGap = baseGap + rand;
  }
  if (lastCollectible >= nextCollectibleGap) {
    spawnCollectible();
    lastCollectible = 0;
    nextCollectibleGap = 40 + Math.floor(Math.random()*40);
  }

  // move obstacles
  obstacles.forEach(o => { o.x -= speed; if (o.type==='bird') o.wingPhase += o.wSpeed; });
  obstacles = obstacles.filter(o => o.x > -80);
  collectibles.forEach(c => { c.x -= speed; c.t += 0.08; });
  collectibles = collectibles.filter(c => c.x > -40);

  // player physics
  if (!player.grounded) {
    player.vy += 0.62;
    player.y += player.vy;
  }
  const py = player.ducking ? GROUND - PLAYER_H*0.6 : GROUND - PLAYER_H;
  if (player.y >= py) {
    player.y = py;
    player.vy = 0;
    player.grounded = true;
    player.jumpCount = 0;
  }
  if (player.invincible > 0) player.invincible--;

  // collision - obstacles
  const pw = PLAYER_W-10, ph = player.ducking ? PLAYER_H*0.6 : PLAYER_H;
  const px2 = player.x + 5, py2 = player.y;
  let onPlatform = false;

  for (const o of obstacles) {
    if (player.invincible > 0) break;

    if (o.type === 'bedug' || o.type === 'rock') {
      const topY = o.y;
      const playerBottom = py2 + ph;
      const prevBottom = playerBottom - player.vy;
      const playerMidX = px2 + pw / 2;
      const withinX = playerMidX > o.x && playerMidX < o.x + o.w;
      const landingOnTop = player.vy >= 0 && prevBottom <= topY + 6 && playerBottom >= topY;

      if (withinX && landingOnTop) {
        // lompat dari atas - mendarat di atas objek
        player.y = topY - ph;
        player.vy = 0;
        player.grounded = true;
        player.jumpCount = 0;
        onPlatform = true;
      } else if (rectOverlap(px2, py2, pw, ph, o.x + 4, topY + 6, o.w - 8, o.h)) {
        // nyangkut dari samping = game over
        endGame(); return;
      }
    } else if (o.type === 'bird') {
      if (rectOverlap(px2, py2, pw, ph, o.x - 10, o.y - 10, 44, 22)) {
        endGame(); return;
      }
    }
  }

  // Keep player on platform if standing on bedug
  if (!onPlatform && player.grounded) {
    // check if player is floating above a platform that has moved away
    let stillSupported = player.y + ph >= GROUND - 1;
    if (!stillSupported) {
      // check bedug platforms
      for (const o of obstacles) {
        if (o.type === 'bedug') {
          const playerMidX = px2 + pw/2;
          if (playerMidX > o.x && playerMidX < o.x + o.w && Math.abs((player.y + ph) - o.y) < 4) {
            stillSupported = true; break;
          }
        }
      }
      if (!stillSupported) { player.grounded = false; }
    }
  }

  // collision - collectibles
  for (let i = collectibles.length-1; i>=0; i--) {
    const c = collectibles[i];
    if (rectOverlap(px2,py2,pw,ph, c.x-15,c.y-15,30,30)) {
      if (c.type === 'thr') { thr += c.val; score += c.val; }
      else if (c.type === 'kembang') { activateSpeedBoost(); score += 10; showSpeedBoost(c.x, c.y); }
      collectibles.splice(i,1);
      showPickup(c.x, c.y, c.type);
      sfxCollect();
    }
  }

  score += 1;
  document.getElementById('thrDisplay').textContent = thr;
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('distDisplay').textContent = dist + 'm';
  if (score > highScore) { highScore = score; localStorage.setItem('lebaranHighScore', highScore); document.getElementById('highScoreDisplay').textContent = highScore; }
  if (boostActive) {
    const pct = Math.round((boostFramesLeft / BOOST_FRAMES) * 100);
    document.getElementById('speedDisplay').textContent = '🔥 ' + speed.toFixed(1) + ' (' + pct + '%)';
    document.getElementById('speedDisplay').style.color = '#FF6B35';
  } else {
    document.getElementById('speedDisplay').textContent = 'x' + speed.toFixed(1);
    document.getElementById('speedDisplay').style.color = '';
  }

  // ====== DRAW ======
  ctx.clearRect(0,0,W,H);
  drawBg(frame*0.02);
  drawGround();
  drawSpeedFlash();

  // draw collectibles
  for (const c of collectibles) {
    if (c.type === 'thr') drawTHR(c.x, c.y, c.t);
    else drawFireworkItem(c.x, c.y, c.t);
  }

  // draw obstacles
  for (const o of obstacles) {
    if (o.type === 'rock') drawRock(o.x, o.y, o.w, o.h);
    else if (o.type === 'bedug') drawBedug(o.x+20, o.y+32);
    else if (o.type === 'bird') drawBird(o.x, o.y, o.wingPhase);
  }

  // pickup text
  drawPickups();

  drawPlayer(player);

  requestAnimationFrame(gameLoop);
}

// Speed boost flash
let speedFlash = 0;
let boostActive = false;
let boostFramesLeft = 0;
const BOOST_FRAMES = 300; // ~5 detik di 60fps
const BOOST_AMOUNT = 1.5;

function activateSpeedBoost() {
  if (!boostActive) {
    speed += BOOST_AMOUNT;
    boostActive = true;
  }
  boostFramesLeft = BOOST_FRAMES; // reset timer kalau ambil lagi
  speedFlash = 30;
}
function showSpeedBoost(x, y) {
  speedFlash = 30;
  pickups.push({x, y, t:40, text:'🎆 SPEED UP!', color:'#FF6B35'});
}

// Draw speed boost overlay flash
function drawSpeedFlash() {
  if (speedFlash <= 0) return;
  ctx.save();
  ctx.globalAlpha = (speedFlash / 30) * 0.18;
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.restore();
  speedFlash--;
}

// Pickup texts
let pickups = [];
function showPickup(x, y, type) {
  pickups.push({x, y, t:30, text: type==='thr'?'+50 THR!':'🎆', color: type==='thr'?'#FFD700':'#FF6B35'});
}
function drawPickups() {
  for (const p of pickups) {
    ctx.globalAlpha = p.t/30;
    ctx.fillStyle = p.color;
    ctx.font = 'bold 14px Fredoka One';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y - (30-p.t)*1.5);
    ctx.globalAlpha = 1;
    p.t--;
  }
  pickups = pickups.filter(p => p.t > 0);
}


// Mobile jump - prevent double trigger (touch fires both touchstart AND mousedown on mobile)

// Duck helpers - prevent double trigger on mobile
function duckStart(e) {
  if (e) e.preventDefault();
  duck(true);
}
function duckEnd(e) {
  if (e) e.preventDefault();
  duck(false);
}
function duckToggle(e) {
  // only fires on desktop click, not mobile touch
}

function mobileJump(e) {
  if (e) e.preventDefault();
  if (gameState === 'playing') jump();
}

// Show/hide mobile controls based on game state
function updateMobileControls() {
  const ctrls = document.querySelectorAll('.igc-btn');
  ctrls.forEach(c => {
    c.style.opacity = gameState === 'playing' ? '1' : '0.4';
    c.style.pointerEvents = gameState === 'playing' ? 'auto' : 'none';
  });
}

function jump() {
  if (player.jumpCount < 2) {
    player.vy = -10.5;
    player.grounded = false;
    player.jumpCount++;
    sfxJump();
  }
}

function duck(active) {
  player.ducking = active;
}


let muted = false;
function toggleMute() {
  muted = !muted;
  if (audioCtx) audioCtx.suspend && (muted ? audioCtx.suspend() : audioCtx.resume());
  document.getElementById('muteIcon').textContent = muted ? '🔇' : '🔊';
}

function startGame() {
  initAudio();
  stopMusic();
  initGame();
  gameState = 'playing';
  updateMobileControls();
  // Reset overlay state
  document.getElementById('overlayTitle').style.display = 'none';
  document.getElementById('charSelect').style.display = 'flex';
  document.getElementById('finalScore').textContent = '';
  document.getElementById('overlay').classList.add('hidden');
  fwActive = false;
  fireworks = [];
  startMusic();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameState = 'dead';
  updateMobileControls();
  fwActive = false;
  stopMusic();
  sfxGameOver();
  const ol = document.getElementById('overlay');
  ol.classList.remove('hidden');
  document.getElementById('overlayTitle').textContent = '💔 Game Over!';
  document.getElementById('overlayTitle').style.display = 'block';
  document.getElementById('charSelect').style.display = 'flex';
  document.getElementById('overlayMsg').textContent = 'Selamat Lebaran! Jangan lupa minta maaf ya 🤲 — Ganti karakter atau main lagi!';
  const isNew = score >= highScore;
  document.getElementById('finalScore').textContent = `Skor: ${score}${isNew ? ' 🏆 REKOR BARU!' : ''} | THR: Rp ${thr.toLocaleString()}`;
  document.getElementById('startBtn').textContent = '🔁 Main Lagi';
}

// Controls
document.addEventListener('keydown', e => {
  if (gameState !== 'playing') return;
  if (e.code==='Space'||e.code==='ArrowUp') { e.preventDefault(); jump(); }
  if (e.code==='ArrowDown') duck(true);
});
document.addEventListener('keyup', e => {
  if (e.code==='ArrowDown') duck(false);
});

// Touch on canvas (swipe down = duck, tap = jump)
let touchStartY = 0;
let touchMoved = false;
canvas.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
  touchMoved = false;
}, {passive:true});
canvas.addEventListener('touchmove', e => {
  if (e.touches[0].clientY - touchStartY > 30 && gameState==='playing') {
    duck(true);
    touchMoved = true;
  }
}, {passive:true});
canvas.addEventListener('touchend', e => {
  duck(false);
  // Only jump if it was a tap (no swipe)
  if (!touchMoved && gameState==='playing') jump();
  touchMoved = false;
}, {passive:true});

// Idle draw
function idleDraw() {
  if (gameState !== 'idle') return;
  frame++;
  ctx.clearRect(0,0,W,H);
  drawBg(frame*0.015);
  drawGround();
  // demo collectibles
  drawTHR(200, GROUND-60, frame*0.05);
  drawFireworkItem(350, GROUND-80, frame*0.08);
  drawRock(480, GROUND-22, 28, 22);
  requestAnimationFrame(idleDraw);
}
idleDraw();

// Celebration when open
fwActive = true;
launchFirework();
setTimeout(()=>{ fwActive=false; fireworks=[]; }, 3000);

// ====== LOADING SCREEN ======
(function() {
  const messages = [
    'Menyiapkan ketupat...',
    'Memanggil bedug...',
    'Menerbangkan burung...',
    'Menyalakan kembang api...',
    'Membungkus amplop THR...',
    'Siap lebaran! 🎉',
  ];
  const emojis = ['🌙','⭐','🎆','🥁','💰','🕌','🎊','✨'];
  const loadBar = document.getElementById('loadBar');
  const loadText = document.getElementById('loadText');
  const floatDiv = document.getElementById('floatEmojis');

  // spawn floating emojis
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const size = 1.2 + Math.random() * 1.5;
    const left = Math.random() * 100;
    const delay = Math.random() * 2.5;
    const dur = 2.5 + Math.random() * 2;
    el.style.cssText = `
      position:absolute; left:${left}%; bottom:-10%;
      font-size:${size}rem;
      animation: floatUp ${dur}s ${delay}s infinite linear;
    `;
    floatDiv.appendChild(el);
  }

  let progress = 0;
  let msgIdx = 0;
  const total = messages.length;

  const interval = setInterval(() => {
    progress += Math.random() * 22 + 10;
    if (progress > 100) progress = 100;

    loadBar.style.width = progress + '%';
    const newIdx = Math.min(Math.floor((progress / 100) * total), total - 1);
    if (newIdx !== msgIdx) {
      msgIdx = newIdx;
      loadText.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const ls = document.getElementById('loadingScreen');
        ls.style.transition = 'opacity 0.6s';
        ls.style.opacity = '0';
        setTimeout(() => ls.remove(), 650);
      }, 400);
    }
  }, 320);
})();
// ===== ROTATE WARNING =====
function checkOrientation() {
  const warn = document.getElementById('rotateWarning');
  if (!warn) return;
  const isPortrait = window.innerHeight > window.innerWidth;
  const isMobile = window.innerWidth <= 900;
  if (isMobile && isPortrait) {
    warn.style.display = 'flex';
  } else {
    warn.style.display = 'none';
  }
}
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
checkOrientation();


// ===== CHARACTER SELECTION =====
function selectChar(id) {
  selectedChar = id;
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('char-' + id).classList.add('selected');
  renderPreviews();
}

function renderCharOnCanvas(canvasId, charId) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, cv.width, cv.height);

  // Temporarily redirect ctx to this preview canvas
  const oldCtx = ctx;
  // We'll draw using a fake player object scaled to the preview
  const scale = cv.width / 48;
  c.save();
  c.scale(scale, scale);

  // fake frame for leg animation
  const fakeP = { x: 0, y: 8, ducking: false, invincible: 0 };
  const fakeFrame = 0;
  const ph = PLAYER_H;

  // manually call draw functions on preview context
  const pc = c;

  function previewBase(skinColor, bodyColor) {
    pc.fillStyle = bodyColor;
    pc.beginPath(); pc.roundRect(4, 26, PLAYER_W-8, ph-18, 6); pc.fill();
    pc.fillStyle = skinColor;
    pc.beginPath(); pc.arc(PLAYER_W/2, 20, 13, 0, Math.PI*2); pc.fill();
    pc.fillStyle = '#333';
    pc.beginPath(); pc.arc(PLAYER_W/2-4, 20, 2, 0, Math.PI*2); pc.fill();
    pc.beginPath(); pc.arc(PLAYER_W/2+4, 20, 2, 0, Math.PI*2); pc.fill();
    pc.strokeStyle = '#333'; pc.lineWidth = 1.5;
    pc.beginPath(); pc.arc(PLAYER_W/2, 23, 4, 0.2, Math.PI-0.2); pc.stroke();
  }

  if (charId === 'koko') {
    pc.fillStyle = '#FFFFFF';
    pc.beginPath(); pc.roundRect(6, 28, PLAYER_W-12, ph-30, 5); pc.fill();
    pc.fillStyle = '#FFD700';
    for (let i=0;i<3;i++) pc.fillRect(PLAYER_W/2-1, 32+i*8, 2, 3);
    previewBase('#FDBCB4', '#FFD700');
    pc.fillStyle = '#1a1a1a';
    pc.beginPath(); pc.ellipse(PLAYER_W/2, 11, 12, 5, 0, Math.PI, 0); pc.fill();
    pc.fillRect(PLAYER_W/2-12, 10, 24, 4);
    pc.fillStyle = '#FFD700'; pc.fillRect(PLAYER_W/2-12, 9, 24, 2);
    pc.fillStyle = '#2D7A3A';
    pc.fillRect(6, ph+2, 8, 12); pc.fillRect(PLAYER_W-14, ph+2, 8, 12);

  } else if (charId === 'perempuan') {
    pc.fillStyle = '#F8F8FF';
    pc.beginPath(); pc.roundRect(2, 24, PLAYER_W-4, ph-16, 8); pc.fill();
    previewBase('#FDBCB4', '#F8F8FF');
    pc.fillStyle = '#9C27B0';
    pc.beginPath(); pc.arc(PLAYER_W/2, 18, 14, Math.PI, 0); pc.fill();
    pc.beginPath(); pc.roundRect(2, 18, PLAYER_W-4, 16, 4); pc.fill();
    pc.fillStyle = '#FFD700';
    pc.beginPath(); pc.arc(PLAYER_W/2, 18, 3, 0, Math.PI*2); pc.fill();
    pc.fillStyle = '#333';
    pc.beginPath(); pc.arc(PLAYER_W/2-4, 22, 2, 0, Math.PI*2); pc.fill();
    pc.beginPath(); pc.arc(PLAYER_W/2+4, 22, 2, 0, Math.PI*2); pc.fill();
    pc.fillStyle = '#F8F8FF';
    pc.fillRect(6, ph+2, 8, 12); pc.fillRect(PLAYER_W-14, ph+2, 8, 12);

  } else if (charId === 'anak') {
    pc.fillStyle = '#FF6B35';
    pc.beginPath(); pc.roundRect(5, 28, PLAYER_W-10, ph-22, 5); pc.fill();
    pc.fillStyle = '#FFD700'; pc.fillRect(5, 32, PLAYER_W-10, 3);
    pc.fillStyle = '#FDBCB4';
    pc.beginPath(); pc.arc(PLAYER_W/2, 22, 14, 0, Math.PI*2); pc.fill();
    pc.fillStyle = '#3E2723';
    pc.beginPath(); pc.arc(PLAYER_W/2, 16, 12, Math.PI, 0); pc.fill();
    pc.fillRect(PLAYER_W/2-12, 15, 24, 5);
    pc.fillStyle = '#fff';
    pc.beginPath(); pc.arc(PLAYER_W/2-5, 22, 3.5, 0, Math.PI*2); pc.fill();
    pc.beginPath(); pc.arc(PLAYER_W/2+5, 22, 3.5, 0, Math.PI*2); pc.fill();
    pc.fillStyle = '#333';
    pc.beginPath(); pc.arc(PLAYER_W/2-5, 22, 2, 0, Math.PI*2); pc.fill();
    pc.beginPath(); pc.arc(PLAYER_W/2+5, 22, 2, 0, Math.PI*2); pc.fill();
    pc.strokeStyle = '#333'; pc.lineWidth = 1.5;
    pc.beginPath(); pc.arc(PLAYER_W/2, 26, 4, 0.2, Math.PI-0.2); pc.stroke();
    pc.fillStyle = '#1565C0';
    pc.fillRect(5, ph+2, 9, 13); pc.fillRect(PLAYER_W-14, ph+2, 9, 13);

  } else if (charId === 'gadis') {
    // gamis pink
    pc.fillStyle = '#E91E8C';
    pc.beginPath(); pc.roundRect(3, 25, PLAYER_W-6, ph-17, 7); pc.fill();
    pc.fillStyle = '#FF80C0';
    pc.beginPath(); pc.roundRect(8, 27, PLAYER_W-16, 10, 4); pc.fill();
    for (let i=0;i<3;i++) {
      pc.fillStyle = '#FF80C0';
      pc.beginPath(); pc.arc(9, 38+i*9, 2.5, 0, Math.PI*2); pc.fill();
    }
    // head
    pc.fillStyle = '#FDBCB4';
    pc.beginPath(); pc.arc(PLAYER_W/2, 20, 12, 0, Math.PI*2); pc.fill();
    // hijab tosca
    pc.fillStyle = '#00BCD4';
    pc.beginPath(); pc.arc(PLAYER_W/2, 17, 13, Math.PI, 0); pc.fill();
    pc.beginPath(); pc.roundRect(3, 17, PLAYER_W-6, 14, [0,0,8,8]); pc.fill();
    pc.fillStyle = '#FFD700';
    pc.beginPath(); pc.arc(PLAYER_W/2, 30, 2.5, 0, Math.PI*2); pc.fill();
    // mata
    pc.fillStyle = '#fff';
    pc.beginPath(); pc.arc(PLAYER_W/2-4, 21, 3, 0, Math.PI*2); pc.fill();
    pc.beginPath(); pc.arc(PLAYER_W/2+4, 21, 3, 0, Math.PI*2); pc.fill();
    pc.fillStyle = '#5D4037';
    pc.beginPath(); pc.arc(PLAYER_W/2-4, 21, 1.8, 0, Math.PI*2); pc.fill();
    pc.beginPath(); pc.arc(PLAYER_W/2+4, 21, 1.8, 0, Math.PI*2); pc.fill();
    pc.strokeStyle = '#E91E8C'; pc.lineWidth = 1.5;
    pc.beginPath(); pc.arc(PLAYER_W/2, 24, 4, 0.2, Math.PI-0.2); pc.stroke();
    pc.fillStyle = '#E91E8C';
    pc.fillRect(6, ph+2, 8, 12); pc.fillRect(PLAYER_W-14, ph+2, 8, 12);

  } else if (charId === 'kakek') {
    pc.fillStyle = '#795548';
    pc.beginPath(); pc.roundRect(4, 26, PLAYER_W-8, ph-18, 6); pc.fill();
    pc.fillStyle = '#FFD700';
    for (let i=0;i<3;i++) for (let j=0;j<2;j++) {
      pc.beginPath(); pc.arc(9+j*12, 30+i*9, 2, 0, Math.PI*2); pc.fill();
    }
    previewBase('#D4A574', '#795548');
    pc.fillStyle = '#EEEEEE';
    pc.beginPath(); pc.arc(PLAYER_W/2, 14, 11, Math.PI, 0); pc.fill();
    pc.fillRect(PLAYER_W/2-11, 13, 22, 5);
    pc.beginPath(); pc.arc(PLAYER_W/2, 28, 7, 0, Math.PI); pc.fill();
    pc.strokeStyle = '#333'; pc.lineWidth = 1.5;
    pc.beginPath(); pc.moveTo(PLAYER_W/2-7, 19); pc.lineTo(PLAYER_W/2-3, 19); pc.stroke();
    pc.beginPath(); pc.moveTo(PLAYER_W/2+3, 19); pc.lineTo(PLAYER_W/2+7, 19); pc.stroke();
    pc.beginPath(); pc.arc(PLAYER_W/2, 24, 4, 0.3, Math.PI-0.3); pc.stroke();
    pc.strokeStyle = '#5D4037'; pc.lineWidth = 3;
    pc.beginPath(); pc.moveTo(PLAYER_W+2, 28); pc.lineTo(PLAYER_W+2, ph+14); pc.stroke();
    pc.fillStyle = '#4E342E';
    pc.fillRect(6, ph+2, 8, 12); pc.fillRect(PLAYER_W-14, ph+2, 8, 12);
  }

  c.restore();
}

function renderPreviews() {
  ['koko','perempuan','gadis','anak','kakek'].forEach(id => {
    renderCharOnCanvas('prev-' + id, id);
  });
}

// Render previews when page loads
window.addEventListener('load', () => {
  setTimeout(renderPreviews, 100);
});
