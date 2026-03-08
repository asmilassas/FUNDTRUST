import { useEffect, useState } from "react";
import api from "../services/api";

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="fb-stars-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`fb-star-btn${(hovered || value) >= star ? " fb-star-btn--on" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
      <span className="fb-star-label">{value} / 5</span>
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <div className="fb-stars-display">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`fb-star-static${rating >= s ? " fb-star-static--on" : ""}`}>★</span>
      ))}
    </div>
  );
}

function FeedbackPage() {
  const [feedback, setFeedback]   = useState([]);
  const [rating, setRating]       = useState(5);
  const [comment, setComment]     = useState("");
  const [user, setUser]           = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedback(Array.isArray(res.data.feedback) ? res.data.feedback : []);
    } catch (err) {
      console.error("Fetch feedback failed", err);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!comment.trim()) { setError("Please write a comment before submitting."); return; }
    setError("");
    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/feedback/${editingId}`, { rating, comment });
        setEditingId(null);
      } else {
        await api.post("/feedback", { rating, comment });
      }
      setComment("");
      setRating(5);
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete your feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedback();
    } catch {
      setError("Delete failed. Please try again.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setRating(item.rating);
    setComment(item.comment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setRating(5);
    setComment("");
    setError("");
  };

  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: feedback.filter((f) => f.rating === r).length,
    pct: feedback.length > 0
      ? (feedback.filter((f) => f.rating === r).length / feedback.length) * 100
      : 0,
  }));

  return (
    <>
      <style>{styles}</style>
      <div className="fb-root">

        {/* ── Hero ── */}
        <div className="fb-hero">
          <div className="fb-hero-grid" />
          <div className="fb-hero-content">
            <p className="fb-eyebrow">
              <span className="fb-eyebrow-dot" />
              Community Reviews
            </p>
            <h1 className="fb-hero-title">
              Platform<br /><em>Feedback</em>
            </h1>
            <p className="fb-hero-sub">
              Help us improve FundTrust by sharing your honest experience.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="fb-body">

          {/* LEFT — form + list */}
          <div className="fb-main">

            {/* Form */}
            {user ? (
              <div className="fb-card">
                <div className="fb-card-header">
                  <h2 className="fb-card-title">
                    {editingId ? "Edit Your Review" : "Leave a Review"}
                  </h2>
                  {editingId && (
                    <button className="fb-cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>

                <div className="fb-field">
                  <label className="fb-label">Your Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div className="fb-field">
                  <label className="fb-label">Your Comment</label>
                  <textarea
                    className="fb-textarea"
                    placeholder="Share your experience with FundTrust..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="fb-error">⚠️ {error}</div>
                )}

                <button
                  className="fb-submit-btn"
                  onClick={submitFeedback}
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : editingId ? "Update Review" : "Submit Review"}
                </button>
              </div>
            ) : (
              <div className="fb-card fb-login-prompt">
                <div className="fb-login-icon">💬</div>
                <h3 className="fb-login-title">Share Your Experience</h3>
                <p className="fb-login-text">Log in to leave a review and help other donors make informed decisions.</p>
                <a href="/login" className="fb-login-btn">Log in to Review →</a>
              </div>
            )}

            {/* Feedback list */}
            <div className="fb-list-header">
              <h2 className="fb-list-title">
                {feedback.length} Review{feedback.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {loading ? (
              <div className="fb-list">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="fb-skeleton-card">
                    <div className="fb-skeleton" style={{ width: "40%", height: 16, marginBottom: 10 }} />
                    <div className="fb-skeleton" style={{ width: "30%", height: 14, marginBottom: 12 }} />
                    <div className="fb-skeleton" style={{ width: "100%", height: 13, marginBottom: 6 }} />
                    <div className="fb-skeleton" style={{ width: "70%", height: 13 }} />
                  </div>
                ))}
              </div>
            ) : feedback.length === 0 ? (
              <div className="fb-empty">
                <div className="fb-empty-icon">🌟</div>
                <p className="fb-empty-text">No reviews yet — be the first!</p>
              </div>
            ) : (
              <div className="fb-list">
                {feedback.map((f) => {
                  const isOwner = user && f.user && user._id && f.user._id &&
                    String(user._id) === String(f.user._id);

                  return (
                    <div key={f._id} className={`fb-review-card${isOwner ? " fb-review-card--own" : ""}`}>
                      <div className="fb-review-top">
                        <div className="fb-review-avatar">
                          {(f.user?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="fb-review-meta">
                          <span className="fb-review-name">
                            {f.user?.name || "Anonymous"}
                            {isOwner && <span className="fb-own-tag">You</span>}
                          </span>
                          <span className="fb-review-date">
                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric"
                            }) : ""}
                          </span>
                        </div>
                        <StarDisplay rating={f.rating || 0} />
                      </div>

                      <p className="fb-review-comment">{f.comment}</p>

                      {isOwner && (
                        <div className="fb-review-actions">
                          <button className="fb-edit-btn" onClick={() => startEdit(f)}>
                            ✏️ Edit
                          </button>
                          <button className="fb-delete-btn" onClick={() => deleteFeedback(f._id)}>
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* RIGHT — Summary sidebar */}
          <aside className="fb-sidebar">

            {averageRating && (
              <div className="fb-sidebar-card fb-rating-summary">
                <p className="fb-sidebar-label">Overall Rating</p>
                <div className="fb-big-rating">{averageRating}</div>
                <StarDisplay rating={Math.round(averageRating)} />
                <p className="fb-rating-count">{feedback.length} review{feedback.length !== 1 ? "s" : ""}</p>

                <div className="fb-breakdown">
                  {ratingCounts.map(({ star, count, pct }) => (
                    <div key={star} className="fb-breakdown-row">
                      <span className="fb-breakdown-star">{star}★</span>
                      <div className="fb-breakdown-bar-wrap">
                        <div className="fb-breakdown-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="fb-breakdown-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="fb-sidebar-card">
              <p className="fb-sidebar-label">Why Review?</p>
              <div className="fb-why-list">
                <div className="fb-why-item">💡 Help others choose wisely</div>
                <div className="fb-why-item">🔧 Shape platform improvements</div>
                <div className="fb-why-item">🤝 Build a trusted community</div>
              </div>
            </div>

          </aside>

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
    --red:        #991b1b;
    --red-bg:     rgba(153,27,27,0.07);
    --red-border: rgba(153,27,27,0.18);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fb-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ══ HERO ══ */
  .fb-hero {
    background: var(--navy);
    padding: 72px 60px 60px;
    position: relative;
    overflow: hidden;
  }

  .fb-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .fb-hero-grid::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 700px 350px at 60% 100%, rgba(201,150,58,0.07) 0%, transparent 65%);
  }

  .fb-hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }

  .fb-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    padding: 5px 14px;
    background: rgba(201,150,58,0.1);
    border: 1px solid rgba(201,150,58,0.22);
    border-radius: 50px;
  }

  .fb-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: fb-pulse 2s ease-in-out infinite;
  }

  @keyframes fb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .fb-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: #fff;
    margin-bottom: 16px;
  }

  .fb-hero-title em { font-style: italic; color: var(--gold); font-weight: 600; }

  .fb-hero-sub {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    line-height: 1.7;
    max-width: 460px;
  }

  /* ══ BODY ══ */
  .fb-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 56px 60px 100px;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 32px;
    align-items: start;
  }

  .fb-main { display: flex; flex-direction: column; gap: 24px; }

  /* ══ CARD ══ */
  .fb-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px;
    box-shadow: var(--shadow-md);
  }

  .fb-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .fb-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.2px;
  }

  .fb-cancel-btn {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s, color 0.15s;
  }

  .fb-cancel-btn:hover { border-color: var(--red); color: var(--red); }

  /* ══ FORM FIELDS ══ */
  .fb-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }

  .fb-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ══ STAR RATING INPUT ══ */
  .fb-stars-input {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fb-star-btn {
    font-size: 28px;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(15,31,61,0.15);
    line-height: 1;
    padding: 2px;
    transition: color 0.12s, transform 0.12s;
  }

  .fb-star-btn--on { color: var(--gold); }
  .fb-star-btn:hover { transform: scale(1.15); }

  .fb-star-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    margin-left: 8px;
  }

  /* ══ STAR DISPLAY ══ */
  .fb-stars-display { display: flex; gap: 2px; }

  .fb-star-static {
    font-size: 15px;
    color: rgba(15,31,61,0.12);
  }

  .fb-star-static--on { color: var(--gold); }

  /* ══ TEXTAREA ══ */
  .fb-textarea {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: var(--ink);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    outline: none;
    resize: vertical;
    min-height: 120px;
    line-height: 1.65;
    transition: border-color 0.18s, box-shadow 0.18s;
    width: 100%;
  }

  .fb-textarea::placeholder { color: rgba(78,96,128,0.35); }

  .fb-textarea:focus {
    border-color: var(--gold);
    background: var(--card);
    box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  /* ══ ERROR ══ */
  .fb-error {
    padding: 12px 16px;
    background: var(--red-bg);
    border: 1px solid var(--red-border);
    border-radius: 8px;
    font-size: 13.5px;
    color: var(--red);
    font-weight: 500;
    margin-bottom: 16px;
  }

  /* ══ SUBMIT ══ */
  .fb-submit-btn {
    width: 100%;
    padding: 14px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 16px rgba(15,31,61,0.2);
  }

  .fb-submit-btn:hover:not(:disabled) {
    background: var(--navy-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15,31,61,0.26);
  }

  .fb-submit-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

  /* ══ LOGIN PROMPT ══ */
  .fb-login-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding: 48px 36px;
  }

  .fb-login-icon  { font-size: 40px; }
  .fb-login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
  }
  .fb-login-text  { font-size: 14px; color: var(--muted); font-weight: 300; line-height: 1.65; max-width: 320px; }

  .fb-login-btn {
    padding: 11px 26px;
    background: var(--navy);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.18s;
    margin-top: 4px;
  }

  .fb-login-btn:hover { background: var(--navy-mid); }

  /* ══ LIST HEADER ══ */
  .fb-list-header { padding: 0 4px; }

  .fb-list-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.2px;
  }

  /* ══ REVIEW CARDS ══ */
  .fb-list { display: flex; flex-direction: column; gap: 16px; }

  .fb-review-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 28px;
    box-shadow: var(--shadow-md);
    transition: box-shadow 0.2s, border-color 0.2s;
    animation: fb-fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes fb-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fb-review-card:hover { box-shadow: var(--shadow-lg); border-color: rgba(201,150,58,0.15); }

  .fb-review-card--own {
    border-left: 3px solid var(--gold);
  }

  .fb-review-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .fb-review-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--navy);
    color: var(--gold);
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .fb-review-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .fb-review-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fb-own-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold-deep);
    background: var(--gold-pale);
    border: 1px solid rgba(201,150,58,0.2);
    border-radius: 4px;
    padding: 1px 6px;
  }

  .fb-review-date {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
  }

  .fb-review-comment {
    font-size: 14.5px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.75;
    margin-bottom: 16px;
  }

  .fb-review-actions { display: flex; gap: 10px; }

  .fb-edit-btn {
    padding: 6px 14px;
    background: var(--gold-pale);
    border: 1px solid rgba(201,150,58,0.2);
    border-radius: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--gold-deep);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }

  .fb-edit-btn:hover { background: var(--gold-light); border-color: var(--gold); }

  .fb-delete-btn {
    padding: 6px 14px;
    background: var(--red-bg);
    border: 1px solid var(--red-border);
    border-radius: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--red);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .fb-delete-btn:hover { background: rgba(153,27,27,0.13); }

  /* ══ EMPTY ══ */
  .fb-empty { text-align: center; padding: 60px 24px; color: var(--muted); }
  .fb-empty-icon { font-size: 44px; margin-bottom: 14px; }
  .fb-empty-text { font-size: 15px; font-weight: 300; }

  /* ══ SKELETON ══ */
  .fb-skeleton-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 28px;
  }

  .fb-skeleton {
    background: linear-gradient(90deg, #f5eddc 25%, #fdf8f0 50%, #f5eddc 75%);
    background-size: 200% 100%;
    animation: fb-shimmer 1.5s infinite;
    border-radius: 6px;
    display: block;
  }

  @keyframes fb-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ══ SIDEBAR ══ */
  .fb-sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 90px; }

  .fb-sidebar-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-md);
  }

  .fb-sidebar-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }

  /* Rating summary */
  .fb-rating-summary { text-align: center; }

  .fb-big-rating {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 8px;
  }

  .fb-rating-count {
    font-size: 13px;
    color: var(--muted);
    font-weight: 400;
    margin-top: 6px;
    margin-bottom: 20px;
  }

  /* Breakdown bars */
  .fb-breakdown { display: flex; flex-direction: column; gap: 8px; text-align: left; }

  .fb-breakdown-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fb-breakdown-star {
    font-size: 12px;
    color: var(--muted);
    font-weight: 600;
    width: 22px;
    flex-shrink: 0;
  }

  .fb-breakdown-bar-wrap {
    flex: 1;
    height: 6px;
    background: rgba(15,31,61,0.07);
    border-radius: 50px;
    overflow: hidden;
  }

  .fb-breakdown-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--navy) 0%, var(--gold) 100%);
    border-radius: 50px;
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
  }

  .fb-breakdown-count {
    font-size: 12px;
    color: var(--muted);
    font-weight: 600;
    width: 16px;
    text-align: right;
    flex-shrink: 0;
  }

  /* Why review */
  .fb-why-list { display: flex; flex-direction: column; gap: 10px; }

  .fb-why-item {
    font-size: 13.5px;
    color: var(--muted);
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.5;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .fb-hero { padding: 56px 28px 48px; }
    .fb-body { grid-template-columns: 1fr; padding: 40px 20px 72px; }
    .fb-sidebar { position: static; }
    .fb-card { padding: 24px 20px; }
    .fb-review-card { padding: 20px; }
  }
`;

export default FeedbackPage;