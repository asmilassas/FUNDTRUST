import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CATEGORY_ICONS = ["🏥","🎓","🌱","🏠","🤝","💧","🌍","❤️","🛡️","⚡","🍽️","👶"];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ width: 50, height: 50, borderRadius: 12 }} />
      <div className="skeleton" style={{ width: "55%", height: 18 }} />
      <div className="skeleton" style={{ width: "100%", height: 13 }} />
      <div className="skeleton" style={{ width: "75%", height: 13 }} />
    </div>
  );
}

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="home">

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-bg-mesh" />

          <div className="hero-content">
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

            <div className="hero-actions">
              <a href="/register" className="hero-btn-primary">Start Donating</a>
              <a href="/about" className="hero-btn-ghost">Learn how it works →</a>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-value">$2.4M+</span>
              <span className="stat-label">Total Raised</span>
            </div>
            <div className="stat-card stat-card--gold">
              <span className="stat-value">18K+</span>
              <span className="stat-label">Donors</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">340+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">98%</span>
              <span className="stat-label">Delivery Rate</span>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <div className="trust-bar">
          <div className="trust-inner">
            <div className="trust-item"><span>🔒</span> Secure Payments</div>
            <div className="trust-sep" />
            <div className="trust-item"><span>📊</span> Real-time Tracking</div>
            <div className="trust-sep" />
            <div className="trust-item"><span>✅</span> Verified Charities</div>
            <div className="trust-sep" />
            <div className="trust-item"><span>🧾</span> Full Transparency</div>
          </div>
        </div>

        {/* ── Categories ── */}
        <section className="section">
          <div className="section-header">
            <p className="section-overline">Browse Causes</p>
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
                  <span className="category-cta">Donate now →</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── How It Works ── */}
        <div className="how-band">
          <div className="how-inner">
            <div className="section-header" style={{ marginBottom: '52px' }}>
              <p className="section-overline" style={{ color: '#c9963a' }}>How It Works</p>
              <h2 className="section-title" style={{ color: '#fff' }}>Simple, Transparent, Impactful</h2>
            </div>
            <div className="how-steps">
              <div className="how-step">
                <div className="step-num">01</div>
                <h4 className="step-title">Choose a Cause</h4>
                <p className="step-desc">Browse verified categories and find what matters most to you.</p>
              </div>
              <div className="how-connector" />
              <div className="how-step">
                <div className="step-num">02</div>
                <h4 className="step-title">Make a Donation</h4>
                <p className="step-desc">Give securely with any amount — every rupee counts.</p>
              </div>
              <div className="how-connector" />
              <div className="how-step">
                <div className="step-num">03</div>
                <h4 className="step-title">Track Your Impact</h4>
                <p className="step-desc">Watch real-time disbursement logs show exactly where your gift goes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="cta-wrap">
          <div className="cta-banner">
            <div className="cta-glow" />
            <h2 className="cta-title">Ready to Make a Difference?</h2>
            <p className="cta-sub">Join thousands of donors creating real change every day.</p>
            <a href="/register" className="cta-btn">Start Donating ❤️</a>
          </div>
        </div>

      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --navy:         #0f1f3d;
    --navy-mid:     #1a3260;
    --navy-dark:    #080f1e;
    --navy-light:   #f5eddc;
    --navy-pale:    #faf3e8;
    --gold:         #c9963a;
    --gold-deep:    #a87628;
    --gold-light:   #fdf5e6;
    --gold-pale:    rgba(201,150,58,0.1);
    --gold-glow:    rgba(201,150,58,0.18);
    --ink:          #0a1628;
    --muted:        #4e6080;
    --muted-light:  #8a9ab8;
    --surface:      #fdf8f0;
    --card:         #fffef9;
    --border:       rgba(15,31,61,0.09);
    --shadow-sm:    0 2px 12px rgba(15,31,61,0.07);
    --shadow-md:    0 8px 36px rgba(15,31,61,0.1);
    --shadow-lg:    0 20px 64px rgba(15,31,61,0.13);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home {
    min-height: 100vh;
    background: var(--surface);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ═══════════════ HERO ═══════════════ */
  .hero {
    position: relative;
    background: var(--navy);
    padding: 100px 48px 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Subtle grid texture */
  .hero-bg-mesh {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .hero-bg-mesh::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 800px 500px at 50% 0%, rgba(201,150,58,0.1) 0%, transparent 65%),
      radial-gradient(ellipse 600px 400px at 10% 80%, rgba(26,50,96,0.8) 0%, transparent 60%),
      radial-gradient(ellipse 600px 400px at 90% 80%, rgba(26,50,96,0.8) 0%, transparent 60%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 820px;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    background: rgba(201,150,58,0.12);
    border: 1px solid rgba(201,150,58,0.28);
    border-radius: 50px;
    font-size: 11.5px;
    font-weight: 600;
    color: #e8be7a;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }

  .hero-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(48px, 7vw, 82px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -1px;
    color: #ffffff;
    margin-bottom: 22px;
  }

  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-sub {
    font-size: 17px;
    color: rgba(255,255,255,0.55);
    max-width: 520px;
    line-height: 1.75;
    margin-bottom: 40px;
  }

  .hero-actions {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-btn-primary {
    padding: 13px 34px;
    background: var(--gold);
    color: var(--navy-dark);
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 20px rgba(201,150,58,0.35);
    letter-spacing: 0.01em;
  }

  .hero-btn-primary:hover {
    background: #dba83f;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,150,58,0.45);
  }

  .hero-btn-ghost {
    padding: 13px 22px;
    color: rgba(255,255,255,0.65);
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.18s;
  }

  .hero-btn-ghost:hover { color: var(--gold); }

  /* Stat cards row sitting at bottom of hero, overlapping the trust bar */
  .hero-stats {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 16px;
    margin-top: 64px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    border-radius: 14px;
    padding: 22px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 140px;
    transition: background 0.2s, border-color 0.2s;
  }

  .stat-card--gold {
    background: rgba(201,150,58,0.12);
    border-color: rgba(201,150,58,0.28);
  }

  .stat-card:hover { background: rgba(201,150,58,0.1); border-color: rgba(201,150,58,0.25); }

  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
  }

  .stat-card--gold .stat-value { color: var(--gold); }

  .stat-label {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }

  /* ═══════════════ TRUST BAR ═══════════════ */
  .trust-bar {
    background: var(--navy-dark);
    border-bottom: 1px solid rgba(201,150,58,0.15);
    padding: 16px 48px;
  }

  .trust-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.45);
    font-size: 12.5px;
    font-weight: 500;
    padding: 6px 28px;
    letter-spacing: 0.02em;
  }

  .trust-item span { font-size: 14px; }
  .trust-sep { width: 1px; height: 18px; background: rgba(255,255,255,0.1); }

  /* ═══════════════ SECTION ═══════════════ */
  .section {
    padding: 96px 48px 108px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 56px;
  }

  .section-overline {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .section-desc {
    margin-top: 14px;
    color: var(--muted);
    font-size: 16px;
    max-width: 460px;
    line-height: 1.7;
  }

  /* ═══════════════ CATEGORY CARDS ═══════════════ */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 20px;
  }

  .category-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    position: relative;
    overflow: hidden;
  }

  .category-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(201,150,58,0.2);
  }

  .category-card:hover::before { transform: scaleX(1); }

  .category-icon {
    width: 50px; height: 50px;
    border-radius: 12px;
    background: var(--navy-light);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 20px;
  }

  .category-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 10px;
    letter-spacing: -0.2px;
  }

  .category-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.65;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .category-cta {
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: var(--gold-deep);
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.2s, transform 0.2s;
  }

  .category-card:hover .category-cta { opacity: 1; transform: translateX(0); }

  /* ═══════════════ SKELETON ═══════════════ */
  .skeleton {
    background: linear-gradient(90deg, #f5eddc 25%, #faf3e8 50%, #f5eddc 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
    border-radius: 6px;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    display: flex; flex-direction: column; gap: 14px;
  }

  /* ═══════════════ EMPTY ═══════════════ */
  .empty-state { text-align: center; padding: 80px 24px; color: var(--muted); }
  .empty-icon  { font-size: 44px; margin-bottom: 16px; }
  .empty-text  { font-size: 16px; }

  /* ═══════════════ HOW IT WORKS ═══════════════ */
  .how-band {
    background: var(--navy);
    padding: 96px 48px;
    position: relative;
    overflow: hidden;
  }

  .how-band::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .how-inner {
    max-width: 960px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .how-steps {
    display: flex;
    align-items: flex-start;
    gap: 0;
    justify-content: center;
    flex-wrap: wrap;
  }

  .how-step {
    flex: 1;
    min-width: 200px;
    max-width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 16px;
  }

  .step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--gold);
    opacity: 0.35;
    line-height: 1;
    margin-bottom: 14px;
  }

  .step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10px;
  }

  .step-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
  }

  .how-connector {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,150,58,0.4), transparent);
    margin-top: 36px;
    flex-shrink: 0;
  }

  /* ═══════════════ CTA BANNER ═══════════════ */
  .cta-wrap { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }

  .cta-banner {
    background: var(--navy);
    border: 1px solid rgba(201,150,58,0.2);
    border-radius: 24px;
    padding: 80px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .cta-glow {
    position: absolute;
    width: 500px; height: 300px;
    background: radial-gradient(ellipse, rgba(201,150,58,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 4vw, 46px);
    font-weight: 700;
    color: white;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
    letter-spacing: -0.5px;
  }

  .cta-sub {
    color: rgba(255,255,255,0.5);
    font-size: 16px;
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
    line-height: 1.65;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 15px 40px;
    background: var(--gold);
    color: var(--navy-dark);
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 24px rgba(201,150,58,0.35);
    position: relative;
    z-index: 1;
    letter-spacing: 0.01em;
  }

  .cta-btn:hover {
    background: #dba83f;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(201,150,58,0.45);
  }
`;

export default Home;