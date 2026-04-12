import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import { fundingProgress } from "../utils";
import { getImageUrl } from "../utils";

const STATUS_CLS = {
  completed: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
};

function AdminProjectUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("started");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchFund(); }, [id]);

  const fetchFund = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setFund(res.data.charity);
    } catch {
      navigate("/admin/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  setImages(e.target.files);
  setImagePreviews(files.map(f => URL.createObjectURL(f)));
};

const removeImage = (index) => {
  const updated = imagePreviews.filter((_, i) => i !== index);
  setImagePreviews(updated);
  // Rebuild FileList-like array
  const updatedFiles = Array.from(images).filter((_, i) => i !== index);
  const dt = new DataTransfer();
  updatedFiles.forEach(f => dt.items.add(f));
  setImages(dt.files);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) { setMessage("error:Title and description are required."); return; }
    setSaving(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("status", status);
      for (let i = 0; i < images.length; i++) fd.append("images", images[i]);
      await api.post(`/charities/${id}/update`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("success");
      setTitle(""); setDescription(""); setImages([]); setImagePreviews([]);
      fetchFund();
    } catch (err) {
      setMessage("error:" + (err.response?.data?.message || "Failed to post update."));
    } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout><p className="text-brand-brown">Loading…</p></AdminLayout>;
  if (!fund) return null;

  const goal = fund.goals?.[0];
  const pct = fundingProgress(goal?.amountRaised || 0, goal?.targetAmount || 0);

  return (
    <AdminLayout>
      <div className="max-w-3xl">

        {/* Back */}
        <button onClick={() => navigate("/admin/projects")}
          className="bg-transparent border-none text-brand-orange font-semibold cursor-pointer text-sm mb-5 p-0">
          ← Back to Funds
        </button>

        {/* Fund summary card */}
        <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 mb-7">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="font-serif text-xl font-bold text-brand-dark mb-1">{fund.name}</h1>
              <p className="text-sm text-brand-brown leading-relaxed">{fund.mission}</p>
            </div>
            <button onClick={() => navigate(`/project/${id}`)}
              className="px-4 py-2 bg-brand-warm text-brand-orange border border-orange-200/50 rounded-lg text-xs font-semibold cursor-pointer shrink-0">
              View Live →
            </button>
          </div>
          {goal && (
            <>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>LKR {goal.amountRaised.toLocaleString()} raised of LKR {goal.targetAmount.toLocaleString()}</span>
                <span>{pct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-orange to-brand-amber rounded-full"
                  style={{ width: `${pct}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Post update form */}
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-dark mb-4">Post Update</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-gray-100">
              <label className="form-label">Update Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Phase 1 complete" className="form-input mb-3.5" />

              <label className="form-label">Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe what was accomplished…" rows={4}
                className="form-input mb-3.5 resize-y" />

              <label className="form-label">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="form-input mb-3.5">
                <option value="started">Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <label className="form-label">Images (optional)</label>

<input
  id="updateImagesInput"
  type="file"
  multiple
  accept="image/*"
  onChange={handleImagesChange}
  style={{ display: "none" }}
/>

  {imagePreviews.length === 0 ? (
      <button
        type="button"
        onClick={() => document.getElementById("updateImagesInput").click()}
        className="flex items-center gap-2 px-4 py-2 mb-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 text-sm font-medium cursor-pointer"
      >
        Add Image
      </button>
    ) : (
      <div className="mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => document.getElementById("updateImagesInput").click()}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 text-xs font-medium cursor-pointer"
            > 
              Change Photo
            </button>
            <button
              type="button"
              onClick={() => { setImagePreviews([]); setImages([]); }}
              className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-medium cursor-pointer"
            >
              Remove Photo
            </button>
          </div>
        </div>
        )}

              {message === "success" && <div className="alert-success mb-3">✅ Posted successfully!</div>}
              {message.startsWith("error:") && <div className="alert-error mb-3">❌ {message.replace("error:", "")}</div>}

              <button type="submit" disabled={saving}
                className={`btn-orange w-full py-3 ${saving ? "opacity-70 cursor-not-allowed" : ""}`}>
                {saving ? "Posting…" : "Post Update"}
              </button>
            </form>
          </div>

          {/* Posted updates */}
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-dark mb-4">
              Posted Updates ({fund.transparencyUpdates?.length || 0})
            </h2>
            {!fund.transparencyUpdates?.length ? (
              <div className="bg-white rounded-2xl p-7 border border-gray-100 text-center text-gray-400 text-sm">
                No updates yet. Post your first one!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[...fund.transparencyUpdates].reverse().map(u => (
                  <div key={u._id} className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-brand-dark text-sm">{u.title}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ml-2 ${STATUS_CLS[u.status] || "bg-gray-100 text-gray-700"}`}>
                        {u.status}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-brand-brown leading-relaxed mb-2">{u.description}</p>
                    {u.images?.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-2">
                        {u.images.map((img, i) => (
                          <img key={i} src={getImageUrl(img)} alt={`Update image ${i + 1}`}
                            className="w-16 h-12 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400">{new Date(u.publishedAt).toLocaleDateString()}</div>
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

export default AdminProjectUpdatePage;