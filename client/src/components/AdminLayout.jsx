import { Link, useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1f2937",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>

        <Link style={linkStyle} to="/admin/dashboard">
          📊 Dashboard
        </Link>

        <Link style={linkStyle} to="/admin/projects">
          📁 Manage Projects
        </Link>

        <Link style={linkStyle} to="/admin/users">
          👥 Manage Users
        </Link>
        <Link style={linkStyle} to="/admin/categories">
           📂 Manage Sections
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px",
            background: "#e63757",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          background: "#f3f4f6",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "6px",
  background: "#374151",
};

export default AdminLayout;