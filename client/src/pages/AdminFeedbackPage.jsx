import { useEffect, useState } from "react";
import api from "../services/api";
import { avgRating } from "../utils";
import AdminLayout from "../components/AdminLayout";

function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/feedback/admin/all")
      .then(res => setFeedback(res.data.feedback || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      setFeedback(prev => prev.filter(f => f._id !== id));
    } catch { alert("Delete failed"); }
  };

  const filtered = filter === "all" ? feedback : feedback.filter(f => f.rating === Number(filter));
  const avg = avgRating(feedback) ?? "—";
  const dist = [5, 4, 3, 2, 1].map(r => ({ r, count: feedback.filter(f => f.rating === r).length }));

  const statCards = [
    { label: "Total Reviews", value: feedback.length, icon: "💬" },
    { label: "Avg Rating", value: avg !== "—" ? `${avg} ★` : "—", icon: "⭐" },
    { label: "5-Star Reviews", value: dist[0].count, icon: "🌟" },
    { label: "Funds Reviewed", value: new Set(feedback.map(f => f.charity?._id)).size, icon: "📁" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold text-brand-dark mb-1">Reviews</h1>
      <p className="text-brand-brown text-sm mb-7">All user reviews across all funds.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-card text-center">
            <div className="text-xl mb-1.5">{s.icon}</div>
            <div className="font-serif text-xl font-bold text-brand-orange">{s.value}</div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rating distribution */}
      <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
        <h3 className="text-sm font-bold text-brand-dark mb-3.5">Rating Distribution</h3>
        {dist.map(({ r, count }) => (
          <div key={r} className="flex items-center gap-2.5 mb-2">
            <span className="w-7 text-sm text-brand-orange font-bold">{r}★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-orange to-brand-amber rounded-full transition-all duration-500"
                style={{ width: feedback.length ? `${(count / feedback.length) * 100}%` : "0%" }}
              />
            </div>
            <span className="w-6 text-xs text-gray-400 text-right">{count}</span>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        {["all", "5", "4", "3", "2", "1"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={[
              "px-3.5 py-1.5 rounded-lg border font-semibold text-sm cursor-pointer transition-colors",
              filter === f
                ? "border-brand-orange bg-brand-warm text-brand-orange"
                : "border-gray-200 bg-white text-gray-500",
            ].join(" ")}>
            {f === "all" ? "All" : `${f}★`}
          </button>
        ))}
      </div>

      {/* Review list */}
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400">No reviews found.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(f => (
            <div key={f._id} className="bg-white rounded-2xl p-5 shadow-card flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-white font-bold text-sm shrink-0">
                {f.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-bold text-brand-dark text-sm">{f.user?.name || "Unknown"}</span>
                    <span className="text-xs text-gray-400 ml-2">{f.user?.email}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-brand-orange text-sm">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span>
                    <button onClick={() => handleDelete(f._id)} className="btn-danger px-2.5 py-1 text-xs">Delete</button>
                  </div>
                </div>
                <p className="text-xs text-brand-orange mb-1.5">📁 {f.charity?.name || "Unknown fund"}</p>
                <p className="text-[13.5px] text-gray-700 leading-relaxed">{f.comment}</p>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {new Date(f.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminFeedbackPage;