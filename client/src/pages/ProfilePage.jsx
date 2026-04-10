import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function ProfilePage() {
  const { user, setUser, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (!user) { navigate("/login"); return null; }

  const initials = user.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleUpdate = async () => {
    setMessage(""); setError(""); setLoading(true);
    try {
      if (newPw || confirmPw) {
        if (newPw.length < 8) { setError("New password must be at least 8 characters."); setLoading(false); return; }
        if (newPw !== confirmPw) { setError("Passwords do not match."); setLoading(false); return; }
      }
      const payload = { name };
      if (newPw) payload.newPassword = newPw;
      const res = await api.patch("/users/me", payload);
      setMessage("Profile updated successfully!");
      const updated = { ...user, name: res.data.user.name };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setNewPw(""); setConfirmPw("");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans">
      <div className="max-w-[500px] mx-auto">

        {/* Avatar and name */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-15 h-15 rounded-full bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-xl font-bold text-white shrink-0"
            style={{ width: 60, height: 60 }}>
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-dark">{user.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {user.email}
              {user.isAdmin && (
                <span className="ml-2 text-[10px] bg-brand-warm text-brand-orange border border-brand-orange/25 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">Admin</span>
              )}
            </p>
          </div>
        </div>

        {/* Settings card */}
        <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-card">
          <h3 className="font-serif text-lg font-bold text-brand-dark mb-5">Profile Settings</h3>

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            className="block w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none font-sans mb-4" />

          <div className="h-px bg-gray-100 my-5" />
          <h4 className="text-sm font-bold text-gray-700 mb-1">Change Password</h4>
          <p className="text-xs text-gray-400 mb-4">Only fill these fields if you want to set a new password.</p>

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters"
            className="block w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none font-sans mb-4" />

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
          <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password"
            className="block w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm outline-none font-sans mb-4" />

          {message && <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-4">✅ {message}</div>}
          {error   && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">❌ {error}</div>}

          <button onClick={handleUpdate} disabled={loading}
            className="w-full py-3.5 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-60 font-sans">
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* Log out */}
        <div className="mt-4">
          <button onClick={() => { logout(); navigate("/"); }}
            className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm cursor-pointer font-sans border-none">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;