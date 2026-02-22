import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sync user from localStorage
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
    navigate("/login", { replace: true });
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "#2c7be5",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        FundTrust
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        ) : (
          <>
            <span style={{ fontWeight: "500" }}>👤 {user.name}</span>

            {/* Normal User */}
            {!user.isAdmin && (
              <Link to="/my-donations" style={linkStyle}>
                My Donations
              </Link>
            )}

            {/* Admin */}
            {user.isAdmin && (
              <Link to="/admin/dashboard" style={linkStyle}>
                Admin Dashboard
              </Link>
            )}

            {/* Notification Button for Normal Users */}
            {user && !user.isAdmin && (
              <button
                onClick={() => navigate("/notifications")}
                style={{
                  background: "white",
                  color: "#2c7be5",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🔔
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 14px",
                background: "#e63757",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

export default Navbar;