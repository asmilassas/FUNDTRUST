import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">❤️</span>
          FundTrust
        </Link>

        <div className="navbar-links">
          {!user ? (
            <>
              <Link to="/about"    className="nav-link">About</Link>
              <Link to="/contact"  className="nav-link">Contact</Link>
              <Link to="/feedback" className="nav-link">Feedback</Link>
              <div className="nav-divider" />
              <Link to="/login"    className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          ) : (
            <>
              {/* User Badge */}
              <div className="user-badge">
                <div className="user-avatar">{getInitials(user.name)}</div>
                {user.name}
                {user.isAdmin && <span className="admin-badge">Admin</span>}
              </div>

              <div className="nav-divider" />

              {/* Normal user links */}
              {!user.isAdmin && (
                <>
                  <Link to="/feedback"     className="nav-link">Feedback</Link>
                  <Link to="/my-donations" className="btn-ghost">My Donations</Link>
                </>
              )}

              {/* Admin */}
              {user.isAdmin && (
                <Link to="/admin/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              )}

              {/* Notifications for normal users */}
              {!user.isAdmin && (
                <button
                  className="btn-icon"
                  onClick={() => navigate("/notifications")}
                  title="Notifications"
                >
                  🔔
                </button>
              )}

              {/* Logout */}
              <button className="btn-danger" onClick={handleLogout}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
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
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 48px;
    height: 68px;
    background: rgba(255, 247, 238, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(234, 88, 12, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 2px 20px rgba(180, 80, 20, 0.07);
  }

  .navbar-logo {
    font-family: 'Lora', serif;
    font-size: 21px;
    font-weight: 700;
    color: #1c0f00;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 9px;
    transition: opacity 0.2s ease;
  }

  .navbar-logo:hover { opacity: 0.75; }

  .navbar-logo-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    box-shadow: 0 2px 8px rgba(249,115,22,0.35);
    flex-shrink: 0;
  }

  .navbar-links {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  .nav-link {
    color: #78583a;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 13px;
    border-radius: 8px;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .nav-link:hover {
    color: #1c0f00;
    background: rgba(234,88,12,0.07);
  }

  .nav-divider {
    width: 1px;
    height: 20px;
    background: rgba(234,88,12,0.15);
    margin: 0 6px;
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background: transparent;
    color: #78583a;
    border: 1px solid rgba(234,88,12,0.2);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .btn-ghost:hover {
    background: rgba(234,88,12,0.06);
    border-color: rgba(234,88,12,0.35);
    color: #c2410c;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 20px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 12px rgba(249,115,22,0.35);
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(249,115,22,0.45);
  }

  .btn-danger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 15px;
    background: rgba(220,38,38,0.07);
    color: #b91c1c;
    border: 1px solid rgba(220,38,38,0.18);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-danger:hover {
    background: rgba(220,38,38,0.13);
    border-color: rgba(220,38,38,0.32);
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    background: rgba(234,88,12,0.06);
    border: 1px solid rgba(234,88,12,0.15);
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s ease;
  }

  .btn-icon:hover {
    background: rgba(234,88,12,0.12);
    border-color: rgba(234,88,12,0.28);
    transform: translateY(-1px);
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px 5px 7px;
    background: rgba(234,88,12,0.06);
    border: 1px solid rgba(234,88,12,0.14);
    border-radius: 50px;
    font-size: 13.5px;
    font-weight: 500;
    color: #4a2f12;
  }

  .user-avatar {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f97316, #fbbf24);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  .admin-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    background: rgba(234,88,12,0.1);
    border: 1px solid rgba(234,88,12,0.2);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    color: #c2410c;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
`;

export default Navbar;