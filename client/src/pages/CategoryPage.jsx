import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function SkeletonCard() {
  return (
    <div className="cp-skeleton-card">
      <div className="cp-skeleton" style={{ width: "55%", height: 22, marginBottom: 14 }} />
      <div className="cp-skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
      <div className="cp-skeleton" style={{ width: "75%", height: 14, marginBottom: 24 }} />
      <div className="cp-skeleton" style={{ width: 120, height: 38, borderRadius: 6 }} />
    </div>
  );
}

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects]       = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [id]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res  = await api.get(`/charities?category=${id}`);
      const data = res.data.charities || [];
      setProjects(data);
      setCategoryName(data.length > 0 ? data[0].category?.name || "Projects" : "Projects");
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">

        {/* ── Hero ── */}
        <div className="cp-hero">
          <div className="cp-hero-grid" />
          <div className="cp-hero-content">
            <button className="cp-back" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <p className="cp-eyebrow">
              <span className="cp-eyebrow-dot" />
              Browse Cause
            </p>
            <h1 className="cp-hero-title">
              {loading ? "Loading…" : categoryName}
            </h1>
            {!loading && (
              <p className="cp-hero-sub">
                {projects.length} charit{projects.length !== 1 ? "ies" : "y"} accepting donations in this category
              </p>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="cp-body">

          {loading ? (
            <div className="cp-grid">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="cp-empty">
              <div className="cp-empty-icon">🌱</div>
              <h3 className="cp-empty-title">No charities found</h3>
              <p className="cp-empty-sub">There are no charities in this category yet. Check back soon!</p>
              <button className="cp-empty-btn" onClick={() => navigate("/")}>
                ← Back to Home
              </button>
            </div>
          ) : (
            <div className="cp-grid">
              {projects.map((project, i) => (
                <div key={project._id} className="cp-card">

                  {/* Card number watermark */}
                  <span className="cp-card-num">{String(i + 1).padStart(2, "0")}</span>

                  {/* Avatar */}
                  <div className="cp-card-avatar">
                    {project.name?.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="cp-card-name">{project.name}</h3>
                  <p className="cp-card-mission">{project.mission}</p>

                  {/* Actions */}
                  <div className="cp-card-actions">
                    <button
                      className="cp-btn-donate"
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      Donate Now ❤️
                    </button>
                    <button
                      className="cp-btn-view"
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      View Details →
                    </button>
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

  .cp-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ══ HERO ══ */
  .cp-hero {
    background: var(--navy);
    padding: 64px 60px 56px;
    position: relative;
    overflow: hidden;
  }

  .cp-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .cp-hero-grid::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 700px 350px at 50% 100%, rgba(201,150,58,0.07) 0%, transparent 65%);
  }

  .cp-hero-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
  }

  .cp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.45);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 28px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
    letter-spacing: 0.02em;
  }

  .cp-back:hover { color: var(--gold); }

  .cp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    padding: 5px 14px;
    background: rgba(201,150,58,0.1);
    border: 1px solid rgba(201,150,58,0.22);
    border-radius: 50px;
  }

  .cp-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: cp-pulse 2s ease-in-out infinite;
  }

  @keyframes cp-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .cp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: #fff;
    margin-bottom: 12px;
  }

  .cp-hero-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.4);
    font-weight: 300;
  }

  /* ══ BODY ══ */
  .cp-body {
    max-width: 1160px;
    margin: 0 auto;
    padding: 64px 60px 100px;
  }

  /* ══ GRID ══ */
  .cp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  /* ══ CHARITY CARD ══ */
  .cp-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    animation: cp-fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
    display: flex;
    flex-direction: column;
  }

  @keyframes cp-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.28s ease;
    border-radius: 20px 20px 0 0;
  }

  .cp-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(201,150,58,0.2);
  }

  .cp-card:hover::before { transform: scaleX(1); }

  /* Watermark number */
  .cp-card-num {
    position: absolute;
    top: 16px; right: 20px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 300;
    color: rgba(15,31,61,0.055);
    line-height: 1;
    user-select: none;
  }

  /* Avatar */
  .cp-card-avatar {
    width: 50px; height: 50px;
    border-radius: 14px;
    background: var(--navy);
    color: var(--gold);
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    flex-shrink: 0;
  }

  .cp-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
    letter-spacing: -0.2px;
    line-height: 1.25;
  }

  .cp-card-mission {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.72;
    flex: 1;
    margin-bottom: 24px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ══ CARD ACTIONS ══ */
  .cp-card-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .cp-btn-donate {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 22px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 2px 12px rgba(15,31,61,0.2);
    white-space: nowrap;
  }

  .cp-btn-donate:hover {
    background: var(--navy-mid);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(15,31,61,0.28);
  }

  .cp-btn-view {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 10px 18px;
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
    white-space: nowrap;
  }

  .cp-btn-view:hover {
    border-color: var(--gold);
    color: var(--gold-deep);
    background: var(--gold-light);
  }

  /* ══ SKELETON ══ */
  .cp-skeleton-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
  }

  .cp-skeleton {
    background: linear-gradient(90deg, #f5eddc 25%, #fdf8f0 50%, #f5eddc 75%);
    background-size: 200% 100%;
    animation: cp-shimmer 1.5s infinite;
    border-radius: 6px;
    display: block;
  }

  @keyframes cp-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ══ EMPTY STATE ══ */
  .cp-empty {
    text-align: center;
    padding: 100px 24px;
    color: var(--muted);
  }

  .cp-empty-icon  { font-size: 52px; margin-bottom: 20px; }

  .cp-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 10px;
  }

  .cp-empty-sub {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.7;
    max-width: 360px;
    margin: 0 auto 28px;
  }

  .cp-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 11px 26px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s;
  }

  .cp-empty-btn:hover { background: var(--navy-mid); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 860px) {
    .cp-hero { padding: 48px 28px 44px; }
    .cp-body { padding: 48px 20px 72px; }
    .cp-grid { grid-template-columns: 1fr; }
  }
`;

export default CategoryPage;