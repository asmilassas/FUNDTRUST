import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject]           = useState(null);
  const [amount, setAmount]             = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage]           = useState({ text: "", type: "" });
  const [donating, setDonating]         = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { fetchProject(); }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setProject(res.data.charity);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user) { navigate("/login"); return; }
    if (user.isAdmin) { setMessage({ text: "Admin users cannot donate.", type: "error" }); return; }
    if (isFullyFunded) { setMessage({ text: "This project is already fully funded.", type: "error" }); return; }
    if (!amount || amount <= 0) { setMessage({ text: "Please enter a valid amount.", type: "error" }); return; }

    try {
      setDonating(true);
      const formData = new FormData();
      formData.append("charityId", id);
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "bank") {
        if (!selectedFile) { setMessage({ text: "Please upload a receipt image.", type: "error" }); setDonating(false); return; }
        formData.append("receiptImage", selectedFile);
      }

      const response = await api.post("/donations/one-time", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ text: response.data.message, type: "success" });
      setAmount("");
      setSelectedFile(null);
      fetchProject();
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Donation failed.", type: "error" });
    } finally {
      setDonating(false);
    }
  };

  if (!project) return (
    <>
      <style>{styles}</style>
      <div className="pp-loading">
        <div className="pp-spinner" />
        <p>Loading project…</p>
      </div>
    </>
  );

  const goal        = project.goals?.[0];
  const progress    = goal ? Math.min((goal.amountRaised / goal.targetAmount) * 100, 100) : 0;
  const remaining   = goal ? Math.max(goal.targetAmount - goal.amountRaised, 0) : 0;
  const isFullyFunded = goal ? goal.amountRaised >= goal.targetAmount : false;

  return (
    <>
      <style>{styles}</style>
      <div className="pp-root">

        {/* ── Hero ── */}
        <div className="pp-hero">
          <div className="pp-hero-grid" />
          <div className="pp-hero-content">
            <button className="pp-back" onClick={() => navigate(-1)}>← Back</button>
            <p className="pp-eyebrow">
              <span className="pp-eyebrow-dot" />
              {project.category?.name || "Charity"}
            </p>
            <h1 className="pp-hero-title">{project.name}</h1>
            <p className="pp-hero-mission">{project.mission}</p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="pp-body">

          {/* LEFT — Progress + Donation form */}
          <div className="pp-main">

            {/* Funding Progress Card */}
            {goal && (
              <div className="pp-card pp-progress-card">
                <div className="pp-card-header">
                  <h2 className="pp-card-title">Funding Progress</h2>
                  {isFullyFunded && (
                    <span className="pp-funded-badge">🎉 Fully Funded</span>
                  )}
                </div>

                {/* Amounts row */}
                <div className="pp-amounts">
                  <div className="pp-amount-item">
                    <span className="pp-amount-val pp-amount-raised">
                      ${goal.amountRaised.toLocaleString()}
                    </span>
                    <span className="pp-amount-lbl">Raised</span>
                  </div>
                  <div className="pp-amount-divider" />
                  <div className="pp-amount-item">
                    <span className="pp-amount-val">
                      ${goal.targetAmount.toLocaleString()}
                    </span>
                    <span className="pp-amount-lbl">Goal</span>
                  </div>
                  <div className="pp-amount-divider" />
                  <div className="pp-amount-item">
                    <span className="pp-amount-val pp-amount-remaining">
                      ${remaining.toLocaleString()}
                    </span>
                    <span className="pp-amount-lbl">Remaining</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pp-bar-wrap">
                  <div
                    className={`pp-bar-fill${isFullyFunded ? " pp-bar-full" : ""}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="pp-bar-labels">
                  <span className="pp-bar-pct">{progress.toFixed(1)}% complete</span>
                  {!isFullyFunded && (
                    <span className="pp-bar-left">${remaining.toLocaleString()} to go</span>
                  )}
                </div>
              </div>
            )}

            {/* Donation Form Card */}
            <div className="pp-card">
              <h2 className="pp-card-title">Make a Donation</h2>
              <p className="pp-card-sub">Your contribution goes directly to this cause.</p>

              {!user ? (
                <div className="pp-login-prompt">
                  <p className="pp-login-text">You need to be logged in to donate.</p>
                  <button className="pp-btn-primary" onClick={() => navigate("/login")}>
                    Log in to Donate →
                  </button>
                </div>
              ) : user.isAdmin ? (
                <div className="pp-notice pp-notice--warn">
                  Admin accounts cannot make donations.
                </div>
              ) : (
                <form onSubmit={handleDonate} className="pp-form">

                  {/* Amount */}
                  <div className="pp-field">
                    <label className="pp-label">Donation Amount ($)</label>
                    <div className="pp-input-wrap">
                      <span className="pp-input-prefix">$</span>
                      <input
                        className="pp-input"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Quick amounts */}
                  <div className="pp-quick-amounts">
                    {[10, 25, 50, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`pp-quick-btn${Number(amount) === val ? " pp-quick-btn--active" : ""}`}
                        onClick={() => setAmount(String(val))}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>

                  {/* Payment method */}
                  <div className="pp-field">
                    <label className="pp-label">Payment Method</label>
                    <div className="pp-method-row">
                      <button
                        type="button"
                        className={`pp-method-btn${paymentMethod === "stripe" ? " pp-method-btn--active" : ""}`}
                        onClick={() => setPaymentMethod("stripe")}
                      >
                        💳 Stripe
                      </button>
                      <button
                        type="button"
                        className={`pp-method-btn${paymentMethod === "bank" ? " pp-method-btn--active" : ""}`}
                        onClick={() => setPaymentMethod("bank")}
                      >
                        🏦 Bank Transfer
                      </button>
                    </div>
                  </div>

                  {/* Receipt upload */}
                  {paymentMethod === "bank" && (
                    <div className="pp-field">
                      <label className="pp-label">Upload Receipt</label>
                      <label className="pp-file-label">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          accept="image/*"
                        />
                        <span className="pp-file-icon">📎</span>
                        <span>{selectedFile ? selectedFile.name : "Click to upload receipt image"}</span>
                      </label>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="pp-btn-donate"
                    disabled={isFullyFunded || donating}
                  >
                    {donating ? "Processing…" : isFullyFunded ? "Fully Funded" : "Donate Now ❤️"}
                  </button>

                </form>
              )}

              {/* Message */}
              {message.text && (
                <div className={`pp-message pp-message--${message.type}`}>
                  {message.type === "success" ? "✅" : "⚠️"} {message.text}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT — Sidebar info */}
          <aside className="pp-sidebar">

            <div className="pp-sidebar-card">
              <h3 className="pp-sidebar-title">About this Charity</h3>
              <p className="pp-sidebar-text">{project.mission}</p>
            </div>

            {project.goals?.length > 1 && (
              <div className="pp-sidebar-card">
                <h3 className="pp-sidebar-title">All Funding Goals</h3>
                {project.goals.map((g, i) => {
                  const p = Math.min((g.amountRaised / g.targetAmount) * 100, 100);
                  return (
                    <div key={i} className="pp-mini-goal">
                      <div className="pp-mini-goal-row">
                        <span className="pp-mini-goal-name">{g.title || `Goal ${i + 1}`}</span>
                        <span className="pp-mini-goal-pct">{p.toFixed(0)}%</span>
                      </div>
                      <div className="pp-mini-bar-wrap">
                        <div className="pp-mini-bar-fill" style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pp-sidebar-card pp-sidebar-trust">
              <div className="pp-trust-item">🔒 Secure payment processing</div>
              <div className="pp-trust-item">✅ Verified charity</div>
              <div className="pp-trust-item">📊 Real-time fund tracking</div>
              <div className="pp-trust-item">🧾 Receipt provided</div>
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
    --green:      #166534;
    --green-bg:   rgba(22,101,52,0.08);
    --green-border: rgba(22,101,52,0.2);
    --red:        #991b1b;
    --red-bg:     rgba(153,27,27,0.07);
    --red-border: rgba(153,27,27,0.18);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── Loading ── */
  .pp-loading {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: var(--muted);
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: pp-spin 0.8s linear infinite;
  }

  @keyframes pp-spin { to { transform: rotate(360deg); } }

  /* ── Hero ── */
  .pp-hero {
    background: var(--navy);
    padding: 64px 60px 56px;
    position: relative;
    overflow: hidden;
  }

  .pp-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .pp-hero-grid::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 700px 350px at 60% 100%, rgba(201,150,58,0.07) 0%, transparent 65%);
  }

  .pp-hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }

  .pp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.4);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 24px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
  }

  .pp-back:hover { color: var(--gold); }

  .pp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 14px;
    padding: 5px 14px;
    background: rgba(201,150,58,0.1);
    border: 1px solid rgba(201,150,58,0.22);
    border-radius: 50px;
  }

  .pp-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pp-pulse 2s ease-in-out infinite;
  }

  @keyframes pp-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .pp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4.5vw, 56px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    color: #fff;
    margin-bottom: 14px;
  }

  .pp-hero-mission {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    line-height: 1.7;
    max-width: 600px;
  }

  /* ── Body layout ── */
  .pp-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 56px 60px 100px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
    align-items: start;
  }

  .pp-main { display: flex; flex-direction: column; gap: 24px; }

  /* ── Card ── */
  .pp-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px;
    box-shadow: var(--shadow-md);
  }

  .pp-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .pp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.2px;
    margin-bottom: 6px;
  }

  .pp-card-sub {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 28px;
    line-height: 1.6;
  }

  /* ── Fully funded badge ── */
  .pp-funded-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    background: var(--green-bg);
    border: 1px solid var(--green-border);
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
    color: var(--green);
    letter-spacing: 0.04em;
  }

  /* ── Amounts row ── */
  .pp-amounts {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .pp-amount-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 20px 16px;
  }

  .pp-amount-divider {
    width: 1px;
    height: 40px;
    background: var(--border);
    flex-shrink: 0;
  }

  .pp-amount-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }

  .pp-amount-raised   { color: var(--green); }
  .pp-amount-remaining { color: var(--navy); }

  .pp-amount-lbl {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Progress bar ── */
  .pp-bar-wrap {
    width: 100%;
    height: 10px;
    background: var(--navy-light);
    border-radius: 50px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .pp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--navy) 0%, var(--gold) 100%);
    border-radius: 50px;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
    position: relative;
  }

  /* Shimmer effect on bar */
  .pp-bar-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
    animation: pp-shimmer 2s ease-in-out infinite;
  }

  @keyframes pp-shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .pp-bar-full {
    background: linear-gradient(90deg, var(--green) 0%, #22c55e 100%);
  }

  .pp-bar-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pp-bar-pct {
    font-size: 13px;
    font-weight: 600;
    color: var(--navy);
  }

  .pp-bar-left {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
  }

  /* ── Form ── */
  .pp-form { display: flex; flex-direction: column; gap: 22px; }

  .pp-field { display: flex; flex-direction: column; gap: 8px; }

  .pp-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .pp-input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    overflow: hidden;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .pp-input-wrap:focus-within {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  .pp-input-prefix {
    padding: 0 14px;
    font-size: 16px;
    font-weight: 600;
    color: var(--muted);
    border-right: 1.5px solid var(--border);
    background: var(--navy-light);
    height: 100%;
    display: flex;
    align-items: center;
    align-self: stretch;
  }

  .pp-input {
    flex: 1;
    padding: 13px 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--ink);
    background: transparent;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
  }

  .pp-input::placeholder { color: rgba(78,96,128,0.35); }

  /* Quick amount pills */
  .pp-quick-amounts {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pp-quick-btn {
    padding: 7px 18px;
    border: 1.5px solid var(--border);
    border-radius: 50px;
    background: transparent;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .pp-quick-btn:hover { border-color: var(--gold); color: var(--gold-deep); background: var(--gold-light); }

  .pp-quick-btn--active {
    border-color: var(--navy);
    background: var(--navy);
    color: white;
  }

  /* Payment method toggle */
  .pp-method-row { display: flex; gap: 12px; flex-wrap: wrap; }

  .pp-method-btn {
    flex: 1;
    padding: 12px 16px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    text-align: center;
  }

  .pp-method-btn:hover { border-color: var(--gold); background: var(--gold-light); color: var(--gold-deep); }

  .pp-method-btn--active {
    border-color: var(--navy);
    background: var(--navy);
    color: white;
  }

  /* File upload */
  .pp-file-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 16px;
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    background: var(--surface);
    cursor: pointer;
    font-size: 14px;
    color: var(--muted);
    font-weight: 400;
    transition: border-color 0.15s, background 0.15s;
  }

  .pp-file-label:hover { border-color: var(--gold); background: var(--gold-light); }
  .pp-file-icon { font-size: 18px; }

  /* Donate button */
  .pp-btn-donate {
    width: 100%;
    padding: 15px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 16px rgba(15,31,61,0.22);
    letter-spacing: 0.01em;
  }

  .pp-btn-donate:hover:not(:disabled) {
    background: var(--navy-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(15,31,61,0.28);
  }

  .pp-btn-donate:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Login prompt */
  .pp-login-prompt {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .pp-login-text { font-size: 15px; color: var(--muted); font-weight: 300; }

  .pp-btn-primary {
    padding: 11px 24px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s;
  }

  .pp-btn-primary:hover { background: var(--navy-mid); }

  /* Notice */
  .pp-notice {
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }

  .pp-notice--warn {
    background: var(--red-bg);
    border: 1px solid var(--red-border);
    color: var(--red);
  }

  /* Message */
  .pp-message {
    margin-top: 20px;
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.5;
  }

  .pp-message--success {
    background: var(--green-bg);
    border: 1px solid var(--green-border);
    color: var(--green);
  }

  .pp-message--error {
    background: var(--red-bg);
    border: 1px solid var(--red-border);
    color: var(--red);
  }

  /* ── Sidebar ── */
  .pp-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: 90px;
  }

  .pp-sidebar-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-md);
  }

  .pp-sidebar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 12px;
    letter-spacing: -0.2px;
  }

  .pp-sidebar-text {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.75;
  }

  /* Mini goals */
  .pp-mini-goal { margin-bottom: 16px; }
  .pp-mini-goal:last-child { margin-bottom: 0; }

  .pp-mini-goal-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .pp-mini-goal-name { font-size: 13px; font-weight: 500; color: var(--ink); }
  .pp-mini-goal-pct  { font-size: 12px; font-weight: 700; color: var(--gold-deep); }

  .pp-mini-bar-wrap {
    width: 100%;
    height: 6px;
    background: var(--navy-light);
    border-radius: 50px;
    overflow: hidden;
  }

  .pp-mini-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--navy) 0%, var(--gold) 100%);
    border-radius: 50px;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }

  /* Trust sidebar */
  .pp-sidebar-trust {
    background: var(--navy);
    border-color: rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pp-trust-item {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .pp-hero  { padding: 48px 28px 44px; }
    .pp-body  { grid-template-columns: 1fr; padding: 40px 20px 72px; }
    .pp-sidebar { position: static; }
    .pp-card  { padding: 24px; }
    .pp-amounts { flex-wrap: wrap; }
  }
`;

export default ProjectPage;