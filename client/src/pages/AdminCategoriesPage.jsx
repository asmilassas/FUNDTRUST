import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = () => api.get("/categories").then(r => setCategories(r.data.categories || [])).catch(console.error);

  const handleSave = async () => {
    setError("");
    if (!name || !description) { setError("Both fields are required"); return; }
    setSaving(true);
    try {
      if (editingId) { await api.patch(`/categories/${editingId}`, { name, description }); }
      else { await api.post("/categories", { name, description }); }
      setName(""); setDescription(""); setEditingId(null); fetchCategories();
    } catch (err) { setError(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleEdit = (cat) => { setName(cat.name); setDescription(cat.description || ""); setEditingId(cat._id); };
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    await api.delete(`/categories/${id}`).catch(err => alert(err.response?.data?.message || "Delete failed"));
    fetchCategories();
  };

  const inp = { width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, color: "#1c0f00", marginBottom: 28 }}>📂 Manage Categories</h1>

      {/* Create/Edit form */}
      <div style={{ background: "white", borderRadius: 18, padding: 24, marginBottom: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid rgba(234,88,12,0.1)", maxWidth: 580 }}>
        <h3 style={{ fontFamily: "'Lora',serif", fontWeight: 700, color: "#1c0f00", marginBottom: 16 }}>{editingId ? "Edit Category" : "Add New Category"}</h3>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Healthcare" style={{ ...inp, marginBottom: 12 }} />
        <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Description *</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this category…" style={{ ...inp, height: 72, resize: "none", marginBottom: 14 }} />
        {error && <p style={{ color: "#dc2626", fontSize: 13, background: "#fee2e2", padding: "8px 12px", borderRadius: 8, marginBottom: 12 }}>{error}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
            {saving ? "Saving…" : editingId ? "Update" : "Create Category"}
          </button>
          {editingId && <button onClick={() => { setName(""); setDescription(""); setEditingId(null); }} style={{ padding: "10px 16px", background: "white", border: "1.5px solid #e5e7eb", borderRadius: 10, fontWeight: 600, cursor: "pointer", color: "#374151" }}>Cancel</button>}
        </div>
      </div>

      {/* List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {categories.map(cat => (
          <div key={cat._id} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(234,88,12,0.07)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#1c0f00", fontSize: 15, marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 13, color: "#78583a", lineHeight: 1.5 }}>{cat.description}</div>
            </div>
            <div style={{ display: "flex", gap: 7, marginLeft: 12, flexShrink: 0 }}>
              <button onClick={() => handleEdit(cat)} style={{ padding: "5px 10px", background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: 7, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Edit</button>
              <button onClick={() => handleDelete(cat._id, cat.name)} style={{ padding: "5px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 7, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminCategoriesPage;