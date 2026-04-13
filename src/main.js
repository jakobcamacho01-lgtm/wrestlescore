/* ── STORAGE ── */
function getStorageKey() {
  try {
    const user = (typeof firebase !== 'undefined' && FIREBASE_CONFIGURED)
      ? firebase.auth().currentUser : null;
    return user ? `wrestlescore_v1_${user.uid}` : 'wrestlescore_v1';
  } catch (e) { return 'wrestlescore_v1'; }
}

function loadData() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.athletes && d.athletes.length) athletes = d.athletes;
    if (d.matches && d.matches.length) matches = d.matches;
    if (d.nextId) nextId = d.nextId;
  } catch (e) { /* ignore corrupt storage */ }
}

function saveData() {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify({ athletes, matches, nextId }));
  } catch (e) { /* ignore */ }
}

/* ── DATA (defaults — overridden by loadData) ── */
let athletes = [
  { id: 1, name: 'Tyler Johnson', weight: '133', grade: '12th', status: 'Active', color: '#1DB954', initials: 'TJ', record: { w: 6, l: 2, streak: ['W','W','W','L','W','L','W','W'] }, neutral: { sl: { att: 18, sc: 9 }, hc: { att: 8, sc: 5 }, dl: { att: 12, sc: 4 }, oth: { att: 4, sc: 1 }, fhl: { att: 6, sc: 3 }, opp: { sl: { att: 10, sc: 2 }, hc: { att: 6, sc: 3 }, dl: { att: 8, sc: 2 }, oth: { att: 3, sc: 1 }, fhl: { att: 4, sc: 1 } } }, bottom: { times: 14, escapes: 8, standups: 11, reversals: 2, nfGiven: 3, brokenDown: 9 }, top: { matReturns: 7, oppStandups: 11, oppEscapes: 5, oppReversals: 2, nfAtt: 9, nfSets: 5, rtTop: 88 } },
  { id: 2, name: 'Alex Kim', weight: '157', grade: '11th', status: 'Active', color: '#5DADE2', initials: 'AK', record: { w: 4, l: 3, streak: ['W','L','W','W','L','W','L'] }, neutral: { sl: { att: 14, sc: 6 }, hc: { att: 5, sc: 2 }, dl: { att: 10, sc: 5 }, oth: { att: 3, sc: 1 }, fhl: { att: 3, sc: 2 }, opp: { sl: { att: 12, sc: 4 }, hc: { att: 4, sc: 2 }, dl: { att: 9, sc: 4 }, oth: { att: 2, sc: 1 }, fhl: { att: 3, sc: 2 } } }, bottom: { times: 18, escapes: 10, standups: 14, reversals: 3, nfGiven: 5, brokenDown: 12 }, top: { matReturns: 5, oppStandups: 14, oppEscapes: 8, oppReversals: 3, nfAtt: 7, nfSets: 3, rtTop: 54 } },
  { id: 3, name: 'Marcus Torres', weight: '175', grade: '12th', status: 'Active', color: '#F0B429', initials: 'MT', record: { w: 7, l: 1, streak: ['W','W','W','W','W','L','W','W'] }, neutral: { sl: { att: 22, sc: 14 }, hc: { att: 10, sc: 7 }, dl: { att: 6, sc: 3 }, oth: { att: 5, sc: 2 }, fhl: { att: 8, sc: 5 }, opp: { sl: { att: 8, sc: 1 }, hc: { att: 5, sc: 1 }, dl: { att: 7, sc: 2 }, oth: { att: 2, sc: 0 }, fhl: { att: 3, sc: 1 } } }, bottom: { times: 10, escapes: 7, standups: 9, reversals: 4, nfGiven: 1, brokenDown: 5 }, top: { matReturns: 9, oppStandups: 10, oppEscapes: 3, oppReversals: 1, nfAtt: 12, nfSets: 8, rtTop: 122 } },
  { id: 4, name: 'Derek Park', weight: '120', grade: '10th', status: 'Active', color: '#E74C3C', initials: 'DP', record: { w: 2, l: 4, streak: ['L','L','W','L','W','L'] }, neutral: { sl: { att: 10, sc: 3 }, hc: { att: 4, sc: 1 }, dl: { att: 8, sc: 2 }, oth: { att: 2, sc: 0 }, fhl: { att: 2, sc: 1 }, opp: { sl: { att: 14, sc: 6 }, hc: { att: 7, sc: 4 }, dl: { att: 10, sc: 5 }, oth: { att: 4, sc: 2 }, fhl: { att: 5, sc: 3 } } }, bottom: { times: 22, escapes: 9, standups: 15, reversals: 1, nfGiven: 8, brokenDown: 16 }, top: { matReturns: 3, oppStandups: 12, oppEscapes: 9, oppReversals: 4, nfAtt: 4, nfSets: 1, rtTop: 32 } },
];

let nextId = 5;
let editingId = null;
let rosterFilter = 'All';
let currentAthId = 1;
let libFilters = { event: 'All', athlete: 'All' };
const counters = {};
let uploadedVideoURL = null;
let currentMatchIdx = -1;

let matches = [
  { w1: 'Tyler Johnson', w2: 'R. Morrison', wt: '133 lbs', ev: 'Districts', dt: 'Apr 6, 2026', s1: 8, s2: 3, res: 'W', athId: 1, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Alex Kim', w2: 'D. Hayes', wt: '157 lbs', ev: 'Regionals', dt: 'Apr 3, 2026', s1: 5, s2: 9, res: 'L', athId: 2, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Marcus Torres', w2: 'B. Kim', wt: '175 lbs', ev: 'Scrimmage', dt: 'Mar 29, 2026', s1: 12, s2: 4, res: 'W', athId: 3, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Tyler Johnson', w2: 'J. Lane', wt: '133 lbs', ev: 'Duals', dt: 'Mar 22, 2026', s1: 7, s2: 2, res: 'W', athId: 1, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Derek Park', w2: 'C. Watts', wt: '120 lbs', ev: 'Districts', dt: 'Mar 22, 2026', s1: 3, s2: 6, res: 'L', athId: 4, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Marcus Torres', w2: 'T. Cruz', wt: '175 lbs', ev: 'Duals', dt: 'Mar 15, 2026', s1: 9, s2: 9, res: 'D', athId: 3, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Alex Kim', w2: 'P. Nguyen', wt: '157 lbs', ev: 'State', dt: 'Mar 8, 2026', s1: 14, s2: 5, res: 'W', athId: 2, videoURL: null, stats: {}, notes: '', bookmarks: [] },
  { w1: 'Tyler Johnson', w2: 'M. Bell', wt: '133 lbs', ev: 'State', dt: 'Mar 8, 2026', s1: 2, s2: 11, res: 'L', athId: 1, videoURL: null, stats: {}, notes: '', bookmarks: [] },
];

/* Snapshot defaults so auth sign-out can reset to clean state */
const defaultAthletes = JSON.parse(JSON.stringify(athletes));
const defaultMatches  = JSON.parse(JSON.stringify(matches));

/* ── VIDEO UPLOAD ── */
function handleVideoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (uploadedVideoURL) URL.revokeObjectURL(uploadedVideoURL);
  uploadedVideoURL = URL.createObjectURL(file);
  const preview = document.getElementById('upload-video-preview');
  preview.src = uploadedVideoURL;
  document.getElementById('upload-preview').style.display = 'block';
  document.getElementById('upload-zone').style.display = 'none';
  document.getElementById('upload-video-name').textContent = file.name;
  toast('Video loaded: ' + file.name);
}

function clearUploadedVideo() {
  if (uploadedVideoURL) { URL.revokeObjectURL(uploadedVideoURL); uploadedVideoURL = null; }
  document.getElementById('upload-preview').style.display = 'none';
  document.getElementById('upload-zone').style.display = 'block';
  const fi = document.getElementById('video-file-input');
  if (fi) fi.value = '';
}

function saveUploadedMatch() {
  const athId = parseInt(document.getElementById('upload-athlete').value) || (athletes.length ? athletes[0].id : 1);
  const ath = athletes.find(a => a.id === athId);
  const opp = document.getElementById('upload-opp').value.trim() || 'Opponent';
  const wt = document.getElementById('upload-weight').value + ' lbs';
  const ev = document.getElementById('upload-event').value.trim() || 'Scrimmage';
  const rawDate = document.getElementById('upload-date').value;
  const dt = rawDate
    ? new Date(rawDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const res = document.getElementById('upload-result').value; // 'W' | 'L' | 'D'
  const s1 = parseInt(document.getElementById('upload-s1').value) || 0;
  const s2 = parseInt(document.getElementById('upload-s2').value) || 0;
  matches.unshift({
    w1: ath ? ath.name : 'Athlete', w2: opp, wt, ev, dt, s1, s2, res,
    athId, videoURL: uploadedVideoURL, stats: {}, notes: '', bookmarks: []
  });
  saveData();
  toast('Match saved to library!');
  clearUploadedVideo();
  document.getElementById('upload-opp').value = '';
  document.getElementById('upload-event').value = '';
  document.getElementById('upload-date').value = '';
  document.getElementById('upload-s1').value = '';
  document.getElementById('upload-s2').value = '';
  uploadedVideoURL = null;
  setTimeout(() => navTo('s-lib', null), 800);
}

/* ── VIDEO PLAYBACK ── */
let currentVideoEl = null;
let playing = false;
let vidInterval = null;
let simTotal = 306;
let simCur = 0;
let useRealVideo = false;

function fmt(s) {
  s = Math.floor(s);
  return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60;
}

function updateProgress() {
  const dur = useRealVideo && currentVideoEl ? currentVideoEl.duration : simTotal;
  const cur = useRealVideo && currentVideoEl ? currentVideoEl.currentTime : simCur;
  const p = dur > 0 ? cur / dur * 100 : 0;
  const f = document.getElementById('progress-fill');
  const h = document.getElementById('progress-handle');
  if (f) f.style.width = p + '%';
  if (h) h.style.left = p + '%';
  const tc = document.getElementById('time-cur');
  const tt = document.getElementById('time-total');
  if (tc) tc.textContent = fmt(cur);
  if (tt) tt.textContent = fmt(dur || 0);
}

function togglePlay() {
  const vs = document.getElementById('video-section');
  if (useRealVideo && currentVideoEl) {
    if (currentVideoEl.paused) {
      currentVideoEl.play();
      playing = true;
      vs.classList.remove('paused');
    } else {
      currentVideoEl.pause();
      playing = false;
      vs.classList.add('paused');
    }
    const icon = document.getElementById('play-icon');
    if (icon) icon.innerHTML = currentVideoEl.paused ? '<path d="M8 5v14l11-7z"/>' : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  } else {
    playing = !playing;
    const icon = document.getElementById('play-icon');
    if (playing) {
      vs.classList.remove('paused');
      if (icon) icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      vidInterval = setInterval(() => {
        if (simCur < simTotal) { simCur++; updateProgress(); }
        else { playing = false; clearInterval(vidInterval); vs.classList.add('paused'); }
      }, 1000);
    } else {
      vs.classList.add('paused');
      if (icon) icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      clearInterval(vidInterval);
    }
  }
}

function seekRel(d) {
  if (useRealVideo && currentVideoEl) { currentVideoEl.currentTime = Math.max(0, currentVideoEl.currentTime + d); updateProgress(); }
  else { simCur = Math.max(0, Math.min(simTotal, simCur + d)); updateProgress(); }
}

function seekTo(e) {
  const b = document.getElementById('progress-bar');
  if (!b) return;
  const r = b.getBoundingClientRect();
  const pct = (e.clientX - r.left) / r.width;
  if (useRealVideo && currentVideoEl) currentVideoEl.currentTime = pct * currentVideoEl.duration;
  else simCur = Math.round(pct * simTotal);
  updateProgress();
}

function jumpTo(s) {
  if (useRealVideo && currentVideoEl) currentVideoEl.currentTime = s;
  else simCur = s;
  updateProgress();
  if (!playing) togglePlay();
  toast('Jumped to ' + fmt(s));
}

function addBookmark() {
  const cur = useRealVideo && currentVideoEl ? Math.floor(currentVideoEl.currentTime) : simCur;
  const t = fmt(cur);
  const s = cur;
  const list = document.getElementById('clips-list');
  const cols = ['var(--green)', 'var(--blue)', 'var(--gold)', 'var(--red)'];
  const col = cols[list.children.length % cols.length];
  const item = document.createElement('div');
  item.className = 'bookmark-item';
  item.innerHTML = `<div style="width:7px;height:7px;border-radius:50%;background:${col};flex-shrink:0"></div><div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--white)">Bookmark at ${t}</div><div style="font-size:10px;color:var(--text-muted)">${t}</div></div><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--text-muted)" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
  item.onclick = () => jumpTo(s);
  list.appendChild(item);
  if (currentMatchIdx >= 0 && currentMatchIdx < matches.length) {
    if (!matches[currentMatchIdx].bookmarks) matches[currentMatchIdx].bookmarks = [];
    matches[currentMatchIdx].bookmarks.push({ s, label: 'Bookmark at ' + t });
    saveData();
  }
  toast('Bookmark at ' + t);
}

function loadMatchVideo(m) {
  const vs = document.getElementById('video-section');
  const placeholder = document.getElementById('vid-placeholder');
  if (m.videoURL) {
    useRealVideo = true;
    let vid = vs.querySelector('video.match-video');
    if (!vid) {
      vid = document.createElement('video');
      vid.className = 'match-video';
      vid.setAttribute('playsinline', '');
      vid.setAttribute('controls', '');
      vs.insertBefore(vid, placeholder);
    }
    vid.src = m.videoURL;
    placeholder.style.display = 'none';
    vid.style.display = 'block';
    currentVideoEl = vid;
    vid.ontimeupdate = updateProgress;
    vid.ondurationchange = updateProgress;
    vs.classList.add('has-video');
  } else {
    useRealVideo = false;
    currentVideoEl = null;
    const old = vs.querySelector('video.match-video');
    if (old) old.remove();
    placeholder.style.display = 'flex';
    simCur = 0;
    simTotal = 306;
    vs.classList.remove('has-video');
  }
  if (playing) { playing = false; clearInterval(vidInterval); }
  vs.classList.add('paused');
  const icon = document.getElementById('play-icon');
  if (icon) icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  updateProgress();
}

let isFS = false;
function toggleFullscreen() {
  const vs = document.getElementById('video-section');
  isFS = !isFS;
  if (isFS) {
    vs.classList.add('fullscreen-mode');
    if (vs.requestFullscreen) vs.requestFullscreen().catch(() => {});
    else if (vs.webkitRequestFullscreen) vs.webkitRequestFullscreen();
  } else {
    vs.classList.remove('fullscreen-mode');
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && isFS) toggleFullscreen(); });
document.addEventListener('webkitfullscreenchange', () => { if (!document.webkitFullscreenElement && isFS) toggleFullscreen(); });

/* ── DASHBOARD HELPERS ── */
function rc(v) { if (v === '—') return '#888'; const n = parseInt(v); return n >= 60 ? 'var(--green)' : n >= 35 ? 'var(--gold)' : 'var(--red)'; }
function dc(v) { if (v === '—') return '#888'; const n = parseInt(v); return n >= 65 ? 'var(--green)' : n >= 45 ? 'var(--gold)' : 'var(--red)'; }
function dn(pv, col, sz = 52, sw = 7) {
  if (!pv || isNaN(pv)) pv = 0;
  const r = (sz - sw) / 2, c = 2 * Math.PI * r, f = c * (pv / 100), g = c - f;
  return `<div style="position:relative;width:${sz}px;height:${sz}px;flex-shrink:0"><svg width="${sz}" height="${sz}" style="display:block;transform:rotate(-90deg)"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--black-4)" stroke-width="${sw}"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-dasharray="${f} ${g}" stroke-linecap="round"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:12px;font-weight:800;color:var(--white)">${pv}%</div></div>`;
}
function bv(lbl, v, mx, col) {
  const pp = mx > 0 ? Math.round(v / mx * 100) : 0;
  return `<div class="bar-row"><div class="bar-label">${lbl}</div><div class="bar-track"><div class="bar-fill" style="width:${pp}%;background:${col}"></div></div><div class="bar-val">${v}</div></div>`;
}

function buildDashTabs() {
  const el = document.getElementById('dash-ath-tabs');
  el.innerHTML = '';
  athletes.forEach(a => {
    const tab = document.createElement('div');
    tab.className = 'ath-tab' + (a.id === currentAthId ? ' active' : '');
    const tc = a.color === '#F0B429' || a.color === '#1DB954' ? '#000' : '#fff';
    tab.innerHTML = `<div class="ath-avatar" style="background:${a.id === currentAthId ? a.color : a.color + '33'};color:${a.id === currentAthId ? tc : a.color}">${a.initials}</div><div class="ath-name">${a.name.split(' ')[0]}</div>`;
    tab.onclick = () => { currentAthId = a.id; buildDashTabs(); renderDash(); };
    el.appendChild(tab);
  });
  const add = document.createElement('div');
  add.className = 'ath-tab';
  add.style.opacity = '.45';
  add.innerHTML = `<div style="width:30px;height:30px;border-radius:50%;border:1.5px dashed var(--border-light);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--text-muted)" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div><div class="ath-name">Add</div>`;
  add.onclick = () => { navTo('s-roster', null); setTimeout(openAddAthlete, 300); };
  el.appendChild(add);
}

function renderDash() {
  const a = athletes.find(x => x.id === currentAthId);
  if (!a) return;
  const n = a.neutral, b = a.bottom, t = a.top, r = a.record, c = a.color;
  const total = r.w + r.l, wp = total ? Math.round(r.w / total * 100) : 0;
  const oA = n.sl.att + n.hc.att + n.dl.att + n.oth.att + n.fhl.att;
  const oS = n.sl.sc + n.hc.sc + n.dl.sc + n.oth.sc + n.fhl.sc;
  const ppA = n.opp.sl.att + n.opp.hc.att + n.opp.dl.att + n.opp.oth.att + n.opp.fhl.att;
  const ppS = n.opp.sl.sc + n.opp.hc.sc + n.opp.dl.sc + n.opp.oth.sc + n.opp.fhl.sc;
  const oFP = oA ? Math.round(oS / oA * 100) : 0;
  const ppFP = ppA ? Math.round(ppS / ppA * 100) : 0;
  const hP = ppA ? Math.round((1 - ppS / ppA) * 100) : 0;
  const eP = b.times ? Math.round(b.escapes / b.times * 100) : 0;
  const sP = b.standups ? Math.round(b.escapes / b.standups * 100) : 0;
  const mP = t.oppStandups ? Math.round(t.matReturns / t.oppStandups * 100) : 0;
  const nP = t.nfAtt ? Math.round(t.nfSets / t.nfAtt * 100) : 0;
  const atks = [
    { lbl: 'Single Leg', att: n.sl.att, sc: n.sl.sc, oA: n.opp.sl.att, oS: n.opp.sl.sc },
    { lbl: 'High Crotch', att: n.hc.att, sc: n.hc.sc, oA: n.opp.hc.att, oS: n.opp.hc.sc },
    { lbl: 'Double Leg', att: n.dl.att, sc: n.dl.sc, oA: n.opp.dl.att, oS: n.opp.dl.sc },
    { lbl: 'Front H.L.', att: n.fhl.att, sc: n.fhl.sc, oA: n.opp.fhl.att, oS: n.opp.fhl.sc },
    { lbl: 'Other', att: n.oth.att, sc: n.oth.sc, oA: n.opp.oth.att, oS: n.opp.oth.sc },
  ];
  const sd = r.streak.slice(-8).map(s => `<div style="width:9px;height:9px;border-radius:50%;background:${s === 'W' ? 'var(--green)' : 'var(--red)'}"></div>`).join('');
  const ar = atks.map(x => {
    const fp = x.att ? Math.round(x.sc / x.att * 100) : 0;
    const dp = x.oA ? Math.round((1 - x.oS / x.oA) * 100) : 0;
    return `<tr><td>${x.lbl}</td><td>${x.att}</td><td>${x.sc}</td><td style="color:${rc(fp + '%')}">${fp}%</td><td>${x.oA}</td><td style="color:${dc(dp + '%')}">${dp}%</td></tr>`;
  }).join('');

  document.getElementById('dash-body').innerHTML = `
  <div style="background:var(--black);border-bottom:1px solid var(--border);padding:12px 14px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <div style="width:36px;height:36px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:14px;font-weight:700;color:${c==='#F0B429'||c==='#1DB954'?'#000':'#fff'};flex-shrink:0">${a.initials}</div>
      <div><div style="font-family:var(--font-d);font-size:18px;font-weight:700;color:var(--white)">${a.name}</div><div style="font-size:11px;color:var(--text-muted)">${a.weight} lbs · ${a.grade} · ${total} matches</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px">
      <div class="wl-card"><div class="wl-num" style="color:var(--green)">${r.w}</div><div class="wl-lbl">Wins</div></div>
      <div class="wl-card"><div class="wl-num" style="color:var(--red)">${r.l}</div><div class="wl-lbl">Losses</div></div>
      <div class="wl-card"><div class="wl-num" style="color:${wp>=50?'var(--green)':'var(--red)'}">${wp}%</div><div class="wl-lbl">Win%</div></div>
      <div class="wl-card"><div class="wl-num">${total}</div><div class="wl-lbl">Matches</div></div>
    </div>
    <div style="display:flex;align-items:center;gap:5px;margin-top:9px"><span style="font-size:10px;color:var(--text-muted)">Streak</span>${sd}</div>
  </div>
  <div class="sec-hdr"><div class="sec-icon" style="background:rgba(29,185,84,.15)"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div class="sec-title">Neutral</div><div class="sec-badge" style="background:rgba(29,185,84,.12);color:var(--green);border:1px solid rgba(29,185,84,.25)">${oA} att · ${oS} sc</div></div>
  <div class="stat-cards-grid">
    <div class="stat-card"><div class="stat-card-title">Finish Rate</div><div style="display:flex;align-items:center;gap:8px">${dn(oFP,c)}<div><div class="stat-big" style="color:${c};font-size:22px">${oFP}%</div><div class="stat-sub">${oS}sc / ${oA}att</div></div></div></div>
    <div class="stat-card"><div class="stat-card-title">H&H Defense</div><div style="display:flex;align-items:center;gap:8px">${dn(hP,'var(--blue)')}<div><div class="stat-big" style="color:var(--blue);font-size:22px">${hP}%</div><div class="stat-sub">Shots stuffed</div></div></div></div>
    <div class="stat-card full"><div class="stat-card-title">Score Distribution</div>${bv('Single Leg',n.sl.sc,oS,c)}${bv('High Crotch',n.hc.sc,oS,c)}${bv('Double Leg',n.dl.sc,oS,c)}${bv('Front H.L.',n.fhl.sc,oS,c)}${bv('Other',n.oth.sc,oS,c)}</div>
    <div class="stat-card full"><div class="stat-card-title">Finish Rate on Leg &amp; H&H Defense by Attack</div><table class="atk-table"><thead><tr><th>Attack</th><th>Att</th><th>Sc</th><th>Fin%</th><th>O.Att</th><th>Def%</th></tr></thead><tbody>${ar}<tr style="border-top:1px solid var(--border)"><td>Total</td><td>${oA}</td><td>${oS}</td><td style="color:${rc(oFP+'%')}">${oFP}%</td><td>${ppA}</td><td style="color:${dc(hP+'%')}">${hP}%</td></tr></tbody></table></div>
    <div class="stat-card"><div class="stat-card-title">Opp Finish Rate</div><div style="display:flex;align-items:center;gap:8px">${dn(ppFP,'var(--red)')}<div><div class="stat-big" style="color:var(--red);font-size:22px">${ppFP}%</div><div class="stat-sub">${ppS}sc / ${ppA}att</div></div></div></div>
    <div class="stat-card"><div class="stat-card-title">Opp Score Dist.</div>${bv('Single Leg',n.opp.sl.sc,ppS,'var(--red)')}${bv('High Crotch',n.opp.hc.sc,ppS,'var(--red)')}${bv('Double Leg',n.opp.dl.sc,ppS,'var(--red)')}${bv('Front H.L.',n.opp.fhl.sc,ppS,'var(--red)')}${bv('Other',n.opp.oth.sc,ppS,'var(--red)')}</div>
  </div>
  <div class="sec-hdr"><div class="sec-icon" style="background:rgba(93,173,226,.12)"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round"><path d="M12 22V12M12 12L8 16M12 12l4 4M2 7l10-5 10 5"/></svg></div><div class="sec-title" style="color:var(--blue)">Bottom</div><div class="sec-badge" style="background:rgba(93,173,226,.1);color:#7EC8E3;border:1px solid rgba(93,173,226,.22)">${b.times} on bottom</div></div>
  <div class="stat-cards-grid">
    <div class="stat-card"><div class="stat-card-title">Escape Ratio</div><div style="display:flex;align-items:center;gap:8px">${dn(eP,'var(--blue)')}<div><div class="stat-big" style="color:var(--blue);font-size:22px">${eP}%</div><div class="stat-sub">${b.escapes}esc / ${b.times}bot</div></div></div><div style="font-size:9px;color:var(--text-muted);margin-top:4px">Escapes ÷ Times on Bottom</div></div>
    <div class="stat-card"><div class="stat-card-title">Standup→Escape</div><div style="display:flex;align-items:center;gap:8px">${dn(sP,'var(--gold)')}<div><div class="stat-big" style="color:var(--gold);font-size:22px">${sP}%</div><div class="stat-sub">${b.escapes}esc / ${b.standups}su</div></div></div><div style="font-size:9px;color:var(--text-muted);margin-top:4px">Escapes ÷ Standups</div></div>
    <div class="stat-card"><div class="stat-card-title">Near Falls Given</div><div class="stat-big" style="color:var(--red)">${b.nfGiven}</div><div class="stat-sub" style="margin-top:3px">avg ${(b.nfGiven/(total||1)).toFixed(1)}/match</div></div>
    <div class="stat-card"><div class="stat-card-title">Times Broken Down</div><div class="stat-big" style="color:var(--red)">${b.brokenDown}</div><div class="stat-sub" style="margin-top:3px">avg ${(b.brokenDown/(total||1)).toFixed(1)}/match</div></div>
    <div class="stat-card full"><div class="stat-card-title">Bottom Summary</div>${bv('Escapes',b.escapes,b.times,'var(--green)')}${bv('Reversals',b.reversals,b.times,'var(--blue)')}${bv('Standups',b.standups,b.times,'var(--gold)')}${bv('Broken Down',b.brokenDown,b.times,'var(--red)')}${bv('NF Given',b.nfGiven,b.times,'var(--red)')}</div>
  </div>
  <div class="sec-hdr"><div class="sec-icon" style="background:rgba(240,180,41,.1)"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round"><path d="M12 2l4 4H8l4-4zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div><div class="sec-title" style="color:var(--gold)">Top</div><div class="sec-badge" style="background:rgba(240,180,41,.1);color:#F0B429;border:1px solid rgba(240,180,41,.22)">${t.oppStandups} opp su</div></div>
  <div class="stat-cards-grid">
    <div class="stat-card"><div class="stat-card-title">Mat Return Ratio</div><div style="display:flex;align-items:center;gap:8px">${dn(mP,'var(--gold)')}<div><div class="stat-big" style="color:var(--gold);font-size:22px">${mP}%</div><div class="stat-sub">${t.matReturns}ret / ${t.oppStandups}su</div></div></div><div style="font-size:9px;color:var(--text-muted);margin-top:4px">Mat Returns ÷ Opp Standups</div></div>
    <div class="stat-card"><div class="stat-card-title">NF Att→Sets</div><div style="display:flex;align-items:center;gap:8px">${dn(nP,'var(--green)')}<div><div class="stat-big" style="color:var(--green);font-size:22px">${nP}%</div><div class="stat-sub">${t.nfSets}sets / ${t.nfAtt}att</div></div></div><div style="font-size:9px;color:var(--text-muted);margin-top:4px">NF Sets ÷ NF Attempts</div></div>
    <div class="stat-card full"><div class="stat-card-title">Mat Returns vs. Opp Standups vs. Opp Escapes</div><div style="display:flex;gap:7px;margin-bottom:9px"><div style="flex:1;text-align:center;background:var(--black-4);border-radius:var(--rs);padding:9px 4px"><div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--gold)">${t.matReturns}</div><div style="font-size:10px;color:var(--text-muted)">Mat Returns</div></div><div style="flex:1;text-align:center;background:var(--black-4);border-radius:var(--rs);padding:9px 4px"><div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--blue)">${t.oppStandups}</div><div style="font-size:10px;color:var(--text-muted)">Opp Standups</div></div><div style="flex:1;text-align:center;background:var(--black-4);border-radius:var(--rs);padding:9px 4px"><div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--red)">${t.oppEscapes}</div><div style="font-size:10px;color:var(--text-muted)">Opp Escapes</div></div></div>${bv('Mat Returns',t.matReturns,t.oppStandups,'var(--gold)')}${bv('Opp Standups',t.oppStandups,t.oppStandups,'var(--blue)')}${bv('Opp Escapes',t.oppEscapes,t.oppStandups,'var(--red)')}</div>
    <div class="stat-card full"><div class="stat-card-title">Near Fall Attempts vs. Sets Scored</div><div style="display:flex;gap:7px;margin-bottom:9px"><div style="flex:1;text-align:center;background:var(--black-4);border-radius:var(--rs);padding:9px 4px"><div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--green)">${t.nfSets}</div><div style="font-size:10px;color:var(--text-muted)">Sets Scored</div></div><div style="flex:1;text-align:center;background:var(--black-4);border-radius:var(--rs);padding:9px 4px"><div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--white)">${t.nfAtt}</div><div style="font-size:10px;color:var(--text-muted)">Attempts</div></div><div style="flex:1;text-align:center;background:var(--black-4);border-radius:var(--rs);padding:9px 4px"><div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:${c}">${nP}%</div><div style="font-size:10px;color:var(--text-muted)">Set Rate</div></div></div>${bv('Sets Scored',t.nfSets,t.nfAtt,'var(--green)')}${bv('Not Scored',t.nfAtt-t.nfSets,t.nfAtt,'var(--red)')}</div>
  </div>
  <div style="height:14px"></div>`;
}

/* ── ROSTER ── */
function renderRoster(q = '') {
  const list = document.getElementById('roster-list');
  let data = athletes.filter(a => rosterFilter === 'All' || a.status === rosterFilter);
  if (q) { const f = q.toLowerCase(); data = data.filter(a => a.name.toLowerCase().includes(f) || a.weight.includes(f)); }
  list.innerHTML = '';
  if (!data.length) {
    list.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text-muted);font-size:13px">No athletes.<br><span style="color:var(--green);cursor:pointer" onclick="openAddAthlete()">+ Add one</span></div>';
    return;
  }
  data.forEach(a => {
    const wins = matches.filter(m => m.athId === a.id && m.res === 'W').length;
    const tot = matches.filter(m => m.athId === a.id).length;
    const tc = a.color === '#F0B429' || a.color === '#1DB954' ? '#000' : '#fff';
    const row = document.createElement('div');
    row.className = 'roster-item';
    row.innerHTML = `<div class="roster-avatar" style="background:${a.color};color:${tc}">${a.initials}</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;color:var(--white)">${a.name}</div><div style="font-size:11px;color:var(--text-muted)">${a.weight}lbs · ${a.grade} · ${tot}M ${wins}W</div></div><div style="display:flex;align-items:center;gap:6px"><span style="padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700;background:${a.status==='Active'?'rgba(29,185,84,.15)':'rgba(255,255,255,.06)'};color:${a.status==='Active'?'var(--green)':'var(--text-muted)'};border:1px solid ${a.status==='Active'?'rgba(29,185,84,.3)':'var(--border)'}">${a.status}</span><div class="icon-btn" onclick="openEditAthlete(${a.id})"><svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><div class="icon-btn del" onclick="removeAthlete(${a.id})"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></div></div>`;
    list.appendChild(row);
  });
}

function setRosterFilter(v, btn) {
  rosterFilter = v;
  document.querySelectorAll('#s-roster .filter-row .f-pill').forEach(pp => pp.classList.remove('on'));
  btn.classList.add('on');
  renderRoster();
}

function openAddAthlete() {
  editingId = null;
  document.getElementById('modal-title-text').textContent = 'Add Athlete';
  document.getElementById('ath-name').value = '';
  document.getElementById('ath-weight').value = '133';
  document.getElementById('ath-grade').value = '12th';
  document.getElementById('ath-status').value = 'Active';
  document.getElementById('add-modal').classList.remove('hidden');
}

function openEditAthlete(id) {
  const a = athletes.find(x => x.id === id);
  if (!a) return;
  editingId = id;
  document.getElementById('modal-title-text').textContent = 'Edit Athlete';
  document.getElementById('ath-name').value = a.name;
  document.getElementById('ath-weight').value = a.weight;
  document.getElementById('ath-grade').value = a.grade;
  document.getElementById('ath-status').value = a.status;
  document.getElementById('add-modal').classList.remove('hidden');
}

function saveAthlete() {
  const name = document.getElementById('ath-name').value.trim();
  if (!name) { toast('Enter a name'); return; }
  const cols = ['#1DB954', '#5DADE2', '#F0B429', '#E74C3C', '#9B59B6', '#E67E22', '#1ABC9C'];
  const wt = document.getElementById('ath-weight').value;
  const gr = document.getElementById('ath-grade').value;
  const st = document.getElementById('ath-status').value;
  const ni = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  if (editingId) {
    const a = athletes.find(x => x.id === editingId);
    a.name = name; a.weight = wt; a.grade = gr; a.status = st; a.initials = ni;
    toast('Updated!');
  } else {
    athletes.push({ id: nextId++, name, weight: wt, grade: gr, status: st, color: cols[athletes.length % cols.length], initials: ni, record: { w: 0, l: 0, streak: [] }, neutral: { sl: { att: 0, sc: 0 }, hc: { att: 0, sc: 0 }, dl: { att: 0, sc: 0 }, oth: { att: 0, sc: 0 }, fhl: { att: 0, sc: 0 }, opp: { sl: { att: 0, sc: 0 }, hc: { att: 0, sc: 0 }, dl: { att: 0, sc: 0 }, oth: { att: 0, sc: 0 }, fhl: { att: 0, sc: 0 } } }, bottom: { times: 0, escapes: 0, standups: 0, reversals: 0, nfGiven: 0, brokenDown: 0 }, top: { matReturns: 0, oppStandups: 0, oppEscapes: 0, oppReversals: 0, nfAtt: 0, nfSets: 0, rtTop: 0 } });
    toast('Athlete added!');
  }
  saveData();
  closeModal();
  renderRoster();
  buildDashTabs();
  buildAthleteFilters();
  updateUploadAthSelect();
}

function removeAthlete(id) {
  const a = athletes.find(x => x.id === id);
  if (!a) return;
  athletes = athletes.filter(x => x.id !== id);
  if (currentAthId === id && athletes.length) currentAthId = athletes[0].id;
  saveData();
  toast(a.name + ' removed');
  renderRoster();
  buildDashTabs();
  buildAthleteFilters();
  updateUploadAthSelect();
  renderDash();
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('add-modal'))
    document.getElementById('add-modal').classList.add('hidden');
}

/* ── LIBRARY ── */
function buildAthleteFilters() {
  const c = document.getElementById('athlete-filters');
  c.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'ath-pill' + (libFilters.athlete === 'All' ? ' on' : '');
  all.textContent = 'All';
  all.onclick = () => setLibFilter('athlete', 'All', all);
  c.appendChild(all);
  athletes.filter(a => a.status === 'Active').forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'ath-pill' + (libFilters.athlete === a.name ? ' on' : '');
    btn.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${a.color};display:inline-block;flex-shrink:0"></span>${a.name.split(' ')[0]}`;
    btn.onclick = () => setLibFilter('athlete', a.name, btn);
    c.appendChild(btn);
  });
}

function updateUploadAthSelect() {
  const opts = athletes.filter(a => a.status === 'Active').map(a =>
    `<option value="${a.id}">${a.name} (${a.weight}lbs)</option>`
  ).join('');

  const sel = document.getElementById('upload-athlete');
  if (sel) sel.innerHTML = '<option value="">Select athlete…</option>' + opts;

  const liveSel = document.getElementById('live-athlete');
  if (liveSel) liveSel.innerHTML = opts || '<option value="">No athletes</option>';
}

function setLibFilter(type, val, btn) {
  libFilters[type] = val;
  const cont = type === 'event' ? document.getElementById('event-filters') : document.getElementById('athlete-filters');
  cont.querySelectorAll('.f-pill,.ath-pill').forEach(pp => pp.classList.remove('on'));
  btn.classList.add('on');
  renderLib();
}

function filterLib(q) { renderLib(q); }

function renderLib(q = '') {
  let data = [...matches];
  if (libFilters.event !== 'All') data = data.filter(m => m.ev === libFilters.event);
  if (libFilters.athlete !== 'All') data = data.filter(m => m.w1 === libFilters.athlete);
  if (q) { const f = q.toLowerCase(); data = data.filter(m => m.w1.toLowerCase().includes(f) || m.w2.toLowerCase().includes(f) || m.ev.toLowerCase().includes(f)); }
  const groups = {};
  data.forEach(m => { if (!groups[m.ev]) groups[m.ev] = []; groups[m.ev].push(m); });
  Object.keys(groups).forEach(ev => groups[ev].sort((a, b) => new Date(b.dt) - new Date(a.dt)));
  const list = document.getElementById('lib-list');
  list.innerHTML = '';
  if (!data.length) { list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px">No matches for this filter.</div>'; return; }
  Object.keys(groups).sort().forEach(ev => {
    const hdr = document.createElement('div');
    hdr.className = 'lib-group-hdr';
    hdr.textContent = ev;
    list.appendChild(hdr);
    groups[ev].forEach(m => {
      const idx = matches.indexOf(m);
      const row = document.createElement('div');
      row.className = 'lib-item';
      const sc = m.res === 'W' ? 'var(--green)' : m.res === 'L' ? 'var(--red)' : 'var(--gold)';
      const ath = athletes.find(a => a.id === m.athId);
      const dot = ath ? `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${ath.color};margin-right:3px;vertical-align:middle;flex-shrink:0"></span>` : '';
      row.innerHTML = `<div class="li-thumb">${m.videoURL ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="var(--green)"><polygon points="5 3 19 12 5 21 5 3"/></svg>' : '<svg viewBox="0 0 24 24" width="14" height="14" fill="rgba(255,255,255,.3)"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" fill="rgba(255,255,255,.3)"/></svg>'}</div><div style="flex:1;min-width:0"><div class="li-names">${dot}${m.w1} vs. ${m.w2}</div><div class="li-meta">${m.wt} · ${m.ev}${m.videoURL ? ' · 🎬' : ''}</div></div><div style="text-align:right;flex-shrink:0"><div class="li-score" style="color:${sc}">${m.res} ${m.s1}–${m.s2}</div><div class="li-date">${m.dt}</div></div>`;
      row.onclick = () => openMatch(idx);
      list.appendChild(row);
    });
  });
}

function openMatch(idx) {
  currentMatchIdx = idx;
  const m = matches[idx];
  // Migrate old match objects that lack new fields
  if (!m.stats) m.stats = {};
  if (!m.notes) m.notes = '';
  if (!m.bookmarks) m.bookmarks = [];

  const ath = athletes.find(a => a.id === m.athId);
  document.getElementById('md-title').textContent = m.ev + ' — Film Room';
  document.getElementById('md-w1').textContent = m.w1;
  document.getElementById('md-w2').textContent = m.w2;
  document.getElementById('md-s1').textContent = m.s1;
  document.getElementById('md-s2').textContent = m.s2;
  document.getElementById('md-wt').textContent = m.wt;
  document.getElementById('md-ev').textContent = m.ev;
  document.getElementById('md-dt').textContent = m.dt;
  document.getElementById('vid-match-label').textContent = m.w1 + ' vs. ' + m.w2;
  if (ath) document.getElementById('md-s1').style.color = ath.color;
  const res = document.getElementById('md-res');
  res.textContent = m.res === 'W' ? 'WIN' : m.res === 'L' ? 'LOSS' : 'DRAW';
  res.style.background = m.res === 'W' ? 'rgba(29,185,84,.15)' : m.res === 'L' ? 'rgba(231,76,60,.15)' : 'rgba(240,180,41,.15)';
  res.style.color = m.res === 'W' ? 'var(--green)' : m.res === 'L' ? 'var(--red)' : 'var(--gold)';
  res.style.borderColor = m.res === 'W' ? 'rgba(29,185,84,.3)' : m.res === 'L' ? 'rgba(231,76,60,.3)' : 'rgba(240,180,41,.3)';

  loadMatchVideo(m);
  loadCountersFromMatch(m);
  loadBookmarksFromMatch(m);

  const notesEl = document.getElementById('match-notes-input');
  if (notesEl) notesEl.value = m.notes || '';

  showTab('tc-stats', document.querySelector('.md-tab'));
  go('s-match');
}

/* ── STATS COUNTERS ── */
const ALL_COUNTER_KEYS = [
  'sl-att','sl-sc','hc-att','dl-att','dl-sc','oth-att','oth-sc','fhl','fhl-sc',
  'osl-att','osl-sc','ohc-att','odl-att','odl-sc','ooa','oos','ofhl','ofhl-sc',
  'esc','rev','tbd','su','mr','nfg','rtb',
  'bd','nfa','nfs','mrt','oe','or','rtt'
];

function loadCountersFromMatch(m) {
  const stats = m.stats || {};
  ALL_COUNTER_KEYS.forEach(k => {
    counters[k] = stats[k] || 0;
    const el = document.querySelector('#c-' + k + ' .ctr-val');
    if (el) el.textContent = counters[k];
  });
  updateSummary();
}

function loadBookmarksFromMatch(m) {
  const list = document.getElementById('clips-list');
  list.innerHTML = '';
  const bookmarks = m.bookmarks || [];
  const cols = ['var(--green)', 'var(--blue)', 'var(--gold)', 'var(--red)'];
  bookmarks.forEach((bm, i) => {
    const col = cols[i % cols.length];
    const t = fmt(bm.s);
    const s = bm.s;
    const item = document.createElement('div');
    item.className = 'bookmark-item';
    item.innerHTML = `<div style="width:7px;height:7px;border-radius:50%;background:${col};flex-shrink:0"></div><div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--white)">${bm.label || 'Bookmark at ' + t}</div><div style="font-size:10px;color:var(--text-muted)">${t}</div></div><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--text-muted)" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    item.onclick = () => jumpTo(s);
    list.appendChild(item);
  });
}

function inc(key) {
  if (!counters[key]) counters[key] = 0;
  counters[key]++;
  document.querySelector('#c-' + key + ' .ctr-val').textContent = counters[key];
  updateSummary();
}
function dec(key) {
  if (!counters[key]) counters[key] = 0;
  if (counters[key] > 0) { counters[key]--; document.querySelector('#c-' + key + ' .ctr-val').textContent = counters[key]; }
  updateSummary();
}
function updateSummary() {
  const g = k => (counters[k] || 0);
  const shots = g('sl-att') + g('hc-att') + g('dl-att') + g('oth-att');
  const scores = g('sl-sc') + g('dl-sc') + g('oth-sc') + g('fhl-sc');
  const eff = shots > 0 ? Math.round(scores / shots * 100) : 0;
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('su-eff', eff + '%'); set('su-shots', shots); set('su-scores', scores);
  set('su-esc', g('esc')); set('su-rev', g('rev')); set('su-nfg', g('nfg'));
  set('su-bd', g('bd')); set('su-nfa', g('nfa')); set('su-nfs', g('nfs'));
}

function saveMatchStats() {
  if (currentMatchIdx < 0 || currentMatchIdx >= matches.length) { toast('No match open'); return; }
  matches[currentMatchIdx].stats = Object.assign({}, counters);
  saveData();
  toast('Stats saved!');
}

function exportMatchStats() {
  if (currentMatchIdx < 0) { toast('No match open'); return; }
  const m = matches[currentMatchIdx];
  const g = k => (counters[k] || 0);
  const lines = [
    m.w1 + ' vs ' + m.w2 + ' — ' + m.ev + ' ' + m.dt,
    'Score: ' + m.s1 + '–' + m.s2 + ' ' + (m.res === 'W' ? 'WIN' : m.res === 'L' ? 'LOSS' : 'DRAW'),
    '',
    'NEUTRAL — OUR WRESTLER',
    'Single leg: ' + g('sl-att') + ' att, ' + g('sl-sc') + ' sc',
    'High crotch: ' + g('hc-att') + ' att',
    'Double leg: ' + g('dl-att') + ' att, ' + g('dl-sc') + ' sc',
    'Front HL: ' + g('fhl') + ' att, ' + g('fhl-sc') + ' sc',
    'Other: ' + g('oth-att') + ' att, ' + g('oth-sc') + ' sc',
    '',
    'NEUTRAL — OPPONENT',
    'Opp SL: ' + g('osl-att') + ' att, ' + g('osl-sc') + ' sc',
    'Opp HC: ' + g('ohc-att') + ' att',
    'Opp DL: ' + g('odl-att') + ' att, ' + g('odl-sc') + ' sc',
    'Opp FHL: ' + g('ofhl') + ' att, ' + g('ofhl-sc') + ' sc',
    'Opp Other: ' + g('ooa') + ' att, ' + g('oos') + ' sc',
    '',
    'BOTTOM',
    'Escapes: ' + g('esc') + ', Reversals: ' + g('rev') + ', Standups: ' + g('su'),
    'Broken down: ' + g('tbd') + ', Near falls given: ' + g('nfg'),
    '',
    'TOP',
    'Breakdowns: ' + g('bd') + ', NF att: ' + g('nfa') + ', NF sets: ' + g('nfs'),
    'Mat returns: ' + g('mrt') + ', Opp escapes: ' + g('oe') + ', Opp reversals: ' + g('or'),
  ];
  if (m.notes) lines.push('', 'NOTES: ' + m.notes);
  const text = lines.join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => toast('Stats copied to clipboard!'))
      .catch(() => { toast('Export: see console'); console.log(text); });
  } else {
    toast('Export: see console');
    console.log(text);
  }
}

function saveMatchNotes(notes) {
  if (currentMatchIdx < 0 || currentMatchIdx >= matches.length) return;
  matches[currentMatchIdx].notes = notes;
  saveData();
}

/* ── LIVE SCORING ── */
let rec = false;
function toggleRec() {
  rec = !rec;
  document.getElementById('rec-b').style.display = rec ? 'flex' : 'none';
  document.getElementById('cam-btn').style.background = rec ? '#333' : 'var(--green)';
  document.getElementById('cam-btn').style.borderColor = rec ? '#555' : 'var(--green)';
  toast(rec ? 'Recording started — score below' : 'Recording stopped');
}

let lScores = { r: 0, b: 0 };
let scoreHistory = [];

function liveScore(team, pts) {
  lScores[team] = Math.max(0, lScores[team] + pts);
  scoreHistory.push({ team, pts });
  document.getElementById('sc-' + team).textContent = lScores[team];
  toast('+' + pts + ' pts');
}

function undoLastScore() {
  if (!scoreHistory.length) { toast('Nothing to undo'); return; }
  const last = scoreHistory.pop();
  lScores[last.team] = Math.max(0, lScores[last.team] - last.pts);
  document.getElementById('sc-' + last.team).textContent = lScores[last.team];
  toast('Undone');
}

function resetLiveScoring() {
  lScores = { r: 0, b: 0 };
  scoreHistory = [];
  document.getElementById('sc-r').textContent = '0';
  document.getElementById('sc-b').textContent = '0';
}

function saveLiveMatch(finalize) {
  const athId = parseInt(document.getElementById('live-athlete').value) || (athletes.length ? athletes[0].id : 1);
  const ath = athletes.find(a => a.id === athId);
  const w1 = document.getElementById('nm-r').value.trim() || (ath ? ath.name : 'Home');
  const w2 = document.getElementById('nm-b').value.trim() || 'Opponent';
  const ev = document.getElementById('live-event').value.trim() || 'Live Match';
  const s1 = lScores.r;
  const s2 = lScores.b;
  const res = s1 >= s2 ? 'W' : 'L';
  const wt = ath ? ath.weight + ' lbs' : '133 lbs';
  const dt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  matches.unshift({ w1, w2, wt, ev, dt, s1, s2, res, athId, videoURL: null, stats: {}, notes: '', bookmarks: [] });
  saveData();
  toast('Match saved!');
  if (finalize) {
    resetLiveScoring();
    setTimeout(() => navTo('s-lib', null), 600);
  }
}

function pinLiveMatch(winner) {
  const athId = parseInt(document.getElementById('live-athlete').value) || (athletes.length ? athletes[0].id : 1);
  const ath = athletes.find(a => a.id === athId);
  const w1 = document.getElementById('nm-r').value.trim() || (ath ? ath.name : 'Home');
  const w2 = document.getElementById('nm-b').value.trim() || 'Opponent';
  const ev = document.getElementById('live-event').value.trim() || 'Live Match';
  const s1 = lScores.r;
  const s2 = lScores.b;
  const res = winner === 'home' ? 'W' : 'L';
  const wt = ath ? ath.weight + ' lbs' : '133 lbs';
  const dt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  matches.unshift({ w1, w2, wt, ev, dt, s1, s2, res, athId, videoURL: null, stats: {}, notes: 'Pin fall', bookmarks: [] });
  saveData();
  toast('PIN — ' + (winner === 'home' ? w1 : w2) + ' wins!');
  resetLiveScoring();
  setTimeout(() => navTo('s-lib', null), 800);
}

function setLivePeriod(pp, btn) {
  document.querySelectorAll('.period-bar .f-pill').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('live-period-lbl').textContent = ['OVERTIME', 'PERIOD 1', 'PERIOD 2', 'PERIOD 3'][pp];
}

/* ── NAVIGATION ── */
function go(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 's-home') { buildDashTabs(); renderDash(); }
  if (id === 's-lib') { buildAthleteFilters(); renderLib(); }
  if (id === 's-roster') renderRoster();
  if (id === 's-upload') updateUploadAthSelect();
  if (id === 's-live') updateUploadAthSelect();
}
function navTo(id, btn) {
  go(id);
  document.querySelectorAll('.ni').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
function switchTab(t) {
  document.getElementById('tl').classList.toggle('active', t === 'login');
  document.getElementById('ts').classList.toggle('active', t === 'signup');
  document.getElementById('login-form').style.display = t === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = t === 'signup' ? 'block' : 'none';
}
function showTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.md-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (id === 'tc-summary') updateSummary();
}

/* ── TOAST ── */
function toast(msg) {
  const t = document.getElementById('toast-el');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── AUTH ── */
function friendlyAuthError(code) {
  const msgs = {
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':       'Incorrect password.',
    'auth/invalid-credential':   'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/too-many-requests':    'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-blocked':        'Popup blocked. Please allow popups for this site.',
    'auth/cancelled-popup-request': '',
    'auth/popup-closed-by-user': '',
  };
  return msgs[code] || 'Something went wrong. Please try again.';
}

function showAuthError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el || !msg) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideAuthErrors() {
  ['login-error', 'signup-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function signIn() {
  if (typeof firebase === 'undefined' || !FIREBASE_CONFIGURED) { toast('Firebase not configured yet'); return; }
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  hideAuthErrors();
  if (!email || !password) { showAuthError('login-error', 'Please fill in both fields.'); return; }
  const btn = document.getElementById('login-btn');
  btn.textContent = 'Signing in…'; btn.disabled = true;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => {
      btn.textContent = 'SIGN IN'; btn.disabled = false;
      showAuthError('login-error', friendlyAuthError(err.code));
    });
}

function signUp() {
  if (typeof firebase === 'undefined' || !FIREBASE_CONFIGURED) { toast('Firebase not configured yet'); return; }
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  hideAuthErrors();
  if (!name || !email || !password) { showAuthError('signup-error', 'Please fill in all fields.'); return; }
  const btn = document.getElementById('signup-btn');
  btn.textContent = 'Creating account…'; btn.disabled = true;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(cred => cred.user.updateProfile({ displayName: name }))
    .catch(err => {
      btn.textContent = 'CREATE ACCOUNT'; btn.disabled = false;
      showAuthError('signup-error', friendlyAuthError(err.code));
    });
}

function signInWithGoogle() {
  if (typeof firebase === 'undefined' || !FIREBASE_CONFIGURED) { toast('Firebase not configured yet'); return; }
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .catch(err => {
      const msg = friendlyAuthError(err.code);
      if (msg) toast(msg);
    });
}

function signOut() {
  if (typeof firebase === 'undefined' || !FIREBASE_CONFIGURED) { go('s-login'); return; }
  if (!confirm('Sign out of WrestleScore?')) return;
  firebase.auth().signOut();
}

function resetPassword() {
  if (typeof firebase === 'undefined' || !FIREBASE_CONFIGURED) { toast('Firebase not configured yet'); return; }
  const email = document.getElementById('login-email').value.trim()
    || prompt('Enter your email address:');
  if (!email) return;
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => toast('Password reset email sent!'))
    .catch(err => toast(friendlyAuthError(err.code)));
}

function handleAvatarClick() {
  if (typeof firebase !== 'undefined' && FIREBASE_CONFIGURED && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    const name = user.displayName || user.email;
    if (confirm('Signed in as ' + name + '\n\nSign out?')) signOut();
  } else {
    navTo('s-roster', null);
  }
}

function initApp() {
  loadData();
  updateUploadAthSelect();
  buildDashTabs();
  renderDash();
}

function updateUserAvatar(user) {
  const el = document.getElementById('user-avatar');
  if (!el) return;
  if (user) {
    const initials = user.displayName
      ? user.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : user.email.slice(0, 2).toUpperCase();
    el.textContent = initials;
  } else {
    el.textContent = '?';
  }
}

/* ── INIT ── */
if (typeof firebase !== 'undefined' && FIREBASE_CONFIGURED) {
  // Firebase is configured — use real auth
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      updateUserAvatar(user);
      initApp();
      go('s-home');
    } else {
      // Reset to defaults so stale data isn't visible behind login
      athletes = [...defaultAthletes];
      matches  = [...defaultMatches];
      go('s-login');
    }
  });
} else {
  // Firebase not configured yet — bypass auth for local testing
  initApp();
}

/* ── EXPOSE TO WINDOW (for inline onclick handlers) ── */
Object.assign(window, {
  go, navTo, switchTab, showTab,
  handleVideoUpload, saveUploadedMatch, clearUploadedVideo,
  togglePlay, seekRel, seekTo, jumpTo, addBookmark, toggleFullscreen,
  inc, dec, updateSummary, saveMatchStats, exportMatchStats, saveMatchNotes,
  toggleRec, liveScore, undoLastScore, saveLiveMatch, pinLiveMatch, setLivePeriod,
  renderRoster, setRosterFilter, openAddAthlete, openEditAthlete, saveAthlete, removeAthlete, closeModal,
  buildAthleteFilters, setLibFilter, filterLib, renderLib, openMatch,
  signIn, signUp, signInWithGoogle, signOut, resetPassword, handleAvatarClick,
  toast,
});
