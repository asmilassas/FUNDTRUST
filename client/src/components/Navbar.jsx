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

    // Listen for login/logout changes
    window.addEventListener("storage", updateUser);

    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
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
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        FundTrust
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>

            {/* Normal User */}
            {!user.isAdmin && (
              <Link
                to="/my-donations"
                style={{ color: "white", textDecoration: "none" }}
              >
                My Donations
              </Link>
            )}

            {/* Admin Only */}
            {user.isAdmin && (
              <Link
                to="/admin/dashboard"
                style={{ color: "white", textDecoration: "none" }}
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                background: "white",
                color: "#2c7be5",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
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

export default Navbar;
