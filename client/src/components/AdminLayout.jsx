import { Link } from "react-router-dom";

function AdminLayout({ children }) {
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
          position: "fixed",
          height: "100vh",
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
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px",
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
  display: "block",
  color: "white",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "6px",
  background: "#374151",
};

export default AdminLayout;