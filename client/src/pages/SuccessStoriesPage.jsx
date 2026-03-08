import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const STATUS_CONFIG = {
  completed:   { label: "Completed",   color: "#166534", bg: "rgba(22,101,52,0.08)",   border: "rgba(22,101,52,0.2)"   },
  ongoing:     { label: "Ongoing",     color: "#92400e", bg: "rgba(146,64,14,0.08)",   border: "rgba(146,64,14,0.2)"   },
  pending:     { label: "Pending",     color: "#1e3a5f", bg: "rgba(30,58,95,0.08)",    border: "rgba(30,58,95,0.2)"    },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status, color: "#4e6080", bg: "rgba(78,96,128,0.08)", border: "rgba(78,96,128,0.2)"
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 50,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: "#fffef9", border: "1px solid rgba(15,31,61,0.09)",
      borderRadius: 20, padding: 32, marginBottom: 24,
    }}>
      <div style={{ width: "40%", height: 22, borderRadius: 6, background: "linear-gradient(90deg,#f5eddc 25%,#fdf8f0 50%,#f5eddc 75%)", backgroundSize: "200% 100%", animation: "ss-shimmer 1.5s infinite", marginBottom: 14 }} />
      <div style={{ width: "100%", height: 14, borderRadius: 6, background: "linear-gradient(90deg,#f5eddc 25%,#fdf8f0 50%,#f5eddc 75%)", backgroundSize: "200% 100%", animation: "ss-shimmer 1.5s infinite", marginBottom: 8 }} />
      <div style={{ width: "70%",  height: 14, borderRadius: 6, background: "linear-gradient(90deg,#f5eddc 25%,#fdf8f0 50%,#f5eddc 75%)", backgroundSize: "200% 100%", animation: "ss-shimmer 1.5s infinite" }} />
    </div>
  );
}

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>✕</button>
      <div className="lb-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="lb-img" />
      </div>
    </div>
  );
}

function SuccessStoriesPage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();
  const [lightbox, setLightbox]   = useState(null);

  useEffect(() => {
    api.get("/charities")
      .then(res => setCharities(res.data.charities))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stories = charities.filter(c => c.transparencyUpdates?.length > 0);

  return (
    <>
      <style>{styles}</style>
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      <div className="ss-root">

        {/* ── Hero ── */}
        <div className="ss-hero">
          <div className="ss-hero-grid" />
          <div className="ss-hero-content">
            <p className="ss-eyebrow">
              <span className="ss-eyebrow-dot" />
              Verified Impact
            </p>
            <h1 className="ss-hero-title">
              Real stories of<br /><em>change & impact</em>
            </h1>
            <p className="ss-hero-sub">
              Every update below is a verified transparency report from a charity on FundTrust — showing exactly how your donations are making a difference.
            </p>
          </div>

          {/* Stat strip inside hero */}
          {!loading && (
            <div className="ss-hero-stats">
              <div className="ss-hero-stat">
                <span className="ss-hero-stat-val">{stories.length}</span>
                <span className="ss-hero-stat-lbl">Charities Reporting</span>
              </div>
              <div className="ss-hero-stat-div" />
              <div className="ss-hero-stat">
                <span className="ss-hero-stat-val">
                  {stories.reduce((acc, c) => acc + c.transparencyUpdates.length, 0)}
                </span>
                <span className="ss-hero-stat-lbl">Total Updates</span>
              </div>
              <div className="ss-hero-stat-div" />
              <div className="ss-hero-stat">
                <span className="ss-hero-stat-val">100%</span>
                <span className="ss-hero-stat-lbl">Verified</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="ss-body">

          {loading ? (
            <div className="ss-list">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : stories.length === 0 ? (
            <div className="ss-empty">
              <div className="ss-empty-icon">🌱</div>
              <h3 className="ss-empty-title">No stories yet</h3>
              <p className="ss-empty-sub">Transparency updates from charities will appear here once published.</p>
            </div>
          ) : (
            <div className="ss-list">
              {stories.map((charity, ci) => (
                <div key={charity._id} className="ss-charity-block">

                  {/* Charity header */}
                  <div className="ss-charity-header">
                    <div className="ss-charity-avatar">
                      {charity.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="ss-charity-name">{charity.name}</h2>
                      <p className="ss-charity-meta">
                        {charity.transparencyUpdates.length} update{charity.transparencyUpdates.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="ss-charity-index">
                      {String(ci + 1).padStart(2, "0")}
                    </span>

                    {/* Funding status */}
                    {(() => {
                      const goal = charity.goals?.[0];
                      if (!goal) return null;
                      const progress = Math.min((goal.amountRaised / goal.targetAmount) * 100, 100);
                      const fullyFunded = goal.amountRaised >= goal.targetAmount;
                      return fullyFunded ? (
                        <span className="ss-fully-funded-badge">🎉 Fully Funded</span>
                      ) : (
                        <button
                          className="ss-donate-btn"
                          onClick={() => navigate(`/project/${charity._id}`)}
                        >
                          Donate Now ❤️
                        </button>
                      );
                    })()}
                  </div>

                  {/* Funding progress bar */}
                  {(() => {
                    const goal = charity.goals?.[0];
                    if (!goal) return null;
                    const progress = Math.min((goal.amountRaised / goal.targetAmount) * 100, 100);
                    const fullyFunded = goal.amountRaised >= goal.targetAmount;
                    const remaining = Math.max(goal.targetAmount - goal.amountRaised, 0);
                    return (
                      <div className="ss-goal-bar-wrap">
                        <div className="ss-goal-amounts">
                          <span className="ss-goal-raised">${goal.amountRaised.toLocaleString()} raised</span>
                          <span className="ss-goal-target">Goal: ${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="ss-bar-track">
                          <div
                            className={`ss-bar-fill${fullyFunded ? " ss-bar-fill--full" : ""}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="ss-goal-labels">
                          <span className="ss-goal-pct">{progress.toFixed(1)}% complete</span>
                          {!fullyFunded && (
                            <span className="ss-goal-remaining">${remaining.toLocaleString()} to go</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Updates */}
                  <div className="ss-updates">
                    {charity.transparencyUpdates.map((update, index) => (
                      <div key={index} className="ss-update-card">

                        {/* Card top bar */}
                        <div className="ss-update-top">
                          <div className="ss-update-num">Update {String(index + 1).padStart(2, "0")}</div>
                          <StatusBadge status={update.status} />
                        </div>

                        <h3 className="ss-update-title">{update.title}</h3>
                        <p className="ss-update-desc">{update.description}</p>

                        {/* Images */}
                        {update.images?.length > 0 && (
                          <div className="ss-images">
                            {update.images.map((img, i) => {
                              const src = `http://localhost:5000/uploads/${img}`;
                              const alt = `${update.title} — image ${i + 1}`;
                              return (
                                <div
                                  key={i}
                                  className="ss-img-wrap"
                                  onClick={() => setLightbox({ src, alt })}
                                  title="Click to enlarge"
                                >
                                  <img src={src} alt={alt} className="ss-img" />
                                  <div className="ss-img-overlay">
                                    <span className="ss-img-zoom">⤢</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy:       #0f1f3d;
    --navy-mid:   #1a3260;
    --navy-dark:  #080f1e;
    --navy-light: #f5eddc;
    --gold:       #c9963a;
    --gold-deep:  #a87628;
    --gold-light: #fdf5e6;
    --gold-pale:  rgba(201,150,58,0.1);
    --ink:        #0a1628;
    --muted:      #4e6080;
    --surface:    #fdf8f0;
    --card:       #fffef9;
    --border:     rgba(15,31,61,0.09);
    --shadow-md:  0 8px 36px rgba(15,31,61,0.1);
    --shadow-lg:  0 20px 64px rgba(15,31,61,0.13);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ss-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ══ HERO ══ */
  .ss-hero {
    background: var(--navy);
    padding: 80px 60px 0;
    position: relative;
    overflow: hidden;
  }

  .ss-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .ss-hero-grid::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 700px 400px at 50% 0%, rgba(201,150,58,0.08) 0%, transparent 65%);
  }

  .ss-hero-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding-bottom: 56px;
  }

  .ss-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 22px;
    padding: 5px 14px;
    background: rgba(201,150,58,0.1);
    border: 1px solid rgba(201,150,58,0.22);
    border-radius: 50px;
  }

  .ss-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: ss-pulse 2s ease-in-out infinite;
  }

  @keyframes ss-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .ss-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 5.5vw, 68px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: #fff;
    margin-bottom: 18px;
  }

  .ss-hero-title em { font-style: italic; color: var(--gold); font-weight: 600; }

  .ss-hero-sub {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    line-height: 1.75;
    max-width: 540px;
  }

  /* Floating stat strip */
  .ss-hero-stats {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-bottom: none;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    width: fit-content;
  }

  .ss-hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 20px 44px;
  }

  .ss-hero-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
  }

  .ss-hero-stat-lbl {
    font-size: 10.5px;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-weight: 600;
    white-space: nowrap;
  }

  .ss-hero-stat-div {
    width: 1px;
    height: 36px;
    background: rgba(255,255,255,0.08);
  }

  /* ══ BODY ══ */
  .ss-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 64px 60px 100px;
  }

  .ss-list {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  /* ══ CHARITY BLOCK ══ */
  .ss-charity-block {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-md);
    animation: ss-fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes ss-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ss-charity-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 28px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    position: relative;
  }

  .ss-charity-avatar {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: var(--navy);
    color: var(--gold);
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ss-charity-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.2px;
    margin-bottom: 2px;
  }

  .ss-charity-meta {
    font-size: 12.5px;
    color: var(--muted);
    font-weight: 400;
  }

  .ss-charity-index {
    margin-left: auto;
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 300;
    color: rgba(15,31,61,0.06);
    line-height: 1;
    user-select: none;
  }

  /* ══ UPDATES ══ */
  .ss-updates {
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ss-update-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 26px 28px;
    position: relative;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .ss-update-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--gold);
    border-radius: 14px 0 0 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .ss-update-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: rgba(201,150,58,0.2);
  }

  .ss-update-card:hover::before { opacity: 1; }

  .ss-update-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .ss-update-num {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold-deep);
  }

  .ss-update-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
    letter-spacing: -0.2px;
    line-height: 1.3;
  }

  .ss-update-desc {
    font-size: 14.5px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.75;
    margin-bottom: 20px;
  }

  /* ══ IMAGES ══ */
  .ss-images {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ss-img-wrap {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    flex-shrink: 0;
  }

  .ss-img-wrap:hover {
    transform: scale(1.03);
    box-shadow: var(--shadow-lg);
  }

  .ss-img {
    width: 200px;
    height: 140px;
    object-fit: cover;
    display: block;
  }

  /* ══ EMPTY STATE ══ */
  .ss-empty {
    text-align: center;
    padding: 100px 24px;
    color: var(--muted);
  }

  .ss-empty-icon { font-size: 52px; margin-bottom: 20px; }

  .ss-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
  }

  .ss-empty-sub {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.7;
    max-width: 380px;
    margin: 0 auto;
  }

  /* ══ SKELETON ══ */
  @keyframes ss-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ══ LIGHTBOX ══ */
  .lb-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(8,15,30,0.92);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: lb-in 0.2s ease;
    cursor: zoom-out;
  }

  @keyframes lb-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .lb-close {
    position: absolute;
    top: 24px; right: 28px;
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.75);
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
    z-index: 10000;
  }

  .lb-close:hover { background: rgba(201,150,58,0.2); color: #fff; border-color: var(--gold); }

  .lb-content {
    cursor: default;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: lb-scale 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes lb-scale {
    from { transform: scale(0.92); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }

  .lb-img {
    max-width: 90vw;
    max-height: 88vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    display: block;
  }

  .ss-donate-btn {
    margin-left: auto;
    padding: 9px 20px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 2px 10px rgba(15,31,61,0.2);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ss-donate-btn:hover {
    background: var(--navy-mid);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(15,31,61,0.28);
  }

  .ss-fully-funded-badge {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    background: rgba(22,101,52,0.08);
    border: 1px solid rgba(22,101,52,0.22);
    border-radius: 50px;
    font-size: 12.5px;
    font-weight: 700;
    color: #166534;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ss-goal-bar-wrap {
    padding: 18px 32px 20px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .ss-goal-amounts {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .ss-goal-raised {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 700;
    color: #166534;
  }

  .ss-goal-target {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
  }

  .ss-bar-track {
    width: 100%;
    height: 8px;
    background: rgba(15,31,61,0.08);
    border-radius: 50px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .ss-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--navy) 0%, var(--gold) 100%);
    border-radius: 50px;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }

  .ss-bar-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: ss-bar-shimmer 2s ease-in-out infinite;
  }

  @keyframes ss-bar-shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .ss-bar-fill--full {
    background: linear-gradient(90deg, #166534 0%, #22c55e 100%);
  }

  .ss-goal-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ss-goal-pct {
    font-size: 12px;
    font-weight: 700;
    color: var(--navy);
  }

  .ss-goal-remaining {
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
  }

  /* ══ IMAGE HOVER OVERLAY ══ */
  .ss-img-wrap {
    position: relative;
    cursor: zoom-in;
  }

  .ss-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(8,15,30,0.45);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .ss-img-wrap:hover .ss-img-overlay { opacity: 1; }

  .ss-img-zoom {
    color: white;
    font-size: 26px;
    line-height: 1;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 860px) {
    .ss-hero { padding: 60px 28px 0; }
    .ss-hero-content { padding-bottom: 40px; }
    .ss-hero-stats { width: 100%; border-radius: 12px 12px 0 0; justify-content: center; }
    .ss-hero-stat { padding: 16px 24px; }
    .ss-body { padding: 48px 20px 72px; }
    .ss-charity-header { padding: 20px 20px; }
    .ss-updates { padding: 20px; }
    .ss-update-card { padding: 20px; }
    .ss-charity-index { display: none; }
    .ss-img { width: 150px; height: 110px; }
  }
`;

export default SuccessStoriesPage;