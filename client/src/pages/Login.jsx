import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      setMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card">
          <p className="login-eyebrow">Welcome back</p>
          <h1 className="login-title">Sign in to<br />your account</h1>
          <div className="login-divider" />

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="email">Email address</label>
              <input
                id="email"
                className={`field-input${message ? " error-state" : ""}`}
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
                className={`field-input${message ? " error-state" : ""}`}
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span className="btn-inner">
                {loading && <span className="spinner" />}
                {loading ? "Signing in…" : "Sign in"}
              </span>
            </button>
          </form>

          {message && (
            <div className="error-msg" role="alert">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="#ff7070" strokeWidth="1.5"/>
                <path d="M7.5 4.5v3.5" stroke="#ff7070" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7.5" cy="10.5" r="0.75" fill="#ff7070"/>
              </svg>
              {message}
            </div>
          )}

          <div className="separator">
            <div className="separator-line" />
            <span className="separator-text">OR</span>
            <div className="separator-line" />
          </div>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    background: #0d0d0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,210,140,0.06) 0%, transparent 70%);
    top: -100px;
    right: -100px;
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(120,180,255,0.05) 0%, transparent 70%);
    bottom: -80px;
    left: -80px;
    pointer-events: none;
  }

  .login-card {
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

  .login-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #c49a6c;
    margin-bottom: 12px;
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 400;
    color: #f0ece6;
    margin: 0 0 8px 0;
    line-height: 1.15;
  }

  .login-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    margin: 0 0 40px 0;
    font-weight: 300;
  }

  .login-divider {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #c49a6c, transparent);
    margin-bottom: 40px;
  }

  .field-group {
    margin-bottom: 20px;
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

  .field-input.error-state {
    border-color: rgba(255,100,100,0.5);
  }

  .login-btn {
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
    position: relative;
    overflow: hidden;
  }

  .login-btn:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(196,154,108,0.3);
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .login-btn .btn-inner {
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

  .error-msg {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px 14px;
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.2);
    border-radius: 8px;
    color: #ff7070;
    font-size: 13px;
    animation: shakeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes shakeIn {
    0%  { transform: translateX(-6px); opacity: 0; }
    40% { transform: translateX(4px); }
    70% { transform: translateX(-2px); }
    100% { transform: translateX(0); opacity: 1; }
  }

  .login-footer {
    margin-top: 32px;
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
  }

  .login-footer a {
    color: #c49a6c;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .login-footer a:hover {
    color: #deb87c;
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
`;

export default Login;