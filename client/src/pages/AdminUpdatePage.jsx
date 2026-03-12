import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

const STATUS_OPTIONS = [
  { value: "started",     label: "Started",     color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)" },
  { value: "in-progress", label: "In Progress", color: "#c9963a", bg: "rgba(201,150,58,0.1)",  border: "rgba(201,150,58,0.25)" },
  { value: "completed",   label: "Completed",   color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"  },
];

function AdminUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject]         = useState(null);
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus]           = useState("started");
  const [images, setImages]           = useState([]);
  const [previews, setPreviews]       = useState([]);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) { navigate("/"); return; }
    fetchProject();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchProject = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setProject(res.data.charity);
    } catch (e) { console.error(e); }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(e.target.files);
    setPreviews(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
  };

  const removePreview = (idx) => {
    const newPreviews = previews.filter((_, i) => i !== idx);
    setPreviews(newPreviews);
    const dt = new DataTransfer();
    Array.from(images).filter((_, i) => i !== idx).forEach((f) => dt.items.add(f));
    setImages(dt.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) { showToast("Title and description are required", "error"); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

      await api.post(`/charities/${id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Update published successfully");
      setTitle(""); setDescription(""); setImages([]); setPreviews([]);
    } catch (e) {
      showToast(e.response?.data?.message || "Update failed", "error");
    } finally { setSaving(false); }
  };

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === status);

  if (!project) return (
    <AdminLayout>
      <div style={{ padding: 60, textAlign: "center", fontFamily: "'DM Sans', sans-serif", color: "#4e6080" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📢</div>
        Loading project…
      </div>
    </AdminLayout>
  );

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
          <span className="breadcrumb-link" onClick={() => navigate("/admin/projects")}>Projects</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link" onClick={() => navigate(`/admin/projects/${id}`)}>{project.name}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Post Update</span>
        </div>

        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <p className="page-overline">Admin Panel</p>
            <h1 className="page-title">Post Update</h1>
            <p className="page-sub">Publishing progress for <strong style={{ color: "var(--navy)" }}>{project.name}</strong></p>
          </div>
          <button className="back-btn" onClick={() => navigate(`/admin/projects/${id}`)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Project
          </button>
        </div>

        <div className="layout-grid">

          {/* ── Left: Form ── */}
          <div className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-icon">📢</div>
              <div>
                <h2 className="form-panel-title">Update Details</h2>
                <p className="form-panel-sub">Visible to all donors of this project</p>
              </div>
            </div>

            <div className="form-body">
              <div className="field">
                <label className="field-label">Update Title <span className="req">*</span></label>
                <input className="field-input" placeholder="e.g. School construction has started"
                  value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="field">
                <label className="field-label">Description <span className="req">*</span></label>
                <textarea className="field-textarea" rows={5}
                  placeholder="Explain what has been achieved, any challenges, and next steps…"
                  value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="field">
                <label className="field-label">Project Status</label>
                <div className="status-options">
                  {STATUS_OPTIONS.map((opt) => (
                    <div key={opt.value}
                      className={`status-chip ${status === opt.value ? "status-chip--active" : ""}`}
                      style={status === opt.value ? { background: opt.bg, borderColor: opt.border, color: opt.color } : {}}
                      onClick={() => setStatus(opt.value)}>
                      <span className="status-dot" style={{ background: opt.color }} />
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Upload Images</label>
                <label className="file-drop">
                  <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: "none" }} />
                  <div className="file-drop-inner">
                    <span className="file-drop-icon">🖼️</span>
                    <p className="file-drop-text">Click to select images</p>
                    <p className="file-drop-sub">PNG, JPG, WEBP supported</p>
                  </div>
                </label>

                {previews.length > 0 && (
                  <div className="image-previews">
                    {previews.map((p, i) => (
                      <div key={i} className="preview-item">
                        <img src={p.url} alt={p.name} className="preview-img" />
                        <button className="preview-remove" onClick={() => removePreview(i)}>✕</button>
                        <p className="preview-name">{p.name.length > 14 ? p.name.slice(0,12) + "…" : p.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn btn--primary btn--full" onClick={handleSubmit} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : "📢"} Publish Update
              </button>
            </div>
          </div>

          {/* ── Right: Preview ── */}
          <div className="preview-panel">
            <div className="preview-panel-header">
              <h2 className="preview-panel-title">Live Preview</h2>
              <p className="preview-panel-sub">How donors will see this update</p>
            </div>
            <div className="preview-body">
              <div className="update-card">
                <div className="update-card-top">
                  <div className="update-project-name">{project.name}</div>
                  <div className="update-status-pill"
                    style={{ background: selectedStatus.bg, borderColor: selectedStatus.border, color: selectedStatus.color }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: selectedStatus.color, flexShrink: 0 }} />
                    {selectedStatus.label}
                  </div>
                </div>
                <h3 className="update-card-title">{title || <span style={{ color: "#bbb" }}>Update title will appear here…</span>}</h3>
                <p className="update-card-desc">{description || <span style={{ color: "#ccc", fontSize: 13 }}>Description will appear here…</span>}</p>

                {previews.length > 0 && (
                  <div className="update-images">
                    {previews.slice(0, 3).map((p, i) => (
                      <img key={i} src={p.url} alt="" className="update-thumb" />
                    ))}
                    {previews.length > 3 && (
                      <div className="update-thumb update-thumb--more">+{previews.length - 3}</div>
                    )}
                  </div>
                )}

                <div className="update-card-footer">
                  <span>📅 {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>By Admin</span>
                </div>
              </div>
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
    max-width: 1200px; margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink); background: var(--surface); min-height: 100vh;
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
    font-size: 12.5px; color: var(--muted-light); margin-bottom: 20px;
  }
  .breadcrumb-link { cursor: pointer; color: var(--muted); transition: color 0.15s; font-weight: 500; }
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
    font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.18s;
  }
  .back-btn:hover { border-color: var(--gold-border); color: var(--navy); background: var(--gold-light); }

  /* ── Layout ── */
  .layout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }

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
    font-size: 18px; flex-shrink: 0;
  }
  .form-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: #fff;
  }
  .form-panel-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; }
  .form-body { padding: 24px 28px 28px; }

  /* Fields */
  .field { margin-bottom: 20px; }
  .field-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px;
  }
  .req { color: var(--gold); }
  .field-input, .field-textarea {
    width: 100%; padding: 11px 14px;
    border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    background: var(--surface); transition: border-color 0.18s, box-shadow 0.18s;
    outline: none; resize: none;
  }
  .field-input:focus, .field-textarea:focus {
    border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  /* Status chips */
  .status-options { display: flex; gap: 8px; flex-wrap: wrap; }
  .status-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 50px; border: 1px solid var(--border);
    font-size: 12.5px; font-weight: 600; cursor: pointer;
    background: var(--surface); color: var(--muted);
    transition: all 0.18s;
  }
  .status-chip:hover { border-color: var(--gold-border); color: var(--navy); }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  /* File drop */
  .file-drop {
    display: block; border: 2px dashed var(--border); border-radius: 10px;
    cursor: pointer; transition: border-color 0.18s, background 0.18s;
  }
  .file-drop:hover { border-color: var(--gold-border); background: var(--gold-light); }
  .file-drop-inner { padding: 24px; text-align: center; }
  .file-drop-icon  { font-size: 24px; display: block; margin-bottom: 8px; }
  .file-drop-text  { font-size: 14px; font-weight: 600; color: var(--navy); }
  .file-drop-sub   { font-size: 12px; color: var(--muted-light); margin-top: 3px; }

  /* Image previews */
  .image-previews { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
  .preview-item   { position: relative; text-align: center; }
  .preview-img    {
    width: 68px; height: 68px; border-radius: 8px; object-fit: cover;
    border: 1px solid var(--border); display: block;
  }
  .preview-remove {
    position: absolute; top: -6px; right: -6px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--red); color: white; border: none;
    font-size: 9px; cursor: pointer; display: flex;
    align-items: center; justify-content: center; font-weight: 700;
  }
  .preview-name { font-size: 10px; color: var(--muted-light); margin-top: 4px; max-width: 68px; word-break: break-all; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 22px; border-radius: 8px; border: none;
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
  .btn--full { width: 100%; justify-content: center; margin-top: 4px; }
  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--navy-dark);
    border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Preview Panel ── */
  .preview-panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm);
    position: sticky; top: 24px;
  }
  .preview-panel-header {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .preview-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--navy);
  }
  .preview-panel-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .preview-body { padding: 20px 24px; }

  /* Update card preview */
  .update-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px;
  }
  .update-card-top {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
  }
  .update-project-name {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--gold-deep);
  }
  .update-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 50px; border: 1px solid;
    font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .update-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--navy);
    margin-bottom: 8px; letter-spacing: -0.2px; line-height: 1.2;
  }
  .update-card-desc {
    font-size: 13.5px; color: var(--muted); line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
  }
  .update-images { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .update-thumb {
    width: 60px; height: 60px; border-radius: 8px; object-fit: cover;
    border: 1px solid var(--border);
  }
  .update-thumb--more {
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--muted);
    background: var(--surface); border: 1px solid var(--border);
  }
  .update-card-footer {
    display: flex; justify-content: space-between;
    margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border);
    font-size: 11.5px; color: var(--muted-light); font-weight: 500;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .admin-page  { padding: 24px 20px; }
    .layout-grid { grid-template-columns: 1fr; }
    .preview-panel { position: static; }
  }
`;

export default AdminUpdatePage;