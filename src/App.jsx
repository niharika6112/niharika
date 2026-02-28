import { useState, useEffect, useRef, useCallback } from "react";
import "./BirthdayApp.css";

// ── DATA ──────────────────────────────────────────────
const ROLES = [
  {
    emoji: "💻",
    label: "Aap Mere",
    title: "Developer Hain",
    desc: "Jo meri zindagi ke har bug ko fix karte hain bina ek bhi complain kiye.",
    hover: "Aapne meri life ka code itna beautiful likha hai ki koi error kabhi nahi aata.",
    tag: "My coder 🖤",
  },
  {
    emoji: "🤝",
    label: "Aap Mere",
    title: "Best Friend Hain",
    desc: "Jinse main kuch bhi bol sakti hoon, bina darr ke, bina soche.",
    hover: "Jo meri baat sunte bhi hain aur samajhte bhi hain — bina bole.",
    tag: "My person 💗",
  },
  {
    emoji: "🏠",
    label: "Aap Mere",
    title: "Ghar Hain",
    desc: "Jahan bhi hoon, aapki yaad aate hi wapas ghar jaisi feeling aati hai.",
    hover: "Aapke paas aate hi saari thakan, saara dard door ho jaata hai.",
    tag: "My home 🌹",
  },
  {
    emoji: "☀️",
    label: "Aap Mere",
    title: "Sunshine Hain",
    desc: "Aapki ek smile se mera poora din roshan ho jaata hai — bilkul sunshine ki tarah.",
    hover: "Aap mere sunshine hain — dark mode wali zindagi mein bhi aap sab kuch chamka dete hain.",
    tag: "My light ✨",
  },
  {
    emoji: "🌙",
    label: "Aap Mere",
    title: "Raat Ke Saathi Hain",
    desc: "Late night tak baatein karna — woh moments mujhe sabse zyada pasand hain.",
    hover: "Aapki late night baatein meri favourite routine hain — unke bina raat adhuri lagti hai.",
    tag: "Midnight magic 🌙",
  },
  {
    emoji: "💪",
    label: "Aap Mere",
    title: "Support System Hain",
    desc: "Har mushkil mein saath khade rehte hain — yahi aapko sabse special banata hai.",
    hover: "Aapke hote hue koi mushkil, mushkil nahi lagti.",
    tag: "My rock 💪",
  },
];

// ── IMAGE PATHS ───────────────────────────────────────
// Images are in: public/img1.jpeg, img2.jpeg ... img8.jpeg
// React serves public/ at root, so path = "/img1.jpeg"
const BANNER_IMG = "/img1.jpeg";

const GALLERY_QUOTES = [
  { quote: "Aap meri favourite notification hain — jab bhi ping aata hai, sab kuch ruk jaata hai.", tag: "My priority 💗",   img: "/img2.jpeg" },
  { quote: "Late night mein aapki awaaz sunke lagta hai ki raat bhi khubsoorat hoti hai.",           tag: "Midnight magic 🌙", img: "/img3.jpeg" },
  { quote: "Aapki ek smile compile karo toh saari duniya ki khushi mil jaaye.",                       tag: "My sunshine ☀️",   img: "/img7.jpeg" },
  { quote: "Aapko samajhna nahi padta — aap automatically mujhe samajh lete hain.",                  tag: "Bina bole 💜",      img: "/img5.jpeg" },
  { quote: "Mushkil mein aap hamesha saath the — yahi aapki sabse badi coding skill hai.",            tag: "My rock 💪",        img: "/img6.jpeg" },
  { quote: "Aap mera ghar hain — jahan bhi hoon, aapki yaad aate hi safe feel hota hai.",             tag: "Mera ghar 🏠",      img: "/img4.jpeg" },
];

const WISHES = [
  "Endless Happiness ✨","Bug-free Life 💻","Har Sapna Poora Ho 🌙",
  "Hamara Saath Hamesha 🖤","Zero Stack Overflow ⚡","Sabse Best Year 🎉",
  "Health & Khushi 💪","Dream Job Mile 🚀","Late Night Talks Forever 🌙",
  "Humara Saath Hamesha 💑","Shine Karte Rahein ☀️","Bahut Sara Pyar 💕",
];

const HEART_EMOJIS = ["💗","🌹","✨","💕","🖤","💖","🌸"];

// ── MUSIC NOTES ───────────────────────────────────────
const HBD_NOTES = [
  [261.63,.3],[261.63,.15],[293.66,.45],[261.63,.45],[349.23,.45],[329.63,.9],
  [261.63,.3],[261.63,.15],[293.66,.45],[261.63,.45],[392.00,.45],[349.23,.9],
  [261.63,.3],[261.63,.15],[523.25,.45],[440.00,.45],[349.23,.45],[329.63,.45],[293.66,.9],
  [466.16,.3],[466.16,.15],[440.00,.45],[349.23,.45],[392.00,.45],[349.23,1.1],
];
const ROMANTIC_NOTES = [
  [392.00,.5],[440.00,.5],[493.88,.5],[523.25,.5],[587.33,.5],[523.25,.5],
  [493.88,.5],[440.00,.5],[392.00,.7],[369.99,.3],[392.00,.5],
  [440.00,.5],[493.88,.5],[523.25,.7],[493.88,.3],[440.00,.5],
  [392.00,.5],[349.23,.5],[392.00,.5],[440.00,.7],[392.00,.5],
  [440.00,.5],[493.88,.5],[523.25,.5],[587.33,.7],[523.25,.5],[493.88,.5],
  [440.00,.5],[392.00,.5],[349.23,.7],[329.63,.3],[349.23,.5],
  [392.00,.5],[440.00,.5],[392.00,.7],[349.23,.3],[329.63,.5],
  [293.66,.5],[329.63,.5],[349.23,.5],[392.00,1.0],
];

// ── HOOKS ────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useMusic() {
  const ctxRef      = useRef(null);
  const gainRef     = useRef(null);
  const intervalRef = useRef(null);
  const schedRef    = useRef(0);
  const idxRef      = useRef(0);
  const phaseRef    = useRef("hbd");
  const [playing, setPlaying] = useState(false);

  const initAudio = () => {
    if (!ctxRef.current) {
      ctxRef.current  = new (window.AudioContext || window.webkitAudioContext)();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
      gainRef.current.connect(ctxRef.current.destination);
    }
  };

  const playNote = (freq, when, dur) => {
    const ctx  = ctxRef.current;
    const gain = gainRef.current;
    const osc  = ctx.createOscillator();
    const env  = ctx.createGain();
    const vib  = ctx.createOscillator();
    const vibG = ctx.createGain();
    vib.frequency.value = 5.5; vibG.gain.value = 3;
    vib.connect(vibG); vibG.connect(osc.frequency);
    vib.start(when); vib.stop(when + dur + .1);
    osc.connect(env); env.connect(gain);
    osc.type = "sine"; osc.frequency.setValueAtTime(freq, when);
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(0.22, when + .04);
    env.gain.linearRampToValueAtTime(0.13, when + dur * .7);
    env.gain.linearRampToValueAtTime(0, when + dur);
    osc.start(when); osc.stop(when + dur + .05);
    const osc2 = ctx.createOscillator(), env2 = ctx.createGain();
    osc2.connect(env2); env2.connect(gain);
    osc2.type = "sine"; osc2.frequency.setValueAtTime(freq * .5, when);
    env2.gain.setValueAtTime(0, when);
    env2.gain.linearRampToValueAtTime(0.07, when + .06);
    env2.gain.linearRampToValueAtTime(0, when + dur);
    osc2.start(when); osc2.stop(when + dur + .05);
  };

  const schedule = useCallback(() => {
    const ctx    = ctxRef.current;
    const melody = phaseRef.current === "hbd" ? HBD_NOTES : ROMANTIC_NOTES;
    while (schedRef.current < ctx.currentTime + 1.8) {
      const note = melody[idxRef.current % melody.length];
      playNote(note[0], schedRef.current, note[1]);
      schedRef.current += note[1] + .03;
      idxRef.current++;
      if (phaseRef.current === "hbd" && idxRef.current >= HBD_NOTES.length) {
        phaseRef.current = "romantic"; idxRef.current = 0;
      }
    }
  }, []);

  const start = useCallback(() => {
    initAudio();
    const ctx = ctxRef.current;
    gainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    gainRef.current.gain.setValueAtTime(0, ctx.currentTime);
    gainRef.current.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 1.5);
    schedRef.current    = ctx.currentTime + .1;
    schedule();
    intervalRef.current = setInterval(schedule, 500);
    setPlaying(true);
  }, [schedule]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
      gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + .6);
    }
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => { playing ? stop() : start(); }, [playing, start, stop]);

  useEffect(() => {
    let started = false;
    const tryStart = () => {
      if (started) return;
      started = true;
      start();
      ["click","touchstart","scroll","keydown"].forEach(ev =>
        document.removeEventListener(ev, tryStart)
      );
    };
    setTimeout(() => { try { start(); started = true; } catch(e) {} }, 300);
    ["click","touchstart","scroll","keydown"].forEach(ev =>
      document.addEventListener(ev, tryStart, { passive: true })
    );
    return () => {
      ["click","touchstart","scroll","keydown"].forEach(ev =>
        document.removeEventListener(ev, tryStart)
      );
      stop();
    };
  }, []);

  return { playing, toggle };
}

// ── COMPONENTS ───────────────────────────────────────
function FloatingPetals() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c   = canvasRef.current;
    const ctx = c.getContext("2d");
    let W, H, petals = [], raf;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", resize); resize();
    const spawn = () => petals.push({
      x: Math.random() * W, y: -20,
      r: Math.random() * 8 + 4,
      vx: (Math.random() - .5) * 1.2,
      vy: Math.random() * 1.5 + .7,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .04,
      opacity: Math.random() * .45 + .18,
      hue: Math.random() * 20 + 340,
    });
    const spawnInt = setInterval(spawn, 200);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      petals = petals.filter(p => p.y < H + 30);
      petals.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vx += Math.sin(p.angle) * .02;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = p.opacity;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .6, 0, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r);
        g.addColorStop(0, `hsla(${p.hue},75%,70%,1)`);
        g.addColorStop(1, `hsla(${p.hue},60%,55%,.2)`);
        ctx.fillStyle = g; ctx.fill(); ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      clearInterval(spawnInt);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="petal-canvas" />;
}

function FloatingHeart({ x, y, emoji, duration }) {
  return (
    <div
      className="floating-heart"
      style={{ left: x, top: y, animationDuration: `${duration}s`, fontSize: `${14 + Math.random() * 14}px` }}
    >
      {emoji}
    </div>
  );
}

function MusicBtn({ playing, onToggle }) {
  return (
    <div className="music-btn-wrap">
      <div className="music-label">{playing ? "♪ Playing — click to pause" : "♪ Click to play music"}</div>
      <button className={`music-btn ${playing ? "playing" : ""}`} onClick={onToggle}>
        {playing ? "⏸" : "🎵"}
      </button>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-tag animate-rise delay-1">Niharika &nbsp;✦&nbsp; Suraj &nbsp;✦&nbsp; Always</div>
      <div className="hero-divider animate-rise delay-2">
        <div className="hdline" />
        <span className="hdline-heart">🖤</span>
        <div className="hdline" />
      </div>
      <h1 className="hero-title animate-rise delay-3">Happy Birthday</h1>
      <div className="hero-name animate-rise delay-4">Mere Suraj 🌹</div>
      <p className="hero-quote animate-rise delay-5">
        "Aap sirf ek insaan nahi hain mere liye — aap mera ek poora universe hain,<br />
        jisme main hamesha khoyi rehna chahti hoon."
      </p>
      <div className="hero-scroll animate-rise delay-6">
        <span>Scroll</span>
        <div className="scroll-bar" />
      </div>
    </section>
  );
}

function RoleCard({ role, index }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className={`role-card ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="role-emoji">{role.emoji}</span>
      <div className="role-label">{role.label}</div>
      <div className="role-title">{role.title}</div>
      <div className="role-desc">{role.desc}</div>
      <div className={`role-hover-quote ${hovered ? "show" : ""}`}>
        <div className="rhq-heart">💗</div>
        <div className="rhq-text">"{role.hover}"</div>
        <div className="rhq-tag">— Niharika 🖤 &nbsp;|&nbsp; {role.tag}</div>
      </div>
    </div>
  );
}

function AapMereSection() {
  const [ref, visible] = useInView();
  return (
    <section className={`tumera-section reveal ${visible ? "visible" : ""}`} ref={ref}>
      <div className="sec-eyebrow">Because you are everything</div>
      <div className="sec-title">Aap Mere ___ Hain</div>
      <div className="sec-orn"><div className="sec-orn-line" /><span>✦</span><div className="sec-orn-line" /></div>
      <div className="cards-grid">
        {ROLES.map((r, i) => <RoleCard key={i} role={r} index={i} />)}
      </div>
    </section>
  );
}

// ── BANNER ── img1.jpeg pre-loaded, click to change ──
function Banner() {
  const [ref, visible] = useInView();
  const [img, setImg]  = useState(BANNER_IMG);
  const inputRef       = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <section className={`banner-section reveal ${visible ? "visible" : ""}`} ref={ref}>
      <div className="banner-wrap">
        <div className="banner-glow" />
        <div className="banner-inner" onClick={() => inputRef.current.click()}>
          <img
            src={img}
            className="banner-img-el"
            alt="Our Banner"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="banner-caption">Suraj &amp; Niharika — Hamesha 🖤</div>
          <div className="banner-change-hint">📷 Click to change</div>
        </div>
        <div className="co tl" /><div className="co tr" />
        <div className="co bl" /><div className="co br" />
        <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile} />
      </div>
    </section>
  );
}

// ── GALLERY ITEM ── img2–img7 pre-loaded ─────────────
function GalleryItem({ q, index }) {
  const [img, setImg]         = useState(q.img);
  const [hovered, setHovered] = useState(false);
  const inputRef              = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`gi ${index === 0 ? "gi-tall" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`gi-bg ${hovered ? "zoomed" : ""}`}>
        <img
          src={img}
          className="gi-img"
          alt={`memory ${index + 1}`}
          title="Click to change photo"
          onClick={() => inputRef.current.click()}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>
      <div className={`gi-overlay ${hovered ? "show" : ""}`}>
        <div className="ov-heart">💗</div>
        <div className="ov-quote">"{q.quote}"</div>
        <div className="ov-tag">{q.tag}</div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display:"none" }}
        onChange={handleFile}
      />
    </div>
  );
}

function Gallery() {
  const [ref, visible] = useInView();
  return (
    <section className={`gallery-section reveal ${visible ? "visible" : ""}`} ref={ref}>
      <div className="sec-header">
        <div className="sec-eyebrow">Our memories</div>
        <div className="sec-title">Woh Pal Jo Dil Mein Hain</div>
        <div className="sec-orn"><div className="sec-orn-line" /><span>✦</span><div className="sec-orn-line" /></div>
        <div className="gallery-hint">Har photo pe hover karein aur pyar mahsoos karein 💕</div>
      </div>
      <div className="gallery-grid">
        {GALLERY_QUOTES.map((q, i) => <GalleryItem key={i} q={q} index={i} />)}
      </div>
    </section>
  );
}

function LoveLetter() {
  const [ref, visible] = useInView();
  return (
    <section className={`letter-section reveal ${visible ? "visible" : ""}`} ref={ref}>
      <div className="letter-card">
        <div className="letter-from">✦ Niharika ke dil ki baat ✦</div>
        <div className="letter-body">
          Mere pyaare Suraj, <br /><br />
          Aaj aapka birthday hai — aur main chahti hoon ki aap jaanein ki{" "}
          <span className="hl">aap mere liye kitne important hain</span>.<br /><br />
          Aap mere developer hain jo meri zindagi ke har ek bug ko silently fix karte rehte hain.
          Aap mere best friend hain jinse main kuch bhi bol sakti hoon —{" "}
          <span className="hl">bina filter ke, bina darr ke</span>.<br /><br />
          Aapki late night baatein, aapki care, aapka "sab theek ho jaayega" sunna —
          yeh sab mere liye <span className="hl">sabse badi luxury hai</span> is duniya mein.<br /><br />
          Aap mere sunshine hain jo dark mode wali zindagi mein bhi sab kuch chamka dete hain.
          Aur aap mera ghar hain —{" "}
          <span className="hl">jahan bhi hoon, aapki yaad aate hi safe feel hota hai</span>.<br /><br />
          Happy Birthday, Suraj.<br />
          Aapki har ek wish poori ho —{" "}
          <span className="hl">bina kisi error ke, bina kisi exception ke</span>. 🖤
        </div>
        <div className="letter-sign">— Aapki Niharika 🌹</div>
      </div>
    </section>
  );
}

function Wishes() {
  const [ref, visible] = useInView();
  return (
    <section className={`wishes-section reveal ${visible ? "visible" : ""}`} ref={ref}>
      <div className="sec-eyebrow">For my birthday boy</div>
      <div className="sec-title wishes-title">Meri Duaaein Aapke Liye</div>
      <div className="cake">🎂</div>
      <div className="wish-tags">
        {WISHES.map((w, i) => <div key={i} className="wtag">{w}</div>)}
      </div>
    </section>
  );
}

// ── MAIN APP ─────────────────────────────────────────
export default function BirthdayApp() {
  const { playing, toggle } = useMusic();
  const [hearts, setHearts] = useState([]);

  const spawnHeart = useCallback((x, y) => {
    const id       = Date.now() + Math.random();
    const emoji    = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    const duration = 1.2 + Math.random() * .8;
    setHearts(h => [...h, { id, x, y, emoji, duration }]);
    setTimeout(() => setHearts(h => h.filter(hh => hh.id !== id)), duration * 1000 + 100);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      spawnHeart(Math.random() * window.innerWidth, window.innerHeight - 20);
    }, 900);
    return () => clearInterval(iv);
  }, [spawnHeart]);

  const handleClick = useCallback((e) => {
    spawnHeart(e.clientX, e.clientY);
    // CSS-transition firework
    const colors = ["#c9856b","#e8a898","#d4a574","#f0e6d3","#8b4a36"];
    const fw = document.createElement("div");
    fw.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:9999`;
    document.body.appendChild(fw);
    for (let i = 0; i < 14; i++) {
      const s   = document.createElement("div");
      const ang = (i / 14) * Math.PI * 2;
      const d   = 36 + Math.random() * 50;
      s.style.cssText = `position:absolute;width:5px;height:5px;border-radius:50%;background:${colors[~~(Math.random()*colors.length)]};left:0;top:0;transition:transform .6s ease,opacity .6s ease`;
      fw.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${Math.cos(ang)*d}px,${Math.sin(ang)*d}px)`;
        s.style.opacity   = "0";
      });
    }
    setTimeout(() => fw.remove(), 700);
  }, [spawnHeart]);

  return (
    <div className="app" onClick={handleClick}>
      <FloatingPetals />
      {hearts.map(h => <FloatingHeart key={h.id} {...h} />)}
      <MusicBtn playing={playing} onToggle={toggle} />
      <Hero />
      <AapMereSection />
      <div className="divider-orn">✦</div>
      <Banner />
      <div className="divider-orn">✦</div>
      <Gallery />
      <div className="divider-orn">✦</div>
      <LoveLetter />
      <Wishes />
      <footer className="footer">
        <div className="footer-hearts">🖤 🌹 🖤</div>
        <div className="footer-txt">Made with all my love — Niharika for Suraj • Happy Birthday 🎂</div>
      </footer>
    </div>
  );
}