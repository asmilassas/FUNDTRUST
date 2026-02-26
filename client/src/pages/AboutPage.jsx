const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ab2-root {
    min-height: 100vh;
    background: #f4f0ea;
    font-family: 'Outfit', sans-serif;
    color: #1a1714;
    overflow-x: hidden;
  }

  /* ── Top stripe ── */
  .ab2-stripe {
    background: #1a1714;
    padding: 14px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ab2-stripe-logo {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    color: #e8c98a;
    letter-spacing: 0.02em;
  }

  .ab2-stripe-tag {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
  }

  /* ── Hero ── */
  .ab2-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 520px;
  }

  .ab2-hero-left {
    background: #1a1714;
    padding: 72px 60px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
  }

  .ab2-hero-left::before {
    content: 'FT';
    position: absolute;
    font-family: 'Fraunces', serif;
    font-size: 260px;
    font-weight: 300;
    color: rgba(255,255,255,0.03);
    top: -30px;
    left: -20px;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .ab2-hero-eyebrow {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #e8c98a;
    margin-bottom: 20px;
  }

  .ab2-hero-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(36px, 4.5vw, 58px);
    font-weight: 300;
    line-height: 1.12;
    color: #f4f0ea;
  }

  .ab2-hero-title em {
    font-style: italic;
    color: #e8c98a;
  }

  .ab2-hero-right {
    background: #e8c98a;
    padding: 72px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .ab2-hero-right::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 60px solid rgba(0,0,0,0.07);
    bottom: -100px;
    right: -80px;
    pointer-events: none;
  }

  .ab2-hero-stat {
    margin-bottom: 36px;
  }

  .ab2-hero-stat:last-child { margin-bottom: 0; }

  .ab2-stat-num {
    font-family: 'Fraunces', serif;
    font-size: 48px;
    font-weight: 300;
    color: #1a1714;
    line-height: 1;
    margin-bottom: 4px;
  }

  .ab2-stat-desc {
    font-size: 13px;
    color: rgba(26,23,20,0.6);
    font-weight: 400;
  }

  .ab2-stat-rule {
    width: 32px;
    height: 1px;
    background: rgba(26,23,20,0.3);
    margin: 16px 0;
  }

  /* ── Marquee ── */
  .ab2-marquee-wrap {
    background: #2a2420;
    padding: 16px 0;
    overflow: hidden;
    white-space: nowrap;
  }

  .ab2-marquee-track {
    display: inline-flex;
    animation: marquee 18s linear infinite;
  }

  .ab2-marquee-item {
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    padding: 0 36px;
  }

  .ab2-marquee-item span {
    color: #e8c98a;
    margin-right: 36px;
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── Mission ── */
  .ab2-mission {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0;
    padding: 80px 60px;
    border-bottom: 1px solid rgba(26,23,20,0.1);
    animation: fadeUp2 0.8s cubic-bezier(0.16,1,0.3,1) both;
  }

  .ab2-section-num {
    font-family: 'Fraunces', serif;
    font-size: 72px;
    font-weight: 300;
    color: rgba(26,23,20,0.08);
    line-height: 1;
    padding-top: 4px;
  }

  .ab2-section-body {
    padding-top: 0;
  }

  .ab2-section-label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(26,23,20,0.45);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ab2-section-label::after {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: rgba(26,23,20,0.3);
  }

  .ab2-section-heading {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 300;
    line-height: 1.2;
    color: #1a1714;
    margin-bottom: 20px;
  }

  .ab2-section-text {
    font-size: 16px;
    font-weight: 300;
    color: rgba(26,23,20,0.65);
    line-height: 1.75;
    max-width: 560px;
  }

  /* ── Features ── */
  .ab2-features {
    padding: 80px 60px;
    border-bottom: 1px solid rgba(26,23,20,0.1);
    animation: fadeUp2 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both;
  }

  .ab2-features-header {
    display: grid;
    grid-template-columns: 200px 1fr;
    margin-bottom: 48px;
  }

  .ab2-features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(26,23,20,0.1);
    border: 1px solid rgba(26,23,20,0.1);
    border-radius: 12px;
    overflow: hidden;
  }

  .ab2-feature-cell {
    background: #f4f0ea;
    padding: 32px 28px;
    transition: background 0.25s;
    cursor: default;
  }

  .ab2-feature-cell:hover {
    background: #1a1714;
  }

  .ab2-feature-cell:hover .ab2-feature-name { color: #f4f0ea; }
  .ab2-feature-cell:hover .ab2-feature-desc { color: rgba(244,240,234,0.5); }
  .ab2-feature-cell:hover .ab2-feature-icon { background: rgba(232,201,138,0.15); color: #e8c98a; }

  .ab2-feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(26,23,20,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 20px;
    transition: background 0.25s, color 0.25s;
  }

  .ab2-feature-name {
    font-family: 'Fraunces', serif;
    font-size: 16px;
    font-weight: 300;
    color: #1a1714;
    margin-bottom: 8px;
    transition: color 0.25s;
    line-height: 1.3;
  }

  .ab2-feature-desc {
    font-size: 13px;
    color: rgba(26,23,20,0.5);
    font-weight: 300;
    line-height: 1.6;
    transition: color 0.25s;
  }

  /* ── Vision ── */
  .ab2-vision {
    display: grid;
    grid-template-columns: 200px 1fr;
    padding: 80px 60px 100px;
    animation: fadeUp2 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  .ab2-vision-body {
    border-left: 3px solid #e8c98a;
    padding-left: 40px;
  }

  .ab2-vision-quote {
    font-family: 'Fraunces', serif;
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 300;
    font-style: italic;
    color: #1a1714;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .ab2-vision-sub {
    font-size: 14px;
    font-weight: 300;
    color: rgba(26,23,20,0.5);
    line-height: 1.7;
    max-width: 480px;
  }

  @keyframes fadeUp2 {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 860px) {
    .ab2-stripe { padding: 14px 24px; }
    .ab2-hero { grid-template-columns: 1fr; }
    .ab2-hero-left { min-height: 300px; padding: 48px 24px; }
    .ab2-hero-right { padding: 48px 24px; flex-direction: row; gap: 32px; flex-wrap: wrap; }
    .ab2-mission, .ab2-features-header, .ab2-vision {
      grid-template-columns: 1fr;
      padding: 52px 24px;
    }
    .ab2-section-num { font-size: 48px; margin-bottom: 8px; }
    .ab2-features { padding: 0 24px 52px; }
    .ab2-features-grid { grid-template-columns: 1fr 1fr; }
    .ab2-vision-body { padding-left: 24px; }
  }

  @media (max-width: 520px) {
    .ab2-features-grid { grid-template-columns: 1fr; }
    .ab2-hero-right { flex-direction: column; }
  }
`;

const features = [
  {
    icon: "📡",
    name: "Real-time Tracking",
    desc: "Watch donations move the moment they're made.",
  },
  {
    icon: "🎯",
    name: "Funding Goals",
    desc: "Every project shows its progress openly.",
  },
  {
    icon: "✅",
    name: "Admin Approval",
    desc: "Bank donations are verified before processing.",
  },
  {
    icon: "📋",
    name: "Transparency Updates",
    desc: "Donors receive impact reports automatically.",
  },
  {
    icon: "🔐",
    name: "Verified Charities",
    desc: "Only vetted organisations can list on FundTrust.",
  },
  {
    icon: "📊",
    name: "Impact Dashboard",
    desc: "See the collective change your gifts create.",
  },
  {
    icon: "🌐",
    name: "Global Reach",
    desc: "Support causes anywhere in the world.",
  },
  {
    icon: "💬",
    name: "Donor Community",
    desc: "Connect with others who share your values.",
  },
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
      <div className="ab2-root">

        {/* Top stripe */}
        <div className="ab2-stripe">
          <span className="ab2-stripe-logo">FundTrust</span>
          <span className="ab2-stripe-tag">Transparent Giving Platform</span>
        </div>

        {/* Hero split */}
        <div className="ab2-hero">
          <div className="ab2-hero-left">
            <p className="ab2-hero-eyebrow">About us</p>
            <h1 className="ab2-hero-title">
              Giving that's<br />
              <em>open, honest</em><br />
              and traceable.
            </h1>
          </div>
          <div className="ab2-hero-right">
            <div className="ab2-hero-stat">
              <div className="ab2-stat-num">100%</div>
              <div className="ab2-stat-desc">Donation transparency</div>
            </div>
            <div className="ab2-stat-rule" />
            <div className="ab2-hero-stat">
              <div className="ab2-stat-num">Live</div>
              <div className="ab2-stat-desc">Real-time fund tracking</div>
            </div>
            <div className="ab2-stat-rule" />
            <div className="ab2-hero-stat">
              <div className="ab2-stat-num">Vetted</div>
              <div className="ab2-stat-desc">Admin-approved charities only</div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="ab2-marquee-wrap">
          <div className="ab2-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span className="ab2-marquee-item" key={i}>
                <span>✦</span>{item}
              </span>
            ))}
          </div>
        </div>

        {/* Mission */}
        <section className="ab2-mission">
          <div className="ab2-section-num">01</div>
          <div className="ab2-section-body">
            <p className="ab2-section-label">Our Mission</p>
            <h2 className="ab2-section-heading">
              Every donation should be<br />traceable and impactful.
            </h2>
            <p className="ab2-section-text">
              FundTrust was built on a simple belief: donors deserve to know exactly
              what happens to their money. We've created a platform where every
              contribution is tracked, every charity is verified, and every outcome
              is reported — so trust is never just a promise, it's a guarantee.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="ab2-features">
          <div className="ab2-features-header">
            <div className="ab2-section-num">02</div>
            <div className="ab2-section-body">
              <p className="ab2-section-label">What We Offer</p>
              <h2 className="ab2-section-heading">
                Built for complete<br />accountability.
              </h2>
            </div>
          </div>
          <div className="ab2-features-grid">
            {features.map((f) => (
              <div className="ab2-feature-cell" key={f.name}>
                <div className="ab2-feature-icon">{f.icon}</div>
                <div className="ab2-feature-name">{f.name}</div>
                <div className="ab2-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="ab2-vision">
          <div className="ab2-section-num">03</div>
          <div className="ab2-vision-body">
            <p className="ab2-section-label">Our Vision</p>
            <p className="ab2-vision-quote">
              "A world where donors trust platforms<br />
              and charities — completely."
            </p>
            <p className="ab2-vision-sub">
              We believe accountability in giving isn't a luxury — it's a
              right. FundTrust exists to close the gap between generosity and
              impact, making every act of giving a verifiable force for good.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}

export default AboutPage;