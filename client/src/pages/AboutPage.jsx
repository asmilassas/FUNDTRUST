const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy:        #0f1f3d;
    --navy-mid:    #1a3260;
    --navy-dark:   #080f1e;
    --navy-light:  #f5eddc;
    --navy-pale:   #faf3e8;
    --gold:        #c9963a;
    --gold-deep:   #a87628;
    --gold-light:  #fdf5e6;
    --gold-pale:   rgba(201,150,58,0.1);
    --gold-glow:   rgba(201,150,58,0.18);
    --ink:         #0a1628;
    --muted:       #4e6080;
    --surface:     #fdf8f0;
    --border:      rgba(15,31,61,0.09);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ab-root {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    overflow-x: hidden;
  }

  /* ══════════════════════════════════
     HERO — dark navy split
  ══════════════════════════════════ */
  .ab-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 480px;
    position: relative;
  }

  .ab-hero-left {
    background: var(--navy);
    padding: 80px 60px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
  }

  /* Giant watermark letters */
  .ab-hero-left::before {
    content: 'FT';
    position: absolute;
    font-family: 'Cormorant Garamond', serif;
    font-size: 280px;
    font-weight: 300;
    color: rgba(255,255,255,0.025);
    top: -40px;
    left: -24px;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  /* Grid texture */
  .ab-hero-left::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .ab-hero-eyebrow {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ab-hero-eyebrow::before {
    content: '';
    width: 24px;
    height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .ab-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 4.5vw, 62px);
    font-weight: 600;
    line-height: 1.1;
    color: #ffffff;
    position: relative;
    z-index: 1;
    letter-spacing: -0.5px;
  }

  .ab-hero-title em {
    font-style: italic;
    color: var(--gold);
    font-weight: 300;
  }

  .ab-hero-right {
    background: var(--gold);
    padding: 72px 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* Decorative circle */
  .ab-hero-right::before {
    content: '';
    position: absolute;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    border: 64px solid rgba(0,0,0,0.06);
    bottom: -120px;
    right: -100px;
    pointer-events: none;
  }

  .ab-hero-right::after {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 36px solid rgba(0,0,0,0.04);
    top: -60px;
    left: -50px;
    pointer-events: none;
  }

  .ab-hero-stat { margin-bottom: 32px; position: relative; z-index: 1; }
  .ab-hero-stat:last-child { margin-bottom: 0; }

  .ab-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 600;
    color: var(--navy);
    line-height: 1;
    margin-bottom: 5px;
  }

  .ab-stat-desc {
    font-size: 13px;
    color: rgba(8,15,30,0.6);
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .ab-stat-rule {
    width: 36px;
    height: 1px;
    background: rgba(8,15,30,0.2);
    margin: 24px 0;
  }

  /* ══════════════════════════════════
     MARQUEE
  ══════════════════════════════════ */
  .ab-marquee-wrap {
    background: var(--navy-dark);
    border-top: 1px solid rgba(201,150,58,0.12);
    border-bottom: 1px solid rgba(201,150,58,0.12);
    padding: 15px 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .ab-marquee-track {
    display: inline-flex;
    animation: ab-marquee 20s linear infinite;
  }

  .ab-marquee-item {
    font-size: 11.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    padding: 0 32px;
    display: inline-flex;
    align-items: center;
    gap: 32px;
  }

  .ab-marquee-dot {
    color: var(--gold);
    font-size: 8px;
    opacity: 0.7;
  }

  @keyframes ab-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ══════════════════════════════════
     SHARED SECTION LAYOUT
  ══════════════════════════════════ */
  .ab-section {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 0;
    padding: 88px 60px;
    border-bottom: 1px solid var(--border);
    animation: ab-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  .ab-section-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 80px;
    font-weight: 300;
    color: rgba(15,31,61,0.07);
    line-height: 1;
    padding-top: 2px;
    user-select: none;
  }

  .ab-section-body { padding-top: 0; }

  .ab-section-label {
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
  }

  .ab-section-label::after {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: var(--gold);
    opacity: 0.4;
  }

  .ab-section-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 600;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 22px;
    letter-spacing: -0.3px;
  }

  .ab-section-text {
    font-size: 16px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    max-width: 580px;
  }

  /* ══════════════════════════════════
     FEATURES GRID
  ══════════════════════════════════ */
  .ab-features-section {
    padding: 88px 60px;
    border-bottom: 1px solid var(--border);
    animation: ab-fadeUp 0.7s 0.08s cubic-bezier(0.16,1,0.3,1) both;
  }

  .ab-features-header {
    display: grid;
    grid-template-columns: 180px 1fr;
    margin-bottom: 52px;
  }

  .ab-features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .ab-feature-cell {
    background: var(--surface);
    padding: 34px 28px;
    transition: background 0.25s ease, transform 0.2s ease;
    cursor: default;
    position: relative;
  }

  .ab-feature-cell::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.28s ease;
  }

  .ab-feature-cell:hover { background: var(--navy); }
  .ab-feature-cell:hover::before { transform: scaleX(1); }
  .ab-feature-cell:hover .ab-feature-name { color: #fff; }
  .ab-feature-cell:hover .ab-feature-desc { color: rgba(255,255,255,0.4); }
  .ab-feature-cell:hover .ab-feature-icon {
    background: rgba(201,150,58,0.15);
    border-color: rgba(201,150,58,0.2);
  }

  .ab-feature-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: var(--navy-light);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    margin-bottom: 20px;
    transition: background 0.25s, border-color 0.25s;
  }

  .ab-feature-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 8px;
    transition: color 0.25s;
    line-height: 1.3;
  }

  .ab-feature-desc {
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.65;
    transition: color 0.25s;
  }

  /* ══════════════════════════════════
     VISION — pull-quote style
  ══════════════════════════════════ */
  .ab-vision-section {
    display: grid;
    grid-template-columns: 180px 1fr;
    padding: 88px 60px 108px;
    animation: ab-fadeUp 0.7s 0.16s cubic-bezier(0.16,1,0.3,1) both;
  }

  .ab-vision-body {
    border-left: 2px solid var(--gold);
    padding-left: 44px;
  }

  .ab-vision-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 2.8vw, 34px);
    font-weight: 300;
    font-style: italic;
    color: var(--ink);
    line-height: 1.55;
    margin-bottom: 28px;
    letter-spacing: -0.2px;
  }

  .ab-vision-quote strong {
    font-style: normal;
    font-weight: 600;
    color: var(--navy);
  }

  .ab-vision-sub {
    font-size: 15px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.8;
    max-width: 500px;
  }

  /* ══════════════════════════════════
     CTA STRIP
  ══════════════════════════════════ */
  .ab-cta {
    background: var(--navy);
    padding: 64px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }

  .ab-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .ab-cta-text { position: relative; z-index: 1; }

  .ab-cta-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  .ab-cta-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
  }

  .ab-cta-btn {
    position: relative;
    z-index: 1;
    padding: 13px 34px;
    background: var(--gold);
    color: var(--navy-dark);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 20px rgba(201,150,58,0.32);
    letter-spacing: 0.01em;
  }

  .ab-cta-btn:hover {
    background: #dba83f;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,150,58,0.42);
  }

  /* ══════════════════════════════════
     ANIMATION & RESPONSIVE
  ══════════════════════════════════ */
  @keyframes ab-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .ab-hero { grid-template-columns: 1fr; }
    .ab-hero-left { min-height: 280px; padding: 52px 28px 48px; }
    .ab-hero-right { padding: 48px 28px; flex-direction: row; flex-wrap: wrap; gap: 24px; display: flex; }
    .ab-stat-rule { display: none; }
    .ab-hero-stat { margin-bottom: 0; flex: 1; min-width: 130px; }

    .ab-section,
    .ab-features-header,
    .ab-vision-section {
      grid-template-columns: 1fr;
      padding: 56px 28px;
    }

    .ab-features-section { padding: 0 28px 56px; }
    .ab-section-num { font-size: 52px; margin-bottom: 6px; }
    .ab-features-grid { grid-template-columns: 1fr 1fr; }
    .ab-vision-body { padding-left: 24px; }
    .ab-cta { padding: 52px 28px; flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 540px) {
    .ab-features-grid { grid-template-columns: 1fr; }
    .ab-hero-right { flex-direction: column; }
  }
`;

const features = [
  { icon: "📡", name: "Real-time Tracking",      desc: "Watch donations move the moment they're made." },
  { icon: "🎯", name: "Funding Goals",            desc: "Every project shows its progress openly." },
  { icon: "✅", name: "Admin Approval",           desc: "Bank donations are verified before processing." },
  { icon: "📋", name: "Transparency Updates",     desc: "Donors receive impact reports automatically." },
  { icon: "🔐", name: "Verified Charities",       desc: "Only vetted organisations can list on FundTrust." },
  { icon: "📊", name: "Impact Dashboard",         desc: "See the collective change your gifts create." },
  { icon: "🌐", name: "Global Reach",             desc: "Support causes anywhere in the world." },
  { icon: "💬", name: "Donor Community",          desc: "Connect with others who share your values." },
];

const marqueeItems = [
  "Transparent Giving",
  "Real-time Tracking",
  "Verified Charities",
  "Impact Reporting",
  "Donor Trust",
  "Accountable Giving",
];

function AboutPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="ab-root">

        {/* ── Hero split ── */}
        <div className="ab-hero">
          <div className="ab-hero-left">
            <p className="ab-hero-eyebrow">About FundTrust</p>
            <h1 className="ab-hero-title">
              Giving that's<br />
              <em>open, honest</em><br />
              and traceable.
            </h1>
          </div>
          <div className="ab-hero-right">
            <div className="ab-hero-stat">
              <div className="ab-stat-num">100%</div>
              <div className="ab-stat-desc">Donation transparency</div>
            </div>
            <div className="ab-stat-rule" />
            <div className="ab-hero-stat">
              <div className="ab-stat-num">Live</div>
              <div className="ab-stat-desc">Real-time fund tracking</div>
            </div>
            <div className="ab-stat-rule" />
            <div className="ab-hero-stat">
              <div className="ab-stat-num">Vetted</div>
              <div className="ab-stat-desc">Admin-approved charities only</div>
            </div>
          </div>
        </div>

        {/* ── Marquee ── */}
        <div className="ab-marquee-wrap">
          <div className="ab-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span className="ab-marquee-item" key={i}>
                {item}
                <span className="ab-marquee-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── 01 Mission ── */}
        <section className="ab-section">
          <div className="ab-section-num">01</div>
          <div className="ab-section-body">
            <p className="ab-section-label">Our Mission</p>
            <h2 className="ab-section-heading">
              Every donation should be<br />traceable and impactful.
            </h2>
            <p className="ab-section-text">
              FundTrust was built on a simple belief: donors deserve to know exactly
              what happens to their money. We've created a platform where every
              contribution is tracked, every charity is verified, and every outcome
              is reported — so trust is never just a promise, it's a guarantee.
            </p>
          </div>
        </section>

        {/* ── 02 Features ── */}
        <section className="ab-features-section">
          <div className="ab-features-header">
            <div className="ab-section-num">02</div>
            <div className="ab-section-body">
              <p className="ab-section-label">What We Offer</p>
              <h2 className="ab-section-heading">
                Built for complete<br />accountability.
              </h2>
            </div>
          </div>
          <div className="ab-features-grid">
            {features.map((f) => (
              <div className="ab-feature-cell" key={f.name}>
                <div className="ab-feature-icon">{f.icon}</div>
                <div className="ab-feature-name">{f.name}</div>
                <div className="ab-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 Vision ── */}
        <section className="ab-vision-section">
          <div className="ab-section-num">03</div>
          <div className="ab-vision-body">
            <p className="ab-section-label">Our Vision</p>
            <p className="ab-vision-quote">
              "A world where donors <strong>trust platforms</strong><br />
              and charities — completely."
            </p>
            <p className="ab-vision-sub">
              We believe accountability in giving isn't a luxury — it's a
              right. FundTrust exists to close the gap between generosity and
              impact, making every act of giving a verifiable force for good.
            </p>
          </div>
        </section>

        {/* ── CTA Strip ── */}
        <div className="ab-cta">
          <div className="ab-cta-text">
            <h3 className="ab-cta-heading">Ready to give with confidence?</h3>
            <p className="ab-cta-sub">Join thousands of donors who trust FundTrust every day.</p>
          </div>
          <a href="/register" className="ab-cta-btn">Start Donating ❤️</a>
        </div>

      </div>
    </>
  );
}

export default AboutPage;