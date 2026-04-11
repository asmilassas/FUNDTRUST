import { useEffect, useState } from "react";
import { validateFundForm } from "../utils";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

const IMG_BASE = "http://localhost:5000/uploads/";

function AdminProjectsPage() {
  const [funds, setFunds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", mission: "", description: "",
    category: "", targetAmount: "", deadline: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.isAdmin) { navigate("/"); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    const [p, c] = await Promise.all([
      api.get("/charities/admin/all"),
      api.get("/categories"),
    ]);
    setFunds(p.data.charities || []);
    setCategories(c.data.categories || []);
  };

  const resetForm = () => {
    setForm({ name: "", mission: "", description: "", category: "", targetAmount: "", deadline: "" });
    setCoverImage(null);
    setCoverPreview("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (fund) => {
    const g = fund.goals?.[0] || {};
    setForm({
      name: fund.name,
      mission: fund.mission,
      description: fund.impact || g.description || "",
      category: fund.category?._id || "",
      targetAmount: g.targetAmount || "",
      deadline: g.deadline ? g.deadline.slice(0, 10) : "",
    });
    setCoverImage(null);
    setCoverPreview(fund.coverImage ? `${IMG_BASE}${fund.coverImage}` : "");
    setEditingId(fund._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError("");
    const { name, mission, category, targetAmount, deadline } = form;
    // Validate required fields using shared util
    const { valid, error: validErr } = validateFundForm(form);
    if (!valid) { setError(validErr); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("mission", form.mission);
      fd.append("impact", form.description); // stored as "impact" in the schema
      fd.append("category", form.category);
      fd.append("goals", JSON.stringify([{
        title: form.name,
        description: form.description || form.mission,
        targetAmount: Number(form.targetAmount),
        amountRaised: editingId
          ? (funds.find(f => f._id === editingId)?.goals?.[0]?.amountRaised || 0)
          : 0,
        deadline: form.deadline,
      }]));
      if (coverImage) fd.append("coverImage", coverImage);

      if (editingId) {
        await api.patch(`/charities/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/charities", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      resetForm();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed. Please try again.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fund? This cannot be undone.")) return;
    await api.delete(`/charities/${id}`);
    fetchAll();
  };

  return (
    <AdminLayout>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={h1}>📁 Manage Funds</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={orangeBtn}>
          + New Fund
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div style={formCard}>
          <h3 style={{ fontFamily: "'Lora',serif", fontWeight: 700, color: "#1c0f00", marginBottom: 20, marginTop: 0, fontSize: 18 }}>
            {editingId ? "Edit Fund" : "Create New Fund"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Fund Name */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Fund Name <span style={req}>*</span></label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Clean Water for Colombo"
                style={inp}
              />
            </div>

            {/* Mission */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Mission <span style={req}>*</span></label>
              <textarea
                value={form.mission}
                onChange={e => setForm(f => ({ ...f, mission: e.target.value }))}
                placeholder="What is this fund trying to achieve?"
                style={{ ...inp, height: 80, resize: "vertical" }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Description <span style={opt}>(optional)</span></label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Additional details about the fund, its impact, or how donations will be used…"
                style={{ ...inp, height: 80, resize: "vertical" }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={lbl}>Category <span style={req}>*</span></label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={inp}
              >
                <option value="">Select a category…</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Target Amount */}
            <div>
              <label style={lbl}>Target Amount (LKR) <span style={req}>*</span></label>
              <input
                type="number"
                min="1"
                value={form.targetAmount}
                onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))}
                placeholder="e.g. 500000"
                style={inp}
              />
            </div>

            {/* Deadline */}
            <div>
              <label style={lbl}>Deadline <span style={req}>*</span></label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                style={inp}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label style={lbl}>Cover Image <span style={opt}>(optional)</span></label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "block", fontSize: 13, color: "#374151", marginBottom: 10 }}
              />
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  style={{ height: 80, borderRadius: 8, objectFit: "cover", border: "1px solid #e5e7eb" }}
                />
              )}
            </div>

          </div>

          {error && <p style={errMsg}>{error}</p>}

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={handleSave} disabled={saving} style={orangeBtn}>
              {saving ? "Saving…" : editingId ? "Update Fund" : "Create Fund"}
            </button>
            <button onClick={resetForm} style={cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* Fund list */}
      {funds.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 18, color: "#9ca3af" }}>
          No funds yet. Create your first one!
        </div>
      ) : (
        funds.map(fund => {
          const g   = fund.goals?.[0];
          const pct = g ? Math.min((g.amountRaised / g.targetAmount) * 100, 100).toFixed(1) : 0;
          return (
            <div key={fund._id} style={fundCard}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                {fund.coverImage && (
                  <img
                    src={`${IMG_BASE}${fund.coverImage}`}
                    alt={fund.name}
                    style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontFamily: "'Lora',serif", fontWeight: 700, color: "#1c0f00", fontSize: 16, margin: 0 }}>
                      {fund.name}
                    </h3>
                    {fund.category && (
                      <span style={{ fontSize: 11, background: "#fff7ee", color: "#f97316", padding: "2px 8px", borderRadius: 20, fontWeight: 600, border: "1px solid rgba(234,88,12,0.2)" }}>
                        {fund.category.name}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#78583a", marginBottom: 8, lineHeight: 1.5 }}>
                    {fund.mission.length > 100 ? fund.mission.slice(0, 100) + "…" : fund.mission}
                  </p>
                  {g && (
                    <div>
                      <div style={{ background: "#f3f4f6", borderRadius: 4, height: 5, overflow: "hidden", marginBottom: 4, maxWidth: 260 }}>
                        <div style={{ height: "100%", background: "linear-gradient(90deg,#f97316,#fbbf24)", width: `${pct}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        LKR {g.amountRaised.toLocaleString()} / LKR {g.targetAmount.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
                  <button onClick={() => navigate(`/project/${fund._id}`)} style={chip("blue")}>View</button>
                  <button onClick={() => handleEdit(fund)} style={chip("orange")}>Edit</button>
                  <button onClick={() => navigate(`/admin/projects/${fund._id}`)} style={chip("green")}>+ Update</button>
                  <button onClick={() => handleDelete(fund._id)} style={chip("red")}>Delete</button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </AdminLayout>
  );
}

// Styles
const h1 = { fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, color: "#1c0f00", margin: 0 };
const orangeBtn = { padding: "10px 20px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
const cancelBtn = { padding: "10px 20px", background: "white", border: "1.5px solid #e5e7eb", borderRadius: 12, fontWeight: 600, cursor: "pointer", color: "#374151", fontFamily: "inherit" };
const formCard = { background: "white", borderRadius: 18, padding: 28, marginBottom: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(234,88,12,0.12)" };
const fundCard = { background: "white", borderRadius: 18, padding: 22, marginBottom: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid rgba(234,88,12,0.07)" };
const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 };
const req = { color: "#f97316" };
const opt = { color: "#9ca3af", fontWeight: 400 };
const inp = { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", display: "block" };
const errMsg = { color: "#dc2626", fontSize: 13, marginTop: 12, background: "#fee2e2", padding: "10px 14px", borderRadius: 8 };
const chip = (c) => {
  const map = { blue: ["#1d4ed8","#dbeafe"], orange: ["#f97316","#fff7ee"], green: ["#059669","#d1fae5"], red: ["#dc2626","#fee2e2"] };
  const [col, bg] = map[c];
  return { padding: "7px 14px", background: bg, color: col, border: `1px solid ${col}30`, borderRadius: 9, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" };
};

export default AdminProjectsPage;

AdminProjectsPage.jsx