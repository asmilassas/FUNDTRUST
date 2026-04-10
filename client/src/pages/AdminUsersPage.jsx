import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import { AuthContext } from "../context/AuthContext";

function AdminUsersPage() {
  const [users, setUsers]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", isAdmin: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState(null);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u?.isAdmin) { navigate("/"); return; }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = () => api.get("/users/admin/all").then(r => setUsers(r.data.users || [])).catch(console.error);

  const handleCreate = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("All fields are required"); return; }
    setSaving(true);
    try {
      await api.post("/users/admin/create", form);
      setForm({ name: "", email: "", password: "", isAdmin: false }); setShowForm(false); fetchUsers();
    } catch (err) { setError(err.response?.data?.message || "Create failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try { await api.delete(`/users/admin/${id}`); fetchUsers(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const handleToggleAdmin = async (u) => {
    const action = u.isAdmin ? "remove admin rights from" : "make";
    const suffix = u.isAdmin ? "" : " an admin";
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${u.name}${suffix}?`)) return;
    setToggling(u._id);
    try { await api.patch(`/users/admin/${u._id}/toggle-admin`); fetchUsers(); }
    catch (err) { alert(err.response?.data?.message || "Failed to update role"); }
    finally { setToggling(null); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );
  const normals = filtered.filter(u => !u.isAdmin);
  const admins  = filtered.filter(u => u.isAdmin);

  const inputCls = "w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-[9px] text-sm outline-none font-sans box-border";

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-[26px] font-bold text-brand-dark">👥 Manage Users</h1>
        <button onClick={() => setShowForm(s => !s)}
          className="px-5 py-2.5 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl cursor-pointer font-sans text-sm">
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[18px] p-6 mb-6 shadow-panel border border-brand-orange/10">
          <h3 className="font-serif font-bold text-brand-dark mb-4 text-lg">Create New User</h3>
          <div className="grid grid-cols-2 gap-3">
            {[["name","Full Name","text"],["email","Email","text"],["password","Password","password"]].map(([k,label,type]) => (
              <div key={k}>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                <input type={type} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} className={inputCls} />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isAdmin" checked={form.isAdmin} onChange={e => setForm(f => ({...f,isAdmin:e.target.checked}))} />
              <label htmlFor="isAdmin" className="text-sm text-gray-700 cursor-pointer">Make Admin</label>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mt-2">{error}</p>}
          <button onClick={handleCreate} disabled={saving}
            className="mt-4 px-5 py-2.5 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl cursor-pointer disabled:opacity-60 font-sans text-sm">
            {saving ? "Creating…" : "Create User"}
          </button>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
        className="px-4 py-2.5 border-[1.5px] border-gray-200 rounded-full text-sm w-full max-w-[340px] outline-none mb-6 font-sans block" />

      <div className="grid grid-cols-2 gap-6">
        {[[" 👤 Regular Users", normals, true],["🛡 Administrators", admins, false]].map(([title, list, canDelete]) => (
          <div key={title}>
            <h2 className="font-serif text-[17px] font-bold text-brand-dark mb-3.5">{title} ({list.length})</h2>
            {list.length === 0 ? <p className="text-gray-400 text-sm">None found.</p> : list.map(u => (
              <div key={u._id} className="bg-white rounded-[14px] p-4 mb-2.5 shadow-card flex justify-between items-center gap-2">
                <div>
                  <div className="font-semibold text-brand-dark text-sm">
                    {u.name}
                    {currentUser?._id === u._id && (
                      <span className="ml-2 text-[10px] bg-brand-warm text-brand-orange border border-brand-orange/25 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">You</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                  {canDelete && <div className={`text-[11px] font-semibold mt-0.5 ${u.isVerified ? "text-emerald-600" : "text-brand-orange"}`}>{u.isVerified ? "✓ Verified" : "⚠ Unverified"}</div>}
                </div>
                <div className="flex gap-1.5">
                  {canDelete && (
                    <button onClick={() => handleToggleAdmin(u)} disabled={toggling === u._id}
                      className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold cursor-pointer text-xs font-sans whitespace-nowrap">
                      {toggling === u._id ? "…" : "Make Admin"}
                    </button>
                  )}
                  {!canDelete && currentUser?._id !== u._id && (
                    <button onClick={() => handleToggleAdmin(u)} disabled={toggling === u._id}
                      className="px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded-lg font-semibold cursor-pointer text-xs font-sans whitespace-nowrap">
                      {toggling === u._id ? "…" : "Remove Admin"}
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(u._id, u.name)}
                      className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg font-semibold cursor-pointer text-xs font-sans">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminUsersPage;