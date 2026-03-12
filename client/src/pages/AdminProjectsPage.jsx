import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminProjectsPage() {
  const [projects, setProjects]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);

  const [name, setName]               = useState("");
  const [mission, setMission]         = useState("");
  const [category, setCategory]       = useState("");
  const [goalTitle, setGoalTitle]     = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline]       = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) { navigate("/"); return; }
    fetchProjects();
    fetchCategories();
  }, [navigate]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/charities/admin/all");
      setProjects(res.data.charities || []);
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (e) { console.error(e); }
  };

  const clearForm = () => {
    setName(""); setMission(""); setCategory("");
    setGoalTitle(""); setGoalDescription(""); setTargetAmount(""); setDeadline("");
  };

  const createProject = async () => {
    if (!name || !mission || !category || !goalTitle || !goalDescription || !targetAmount) {
      showToast("Please fill all required fields", "error"); return;
    }
    setSaving(true);
    try {
      await api.post("/charities", {
        name, mission, category,
        goals: [{ title: goalTitle, description: goalDescription,
          targetAmount: Number(targetAmount), amountRaised: 0, deadline: deadline || null }],
      });
      clearForm();
      fetchProjects();
      showToast("Project created successfully");
    } catch (e) {
      showToast("Failed to create project", "error");
    } finally { setSaving(false); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/charities/${id}`);
      fetchProjects();
      showToast("Project deleted");
    } catch (e) { showToast("Delete failed", "error"); }
  };

  const totalRaised = projects.reduce((sum, p) =>
    sum + (p.goals?.reduce((s, g) => s + (g.amountRaised || 0), 0) || 0), 0);

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
            <h1 className="page-title">Projects</h1>
            <p className="page-sub">Manage charity projects and fundraising goals</p>
          </div>
          <div className="header-stats">
            <div className="hstat">
              <span className="hstat-val">{projects.length}</span>
              <span className="hstat-label">Projects</span>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <span className="hstat-val">{categories.length}</span>
              <span className="hstat-label">Categories</span>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <span className="hstat-val">₹{(totalRaised/1000).toFixed(1)}k</span>
              <span className="hstat-label">Raised</span>
            </div>
          </div>
        </div>

        <div className="layout-grid">

          {/* ── Left: Form ── */}
          <aside className="form-panel">
            <div className="form-panel-header">
              <div className="form-panel-icon">＋</div>
              <div>
                <h2 className="form-panel-title">New Project</h2>
                <p className="form-panel-sub">Fill in the details below</p>
              </div>
            </div>

            <div className="form-body">

              <p className="form-section-label">Project Info</p>

              <div className="field">
                <label className="field-label">Project Name <span className="req">*</span></label>
                <input className="field-input" placeholder="e.g. Clean Water Initiative"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="field">
                <label className="field-label">Mission <span className="req">*</span></label>
                <textarea className="field-textarea" placeholder="What is this project trying to achieve?"
                  value={mission} onChange={(e) => setMission(e.target.value)} rows={3} />
              </div>

              <div className="field">
                <label className="field-label">Category <span className="req">*</span></label>
                <select className="field-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select a category…</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-divider" />
              <p className="form-section-label">Fundraising Goal</p>

              <div className="field">
                <label className="field-label">Goal Title <span className="req">*</span></label>
                <input className="field-input" placeholder="e.g. Build 5 Water Wells"
                  value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
              </div>

              <div className="field">
                <label className="field-label">Goal Description <span className="req">*</span></label>
                <textarea className="field-textarea" placeholder="Describe what this goal will accomplish…"
                  value={goalDescription} onChange={(e) => setGoalDescription(e.target.value)} rows={3} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field-label">Target Amount <span className="req">*</span></label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input className="field-input field-input--prefixed" type="number"
                      placeholder="50000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Deadline</label>
                  <input className="field-input" type="date"
                    value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
              </div>

              <button className="btn btn--primary btn--full" onClick={createProject} disabled={saving}>
                {saving ? <span className="btn-spinner" /> : "＋"} Create Project
              </button>

            </div>
          </aside>

          {/* ── Right: Projects ── */}
          <div className="list-panel">
            <div className="list-header">
              <h2 className="list-title">All Projects</h2>
              <span className="list-count">{projects.length} items</span>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <p className="empty-title">No projects yet</p>
                <p className="empty-sub">Create your first project using the form.</p>
              </div>
            ) : (
              <div className="project-list">
                {projects.map((project) => {
                  const raised = project.goals?.reduce((s, g) => s + (g.amountRaised || 0), 0) || 0;
                  const target = project.goals?.reduce((s, g) => s + (g.targetAmount || 0), 0) || 0;
                  const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
                  return (
                    <div key={project._id} className="project-card">
                      <div className="project-card-top">
                        <div className="project-card-info">
                          <div className="project-category-badge">
                            {project.category?.name || "Uncategorized"}
                          </div>
                          <h3 className="project-name">{project.name}</h3>
                          <p className="project-mission">{project.mission}</p>
                        </div>
                        <div className="project-card-actions">
                          <button className="action-btn action-btn--edit"
                            onClick={() => navigate(`/admin/projects/${project._id}`)} title="Edit Project">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          <button className="action-btn action-btn--update"
                            onClick={() => navigate(`/admin/projects/${project._id}/update`)} title="Post Update">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Post Update
                          </button>
                          <button className="icon-btn icon-btn--delete"
                            onClick={() => deleteProject(project._id)} title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {target > 0 && (
                        <div className="project-progress">
                          <div className="progress-meta">
                            <span className="progress-raised">₹{raised.toLocaleString()} raised</span>
                            <span className="progress-pct">{pct}%</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="progress-target">of ₹{target.toLocaleString()} goal</span>
                        </div>
                      )}
                    </div>
                  );
                })}
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
    max-width: 1320px;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    background: var(--surface);
    min-height: 100vh;
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 20px;
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
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--navy);
    border: 1px solid rgba(201,150,58,0.2);
    border-radius: 16px;
    overflow: hidden;
  }
  .hstat {
    padding: 16px 28px;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
  }
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
  .layout-grid {
    display: grid;
    grid-template-columns: 400px 1fr;
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
    padding: 22px 28px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 1px solid rgba(201,150,58,0.15);
  }
  .form-panel-icon {
    width: 42px; height: 42px;
    background: var(--gold-light); border: 1px solid var(--gold-border);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: var(--gold); flex-shrink: 0; font-weight: 700;
  }
  .form-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .form-panel-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  .form-body { padding: 24px 28px 28px; }
  .form-section-label {
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 16px;
  }
  .form-divider { height: 1px; background: var(--border); margin: 20px 0 18px; }

  .field { margin-bottom: 16px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .field-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 7px;
  }
  .req { color: var(--gold); }

  .field-input,
  .field-textarea,
  .field-select {
    width: 100%; padding: 10px 13px;
    border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    background: var(--surface); transition: border-color 0.18s, box-shadow 0.18s;
    outline: none; resize: none; appearance: none;
  }
  .field-input:focus,
  .field-textarea:focus,
  .field-select:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  .input-prefix-wrap { position: relative; }
  .input-prefix {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 14px; font-weight: 600; color: var(--muted-light); pointer-events: none;
  }
  .field-input--prefixed { padding-left: 26px; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 20px; border-radius: 8px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
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
  .btn--full { width: 100%; justify-content: center; margin-top: 8px; }

  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.2); border-top-color: var(--navy-dark);
    border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
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
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }
  .list-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--navy); letter-spacing: -0.2px;
  }
  .list-count {
    font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--muted-light);
    background: var(--surface); padding: 4px 12px;
    border-radius: 50px; border: 1px solid var(--border);
  }

  /* ── Project Cards ── */
  .project-list { padding: 12px; display: flex; flex-direction: column; gap: 10px; }

  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 22px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .project-card:hover {
    border-color: rgba(201,150,58,0.2);
    box-shadow: 0 4px 20px rgba(15,31,61,0.08);
  }

  .project-card-top {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .project-card-info { flex: 1; min-width: 0; }

  .project-category-badge {
    display: inline-block;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--gold-deep);
    background: var(--gold-light); border: 1px solid var(--gold-border);
    padding: 3px 10px; border-radius: 50px; margin-bottom: 8px;
  }
  .project-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 700; color: var(--navy);
    letter-spacing: -0.2px; margin-bottom: 5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .project-mission {
    font-size: 13px; color: var(--muted); line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  .project-card-actions { display: flex; gap: 6px; flex-shrink: 0; }

  .icon-btn {
    width: 34px; height: 34px; border-radius: 8px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; background: var(--card);
  }
  /* ── Labeled Action Buttons ── */
  .action-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 12px; border-radius: 7px; border: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; background: var(--card);
    white-space: nowrap;
  }
  .action-btn--edit { color: var(--navy); }
  .action-btn--edit:hover {
    background: var(--gold-light); border-color: var(--gold-border);
    color: var(--gold-deep); transform: translateY(-1px);
  }
  .action-btn--update { color: #2563eb; border-color: rgba(37,99,235,0.2); }
  .action-btn--update:hover {
    background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.35);
    transform: translateY(-1px);
  }

  .icon-btn--delete { color: var(--muted); }
  .icon-btn--delete:hover {
    background: var(--red-light); border-color: rgba(192,48,58,0.2);
    color: var(--red); transform: translateY(-1px);
  }

  /* ── Progress Bar ── */
  .project-progress { margin-top: 16px; }
  .progress-meta {
    display: flex; justify-content: space-between;
    font-size: 12px; font-weight: 600; margin-bottom: 6px;
  }
  .progress-raised { color: var(--navy); }
  .progress-pct    { color: var(--gold-deep); }
  .progress-track  {
    height: 5px; background: rgba(15,31,61,0.08);
    border-radius: 99px; overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-deep), var(--gold));
    border-radius: 99px;
    transition: width 0.4s ease;
  }
  .progress-target { font-size: 11px; color: var(--muted-light); margin-top: 4px; display: block; }

  /* ── Empty State ── */
  .empty-state { padding: 72px 24px; text-align: center; }
  .empty-icon  { font-size: 42px; margin-bottom: 16px; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .empty-sub   { font-size: 14px; color: var(--muted); }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .admin-page    { padding: 24px 20px; }
    .layout-grid   { grid-template-columns: 1fr; }
    .form-panel    { position: static; }
    .field-row     { grid-template-columns: 1fr; }
    .header-stats  { flex-wrap: wrap; border-radius: 12px; }
  }
`;

export default AdminProjectsPage;