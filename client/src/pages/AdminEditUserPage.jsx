import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function AdminEditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  useEffect(() => { fetchUser(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/admin/all");
      const user = res.data.users.find((u) => u._id === id);
      if (!user) { showToast("User not found", "error"); navigate("/admin/users"); return; }
      setName(user.name); setEmail(user.email); setIsAdmin(user.isAdmin);
    } catch (e) {
      console.error("Error loading user", e);
      showToast("Failed to load user", "error");
    } finally { setLoading(false); }
  };

  const updateUser = async () => {
    if (!name || !email) { showToast("Name and email are required", "error"); return; }
    setSaving(true);
    try {
      await api.put(`/users/admin/${id}`, { name, email, isAdmin });
      showToast("User updated successfully");
      setTimeout(() => navigate("/admin/users"), 1200);
    } catch (e) {
      showToast("Update failed", "error");
    } finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <style>{styles}</style>

      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      <div className="admin-page">

        {/* ── Breadcrumb ── */}
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate("/admin/users")}>Users</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Edit User</span>
        </div>

        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <p className="page-overline">Admin Panel</p>
            <h1 className="page-title">Edit User</h1>
            <p className="page-sub">Update user information and permissions</p>
          </div>
          <button className="back-btn" onClick={() => navigate("/admin/users")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Users
          </button>
        </div>

        <div className="layout-grid">

          {/* ── Avatar Card ── */}
          <div className="avatar-card">
            <div className="big-avatar">
              {loading ? "?" : getInitials(name)}
            </div>
            <p className="avatar-name">{loading ? "Loading…" : name || "—"}</p>
            <p className="avatar-email">{loading ? "" : email || "—"}</p>
            {isAdmin && <span className="role-badge">Administrator</span>}
            <div className="avatar-meta">
              <div className="meta-row">
                <span className="meta-label">User ID</span>
                <span className="meta-val">{id?.slice(-8)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Role</span>
                <span className="meta-val">{isAdmin ? "Admin" : "Member"}</span>
              </div>
            </div>
          </div>

          {/* ── Edit Form ── */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-icon">✏</div>
              <div>
                <h2 className="form-panel-title">Edit Details</h2>
                <p className="form-panel-sub">Changes are saved immediately on update</p>
              </div>
            </div>

            <div className="form-body">

              {loading ? (
                <div className="skeleton-wrap">
                  <div className="skeleton" style={{ height: 58, borderRadius: 8 }} />
                  <div className="skeleton" style={{ height: 58, borderRadius: 8 }} />
                  <div className="skeleton" style={{ height: 54, borderRadius: 10 }} />
                </div>
              ) : (
                <>
                  <div className="field">
                    <label className="field-label">Full Name <span className="req">*</span></label>
                    <input className="field-input" placeholder="Enter full name"
                      value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="field">
                    <label className="field-label">Email Address <span className="req">*</span></label>
                    <input className="field-input" type="email" placeholder="Enter email"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="toggle-row" onClick={() => setIsAdmin(v => !v)}>
                    <div className="toggle-info">
                      <p className="toggle-title">Admin Access</p>
                      <p className="toggle-sub">Can manage projects, users &amp; categories</p>
                    </div>
                    <div className={`toggle-switch ${isAdmin ? "toggle-switch--on" : ""}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn btn--primary" onClick={updateUser} disabled={saving}>
                      {saving ? <span className="btn-spinner" /> : "✓"} Update User
                    </button>
                    <button className="btn btn--ghost" onClick={() => navigate("/admin/users")}>
                      Cancel
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --navy:        #0f1f3d;
    --navy-mid:    #1a3260;
    --navy-dark:   #080f1e;
    --gold:        #c9963a;
    --gold-deep:   #a87628;
    --gold-light:  rgba(201,150,58,0.12);
    --gold-border: rgba(201,150,58,0.25);
    --ink:         #0a1628;
    --muted:       #4e6080;
    --muted-light: #8a9ab8;
    --surface:     #f7f3ec;
    --card:        #fffef9;
    --border:      rgba(15,31,61,0.09);
    --red:         #c0303a;
    --red-light:   rgba(192,48,58,0.08);
    --shadow-sm:   0 2px 12px rgba(15,31,61,0.07);
    --shadow-md:   0 8px 32px rgba(15,31,61,0.1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .admin-page {
    padding: 40px 40px 60px;
    max-width: 960px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    background: var(--surface);
    min-height: 100vh;
  }

  /* ── Toast ── */
  .toast {
    position: fixed; top: 24px; right: 24px; z-index: 9999;
    display: flex; align-items: center; gap: 10px;
    padding: 13px 20px; border-radius: 10px;
    font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    box-shadow: var(--shadow-md); animation: slideIn 0.25s ease;
  }
  .toast--success { background: var(--navy); color: #fff; border-left: 3px solid var(--gold); }
  .toast--error   { background: #fff; color: var(--red); border-left: 3px solid var(--red); }
  .toast-icon {
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .toast--success .toast-icon { background: var(--gold-light); color: var(--gold); }
  .toast--error   .toast-icon { background: var(--red-light);  color: var(--red); }
  @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }

  /* ── Breadcrumb ── */
  .breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 12.5px; color: var(--muted-light);
    margin-bottom: 20px;
  }
  .breadcrumb-link {
    cursor: pointer; color: var(--muted);
    transition: color 0.15s; font-weight: 500;
  }
  .breadcrumb-link:hover { color: var(--gold); }
  .breadcrumb-sep     { color: var(--border); font-size: 14px; }
  .breadcrumb-current { color: var(--navy); font-weight: 600; }

  /* ── Page Header ── */
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 36px; padding-bottom: 28px;
    border-bottom: 1px solid var(--border); gap: 16px; flex-wrap: wrap;
  }
  .page-overline {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 6px;
  }
  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px; font-weight: 700; color: var(--navy);
    letter-spacing: -0.5px; line-height: 1; margin-bottom: 6px;
  }
  .page-sub { font-size: 14px; color: var(--muted); }

  .back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 18px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card);
    font-family: 'DM Sans', sans-serif; font-size: 13.5px;
    font-weight: 600; color: var(--muted); cursor: pointer;
    transition: all 0.18s; white-space: nowrap;
  }
  .back-btn:hover { border-color: var(--gold-border); color: var(--navy); background: var(--gold-light); }

  /* ── Layout ── */
  .layout-grid { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }

  /* ── Avatar Card ── */
  .avatar-card {
    background: var(--navy);
    border: 1px solid rgba(201,150,58,0.15);
    border-radius: 20px; padding: 32px 24px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 8px;
    box-shadow: var(--shadow-sm);
    position: sticky; top: 24px;
  }
  .big-avatar {
    width: 72px; height: 72px; border-radius: 18px;
    background: var(--gold-light); border: 2px solid var(--gold-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 700; color: var(--gold);
    letter-spacing: 0.05em; margin-bottom: 8px;
  }
  .avatar-name  { font-size: 16px; font-weight: 700; color: #fff; }
  .avatar-email { font-size: 12px; color: rgba(255,255,255,0.4); word-break: break-all; }

  .role-badge {
    margin-top: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--gold-deep);
    background: var(--gold-light); border: 1px solid var(--gold-border);
    padding: 3px 10px; border-radius: 50px;
  }

  .avatar-meta {
    width: 100%; margin-top: 16px;
    border-top: 1px solid rgba(201,150,58,0.12); padding-top: 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .meta-row { display: flex; justify-content: space-between; align-items: center; }
  .meta-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .meta-val   { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.65); font-family: monospace; }

  /* ── Form Panel ── */
  .form-panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm);
  }
  .form-panel-header {
    background: var(--navy); padding: 22px 28px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 1px solid rgba(201,150,58,0.15);
  }
  .form-panel-icon {
    width: 42px; height: 42px; background: var(--gold-light);
    border: 1px solid var(--gold-border); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: var(--gold); flex-shrink: 0;
  }
  .form-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: #fff;
  }
  .form-panel-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  .form-body { padding: 28px; }

  .field { margin-bottom: 18px; }
  .field-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 7px;
  }
  .req { color: var(--gold); }
  .field-input {
    width: 100%; padding: 11px 14px;
    border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    background: var(--surface); transition: border-color 0.18s, box-shadow 0.18s; outline: none;
  }
  .field-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,150,58,0.1); }

  /* Toggle */
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border);
    cursor: pointer; margin-bottom: 24px; background: var(--surface);
    transition: border-color 0.18s, background 0.18s;
  }
  .toggle-row:hover { border-color: var(--gold-border); background: var(--gold-light); }
  .toggle-title { font-size: 14px; font-weight: 600; color: var(--navy); }
  .toggle-sub   { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .toggle-switch {
    width: 40px; height: 22px; border-radius: 50px;
    background: rgba(15,31,61,0.15); position: relative;
    transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-switch--on { background: var(--gold); }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: white; transition: transform 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .toggle-switch--on .toggle-thumb { transform: translateX(18px); }

  /* Buttons */
  .form-actions { display: flex; gap: 10px; }
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 22px; border-radius: 8px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
  }
  .btn--primary {
    background: var(--gold); color: var(--navy-dark);
    box-shadow: 0 4px 16px rgba(201,150,58,0.3);
  }
  .btn--primary:hover:not(:disabled) {
    background: #dba83f; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(201,150,58,0.4);
  }
  .btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn--ghost {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
  }
  .btn--ghost:hover { background: var(--surface); color: var(--ink); }

  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--navy-dark);
    border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Skeleton ── */
  .skeleton-wrap { display: flex; flex-direction: column; gap: 16px; }
  .skeleton {
    background: linear-gradient(90deg, #f5eddc 25%, #faf3e8 50%, #f5eddc 75%);
    background-size: 200% 100%; animation: shimmer 1.6s infinite;
  }
  @keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

  /* ── Responsive ── */
  @media (max-width: 760px) {
    .admin-page  { padding: 24px 20px; }
    .layout-grid { grid-template-columns: 1fr; }
    .avatar-card { position: static; flex-direction: row; text-align: left; gap: 16px; flex-wrap: wrap; }
    .big-avatar  { flex-shrink: 0; }
    .avatar-meta { display: none; }
  }
`;

export default AdminEditUserPage;