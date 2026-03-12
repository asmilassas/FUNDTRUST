import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <style>{styles}</style>

      {/* Sidebar */}
      <div className="sidebar">

        <h2 className="logo">Admin Panel</h2>

        <nav className="nav">

          <Link className="nav-link" to="/admin/dashboard">
            📊 Dashboard
          </Link>

          <Link className="nav-link" to="/admin/projects">
            📁 Manage Projects
          </Link>

          <Link className="nav-link" to="/admin/users">
            👥 Manage Users
          </Link>

          <Link className="nav-link" to="/admin/categories">
            📂 Manage Sections
          </Link>

        </nav>

      </div>

      {/* Main Content */}
      <div className="content">
        {children}
      </div>

    </div>
  );
}

const styles = `

.admin-layout{
  display:flex;
  min-height:100vh;
  font-family:'DM Sans', sans-serif;
}

/* SIDEBAR */

.sidebar{
  width:250px;
  background:#0f1f3d;
  color:white;
  padding:30px 20px;
  position:fixed;
  height:100vh;
  display:flex;
  flex-direction:column;
}

.logo{
  font-size:22px;
  margin-bottom:30px;
  border-bottom:1px solid rgba(255,255,255,0.1);
  padding-bottom:15px;
}

/* NAVIGATION */

.nav{
  display:flex;
  flex-direction:column;
  gap:12px;
}

.nav-link{
  text-decoration:none;
  color:white;
  padding:10px 14px;
  border-radius:8px;
  background:rgba(255,255,255,0.05);
  transition:all .2s ease;
  font-size:14px;
}

.nav-link:hover{
  background:#c9963a;
  color:#0f1f3d;
}

/* MAIN CONTENT */

.content{
  margin-left:250px;
  flex:1;
  padding:40px;
  background:#f9fafb;
  min-height:100vh;
}

`;

export default AdminLayout;