// @ts-nocheck
/* ================================================================
   ZXH OFFICIAL TOOLS — FINAL FULL WORKING
   ✅ Share button on every tool
   ✅ Install popup forced after 5 seconds
   ✅ Hero text proper spacing
   ================================================================ */
(function () {
'use strict';

const FIREBASE_CONFIG={
 apiKey:"AIzaSyC3IIS6jxnG6h8FcZ0cVsY0Rk2LoYVhu68",
 authDomain:"zxh-official-tools.firebaseapp.com",
 databaseURL:"https://zxh-official-tools-default-rtdb.firebaseio.com",
 projectId:"zxh-official-tools",
 storageBucket:"zxh-official-tools.firebasestorage.app",
 messagingSenderId:"390963219579",
 appId:"1:390963219579:web:682976f10aca6ab7c6a6de",
 measurementId:"G-ZWHSQFXDR7"
};

/* ============ CSS ============ */
const ZXH_CSS = `
:root{--bg:#f1f5f9;--bg-soft:#f8fafc;--card:#ffffff;--text:#0f172a;--text-soft:#475569;--text-mute:#94a3b8;--border:rgba(15,23,42,.08);--border-strong:rgba(15,23,42,.12);--shadow:rgba(15,23,42,.08);--input:#f8fafc;--nav-bg:rgba(255,255,255,.85);--scroll-track:#f1f5f9}
html[data-theme="dark"]{--bg:#0a0f1c;--bg-soft:#0f172a;--card:#141c30;--text:#f1f5f9;--text-soft:#cbd5e1;--text-mute:#64748b;--border:rgba(148,163,184,.12);--border-strong:rgba(148,163,184,.2);--shadow:rgba(0,0,0,.4);--input:#1e293b;--nav-bg:rgba(15,23,42,.85);--scroll-track:#0a0f1c}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{width:100%;max-width:100%;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.55;transition:background .35s ease,color .35s ease}
a{text-decoration:none;color:inherit}
button,input,textarea,select{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0}
img,svg{max-width:100%;display:block}
*{-webkit-tap-highlight-color:transparent}
.site{position:relative;width:100%;overflow-x:clip}
::-webkit-scrollbar{width:7px;height:7px}
::-webkit-scrollbar-track{background:var(--scroll-track)}
::-webkit-scrollbar-thumb{background:linear-gradient(to bottom,#00f0ff,#ff007f,#7000ff);border-radius:999px}
.soft-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(circle at 15% 10%,rgba(0,240,255,.10),transparent 45%),radial-gradient(circle at 85% 35%,rgba(255,0,127,.08),transparent 45%),radial-gradient(circle at 25% 75%,rgba(112,0,255,.06),transparent 50%),radial-gradient(circle at 80% 95%,rgba(57,255,20,.05),transparent 45%)}
html[data-theme="dark"] .soft-bg{opacity:.5}

/* BOOT */
.boot{position:fixed;inset:0;z-index:9999;background:var(--bg);display:grid;place-items:center;align-content:center;gap:20px;transition:opacity .8s ease,visibility .8s ease;padding:24px;text-align:center}
.boot.done{opacity:0;visibility:hidden;pointer-events:none}
.boot-logo-wrap{display:flex;flex-direction:column;align-items:center;gap:0}
.boot-logo{font:900 clamp(80px,20vw,170px)/.9 "Syne";letter-spacing:-.05em;background:linear-gradient(135deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:bootPulse 2s ease-in-out infinite alternate}
@keyframes bootPulse{from{opacity:.75;transform:scale(.98)}to{opacity:1;transform:scale(1.02)}}
.boot-official{font:900 clamp(18px,4.5vw,32px)/1 "Syne";letter-spacing:.35em;color:var(--text);margin-top:-6px;padding-left:.35em;text-transform:uppercase;opacity:.85}
.boot-divider{width:70px;height:2px;background:linear-gradient(to right,transparent,#ff007f,transparent);margin:6px 0}
.boot-welcome{display:block;max-width:92vw;color:var(--text);font:800 clamp(15px,4vw,22px)/1.35 "Space Grotesk",sans-serif;letter-spacing:.05em;padding:0 12px}
.boot-welcome .accent{background:linear-gradient(120deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.boot-subtitle{max-width:340px;color:var(--text-soft);font:500 13px/1.6 "Outfit",sans-serif;margin:0;padding:0 12px}
.boot-track{width:min(300px,75vw);height:5px;background:var(--border);overflow:hidden;border-radius:99px;margin-top:6px}
.boot-track i{display:block;width:0%;height:100%;background:linear-gradient(to right,#00f0ff,#ff007f,#7000ff);border-radius:99px;transition:width .25s ease}
.boot-percent{font:900 26px "Syne";background:linear-gradient(120deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;min-height:30px;display:block;letter-spacing:-.02em}
.boot-status{font:700 10px "Space Grotesk";letter-spacing:.3em;color:var(--text-mute);text-transform:uppercase}

/* NAV */
.nav{position:fixed;z-index:100;top:10px;left:50%;transform:translateX(-50%);width:94%;max-width:1280px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;background:var(--nav-bg);border:1px solid var(--border);border-radius:999px;box-shadow:0 8px 24px -8px var(--shadow)}
@media(min-width:900px){.nav{height:64px;padding:0 20px}}
.brand{display:flex;align-items:center;gap:9px;min-width:0;flex:1 1 auto;overflow:hidden}
.brand-mark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#7000ff,#ff007f,#00f0ff);color:#fff;font:900 18px "Syne";flex:0 0 auto}
.brand b{display:block;font:800 13px "Syne";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.brand small{display:block;margin-top:1px;color:var(--text-mute);font:600 7px "Space Grotesk";letter-spacing:.18em;white-space:nowrap}
.nav nav{display:none;gap:22px;font:700 11px "Space Grotesk";letter-spacing:.1em;color:var(--text-soft)}
@media(min-width:1024px){.nav nav{display:flex}}
.nav-actions{display:flex;gap:6px;align-items:center;flex:0 0 auto}
.round{width:36px;height:36px;border:1px solid var(--border);background:var(--card);border-radius:50%;display:grid;place-items:center;color:var(--text);font-size:14px}

/* HERO — PROPER SPACING */
.hero{padding:110px 5vw 60px;position:relative;z-index:2;min-height:auto;display:flex;flex-direction:column;justify-content:center}
.hero-copy{position:relative;z-index:3;max-width:900px;width:100%}
.kicker{font:700 10px "Space Grotesk";letter-spacing:.22em;color:var(--text-mute);text-transform:uppercase;display:inline-block;margin-bottom:20px}
.hero h1{font:900 clamp(34px,9vw,140px)/1 "Syne";margin:0 0 28px;letter-spacing:-.045em;text-transform:uppercase;color:var(--text);display:flex;flex-direction:column;gap:6px}
.hero h1 .line{display:block;white-space:nowrap;line-height:1.05}
.hero h1 .line:first-child{font-size:clamp(20px,7.2vw,118px);letter-spacing:-.055em;background:linear-gradient(100deg,#111827 0%,#334155 28%,#6d28d9 58%,#db2777 82%,#0891b2 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.hero h1 .line.accent{font-size:clamp(30px,9vw,140px);background:linear-gradient(120deg,#7000ff 0%,#ff007f 45%,#00f0ff 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.hero p{max-width:520px;color:var(--text-soft);line-height:1.75;font-size:clamp(13px,1.4vw,15px);font-family:"Outfit",sans-serif;margin:0 0 28px}
.actions{display:flex;align-items:center;gap:10px;margin-top:0;flex-wrap:wrap}
.btn{border-radius:999px;padding:13px 20px;font:700 11px "Space Grotesk";letter-spacing:.1em;display:inline-flex;gap:8px;align-items:center;text-transform:uppercase;border:1px solid transparent;white-space:nowrap}
.btn.dark{background:#0f172a;color:#fff}
html[data-theme="dark"] .btn.dark{background:#f1f5f9;color:#0f172a}
.btn.ghost{background:var(--card);border-color:var(--border);color:var(--text)}

/* STORY — PROPER SPACING */
.story{padding:100px 5vw;position:relative;z-index:2}
@media(min-width:900px){.story{padding:140px 8vw;display:flex;align-items:center}}
.story-copy{max-width:720px;width:100%}
.story h2,.section-head h2,.about h2,.feedback h2{font:900 clamp(32px,8vw,105px)/1.05 "Syne";margin:0 0 24px;letter-spacing:-.035em;color:var(--text);text-transform:uppercase}
.story h2 .accent,.section-head h2 .accent,.about h2 .accent,.feedback h2 .accent{background:linear-gradient(120deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.story-copy p,.about-copy p{max-width:520px;color:var(--text-soft);line-height:1.85;font-size:clamp(13.5px,1.4vw,15px);font-family:"Outfit",sans-serif}
.story-data{display:none}
@media(min-width:900px){.story-data{display:grid;position:absolute;right:8vw;bottom:12vh;gap:10px}}
.story-data div{display:grid;grid-template-columns:50px 140px;border-top:1px solid var(--border);padding:12px 0}
.story-data b{font:700 11px "Space Grotesk";color:var(--text)}
.story-data span{font:700 9px "Space Grotesk";letter-spacing:.15em;color:var(--text-mute)}

/* SECTIONS */
.library,.trending-section,.apps-section,.source-section{padding:80px 4vw;position:relative;z-index:2}
@media(min-width:900px){.library,.trending-section,.apps-section,.source-section{padding:100px 6vw}}
.section-head,.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.header-left{flex:1 1 320px;min-width:0;max-width:680px}
.header-right{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;width:100%}
@media(min-width:900px){.header-right{width:auto;gap:30px}}
.header-stat{text-align:center;flex:1 1 0;min-width:60px}
@media(min-width:900px){.header-stat{text-align:right;flex:0 0 auto}}
.header-stat b{display:block;font:900 clamp(20px,3vw,34px)/1 "Syne";background:linear-gradient(120deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap;font-variant-numeric:tabular-nums}
.header-stat span{display:block;font:700 8px "Space Grotesk";letter-spacing:.16em;color:var(--text-mute);text-transform:uppercase;margin-top:6px;line-height:1.4}
.header-left .kicker{margin-bottom:10px;display:block}
.header-left h2{font:900 clamp(30px,7vw,80px)/1.05 "Syne";margin:0 0 16px;letter-spacing:-.035em;color:var(--text);text-transform:uppercase}
.header-desc{font:500 13.5px/1.7 "Outfit",sans-serif;color:var(--text-mute);margin:0;max-width:540px}

/* TOOLBAR */
.toolbar-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:20px;width:100%}
.toolbar-row .premium-searchbar{flex:1 1 100%;min-width:0;max-width:100%}
@media(min-width:700px){.toolbar-row .premium-searchbar{flex:1 1 300px;max-width:440px}}
.toolbar-row .sort-wrap{flex:1 1 calc(50% - 5px);min-width:0}
.toolbar-row .fav-chip-btn{flex:1 1 calc(50% - 5px);justify-content:center;min-height:44px}
.toolbar-row .live-status{flex:1 1 100%;justify-content:center}
@media(min-width:700px){.toolbar-row .sort-wrap{flex:0 0 auto;min-width:150px}.toolbar-row .fav-chip-btn{flex:0 0 auto;min-height:auto}.toolbar-row .live-status{flex:0 0 auto}}
.premium-searchbar{display:flex;align-items:center;gap:10px;padding:6px 6px 6px 14px;border:1px solid var(--border-strong);border-radius:14px;background:var(--card);box-shadow:0 4px 12px var(--shadow)}
.premium-searchbar svg{flex-shrink:0;color:var(--text-mute)}
.premium-searchbar input{width:100%;min-width:0;border:0;outline:0;background:transparent;padding:9px 0;font-size:13px;color:var(--text)}
.premium-searchbar input::placeholder{color:var(--text-mute)}
.premium-searchbar .search-btn{background:#0f172a;color:#fff;border-radius:10px;padding:10px 14px;font:700 10px "Space Grotesk";letter-spacing:.1em;white-space:nowrap;flex-shrink:0}
html[data-theme="dark"] .premium-searchbar .search-btn{background:#f1f5f9;color:#0f172a}
.sort-wrap{position:relative;display:inline-block;width:100%}
.sort-select{appearance:none;-webkit-appearance:none;border:1px solid var(--border-strong);background:var(--card);border-radius:12px;padding:11px 36px 11px 14px;font:700 10px "Space Grotesk";letter-spacing:.08em;color:var(--text-soft);width:100%}
.sort-wrap::after{content:"";position:absolute;right:14px;top:50%;width:7px;height:7px;border-right:2px solid var(--text-mute);border-bottom:2px solid var(--text-mute);transform:translateY(-70%) rotate(45deg);pointer-events:none}
.fav-chip-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border-strong);background:var(--card);border-radius:12px;padding:11px 14px;font:700 10px "Space Grotesk";letter-spacing:.08em;color:var(--text-soft)}
.fav-chip-btn.active{background:linear-gradient(135deg,#ff007f,#7000ff);color:#fff;border-color:transparent}
.fav-chip-btn .heart{color:#ff007f;font-size:13px}
.fav-chip-btn.active .heart{color:#fff}
.fav-chip-btn .fav-count{background:rgba(0,0,0,.08);border-radius:999px;padding:1px 7px;font-size:9px;font-weight:850;min-width:18px;text-align:center}
.live-status{display:inline-flex;align-items:center;gap:6px;padding:10px 13px;border-radius:12px;background:var(--card);border:1px solid var(--border);color:var(--text-mute);font:700 9.5px "Space Grotesk";letter-spacing:.08em;white-space:nowrap}
.live-status i{width:6px;height:6px;border-radius:50%;background:#ffb700;display:inline-block}
.live-status.ok i{background:#39ff14;box-shadow:0 0 8px rgba(57,255,20,.6)}
.live-status.err i{background:#ff007f}
.categories{display:flex;gap:7px;overflow-x:auto;padding:4px 0 22px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.categories::-webkit-scrollbar{display:none}
.cat{white-space:nowrap;border:1px solid var(--border-strong);background:var(--card);border-radius:10px;padding:9px 14px;font:700 9px "Space Grotesk";letter-spacing:.1em;color:var(--text-soft);flex:0 0 auto;display:inline-flex;align-items:center;gap:7px}
.cat.active,.cat:hover{background:#0f172a;color:#fff;border-color:#0f172a}
html[data-theme="dark"] .cat.active,html[data-theme="dark"] .cat:hover{background:#f1f5f9;color:#0f172a;border-color:#f1f5f9}
.cat .cat-count{background:rgba(0,0,0,.08);border-radius:999px;padding:2px 7px;font-size:8px;font-weight:850;min-width:18px;text-align:center}
.cat.active .cat-count,.cat:hover .cat-count{background:rgba(255,255,255,.25)}

/* GRIDS */
.tools,.apps-grid,.source-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%}
@media(min-width:640px){.tools,.apps-grid,.source-grid{gap:14px}}
@media(min-width:1024px){.tools,.apps-grid,.source-grid{grid-template-columns:repeat(3,1fr);gap:18px}}
@media(min-width:1400px){.tools,.apps-grid,.source-grid{grid-template-columns:repeat(4,1fr)}}
.row-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%}
@media(min-width:640px){.row-grid{grid-template-columns:repeat(3,1fr);gap:12px}}
@media(min-width:1024px){.row-grid{grid-template-columns:repeat(4,1fr);gap:14px}}
@media(min-width:1400px){.row-grid{grid-template-columns:repeat(5,1fr)}}

/* CARDS */
.compact-card,.tool,.app-card,.source-card{background:var(--card);border:1px solid var(--border);box-shadow:0 6px 18px -6px var(--shadow);display:flex;flex-direction:column;position:relative;overflow:hidden;min-width:0;cursor:pointer;border-radius:16px}
@media(min-width:640px){.compact-card,.tool,.app-card,.source-card{border-radius:20px}}
.compact-thumb{position:relative;height:105px;overflow:hidden;background:linear-gradient(135deg,#e2e8f0,#cbd5e1);flex-shrink:0}
@media(min-width:640px){.compact-thumb{height:135px}}
.compact-thumb img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;z-index:0}
.compact-thumb::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.6) 100%)}
.compact-thumb.no-img{display:grid;place-items:center;background:linear-gradient(135deg,rgba(0,240,255,.15),rgba(112,0,255,.15))}
.compact-thumb .compact-symbol{font:900 42px "Syne";color:#7000ff;opacity:.75;z-index:1;position:relative}
.tool-thumb,.source-hero{position:relative;height:115px;overflow:hidden;background:linear-gradient(135deg,#e2e8f0,#cbd5e1);flex-shrink:0}
.app-hero{position:relative;height:120px;overflow:hidden;background:linear-gradient(135deg,#e2e8f0,#cbd5e1);flex-shrink:0}
@media(min-width:640px){.tool-thumb,.source-hero{height:160px}.app-hero{height:180px}}
@media(min-width:1024px){.tool-thumb,.source-hero{height:180px}.app-hero{height:200px}}
.source-hero{background:linear-gradient(135deg,#0f172a,#1e293b)}
.tool-thumb img,.app-hero img,.source-hero img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;z-index:0}
.tool-thumb::after,.app-hero::after,.source-hero::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.65) 100%)}
.tool-thumb.no-img,.app-hero.no-img{display:grid;place-items:center;background:linear-gradient(135deg,rgba(0,240,255,.15),rgba(112,0,255,.15))}
.source-hero.no-img{display:grid;place-items:center;background:linear-gradient(135deg,#0f172a,#1e293b)}
.tool-thumb .thumb-symbol,.app-hero .app-symbol{font:900 52px "Syne";color:#7000ff;opacity:.75;z-index:1;position:relative}
html[data-theme="dark"] .tool-thumb .thumb-symbol,html[data-theme="dark"] .app-hero .app-symbol,html[data-theme="dark"] .compact-thumb .compact-symbol{color:#00f0ff;opacity:.85}
.source-hero .source-symbol{color:#00f0ff;font-size:44px;font-family:"Syne";font-weight:900;z-index:1;position:relative}
.tool-thumb .thumb-cat,.app-hero .thumb-cat,.source-hero .thumb-cat{position:absolute;left:10px;bottom:9px;right:10px;z-index:2;font:700 8.5px "Space Grotesk";letter-spacing:.14em;text-transform:uppercase;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(min-width:640px){.tool-thumb .thumb-cat,.app-hero .thumb-cat,.source-hero .thumb-cat{left:14px;bottom:12px;right:14px;font-size:9.5px}}
.badge-new{position:absolute;top:8px;left:8px;z-index:3;display:inline-flex;align-items:center;gap:3px;padding:3px 8px;font:900 7px "Space Grotesk";letter-spacing:.12em;text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#ffb700,#ff007f);border-radius:999px}
.premium-badge{position:absolute;top:8px;right:8px;z-index:3;padding:3px 8px;font:900 7px "Space Grotesk";letter-spacing:.12em;text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#7000ff,#ff007f);border-radius:999px}
.premium-badge::before{content:"♛";font-size:9px;margin-right:3px}
.lang-badge{position:absolute;top:8px;left:8px;z-index:3;padding:3px 8px;font:900 7px "Space Grotesk";letter-spacing:.12em;text-transform:uppercase;color:#fff;background:rgba(15,23,42,.85);border-radius:999px}
.lang-badge.html{background:linear-gradient(135deg,#e34c26,#f06529)}
.lang-badge.js{background:linear-gradient(135deg,#f7df1e,#e6c700);color:#0f172a}
.lang-badge.python{background:linear-gradient(135deg,#3776ab,#ffd43b)}
.lang-badge.css{background:linear-gradient(135deg,#2965f1,#264de4)}
.lang-badge.react{background:linear-gradient(135deg,#20232a,#61dafb)}
.lang-badge.php{background:linear-gradient(135deg,#777bb4,#4f5b93)}
.lang-badge.android{background:linear-gradient(135deg,#3ddc84,#2fb96d);color:#003d1e}
.lang-badge.node{background:linear-gradient(135deg,#539e43,#3c732f)}
.lang-badge.vue{background:linear-gradient(135deg,#41b883,#35495e)}
.thumb-actions{position:absolute;top:7px;right:7px;z-index:3;display:flex;gap:4px}
.thumb-actions button{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.95);color:#0f172a;display:grid;place-items:center;box-shadow:0 3px 8px rgba(0,0,0,.12);transition:transform .2s}
.thumb-actions button:active{transform:scale(.92)}
.thumb-actions .fav-btn.active{background:linear-gradient(135deg,#ff007f,#7000ff);color:#fff}
.thumb-actions .fav-btn.active svg{fill:#fff}
.thumb-actions svg{width:12px;height:12px}
@media(min-width:640px){.thumb-actions{top:10px;right:10px;gap:6px}.thumb-actions button{width:32px;height:32px}.thumb-actions svg{width:14px;height:14px}}
.app-icon-wrap{position:absolute;bottom:-22px;left:12px;z-index:4;width:52px;height:52px;border-radius:14px;background:var(--card);border:3px solid var(--bg-soft);box-shadow:0 8px 20px rgba(0,0,0,.15);overflow:hidden;display:grid;place-items:center;font:900 20px "Syne";color:#7000ff}
.app-icon-wrap img{width:100%;height:100%;object-fit:cover}
@media(min-width:640px){.app-icon-wrap{width:64px;height:64px;bottom:-28px;left:18px;border-radius:18px;font-size:24px}}

/* BODY */
.compact-body{padding:10px 11px 12px;display:flex;flex-direction:column;gap:6px;flex:1}
@media(min-width:640px){.compact-body{padding:14px;gap:8px}}
.compact-name{font:800 12px/1.25 "Plus Jakarta Sans";margin:0;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
@media(min-width:640px){.compact-name{font-size:14px}}
.compact-cat{display:inline-flex;align-self:flex-start;font:800 7px "Space Grotesk";letter-spacing:.12em;color:#7000ff;text-transform:uppercase;background:rgba(112,0,255,.1);padding:3px 7px;border-radius:6px}
html[data-theme="dark"] .compact-cat{color:#00f0ff;background:rgba(0,240,255,.1)}
.compact-stats{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:auto;padding-top:8px;border-top:1px solid var(--border);font:700 10px "Space Grotesk";color:var(--text-soft)}
.compact-stats .cstat{display:inline-flex;align-items:center;gap:3px}
.compact-stats .cstat.views .icon{color:#00f0ff;font-size:11px}
.compact-stats .cstat .star-filled{color:#ffb700;font-size:11px;letter-spacing:.5px}
.compact-stats .cstat .star-empty{color:var(--text-mute);font-size:11px;letter-spacing:.5px}
.compact-stats .cstat .rating-num{color:var(--text);font-weight:800}
.compact-stats .cstat .rating-cnt{color:var(--text-mute);font-weight:600;font-size:9px}
.tool-body,.app-body,.source-body{padding:11px 12px 12px;display:flex;flex-direction:column;flex:1;gap:7px}
.app-body{padding:28px 12px 12px;gap:6px}
@media(min-width:640px){.tool-body,.source-body{padding:16px 18px 18px;gap:9px}.app-body{padding:36px 18px 18px;gap:8px}}
.tool-name,.app-name,.source-name{font:800 13px/1.2 "Plus Jakarta Sans";letter-spacing:-.01em;margin:0;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.app-name,.source-name{-webkit-line-clamp:1}
@media(min-width:640px){.tool-name,.app-name,.source-name{font-size:16px}}
.app-dev,.source-dev{font:700 9px "Space Grotesk";letter-spacing:.08em;color:var(--text-mute);text-transform:uppercase;margin:0}
.tool-desc,.app-desc,.source-desc{font-size:10.5px;line-height:1.55;color:var(--text-soft);margin:0;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-family:"Outfit",sans-serif}
@media(min-width:640px){.tool-desc,.app-desc,.source-desc{font-size:11.5px}}
.tool-stats-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:7px 0;margin:2px 0 5px;border-top:1px solid var(--border)}
.tool-stat{display:inline-flex;align-items:center;gap:3px;font:700 9px "Space Grotesk";color:var(--text-soft)}
.tool-stat .icon{font-size:11px;line-height:1}
.tool-stat .star-filled{color:#ffb700;font-size:11px;letter-spacing:1px;line-height:1}
.tool-stat .star-empty{color:var(--text-mute);font-size:11px;letter-spacing:1px;line-height:1}
.tool-stat.views .icon{color:#00f0ff}
.tool-stat .rating-num{color:var(--text);font-weight:800;margin-left:2px}
.tool-stat .rating-cnt{color:var(--text-mute);font-weight:600;font-size:8px}
.tool-actions-3{display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:5px;margin-top:auto}
.tool-actions-3 button,.tool-actions-3 a{min-height:34px;padding:6px 3px;border-radius:9px;font:800 8px "Space Grotesk";letter-spacing:.04em;display:inline-flex;align-items:center;justify-content:center;gap:3px;white-space:nowrap;overflow:hidden;text-transform:uppercase;transition:.2s}
.tool-actions-3 .copy-btn{background:var(--input);color:var(--text)}
.tool-actions-3 .review-btn{background:linear-gradient(135deg,#ffb700,#ff007f);color:#fff;font-weight:800}
.tool-actions-3 .review-btn.rated{background:linear-gradient(135deg,#39ff14,#059669);color:#0f172a}
.tool-actions-3 .open-btn{background:#0f172a;color:#fff}
html[data-theme="dark"] .tool-actions-3 .open-btn{background:#f1f5f9;color:#0f172a}
@media(min-width:640px){.tool-actions-3{gap:8px}.tool-actions-3 button,.tool-actions-3 a{min-height:42px;padding:10px 4px;font-size:9px;letter-spacing:.06em;border-radius:11px}}
.app-actions,.source-actions{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:auto}
.app-actions button,.app-actions a,.source-actions button,.source-actions a{min-height:34px;padding:6px 4px;border-radius:9px;font:800 8px "Space Grotesk";letter-spacing:.04em;display:inline-flex;align-items:center;justify-content:center;gap:3px;white-space:nowrap;text-transform:uppercase;transition:.2s}
.app-actions button,.source-actions button{background:var(--input);color:var(--text)}
.app-actions .download-btn{background:#0f172a;color:#fff}
html[data-theme="dark"] .app-actions .download-btn{background:#f1f5f9;color:#0f172a}
.source-actions .download-btn{background:linear-gradient(135deg,#39ff14,#059669);color:#0f172a}
@media(min-width:640px){.app-actions,.source-actions{gap:8px}.app-actions button,.app-actions a,.source-actions button,.source-actions a{min-height:42px;padding:10px 6px;font-size:9px;letter-spacing:.06em;border-radius:11px}}
.app-meta,.source-meta{display:flex;gap:8px;flex-wrap:wrap;padding:7px 0;border-top:1px solid var(--border);margin:2px 0 5px}
.app-meta-item,.source-meta-item{display:inline-flex;align-items:center;gap:4px;font:700 9px "Space Grotesk";letter-spacing:.04em;color:var(--text-mute)}
.app-meta-item .star{color:#ffb700}
.empty{padding:60px 20px;text-align:center;font:700 11px "Space Grotesk";letter-spacing:.2em;color:var(--text-mute);border:1px dashed var(--border-strong);border-radius:22px;grid-column:1/-1;background:var(--card)}
.skeleton-card,.app-skeleton,.source-skeleton{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.sk-thumb,.app-sk-hero,.source-sk-hero{height:115px;background:linear-gradient(90deg,var(--border) 25%,var(--input) 50%,var(--border) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
.app-sk-hero{height:120px}
.sk-body,.app-sk-body,.source-sk-body{padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.app-sk-body{padding:30px 16px 16px}
.sk-line{height:10px;border-radius:5px;background:linear-gradient(90deg,var(--border) 25%,var(--input) 50%,var(--border) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
.sk-line.w40{width:40%}.sk-line.w90{width:90%}.sk-line.tall{height:18px;width:80%}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.platform-tabs{display:flex;gap:7px;flex-wrap:nowrap;margin:0 0 20px;padding-bottom:16px;border-bottom:1px solid var(--border);overflow-x:auto;scrollbar-width:none}
.platform-tabs::-webkit-scrollbar{display:none}
.platform-tab{padding:9px 14px;border-radius:11px;border:1px solid var(--border-strong);background:var(--card);font:700 9px "Space Grotesk";letter-spacing:.1em;color:var(--text-soft);text-transform:uppercase;display:inline-flex;align-items:center;gap:6px;flex-shrink:0;white-space:nowrap}
.platform-tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
html[data-theme="dark"] .platform-tab.active{background:#f1f5f9;color:#0f172a;border-color:#f1f5f9}
.trending-rows{display:grid;gap:52px;width:100%}
.row-head{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:18px;flex-wrap:wrap}
.row-head-left{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.row-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:20px;flex-shrink:0;color:#fff;background:#0f172a}
.row-icon.fire{background:linear-gradient(135deg,#ff007f,#7000ff)}
.row-icon.star{background:linear-gradient(135deg,#ffb700,#ff007f)}
.row-icon.spark{background:linear-gradient(135deg,#00f0ff,#7000ff)}
@media(min-width:640px){.row-icon{width:52px;height:52px;border-radius:16px;font-size:24px}}
.row-head h2{font:900 clamp(20px,4vw,38px)/1 "Syne";margin:0;letter-spacing:-.03em;color:var(--text);text-transform:uppercase}
.row-sub{font:700 9px "Space Grotesk";letter-spacing:.12em;color:var(--text-mute);text-transform:uppercase;margin-top:5px}
.rank-badge{position:absolute;top:8px;left:8px;z-index:3;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;font:900 11px "Space Grotesk";color:#fff;background:rgba(15,23,42,.85)}
.rank-badge.top1{background:linear-gradient(135deg,#ffb700,#ff007f)}
.rank-badge.top2{background:linear-gradient(135deg,#94a3b8,#475569)}
.rank-badge.top3{background:linear-gradient(135deg,#ff007f,#7000ff)}
.row-empty{padding:30px 20px;text-align:center;font:700 10px "Space Grotesk";letter-spacing:.16em;color:var(--text-mute);border:1px dashed var(--border-strong);border-radius:16px;grid-column:1/-1;background:var(--card)}
.about{padding:100px 5vw;display:grid;grid-template-columns:1fr;gap:40px;align-items:start;position:relative;z-index:2}
@media(min-width:1024px){.about{padding:140px 8vw;grid-template-columns:1.1fr .9fr;gap:5vw}}
.about-mark{display:block;width:100%;max-width:100%;text-align:center;word-break:break-word;font:900 clamp(64px,17vw,170px)/.9 "Syne";letter-spacing:-.055em;background:linear-gradient(115deg,#6d28d9 0%,#d4148e 48%,#168aad 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.about-mark i{display:block;margin-top:14px;font-family:"Syne","Space Grotesk",sans-serif;font-size:clamp(20px,6.4vw,54px);font-style:normal;font-weight:900;line-height:1.05;letter-spacing:.06em}
@media(min-width:1024px){.about-mark{text-align:left;font-size:clamp(90px,12vw,190px)}.about-mark i{font-size:clamp(34px,4vw,58px)}}
.about-copy{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:32px 24px;width:100%}
@media(min-width:1024px){.about-copy{border-radius:36px;padding:48px 42px}}
.about h2{font-size:clamp(28px,6.5vw,80px);line-height:1.05}
.about-copy p{max-width:100%;color:var(--text-soft);line-height:1.85;font-size:14px;font-family:"Outfit",sans-serif;margin-bottom:14px}
.about-copy p strong{color:var(--text);font-weight:800}
.stats{display:flex;gap:20px;margin-top:28px;flex-wrap:wrap}
.stats div{flex:1 1 70px;min-width:70px}
.stats b{display:block;font:900 clamp(20px,3vw,30px) "Syne";background:linear-gradient(120deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stats span{font:700 8.5px "Space Grotesk";letter-spacing:.14em;color:var(--text-mute)}
.feedback{padding:100px 5vw;display:grid;grid-template-columns:1fr;gap:40px;position:relative;z-index:2}
@media(min-width:1024px){.feedback{padding:140px 8vw;grid-template-columns:1fr 1fr;gap:6vw;align-items:center}}
.feedback-form{background:var(--card);border:1px solid var(--border);border-radius:22px;padding:26px 22px;display:grid;gap:14px}
@media(min-width:1024px){.feedback-form{border-radius:28px;padding:36px}}
.feedback-form input,.feedback-form textarea{border:1px solid var(--border-strong);background:var(--input);border-radius:13px;outline:0;padding:14px 16px;resize:vertical;width:100%;font-family:"Outfit",sans-serif;font-size:14px;color:var(--text)}
.feedback-form textarea{min-height:110px}
.feedback-form small{color:var(--text-mute);font:600 11px "Space Grotesk"}
footer{background:var(--card);color:var(--text-mute);padding:26px 5vw;display:flex;justify-content:space-between;gap:14px;font:700 10px "Space Grotesk";letter-spacing:.1em;flex-wrap:wrap;position:relative;z-index:2;border-top:1px solid var(--border);margin-top:40px}
footer b,footer a{color:var(--text)}
.drawer{position:fixed;z-index:300;right:0;top:0;bottom:0;width:min(360px,90vw);background:#0f172a;color:#fff;padding:72px 22px 30px;transform:translateX(105%);transition:transform .4s cubic-bezier(.2,.8,.2,1);overflow-y:auto;visibility:hidden;pointer-events:none}
html[data-theme="dark"] .drawer{background:#0a0f1c}
.drawer.open{transform:translateX(0);visibility:visible;pointer-events:auto}
.drawer-x{position:absolute;right:16px;top:14px;color:#fff;font-size:26px;padding:6px 10px}
.drawer .kicker{color:#64748b}
.drawer h2{font:900 clamp(26px,7vw,38px)/1.05 "Syne";margin:14px 0 26px;letter-spacing:-.035em}
.drawer h2 .line1{display:block;color:#fff;white-space:nowrap}
.drawer h2 .line2{display:block;background:linear-gradient(120deg,#00f0ff,#ff007f,#7000ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap}
.drawer-nav-link{display:flex;align-items:center;gap:11px;padding:13px 12px;border-radius:13px;border:1px solid rgba(255,255,255,.08);font:700 11px "Space Grotesk";letter-spacing:.06em;color:#fff;margin-bottom:6px;background:rgba(255,255,255,.04)}
.drawer-nav-link .dnav-icon{font-size:17px;flex-shrink:0}
.drawer-nav-link .dnav-text{flex:1;font-weight:800}
.drawer-nav-link .dnav-num{font:700 9px "Space Grotesk";letter-spacing:.14em;color:#64748b}
.drawer-nav-link.drawer-nav-apps{background:linear-gradient(135deg,#7000ff,#ff007f);border-color:transparent}
.drawer-nav-link.drawer-nav-source{background:linear-gradient(135deg,#39ff14,#059669);color:#0f172a;border-color:transparent}
.drawer-nav-link.drawer-nav-trending{background:linear-gradient(135deg,#ffb700,#ff007f);border-color:transparent}
.drawer-links{margin-top:18px;display:flex;flex-direction:column;gap:2px}
.drawer-links a{padding:12px 0;color:#94a3b8;font:700 11px "Space Grotesk";letter-spacing:.12em;min-height:44px;display:flex;align-items:center}
.shade{position:fixed;inset:0;z-index:250;background:rgba(15,23,42,.5);opacity:0;visibility:hidden;transition:.3s}
.shade.on{opacity:1;visibility:visible}
.toast{position:fixed;z-index:500;left:50%;bottom:20px;transform:translateX(-50%) translateY(100px);background:#0f172a;color:#fff;padding:12px 20px;border-radius:12px;font:700 12px "Space Grotesk";max-width:calc(100% - 30px);text-align:center;pointer-events:none;opacity:0;transition:transform .35s,opacity .35s}
html[data-theme="dark"] .toast{background:#f1f5f9;color:#0f172a}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}
.modal{position:fixed;inset:0;z-index:400;background:rgba(15,23,42,.6);display:grid;place-items:center;opacity:0;visibility:hidden;transition:.25s;padding:16px}
.modal.on{opacity:1;visibility:visible}
.modal-card{width:min(480px,100%);background:var(--card);border-radius:22px;padding:26px 22px;position:relative;max-height:calc(100vh - 32px);overflow-y:auto}
.modal-card>button{position:absolute;right:12px;top:12px;width:34px;height:34px;border-radius:50%;background:var(--input);font-size:18px;color:var(--text);display:grid;place-items:center}
.modal-card h3{font:900 22px/1.15 "Syne";margin:14px 0 8px;letter-spacing:-.03em;padding-right:40px;color:var(--text)}
.modal-card p{color:var(--text-soft);font-size:13px;line-height:1.7;margin:0 0 14px;font-family:"Outfit",sans-serif}
.modal-bar{height:3px;background:var(--border);margin-top:20px;overflow:hidden;border-radius:99px}
.modal-bar i{display:block;width:0;height:100%;background:linear-gradient(to right,#00f0ff,#ff007f,#7000ff)}
.modal.on .modal-bar i{animation:bar 1s linear forwards}
@keyframes bar{to{width:100%}}
.review-modal{position:fixed;inset:0;z-index:450;background:rgba(15,23,42,.7);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:.28s;padding:14px}
.review-modal.on{opacity:1;visibility:visible}
.review-modal-card{position:relative;width:min(440px,100%);max-height:calc(100vh - 28px);background:var(--card);border-radius:22px;padding:26px 18px 20px;overflow-y:auto;box-shadow:0 35px 90px rgba(15,23,42,.5);display:flex;flex-direction:column}
.review-close{position:absolute;right:12px;top:12px;width:34px;height:34px;border-radius:50%;background:var(--input);color:var(--text);font-size:18px;display:grid;place-items:center}
.review-kicker{font:800 9px "Space Grotesk";letter-spacing:.2em;color:#ff007f;text-transform:uppercase;display:flex;align-items:center;gap:6px;margin-bottom:12px;padding-right:40px}
.review-kicker .k-star{color:#ffb700;font-size:13px}
.review-tool-name{font:900 18px/1.25 "Syne";color:var(--text);margin:0 0 6px;padding-right:40px;letter-spacing:-.02em;word-wrap:break-word;max-width:100%}
.review-sub{font:700 9px "Space Grotesk";letter-spacing:.14em;color:var(--text-mute);text-transform:uppercase;margin-bottom:16px}
.review-star-row{display:flex;gap:4px;justify-content:center;margin:6px 0 12px;padding:12px 6px;background:var(--input);border-radius:14px}
.review-star-row button{min-width:44px;height:52px;flex:1 1 auto;max-width:56px;background:transparent;display:grid;place-items:center;border:0;border-radius:10px;font-size:38px;line-height:1;color:var(--text-mute);font-family:Arial;padding:0;transition:color .15s,transform .15s}
.review-star-row button:hover,.review-star-row button.active{color:#ffb700;transform:scale(1.1)}
.review-selected-text{text-align:center;font:800 10px "Space Grotesk";letter-spacing:.12em;color:#ff007f;min-height:16px;margin-bottom:14px;text-transform:uppercase}
.review-selected-text:empty::after{content:"TAP STARS TO SELECT"}
.review-input{width:100%;padding:13px 14px;background:var(--input);border:1.5px solid var(--border);border-radius:12px;font-size:13.5px;outline:0;font-family:"Outfit",sans-serif;resize:vertical;min-height:75px;max-height:130px;color:var(--text);line-height:1.55}
.review-input:focus{border-color:#00f0ff;background:var(--card)}
.review-submit{margin-top:16px;width:100%;padding:15px 18px;background:#0f172a;color:#fff;border-radius:12px;font:800 12px "Space Grotesk";letter-spacing:.14em;text-transform:uppercase;min-height:50px;display:flex;align-items:center;justify-content:center;transition:.2s}
html[data-theme="dark"] .review-submit{background:#f1f5f9;color:#0f172a}
.review-submit:disabled{opacity:.35;cursor:not-allowed}
.notification-btn{position:relative}
.notification-btn span{font-size:18px;transform:rotate(180deg);display:block}
.notification-btn b{position:absolute;right:6px;top:6px;width:8px;height:8px;border-radius:50%;background:#ff007f;border:2px solid var(--card);display:none}
.notification-btn.has-new b{display:block}
.notification-center{position:fixed;inset:0;z-index:650;background:rgba(15,23,42,.45);opacity:0;visibility:hidden;pointer-events:none;transition:.28s}
.notification-center.on{opacity:1;visibility:visible;pointer-events:auto}
.notification-shell{position:absolute;right:14px;top:76px;width:calc(100vw - 28px);max-height:calc(100vh - 100px);overflow:auto;background:var(--card);border-radius:22px;padding:20px 16px}
@media(min-width:640px){.notification-shell{right:24px;width:min(420px,calc(100vw - 48px));border-radius:26px;padding:24px 22px}}
.notification-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.notification-head h2{font:900 clamp(26px,6vw,42px)/.9 "Syne";margin:10px 0 0;letter-spacing:-.04em;color:var(--text);text-transform:uppercase}
.notification-close{width:34px;height:34px;border-radius:50%;background:#0f172a;color:#fff;font-size:20px;display:grid;place-items:center;flex-shrink:0}
html[data-theme="dark"] .notification-close{background:#f1f5f9;color:#0f172a}
.notification-meta{display:flex;justify-content:space-between;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin:18px 0 4px;padding:10px 0;font:700 9px "Space Grotesk";letter-spacing:.12em;color:var(--text-mute)}
.notification-list{display:grid;gap:8px;padding-top:10px}
.notification-item{display:grid;grid-template-columns:38px 1fr auto;gap:10px;padding:12px;border:1px solid var(--border);background:var(--input);border-radius:14px}
.notification-item.unread{box-shadow:inset 3px 0 #ff007f;background:var(--card)}
.notification-item-icon{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#7000ff,#ff007f);color:#fff;display:grid;place-items:center;font:900 14px "Syne"}
.notification-item h4{margin:2px 0 4px;font:800 12px/1.2 "Plus Jakarta Sans";color:var(--text)}
.notification-item p{margin:0;color:var(--text-soft);font-size:10.5px;font-family:"Outfit",sans-serif}
.notification-item time{font:700 8px "Space Grotesk";color:var(--text-mute);white-space:nowrap}
.notification-empty{padding:40px 12px;text-align:center;color:var(--text-mute);font:800 11px "Space Grotesk";letter-spacing:.14em}
.install-overlay{position:fixed;inset:0;z-index:700;background:rgba(15,23,42,.7);display:grid;place-items:center;padding:18px;animation:fadeIn .3s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.install-overlay[hidden]{display:none!important}
.install-card{position:relative;width:min(420px,100%);background:var(--card);border-radius:26px;padding:28px 22px;text-align:center;box-shadow:0 35px 90px rgba(15,23,42,.5);animation:slideUp .4s cubic-bezier(.2,.8,.2,1)}
@keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}
.install-icon{width:80px;height:80px;border-radius:20px;object-fit:cover;margin:0 auto 14px;display:block;box-shadow:0 12px 30px rgba(112,0,255,.3)}
.install-card h2{font:900 clamp(24px,6.5vw,38px)/1 "Syne";margin:12px 0;letter-spacing:-.04em;background:linear-gradient(120deg,#7000ff,#ff007f,#00f0ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-transform:uppercase}
.install-card p{font-size:13px;line-height:1.7;color:var(--text-soft);max-width:320px;margin:0 auto 22px;font-family:"Outfit",sans-serif}
.install-main{width:100%;justify-content:center;font-size:13px;padding:16px 20px}
.install-later{border:0;background:transparent;color:var(--text-mute);font:700 10px "Space Grotesk";letter-spacing:.12em;margin-top:14px;padding:8px}
.install-close{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:50%;background:var(--input);font-size:20px;color:var(--text);display:grid;place-items:center}
.back-to-top{position:fixed;z-index:180;right:14px;bottom:14px;width:42px;height:42px;border:1px solid var(--border-strong);border-radius:50%;background:var(--card);color:var(--text);display:grid;place-items:center;font:900 18px "Syne";opacity:0;visibility:hidden;transform:translateY(12px);transition:.25s}
.back-to-top.show{opacity:1;visibility:visible;transform:none}
@media(min-width:640px){.back-to-top{right:22px;bottom:22px;width:46px;height:46px;font-size:20px}}
@media(max-width:899px){
  .section-head,.sec-head{flex-direction:column;align-items:flex-start;gap:14px;margin-bottom:20px;padding-bottom:16px}
  .header-left{flex:1 1 100%;width:100%}
  .header-right{gap:12px;padding-top:4px;justify-content:space-between}
  .header-stat{text-align:center;flex:1 1 0}
  .header-stat b{font-size:22px}
}
@media (max-width: 639px) {
  .hero{padding:92px 16px 40px}
  .hero h1{gap:4px;margin:0 0 22px}
  .hero h1 .line:first-child{font-size:clamp(19px,6.8vw,34px);letter-spacing:-.06em}
  .hero h1 .line.accent{font-size:clamp(26px,8.2vw,48px)}
  .hero p{font-size:13px;line-height:1.6;margin-bottom:22px}
  .actions{gap:8px;margin-top:0}
  .btn{padding:11px 16px;font-size:10px}
  .library,.trending-section,.apps-section,.source-section{padding:40px 14px}
  .header-left h2{font-size:clamp(26px,7.5vw,40px);margin:0 0 12px}
  .premium-searchbar input{font-size:16px}
  .tools,.apps-grid,.source-grid,.row-grid{gap:8px}
  .compact-thumb{height:92px}
  .tool-thumb,.source-hero{height:100px}
  .app-hero{height:104px}
  .app-body{padding:25px 9px 10px;gap:5px}
  .app-icon-wrap{width:46px;height:46px;bottom:-18px;left:9px;border-radius:12px}
  .review-tool-name{font-size:16px}
  .review-star-row button{font-size:32px;min-width:38px;height:46px}
  .compact-stats{font-size:9px}
  .story{padding:60px 16px}
  .about,.feedback{padding:60px 16px}
  .trending-rows{gap:36px}
}
@media (max-width: 380px) {
  .hero h1 .line:first-child{font-size:clamp(17px,6.4vw,26px);letter-spacing:-.07em}
  .hero h1 .line.accent{font-size:clamp(23px,7.6vw,36px)}
}
`;

/* ============ HTML ============ */
const ZXH_HTML = `
<div class="soft-bg"></div>
<div id="boot" class="boot">
  <div class="boot-logo-wrap">
    <div class="boot-logo">ZXH</div>
    <div class="boot-official">OFFICIAL</div>
  </div>
  <div class="boot-divider"></div>
  <strong class="boot-welcome">Welcome to <span class="accent">ZXH OFFICIAL TOOLS</span> 🚀</strong>
  <p class="boot-subtitle">Your premium digital workspace — tools and utilities in one place.</p>
  <div class="boot-track"><i id="bootBar"></i></div>
  <span class="boot-percent" id="bootPercent">0%</span>
  <span class="boot-status" id="bootStatus">LOADING EXPERIENCE</span>
</div>
<div class="site">
  <header class="nav">
    <a class="brand" href="#home"><span class="brand-mark">Z</span><span><b id="brandName">ZXH OFFICIAL TOOLS</b><small>DIGITAL TOOL SYSTEM</small></span></a>
    <nav><a href="#home">HOME</a><a href="#trendingSection">TRENDING</a><a href="#library">TOOLS</a></nav>
    <div class="nav-actions">
      <button id="notificationBtn" class="round notification-btn" aria-label="Notifications"><span>♧</span><b id="notificationDot"></b></button>
      <button id="themeToggle" class="round" aria-label="Toggle theme"><span id="themeIcon">☼</span></button>
      <button id="menu" class="round" aria-label="Menu">☰</button>
    </div>
  </header>
  <aside id="drawer" class="drawer">
    <button id="drawerClose" class="drawer-x">×</button>
    <span class="kicker">ZXH / MENU</span>
    <h2><span class="line1">ZULQARNAIN</span><span class="line2">X HAIDER</span></h2>
    <a href="#home" class="drawer-nav-link"><span class="dnav-icon">🏠</span><span class="dnav-text">HOME</span><span class="dnav-num">01</span></a>
    <a href="#trendingSection" class="drawer-nav-link drawer-nav-trending"><span class="dnav-icon">🔥</span><span class="dnav-text">TRENDING</span><span class="dnav-num">02</span></a>
    <a href="#library" class="drawer-nav-link"><span class="dnav-icon">🛠️</span><span class="dnav-text">TOOLS</span><span class="dnav-num">03</span></a>
    <a href="#about" class="drawer-nav-link"><span class="dnav-icon">👤</span><span class="dnav-text">ABOUT</span><span class="dnav-num">06</span></a>
    <div class="drawer-links"><a id="ownerLink" href="#" target="_blank">OWNER CONTACT ↗</a><a id="channelLink" href="#" target="_blank">WHATSAPP CHANNEL ↗</a><a id="communityLink" href="#" target="_blank">COMMUNITY ↗</a></div>
  </aside>
  <div id="shade" class="shade"></div>
  <main>
    <section id="home" class="hero">
      <div class="hero-copy">
        <span class="kicker">01 / INTERACTIVE DIGITAL TOOLKIT ☠️🚀</span>
        <h1><span class="line">ZULQARNAIN</span><span class="line accent">X</span><span class="line accent">HAIDER.</span></h1>
        <p>Premium tools — all free, all fast, all mobile-friendly. Crafted with enterprise-grade architecture by ZXH.</p>
        <div class="actions"><a class="btn dark" href="#trendingSection">🔥 TRENDING <b>↘</b></a><a class="btn ghost" href="#library">EXPLORE <b>↘</b></a></div>
      </div>
    </section>
    <section class="story">
      <div class="story-copy"><span class="kicker">02 / THE EXPERIENCE</span><h2>ONE SPACE.<br><span class="accent">ENDLESS UTILITY.</span></h2><p>Every object, card and transition has its own space. Built with love, engineered for speed.</p></div>
      <div class="story-data"><div><b>01</b><span>FAST ACCESS</span></div><div><b>02</b><span>LIVE FIREBASE</span></div><div><b>03</b><span>RESPONSIVE</span></div></div>
    </section>
    <section id="trendingSection" class="trending-section">
      <div class="section-head"><div class="header-left"><span class="kicker">03 / DISCOVER</span><h2>TRENDING NOW.<br><span class="accent">HOT PICKS.</span></h2><p class="header-desc">Real-time trending tools, admin's featured picks & brand-new additions.</p></div></div>
      <div class="trending-rows">
        <div class="trending-row"><div class="row-head"><div class="row-head-left"><div class="row-icon fire">🔥</div><div><h2>TRENDING NOW</h2><div class="row-sub">Most viewed</div></div></div></div><div class="row-grid" id="trendingGrid"></div></div>
        <div class="trending-row"><div class="row-head"><div class="row-head-left"><div class="row-icon star">⭐</div><div><h2>FEATURED PICKS</h2><div class="row-sub">Handpicked by ZXH</div></div></div></div><div class="row-grid" id="featuredGrid"></div></div>
        <div class="trending-row"><div class="row-head"><div class="row-head-left"><div class="row-icon spark">✨</div><div><h2>JUST ADDED</h2><div class="row-sub">Fresh in last 7 days</div></div></div></div><div class="row-grid" id="newGrid"></div></div>
      </div>
    </section>
    <section id="library" class="library">
      <div class="section-head"><div class="header-left"><span class="kicker">04 / TOOL LIBRARY</span><h2>CHOOSE<br><span class="accent">YOUR FAVORITE TOOL.</span></h2></div><div class="header-right"><div class="header-stat"><b id="toolCount">0</b><span>TOOLS AVAILABLE</span></div></div></div>
      <div class="toolbar-row">
        <form class="premium-searchbar" id="searchForm" role="search" onsubmit="return false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg><input id="search" type="search" placeholder="Search tools…" autocomplete="off"><button class="search-btn" type="button" id="searchBtn">SEARCH</button></form>
        <div class="sort-wrap"><select class="sort-select" id="sortSelect"><option value="az">A → Z</option><option value="za">Z → A</option><option value="new">NEWEST FIRST</option></select></div>
        <button type="button" class="fav-chip-btn" id="favChipBtn"><span class="heart">❤</span><span>FAVORITES</span><span class="fav-count" id="favCount">0</span></button>
        <span class="live-status" id="firebaseStatus"><i></i> CONNECTING…</span>
      </div>
      <div id="categories" class="categories"></div>
      <div id="toolsGrid" class="tools"></div>
      <div id="empty" class="empty" hidden>NO TOOLS FOUND.</div>
    </section>
    <section id="about" class="about">
      <div class="about-mark">ZXH<i>OFFICIAL</i></div>
      <div class="about-copy">
        <span class="kicker">07 / THE MIND BEHIND ZXH</span>
        <h2>BUILT BY<br><span class="accent">ZULQARNAIN X HAIDER.</span></h2>
        <p><strong>ZXH OFFICIAL TOOLS</strong> is the vision of <strong>Zulqarnain X Haider</strong> — a developer-focused digital ecosystem created for high-vision brands, creators, and teams who demand enterprise-grade speed, clean architecture, and premium design.</p>
        <div class="stats"><div><b id="views">—</b><span>VISITS</span></div><div><b id="dbStatus">CHECKING</b><span>DATABASE</span></div><div><b>ZXH</b><span>FOUNDER</span></div></div>
      </div>
    </section>
    <section class="feedback">
      <div><span class="kicker">08 / FEEDBACK</span><h2>MAKE IT<br><span class="accent">BETTER.</span></h2><p style="max-width:400px;color:var(--text-soft);font-family:'Outfit',sans-serif;margin-top:14px">Have a suggestion or bug to report? Drop a message and help shape the future of ZXH.</p></div>
      <div class="feedback-form">
        <input id="email" type="email" placeholder="Your email">
        <textarea id="message" placeholder="Your feedback…"></textarea>
        <button id="send" class="btn dark" type="button" style="justify-content:center">SEND FEEDBACK ↗</button>
        <small id="feedbackStatus"></small>
      </div>
    </section>
  </main>
  <footer><b>ZXH OFFICIAL • ALL RIGHTS RESERVED ☠️🚀</b><span>© 2026 ZULQARNAIN X HAIDER</span><a id="footerChannel" href="#" target="_blank">JOIN CHANNEL ↗</a></footer>
  <div id="toast" class="toast"></div>
  <div id="modal" class="modal"><div class="modal-card"><button id="modalClose">×</button><span class="kicker">LOADING</span><h3 id="modalTitle">ZXH</h3><p id="modalDesc"></p><div class="modal-bar"><i></i></div></div></div>
  <div id="reviewModal" class="review-modal">
    <div class="review-modal-card">
      <button class="review-close" id="reviewClose" type="button">×</button>
      <div class="review-kicker"><span class="k-star">★</span> Rate this tool</div>
      <h2 class="review-tool-name" id="reviewTitle">Tool</h2>
      <div class="review-sub">Tap stars to rate</div>
      <div class="review-star-row" id="reviewStars">
        <button data-rating="1" type="button">★</button>
        <button data-rating="2" type="button">★</button>
        <button data-rating="3" type="button">★</button>
        <button data-rating="4" type="button">★</button>
        <button data-rating="5" type="button">★</button>
      </div>
      <div class="review-selected-text" id="reviewSelectedText"></div>
      <textarea class="review-input" id="reviewText" placeholder="Share your experience (optional)…" rows="3"></textarea>
      <button class="review-submit" id="reviewSubmit" type="button">Submit Review</button>
    </div>
  </div>
  <section id="notificationCenter" class="notification-center">
    <div class="notification-shell">
      <header class="notification-head"><div><span class="kicker">ZXH / UPDATES</span><h2>WHAT'S NEW.</h2></div><button id="notificationClose" class="notification-close">×</button></header>
      <div class="notification-meta"><span id="notificationSummary">LATEST UPDATES</span><span>LIVE</span></div>
      <div id="notificationList" class="notification-list"></div>
      <div id="notificationEmpty" class="notification-empty" hidden>YOU'RE ALL CAUGHT UP.</div>
    </div>
  </section>
  <div id="installPromptOverlay" class="install-overlay" hidden>
    <div class="install-card">
      <button id="installClose" class="install-close">×</button>
      <img src="/assets/icon-512.png" alt="ZXH" class="install-icon" onerror="this.style.display='none'">
      <span class="kicker">ZXH / APP</span>
      <h2>KEEP ZXH WITH YOU.</h2>
      <p id="installText">Install ZXH OFFICIAL TOOLS for the best app experience — fast, offline-ready, home screen icon.</p>
      <button id="installBtn" class="btn dark install-main">INSTALL NOW ↓</button>
      <button id="installLater" class="install-later">NOT NOW</button>
    </div>
  </div>
  <button id="backToTop" class="back-to-top" type="button">↑</button>
</div>
`;

function injectStyles() {
  const s = document.createElement('style');
  s.id = 'zxh-styles';
  s.textContent = ZXH_CSS;
  document.head.appendChild(s);
}
function injectHTML() {
  const root = document.getElementById('app');
  if (root) root.innerHTML = ZXH_HTML;
}

/* ============ STATE ============ */
let db = null;
let tools = [], notifications = [], settings = {};
let toolViews = {}, toolRatings = {};
let active = "All";
let searchDebounceTimer = null;
let deferredInstallPrompt = null;
let bootInterval = null;
let reviewTargetId = null, reviewRating = 0;

const FAV_KEY = 'zxh_favorites_v1';
let favorites = [];
try { favorites = JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); if (!Array.isArray(favorites)) favorites = []; } catch(_) { favorites = []; }
const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); } catch(_) {} };
const isFav = n => favorites.includes(n);

const RATED_KEY = 'zxh_rated_v1';
let ratedKeys = [];
try { ratedKeys = JSON.parse(localStorage.getItem(RATED_KEY) || '[]'); if (!Array.isArray(ratedKeys)) ratedKeys = []; } catch(_) { ratedKeys = []; }
const saveRated = () => { try { localStorage.setItem(RATED_KEY, JSON.stringify(ratedKeys)); } catch(_) {} };

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const arr = v => Array.isArray(v) ? v : Object.entries(v || {}).map(([id, x]) => ({ ...x, id }));

function toast(msg) {
  const t = $("toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(window._toast);
  window._toast = setTimeout(() => t.classList.remove("show"), 2400);
}
function isImg(v) { const s = String(v || ""); return s.startsWith("data:") || s.startsWith("http") || s.startsWith("/"); }
function fmt(n) { n = Number(n || 0); if (n >= 1000000) return (n/1000000).toFixed(1)+"M"; if (n >= 1000) return (n/1000).toFixed(1)+"K"; return String(n); }
function isNew(item) {
  if (!item) return false;
  if (item.isNew === true || item.badge === "new") return true;
  const c = item.createdAt;
  if (c) { const ts = typeof c === "number" ? c : Date.parse(c); if (ts && (Date.now() - ts) / 86400000 <= 7) return true; }
  return false;
}
function key(v) { return String(v || "").trim().toLocaleLowerCase("en-US"); }
function getViews(k) { return Number(toolViews[k] || 0); }
function getRating(k) { return Number(toolRatings[k]?.avg || 0); }
function getRatingCount(k) { return Number(toolRatings[k]?.count || 0); }
function starsText(avg) { const full = Math.round(Number(avg) || 0); return { filled: "★".repeat(full), empty: "☆".repeat(5 - full) }; }
function sortList(list, mode) {
  const s = [...list];
  if (mode === "az") s.sort((a,b) => key(a?.name).localeCompare(key(b?.name), "en", { numeric: true }));
  else if (mode === "za") s.sort((a,b) => key(b?.name).localeCompare(key(a?.name), "en", { numeric: true }));
  else if (mode === "new") s.sort((a,b) => (isNew(b)?1:0) - (isNew(a)?1:0));
  else if (mode === "downloads") s.sort((a,b) => Number(b?.downloads||0) - Number(a?.downloads||0));
  else if (mode === "stars") s.sort((a,b) => Number(b?.stars||0) - Number(a?.stars||0));
  return s;
}

/* ============ ANALYTICS ============ */
function getDevice() { const ua = navigator.userAgent; if (/tablet|ipad/i.test(ua)) return 'tablet'; if (/mobile|android|iphone/i.test(ua)) return 'mobile'; return 'desktop'; }
function getBrowser() { const ua = navigator.userAgent; if (ua.includes('Firefox')) return 'Firefox'; if (ua.includes('Edg')) return 'Edge'; if (ua.includes('Chrome')) return 'Chrome'; if (ua.includes('Safari')) return 'Safari'; return 'Other'; }
function todayKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
function getVisitorId() { let id = localStorage.getItem('zxh_visitor_id'); if (!id) { id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('zxh_visitor_id', id); } return id; }
async function trackSiteView() {
  if (!db) return;
  try {
    await db.ref('stats/views').transaction(v => (Number(v) || 0) + 1);
    const seenKey = 'zxh_seen_' + todayKey();
    if (!localStorage.getItem(seenKey)) { localStorage.setItem(seenKey, '1'); await db.ref('stats/uniqueVisitorCount').transaction(v => (Number(v) || 0) + 1); }
    const day = todayKey();
    await db.ref('stats/daily/' + day + '/visits').transaction(v => (Number(v) || 0) + 1);
  } catch (e) { console.warn(e); }
}
async function trackToolClick(toolId, toolName, category) {
  if (!db || !toolId) return;
  try {
    const day = todayKey();
    await db.ref('stats/tools/' + toolId).update({ name: toolName || '', category: category || '', lastClickedAt: Date.now() });
    await db.ref('stats/tools/' + toolId + '/clicks').transaction(v => (Number(v) || 0) + 1);
    if (category) { await db.ref('stats/categories/' + category).update({ name: category }); await db.ref('stats/categories/' + category + '/clicks').transaction(v => (Number(v) || 0) + 1); }
    await db.ref('stats/daily/' + day + '/toolClicks').transaction(v => (Number(v) || 0) + 1);
    await db.ref('stats/recentActivity').push({ type: 'click', toolId, toolName: toolName || '', category: category || '', device: getDevice(), browser: getBrowser(), timestamp: Date.now() });
  } catch (e) { console.warn(e); }
}
async function trackToolView(toolId, toolName, category) {
  if (!db || !toolId) return;
  try {
    const day = todayKey();
    await db.ref('stats/toolViews/' + toolId).transaction(v => (Number(v) || 0) + 1);
    await db.ref('stats/tools/' + toolId).update({ name: toolName || '', category: category || '', lastViewedAt: Date.now() });
    await db.ref('stats/tools/' + toolId + '/views').transaction(v => (Number(v) || 0) + 1);
    await db.ref('stats/daily/' + day + '/toolViews').transaction(v => (Number(v) || 0) + 1);
    await db.ref('stats/recentActivity').push({ type: 'view', toolId, toolName: toolName || '', category: category || '', device: getDevice(), browser: getBrowser(), timestamp: Date.now() });
  } catch (e) { console.warn(e); }
}
async function trackToolUse(toolId, toolName, category) {
  if (!db || !toolId) return;
  try {
    const day = todayKey();
    await db.ref('stats/tools/' + toolId).update({ name: toolName || '', category: category || '', lastUsedAt: Date.now() });
    await db.ref('stats/tools/' + toolId + '/uses').transaction(v => (Number(v) || 0) + 1);
    await db.ref('stats/daily/' + day + '/toolUses').transaction(v => (Number(v) || 0) + 1);
    await db.ref('stats/recentActivity').push({ type: 'use', toolId, toolName: toolName || '', category: category || '', device: getDevice(), browser: getBrowser(), timestamp: Date.now() });
  } catch (e) { console.warn(e); }
}
function startPresenceTracking() {
  if (!db) return;
  const visitorId = getVisitorId();
  const ref = db.ref('presence/' + visitorId);
  ref.onDisconnect().remove();
  ref.set({ online: true, device: getDevice(), browser: getBrowser(), path: location.pathname + location.hash, at: Date.now() });
  setInterval(() => ref.update({ online: true, path: location.pathname + location.hash, at: Date.now() }), 30000);
}
async function initAnalytics() { if (!db) return; await trackSiteView(); startPresenceTracking(); }

/* ============ FIREBASE INIT ============ */
async function initFirebase() {
  await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  let app; try { app = firebase.app(); } catch(_) { app = firebase.initializeApp(FIREBASE_CONFIG); }
  db = firebase.database(app);
  return db;
}

/* ============ RENDER ============ */
function renderSkeleton(container, n, cls) {
  const el = $(container); if (!el) return;
  el.replaceChildren();
  for (let i = 0; i < n; i++) {
    const sk = document.createElement("div"); sk.className = cls;
    const hero = cls === "app-skeleton" ? "app-sk-hero" : cls === "source-skeleton" ? "source-sk-hero" : "sk-thumb";
    const body = cls === "app-skeleton" ? "app-sk-body" : cls === "source-skeleton" ? "source-sk-body" : "sk-body";
    sk.innerHTML = '<div class="'+hero+'"></div><div class="'+body+'"><div class="sk-line w40"></div><div class="sk-line tall"></div><div class="sk-line w90"></div></div>';
    el.appendChild(sk);
  }
}
function renderTrendingRows() {
  const trend = [...tools].sort((a,b) => getViews(b?.id) - getViews(a?.id)).filter(t => getViews(t?.id) > 0).slice(0,10);
  renderCompactRow("trendingGrid", trend.length ? trend : tools.slice(0,10), true);
  const featured = tools.filter(t => t?.featured === true).slice(0,10);
  renderCompactRow("featuredGrid", featured.length ? featured : tools.slice(0,10), false);
  const newItems = tools.filter(t => isNew(t)).slice(0,10);
  renderCompactRow("newGrid", newItems, false);
}
function renderCompactRow(containerId, list, showRank) {
  const el = $(containerId); if (!el) return;
  if (!list.length) { el.innerHTML = '<div class="row-empty">NOTHING HERE YET</div>'; return; }
  el.innerHTML = list.map((t, i) => {
    const name = t?.name || "UNTITLED";
    const cat = t?.category || "Other";
    const raw = String(t?.icon || "✦");
    const img = isImg(raw);
    const thumb = img ? '<img src="'+esc(raw)+'" alt="'+esc(name)+'" loading="lazy" onerror="this.remove();this.parentElement.classList.add(\'no-img\')">' : '<span class="compact-symbol">'+esc(raw.slice(0,3))+'</span>';
    const nf = isNew(t);
    const rankCls = i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : "";
    const views = getViews(t.id);
    const rating = getRating(t.id);
    const ratingCnt = getRatingCount(t.id);
    const st = starsText(rating);
    return '<article class="compact-card" data-id="'+esc(t.id)+'">'
      + '<div class="compact-thumb '+(img?"":"no-img")+'">'
      + thumb
      + (showRank ? '<span class="rank-badge '+rankCls+'">'+(i+1)+'</span>' : "")
      + (nf ? '<span class="badge-new">NEW</span>' : "")
      + '<div class="thumb-actions">'
      + '<button type="button" class="share-btn" data-share="'+esc(name)+'" data-share-id="'+esc(t.id)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg></button>'
      + '</div>'
      + '</div>'
      + '<div class="compact-body">'
      + '<h3 class="compact-name">'+esc(name)+'</h3>'
      + '<span class="compact-cat">'+esc(cat)+'</span>'
      + '<div class="compact-stats">'
      + '<span class="cstat views"><span class="icon">👁</span> '+fmt(views)+'</span>'
      + (rating > 0
          ? '<span class="cstat"><span class="star-filled">'+st.filled+'</span><span class="star-empty">'+st.empty+'</span> <span class="rating-num">'+rating.toFixed(1)+'</span>' + (ratingCnt > 0 ? ' <span class="rating-cnt">('+ratingCnt+')</span>' : '') + '</span>'
          : '<span class="cstat" style="opacity:.55">No ratings</span>')
      + '</div>'
      + '</div></article>';
  }).join("");
  el.querySelectorAll(".compact-card").forEach(node => {
    const id = node.dataset.id;
    const t = list.find(x => x.id === id);
    if (!t) return;
    node.onclick = e => {
      if (e.target.closest(".thumb-actions")) return;
      openTool(t);
    };
  });
  el.querySelectorAll(".share-btn").forEach(b => { b.onclick = e => { e.stopPropagation(); shareTool(b.dataset.shareId, b.dataset.share); }; });
}
function renderCategories() {
  const b = $("categories"); if (!b) return;
  const cats = new Map();
  tools.forEach(t => { const c = t?.category || "Other"; cats.set(c, (cats.get(c)||0)+1); });
  const vis = [{name:"All",count:tools.length}, ...[...cats.entries()].map(([name,count]) => ({name,count}))];
  b.innerHTML = vis.map(({name,count}) => '<button class="cat '+(name===active?"active":"")+'" data-cat="'+esc(name)+'">'+esc(name)+'<span class="cat-count">'+count+'</span></button>').join("");
  b.querySelectorAll(".cat").forEach(x => { x.onclick = () => { active = x.dataset.cat; renderCategories(); renderTools(); }; });
}
function renderTools() {
  const el = $("toolsGrid"); if (!el) return;
  const q = ($("search")?.value || "").toLowerCase().trim();
  let list = tools.filter(t => {
    const c = t?.category || "Other";
    if (active === "__favorites__") { if (!isFav(t?.name||"")) return false; }
    else if (active !== "All" && c !== active) return false;
    if (q) { const h = (t?.name||"") + " " + (t?.description||"") + " " + c; if (!h.toLowerCase().includes(q)) return false; }
    return true;
  });
  list = sortList(list, $("sortSelect")?.value || "az");
  const cEl = $("toolCount"); if (cEl) cEl.textContent = list.length;
  const empty = $("empty"); if (empty) empty.hidden = list.length > 0;
  el.innerHTML = list.map(t => {
    const name = t?.name || "UNTITLED";
    const cat = t?.category || "Other";
    const desc = t?.description || "ZXH utility.";
    const nf = isNew(t), fav = isFav(name);
    const raw = String(t?.icon || "✦");
    const img = isImg(raw);
    const thumb = img ? '<img src="'+esc(raw)+'" alt="'+esc(name)+'" loading="lazy" onerror="this.remove();this.parentElement.classList.add(\'no-img\')">' : '<span class="thumb-symbol">'+esc(raw.slice(0,4))+'</span>';
    const views = getViews(t.id);
    const rating = getRating(t.id);
    const ratingCnt = getRatingCount(t.id);
    const alreadyRated = ratedKeys.includes(t.id);
    const st = starsText(rating);
    return '<article class="tool" data-id="'+esc(t.id)+'">'
      + '<div class="tool-thumb '+(img?"":"no-img")+'">'
      + thumb + (nf?'<span class="badge-new">NEW</span>':"")
      + '<div class="thumb-actions">'
      + '<button type="button" class="share-btn" data-share="'+esc(name)+'" data-share-id="'+esc(t.id)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg></button>'
      + '<button type="button" class="fav-btn'+(fav?" active":"")+'" data-fav="'+esc(name)+'"><svg viewBox="0 0 24 24" fill="'+(fav?"currentColor":"none")+'" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9Z"/></svg></button>'
      + '</div>'
      + '<span class="thumb-cat">'+esc(cat)+'</span></div>'
      + '<div class="tool-body">'
      + '<h3 class="tool-name">'+esc(name)+'</h3>'
      + '<p class="tool-desc">'+esc(desc)+'</p>'
      + '<div class="tool-stats-row">'
      + '<span class="tool-stat views"><span class="icon">👁</span> '+fmt(views)+'</span>'
      + '<span class="tool-stat">'
      + (rating > 0
          ? '<span class="star-filled">'+st.filled+'</span><span class="star-empty">'+st.empty+'</span><span class="rating-num">'+rating.toFixed(1)+'</span>' + (ratingCnt > 0 ? '<span class="rating-cnt">('+ratingCnt+')</span>' : '')
          : '<span style="opacity:.55">No ratings</span>')
      + '</span>'
      + '</div>'
      + '<div class="tool-actions-3">'
      + '<button type="button" class="copy-btn" data-copy="'+esc(t.link||t.url||"#")+'" data-copy-label="'+esc(name)+'">COPY</button>'
      + '<button type="button" class="review-btn'+(alreadyRated?" rated":"")+'" data-review-id="'+esc(t.id)+'" data-review-name="'+esc(name)+'">'+(alreadyRated?'RATED ✓':'RATE ★')+'</button>'
      + '<a class="open-btn" href="#" data-open="'+esc(t.id)+'">OPEN ↗</a>'
      + '</div></div></article>';
  }).join("");
  el.querySelectorAll(".tool").forEach(node => {
    const id = node.dataset.id;
    const t = list.find(x => x.id === id);
    if (!t) return;
    node.onclick = e => {
      if (e.target.closest(".thumb-actions") || e.target.closest(".tool-actions-3")) return;
      openTool(t);
    };
  });
  el.querySelectorAll(".share-btn").forEach(b => { b.onclick = e => { e.stopPropagation(); shareTool(b.dataset.shareId, b.dataset.share); }; });
  el.querySelectorAll(".fav-btn").forEach(b => { b.onclick = e => { e.stopPropagation(); toggleFav(b.dataset.fav, b); }; });
  el.querySelectorAll(".copy-btn").forEach(b => { b.onclick = e => { e.stopPropagation(); copy(b.dataset.copy, b.dataset.copyLabel); }; });
  el.querySelectorAll(".review-btn").forEach(b => { b.onclick = e => { e.stopPropagation(); openReview(b.dataset.reviewId, b.dataset.reviewName); }; });
  el.querySelectorAll(".open-btn").forEach(a => { a.onclick = e => { e.preventDefault(); e.stopPropagation(); const t = list.find(x => x.id === a.dataset.open); if (t) openItem(t); }; });
}

/* ============ REVIEW ============ */
function openReview(id, name) {
  if (!id) { toast("Cannot review"); return; }
  if (ratedKeys.includes(id)) { toast("Already rated ❤"); return; }
  reviewTargetId = id;
  reviewRating = 0;
  $("reviewTitle").textContent = name || "Tool";
  $("reviewText").value = "";
  $("reviewSelectedText").textContent = "";
  document.querySelectorAll("#reviewStars button").forEach(b => b.classList.remove("active"));
  $("reviewModal").classList.add("on");
  document.body.style.overflow = "hidden";
}
function closeReview() {
  $("reviewModal").classList.remove("on");
  document.body.style.overflow = "";
}
function setupReviewStars() {
  document.querySelectorAll("#reviewStars button").forEach(btn => {
    btn.onclick = () => {
      reviewRating = Number(btn.dataset.rating);
      document.querySelectorAll("#reviewStars button").forEach(b => { b.classList.toggle("active", Number(b.dataset.rating) <= reviewRating); });
      const labels = ["","Poor","Fair","Good","Very Good","Excellent"];
      $("reviewSelectedText").textContent = labels[reviewRating] + " · " + reviewRating + "/5";
    };
  });
  $("reviewClose").onclick = closeReview;
  $("reviewModal").onclick = e => { if (e.target === $("reviewModal")) closeReview(); };
  $("reviewSubmit").onclick = async () => {
    if (!reviewRating) { toast("Tap stars first"); return; }
    if (!reviewTargetId || !db) { toast("Firebase offline"); return; }
    const btn = $("reviewSubmit"); btn.disabled = true; btn.textContent = "Submitting…";
    try {
      let uid = localStorage.getItem("zxh_user_id");
      if (!uid) { uid = Math.random().toString(36).slice(2); localStorage.setItem("zxh_user_id", uid); }
      await db.ref("reviews/" + reviewTargetId).push({
        rating: reviewRating,
        text: $("reviewText").value.trim(),
        uid: uid,
        at: Date.now()
      });
      ratedKeys.push(reviewTargetId);
      saveRated();
      toast("Thanks for rating! ❤");
      closeReview();
      await loadRatings();
      renderTools();
      renderTrendingRows();
    } catch (e) {
      toast("Error: " + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Submit Review";
    }
  };
}
async function loadRatings() {
  try {
    if (!db) return;
    const snap = await db.ref("reviews").once("value");
    const raw = snap.val() || {};
    const agg = {};
    Object.entries(raw).forEach(([toolId, entries]) => {
      const list = Array.isArray(entries) ? entries : Object.values(entries || {});
      let sum = 0, count = 0;
      list.forEach(r => { if (Number(r.rating) > 0) { sum += Number(r.rating); count++; } });
      agg[toolId] = { avg: count ? sum / count : 0, count };
    });
    toolRatings = agg;
  } catch(e) { console.warn(e); }
}

/* ============ ACTIONS ============ */
function toggleFav(name, btn) {
  if (isFav(name)) { favorites = favorites.filter(f => f !== name); if (btn) btn.classList.remove("active"); toast("Removed"); }
  else { favorites.push(name); if (btn) btn.classList.add("active"); toast("Added ❤"); }
  saveFavs();
  const c = $("favCount"); if (c) c.textContent = favorites.length;
  if (active === "__favorites__") renderTools();
}
function copy(text, label) {
  if (!text || text === "#") { toast("No link"); return; }
  const done = () => toast("Copied" + (label ? ": " + label : ""));
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallback(text, done));
  else fallback(text, done);
}
function fallback(text, cb) { try { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); cb(); } catch(_) {} }
async function shareTool(id, name) {
  const url = location.origin + '/?tool=' + id;
  if (navigator.share) {
    try {
      await navigator.share({ title: name + ' — ZXH Official Tools', text: 'Check out ' + name + ' on ZXH', url: url });
      toast("Shared ✓");
      return;
    } catch (err) { if (err.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(url); toast("Link copied ✓"); }
  catch (_) { fallback(url, () => toast("Link copied ✓")); }
}
function openTool(t) {
  trackToolClick(t.id, t.name, t.category);
  openItem(t);
}
function openItem(t) {
  const url = t.link || t.url || t.downloadUrl;
  if (!url) { toast("No URL configured"); return; }
  trackToolView(t.id, t.name, t.category);
  const mt = $("modalTitle"), md = $("modalDesc"), m = $("modal");
  if (mt) mt.textContent = t.name || "ZXH";
  if (md) md.textContent = t.description || "Opening…";
  if (m) m.classList.add("on");
  setTimeout(() => {
    trackToolUse(t.id, t.name, t.category);
    window.open(url, "_blank", "noopener,noreferrer");
    if (m) m.classList.remove("on");
  }, 700);
}

/* ============ DATA LOAD ============ */
async function loadAllData() {
  try {
    if (!db) await initFirebase();
    const [tSnap, setSnap, nSnap, vSnap, rSnap, viewsSnap] = await Promise.all([
      db.ref("/tools").once("value").catch(() => null),
      db.ref("/settings").once("value").catch(() => null),
      db.ref("/notifications").once("value").catch(() => null),
      db.ref("/stats/toolViews").once("value").catch(() => null),
      db.ref("/reviews").once("value").catch(() => null),
      db.ref("/stats/views").once("value").catch(() => null)
    ]);
    tools = arr(tSnap?.val());
    settings = setSnap?.val() || {};
    notifications = arr(nSnap?.val()).sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    toolViews = vSnap?.val() || {};
    const reviews = rSnap?.val() || {};
    const agg = {};
    Object.entries(reviews).forEach(([k, entries]) => {
      const list = Array.isArray(entries) ? entries : Object.values(entries || {});
      let sum = 0, count = 0;
      list.forEach(r => { if (Number(r.rating) > 0) { sum += Number(r.rating); count++; } });
      agg[k] = { avg: count ? sum / count : 0, count };
    });
    toolRatings = agg;
    const viewsVal = Number(viewsSnap?.val()) || 0;
    const vEl = $("views"); if (vEl) vEl.textContent = viewsVal.toLocaleString();
    if (settings.site_title) { const b = $("brandName"); if (b) b.textContent = settings.site_title; }
    ["ownerLink:owner_contact_link","channelLink:whatsapp_channel_link","communityLink:whatsapp_group_link","footerChannel:whatsapp_channel_link"].forEach(pair => {
      const [id, k] = pair.split(":");
      if ($(id) && settings[k]) $(id).href = settings[k];
    });
    const f = $("firebaseStatus"); if (f) { f.classList.remove("err"); f.classList.add("ok"); f.innerHTML = '<i></i> ' + tools.length + ' TOOLS'; }
    const ds = $("dbStatus"); if (ds) ds.textContent = "LIVE";
    renderCategories(); renderTools(); renderTrendingRows();
    updateNotifsUI();
    db.ref("/tools").on("value", s => { tools = arr(s.val()); renderCategories(); renderTools(); renderTrendingRows(); });
    db.ref("/stats/toolViews").on("value", s => { toolViews = s.val() || {}; renderTools(); renderTrendingRows(); });
    db.ref("/stats/views").on("value", s => { const v = $("views"); if (v) v.textContent = Number(s.val() || 0).toLocaleString(); });
    db.ref("/reviews").on("value", s => {
      const raw = s.val() || {}; const agg = {};
      Object.entries(raw).forEach(([k, entries]) => {
        const list = Array.isArray(entries) ? entries : Object.values(entries || {});
        let sum = 0, count = 0;
        list.forEach(r => { if (Number(r.rating) > 0) { sum += Number(r.rating); count++; } });
        agg[k] = { avg: count ? sum / count : 0, count };
      });
      toolRatings = agg;
      renderTools();
      renderTrendingRows();
    });
    db.ref("/notifications").on("value", s => { notifications = arr(s.val()).sort((a,b) => (b.createdAt||0) - (a.createdAt||0)); updateNotifsUI(); });
  } catch (e) {
    console.warn(e);
    const ds = $("dbStatus"); if (ds) ds.textContent = "OFFLINE";
    ["firebaseStatus","appsFirebaseStatus","sourceFirebaseStatus"].forEach(id => {
      const el = $(id); if (el) { el.classList.remove("ok"); el.classList.add("err"); el.innerHTML = "<i></i> OFFLINE"; }
    });
  }
}
function updateNotifsUI() {
  const list = $("notificationList"), empty = $("notificationEmpty"), btn = $("notificationBtn");
  if (!list || !empty) return;
  if (btn) btn.classList.toggle("has-new", notifications.length > 0);
  if (!notifications.length) { list.innerHTML = ""; empty.hidden = false; return; }
  empty.hidden = true;
  list.innerHTML = notifications.slice(0,20).map((n) => {
    const time = n.createdAt ? new Date(n.createdAt).toLocaleString("en",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "NOW";
    return '<div class="notification-item unread"><div class="notification-item-icon">✦</div><div><h4>'+esc(n.title||"UPDATE")+'</h4><p>'+esc(n.text||n.message||"")+'</p></div><time>'+esc(time)+'</time></div>';
  }).join("");
}

/* ============ INSTALL PROMPT — FORCE SHOW AFTER 5 SECONDS ============ */
function setupInstallPrompt() {
  const btn = $("installBtn");
  const later = $("installLater");
  const close = $("installClose");
  const overlay = $("installPromptOverlay");
  const textEl = $("installText");
  if (!btn || !overlay) return;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

  if (isStandalone()) { overlay.hidden = true; return; }

  // Capture native install prompt when available
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('[ZXH] Install prompt captured');
  });

  // ALWAYS show popup after 5 seconds
  setTimeout(() => {
    if (isStandalone()) return;
    if (localStorage.getItem('zxhInstalled') === '1') return;
    if (isIOS()) {
      if (textEl) textEl.textContent = 'iPhone: Tap the Share ↑ button → "Add to Home Screen" to install ZXH.';
      btn.textContent = 'HOW TO INSTALL ↗';
    }
    overlay.hidden = false;
    console.log('[ZXH] Install popup shown');
  }, 5000);

  btn.onclick = async () => {
    if (isIOS()) {
      alert('iPhone Install:\n\n1. Tap Share (□↑) at the bottom\n2. Scroll → "Add to Home Screen"\n3. Tap "Add"');
      return;
    }
    if (deferredInstallPrompt) {
      btn.disabled = true;
      btn.textContent = 'INSTALLING…';
      try {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (choice.outcome === 'accepted') {
          localStorage.setItem('zxhInstalled', '1');
          overlay.hidden = true;
          toast('✅ ZXH installed!');
        } else {
          btn.disabled = false;
          btn.textContent = 'INSTALL NOW ↓';
          toast('Install cancelled');
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'INSTALL NOW ↓';
        toast('Please try again');
      }
      return;
    }
    toast('Chrome menu (⋮) → "Install app"');
  };

  if (later) later.onclick = () => { overlay.hidden = true; localStorage.setItem('zxhInstallDismissed', '1'); };
  if (close) close.onclick = () => { overlay.hidden = true; localStorage.setItem('zxhInstallDismissed', '1'); };

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    localStorage.setItem('zxhInstalled', '1');
    overlay.hidden = true;
    toast('✅ App installed!');
  });
}

/* ============ UI SETUP ============ */
function setupTheme() {
  const root = document.documentElement;
  const btn = $("themeToggle"), icon = $("themeIcon"), meta = $("metaTheme");
  if (!btn) return;
  const saved = localStorage.getItem("zxhTheme");
  const set = t => {
    if (t === "dark") { root.setAttribute("data-theme","dark"); if (icon) icon.textContent = "☾"; if (meta) meta.setAttribute("content","#0a0f1c"); }
    else { root.removeAttribute("data-theme"); if (icon) icon.textContent = "☼"; if (meta) meta.setAttribute("content","#f1f5f9"); }
    localStorage.setItem("zxhTheme", t);
  };
  set(saved === "dark" ? "dark" : "light");
  btn.onclick = () => set(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
}
function setupBackToTop() {
  const b = $("backToTop"); if (!b) return;
  const upd = () => b.classList.toggle("show", scrollY > 500);
  window.addEventListener("scroll", upd, { passive: true });
  upd();
  b.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
}
function setupUI() {
  $("search")?.addEventListener("input", () => { clearTimeout(searchDebounceTimer); searchDebounceTimer = setTimeout(renderTools, 300); });
  $("searchBtn")?.addEventListener("click", renderTools);
  $("searchForm")?.addEventListener("submit", e => { e.preventDefault(); renderTools(); });
  $("sortSelect")?.addEventListener("change", renderTools);
  $("favChipBtn")?.addEventListener("click", () => { active = active === "__favorites__" ? "All" : "__favorites__"; renderCategories(); renderTools(); });
  $("menu")?.addEventListener("click", () => { $("drawer").classList.add("open"); $("shade").classList.add("on"); });
  const close = () => { $("drawer").classList.remove("open"); $("shade").classList.remove("on"); };
  $("drawerClose")?.addEventListener("click", close);
  $("shade")?.addEventListener("click", close);
  document.querySelectorAll(".drawer a[href^='#']").forEach(a => a.addEventListener("click", close));
  $("modalClose")?.addEventListener("click", () => $("modal").classList.remove("on"));
  $("modal")?.addEventListener("click", e => { if (e.target === $("modal")) $("modal").classList.remove("on"); });
  $("notificationBtn")?.addEventListener("click", e => { e.stopPropagation(); $("notificationCenter").classList.add("on"); });
  $("notificationClose")?.addEventListener("click", () => $("notificationCenter").classList.remove("on"));
  $("send")?.addEventListener("click", async () => {
    const email = $("email")?.value.trim(), msg = $("message")?.value.trim();
    const st = $("feedbackStatus");
    if (!email || !msg) { if (st) st.textContent = "Enter email & feedback."; return; }
    if (!db) { if (st) st.textContent = "Not connected"; return; }
    try {
      await db.ref("comments").push({ email, message: msg, timestamp: new Date().toISOString() });
      $("email").value = ""; $("message").value = "";
      if (st) st.textContent = "Sent ✓"; toast("Feedback sent");
    } catch(_) { if (st) st.textContent = "Error."; }
  });
  setupTheme(); setupBackToTop(); setupInstallPrompt(); setupReviewStars();
  const params = new URLSearchParams(location.search);
  const toolId = params.get('tool');
  if (toolId) setTimeout(() => { const t = tools.find(x => x.id === toolId); if (t) openItem(t); }, 2500);
}

/* ============ BOOT ============ */
function runBootProgress() {
  const bar = $("bootBar"), pct = $("bootPercent"), status = $("bootStatus"), boot = $("boot");
  if (!bar || !pct || !boot) return;
  const steps = [
    { at: 15, label: "INITIALIZING" },
    { at: 35, label: "CONNECTING FIREBASE" },
    { at: 55, label: "LOADING TOOLS" },
    { at: 100, label: "READY" }
  ];
  let progress = 0, stepIdx = 0;
  bootInterval = setInterval(() => {
    const inc = progress < 40 ? 4 : progress < 75 ? 3 : progress < 95 ? 2 : 1;
    progress = Math.min(100, progress + inc);
    bar.style.width = progress + "%";
    pct.textContent = progress + "%";
    while (stepIdx < steps.length && progress >= steps[stepIdx].at) { status.textContent = steps[stepIdx].label; stepIdx++; }
    if (progress >= 100) {
      clearInterval(bootInterval);
      bootInterval = null;
      setTimeout(() => boot.classList.add("done"), 500);
    }
  }, 60);
}
function registerServiceWorker() {}
async function boot() {
  injectStyles();
  injectHTML();
  setupUI();
  runBootProgress();
  registerServiceWorker();
  renderSkeleton("toolsGrid", 6, "skeleton-card");
  setTimeout(async () => {
    await loadAllData();
    await initAnalytics();
    const params = new URLSearchParams(location.search);
    const toolId = params.get('tool');
    if (toolId) { const t = tools.find(x => x.id === toolId); if (t) openItem(t); }
  }, 800);
}
export function mountLegacyApp() { boot(); }

})();