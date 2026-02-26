import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CATEGORY_ICONS = ["🏥","🎓","🌱","🏠","🤝","💧","🌍","❤️","🛡️","⚡","🍽️","👶"];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ width: 50, height: 50, borderRadius: 14 }} />
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

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">$2.4M+</span>
              <span className="stat-label">Raised</span>
            </div>
            <div className="stat">
              <span className="stat-value">18K+</span>
              <span className="stat-label">Donors</span>
            </div>
            <div className="stat">
              <span className="stat-value">340+</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>

          <div className="scroll-hint">↓ Explore causes</div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-header">
            <span className="section-label">Browse Causes</span>
            <h2 className="section-title">Where Will You Make a Difference?</h2>
            <p className="section-desc">
              Choose a cause close to your heart and watch your impact grow in real time.
            </p>
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
                <div
                  key={cat._id}
                  className="category-card"
                  onClick={() => navigate(`/category/${cat._id}`)}
                >
                  <div className="category-icon">{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <span className="category-cta">Donate now →</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <div className="cta-wrap">
          <div className="cta-banner">
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
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home {
    min-height: 100vh;
    background: #fdf8f3;
    color: #2d1f0e;
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 100px 24px 80px;
    overflow: hidden;
    background: linear-gradient(180deg, #fff7ee 0%, #fdf8f3 100%);
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 500px;
    background: radial-gradient(ellipse at center, rgba(251,146,60,0.13) 0%, rgba(251,191,36,0.07) 50%, transparent 75%);
    pointer-events: none;
  }

  .hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    opacity: 0.55;
  }
  .hero-blob-1 { width: 320px; height: 320px; background: rgba(251,146,60,0.18); top: -60px; left: -80px; }
  .hero-blob-2 { width: 260px; height: 260px; background: rgba(251,191,36,0.15); top: 40px; right: -60px; }
  .hero-blob-3 { width: 200px; height: 200px; background: rgba(239,115,68,0.1); bottom: -30px; left: 30%; }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 18px;
    background: rgba(251,146,60,0.1);
    border: 1px solid rgba(251,146,60,0.28);
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    color: #c2410c;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 30px;
    position: relative;
  }

  .hero-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #f97316;
    animation: pulse 2.2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.75); }
  }

  .hero-title {
    font-family: 'Lora', serif;
    font-size: clamp(38px, 6.5vw, 68px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -1px;
    color: #1c0f00;
    max-width: 740px;
    position: relative;
  }

  .hero-title em {
    font-style: italic;
    color: #ea580c;
  }

  .hero-sub {
    margin-top: 22px;
    font-size: 17px;
    color: #78583a;
    max-width: 480px;
    line-height: 1.72;
    position: relative;
  }

  .hero-stats {
    display: flex;
    margin-top: 56px;
    background: white;
    border: 1px solid rgba(234,88,12,0.12);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(180,80,20,0.08);
    position: relative;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 22px 44px;
  }

  .stat + .stat { border-left: 1px solid rgba(234,88,12,0.1); }

  .stat-value {
    font-family: 'Lora', serif;
    font-size: 26px;
    font-weight: 700;
    color: #ea580c;
  }

  .stat-label {
    font-size: 11.5px;
    color: #a07050;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-weight: 600;
  }

  .scroll-hint {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #b08060;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    position: relative;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }

  /* ── Section ── */
  .section {
    padding: 80px 24px 100px;
    max-width: 1140px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 52px;
  }

  .section-label {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ea580c;
    margin-bottom: 12px;
  }

  .section-title {
    font-family: 'Lora', serif;
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 700;
    color: #1c0f00;
    letter-spacing: -0.4px;
  }

  .section-desc {
    margin-top: 12px;
    color: #8c6040;
    font-size: 15.5px;
    max-width: 440px;
    line-height: 1.65;
  }

  /* ── Cards ── */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .category-card {
    background: white;
    border: 1px solid rgba(234,88,12,0.1);
    border-radius: 18px;
    padding: 28px;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    position: relative;
    overflow: hidden;
  }

  .category-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #f97316, #fbbf24);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }

  .category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(180,80,20,0.12), 0 2px 8px rgba(0,0,0,0.04);
    border-color: rgba(234,88,12,0.22);
  }

  .category-card:hover::after { transform: scaleX(1); }

  .category-icon {
    width: 50px; height: 50px;
    border-radius: 14px;
    background: linear-gradient(135deg, #fff3e8, #ffe8cc);
    border: 1px solid rgba(234,88,12,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 18px;
  }

  .category-name {
    font-family: 'Lora', serif;
    font-size: 17px;
    font-weight: 600;
    color: #1c0f00;
    margin-bottom: 8px;
  }

  .category-desc {
    font-size: 13.5px;
    color: #8c6040;
    line-height: 1.65;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .category-cta {
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #ea580c;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .category-card:hover .category-cta { opacity: 1; transform: translateX(0); }

  /* ── Skeleton ── */
  .skeleton {
    background: linear-gradient(90deg, #f5ede3 25%, #fdf0e2 50%, #f5ede3 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-card {
    background: white;
    border: 1px solid rgba(234,88,12,0.08);
    border-radius: 18px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Empty ── */
  .empty-state { text-align: center; padding: 72px 24px; color: #a07050; }
  .empty-icon { font-size: 44px; margin-bottom: 16px; }
  .empty-text { font-size: 15.5px; }

  /* ── CTA Banner ── */
  .cta-wrap { padding: 0 24px 80px; max-width: 1140px; margin: 0 auto; }

  .cta-banner {
    background: linear-gradient(135deg, #ea580c 0%, #f97316 55%, #fbbf24 100%);
    border-radius: 24px;
    padding: 60px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cta-banner::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
  }

  .cta-banner::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -40px;
    width: 320px; height: 320px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
  }

  .cta-title {
    font-family: 'Lora', serif;
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .cta-sub {
    color: rgba(255,255,255,0.82);
    font-size: 16px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 34px;
    background: white;
    color: #ea580c;
    border: none;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    position: relative;
    z-index: 1;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
`;



export default Home;