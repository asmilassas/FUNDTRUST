import { useState } from "react";

function ContactPage() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    alert("Message sent successfully!");
    setMessage("");
    setName("");
    setEmail("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ct-root">

        {/* ── Hero ── */}
        <div className="ct-hero">
          <div className="ct-hero-grid" />
          <div className="ct-hero-content">
            <p className="ct-eyebrow">
              <span className="ct-eyebrow-dot" />
              Get in Touch
            </p>
            <h1 className="ct-hero-title">
              We'd love to<br /><em>hear from you</em>
            </h1>
            <p className="ct-hero-sub">
              Have a question, suggestion, or need support? Our team typically responds within 24 hours.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ct-body">

          {/* Left — contact info */}
          <aside className="ct-info">

            <div className="ct-info-card">
              <div className="ct-info-icon">✉️</div>
              <div>
                <p className="ct-info-label">Email Us</p>
                <a href="mailto:support@fundtrust.com" className="ct-info-value">
                  support@fundtrust.com
                </a>
              </div>
            </div>

            <div className="ct-info-card">
              <div className="ct-info-icon">📞</div>
              <div>
                <p className="ct-info-label">Call Us</p>
                <a href="tel:+94770000000" className="ct-info-value">
                  +94 77 000 0000
                </a>
              </div>
            </div>

            <div className="ct-info-card">
              <div className="ct-info-icon">🕐</div>
              <div>
                <p className="ct-info-label">Response Time</p>
                <p className="ct-info-value">Within 24 hours</p>
              </div>
            </div>

            <div className="ct-divider" />

            <p className="ct-info-note">
              For urgent donation issues, please email us directly with your transaction ID.
            </p>

          </aside>

          {/* Right — form */}
          <div className="ct-form-wrap">
            <div className="ct-form-header">
              <h2 className="ct-form-title">Send Us a Message</h2>
              <p className="ct-form-sub">Fill in the form below and we'll get back to you shortly.</p>
            </div>

            <div className="ct-form">

              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label">Full Name</label>
                  <input
                    className="ct-input"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="ct-field">
                  <label className="ct-label">Email Address</label>
                  <input
                    className="ct-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">Message</label>
                <textarea
                  className="ct-textarea"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button className="ct-btn" onClick={handleSubmit}>
                <span>Send Message</span>
                <span className="ct-btn-arrow">→</span>
              </button>

            </div>
          </div>

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
    --shadow-sm:  0 2px 12px rgba(15,31,61,0.07);
    --shadow-md:  0 8px 36px rgba(15,31,61,0.1);
    --shadow-lg:  0 20px 64px rgba(15,31,61,0.13);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ct-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── Hero ── */
  .ct-hero {
    background: var(--navy);
    padding: 80px 60px 72px;
    position: relative;
    overflow: hidden;
  }

  .ct-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .ct-hero-grid::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 700px 400px at 40% 50%, rgba(201,150,58,0.07) 0%, transparent 65%);
  }

  .ct-hero-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
  }

  .ct-eyebrow {
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

  .ct-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: ct-pulse 2s ease-in-out infinite;
  }

  @keyframes ct-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .ct-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: #fff;
    margin-bottom: 18px;
  }

  .ct-hero-title em {
    font-style: italic;
    color: var(--gold);
    font-weight: 600;
  }

  .ct-hero-sub {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    line-height: 1.7;
    max-width: 480px;
  }

  /* ── Body ── */
  .ct-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 72px 60px 100px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 56px;
    align-items: start;
  }

  /* ── Info Sidebar ── */
  .ct-info {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: sticky;
    top: 100px;
  }

  .ct-info-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 22px 0;
    border-bottom: 1px solid var(--border);
  }

  .ct-info-card:first-child { padding-top: 0; }

  .ct-info-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: var(--navy-light);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .ct-info-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 5px;
  }

  .ct-info-value {
    font-size: 14.5px;
    font-weight: 500;
    color: var(--ink);
    text-decoration: none;
    line-height: 1.5;
    transition: color 0.15s;
  }

  a.ct-info-value:hover { color: var(--gold-deep); }

  .ct-divider {
    width: 100%;
    height: 1px;
    background: var(--border);
    margin: 24px 0 20px;
  }

  .ct-info-note {
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.7;
    padding: 16px;
    background: var(--gold-light);
    border: 1px solid rgba(201,150,58,0.15);
    border-left: 3px solid var(--gold);
    border-radius: 0 8px 8px 0;
  }

  /* ── Form ── */
  .ct-form-wrap {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px;
    box-shadow: var(--shadow-md);
  }

  .ct-form-header {
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border);
  }

  .ct-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  .ct-form-sub {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.6;
  }

  .ct-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ct-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .ct-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ct-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .ct-input,
  .ct-textarea {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: var(--ink);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 13px 16px;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
    width: 100%;
  }

  .ct-input::placeholder,
  .ct-textarea::placeholder {
    color: rgba(78,96,128,0.4);
  }

  .ct-input:focus,
  .ct-textarea:focus {
    border-color: var(--gold);
    background: var(--card);
    box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  .ct-textarea {
    height: 140px;
    resize: vertical;
    line-height: 1.65;
  }

  .ct-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 36px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    align-self: flex-start;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 16px rgba(15,31,61,0.2);
    letter-spacing: 0.01em;
  }

  .ct-btn:hover {
    background: var(--navy-mid);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(15,31,61,0.28);
  }

  .ct-btn-arrow {
    font-size: 17px;
    transition: transform 0.18s;
  }

  .ct-btn:hover .ct-btn-arrow { transform: translateX(4px); }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .ct-hero { padding: 60px 28px 52px; }
    .ct-body {
      grid-template-columns: 1fr;
      padding: 52px 28px 72px;
      gap: 40px;
    }
    .ct-info { position: static; }
    .ct-form-wrap { padding: 32px 24px; }
    .ct-row { grid-template-columns: 1fr; }
  }
`;

export default ContactPage;