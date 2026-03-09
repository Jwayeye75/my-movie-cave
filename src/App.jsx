import { useState, useEffect, useCallback, useRef } from "react";

// ── SUPABASE CONFIG ──
const SUPA_URL = "https://swffxskcxjmhjujcypnj.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZmZ4c2tjeGptaGp1amN5cG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODAxNTIsImV4cCI6MjA4ODU1NjE1Mn0.NE0wtXn8sep0bMaW4jvoO0THFP3IzY4M8OulPRQx4r0";

const supa = async (path, options = {}) => {
  const res = await fetch(`${SUPA_URL}/rest/v1${path}`, {
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${options.token || SUPA_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) { const e = await res.json(); throw e; }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const supaAuth = async (path, body) => {
  const res = await fetch(`${SUPA_URL}/auth/v1${path}`, {
    method: "POST",
    headers: { "apikey": SUPA_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

// ── TMDB CONFIG ──
const API_KEY = "2ad80e87ce3e11b9199e73ded658250d";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";
const APP_NAME = "APEX CINEMA";

const tmdb = async (path, params = {}) => {
  const q = new URLSearchParams({ api_key: API_KEY, language: "en-US", ...params });
  const r = await fetch(`${BASE}${path}?${q}`);
  if (!r.ok) throw new Error("TMDB error");
  return r.json();
};

// ── STYLES ──
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;--surface:#12121a;--surface2:#1a1a26;--border:#2a2a3d;
  --ink:#f0f0ff;--ink2:#0d0d14;--text2:#9090b0;--muted:#55557a;
  --blue:#7c3aed;--blue2:#8b5cf6;--blue3:#6d28d9;--blue-light:#1e1030;
  --gold:#f59e0b;--green:#22c55e;--red:#ef4444;--nav-h:64px;--r:8px;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;overflow-x:hidden;min-height:100vh}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:#3a3a5c;border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#6b6b99}

/* PARTICLES */
.particles{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.particle{position:absolute;border-radius:50%;background:rgba(124,58,237,0.08);animation:floatUp linear infinite}
@keyframes floatUp{0%{transform:translateY(110vh) scale(0);opacity:0}8%{opacity:1}92%{opacity:.4}100%{transform:translateY(-80px) scale(1.5);opacity:0}}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--nav-h);display:flex;align-items:center;background:var(--ink2);}
.nav-logo{display:flex;align-items:center;gap:10px;padding:0 24px;height:100%;cursor:pointer;flex-shrink:0;border-right:1px solid rgba(255,255,255,.08);}
.nav-logo:hover .logo-img{transform:scale(1.08) rotate(-5deg)}
.nav-logo .logo-img{transition:transform .2s;box-shadow:0 0 14px rgba(124,58,237,.4)}
.nav-logo-text{font-family:'Bebas Neue',sans-serif;font-size:1.15rem;letter-spacing:3px;color:#fff;white-space:nowrap}
.nav-links{display:flex;align-items:center;height:100%;padding:0 8px}
.nav-link{font-size:.82rem;font-weight:500;color:rgba(255,255,255,.55);background:none;border:none;padding:0 16px;height:100%;cursor:pointer;transition:color .18s;display:flex;align-items:center;border-bottom:3px solid transparent;white-space:nowrap;}
.nav-link:hover{color:#fff}
.nav-link.active{color:#fff;border-bottom-color:var(--blue)}
.nav-right{display:flex;align-items:center;gap:8px;padding:0 20px;margin-left:auto}
.nav-search-pill{display:flex;align-items:center;gap:7px;font-size:.8rem;font-weight:500;background:rgba(255,255,255,.09);color:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:7px 16px;cursor:pointer;transition:all .2s;}
.nav-search-pill:hover{background:rgba(255,255,255,.16);color:#fff}
.nav-badge{background:var(--blue);color:#fff;font-size:.62rem;font-weight:800;padding:2px 7px;border-radius:10px;margin-left:3px}
.nav-user-btn{display:flex;align-items:center;gap:7px;font-size:.8rem;font-weight:600;background:rgba(255,255,255,.09);color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:7px 14px;cursor:pointer;transition:all .2s;}
.nav-user-btn:hover{background:rgba(255,255,255,.16)}
.nav-avatar{width:26px;height:26px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:800;color:#fff;flex-shrink:0}
.nav-login-btn{background:var(--blue);color:#fff;border:none;border-radius:20px;font-size:.8rem;font-weight:700;padding:8px 18px;cursor:pointer;transition:all .2s;}
.nav-login-btn:hover{background:var(--blue3)}

/* PAGE */
.page{min-height:100vh;padding-top:var(--nav-h);animation:pageIn .35s cubic-bezier(.22,1,.36,1) both}
@keyframes pageIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* AUTH MODAL */
.auth-overlay{position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.7);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.auth-box{width:100%;max-width:420px;background:var(--surface);border-radius:16px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.3);border:1px solid var(--border);animation:modalIn .3s cubic-bezier(.22,1,.36,1)}
@keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
.auth-head{background:var(--ink2);padding:28px 28px 24px;text-align:center}
.auth-logo{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:16px}
.auth-logo-icon{width:40px;height:40px;border-radius:10px;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 20px rgba(37,99,235,.5)}
.auth-logo-text{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:3px;color:#fff}
.auth-title{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:4px}
.auth-sub{font-size:.82rem;color:rgba(255,255,255,.4)}
.auth-body{padding:28px}
.auth-tabs{display:flex;background:var(--surface2);border-radius:var(--r);overflow:hidden;margin-bottom:24px;border:1px solid var(--border)}
.auth-tab{flex:1;font-size:.84rem;font-weight:700;padding:10px;border:none;background:none;color:var(--text2);cursor:pointer;transition:all .2s}
.auth-tab.active{background:var(--blue);color:#fff}
.auth-field{margin-bottom:16px}
.auth-label{font-size:.74rem;font-weight:700;letter-spacing:.5px;color:var(--text2);margin-bottom:6px;display:block}
.auth-input{width:100%;padding:12px 14px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--r);font-family:'Inter',sans-serif;font-size:.9rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s}
.auth-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.auth-input::placeholder{color:var(--muted)}
.auth-btn{width:100%;padding:13px;background:var(--blue);color:#fff;border:none;border-radius:var(--r);font-family:'Inter',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;transition:all .22s;margin-top:4px}
.auth-btn:hover{background:var(--blue3);transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,99,235,.3)}
.auth-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
.auth-error{background:#fef2f2;border:1px solid #fecaca;border-radius:var(--r);padding:10px 14px;font-size:.82rem;color:var(--red);margin-bottom:14px}
.auth-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--r);padding:10px 14px;font-size:.82rem;color:var(--green);margin-bottom:14px}
.auth-close{position:absolute;top:16px;right:16px;background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.6);width:30px;height:30px;border-radius:6px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .2s}
.auth-close:hover{background:var(--red);color:#fff}

/* HERO */
.hero-banner{position:relative;overflow:hidden;padding:56px 64px 60px;background:var(--ink2);min-height:300px;display:flex;flex-direction:column;justify-content:center}
.hero-banner-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.25;transition:background-image .6s}
.hero-banner-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(20,20,20,.97) 28%,rgba(20,20,20,.65) 65%,rgba(20,20,20,.3))}
.hero-content{position:relative;z-index:2;max-width:680px}
.hero-tag{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:.68rem;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.38)}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--red);flex-shrink:0;animation:livePulse 1.6s ease infinite}
@keyframes livePulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%{box-shadow:0 0 0 9px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
.hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.4rem,5vw,3.8rem);letter-spacing:2px;color:#fff;line-height:1;margin-bottom:8px}
.hero-sub{font-size:.9rem;color:rgba(255,255,255,.4);margin-bottom:28px}
.hero-search-wrap{position:relative;max-width:580px}
.hero-search-input{width:100%;padding:15px 130px 15px 50px;background:#fff;border:none;border-radius:30px;font-family:'Inter',sans-serif;font-size:.95rem;color:var(--ink);outline:none;box-shadow:0 4px 24px rgba(0,0,0,.35)}
.hero-search-input::placeholder{color:var(--muted)}
.hero-search-ico{position:absolute;left:17px;top:50%;transform:translateY(-50%);font-size:1rem;color:var(--muted);pointer-events:none}
.hero-search-btn{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:var(--blue);color:#fff;border:none;border-radius:24px;font-size:.8rem;font-weight:700;padding:9px 22px;cursor:pointer;transition:all .2s}
.hero-search-btn:hover{background:var(--blue3)}
.hero-dots{position:absolute;bottom:18px;right:60px;z-index:3;display:flex;gap:6px}
.hero-dot{width:22px;height:3px;border-radius:2px;background:rgba(255,255,255,.2);cursor:pointer;transition:all .3s}
.hero-dot.active{background:var(--blue);width:34px}

/* TAB BAR */
.tab-bar{display:flex;align-items:center;border-bottom:1px solid var(--border);background:var(--surface);padding:0 48px;position:sticky;top:var(--nav-h);z-index:100;overflow-x:auto;scrollbar-width:none}
.tab-bar::-webkit-scrollbar{display:none}
.tab-label{font-size:.9rem;font-weight:800;color:var(--ink);padding:0 16px 0 0;white-space:nowrap;flex-shrink:0}
.tab-label-dark{color:#fff}
.tab{font-size:.82rem;font-weight:600;color:var(--text2);background:none;border:none;padding:16px 16px;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-1px;transition:color .18s;white-space:nowrap;flex-shrink:0}
.tab:hover{color:var(--ink)}
.tab.active{color:var(--blue2);border-bottom-color:var(--blue2)}
.tab-dark{color:rgba(255,255,255,.45)}
.tab-dark:hover{color:#fff}
.tab-dark.active{color:#fff;border-bottom-color:#fff}
.tab-spacer{flex:1}
.tab-all{font-size:.75rem;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text2);background:none;border:none;cursor:pointer;white-space:nowrap;transition:color .2s;display:flex;align-items:center;gap:4px}
.tab-all:hover{color:var(--blue)}
.tab-all-dark{color:rgba(255,255,255,.35)}
.tab-all-dark:hover{color:#fff}

/* SECTIONS */
.section{padding:36px 48px}
.section-dark{background:var(--ink2)}
.sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.sec-title{font-size:1.2rem;font-weight:800;color:var(--ink)}
.sec-title-dark{color:#fff}
.sec-sub{font-size:.75rem;color:var(--text2);margin-top:2px}
.see-all{font-size:.74rem;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--blue);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;transition:gap .2s}
.see-all:hover{gap:8px}

/* HORIZONTAL SCROLL */
.hrow-wrap{position:relative;padding:0 2px}
.hrow{display:flex;gap:14px;overflow-x:auto;padding-bottom:10px;scroll-snap-type:x mandatory;scrollbar-width:none}
.hrow::-webkit-scrollbar{display:none}
.arr{position:absolute;top:36%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:var(--surface);border:1px solid var(--border);color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;font-size:15px;box-shadow:0 2px 12px rgba(0,0,0,.1);transition:all .2s}
.arr:hover{background:var(--blue);color:#fff;border-color:var(--blue)}
.arr-dark{background:#1e1e1e;border-color:#333;color:#fff}
.arr-dark:hover{background:var(--blue);border-color:var(--blue)}
.arr.l{left:-16px}
.arr.r{right:-16px}

/* POSTER CARD */
.pcard{flex-shrink:0;width:158px;border-radius:var(--r);overflow:hidden;background:var(--surface);box-shadow:0 2px 8px rgba(0,0,0,.4);cursor:pointer;scroll-snap-align:start;transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s;animation:cardRise .4s ease both;border:1px solid var(--border)}
@keyframes cardRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.pcard:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 18px 40px rgba(124,58,237,.25);border-color:var(--blue)}
.pcard-dark{background:var(--surface2);border-color:var(--border)}
.pcard-dark:hover{border-color:var(--blue)}
.pcard-img{position:relative;padding-top:150%;overflow:hidden;background:#1a1a2e}
.pcard-dark .pcard-img{background:#1a1a2e}
.pcard-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .4s}
.pcard:hover .pcard-img img{transform:scale(1.07)}
.pcard-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 55%);opacity:0;transition:opacity .28s;display:flex;flex-direction:column;justify-content:flex-end;padding:12px}
.pcard:hover .pcard-overlay{opacity:1}
.pcard-play{align-self:center;width:40px;height:40px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;margin-bottom:4px;transform:scale(.7);transition:transform .28s;box-shadow:0 4px 14px rgba(37,99,235,.5)}
.pcard:hover .pcard-play{transform:scale(1)}
.pcard-type{position:absolute;top:8px;left:8px;font-size:.56rem;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:3px 7px;border-radius:4px;background:rgba(0,0,0,.82);color:#fff}
.ring-wrap{position:absolute;bottom:-18px;left:10px;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.ring-inner{width:30px;height:30px;border-radius:50%;background:#0d0d0d;display:flex;align-items:center;justify-content:center;font-size:.56rem;font-weight:800;color:#fff}
.pcard-dark .ring-inner{background:#1a1a1a}
.pcard-meta{padding:26px 10px 6px}
.pcard-name{font-weight:700;font-size:.82rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
.pcard-dark .pcard-name{color:var(--ink)}
.pcard-date{font-size:.72rem;color:var(--text2);padding-bottom:10px}
.pcard-dark .pcard-date{color:var(--text2)}
.no-img{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2.2rem;color:#444}

/* TWO COL */
.two-col{display:grid;grid-template-columns:1fr 340px;gap:28px;padding:36px 48px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:22px;overflow:hidden}
.panel-title{font-size:.95rem;font-weight:800;color:var(--ink);margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)}
.list-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all .2s}
.list-item:last-child{border-bottom:none}
.list-item:hover{transform:translateX(5px)}
.list-num{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:var(--border);width:24px;flex-shrink:0;text-align:center;line-height:1}
.list-thumb{width:54px;height:78px;border-radius:5px;object-fit:cover;flex-shrink:0;background:var(--surface2)}
.list-info{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}
.list-name{font-weight:700;font-size:.85rem;color:var(--ink);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.list-meta{font-size:.72rem;color:var(--text2);display:flex;gap:8px;align-items:center}
.list-rating{color:var(--gold);font-weight:700}

/* CTA SECTION */
.cta-section{position:relative;overflow:hidden;min-height:520px;display:flex;flex-direction:column;justify-content:center;background:var(--ink2)}
.cta-bg-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,1fr);gap:3px;opacity:.18}
.cta-bg-cell{overflow:hidden;background:#111}
.cta-bg-cell img{width:100%;height:100%;object-fit:cover;filter:saturate(.4) contrast(1.1)}
.cta-bg-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,10,15,.96) 0%,rgba(10,10,15,.78) 50%,rgba(124,58,237,.18) 100%)}
.cta-grain{position:absolute;inset:0;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:grainAnim 0.4s steps(2) infinite}
@keyframes grainAnim{0%{transform:translate(0,0)}25%{transform:translate(-2px,2px)}50%{transform:translate(2px,-1px)}75%{transform:translate(-1px,-2px)}100%{transform:translate(0,0)}}
.cta-shape{position:absolute;border-radius:50%;filter:blur(60px);animation:shapeFloat ease-in-out infinite alternate}
@keyframes shapeFloat{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-30px) scale(1.1)}}
.cta-inner{position:relative;z-index:2;padding:64px;display:flex;flex-direction:column;align-items:center;text-align:center}
.cta-tag{display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;font-size:.68rem;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.38);border:1px solid rgba(255,255,255,.1);padding:7px 16px;border-radius:20px;background:rgba(255,255,255,.04)}
.cta-tag-dot{width:6px;height:6px;border-radius:50%;background:var(--blue);animation:livePulse 2s ease infinite}
.cta-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.8rem,6vw,5rem);letter-spacing:2px;color:#fff;line-height:1;margin-bottom:16px;animation:textGlow 3s ease-in-out infinite alternate}
@keyframes textGlow{0%{text-shadow:none}100%{text-shadow:0 0 40px rgba(124,58,237,.5)}}
.cta-title span{color:var(--blue)}
.cta-desc{font-size:1rem;color:rgba(255,255,255,.45);line-height:1.8;max-width:560px;margin-bottom:40px}
.cta-cards{display:flex;gap:18px;margin-bottom:44px;flex-wrap:wrap;justify-content:center;width:100%;max-width:860px}
.cta-card{flex:1;min-width:220px;max-width:260px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px 20px;text-align:left;transition:all .3s;animation:cardFloat ease-in-out infinite alternate}
@keyframes cardFloat{0%{transform:translateY(0)}100%{transform:translateY(-8px)}}
.cta-card:hover{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.4);transform:translateY(-12px)!important;box-shadow:0 16px 40px rgba(124,58,237,.25)}
.cta-card-icon{font-size:1.8rem;margin-bottom:14px;display:block}
.cta-card-title{font-weight:800;font-size:.92rem;color:#fff;margin-bottom:8px}
.cta-card-text{font-size:.8rem;color:rgba(255,255,255,.42);line-height:1.65}
.marquee-wrap{width:100%;overflow:hidden;margin-bottom:36px;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:14px 0}
.marquee{display:flex;animation:marquee 30s linear infinite;width:max-content}
.marquee:hover{animation-play-state:paused}
.marquee-item{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:4px;color:rgba(255,255,255,.18);white-space:nowrap;padding:0 28px}
.marquee-item span{color:var(--blue);margin-right:28px}
.cta-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
.btn-blue{display:flex;align-items:center;gap:8px;background:var(--blue);color:#fff;font-weight:700;font-size:.88rem;padding:14px 32px;border:none;border-radius:30px;cursor:pointer;transition:all .25s;box-shadow:0 4px 20px rgba(37,99,235,.4)}
.btn-blue:hover{background:var(--blue3);transform:translateY(-3px);box-shadow:0 8px 32px rgba(37,99,235,.55)}
.btn-outline{display:flex;align-items:center;gap:8px;background:transparent;color:#fff;font-weight:600;font-size:.88rem;padding:14px 32px;border:1px solid rgba(255,255,255,.2);border-radius:30px;cursor:pointer;transition:all .25s}
.btn-outline:hover{border-color:#fff;background:rgba(255,255,255,.07)}

/* FOOTER */
.footer{background:var(--ink);padding:40px 48px 28px;border-top:1px solid #1e1e1e}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;margin-bottom:36px}
.footer-logo{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.footer-logo-icon{width:32px;height:32px;border-radius:7px;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:15px}
.footer-logo-text{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:3px;color:#fff}
.footer-tagline{font-size:.82rem;color:rgba(255,255,255,.35);line-height:1.7;max-width:260px}
.footer-col-title{font-size:.72rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:14px}
.footer-link{display:block;font-size:.82rem;color:rgba(255,255,255,.42);margin-bottom:9px;cursor:pointer;transition:color .2s}
.footer-link:hover{color:var(--blue)}
.footer-bottom{border-top:1px solid rgba(255,255,255,.07);padding-top:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-copy{font-size:.75rem;color:rgba(255,255,255,.25)}
.footer-tmdb{background:var(--blue);color:#fff;font-size:.6rem;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:1px}

/* BROWSE */
.browse-top{background:var(--ink2);padding:36px 48px 28px}
.browse-h1{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:2px;color:#fff;margin-bottom:5px}
.browse-sub{color:rgba(255,255,255,.35);font-size:.86rem;margin-bottom:24px}
.frow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.flabel{font-size:.64rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.25);width:46px;flex-shrink:0}
.chip{font-size:.77rem;font-weight:600;padding:7px 13px;border-radius:20px;border:1px solid rgba(255,255,255,.14);background:transparent;color:rgba(255,255,255,.5);cursor:pointer;transition:all .18s;white-space:nowrap}
.chip:hover{border-color:rgba(255,255,255,.45);color:#fff}
.chip.on{background:var(--blue);border-color:var(--blue);color:#fff}
.type-tabs{display:flex;background:rgba(255,255,255,.07);border-radius:var(--r);overflow:hidden;border:1px solid rgba(255,255,255,.1)}
.ttab{font-size:.8rem;font-weight:600;padding:8px 20px;border:none;background:none;color:rgba(255,255,255,.42);cursor:pointer;transition:all .2s}
.ttab.on{background:var(--blue);color:#fff}
.browse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:16px;padding:32px 48px}
.load-wrap{text-align:center;padding:16px 0 44px}
.btn-load{font-weight:700;font-size:.84rem;padding:12px 36px;border-radius:var(--r);border:2px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;transition:all .22s}
.btn-load:hover{background:var(--ink);color:#fff}

/* SEARCH */
.search-page{padding:48px}
.search-page h1{font-family:'Bebas Neue',sans-serif;font-size:2.6rem;letter-spacing:2px;margin-bottom:7px}
.search-page p{color:var(--text2);font-size:.87rem;margin-bottom:28px}
.s-wrap{max-width:640px;position:relative;margin-bottom:32px}
.s-input{width:100%;padding:16px 22px 16px 50px;background:var(--surface);border:2px solid var(--border);border-radius:var(--r);font-family:'Inter',sans-serif;font-size:.95rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s}
.s-input:focus{border-color:var(--blue);box-shadow:0 0 0 4px rgba(37,99,235,.08)}
.s-input::placeholder{color:var(--muted)}
.s-ico{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:1rem;color:var(--muted);pointer-events:none}
.s-clr{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;background:var(--surface2);border:none;color:var(--text2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;transition:all .2s}
.s-clr:hover{background:var(--blue);color:#fff}
.s-count{font-size:.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:18px}
.s-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:16px}
.qchips{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}
.qchip{font-size:.8rem;font-weight:500;padding:8px 16px;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text2);cursor:pointer;transition:all .2s}
.qchip:hover{border-color:var(--blue);color:var(--blue)}

/* DETAIL */
.detail-hero{position:relative;height:52vh;min-height:340px;overflow:hidden}
.detail-hero img{width:100%;height:100%;object-fit:cover;object-position:center 20%}
.detail-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,15,0) 0%,var(--bg) 92%),linear-gradient(to right,rgba(10,10,15,.85) 0%,transparent 55%)}
.detail-body{display:flex;gap:40px;padding:0 60px 56px;margin-top:-170px;position:relative;z-index:2}
.detail-poster{flex-shrink:0;width:190px;border-radius:var(--r);overflow:hidden;box-shadow:0 20px 56px rgba(0,0,0,.22);border:1px solid var(--border);animation:posterBob 3.5s ease-in-out infinite}
@keyframes posterBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.detail-poster img{width:100%;display:block}
.detail-info{flex:1;padding-top:100px}
.d-genres{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.d-genre{font-size:.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 11px;border-radius:20px;border:1px solid var(--border);color:var(--text2)}
.d-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.2rem,5vw,3.8rem);letter-spacing:1px;color:var(--ink);line-height:1;margin-bottom:12px}
.d-meta{display:flex;align-items:center;gap:14px;margin-bottom:18px;flex-wrap:wrap}
.d-score{display:flex;align-items:center;gap:8px}
.d-pill{font-size:.72rem;color:var(--text2);background:var(--surface);padding:5px 11px;border-radius:20px;border:1px solid var(--border)}
.d-tagline{font-style:italic;color:var(--muted);font-size:.9rem;margin-bottom:12px}
.d-desc{color:var(--text2);line-height:1.82;font-size:.94rem;max-width:560px;margin-bottom:24px}
.d-crew{display:flex;gap:28px;margin-bottom:28px;flex-wrap:wrap}
.d-crew-label{font-size:.62rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
.d-crew-val{font-weight:600;font-size:.86rem;color:var(--ink)}
.d-btns{display:flex;gap:10px;flex-wrap:wrap}
.btn-dark{display:flex;align-items:center;gap:7px;background:var(--ink);color:#fff;font-weight:700;font-size:.84rem;padding:12px 26px;border:none;border-radius:var(--r);cursor:pointer;transition:all .22s}
.btn-dark:hover{background:#333;transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.18)}
.btn-bdr{display:flex;align-items:center;gap:7px;background:transparent;color:var(--ink);font-weight:600;font-size:.84rem;padding:12px 26px;border:2px solid var(--border);border-radius:var(--r);cursor:pointer;transition:all .22s}
.btn-bdr:hover{border-color:var(--blue);color:var(--blue)}
.btn-bdr.saved{border-color:var(--green);color:var(--green);background:rgba(34,197,94,.06)}
.detail-back{position:fixed;top:76px;left:18px;z-index:50;display:inline-flex;align-items:center;gap:6px;font-size:.77rem;font-weight:600;color:var(--text2);background:var(--surface);border:1px solid var(--border);padding:8px 15px;border-radius:20px;cursor:pointer;transition:all .22s;box-shadow:0 2px 8px rgba(0,0,0,.07)}
.detail-back:hover{color:var(--blue);border-color:var(--blue)}
.sim-section{padding:32px 60px 52px;border-top:1px solid var(--border)}

/* REVIEWS */
.reviews-section{padding:32px 60px 52px;border-top:1px solid var(--border)}
.review-form{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:22px;margin-bottom:28px}
.review-form-title{font-size:.95rem;font-weight:800;margin-bottom:16px;color:var(--ink)}
.stars-row{display:flex;gap:6px;margin-bottom:14px}
.star-btn{background:none;border:none;font-size:1.5rem;cursor:pointer;transition:transform .15s;line-height:1}
.star-btn:hover{transform:scale(1.2)}
.review-textarea{width:100%;padding:12px 14px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--r);font-family:'Inter',sans-serif;font-size:.88rem;color:var(--ink);outline:none;resize:vertical;min-height:90px;transition:border-color .2s}
.review-textarea:focus{border-color:var(--blue)}
.review-textarea::placeholder{color:var(--muted)}
.review-submit{margin-top:12px;padding:10px 24px;background:var(--blue);color:#fff;border:none;border-radius:var(--r);font-weight:700;font-size:.84rem;cursor:pointer;transition:all .2s}
.review-submit:hover{background:var(--blue3)}
.review-submit:disabled{opacity:.6;cursor:not-allowed}
.review-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:18px;margin-bottom:14px}
.review-card-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.reviewer-avatar{width:32px;height:32px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;color:#fff;flex-shrink:0}
.reviewer-name{font-weight:700;font-size:.85rem;color:var(--ink)}
.reviewer-date{font-size:.72rem;color:var(--muted)}
.review-stars{color:var(--gold);font-size:.9rem;margin-bottom:8px}
.review-text{font-size:.85rem;color:var(--text2);line-height:1.7}
.no-reviews{text-align:center;padding:32px;color:var(--muted);font-size:.88rem}

/* PROFILE */
.profile-page{padding:48px}
.profile-head{display:flex;align-items:center;gap:24px;margin-bottom:40px;padding:28px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r)}
.profile-avatar{width:72px;height:72px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#fff;flex-shrink:0}
.profile-name{font-size:1.3rem;font-weight:800;color:var(--ink);margin-bottom:4px}
.profile-email{font-size:.82rem;color:var(--text2);margin-bottom:12px}
.profile-stats{display:flex;gap:24px}
.profile-stat{text-align:center}
.profile-stat-n{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:var(--blue);line-height:1}
.profile-stat-l{font-size:.68rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
.logout-btn{margin-left:auto;padding:10px 20px;background:transparent;color:var(--red);border:1.5px solid var(--red);border-radius:var(--r);font-weight:700;font-size:.82rem;cursor:pointer;transition:all .2s}
.logout-btn:hover{background:var(--red);color:#fff}

/* TRAILER MODAL */
.modal-overlay{position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.92);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
.modal-box{width:90vw;max-width:860px;background:#111;border-radius:12px;overflow:hidden;border:1px solid #222;box-shadow:0 40px 100px rgba(0,0,0,.8);animation:modalIn .3s cubic-bezier(.22,1,.36,1)}
.modal-head{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #222}
.modal-head-title{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:2px;color:#fff}
.modal-x{width:30px;height:30px;border-radius:6px;background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all .2s}
.modal-x:hover{background:var(--red);color:#fff}
.modal-vid{aspect-ratio:16/9;background:#000}
.modal-vid iframe{width:100%;height:100%;border:none;display:block}
.modal-no{aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:rgba(255,255,255,.3);font-size:.88rem}

/* WHERE TO WATCH */
.watch-section{padding:32px 60px 42px;border-top:1px solid var(--border)}
.watch-title{font-size:1.1rem;font-weight:800;margin-bottom:22px;display:flex;align-items:center;gap:10px}
.watch-title .jw-attr{font-size:.65rem;font-weight:500;color:var(--muted);margin-left:auto}
.watch-title .jw-attr a{color:var(--blue);text-decoration:none}
.watch-title .jw-attr a:hover{text-decoration:underline}
.watch-group{margin-bottom:22px}
.watch-group-label{font-size:.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.watch-group-label::after{content:'';flex:1;height:1px;background:var(--border)}
.watch-providers{display:flex;gap:10px;flex-wrap:wrap}
.watch-provider{display:flex;align-items:center;gap:10px;padding:10px 16px;background:var(--surface);border:1px solid var(--border);border-radius:10px;cursor:pointer;transition:all .22s;text-decoration:none;color:var(--ink)}
.watch-provider:hover{border-color:var(--blue);transform:translateY(-2px);box-shadow:0 6px 20px rgba(124,58,237,.15);background:var(--surface2)}
.watch-provider img{width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0}
.watch-provider-name{font-size:.82rem;font-weight:600}
.watch-provider-type{font-size:.65rem;color:var(--muted)}
.watch-none{text-align:center;padding:28px;color:var(--muted);font-size:.88rem;border:1px dashed var(--border);border-radius:10px}

/* LOGO IMG */
.logo-img{width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0}
.logo-img-lg{width:36px;height:36px;border-radius:8px}
.logo-img-sm{width:24px;height:24px;border-radius:5px}

/* WATCHLIST */
.wl-page{padding:48px}
.wl-h1{font-family:'Bebas Neue',sans-serif;font-size:2.6rem;letter-spacing:2px;margin-bottom:6px}
.wl-sub{color:var(--text2);font-size:.86rem;margin-bottom:32px}
.wl-empty{min-height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border:1px dashed var(--border);border-radius:12px;text-align:center;padding:40px}
.wl-empty-icon{font-size:3rem;opacity:.25;animation:posterBob 3s ease-in-out infinite}
.wl-empty h3{font-size:1.1rem;font-weight:700;color:var(--muted)}
.wl-empty p{font-size:.82rem;color:var(--muted);max-width:260px;line-height:1.6}
.wl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:13px}
.wl-row{display:flex;gap:13px;padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);cursor:pointer;transition:all .22s}
.wl-row:hover{border-color:var(--blue);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.07)}
.wl-thumb{width:58px;height:84px;border-radius:5px;object-fit:cover;flex-shrink:0;background:var(--surface2)}
.wl-info{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}
.wl-name{font-weight:700;font-size:.9rem;color:var(--ink);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl-meta{font-size:.72rem;color:var(--muted);margin-bottom:10px}
.wl-rm{background:none;border:none;color:var(--muted);cursor:pointer;font-size:13px;padding:4px;border-radius:4px;transition:color .2s;align-self:flex-start}
.wl-rm:hover{color:var(--red)}

.divider{height:1px;background:var(--border);margin:0 48px}
.loading{display:flex;align-items:center;justify-content:center;min-height:30vh;flex-direction:column;gap:14px;color:var(--muted)}
.spinner{width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:768px){
  .section,.wl-page,.search-page,.profile-page{padding:24px 16px}
  .browse-top,.browse-grid{padding:24px 16px}
  .hero-banner{padding:36px 20px 44px}
  .two-col{grid-template-columns:1fr;padding:24px 16px}
  .detail-body{flex-direction:column;padding:0 16px 36px}
  .detail-poster{width:130px}
  .detail-info{padding-top:0}
  .nav-links{display:none}
  .sim-section,.reviews-section{padding:24px 16px 36px}
  .cta-inner{padding:48px 20px}
  .footer-grid{grid-template-columns:1fr 1fr}
  .tab-bar{padding:0 16px}
}
`;

// ─── HELPERS ───────────────────────────────────────
function Particles() {
  const ps = Array.from({ length: 14 }, (_, i) => ({
    id: i, size: Math.random() * 12 + 5,
    left: Math.random() * 100,
    delay: Math.random() * 20, dur: Math.random() * 18 + 16,
  }));
  return (
    <div className="particles">
      {ps.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size, left: `${p.left}%`,
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
        }} />
      ))}
    </div>
  );
}

function Spinner() { return <div className="loading"><div className="spinner" /></div>; }

function RatingRing({ score }) {
  const pct = Math.round(score * 10);
  const bg = `conic-gradient(var(--blue) calc(${pct} * 3.6deg), rgba(0,0,0,.15) 0)`;
  return (
    <div className="ring-wrap" style={{ background: bg }}>
      <div className="ring-inner">{pct}%</div>
    </div>
  );
}

// ─── AUTH MODAL ───────────────────────────────────
function AuthModal({ onClose, onAuth }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const path = tab === "login" ? "/token?grant_type=password" : "/signup";
      const data = await supaAuth(path, { email, password });
      if (tab === "signup") {
        setSuccess("Account created! Please check your email to confirm, then log in.");
        setTab("login");
      } else {
        onAuth(data);
        onClose();
      }
    } catch (e) {
      setError(e.error_description || e.msg || e.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
        <div className="auth-box">
          <div className="auth-head">
            <div className="auth-logo">
              <img src="/logo.png" alt="Apex Cinema" className="logo-img logo-img-lg" />
              <span className="auth-logo-text">APEX CINEMA</span>
            </div>
            <div className="auth-title">{tab === "login" ? "Welcome Back" : "Create Account"}</div>
            <div className="auth-sub">{tab === "login" ? "Sign in to access your watchlist & reviews" : "Join the cave — it's completely free"}</div>
          </div>
          <div className="auth-body">
            <div className="auth-tabs">
              <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Sign In</button>
              <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}>Sign Up</button>
            </div>
            {error && <div className="auth-error">⚠️ {error}</div>}
            {success && <div className="auth-success">✅ {success}</div>}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
            <button className="auth-btn" onClick={submit} disabled={loading}>
              {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
        <button className="auth-close" style={{ position: "absolute", top: 12, right: 12 }} onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

// ─── POSTER CARD ──────────────────────────────────
function PCard({ movie, onClick, style, dark }) {
  const isTV = movie.media_type === "tv" || !!movie.first_air_date;
  const title = movie.title || movie.name || "Unknown";
  const date = movie.release_date || movie.first_air_date || "";
  const poster = movie.poster_path ? `${IMG}/w342${movie.poster_path}` : null;
  const score = movie.vote_average || 0;
  const fmt = d => { try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; } };
  return (
    <div className={`pcard${dark ? " pcard-dark" : ""}`} onClick={() => onClick(movie)} style={style}>
      <div className="pcard-img">
        {poster ? <img src={poster} alt={title} loading="lazy" /> : <div className="no-img">🎬</div>}
        <div className="pcard-type">{isTV ? "TV" : "MOVIE"}</div>
        <div className="pcard-overlay"><div className="pcard-play">▶</div></div>
        {score > 0 && <RatingRing score={score} />}
      </div>
      <div className="pcard-meta">
        <div className="pcard-name">{title}</div>
        <div className="pcard-date">{date ? fmt(date) : "—"}</div>
      </div>
    </div>
  );
}

function HRow({ movies, onMovieClick, dark }) {
  const ref = useRef(null);
  const scroll = d => ref.current?.scrollBy({ left: d * 560, behavior: "smooth" });
  return (
    <div className="hrow-wrap">
      <button className={`arr l${dark ? " arr-dark" : ""}`} onClick={() => scroll(-1)}>‹</button>
      <div className="hrow" ref={ref}>
        {movies.map((m, i) => <PCard key={m.id} movie={m} onClick={onMovieClick} dark={dark} style={{ animationDelay: `${i * .04}s` }} />)}
      </div>
      <button className={`arr r${dark ? " arr-dark" : ""}`} onClick={() => scroll(1)}>›</button>
    </div>
  );
}

function TrailerModal({ movie, onClose }) {
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const isTV = movie.media_type === "tv" || !!movie.first_air_date;
  useEffect(() => {
    (async () => {
      try {
        const type = isTV ? "tv" : "movie";
        const d = await tmdb(`/${type}/${movie.id}/videos`, { include_video_language: "en" });
        const videos = d.results || [];
        // Try to find best trailer — official first, then any
        const trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official)
          || videos.find(v => v.site === "YouTube" && v.type === "Trailer")
          || videos.find(v => v.site === "YouTube" && v.type === "Teaser")
          || videos.find(v => v.site === "YouTube");
        setKey(trailer?.key || null);
      } catch (e) { console.error("Trailer error:", e); setKey(null); }
      finally { setLoading(false); }
    })();
  }, [movie.id]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-head-title">{movie.title || movie.name}</div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-vid">
          {loading
            ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "16/9" }}><div className="spinner" style={{ borderTopColor: "#fff" }} /></div>
            : key
              ? <iframe src={`https://www.youtube.com/embed/${key}?autoplay=1&rel=0`} allowFullScreen allow="autoplay;encrypted-media;picture-in-picture" title="trailer" />
              : <div className="modal-no">📽️<span>No trailer available for this title</span></div>
          }
        </div>
      </div>
    </div>
  );
}

// ─── CTA + FOOTER ─────────────────────────────────
function CTAFooter({ bgImages, onNav, user, onShowAuth }) {
  const SPEECHES = [
    { icon: "🎬", title: "Watch for Free", text: "Enjoy millions of movies and series completely free. No subscriptions, no hidden fees — just pure cinema." },
    { icon: "🗄️", title: "Contribute to Our Database", text: "Rate films, write reviews and help build the world's most complete movie database." },
    { icon: "🌍", title: "Built for Everyone", text: "From Hollywood blockbusters to indie gems — Apex Cinema has something for every taste." },
    { icon: "🔔", title: "Stay Updated Daily", text: "New releases and trending titles updated every day so you never miss what's hot." },
  ];
  const MT = ["APEX CINEMA", "FREE FOREVER", "MILLIONS OF TITLES", "WATCH TRAILERS", "BUILD YOUR WATCHLIST", "RATE & REVIEW", "DISCOVER DAILY"];
  return (
    <>
      <div className="cta-section">
        <div className="cta-bg-grid">
          {bgImages.slice(0, 12).map((m, i) => (
            <div key={i} className="cta-bg-cell">
              {m.backdrop_path && <img src={`${IMG}/w500${m.backdrop_path}`} alt="" loading="lazy" />}
            </div>
          ))}
        </div>
        <div className="cta-bg-overlay" />
        <div className="cta-grain" />
        <div className="cta-shape" style={{ width: 300, height: 300, background: "rgba(37,99,235,.15)", top: "10%", left: "5%", animationDuration: "6s" }} />
        <div className="cta-shape" style={{ width: 200, height: 200, background: "rgba(37,99,235,.1)", bottom: "10%", right: "8%", animationDuration: "8s", animationDelay: "2s" }} />
        <div className="cta-inner">
          <div className="cta-tag"><span className="cta-tag-dot" /> Join Apex Cinema Today</div>
          <div className="cta-title">Your Cinema.<br /><span>Your Rules.</span></div>
          <p className="cta-desc">Explore, discover and enjoy millions of movies and series — completely free. Help us build the most complete movie database on the internet.</p>
          <div className="cta-cards">
            {SPEECHES.map((s, i) => (
              <div key={i} className="cta-card" style={{ animationDuration: `${3 + i * .5}s`, animationDelay: `${i * .3}s` }}>
                <span className="cta-card-icon">{s.icon}</span>
                <div className="cta-card-title">{s.title}</div>
                <div className="cta-card-text">{s.text}</div>
              </div>
            ))}
          </div>
          <div className="marquee-wrap">
            <div className="marquee">
              {[...MT, ...MT, ...MT].map((t, i) => <span key={i} className="marquee-item">{t} <span>✦</span></span>)}
            </div>
          </div>
          <div className="cta-btns">
            <button className="btn-blue" onClick={() => onNav("browse")}>🎬 Start Exploring</button>
            {!user && <button className="btn-outline" onClick={onShowAuth}>👤 Create Free Account</button>}
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <img src="/logo.png" alt="Apex Cinema" className="logo-img" />
              <span className="footer-logo-text">APEX CINEMA</span>
            </div>
            <div className="footer-tagline">Your premium cinema destination — discover, track and enjoy millions of movies and series.</div>
          </div>
          <div>
            <div className="footer-col-title">Explore</div>
            {["Movies", "TV Shows", "Trending", "Top Rated", "New Releases"].map(l => <span key={l} className="footer-link" onClick={() => onNav("browse")}>{l}</span>)}
          </div>
          <div>
            <div className="footer-col-title">Account</div>
            {["Watchlist", "My Reviews", "Profile", "Settings"].map(l => <span key={l} className="footer-link" onClick={() => user ? onNav("profile") : onShowAuth()}>{l}</span>)}
          </div>
          <div>
            <div className="footer-col-title">About</div>
            {["About Us", "Contact", "Privacy Policy", "Terms of Use"].map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} Apex Cinema. All rights reserved.</div>
          <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", gap: 6 }}>
            Movie data powered by <span className="footer-tmdb">TMDB</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── HOME PAGE ─────────────────────────────────────
const MOVIE_TABS = ["Trending", "Now Playing", "Popular", "Top Rated", "Upcoming"];
const TV_TABS = ["Airing Today", "On TV", "Popular", "Top Rated"];
const MOVIE_EP = ["/trending/movie/week", "/movie/now_playing", "/movie/popular", "/movie/top_rated", "/movie/upcoming"];
const TV_EP = ["/tv/airing_today", "/tv/on_the_air", "/tv/popular", "/tv/top_rated"];

function HomePage({ onMovieClick, onNav, user, onShowAuth }) {
  const [heroList, setHeroList] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [mTab, setMTab] = useState(0);
  const [tvTab, setTvTab] = useState(0);
  const [mData, setMData] = useState({});
  const [tvData, setTvData] = useState({});
  const [topRated, setTopRated] = useState([]);
  const [bgImages, setBgImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroQ, setHeroQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [tr, ...rest] = await Promise.all([
          tmdb("/trending/all/week"),
          ...MOVIE_EP.map(e => tmdb(e)),
          ...TV_EP.map(e => tmdb(e)),
          tmdb("/movie/top_rated"),
        ]);
        const md = {}; rest.slice(0, 5).forEach((r, i) => md[i] = r.results);
        const tvd = {}; rest.slice(5, 9).forEach((r, i) => tvd[i] = r.results);
        setMData(md); setTvData(tvd);
        setTopRated(rest[9].results.slice(0, 8));
        setHeroList(tr.results.filter(m => m.backdrop_path).slice(0, 5));
        setBgImages(tr.results.filter(m => m.backdrop_path).slice(0, 12));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!heroList.length) return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroList.length), 6000);
    return () => clearInterval(t);
  }, [heroList]);

  const hero = heroList[heroIdx];

  return (
    <div className="page">
      {hero && (
        <div className="hero-banner">
          <div className="hero-banner-bg" style={{ backgroundImage: `url(${IMG}/original${hero.backdrop_path})` }} />
          <div className="hero-content">
            <div className="hero-tag"><span className="live-dot" /> Welcome to Apex Cinema</div>
            <div className="hero-title">Millions of Movies,<br />TV Shows & More.</div>
            <div className="hero-sub">Discover, track and enjoy — completely free.</div>
            <div className="hero-search-wrap">
              <span className="hero-search-ico">🔍</span>
              <input className="hero-search-input" placeholder="Search for a movie, tv show..." value={heroQ} onChange={e => setHeroQ(e.target.value)} onKeyDown={e => e.key === "Enter" && heroQ.trim() && onNav("search", heroQ)} />
              <button className="hero-search-btn" onClick={() => heroQ.trim() && onNav("search", heroQ)}>Search</button>
            </div>
          </div>
          <div className="hero-dots">
            {heroList.map((_, i) => <div key={i} className={`hero-dot${i === heroIdx ? " active" : ""}`} onClick={() => setHeroIdx(i)} />)}
          </div>
        </div>
      )}

      {loading ? <Spinner /> : <>
        <div style={{ background: "var(--surface)" }}>
          <div className="tab-bar">
            <span className="tab-label">🎬 Movies</span>
            {MOVIE_TABS.map((t, i) => <button key={t} className={`tab${mTab === i ? " active" : ""}`} onClick={() => setMTab(i)}>{t}</button>)}
            <div className="tab-spacer" />
            <button className="tab-all" onClick={() => onNav("browse")}>View More →</button>
          </div>
          <div className="section" style={{ paddingTop: 28 }}>
            <HRow movies={(mData[mTab] || []).slice(0, 14)} onMovieClick={m => onMovieClick({ ...m, media_type: "movie" })} />
          </div>
        </div>

        <div className="divider" />

        <div style={{ background: "var(--ink2)" }}>
          <div className="tab-bar" style={{ background: "var(--ink)", borderBottomColor: "rgba(255,255,255,.08)" }}>
            <span className="tab-label tab-label-dark">📺 TV Shows</span>
            {TV_TABS.map((t, i) => <button key={t} className={`tab tab-dark${tvTab === i ? " active" : ""}`} onClick={() => setTvTab(i)}>{t}</button>)}
            <div className="tab-spacer" />
            <button className="tab-all tab-all-dark" onClick={() => onNav("browse")}>View More →</button>
          </div>
          <div className="section section-dark" style={{ paddingTop: 28 }}>
            <HRow movies={(tvData[tvTab] || []).slice(0, 14).map(m => ({ ...m, media_type: "tv" }))} onMovieClick={onMovieClick} dark />
          </div>
        </div>

        <div className="divider" />

        <div className="two-col">
          <div>
            <div className="sec-head" style={{ marginBottom: 20 }}>
              <div><div className="sec-title">🔥 Trending This Week</div><div className="sec-sub">Updated daily</div></div>
              <button className="see-all" onClick={() => onNav("browse")}>See All →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 14 }}>
              {heroList.concat((mData[0] || []).slice(0, 4)).slice(0, 8).map((m, i) => (
                <PCard key={m.id} movie={m} onClick={onMovieClick} style={{ animationDelay: `${i * .04}s` }} />
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">⭐ Top Rated Movies</div>
            {topRated.map((m, i) => (
              <div key={m.id} className="list-item" onClick={() => onMovieClick(m)}>
                <div className="list-num">{i + 1}</div>
                <img src={m.poster_path ? `${IMG}/w92${m.poster_path}` : ""} alt={m.title} className="list-thumb" />
                <div className="list-info">
                  <div className="list-name">{m.title}</div>
                  <div className="list-meta"><span className="list-rating">★ {m.vote_average.toFixed(1)}</span><span>{(m.release_date || "").slice(0, 4)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CTAFooter bgImages={bgImages} onNav={onNav} user={user} onShowAuth={onShowAuth} />
      </>}
    </div>
  );
}

// ─── BROWSE ───────────────────────────────────────
const MG = [{ id: 28, n: "Action" }, { id: 12, n: "Adventure" }, { id: 16, n: "Animation" }, { id: 35, n: "Comedy" }, { id: 80, n: "Crime" }, { id: 18, n: "Drama" }, { id: 14, n: "Fantasy" }, { id: 27, n: "Horror" }, { id: 9648, n: "Mystery" }, { id: 878, n: "Sci-Fi" }, { id: 53, n: "Thriller" }];
const TG = [{ id: 10759, n: "Action" }, { id: 16, n: "Animation" }, { id: 35, n: "Comedy" }, { id: 80, n: "Crime" }, { id: 18, n: "Drama" }, { id: 9648, n: "Mystery" }, { id: 10765, n: "Sci-Fi" }];
const SORTS = [{ v: "popularity.desc", l: "Most Popular" }, { v: "vote_average.desc", l: "Top Rated" }, { v: "release_date.desc", l: "Newest" }, { v: "revenue.desc", l: "Box Office" }];

function BrowsePage({ onMovieClick }) {
  const [type, setType] = useState("movie");
  const [genre, setGenre] = useState(null);
  const [sort, setSort] = useState("popularity.desc");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const params = { sort_by: sort, page: p, "vote_count.gte": 80 };
      if (genre) params.with_genres = genre;
      const d = await tmdb(`/discover/${type}`, params);
      reset ? setMovies(d.results || []) : setMovies(prev => [...prev, ...(d.results || [])]);
      setHasMore(p < d.total_pages);
      if (!reset) setPage(p => p + 1);
    } catch { }
    finally { setLoading(false); setLoadingMore(false); }
  }, [type, genre, sort, page]);

  useEffect(() => { setPage(1); load(true); }, [type, genre, sort]);

  return (
    <div className="page">
      <div className="browse-top">
        <div className="browse-h1">Browse <span style={{ opacity: .4 }}>Everything</span></div>
        <div className="browse-sub">Discover movies and series by genre, popularity and more</div>
        <div className="frow" style={{ marginBottom: 12 }}>
          <span className="flabel">Type</span>
          <div className="type-tabs">
            {[["movie", "🎬 Movies"], ["tv", "📺 Series"]].map(([v, l]) => (
              <button key={v} className={`ttab${type === v ? " on" : ""}`} onClick={() => { setType(v); setGenre(null); }}>{l}</button>
            ))}
          </div>
        </div>
        <div className="frow" style={{ marginBottom: 12 }}>
          <span className="flabel">Sort</span>
          {SORTS.map(s => <button key={s.v} className={`chip${sort === s.v ? " on" : ""}`} onClick={() => setSort(s.v)}>{s.l}</button>)}
        </div>
        <div className="frow">
          <span className="flabel">Genre</span>
          <button className={`chip${!genre ? " on" : ""}`} onClick={() => setGenre(null)}>All</button>
          {(type === "movie" ? MG : TG).map(g => (
            <button key={g.id} className={`chip${genre === g.id ? " on" : ""}`} onClick={() => setGenre(g.id)}>{g.n}</button>
          ))}
        </div>
      </div>
      {loading ? <Spinner /> : (
        <>
          <div className="browse-grid">
            {movies.map((m, i) => <PCard key={`${m.id}-${i}`} movie={{ ...m, media_type: type }} onClick={onMovieClick} style={{ animationDelay: `${(i % 20) * .03}s` }} />)}
          </div>
          {hasMore && (
            <div className="load-wrap">
              <button className="btn-load" onClick={() => load(false)} disabled={loadingMore}>{loadingMore ? "Loading…" : "Load More"}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── SEARCH ───────────────────────────────────────
function SearchPage({ onMovieClick, initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef(null);

  const search = async val => {
    if (!val.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const d = await tmdb("/search/multi", { query: val });
      setResults(d.results?.filter(m => m.media_type !== "person" && (m.poster_path || m.backdrop_path)) || []);
      setSearched(true);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { if (initialQuery) search(initialQuery); }, []);

  const handle = v => { setQ(v); clearTimeout(timer.current); timer.current = setTimeout(() => search(v), 400); };

  return (
    <div className="page search-page">
      <h1>Search</h1>
      <p>Find any movie, series or person</p>
      <div className="s-wrap">
        <span className="s-ico">🔍</span>
        <input className="s-input" placeholder="Search titles, directors…" value={q} onChange={e => handle(e.target.value)} autoFocus />
        {q && <button className="s-clr" onClick={() => { setQ(""); setResults([]); setSearched(false); }}>✕</button>}
      </div>
      {loading && <Spinner />}
      {!loading && searched && <div className="s-count">{results.length} result{results.length !== 1 ? "s" : ""} for "{q}"</div>}
      {!loading && results.length > 0 && (
        <div className="s-grid">
          {results.map((m, i) => <PCard key={m.id} movie={m} onClick={onMovieClick} style={{ animationDelay: `${i * .03}s` }} />)}
        </div>
      )}
      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "56px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎬</div>
          <div style={{ fontSize: "1.1rem", marginBottom: 6 }}>Nothing found</div>
          <div style={{ fontSize: ".82rem" }}>Try a different title</div>
        </div>
      )}
      {!searched && !loading && (
        <div>
          <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Popular Searches</div>
          <div className="qchips">
            {["Oppenheimer", "Breaking Bad", "Dune", "Interstellar", "Peaky Blinders", "The Batman", "Inception", "The Wire"].map(s => (
              <button key={s} className="qchip" onClick={() => { setQ(s); search(s); }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DETAIL + REVIEWS ─────────────────────────────
function DetailPage({ movie, onBack, user, onShowAuth, session }) {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(false);
  const [inWL, setInWL] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const isTV = movie.media_type === "tv" || !!movie.first_air_date;
  const type = isTV ? "tv" : "movie";

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const [det, cred, sim, wp] = await Promise.all([
          tmdb(`/${type}/${movie.id}`),
          tmdb(`/${type}/${movie.id}/credits`),
          tmdb(`/${type}/${movie.id}/similar`),
          tmdb(`/${type}/${movie.id}/watch/providers`),
        ]);
        setDetails(det); setCredits(cred);
        setSimilar(sim.results?.filter(m => m.poster_path).slice(0, 12) || []);
        // Get user's country providers or fallback to US
        const countryCode = Intl.DateTimeFormat().resolvedOptions().locale?.split('-')[1] || 'US';
        const providers = wp.results?.[countryCode] || wp.results?.['US'] || null;
        setWatchProviders(providers);
      } catch { }
      finally { setLoading(false); }
    })();
    loadReviews();
    if (session) checkWatchlist();
  }, [movie.id]);

  const loadReviews = async () => {
    try {
      const data = await supa(`/reviews?movie_id=eq.${movie.id}&order=created_at.desc`);
      setReviews(data);
      if (session) {
        const mine = data.find(r => r.user_id === session.user.id);
        if (mine) { setMyRating(mine.rating); setReviewText(mine.review || ""); }
      }
    } catch { }
  };

  const checkWatchlist = async () => {
    try {
      const data = await supa(`/watchlist?user_id=eq.${session.user.id}&movie_id=eq.${movie.id}`, { token: session.access_token });
      setInWL(data.length > 0);
    } catch { }
  };

  const toggleWatchlist = async () => {
    if (!user) { onShowAuth(); return; }
    setWlLoading(true);
    try {
      if (inWL) {
        await supa(`/watchlist?user_id=eq.${session.user.id}&movie_id=eq.${movie.id}`, { method: "DELETE", token: session.access_token, prefer: "return=minimal" });
        setInWL(false);
      } else {
        await supa("/watchlist", {
          method: "POST", token: session.access_token,
          body: {
            user_id: session.user.id, movie_id: movie.id,
            title: details?.title || details?.name || movie.title || movie.name,
            poster_path: details?.poster_path || movie.poster_path,
            media_type: type, vote_average: details?.vote_average || movie.vote_average,
            release_date: details?.release_date || details?.first_air_date || movie.release_date || movie.first_air_date,
          },
        });
        setInWL(true);
      }
    } catch (e) { console.error(e); }
    finally { setWlLoading(false); }
  };

  const submitReview = async () => {
    if (!user) { onShowAuth(); return; }
    if (!myRating) return;
    setReviewLoading(true);
    try {
      await supa("/reviews", {
        method: "POST", token: session.access_token,
        prefer: "resolution=merge-duplicates,return=representation",
        body: { user_id: session.user.id, movie_id: movie.id, rating: myRating, review: reviewText },
      });
      await loadReviews();
    } catch (e) { console.error(e); }
    finally { setReviewLoading(false); }
  };

  const title = details?.title || details?.name || movie.title || movie.name;
  const backdrop = details?.backdrop_path || movie.backdrop_path;
  const poster = details?.poster_path || movie.poster_path;
  const director = credits?.crew?.find(c => c.job === "Director")?.name;
  const cast = credits?.cast?.slice(0, 5).map(c => c.name).join(", ");

  return (
    <div className="page">
      <button className="detail-back" onClick={onBack}>← Back</button>
      <div className="detail-hero">
        {backdrop ? <img src={`${IMG}/original${backdrop}`} alt={title} /> : <div style={{ height: "100%", background: "var(--ink2)" }} />}
      </div>
      {loading ? <Spinner /> : (
        <>
          <div className="detail-body">
            <div className="detail-poster">
              {poster ? <img src={`${IMG}/w500${poster}`} alt={title} /> : <div className="no-img" style={{ height: 280 }}>🎬</div>}
            </div>
            <div className="detail-info">
              <div className="d-genres">
                {details?.genres?.map(g => <span key={g.id} className="d-genre">{g.name}</span>)}
                <span className="d-genre">{isTV ? "Series" : "Film"}</span>
              </div>
              <h1 className="d-title">{title}</h1>
              <div className="d-meta">
                {details?.vote_average > 0 && (
                  <div className="d-score">
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `conic-gradient(var(--blue) calc(${Math.round(details.vote_average * 10)} * 3.6deg), rgba(0,0,0,.12) 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".58rem", fontWeight: 800 }}>{Math.round(details.vote_average * 10)}%</div>
                    </div>
                    <span style={{ fontSize: ".8rem", color: "var(--text2)", fontWeight: 600 }}>User Score</span>
                  </div>
                )}
                <span className="d-pill">{(details?.release_date || details?.first_air_date || "").slice(0, 4)}</span>
                {details?.runtime && <span className="d-pill">{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
                {details?.number_of_seasons && <span className="d-pill">{details.number_of_seasons} Seasons</span>}
                {details?.status && <span className="d-pill">{details.status}</span>}
              </div>
              {details?.tagline && <div className="d-tagline">"{details.tagline}"</div>}
              <p className="d-desc">{details?.overview || movie.overview}</p>
              {(director || cast) && (
                <div className="d-crew">
                  {director && <div><div className="d-crew-label">Director</div><div className="d-crew-val">{director}</div></div>}
                  {cast && <div><div className="d-crew-label">Starring</div><div className="d-crew-val">{cast}</div></div>}
                </div>
              )}
              <div className="d-btns">
                <button className="btn-dark" onClick={() => setTrailer(true)}>▶ Play Trailer</button>
                <button className={`btn-bdr${inWL ? " saved" : ""}`} onClick={toggleWatchlist} disabled={wlLoading}>
                  {wlLoading ? "…" : inWL ? "✓ In Watchlist" : "+ Watchlist"}
                </button>
              </div>
            </div>
          </div>

          {/* WHERE TO WATCH SECTION */}
          <div className="watch-section">
            <div className="watch-title">
              📡 Where to Watch
              <span className="jw-attr">Data by <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer">JustWatch</a></span>
            </div>
            {watchProviders ? (
              <>
                {watchProviders.flatrate?.length > 0 && (
                  <div className="watch-group">
                    <div className="watch-group-label">Stream</div>
                    <div className="watch-providers">
                      {watchProviders.flatrate.map(p => (
                        <a key={p.provider_id} className="watch-provider" href={watchProviders.link} target="_blank" rel="noopener noreferrer">
                          <img src={`${IMG}/w92${p.logo_path}`} alt={p.provider_name} />
                          <div>
                            <div className="watch-provider-name">{p.provider_name}</div>
                            <div className="watch-provider-type">Streaming</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {watchProviders.rent?.length > 0 && (
                  <div className="watch-group">
                    <div className="watch-group-label">Rent</div>
                    <div className="watch-providers">
                      {watchProviders.rent.map(p => (
                        <a key={p.provider_id} className="watch-provider" href={watchProviders.link} target="_blank" rel="noopener noreferrer">
                          <img src={`${IMG}/w92${p.logo_path}`} alt={p.provider_name} />
                          <div>
                            <div className="watch-provider-name">{p.provider_name}</div>
                            <div className="watch-provider-type">Rent</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {watchProviders.buy?.length > 0 && (
                  <div className="watch-group">
                    <div className="watch-group-label">Buy</div>
                    <div className="watch-providers">
                      {watchProviders.buy.map(p => (
                        <a key={p.provider_id} className="watch-provider" href={watchProviders.link} target="_blank" rel="noopener noreferrer">
                          <img src={`${IMG}/w92${p.logo_path}`} alt={p.provider_name} />
                          <div>
                            <div className="watch-provider-name">{p.provider_name}</div>
                            <div className="watch-provider-type">Purchase</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {!watchProviders.flatrate && !watchProviders.rent && !watchProviders.buy && (
                  <div className="watch-none">📡 No streaming info available for your region. Check <a href={watchProviders.link} target="_blank" rel="noopener noreferrer" style={{color:'var(--blue)'}}>TMDB</a> for more details.</div>
                )}
              </>
            ) : (
              <div className="watch-none">🌍 No streaming availability found for this title in your region.</div>
            )}
          </div>

          {/* REVIEWS SECTION */}
          <div className="reviews-section">
            <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 22 }}>
              ⭐ Ratings & Reviews
              {reviews.length > 0 && <span style={{ fontSize: ".8rem", fontWeight: 500, color: "var(--text2)", marginLeft: 10 }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>}
            </div>

            {/* WRITE REVIEW */}
            <div className="review-form">
              <div className="review-form-title">{user ? "Rate & Review" : "Sign in to Rate & Review"}</div>
              <div className="stars-row">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button key={n} className="star-btn"
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => user ? setMyRating(n) : onShowAuth()}
                  >
                    {n <= (hoverRating || myRating) ? "⭐" : "☆"}
                  </button>
                ))}
                {myRating > 0 && <span style={{ fontSize: ".82rem", color: "var(--text2)", marginLeft: 8, alignSelf: "center" }}>{myRating}/10</span>}
              </div>
              <textarea
                className="review-textarea"
                placeholder={user ? "Share your thoughts about this movie…" : "Sign in to write a review"}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                disabled={!user}
              />
              <button className="review-submit" onClick={user ? submitReview : onShowAuth} disabled={reviewLoading || (user && !myRating)}>
                {!user ? "Sign In to Submit" : reviewLoading ? "Saving…" : "Submit Review"}
              </button>
            </div>

            {/* REVIEW LIST */}
            {reviews.length === 0
              ? <div className="no-reviews">No reviews yet — be the first! 🎬</div>
              : reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-card-head">
                    <div className="reviewer-avatar">{(r.user_id || "U").slice(0, 1).toUpperCase()}</div>
                    <div>
                      <div className="reviewer-name">Movie Fan</div>
                      <div className="reviewer-date">{new Date(r.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                    </div>
                  </div>
                  <div className="review-stars">{"⭐".repeat(Math.round(r.rating / 2))} {r.rating}/10</div>
                  {r.review && <div className="review-text">{r.review}</div>}
                </div>
              ))
            }
          </div>

          {similar.length > 0 && (
            <div className="sim-section">
              <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 18 }}>More Like This</div>
              <HRow movies={similar.map(m => ({ ...m, media_type: type }))} onMovieClick={() => { }} />
            </div>
          )}
        </>
      )}
      {trailer && <TrailerModal movie={{ ...movie, media_type: type }} onClose={() => setTrailer(false)} />}
    </div>
  );
}

// ─── WATCHLIST PAGE ───────────────────────────────
function WatchlistPage({ user, session, onMovieClick, onShowAuth }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      try {
        const data = await supa(`/watchlist?user_id=eq.${session.user.id}&order=created_at.desc`, { token: session.access_token });
        setItems(data);
      } catch { }
      finally { setLoading(false); }
    })();
  }, [user]);

  const remove = async (id) => {
    try {
      await supa(`/watchlist?id=eq.${id}`, { method: "DELETE", token: session.access_token, prefer: "return=minimal" });
      setItems(p => p.filter(i => i.id !== id));
    } catch { }
  };

  if (!user) return (
    <div className="page wl-page">
      <div className="wl-h1">My Watchlist</div>
      <div className="wl-empty">
        <div className="wl-empty-icon">🔐</div>
        <h3>Sign in to access your watchlist</h3>
        <p>Create a free account to save movies and series across all your devices</p>
        <button className="btn-blue" style={{ marginTop: 8 }} onClick={onShowAuth}>Sign In / Sign Up</button>
      </div>
    </div>
  );

  return (
    <div className="page wl-page">
      <div className="wl-h1">My Watchlist</div>
      <div className="wl-sub">{items.length} title{items.length !== 1 ? "s" : ""} saved</div>
      {loading ? <Spinner /> : items.length === 0 ? (
        <div className="wl-empty">
          <div className="wl-empty-icon">🎬</div>
          <h3>Nothing saved yet</h3>
          <p>Browse movies and series and hit + Watchlist to save them here</p>
        </div>
      ) : (
        <div className="wl-grid">
          {items.map(m => (
            <div key={m.id} className="wl-row" onClick={() => onMovieClick({ id: m.movie_id, title: m.title, poster_path: m.poster_path, media_type: m.media_type, vote_average: m.vote_average, release_date: m.release_date })}>
              {m.poster_path ? <img src={`${IMG}/w185${m.poster_path}`} alt={m.title} className="wl-thumb" /> : <div className="wl-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>🎬</div>}
              <div className="wl-info">
                <div className="wl-name">{m.title}</div>
                <div className="wl-meta">{(m.release_date || "").slice(0, 4)} · {m.media_type === "tv" ? "Series" : "Film"} · ★ {m.vote_average?.toFixed(1)}</div>
                <button className="btn-bdr" style={{ fontSize: ".74rem", padding: "6px 14px" }}>View Details</button>
              </div>
              <button className="wl-rm" onClick={e => { e.stopPropagation(); remove(m.id); }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────
function ProfilePage({ user, session, onLogout, onMovieClick }) {
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supa(`/watchlist?user_id=eq.${session.user.id}&select=id`, { token: session.access_token }),
      supa(`/reviews?user_id=eq.${session.user.id}&select=id`, { token: session.access_token }),
    ]).then(([wl, rv]) => { setWatchlistCount(wl.length); setReviewCount(rv.length); }).catch(() => { });
  }, [user]);

  if (!user) return null;

  const initial = (session.user.email || "U")[0].toUpperCase();

  return (
    <div className="page profile-page">
      <div className="profile-head">
        <div className="profile-avatar">{initial}</div>
        <div>
          <div className="profile-name">{session.user.email?.split("@")[0]}</div>
          <div className="profile-email">{session.user.email}</div>
          <div className="profile-stats">
            <div className="profile-stat"><div className="profile-stat-n">{watchlistCount}</div><div className="profile-stat-l">Saved</div></div>
            <div className="profile-stat"><div className="profile-stat-n">{reviewCount}</div><div className="profile-stat-l">Reviews</div></div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Sign Out</button>
      </div>
      <div style={{ color: "var(--text2)", fontSize: ".9rem", textAlign: "center", padding: "40px 0" }}>
        More profile features coming soon — ratings history, favorite genres and more! 🎬
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [movie, setMovie] = useState(null);
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = session?.user || null;

  const goMovie = m => { setMovie(m); setPage("detail"); window.scrollTo(0, 0); };
  const goPage = (p, q = "") => { setPage(p); setMovie(null); if (q) setSearchQuery(q); window.scrollTo(0, 0); };

  const handleAuth = (data) => { setSession(data); };

  const logout = async () => {
    try {
      await fetch(`${SUPA_URL}/auth/v1/logout`, {
        method: "POST",
        headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${session.access_token}` },
      });
    } catch { }
    setSession(null);
    goPage("home");
  };

  return (
    <>
      <style>{STYLE}</style>
      <Particles />

      <nav className="nav">
        <div className="nav-logo" onClick={() => goPage("home")}>
          <img src="/logo.png" alt="Apex Cinema" className="logo-img" />
          <span className="nav-logo-text">APEX CINEMA</span>
        </div>
        <div className="nav-links">
          {[["home", "Home"], ["browse", "Browse"], ["watchlist", "Watchlist"]].map(([p, l]) => (
            <button key={p} className={`nav-link${page === p ? " active" : ""}`} onClick={() => goPage(p)}>
              {l}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-search-pill" onClick={() => goPage("search")}>🔍 Search</button>
          {user ? (
            <button className="nav-user-btn" onClick={() => goPage("profile")}>
              <div className="nav-avatar">{(user.email || "U")[0].toUpperCase()}</div>
              {user.email?.split("@")[0]}
            </button>
          ) : (
            <button className="nav-login-btn" onClick={() => setShowAuth(true)}>Sign In</button>
          )}
        </div>
      </nav>

      {page === "home" && <HomePage onMovieClick={goMovie} onNav={goPage} user={user} onShowAuth={() => setShowAuth(true)} key="home" />}
      {page === "browse" && <BrowsePage onMovieClick={goMovie} key="browse" />}
      {page === "search" && <SearchPage onMovieClick={goMovie} initialQuery={searchQuery} key={`search-${searchQuery}`} />}
      {page === "watchlist" && <WatchlistPage user={user} session={session} onMovieClick={goMovie} onShowAuth={() => setShowAuth(true)} key="wl" />}
      {page === "profile" && <ProfilePage user={user} session={session} onLogout={logout} onMovieClick={goMovie} key="profile" />}
      {page === "detail" && movie && (
        <DetailPage movie={movie} onBack={() => goPage("home")} user={user} session={session} onShowAuth={() => setShowAuth(true)} key={movie.id} />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
    </>
  );
}
