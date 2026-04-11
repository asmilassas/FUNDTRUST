import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getInitials } from "../utils";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);
  const handleLogout = () => { logout(); navigate("/"); close(); };
  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

  // Tailwind classes for nav links — active state handled via className instead of inline object
  const linkCls = (path) => [
    "ft-nav-link",
    isActive(path) ? "ft-nav-link-active" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{css}</style>
      <nav className="ft-nav">
        <Link to="/" className="ft-logo" onClick={close}>
          <span className="ft-logo-icon">❤️</span>
          FundTrust
        </Link>

        <div className="ft-links">
          <Link to="/transparency" className={linkCls("/transparency")}>Transparency</Link>
          <Link to="/about" className={linkCls("/about")}>About</Link>
          <Link to="/feedback" className={linkCls("/feedback")}>Reviews</Link>

          <div className="ft-divider" />

          {!user && (
            <>
              <Link to="/login" className="ft-ghost">Log in</Link>
              <Link to="/register" className="ft-primary">Get Started</Link>
            </>
          )}

          {user && !user.isAdmin && (
            <>
              <Link to="/" className={linkCls("/active-funds")}>Active Funds</Link>
              <Link to="/my-donations" className={linkCls("/my-donations")}>My Donations</Link>
              <button className="ft-avatar" onClick={() => navigate("/profile")} title="My Profile">
                {getInitials(user.name)}
              </button>
              <button className="ft-danger" onClick={handleLogout}>Logout</button>
            </>
          )}

          {user?.isAdmin && (
            <>
              <button className="ft-avatar ft-avatar-admin" onClick={() => navigate("/profile")} title="My Profile">
                {getInitials(user.name)}
                <span className="ft-admin-dot" />
              </button>
              <Link to="/admin/dashboard" className="ft-primary">Dashboard</Link>
              <button className="ft-danger" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>

        <button className="ft-ham" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {mobileOpen && (
        <div className="ft-overlay" onClick={close}>
          <div className="ft-drawer" onClick={e => e.stopPropagation()}>
            <Link to="/transparency" className="ft-mob-link" onClick={close}>Transparency</Link>
            <Link to="/about" className="ft-mob-link" onClick={close}>About</Link>
            <Link to="/feedback" className="ft-mob-link" onClick={close}>Reviews</Link>
            <div className="ft-mob-sep" />
            {!user && (
              <>
                <Link to="/login" className="ft-mob-link" onClick={close}>Log in</Link>
                <Link to="/register" className="ft-mob-cta"  onClick={close}>Get Started</Link>
              </>
            )}
            {user && !user.isAdmin && (
              <>
                <Link to="/"  className="ft-mob-link" onClick={close}>Active Funds</Link>
                <Link to="/my-donations" className="ft-mob-link" onClick={close}>My Donations</Link>
                <Link to="/profile" className="ft-mob-link" onClick={close}>My Profile</Link>
              </>
            )}
            {user?.isAdmin && (
              <>
                <Link to="/admin/dashboard" className="ft-mob-cta"  onClick={close}>Dashboard</Link>
                <Link to="/profile" className="ft-mob-link" onClick={close}>My Profile</Link>
              </>
            )}
            {user && (
              <button className="ft-mob-link ft-mob-logout" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const css = `
  .ft-nav {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 40px; height: 64px;
    background: rgba(255,247,238,0.97); backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(234,88,12,0.1);
    position: sticky; top: 0; z-index: 1000;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 1px 12px rgba(180,80,20,0.06);
  }
  .ft-logo {
    font-family: 'Lora', serif; font-size: 20px; font-weight: 700;
    color: #1c0f00; text-decoration: none;
    display: flex; align-items: center; gap: 9px;
    transition: opacity 0.2s; flex-shrink: 0;
  }
  .ft-logo:hover { opacity: 0.75; }
  .ft-logo-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg,#f97316,#fbbf24);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; box-shadow: 0 2px 8px rgba(249,115,22,0.3);
  }
  .ft-links { display: flex; align-items: center; gap: 4px; }
  .ft-divider { width: 1px; height: 18px; background: rgba(234,88,12,0.15); margin: 0 6px; }

  .ft-nav-link {
    color: #78583a; text-decoration: none; font-size: 13.5px; font-weight: 500;
    padding: 7px 12px; border-radius: 8px; background: transparent;
    transition: all 0.18s; white-space: nowrap;
  }
  .ft-nav-link:hover { background: rgba(234,88,12,0.06); color: #c2410c; }
  .ft-nav-link-active { color: #ea580c; font-weight: 700; background: rgba(234,88,12,0.07); }

  .ft-ghost {
    padding: 7px 16px; background: transparent; color: #78583a;
    border: 1.5px solid rgba(234,88,12,0.22); border-radius: 8px;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    text-decoration: none; font-family: inherit; transition: all 0.18s; white-space: nowrap;
  }
  .ft-ghost:hover { background: rgba(234,88,12,0.06); border-color: rgba(234,88,12,0.38); color: #c2410c; }

  .ft-primary {
    padding: 8px 18px; background: linear-gradient(135deg,#f97316,#ea580c);
    color: white; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 700;
    cursor: pointer; text-decoration: none; font-family: inherit;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 12px rgba(249,115,22,0.28); white-space: nowrap;
    display: inline-flex; align-items: center;
  }
  .ft-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(249,115,22,0.38); }

  .ft-danger {
    padding: 7px 14px; background: rgba(220,38,38,0.07); color: #b91c1c;
    border: 1px solid rgba(220,38,38,0.18); border-radius: 8px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: all 0.18s; white-space: nowrap;
  }
  .ft-danger:hover { background: rgba(220,38,38,0.12); }

  .ft-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg,#f97316,#fbbf24);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white;
    cursor: pointer; position: relative; flex-shrink: 0;
    border: none; transition: transform 0.15s;
  }
  .ft-avatar:hover { transform: scale(1.08); }
  .ft-avatar-admin { background: linear-gradient(135deg,#8b5cf6,#6d28d9); }
  .ft-admin-dot {
    position: absolute; bottom: 0; right: 0;
    width: 9px; height: 9px; border-radius: 50%;
    background: #f97316; border: 2px solid white;
  }

  .ft-ham { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px; }
  .ft-ham span { display: block; width: 22px; height: 2px; background: #78583a; border-radius: 2px; }

  @media (max-width: 860px) {
    .ft-nav { padding: 0 20px; }
    .ft-links { display: none; }
    .ft-ham { display: flex; }
  }

  .ft-overlay { position: fixed; inset: 0; top: 64px; background: rgba(0,0,0,0.35); z-index: 999; }
  .ft-drawer {
    position: absolute; top: 0; right: 0; width: 260px; height: calc(100vh - 64px);
    background: white; padding: 16px; display: flex; flex-direction: column; gap: 3px;
    box-shadow: -4px 0 20px rgba(0,0,0,0.1); overflow-y: auto;
  }
  .ft-mob-link {
    display: block; padding: 11px 14px; border-radius: 10px; text-decoration: none;
    color: #374151; font-size: 14px; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif;
    background: none; border: none; cursor: pointer; text-align: left; width: 100%;
    transition: background 0.15s;
  }
  .ft-mob-link:hover { background: #f9fafb; }
  .ft-mob-cta {
    display: block; padding: 12px 14px; border-radius: 10px; margin-top: 6px;
    background: linear-gradient(135deg,#f97316,#ea580c); color: white;
    font-weight: 700; font-size: 14px; text-decoration: none; text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ft-mob-logout { color: #dc2626; }
  .ft-mob-sep { height: 1px; background: #f3f4f6; margin: 6px 0; }
`;

export default Navbar;