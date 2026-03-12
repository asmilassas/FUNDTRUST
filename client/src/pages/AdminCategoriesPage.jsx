import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

const CATEGORY_ICONS = ["🏥","🎓","🌱","🏠","🤝","💧","🌍","❤️","🛡️","⚡","🍽️","👶"];

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  const createCategory = async () => {
    if (!name || !description) { showToast("Both fields are required", "error"); return; }
    setSaving(true);
    try {
      await api.post("/categories", { name, description });
      setName(""); setDescription("");
      fetchCategories();
      showToast("Category created successfully");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create", "error");
    } finally { setSaving(false); }
  };

  const updateCategory = async () => {
    if (!name || !description) { showToast("Both fields are required", "error"); return; }
    setSaving(true);
    try {
      await api.patch(`/categories/${editingId}`, { name, description });
      setEditingId(null); setName(""); setDescription("");
      fetchCategories();
      showToast("Category updated successfully");
    } catch (error) {
      showToast("Update failed", "error");
    } finally { setSaving(false); }
  };

  const startEdit = (cat) => { setEditingId(cat._id); setName(cat.name); setDescription(cat.description); };
  const cancelEdit = () => { setEditingId(null); setName(""); setDescription(""); };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      showToast("Category deleted");
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <AdminLayout>
      <style>{styles}</style>

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      <div className="admin-page">

        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <p className="page-overline">Admin Panel</p>
            <h1 className="page-title">Categories</h1>
            <p className="page-sub">Manage donation categories shown to donors</p>
          </div>
          <div className="page-header-right">
            <div className="badge-count">
              <span className="badge-num">{categories.length}</span>
              <span className="badge-label">Total</span>
            </div>
          </div>
        </div>

        <div className="layout-grid">

          {/* ── Left: Form ── */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-icon">{editingId ? "✏️" : "＋"}</div>
              <div>
                <h2 className="form-panel-title">{editingId ? "Edit Category" : "New Category"}</h2>
                <p className="form-panel-sub">{editingId ? "Update the selected category" : "Add a new donation cause"}</p>
              </div>
            </div>

            <div className="form-body">
              <div className="field">
                <label className="field-label">Category Name</label>
                <input
                  className="field-input"
                  placeholder="e.g. Healthcare, Education..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label">Description</label>
                <textarea
                  className="field-textarea"
                  placeholder="Briefly describe this cause..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-actions">
                {editingId ? (
                  <>
                    <button className="btn btn--primary" onClick={updateCategory} disabled={saving}>
                      {saving ? <span className="btn-spinner" /> : "✓"} Update Category
                    </button>
                    <button className="btn btn--ghost" onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn--primary btn--full" onClick={createCategory} disabled={saving}>
                    {saving ? <span className="btn-spinner" /> : "＋"} Create Category
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: List ── */}
          <div className="list-panel">
            <div className="list-header">
              <h2 className="list-title">All Categories</h2>
              <span className="list-count">{categories.length} items</span>
            </div>

            {categories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌻</div>
                <p className="empty-title">No categories yet</p>
                <p className="empty-sub">Create your first category using the form.</p>
              </div>
            ) : (
              <div className="category-list">
                {categories.map((cat, i) => (
                  <div key={cat._id} className={`category-row ${editingId === cat._id ? "category-row--active" : ""}`}>
                    <div className="category-row-icon">{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</div>
                    <div className="category-row-body">
                      <p className="category-row-name">{cat.name}</p>
                      <p className="category-row-desc">{cat.description}</p>
                    </div>
                    <div className="category-row-actions">
                      <button className="icon-btn icon-btn--edit" onClick={() => startEdit(cat)} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="icon-btn icon-btn--delete" onClick={() => deleteCategory(cat._id)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
    max-width: 1280px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    min-height: 100vh;
    background: var(--surface);
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    top: 24px; right: 24px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    box-shadow: var(--shadow-md);
    animation: slideIn 0.25s ease;
  }

  .toast--success { background: var(--navy); color: #fff; border-left: 3px solid var(--gold); }
  .toast--error   { background: #fff; color: var(--red); border-left: 3px solid var(--red); box-shadow: var(--shadow-md); }

  .toast-icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    flex-shrink: 0;
  }

  .toast--success .toast-icon { background: var(--gold-light); color: var(--gold); }
  .toast--error   .toast-icon { background: var(--red-light);  color: var(--red); }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Page Header ── */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border);
  }

  .page-overline {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
  }

  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 700;
    color: var(--navy);
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .page-sub { font-size: 14px; color: var(--muted); }

  .badge-count {
    background: var(--navy);
    border-radius: 14px;
    padding: 16px 28px;
    text-align: center;
    border: 1px solid rgba(201,150,58,0.2);
  }

  .badge-num {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
  }

  .badge-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-top: 4px;
    display: block;
  }

  /* ── Layout ── */
  .layout-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 28px;
    align-items: start;
  }

  /* ── Form Panel ── */
  .form-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 24px;
  }

  .form-panel-header {
    background: var(--navy);
    padding: 24px 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid rgba(201,150,58,0.15);
  }

  .form-panel-icon {
    width: 42px; height: 42px;
    background: var(--gold-light);
    border: 1px solid var(--gold-border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    color: var(--gold);
  }

  .form-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.2px;
  }

  .form-panel-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  .form-body { padding: 28px; }

  .field { margin-bottom: 20px; }

  .field-label {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .field-input,
  .field-textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    background: var(--surface);
    transition: border-color 0.18s, box-shadow 0.18s;
    outline: none;
    resize: none;
  }

  .field-input:focus,
  .field-textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  .form-actions { display: flex; gap: 10px; margin-top: 8px; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 11px 20px;
    border-radius: 8px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .btn--primary {
    background: var(--gold);
    color: var(--navy-dark);
    box-shadow: 0 4px 16px rgba(201,150,58,0.3);
  }

  .btn--primary:hover:not(:disabled) {
    background: #dba83f;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(201,150,58,0.4);
  }

  .btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn--ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
  }

  .btn--ghost:hover { background: var(--surface); color: var(--ink); }
  .btn--full { width: 100%; justify-content: center; }

  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: var(--navy);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── List Panel ── */
  .list-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .list-header {
    padding: 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }

  .list-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--navy);
    letter-spacing: -0.2px;
  }

  .list-count {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted-light);
    background: var(--surface);
    padding: 4px 12px;
    border-radius: 50px;
    border: 1px solid var(--border);
  }

  /* ── Category Rows ── */
  .category-list { padding: 8px; }

  .category-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 12px;
    transition: background 0.15s;
    border: 1px solid transparent;
  }

  .category-row:hover { background: var(--surface); }

  .category-row--active {
    background: var(--gold-light);
    border-color: var(--gold-border);
  }

  .category-row-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .category-row--active .category-row-icon {
    background: rgba(201,150,58,0.1);
    border-color: var(--gold-border);
  }

  .category-row-body { flex: 1; min-width: 0; }

  .category-row-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-row-desc {
    font-size: 12.5px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-row-actions { display: flex; gap: 6px; flex-shrink: 0; }

  .icon-btn {
    width: 34px; height: 34px;
    border-radius: 8px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--card);
  }

  .icon-btn--edit { color: var(--navy); }
  .icon-btn--edit:hover {
    background: var(--gold-light);
    border-color: var(--gold-border);
    color: var(--gold-deep);
    transform: translateY(-1px);
  }

  .icon-btn--delete { color: var(--muted); }
  .icon-btn--delete:hover {
    background: var(--red-light);
    border-color: rgba(192,48,58,0.2);
    color: var(--red);
    transform: translateY(-1px);
  }

  /* ── Empty State ── */
  .empty-state {
    padding: 72px 24px;
    text-align: center;
  }

  .empty-icon  { font-size: 42px; margin-bottom: 16px; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .empty-sub   { font-size: 14px; color: var(--muted); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .admin-page { padding: 24px 20px; }
    .layout-grid { grid-template-columns: 1fr; }
    .form-panel { position: static; }
    .page-header { flex-direction: column; gap: 20px; }
  }
`;

export default AdminCategoriesPage;