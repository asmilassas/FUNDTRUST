import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/FUNDTRUST.png";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLink = (path) =>
    `nav-link${location.pathname === path ? " nav-link--active" : ""}`;

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <style>{styles}</style>

      <nav className="navbar">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="FundTrust Logo" className="navbar-logo-img" />
          FundTrust
        </Link>

        <div className="navbar-links">

          {/* ── VISITOR MENU ── */}
          {!user ? (
            <>
              <Link to="/about"           className={navLink("/about")}>About</Link>
              <Link to="/contact"         className={navLink("/contact")}>Contact</Link>
              <Link to="/feedback"        className={navLink("/feedback")}>Feedback</Link>
              <Link to="/success-stories" className={navLink("/success-stories")}>Success Stories</Link>

              <div className="nav-divider" />

              <Link to="/login"    className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          ) : (
            <>
              {/* User badge */}
              <div
                className="user-badge"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/profile")}
                title="Go to Profile"
              >
                <div className="user-avatar">{getInitials(user.name)}</div>
                {user.name}
                {user.isAdmin && <span className="admin-badge">Admin</span>}
              </div>

              <div className="nav-divider" />

              {/* ── NORMAL USER ── */}
              {!user.isAdmin && (
                <>
                  <Link to="/feedback"     className={navLink("/feedback")}>Feedback</Link>
                  <Link to="/my-donations" className="btn-ghost">My Donations</Link>
                </>
              )}

              {/* ── ADMIN ── */}
              {user.isAdmin && (
                <Link to="/admin/dashboard" className="btn-primary">Dashboard</Link>
              )}

              {/* Notifications */}
              {!user.isAdmin && (
                <button
                  className="btn-icon"
                  onClick={() => navigate("/notifications")}
                  title="Notifications"
                >
                  🔔
                </button>
              )}

              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

        </div>
      </nav>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --navy:       #0f1f3d;
  --navy-mid:   #1a3260;
  --navy-light: #f5eddc;
  --gold:       #c9963a;
  --gold-light: #fdf5e6;
  --gold-pale:  rgba(201,150,58,0.12);
  --ink:        #0a1628;
  --muted:      #5a6a82;
  --surface:    #fdf8f0;
  --border:     rgba(15,31,61,0.1);
}

/* ── Base ── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 52px;
  height: 70px;
  background: rgba(253,248,240,0.97);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 1000;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 1px 0 var(--border), 0 4px 24px rgba(15,31,61,0.05);
}

/* Navy-to-gold accent line at bottom */
.navbar::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--navy) 0%, var(--gold) 50%, var(--navy) 100%);
  opacity: 0.55;
}

/* ── Logo ── */
.navbar-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--navy);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.01em;
  flex-shrink: 0;
}

.navbar-logo-img { width: 32px; height: 32px; object-fit: contain; }

/* ── Link row ── */
.navbar-links {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* ── Nav links ── */
.nav-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 7px 13px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--navy-light);
  color: var(--navy);
}

/* Active state — gold underline + bold */
.nav-link--active {
  background: var(--gold-pale);
  color: var(--navy);
  font-weight: 700;
  position: relative;
}

.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 2px;
  background: var(--gold);
  border-radius: 2px;
}

/* ── Divider ── */
.nav-divider {
  width: 1px;
  height: 20px;
  background: var(--border);
  margin: 0 8px;
  flex-shrink: 0;
}

/* ── Ghost button ── */
.btn-ghost {
  padding: 8px 18px;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
  font-family: 'DM Sans', sans-serif;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  white-space: nowrap;
}

.btn-ghost:hover { border-color: var(--gold); background: var(--gold-light); }

/* ── Primary button ── */
.btn-primary {
  padding: 9px 22px;
  background: var(--navy);
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 12px rgba(15,31,61,0.2);
  white-space: nowrap;
}

.btn-primary:hover { background: var(--navy-mid); box-shadow: 0 4px 20px rgba(15,31,61,0.28); }

/* ── Danger button ── */
.btn-danger {
  padding: 8px 15px;
  background: transparent;
  border: 1.5px solid rgba(180,30,30,0.2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 600;
  color: #a52020;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.btn-danger:hover { background: rgba(180,30,30,0.06); border-color: rgba(180,30,30,0.35); }

/* ── Icon button ── */
.btn-icon {
  width: 36px; height: 36px;
  border-radius: 6px;
  border: 1.5px solid var(--border);
  background: var(--navy-light);
  cursor: pointer;
  font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, transform 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.btn-icon:hover { background: var(--gold-pale); transform: scale(1.06); border-color: var(--gold); }

/* ── User badge ── */
.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px 5px 6px;
  background: var(--navy-light);
  border: 1.5px solid var(--border);
  border-radius: 50px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--navy);
  transition: border-color 0.15s, background 0.15s;
  white-space: nowrap;
}

.user-badge:hover { border-color: var(--gold); background: var(--gold-light); }

.user-avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--navy);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  color: var(--gold);
  flex-shrink: 0;
  letter-spacing: 0.05em;
}

/* ── Admin badge ── */
.admin-badge {
  padding: 2px 8px;
  background: var(--gold-pale);
  border: 1px solid rgba(201,150,58,0.3);
  border-radius: 4px;
  font-size: 10px; font-weight: 700;
  color: #8a6010;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
`;

export default Navbar;