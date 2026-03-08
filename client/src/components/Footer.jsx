import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import logo from "../assets/FUNDTRUST.png";

function Footer() {
  return (
    <>
      <style>{styles}</style>

      <footer className="footer">
        <div className="footer-container">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="FundTrust Logo" />
              <h2>FundTrust</h2>
            </div>
            <p>Connecting donors with trusted charities through transparent and impactful giving.</p>

            <div className="footer-badges">
              <span className="footer-badge">✅ Verified Platform</span>
              <span className="footer-badge">🔒 Secure Giving</span>
            </div>

            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter"><FaTwitter /></a>
              <a href="https://www.linkedin.com/in/asmilahamed" target="_blank" rel="noopener noreferrer" title="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-section">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/feedback">Feedback</Link>
              <Link to="/my-donations">My Donations</Link>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <Link to="/contact">Contact</Link>
              <Link to="/about">About</Link>
              <Link to="/notifications">Notifications</Link>
            </div>
            <div className="footer-section">
              <h4>Community</h4>
              <a href="#">Charities</a>
              <a href="#">Transparency</a>
              <a href="#">Impact Stories</a>
            </div>
          </div>

        </div>

        {/* Stats row */}
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="fstat-val">$2.4M+</span>
            <span className="fstat-lbl">Total Raised</span>
          </div>
          <div className="footer-stat">
            <span className="fstat-val">18K+</span>
            <span className="fstat-lbl">Happy Donors</span>
          </div>
          <div className="footer-stat">
            <span className="fstat-val">340+</span>
            <span className="fstat-lbl">Active Projects</span>
          </div>
          <div className="footer-stat">
            <span className="fstat-val">98%</span>
            <span className="fstat-lbl">Fund Delivery Rate</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FundTrust. All rights reserved.</span>
          <span className="dot">·</span>
          <span>Built for transparent giving</span>
        </div>
      </footer>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --navy:      #0f1f3d;
  --navy-dark: #080f1e;
  --gold:      #c9963a;
  --gold-pale: rgba(201,150,58,0.12);
}

.footer {
  background: var(--navy-dark);
  color: white;
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(201,150,58,0.12);
}

.footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(201,150,58,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,150,58,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.footer-container {
  max-width: 1100px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 64px 48px 48px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.footer-brand { max-width: 300px; }

.footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-logo img { width: 36px; height: 36px; object-fit: contain; }

.footer-brand h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 700;
  color: white; letter-spacing: 0.01em;
}

.footer-brand p {
  color: rgba(255,255,255,0.35);
  line-height: 1.7;
  font-size: 14px;
  margin-bottom: 20px;
}

.footer-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }

.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--gold-pale);
  border: 1px solid rgba(201,150,58,0.22);
  border-radius: 4px;
  font-size: 11px; font-weight: 600;
  color: #e8be7a;
  letter-spacing: 0.02em;
}

.social-icons { display: flex; gap: 10px; font-size: 17px; }

.social-icons a {
  color: rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s;
}

.social-icons a:hover {
  color: var(--gold);
  border-color: rgba(201,150,58,0.3);
  background: var(--gold-pale);
  transform: translateY(-2px);
}

.footer-links { display: flex; gap: 64px; flex-wrap: wrap; position: relative; z-index: 1; }

.footer-section { display: flex; flex-direction: column; gap: 10px; }

.footer-section h4 {
  font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 6px;
  opacity: 0.8;
}

.footer-section a {
  text-decoration: none;
  color: rgba(255,255,255,0.3);
  font-size: 14px;
  transition: color 0.15s, padding-left 0.15s;
}

.footer-section a:hover { color: rgba(255,255,255,0.8); padding-left: 4px; }

/* Stats Row */
.footer-stats {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  padding: 32px 48px;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: relative; z-index: 1;
}

.footer-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }

.fstat-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 700;
  color: var(--gold);
}

.fstat-lbl {
  font-size: 10.5px;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.footer-bottom {
  text-align: center;
  padding: 20px 24px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.2);
  display: flex;
  align-items: center; justify-content: center;
  gap: 12px;
  position: relative; z-index: 1;
}

.dot { opacity: 0.3; }

@media (max-width: 768px) {
  .footer-container { flex-direction: column; text-align: center; align-items: center; padding: 48px 24px 32px; }
  .footer-logo { justify-content: center; }
  .footer-links { flex-direction: column; gap: 28px; align-items: center; }
  .footer-section { align-items: center; }
  .social-icons { justify-content: center; }
  .footer-badges { justify-content: center; }
  .footer-stats { padding: 28px 24px; }
  .footer-bottom { flex-direction: column; gap: 6px; }
}
`;

export default Footer;