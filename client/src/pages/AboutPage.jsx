const features = [
  { icon: "📡", name: "Real-time Tracking", desc: "Watch donations move the moment they're made." },
  { icon: "🎯", name: "Funding Goals", desc: "Every fund shows its exact progress publicly." },
  { icon: "📋", name: "Transparency Updates", desc: "Fund admins post regular impact reports." },
  { icon: "🔐", name: "Verified Charities", desc: "Only vetted organisations can list on FundTrust." },
  { icon: "💳", name: "Secure Payments", desc: "Card payments are processed by Stripe." },
  { icon: "📊", name: "Impact Dashboard", desc: "See the collective change your gifts create." },
  { icon: "🌐", name: "Global Reach", desc: "Support causes anywhere in the world." },
  { icon: "💬", name: "Donor Reviews", desc: "Read honest feedback from real donors." },
];

function AboutPage() {
  return (
    <div style={page}>

      {/* Hero */}
      <div style={hero}>
        <p style={eyebrow}>About FundTrust</p>
        <h1 style={heroTitle}>Giving that's open,<br />honest, and traceable.</h1>
        <p style={heroSub}>
          FundTrust is a transparent donation platform where every dollar is tracked,
          every charity is vetted, and every outcome is reported.
        </p>
      </div>

      {/* Mission */}
      <section style={section}>
        <div style={sectionInner}>
          <p style={label}>Our Mission</p>
          <h2 style={sectionTitle}>Every donation should be traceable and impactful.</h2>
          <p style={body}>
            We built FundTrust on a simple belief: donors deserve to know exactly what
            happens to their money. Our platform tracks every contribution in real time,
            so trust is never just a promise — it's a guarantee you can verify yourself.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ ...section, background: "#fff7ee" }}>
        <p style={{ ...label, textAlign: "center", marginBottom: 8 }}>What We Offer</p>
        <h2 style={{ ...sectionTitle, textAlign: "center", marginBottom: 36 }}>Built for complete accountability.</h2>
        <div style={grid}>
          {features.map(f => (
            <div key={f.name} style={featureCard}>
              <div style={featureIcon}>{f.icon}</div>
              <h3 style={featureName}>{f.name}</h3>
              <p style={featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section style={{ ...section, background: "#1c0f00", color: "white" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...label, color: "#fbbf24" }}>Our Vision</p>
          <p style={{ fontFamily: "'Lora',serif", fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, fontStyle: "italic", lineHeight: 1.5, color: "#f4f0ea", marginBottom: 20 }}>
            "A world where donors trust platforms and charities — completely."
          </p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.75 }}>
            We believe accountability in giving isn't a luxury — it's a right.
            FundTrust exists to close the gap between generosity and impact,
            making every act of giving a verifiable force for good.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section style={section} id="contact">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={label}>Contact Us</p>
          <h2 style={{ ...sectionTitle, marginBottom: 8 }}>We'd love to hear from you.</h2>
          <p style={{ ...body, marginBottom: 36 }}>
            Have a question, feedback, or want to list your charity on FundTrust?
            Reach out through any of the channels below.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "✉️", label: "Email",   value: "support@fundtrust.com" },
              { icon: "📞", label: "Phone",   value: "+94 77 000 0000" },
              { icon: "📍", label: "Address", value: "Colombo, Sri Lanka" },
            ].map(({ icon, label: cLabel, value }) => (
              <div key={cLabel} style={contactRow}>
                <div style={contactIcon}>{icon}</div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{cLabel}</p>
                  <p style={{ fontWeight: 600, color: "#1c0f00", fontSize: 15 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// Styles
const page = { minHeight: "100vh", background: "#fdf8f3", fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#1c0f00" };
const hero = { background: "linear-gradient(135deg,#1c0f00,#3d2010)", padding: "72px 24px 64px", textAlign: "center", color: "white" };
const eyebrow = { fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fbbf24", marginBottom: 14 };
const heroTitle = { fontFamily: "'Lora',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, fontStyle: "normal", lineHeight: 1.15, color: "#f4f0ea", marginBottom: 18 };
const heroSub = { fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 };
const section = { padding: "64px 24px" };
const sectionInner = { maxWidth: 680, margin: "0 auto" };
const label = { fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f97316", marginBottom: 12 };
const sectionTitle = { fontFamily: "'Lora',serif", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 700, color: "#1c0f00", marginBottom: 18, lineHeight: 1.2 };
const body = { fontSize: 15, color: "#78583a", lineHeight: 1.8 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, maxWidth: 900, margin: "0 auto" };
const featureCard = { background: "white", borderRadius: 16, padding: 22, border: "1px solid rgba(234,88,12,0.1)" };
const featureIcon = { fontSize: 24, marginBottom: 12 };
const featureName = { fontFamily: "'Lora',serif", fontSize: 15, fontWeight: 700, color: "#1c0f00", marginBottom: 6, marginTop: 0 };
const featureDesc = { fontSize: 13, color: "#78583a", lineHeight: 1.65, margin: 0 };
const contactRow = { display: "flex", alignItems: "center", gap: 16, background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(234,88,12,0.1)" };
const contactIcon = { width: 44, height: 44, borderRadius: 12, background: "#fff7ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 };

export default AboutPage;