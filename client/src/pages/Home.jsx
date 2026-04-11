import { useEffect, useState } from "react";
import api from "../services/api";
import { fmtCompact } from "../utils";
import { useNavigate } from "react-router-dom";

const CATEGORY_ICONS = ["🏥","🎓","🌱","🏠","🤝","💧","🌍","❤️","🛡️","⚡","🍽️","👶"];

function AnimatedStat({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const end = typeof value === "number" ? value : 0;
    let start = 0;
    const duration = 1400;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{fmtCompact(display)}{suffix}</>;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ width: 50, height: 50, borderRadius: 14 }} />
      <div className="skeleton" style={{ width: "55%", height: 18, marginTop: 12 }} />
      <div className="skeleton" style={{ width: "100%", height: 13, marginTop: 8 }} />
      <div className="skeleton" style={{ width: "75%", height: 13, marginTop: 6 }} />
    </div>
  );
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [featuredFunds, setFeaturedFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/categories"),
      api.get("/donations/stats"),
      api.get("/charities?limit=3"),
    ]).then(([catRes, statsRes, projRes]) => {
      setCategories(Array.isArray(catRes.data.categories) ? catRes.data.categories : []);
      setStats(statsRes.data);
      setFeaturedFunds(projRes.data.charities?.slice(0, 3) || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home">

        {/* Hero */}
        <section className="hero">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            Transparent &amp; Trusted Giving
          </div>
          <h1 className="hero-title">
            Give with Heart,<br />
            <em>Change a Life</em>
          </h1>
          <p className="hero-sub">
            Every donation is tracked transparently so you always know exactly where your generosity goes.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hero-search-wrap">
            <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="hero-search-input"
              placeholder="Search for a cause or fund…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">Search</button>
          </form>

          {/* Live stats */}
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">
                {stats ? <AnimatedStat value={stats.totalRaised} prefix="LKR " /> : "—"}
              </span>
              <span className="stat-label">Raised</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {stats ? <AnimatedStat value={stats.totalDonors} /> : "—"}
              </span>
              <span className="stat-label">Donors</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {stats ? <AnimatedStat value={stats.totalFunds} /> : "—"}
              </span>
              <span className="stat-label">Funds</span>
            </div>
          </div>

          <div className="scroll-hint">↓ Explore causes</div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-header">
            <span className="section-label">Browse Causes</span>
            <h2 className="section-title">Where Will You Make a Difference?</h2>
            <p className="section-desc">Choose a cause close to your heart and watch your impact grow in real time.</p>
          </div>

          {loading ? (
            <div className="categories-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌻</div>
              <p className="empty-text">No categories yet — check back soon!</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((cat, i) => (
                <div key={cat._id} className="category-card" onClick={() => navigate(`/category/${cat._id}`)}>
                  <div className="category-icon">{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <span className="category-cta">Explore funds →</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Funds */}
        {featuredFunds.length > 0 && (
          <section className="section featured-section">
            <div className="section-header">
              <span className="section-label">Active Now</span>
              <h2 className="section-title">Featured Funds</h2>
              <p className="section-desc">These funds are actively raising funds and need your support.</p>
            </div>
            <div className="funds-grid">
              {featuredFunds.map((p) => {
                const goal = p.goals?.[0];
                const pct = goal ? Math.min((goal.amountRaised / goal.targetAmount) * 100, 100) : 0;
                return (
                  <div key={p._id} className="fund-card" onClick={() => navigate(`/project/${p._id}`)}>
                    <div className="fund-header">
                      {p.category && <span className="fund-category">{p.category.name}</span>}
                    </div>
                    <h3 className="fund-name">{p.name}</h3>
                    <p className="fund-mission">{p.mission}</p>
                    {goal && (
                      <div className="fund-progress">
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="progress-labels">
                          <span>LKR {goal.amountRaised.toLocaleString()} raised</span>
                          <span>{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                    )}
                    <div className="fund-footer">
                      <span className="fund-donors">👥 {p.donorCount || 0} donors</span>
                      <span className="fund-link">Donate →</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button onClick={() => navigate("/search?q=")} className="browse-all-btn">
                Browse All Funds →
              </button>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="how-section">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Simple, Transparent Giving</h2>
          </div>
          <div className="how-grid">
            {[
              { step: "01", icon: "🔍", title: "Browse Causes", desc: "Explore vetted charities and funds across multiple categories." },
              { step: "02", icon: "💳", title: "Make a Donation", desc: "Donate securely with your card in under 60 seconds." },
              { step: "03", icon: "📊", title: "Track Impact", desc: "See real-time updates on how your money is being used." },
              { step: "04", icon: "🌟", title: "Get Receipts", desc: "Download your donation receipt instantly for your records." },
            ].map(s => (
              <div key={s.step} className="how-card">
                <div className="how-step">{s.step}</div>
                <div className="how-icon">{s.icon}</div>
                <h3 className="how-title">{s.title}</h3>
                <p className="how-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home { min-height: 100vh; background: #fdf8f3; color: #2d1f0e; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

  /* Hero */
  .hero {
    position: relative; display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 80px 24px 80px; overflow: hidden;
    background: linear-gradient(180deg,#fff7ee 0%,#fdf8f3 100%);
  }
  .hero::before {
    content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 500px;
    background: radial-gradient(ellipse at center,rgba(251,146,60,0.13) 0%,rgba(251,191,36,0.07) 50%,transparent 75%);
    pointer-events: none;
  }
  .hero-blob { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; opacity: 0.55; }
  .hero-blob-1 { width: 320px; height: 320px; background: rgba(251,146,60,0.18); top: -60px; left: -80px; }
  .hero-blob-2 { width: 260px; height: 260px; background: rgba(251,191,36,0.15); top: 40px; right: -60px; }
  .hero-blob-3 { width: 200px; height: 200px; background: rgba(239,115,68,0.1); bottom: -30px; left: 30%; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px; padding: 7px 18px;
    background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.28); border-radius: 50px;
    font-size: 12px; font-weight: 600; color: #c2410c; letter-spacing: 0.07em; text-transform: uppercase;
    margin-bottom: 26px; position: relative;
  }
  .hero-dot { width: 7px; height: 7px; border-radius: 50%; background: #f97316; animation: pulse 2.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:1;transform:scale(1); } 50% { opacity:.45;transform:scale(.75); } }
  .hero-title {
    font-family: 'Lora', serif; font-size: clamp(36px,6.5vw,64px); font-weight: 700;
    line-height: 1.1; letter-spacing: -1px; color: #1c0f00; max-width: 680px; position: relative;
  }
  .hero-title em { font-style: italic; color: #ea580c; }
  .hero-sub { margin-top: 18px; font-size: 16px; color: #78583a; max-width: 460px; line-height: 1.72; position: relative; }

  /* Search */
  .hero-search-wrap {
    display: flex; align-items: center; width: 100%; max-width: 520px; margin-top: 32px;
    background: white; border: 1.5px solid rgba(234,88,12,0.2); border-radius: 14px;
    padding: 8px 8px 8px 14px; gap: 10; position: relative;
    box-shadow: 0 4px 24px rgba(180,80,20,0.1);
  }
  .hero-search-icon { color: #b08060; flex-shrink: 0; }
  .hero-search-input {
    flex: 1; border: none; outline: none; font-family: 'Plus Jakarta Sans',sans-serif;
    font-size: 14px; color: #1c0f00; background: transparent; padding: 4px 10px;
  }
  .hero-search-input::placeholder { color: #b08060; }
  .hero-search-btn {
    padding: 10px 20px; background: linear-gradient(135deg,#f97316,#ea580c); color: white;
    border: none; border-radius: 10px; font-weight: 700; font-size: 13px;
    font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; white-space: nowrap;
    box-shadow: 0 2px 10px rgba(249,115,22,0.3);
  }

  /* Stats */
  .hero-stats {
    display: flex; margin-top: 40px; background: white; border: 1px solid rgba(234,88,12,0.12);
    border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(180,80,20,0.08); position: relative;
  }
  .stat { display: flex; flex-direction: column; align-items: center; gap: 4; padding: 20px 44px; }
  .stat + .stat { border-left: 1px solid rgba(234,88,12,0.1); }
  .stat-value { font-family: 'Lora',serif; font-size: 24px; font-weight: 700; color: #ea580c; }
  .stat-label { font-size: 11px; color: #a07050; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; }

  .scroll-hint {
    margin-top: 40px; color: #b08060; font-size: 12px; font-weight: 500;
    letter-spacing: 0.05em; text-transform: uppercase; animation: bounce 2s ease-in-out infinite;
  }
  @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }

  /* Sections */
  .section { padding: 70px 24px 80px; max-width: 1140px; margin: 0 auto; }
  .section-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 48px; }
  .section-label { font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #ea580c; margin-bottom: 10px; }
  .section-title { font-family: 'Lora',serif; font-size: clamp(24px,4vw,36px); font-weight: 700; color: #1c0f00; letter-spacing: -0.4px; }
  .section-desc { margin-top: 10px; color: #8c6040; font-size: 15px; max-width: 420px; line-height: 1.65; }

  /* Category cards */
  .categories-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 18px; }
  .category-card {
    background: white; border: 1px solid rgba(234,88,12,0.1); border-radius: 18px; padding: 26px;
    cursor: pointer; transition: transform 0.22s,box-shadow 0.22s,border-color 0.22s; position: relative; overflow: hidden;
  }
  .category-card::after { content:''; position:absolute; bottom:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#f97316,#fbbf24); transform:scaleX(0); transform-origin:left; transition:transform 0.25s; }
  .category-card:hover { transform:translateY(-5px); box-shadow:0 16px 48px rgba(180,80,20,0.12); border-color:rgba(234,88,12,0.22); }
  .category-card:hover::after { transform:scaleX(1); }
  .category-icon { width:50px;height:50px; border-radius:14px; background:linear-gradient(135deg,#fff3e8,#ffe8cc); border:1px solid rgba(234,88,12,0.15); display:flex;align-items:center;justify-content:center; font-size:22px; margin-bottom:16px; }
  .category-name { font-family:'Lora',serif; font-size:16px; font-weight:600; color:#1c0f00; margin-bottom:7px; }
  .category-desc { font-size:13px; color:#8c6040; line-height:1.65; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .category-cta { margin-top:16px; display:inline-flex; font-size:12.5px; font-weight:600; color:#ea580c; opacity:0; transform:translateX(-6px); transition:opacity 0.2s,transform 0.2s; }
  .category-card:hover .category-cta { opacity:1; transform:translateX(0); }

  /* Featured funds */
  .funds-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 18px; }
  .fund-card {
    background: white; border: 1px solid rgba(234,88,12,0.1); border-radius: 18px; padding: 24px;
    cursor: pointer; transition: all 0.22s; display: flex; flex-direction: column; gap: 10;
  }
  .fund-card:hover { transform:translateY(-4px); box-shadow:0 14px 40px rgba(180,80,20,0.1); }
  .fund-header { display: flex; }
  .fund-category { font-size: 11px; font-weight: 700; color: #f97316; background: #fff7ee; border: 1px solid rgba(234,88,12,0.2); padding: 3px 10px; border-radius: 20px; letter-spacing: 0.05em; text-transform: uppercase; }
  .fund-name { font-family: 'Lora',serif; font-size: 17px; font-weight: 700; color: #1c0f00; line-height: 1.3; }
  .fund-mission { font-size: 13px; color: #78583a; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
  .fund-progress { margin-top: 4px; }
  .progress-bar-track { height: 7px; background: #f3f4f6; border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg,#f97316,#fbbf24); border-radius: 4px; transition: width 1s; }
  .progress-labels { display: flex; justify-content: space-between; font-size: 11.5px; color: #9ca3af; font-weight: 600; }
  .fund-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
  .fund-donors { font-size: 12px; color: #9ca3af; }
  .fund-link { font-size: 12.5px; font-weight: 700; color: #ea580c; }

  .browse-all-btn {
    padding: 13px 32px; background: transparent; border: 2px solid rgba(234,88,12,0.3); border-radius: 12px;
    color: #ea580c; font-family: 'Plus Jakarta Sans',sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .browse-all-btn:hover { background: rgba(234,88,12,0.06); border-color: rgba(234,88,12,0.5); }

  /* How it works */
  .how-section { background: linear-gradient(180deg,#1c0f00,#2d1a08); padding: 80px 24px; }
  .how-section .section-header .section-label { color: #fbbf24; }
  .how-section .section-title { color: #f0ece6; }
  .how-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 20px; max-width: 1000px; margin: 0 auto; }
  .how-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 28px 22px; text-align: center; }
  .how-step { font-size: 11px; font-weight: 700; color: #f97316; letter-spacing: 0.12em; margin-bottom: 14px; }
  .how-icon { font-size: 32px; margin-bottom: 12px; }
  .how-title { font-family: 'Lora',serif; font-size: 16px; font-weight: 700; color: #f0ece6; margin-bottom: 8px; }
  .how-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.65; }


  .featured-section { padding-top: 0; }

  /* Skeleton */
  .skeleton { background:linear-gradient(90deg,#f5ede3 25%,#fdf0e2 50%,#f5ede3 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:8px; }
  @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
  .skeleton-card { background:white; border:1px solid rgba(234,88,12,0.08); border-radius:18px; padding:26px; display:flex; flex-direction:column; gap:8px; }
  .empty-state { text-align:center; padding:72px 24px; color:#a07050; }
  .empty-icon { font-size:44px; margin-bottom:16px; }
  .empty-text { font-size:15px; }
`;

export default Home;