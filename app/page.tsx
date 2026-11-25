"use client";

import { useEffect, useMemo, useState } from "react";
import { onValue, push, ref, runTransaction, set, update } from "firebase/database";
import { database } from "@/lib/firebase";
import type { NotificationItem, ToolItem } from "@/lib/types";

type Rating = { avg: number; count: number };
type SortMode = "az" | "za" | "new" | "downloads" | "stars";
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> };
const categories = (items: ToolItem[]) => ["All", ...Array.from(new Set(items.map(item => item.category || "Other")))];
const isNew = (item: ToolItem) => { const created = item.createdAt; const timestamp = typeof created === "number" ? created : created ? Date.parse(created) : 0; return item.isNew === true || item.badge === "new" || (!!timestamp && (Date.now() - timestamp) / 86400000 <= 7); };
const iconIsImage = (value: string) => /^(https?:|data:|\/)/.test(value);
const formatCount = (value: number) => value >= 1e6 ? (value / 1e6).toFixed(1) + "M" : value >= 1e3 ? (value / 1e3).toFixed(1) + "K" : String(value);
const getTimestamp = (value: string | number | undefined) => { if (typeof value === "number") return value; if (!value) return 0; const parsed = Date.parse(value); return Number.isNaN(parsed) ? 0 : parsed; };
const toArray = <T,>(value: unknown): T[] => Array.isArray(value) ? value as T[] : value && typeof value === "object" ? Object.entries(value).map(([id, item]) => ({ ...(item as object), id } as T)) : [];

function ToolCard({ item, views, rating, favorite, rated, onOpen, onFavorite, onShare, onReview, onCopy }: {
  item: ToolItem; views: number; rating?: Rating; favorite: boolean; rated: boolean;
  onOpen: (item: ToolItem) => void; onFavorite: (name: string) => void; onShare: (item: ToolItem) => void;
  onReview: (item: ToolItem) => void; onCopy: (item: ToolItem) => void;
}) {
  const icon = String(item.icon || "✦");
  return <article className="tool" onClick={() => onOpen(item)}>
    <div className={`tool-thumb ${iconIsImage(icon) ? "" : "no-img"}`}>
      {iconIsImage(icon) ? <img src={icon} alt={item.name || "Tool"} loading="lazy" onError={event => { event.currentTarget.remove(); event.currentTarget.parentElement?.classList.add("no-img"); }} /> : <span className="thumb-symbol">{icon.slice(0, 4)}</span>}
      {isNew(item) && <span className="badge-new">NEW</span>}
      <div className="thumb-actions">
        <button type="button" className="share-btn" aria-label="Share" onClick={event => { event.stopPropagation(); onShare(item); }}>↗</button>
        <button type="button" className={`fav-btn ${favorite ? "active" : ""}`} aria-label="Favorite" onClick={event => { event.stopPropagation(); onFavorite(item.name || ""); }}>♥</button>
      </div>
      <span className="thumb-cat">{item.category || "Other"}</span>
    </div>
    <div className="tool-body">
      <h3 className="tool-name">{item.name || "UNTITLED"}</h3>
      <p className="tool-desc">{item.description || "ZXH utility."}</p>
      <div className="tool-stats-row"><span className="tool-stat views">👁 {formatCount(views)}</span><span className="tool-stat">{rating?.count ? <>{"★".repeat(Math.round(rating.avg))} {rating.avg.toFixed(1)} ({rating.count})</> : "No ratings"}</span></div>
      <div className="tool-actions-3">
        <button type="button" className="copy-btn" onClick={event => { event.stopPropagation(); onCopy(item); }}>COPY</button>
        <button type="button" className={`review-btn ${rated ? "rated" : ""}`} onClick={event => { event.stopPropagation(); onReview(item); }}>{rated ? "RATED ✓" : "RATE ★"}</button>
        <button type="button" className="open-btn" onClick={event => { event.stopPropagation(); onOpen(item); }}>OPEN ↗</button>
      </div>
    </div>
  </article>;
}

function CompactCard({ item, views, onOpen }: { item: ToolItem; views: number; onOpen: (item: ToolItem) => void }) {
  const icon = String(item.icon || "✦");
  return <article className="compact-card" onClick={() => onOpen(item)}>
    <div className={`compact-thumb ${iconIsImage(icon) ? "" : "no-img"}`}>
      {iconIsImage(icon) ? <img src={icon} alt={item.name || "Tool"} loading="lazy" /> : <span className="compact-symbol">{icon.slice(0, 3)}</span>}
      {isNew(item) && <span className="badge-new">NEW</span>}
    </div>
    <div className="compact-body"><h3 className="compact-name">{item.name || "UNTITLED"}</h3><span className="compact-cat">{item.category || "Other"}</span><div className="compact-stats"><span className="cstat views">👁 {formatCount(views)}</span></div></div>
  </article>;
}

export default function HomePage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [views, setViews] = useState<Record<string, number>>({});
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [siteViews, setSiteViews] = useState(0);
  const [databaseStatus, setDatabaseStatus] = useState("CONNECTING");
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("az");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [reviewItem, setReviewItem] = useState<ToolItem | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratedIds, setRatedIds] = useState<string[]>([]);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [bootVisible, setBootVisible] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installVisible, setInstallVisible] = useState(false);
  const [installText, setInstallText] = useState("Install ZXH OFFICIAL TOOLS for the best app experience — fast, offline-ready, home screen icon.");
  const [installButtonText, setInstallButtonText] = useState("INSTALL NOW ↓");

  useEffect(() => {
    const isStandalone = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isStandalone() || localStorage.getItem("zxhInstalled") === "1") return;

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setInstallVisible(false);
      localStorage.setItem("zxhInstalled", "1");
      notify("✅ App installed!");
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    const timer = window.setTimeout(() => {
      if (isStandalone() || localStorage.getItem("zxhInstalled") === "1") return;
      if (isIOS()) {
        setInstallText('iPhone: Tap the Share ↑ button → "Add to Home Screen" to install ZXH.');
        setInstallButtonText("HOW TO INSTALL ↗");
      }
      setInstallVisible(true);
    }, 5000);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      window.alert('iPhone Install:\n\n1. Tap Share (□↑) at the bottom\n2. Scroll → "Add to Home Screen"\n3. Tap "Add"');
      return;
    }
    if (!installPrompt) {
      notify('Chrome menu (⋮) → "Install app"');
      return;
    }
    setInstallButtonText("INSTALLING…");
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") {
        localStorage.setItem("zxhInstalled", "1");
        setInstallVisible(false);
        notify("✅ ZXH installed!");
      } else {
        setInstallButtonText("INSTALL NOW ↓");
        notify("Install cancelled");
      }
    } catch {
      setInstallButtonText("INSTALL NOW ↓");
      notify("Please try again");
    }
  };

  const dismissInstall = () => setInstallVisible(false);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("zxh_favorites") || "[]") as string[]);
      setRatedIds(JSON.parse(localStorage.getItem("zxh_rated_keys") || "[]") as string[]);
      setTheme(localStorage.getItem("zxhTheme") === "dark" ? "dark" : "light");
    } catch { /* use defaults */ }
    const timer = window.setTimeout(() => setBootVisible(false), 1800);
    return () => { clearTimeout(timer); };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zxhTheme", theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribers = [
      onValue(ref(database, "tools"), snapshot => { setTools(toArray<ToolItem>(snapshot.val())); setDatabaseStatus("LIVE"); }, () => setDatabaseStatus("OFFLINE")),
      onValue(ref(database, "settings"), snapshot => setSettings(snapshot.val() || {}), () => setDatabaseStatus("OFFLINE")),
      onValue(ref(database, "notifications"), snapshot => setNotifications(toArray<NotificationItem>(snapshot.val()).sort((a,b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))), () => setDatabaseStatus("OFFLINE")),
      onValue(ref(database, "stats/toolViews"), snapshot => setViews(snapshot.val() || {}), () => setDatabaseStatus("OFFLINE")),
      onValue(ref(database, "stats/views"), snapshot => setSiteViews(Number(snapshot.val() || 0)), () => setDatabaseStatus("OFFLINE")),
      onValue(ref(database, "reviews"), snapshot => {
        const raw = snapshot.val() || {};
        const aggregate: Record<string, Rating> = {};
        Object.entries(raw).forEach(([id, values]) => {
          const entries = toArray<{rating:number}>(values);
          const valid = entries.filter(entry => Number(entry.rating) > 0);
          aggregate[id] = { avg: valid.length ? valid.reduce((sum, entry) => sum + Number(entry.rating), 0) / valid.length : 0, count: valid.length };
        });
        setRatings(aggregate);
      }, () => setDatabaseStatus("OFFLINE"))
    ];
    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
  }, []);

  useEffect(() => {
    if (databaseStatus !== "LIVE") return;
    const visitor = localStorage.getItem("zxh_visitor_id") || `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem("zxh_visitor_id", visitor);
    const today = new Date().toISOString().slice(0,10);
    const seenKey = "zxh_seen_" + today;
    void runTransaction(ref(database, "stats/views"), value => (Number(value) || 0) + 1);
    void runTransaction(ref(database, `stats/daily/${today}/visits`), value => (Number(value) || 0) + 1);
    if (!localStorage.getItem(seenKey)) {
      localStorage.setItem(seenKey, "1");
      void runTransaction(ref(database, "stats/uniqueVisitorCount"), value => (Number(value) || 0) + 1);
    }
    const presence = ref(database, "presence/" + visitor);
    void set(presence, { online: true, device: /mobile|android|iphone/i.test(navigator.userAgent) ? "mobile" : "desktop", browser: navigator.userAgent, path: location.pathname + location.hash, at: Date.now() });
    return () => { void set(presence, null); };
  }, [databaseStatus]);

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase();
    const result = tools.filter(item => {
      const category = item.category || "Other";
      if (showFavorites && !favorites.includes(item.name || "")) return false;
      if (!showFavorites && activeCategory !== "All" && category !== activeCategory) return false;
      return !search || `${item.name || ""} ${item.description || ""} ${category}`.toLowerCase().includes(search);
    });
    return result.sort((a,b) => sort === "za" ? (b.name || "").localeCompare(a.name || "") : sort === "new" ? Number(isNew(b))-Number(isNew(a)) : sort === "downloads" ? Number(b.downloads || 0)-Number(a.downloads || 0) : sort === "stars" ? Number(ratings[b.id || ""]?.avg || 0)-Number(ratings[a.id || ""]?.avg || 0) : (a.name || "").localeCompare(b.name || ""));
  }, [tools, query, activeCategory, showFavorites, favorites, sort, ratings]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2400); };
  const track = async (item: ToolItem, action: "clicks" | "views" | "uses") => {
    if (!item.id) return;
    const day = new Date().toISOString().slice(0,10);
    const id = item.id;
    const category = item.category || "Other";
    await update(ref(database, `stats/tools/${id}`), { name: item.name || "", category, [action === "clicks" ? "lastClickedAt" : action === "views" ? "lastViewedAt" : "lastUsedAt"]: Date.now() });
    await runTransaction(ref(database, `stats/tools/${id}/${action}`), value => (Number(value) || 0) + 1);
    if (action === "views") await runTransaction(ref(database, `stats/toolViews/${id}`), value => (Number(value) || 0) + 1);
    await runTransaction(ref(database, `stats/daily/${day}/tool${action.charAt(0).toUpperCase() + action.slice(1)}`), value => (Number(value) || 0) + 1);
    await push(ref(database, "stats/recentActivity"), { type: action.slice(0,-1), toolId: id, toolName: item.name || "", category, timestamp: Date.now() });
  };
  const openTool = (item: ToolItem) => {
    void track(item, "clicks").catch(() => undefined);
    void track(item, "views").catch(() => undefined);
    const url = item.link || item.url || item.downloadUrl;
    if (!url) { notify("No URL configured"); return; }
    void track(item, "uses").catch(() => undefined);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const toggleFavorite = (name: string) => {
    const next = favorites.includes(name) ? favorites.filter(value => value !== name) : [...favorites, name];
    setFavorites(next); localStorage.setItem("zxh_favorites", JSON.stringify(next)); notify(next.includes(name) ? "Added ❤" : "Removed");
  };
  const shareTool = async (item: ToolItem) => {
    const url = `${location.origin}/?tool=${encodeURIComponent(item.id || "")}`;
    try {
      if (navigator.share) await navigator.share({ title: `${item.name} — ZXH Official Tools`, url });
      else { await navigator.clipboard.writeText(url); notify("Link copied ✓"); }
    } catch { /* share dismissed */ }
  };
  const copyTool = async (item: ToolItem) => {
    const url = item.link || item.url || item.downloadUrl;
    if (!url) { notify("No link"); return; }
    try { await navigator.clipboard.writeText(url); notify("Copied: " + (item.name || "Tool")); } catch { notify("Copy unavailable"); }
  };
  const submitReview = async () => {
    if (!reviewItem?.id || !reviewRating) { notify("Tap stars first"); return; }
    if (ratedIds.includes(reviewItem.id)) { notify("Already rated ❤"); return; }
    const uid = localStorage.getItem("zxh_user_id") || Math.random().toString(36).slice(2);
    localStorage.setItem("zxh_user_id", uid);
    try {
      await push(ref(database, "reviews/" + reviewItem.id), { rating: reviewRating, text: reviewText.trim(), uid, at: Date.now() });
      const next = [...ratedIds, reviewItem.id]; setRatedIds(next); localStorage.setItem("zxh_rated_keys", JSON.stringify(next));
      setReviewItem(null); setReviewRating(0); setReviewText(""); notify("Thanks for rating! ❤");
    } catch { notify("Review failed"); }
  };
  const sendFeedback = async () => {
    if (!feedbackEmail.trim() || !feedbackMessage.trim()) { setFeedbackStatus("Enter email & feedback."); return; }
    try { await push(ref(database, "comments"), { email: feedbackEmail.trim(), message: feedbackMessage.trim(), timestamp: new Date().toISOString() }); setFeedbackEmail(""); setFeedbackMessage(""); setFeedbackStatus("Sent ✓"); notify("Feedback sent"); }
    catch { setFeedbackStatus("Error sending feedback."); }
  };
  const compactOpen = (item: ToolItem) => openTool(item);

  useEffect(() => {
    if (!tools.length) return;
    const requestedId = new URLSearchParams(location.search).get("tool");
    if (!requestedId) return;
    const requestedTool = tools.find(item => item.id === requestedId);
    if (requestedTool) openTool(requestedTool);
    // Run only when the realtime tools collection first becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools.length]);
  const trending = [...tools].sort((a,b) => Number(views[b.id || ""] || 0)-Number(views[a.id || ""] || 0)).filter(item => Number(views[item.id || ""] || 0)>0).slice(0,10);
  const featuredItems = tools.filter(item => item.featured === true).slice(0,10);
  const featured = featuredItems.length ? featuredItems : tools.slice(0,10);
  const newest = tools.filter(isNew).slice(0,10);

  return <>
    {bootVisible && <div className="boot"><div className="boot-logo-wrap"><div className="boot-logo">ZXH</div><div className="boot-official">OFFICIAL</div></div><div className="boot-divider"/><strong className="boot-welcome">Welcome to <span className="accent">ZXH OFFICIAL TOOLS</span> 🚀</strong><p className="boot-subtitle">Your premium digital workspace — tools and utilities in one place.</p><div className="boot-track"><i style={{width:"100%"}}/></div><span className="boot-percent">100%</span><span className="boot-status">READY</span></div>}
    <div className="soft-bg"/>
    <div className="site">
      {installVisible && <div id="installPromptOverlay" className="install-overlay"><div className="install-card"><button type="button" id="installClose" className="install-close" onClick={dismissInstall}>×</button><img src="/assets/icon-512.png" alt="ZXH" className="install-icon" onError={event => { event.currentTarget.style.display = "none"; }} /><span className="kicker">ZXH / APP</span><h2>KEEP ZXH WITH YOU.</h2><p>{installText}</p><button type="button" id="installBtn" className="btn dark install-main" onClick={() => void installApp()}>{installButtonText}</button><button type="button" id="installLater" className="install-later" onClick={dismissInstall}>NOT NOW</button></div></div>}
      <header className="nav"><a className="brand" href="#home"><span className="brand-mark">Z</span><span><b>{settings.site_title || "ZXH OFFICIAL TOOLS"}</b><small>DIGITAL TOOL SYSTEM</small></span></a><nav><a href="#home">HOME</a><a href="#trendingSection">TRENDING</a><a href="#library">TOOLS</a></nav><div className="nav-actions"><button className="round notification-btn" aria-label="Notifications" onClick={() => setNotificationsOpen(true)}>♧</button><button className="round" aria-label="Toggle theme" onClick={() => setTheme(value => value === "dark" ? "light" : "dark")}>{theme === "dark" ? "☾" : "☼"}</button><button className="round" aria-label="Menu" onClick={() => setDrawerOpen(true)}>☰</button></div></header>
      <aside className={`drawer ${drawerOpen ? "open" : ""}`}><button className="drawer-x" onClick={() => setDrawerOpen(false)}>×</button><span className="kicker">ZXH / MENU</span><h2><span className="line1">ZULQARNAIN</span><span className="line2">X HAIDER</span></h2>{[["🏠","HOME","#home"],["🔥","TRENDING","#trendingSection"],["🛠️","TOOLS","#library"],["👤","ABOUT","#about"]].map(([icon,label,href]) => <a key={label} href={href} className="drawer-nav-link" onClick={() => setDrawerOpen(false)}><span className="dnav-icon">{icon}</span><span className="dnav-text">{label}</span></a>)}<div className="drawer-links"><a href={settings.owner_contact_link || "#"} target="_blank" rel="noreferrer">OWNER CONTACT ↗</a><a href={settings.whatsapp_channel_link || "#"} target="_blank" rel="noreferrer">WHATSAPP CHANNEL ↗</a><a href={settings.whatsapp_group_link || "#"} target="_blank" rel="noreferrer">COMMUNITY ↗</a></div></aside>
      {drawerOpen && <button className="shade on" aria-label="Close menu" onClick={() => setDrawerOpen(false)}/>}
      <main>
        <section id="home" className="hero"><div className="hero-copy"><span className="kicker">01 / INTERACTIVE DIGITAL TOOLKIT ☠️🚀</span><h1><span className="line">ZULQARNAIN</span><span className="line accent">X</span><span className="line accent">HAIDER.</span></h1><p>Premium tools — all free, all fast, all mobile-friendly. Crafted with enterprise-grade architecture by ZXH.</p><div className="actions"><a className="btn dark" href="#trendingSection">🔥 TRENDING <b>↘</b></a><a className="btn ghost" href="#library">EXPLORE <b>↘</b></a></div></div></section>
        <section className="story"><div className="story-copy"><span className="kicker">02 / THE EXPERIENCE</span><h2>ONE SPACE.<br/><span className="accent">ENDLESS UTILITY.</span></h2><p>Every object, card and transition has its own space. Built with love, engineered for speed.</p></div><div className="story-data"><div><b>01</b><span>FAST ACCESS</span></div><div><b>02</b><span>LIVE FIREBASE</span></div><div><b>03</b><span>RESPONSIVE</span></div></div></section>
        <section id="trendingSection" className="trending-section"><div className="section-head"><div className="header-left"><span className="kicker">03 / DISCOVER</span><h2>TRENDING NOW.<br/><span className="accent">HOT PICKS.</span></h2><p className="header-desc">Real-time trending tools, admin&apos;s featured picks &amp; brand-new additions.</p></div></div>
          {[{title:"TRENDING NOW",sub:"Most viewed",items:trending.length ? trending : tools.slice(0,10),icon:"🔥"},{title:"FEATURED PICKS",sub:"Handpicked by ZXH",items:featured,icon:"⭐"},{title:"JUST ADDED",sub:"Fresh in last 7 days",items:newest,icon:"✨"}].map(row => <div className="trending-row" key={row.title}><div className="row-head"><div className="row-head-left"><div className="row-icon fire">{row.icon}</div><div><h2>{row.title}</h2><div className="row-sub">{row.sub}</div></div></div></div><div className="row-grid">{row.items.map(item => <CompactCard key={item.id || item.name} item={item} views={Number(views[item.id || ""] || 0)} onOpen={compactOpen}/>)}</div></div>)}
        </section>
        <section id="library" className="library"><div className="section-head"><div className="header-left"><span className="kicker">04 / TOOL LIBRARY</span><h2>CHOOSE<br/><span className="accent">YOUR FAVORITE TOOL.</span></h2></div><div className="header-right"><div className="header-stat"><b>{filteredTools.length}</b><span>TOOLS AVAILABLE</span></div></div></div>
          <div className="toolbar-row"><form className="premium-searchbar" role="search" onSubmit={event => event.preventDefault()}><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Search tools…" autoComplete="off"/><button className="search-btn" type="submit">SEARCH</button></form><div className="sort-wrap"><select className="sort-select" value={sort} onChange={event => setSort(event.target.value as SortMode)}><option value="az">A → Z</option><option value="za">Z → A</option><option value="new">NEWEST FIRST</option><option value="downloads">MOST DOWNLOADED</option><option value="stars">TOP RATED</option></select></div><button type="button" className={`fav-chip-btn ${showFavorites ? "active" : ""}`} onClick={() => setShowFavorites(value => !value)}><span className="heart">❤</span><span>FAVORITES</span><span className="fav-count">{favorites.length}</span></button><span className={`live-status ${databaseStatus === "LIVE" ? "ok" : "err"}`}><i/> {databaseStatus === "LIVE" ? `${tools.length} TOOLS` : databaseStatus}</span></div>
          <div className="categories">{categories(tools).map(category => <button key={category} className={`cat ${activeCategory === category && !showFavorites ? "active" : ""}`} onClick={() => {setActiveCategory(category);setShowFavorites(false);}}>{category}<span className="cat-count">{category === "All" ? tools.length : tools.filter(item => (item.category || "Other") === category).length}</span></button>)}</div>
          <div className="tools">{filteredTools.map(item => <ToolCard key={item.id || item.name} item={item} views={Number(views[item.id || ""] || 0)} rating={ratings[item.id || ""]} favorite={favorites.includes(item.name || "")} rated={ratedIds.includes(item.id || "")} onOpen={openTool} onFavorite={toggleFavorite} onShare={shareTool} onReview={item => { if (ratedIds.includes(item.id || "")) notify("Already rated ❤"); else {setReviewItem(item);setReviewRating(0);setReviewText("");} }} onCopy={copyTool}/>)}</div>
          {!filteredTools.length && <div className="empty">NO TOOLS FOUND.</div>}
        </section>
        <section id="about" className="about"><div className="about-mark">ZXH<i>OFFICIAL</i></div><div className="about-copy"><span className="kicker">07 / THE MIND BEHIND ZXH</span><h2>BUILT BY<br/><span className="accent">ZULQARNAIN X HAIDER.</span></h2><p><strong>ZXH OFFICIAL TOOLS</strong> is the vision of <strong>Zulqarnain X Haider</strong> — a developer-focused digital ecosystem created for high-vision brands, creators, and teams who demand enterprise-grade speed, clean architecture, and premium design.</p><div className="stats"><div><b>{siteViews.toLocaleString()}</b><span>VISITS</span></div><div><b>{databaseStatus}</b><span>DATABASE</span></div><div><b>ZXH</b><span>FOUNDER</span></div></div></div></section>
        <section className="feedback"><div><span className="kicker">08 / FEEDBACK</span><h2>MAKE IT<br/><span className="accent">BETTER.</span></h2><p style={{maxWidth:400,color:"var(--text-soft)",fontFamily:"Outfit, sans-serif",marginTop:14}}>Have a suggestion or bug to report? Drop a message and help shape the future of ZXH.</p></div><div className="feedback-form"><input type="email" value={feedbackEmail} onChange={event => setFeedbackEmail(event.target.value)} placeholder="Your email"/><textarea value={feedbackMessage} onChange={event => setFeedbackMessage(event.target.value)} placeholder="Your feedback…"/><button className="btn dark" type="button" style={{justifyContent:"center"}} onClick={() => void sendFeedback()}>SEND FEEDBACK ↗</button><small>{feedbackStatus}</small></div></section>
      </main>
      <footer><b>ZXH OFFICIAL • ALL RIGHTS RESERVED ☠️🚀</b><span>© 2026 ZULQARNAIN X HAIDER</span><a href={settings.whatsapp_channel_link || "#"} target="_blank" rel="noreferrer">JOIN CHANNEL ↗</a></footer>
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
      {notificationsOpen && <section className="notification-center on"><div className="notification-shell"><header className="notification-head"><div><span className="kicker">ZXH / UPDATES</span><h2>WHAT&apos;S NEW.</h2></div><button className="notification-close" onClick={() => setNotificationsOpen(false)}>×</button></header><div className="notification-meta"><span>LATEST UPDATES</span><span>LIVE</span></div><div className="notification-list">{notifications.slice(0,20).map((item,index) => <div className="notification-item unread" key={item.id || index}><div className="notification-item-icon">✦</div><div><h4>{item.title || "UPDATE"}</h4><p>{item.text || item.message || ""}</p></div><time>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "NOW"}</time></div>)}</div>{!notifications.length && <div className="notification-empty">YOU&apos;RE ALL CAUGHT UP.</div>}</div></section>}
      {reviewItem && <div className="review-modal on"><div className="review-modal-card"><button className="review-close" onClick={() => setReviewItem(null)}>×</button><div className="review-kicker"><span className="k-star">★</span> Rate this tool</div><h2 className="review-tool-name">{reviewItem.name}</h2><div className="review-sub">Tap stars to rate</div><div className="review-star-row">{[1,2,3,4,5].map(value => <button key={value} type="button" className={value <= reviewRating ? "active" : ""} onClick={() => setReviewRating(value)}>★</button>)}</div><div className="review-selected-text">{["","Poor","Fair","Good","Very Good","Excellent"][reviewRating]}{reviewRating ? ` · ${reviewRating}/5` : ""}</div><textarea className="review-input" value={reviewText} onChange={event => setReviewText(event.target.value)} placeholder="Share your experience (optional)…" rows={3}/><button className="review-submit" onClick={() => void submitReview()}>Submit Review</button></div></div>}
      <button className="back-to-top show" type="button" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>↑</button>
    </div>
  </>;
}

