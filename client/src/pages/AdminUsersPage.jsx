import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  ["#1a3260","#c9963a"],["#0f1f3d","#e3b04a"],["#1e3a5f","#d4a843"],
  ["#2c1654","#c9963a"],["#0d2137","#b8842f"],
];

function AdminUsersPage() {
  const [users, setUsers]       = useState([]);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [search, setSearch]     = useState("");

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/admin/all");
      setUsers(res.data.users || []);
    } catch (e) { console.error(e); }
  };

  const createUser = async () => {
    if (!name || !email || !password) { showToast("All fields are required", "error"); return; }
    setSaving(true);
    try {
      await api.post("/users/admin/create", { name, email, password, isAdmin });
      setName(""); setEmail(""); setPassword(""); setIsAdmin(false);
      fetchUsers();
      showToast("User created successfully");
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to create user", "error");
    } finally { setSaving(false); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/admin/${id}`);
      fetchUsers();
      showToast("User deleted");
    } catch (e) { showToast("Delete failed", "error"); }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const normalUsers = filtered.filter((u) => !u.isAdmin);
  const adminUsers  = filtered.filter((u) => u.isAdmin);

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

        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <p className="page-overline">Admin Panel</p>
            <h1 className="page-title">Users</h1>
            <p className="page-sub">Create and manage platform users</p>
          </div>
          <div className="header-stats">
            <div className="hstat">
              <span className="hstat-val">{users.filter(u => !u.isAdmin).length}</span>
              <span className="hstat-label">Users</span>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <span className="hstat-val">{users.filter(u => u.isAdmin).length}</span>
              <span className="hstat-label">Admins</span>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <span className="hstat-val">{users.length}</span>
              <span className="hstat-label">Total</span>
            </div>
          </div>
        </div>

        <div className="layout-grid">

          {/* ── Left: Form ── */}
          <aside className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-icon">＋</div>
              <div>
                <h2 className="form-panel-title">New User</h2>
                <p className="form-panel-sub">Add a new platform user</p>
              </div>
            </div>

            <div className="form-body">
              <div className="field">
                <label className="field-label">Full Name <span className="req">*</span></label>
                <input className="field-input" placeholder="e.g. Arjun Sharma"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="field">
                <label className="field-label">Email Address <span className="req">*</span></label>
                <input className="field-input" type="email" placeholder="e.g. arjun@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="field">
                <label className="field-label">Password <span className="req">*</span></label>
                <div className="input-suffix-wrap">
                  <input className="field-input field-input--suffixed"
                    type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button className="input-suffix-btn" type="button" onClick={() => setShowPass(v => !v)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="toggle-row" onClick={() => setIsAdmin(v => !v)}>
                <div className="toggle-info">
                  <p className="toggle-title">Admin Access</p>
                  <p className="toggle-sub">Can manage projects, users & categories</p>
                </div>
                <div className={`toggle-switch ${isAdmin ? "toggle-switch--on" : ""}`}>
                  <div className="toggle-thumb" />
                </div>
              </div>

              <button className="btn btn--primary btn--full" onClick={createUser} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : "＋"} Create User
              </button>
            </div>
          </aside>

          {/* ── Right: User Lists ── */}
          <div className="list-panel">
            <div className="list-header">
              <h2 className="list-title">All Users</h2>
              <div className="search-wrap">
                <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input className="search-input" placeholder="Search users…"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="list-body">

              {/* Admins */}
              <div className="user-section">
                <div className="section-label">
                  <span className="section-label-dot section-label-dot--gold" />
                  Administrators
                  <span className="section-label-count">{adminUsers.length}</span>
                </div>
                {adminUsers.length === 0 ? (
                  <p className="section-empty">No admins found</p>
                ) : adminUsers.map((user, i) => (
                  <UserRow key={user._id} user={user} idx={i} onEdit={() => navigate(`/admin/users/${user._id}/edit`)} onDelete={() => deleteUser(user._id)} />
                ))}
              </div>

              {/* Users */}
              <div className="user-section">
                <div className="section-label">
                  <span className="section-label-dot" />
                  Members
                  <span className="section-label-count">{normalUsers.length}</span>
                </div>
                {normalUsers.length === 0 ? (
                  <p className="section-empty">No users found</p>
                ) : normalUsers.map((user, i) => (
                  <UserRow key={user._id} user={user} idx={i} onEdit={() => navigate(`/admin/users/${user._id}/edit`)} onDelete={() => deleteUser(user._id)} />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

function UserRow({ user, idx, onEdit, onDelete }) {
  const [bg, accent] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div className="user-row">
      <div className="user-avatar" style={{ background: bg, color: accent }}>
        {getInitials(user.name)}
      </div>
      <div className="user-info">
        <p className="user-name">{user.name}</p>
        <p className="user-email">{user.email}</p>
      </div>
      {user.isAdmin && <span className="role-badge">Admin</span>}
      <div className="user-actions">
        <button className="icon-btn icon-btn--edit" onClick={onEdit} title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="icon-btn icon-btn--delete" onClick={onDelete} title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
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
    max-width: 1320px;
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

  /* ── Page Header ── */
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 40px; padding-bottom: 32px;
    border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 20px;
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

  .header-stats {
    display: flex; align-items: center;
    background: var(--navy); border: 1px solid rgba(201,150,58,0.2);
    border-radius: 16px; overflow: hidden;
  }
  .hstat { padding: 16px 28px; display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .hstat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 700; color: var(--gold); line-height: 1;
  }
  .hstat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
  }
  .hstat-divider { width: 1px; height: 40px; background: rgba(201,150,58,0.18); flex-shrink: 0; }

  /* ── Layout ── */
  .layout-grid { display: grid; grid-template-columns: 360px 1fr; gap: 28px; align-items: start; }

  /* ── Form Panel ── */
  .form-panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm);
    position: sticky; top: 24px;
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
    font-size: 20px; color: var(--gold); font-weight: 700; flex-shrink: 0;
  }
  .form-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: #fff;
  }
  .form-panel-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  .form-body { padding: 24px 28px 28px; }
  .field { margin-bottom: 16px; }
  .field-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 7px;
  }
  .req { color: var(--gold); }
  .field-input {
    width: 100%; padding: 10px 13px;
    border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    background: var(--surface); transition: border-color 0.18s, box-shadow 0.18s;
    outline: none;
  }
  .field-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,150,58,0.1); }

  .input-suffix-wrap { position: relative; }
  .field-input--suffixed { padding-right: 42px; }
  .input-suffix-btn {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px;
  }

  /* Toggle */
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border);
    cursor: pointer; margin-bottom: 20px; background: var(--surface);
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
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 20px; border-radius: 8px; border: none;
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
  .btn--full { width: 100%; justify-content: center; }
  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--navy-dark);
    border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── List Panel ── */
  .list-panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm);
  }
  .list-header {
    padding: 18px 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    border-bottom: 1px solid var(--border); flex-wrap: wrap;
  }
  .list-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--navy); letter-spacing: -0.2px;
  }
  .search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 12px; min-width: 220px;
  }
  .search-icon { color: var(--muted-light); flex-shrink: 0; }
  .search-input {
    border: none; background: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--ink);
    width: 100%;
  }
  .search-input::placeholder { color: var(--muted-light); }

  .list-body { padding: 16px; }

  .user-section { margin-bottom: 8px; }

  .section-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
    padding: 10px 8px 8px; margin-bottom: 4px;
  }
  .section-label-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--muted-light); flex-shrink: 0;
  }
  .section-label-dot--gold { background: var(--gold); }
  .section-label-count {
    margin-left: auto;
    font-size: 10.5px; font-weight: 700;
    color: var(--muted-light); background: var(--surface);
    padding: 2px 9px; border-radius: 50px; border: 1px solid var(--border);
  }
  .section-empty { font-size: 13px; color: var(--muted-light); padding: 12px 8px; }

  /* ── User Row ── */
  .user-row {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 10px; border-radius: 10px;
    transition: background 0.15s; cursor: default;
  }
  .user-row:hover { background: var(--surface); }

  .user-avatar {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
    letter-spacing: 0.05em;
  }

  .user-info { flex: 1; min-width: 0; }
  .user-name  { font-size: 14px; font-weight: 600; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-email { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .role-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--gold-deep);
    background: var(--gold-light); border: 1px solid var(--gold-border);
    padding: 3px 9px; border-radius: 50px; flex-shrink: 0;
  }

  .user-actions { display: flex; gap: 6px; flex-shrink: 0; }

  .icon-btn {
    width: 32px; height: 32px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--card);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s;
  }
  .icon-btn--edit { color: var(--navy); }
  .icon-btn--edit:hover {
    background: var(--gold-light); border-color: var(--gold-border);
    color: var(--gold-deep); transform: translateY(-1px);
  }
  .icon-btn--delete { color: var(--muted); }
  .icon-btn--delete:hover {
    background: var(--red-light); border-color: rgba(192,48,58,0.2);
    color: var(--red); transform: translateY(-1px);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .admin-page  { padding: 24px 20px; }
    .layout-grid { grid-template-columns: 1fr; }
    .form-panel  { position: static; }
  }
`;

export default AdminUsersPage;