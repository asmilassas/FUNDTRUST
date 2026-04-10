// Platform-wide review explorer, Feedback is written on individual fund pages
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { avgRating } from "../utils";

function Stars({ value, size = 14 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= value ? "#f97316" : "#d1d5db", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/feedback/all")
      .then(res => setFeedback(res.data.feedback || []))
      .catch(() => setFeedback([]))
      .finally(() => setLoading(false));
  }, []);

  const avg = avgRating(feedback) ?? "0.0";
  const displayed = filter === "all" ? feedback : feedback.filter(f => f.rating === Number(filter));
  const dist = [5, 4, 3, 2, 1].map(r => ({
    r,
    count: feedback.filter(f => f.rating === r).length,
    pct: feedback.length
      ? Math.round(feedback.filter(f => f.rating === r).length / feedback.length * 100)
      : 0,
  }));

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <p className="text-brand-brown">Loading reviews…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-warm to-brand-bg border-b border-orange-100/40 px-6 py-14 text-center">
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand-orange mb-3">Community Reviews</p>
        <h1 className="font-serif text-4xl font-bold text-brand-dark mb-3">What Donors Are Saying</h1>
        <p className="text-brand-brown text-[15px] max-w-md mx-auto mb-8">
          Real reviews from real donors across all funds on FundTrust.
        </p>

        {/* Rating summary card */}
        <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-10 py-5 border border-orange-100/40 shadow-panel">
          <div className="text-center">
            <div className="font-serif text-4xl font-bold text-brand-orange">{avg}</div>
            <div className="text-lg text-brand-orange my-1">{"★".repeat(Math.round(parseFloat(avg)))}</div>
            <div className="text-xs text-gray-400">{feedback.length} reviews</div>
          </div>
          <div className="flex flex-col gap-1">
            {dist.map(({ r, count, pct }) => (
              <div key={r} className="flex items-center gap-2">
                <span className="text-xs text-brand-brown w-3">{r}</span>
                <span className="text-brand-orange text-xs">★</span>
                <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-orange to-brand-amber rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-5">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap mb-7">
          {["all", "5", "4", "3", "2", "1"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={[
                "px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition-all border",
                filter === f
                  ? "bg-brand-warm text-brand-orange border-brand-orange"
                  : "bg-white text-brand-brown border-orange-200/50",
              ].join(" ")}>
              {f === "all" ? "All" : `${f} ★`}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">
            {displayed.length} review{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* CTA banner */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-gradient-to-br from-brand-warm to-brand-bg rounded-2xl px-6 py-5 border border-orange-100/40 mb-7">
          <div>
            <p className="font-bold text-brand-dark mb-1">Have you donated to a fund?</p>
            <p className="text-sm text-brand-brown">Visit any fund page to leave your review.</p>
          </div>
          <button onClick={() => navigate("/")}
            className="btn-orange px-5 py-2.5 whitespace-nowrap">
            Browse Funds →
          </button>
        </div>

        {/* Review list */}
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">💬</div>
            <p>No reviews found for this filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {displayed.map(f => (
              <div key={f._id} className="bg-white rounded-2xl p-5 border border-orange-100/30 shadow-card">
                <div className="flex justify-between items-start mb-2.5 gap-3 flex-wrap">
                  <div>
                    <strong className="text-brand-dark text-[15px]">{f.user?.name || "Anonymous"}</strong>
                    {f.charity && (
                      <button onClick={() => navigate(`/project/${f.charity._id}`)}
                        className="ml-2.5 text-xs text-brand-orange font-semibold underline cursor-pointer bg-transparent border-none">
                        {f.charity.name}
                      </button>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(f.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <Stars value={f.rating} />
                </div>
                <p className="text-brand-brown text-sm leading-relaxed m-0">{f.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;