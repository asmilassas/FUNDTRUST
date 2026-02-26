import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStatus(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.post("/auth/register", form);
      setStatus({ type: "success", text: "Account created! Redirecting to login…" });
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed. Please try again.";
      setStatus({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const hasError = status?.type === "error";

  return (
    <>
      <style>{styles}</style>
      <div className="register-root">
        <div className="register-card">
          <p className="register-eyebrow">Get started</p>
          <h1 className="register-title">Create your<br />account</h1>
          <div className="register-divider" />

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="name">Full name</label>
              <input
                id="name"
                className={`field-input${hasError ? " has-error" : ""}`}
                name="name"
                type="text"
                placeholder="Jane Smith"
                onChange={handleChange}
                value={form.name}
                required
                autoComplete="name"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="email">Email address</label>
              <input
                id="email"
                className={`field-input${hasError ? " has-error" : ""}`}
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                value={form.email}
                required
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                className={`field-input${hasError ? " has-error" : ""}`}
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                required
                autoComplete="new-password"
                minLength={8}
              />
              <p className="password-hint">Must be at least 8 characters</p>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              <span className="btn-inner">
                {loading && <span className="spinner" />}
                {loading ? "Creating account…" : "Create account"}
              </span>
            </button>
          </form>

          {status && (
            <div className={`toast ${status.type}`} role="alert">
              {status.type === "success" ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="#6edf9a" strokeWidth="1.5"/>
                  <path d="M4.5 7.5l2 2 4-4" stroke="#6edf9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="#ff7070" strokeWidth="1.5"/>
                  <path d="M7.5 4.5v3.5" stroke="#ff7070" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="7.5" cy="10.5" r="0.75" fill="#ff7070"/>
                </svg>
              )}
              {status.text}
            </div>
          )}

          <div className="separator">
            <div className="separator-line" />
            <span className="separator-text">OR</span>
            <div className="separator-line" />
          </div>

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .register-root {
    min-height: 100vh;
    background: #0d0d0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .register-root::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(120,180,255,0.05) 0%, transparent 70%);
    top: -100px;
    left: -100px;
    pointer-events: none;
  }

  .register-root::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(196,154,108,0.06) 0%, transparent 70%);
    bottom: -80px;
    right: -80px;
    pointer-events: none;
  }

  .register-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    padding: 56px 48px;
    background: #141416;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.02),
      0 32px 64px rgba(0,0,0,0.5),
      0 8px 24px rgba(0,0,0,0.4);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .register-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #c49a6c;
    margin-bottom: 12px;
  }

  .register-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 400;
    color: #f0ece6;
    margin: 0 0 8px 0;
    line-height: 1.15;
  }

  .register-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    margin: 0 0 40px 0;
    font-weight: 300;
  }

  .register-divider {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #c49a6c, transparent);
    margin-bottom: 40px;
  }

  .field-group {
    margin-bottom: 18px;
  }

  .field-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 8px;
  }

  .field-input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #f0ece6;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 300;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .field-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .field-input:focus {
    border-color: rgba(196, 154, 108, 0.5);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(196,154,108,0.08);
  }

  .field-input.has-error {
    border-color: rgba(255,100,100,0.4);
  }

  .password-hint {
    margin-top: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.25);
  }

  .register-btn {
    width: 100%;
    padding: 15px;
    margin-top: 8px;
    background: linear-gradient(135deg, #c49a6c 0%, #a07040 100%);
    border: none;
    border-radius: 8px;
    color: #0d0d0f;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(196,154,108,0.2);
  }

  .register-btn:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(196,154,108,0.3);
  }

  .register-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .register-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(13,13,15,0.3);
    border-top-color: #0d0d0f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toast.success {
    background: rgba(80,200,120,0.08);
    border: 1px solid rgba(80,200,120,0.2);
    color: #6edf9a;
  }

  .toast.error {
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.2);
    color: #ff7070;
    animation: shakeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shakeIn {
    0%  { transform: translateX(-6px); opacity: 0; }
    40% { transform: translateX(4px); }
    70% { transform: translateX(-2px); }
    100% { transform: translateX(0); opacity: 1; }
  }

  .separator {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0;
  }

  .separator-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .separator-text {
    font-size: 11px;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.08em;
  }

  .register-footer {
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  .register-footer a {
    color: #c49a6c;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .register-footer a:hover {
    color: #deb87c;
  }
`;


export default Register;