import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { fundingProgress } from "../utils";

const IMG_BASE = "http://localhost:5000/uploads/";

const STATUS_CLS = {
  completed: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
};

function TransparencyPage() {
  const [summary, setSummary] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/donations/transparency"), api.get("/donations/stats")])
      .then(([t, s]) => { setSummary(t.data.summary || []); setStats(s.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalUpdates = summary.reduce((acc, c) => acc + (c.transparencyUpdates?.length || 0), 0);

  const platformStats = [
    {label: "Total Raised", value: `LKR ${(stats?.totalRaised || 0).toLocaleString()}` },
    {label: "Total Donors", value: (stats?.totalDonors || 0).toLocaleString() },
    {label: "Funds", value: (stats?.totalFunds || 0).toLocaleString() },
    {label: "Updates Posted", value: totalUpdates.toLocaleString() },
  ];

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <p className="text-brand-brown">Loading transparency report…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* Dark hero */}
      <div className="bg-gradient-to-br from-brand-dark to-brand-darker px-6 py-16 text-center">
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-brand-orange mb-3">Transparency Report</p>
        <h1 className="font-serif font-bold text-brand-cream mb-4" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
          Where Every Rupee Goes
        </h1>
        <p className="text-white/60 text-base max-w-lg mx-auto mb-12">
          Full accountability on every donation made through FundTrust — every fund, every rupee, every update.
        </p>

        {/* Statistics */}
        <div className="inline-grid grid-cols-4 bg-white/[0.06] rounded-2xl overflow-hidden border border-white/10">
          {platformStats.map((s, i) => (
            <div key={s.label} className={`px-9 py-6 text-center ${i > 0 ? "border-l border-white/[0.08]" : ""}`}>
              <div className="font-serif text-3xl font-bold text-brand-orange mb-1">{s.value}</div>
              <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fund breakdown */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="font-serif text-2xl font-bold text-brand-dark mb-1.5">Fund Breakdown</h2>
        <p className="text-brand-brown text-sm mb-8">Live donation totals and updates for every active fund.</p>

        {summary.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-orange-100/40">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="font-serif text-brand-dark mb-2">No donations yet</h3>
            <p className="text-brand-brown mb-6">Be the first to support a fund!</p>
            <button onClick={() => navigate("/")} className="btn-orange px-7 py-3">Browse Funds</button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {summary.map(item => {
              const goal = item.goals?.[0];
              const pct  = fundingProgress(goal?.amountRaised || 0, goal?.targetAmount || 0);
              return (
                <div key={item.charityId} className="bg-white rounded-2xl border border-orange-100/40 overflow-hidden shadow-card">

                  {/* Fund header */}
                  <div className="px-7 py-6 border-b border-orange-50">
                    <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
                      <div className="flex-1">
                        <h3 onClick={() => navigate(`/project/${item.charityId}`)}
                          className="font-serif text-xl font-bold text-brand-dark mb-1.5 cursor-pointer underline underline-offset-2 decoration-orange-300/50 hover:text-brand-orange transition-colors">
                          {item.charityName}
                        </h3>
                        <p className="text-brand-brown text-[13.5px] leading-relaxed max-w-xl">{item.mission}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-serif text-2xl font-bold text-brand-orange">LKR {item.totalAmount.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.donorCount} donors · {item.donationCount} donations</div>
                      </div>
                    </div>
                    {goal && (
                      <>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>LKR {goal.amountRaised.toLocaleString()} raised</span>
                          <span>Goal: LKR {goal.targetAmount.toLocaleString()} · {pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-orange to-brand-amber rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Transparency updates */}
                  {item.transparencyUpdates?.length > 0 ? (
                    <div className="px-7 py-5">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3.5">
                        Fund Updates ({item.transparencyUpdates.length})
                      </p>
                      <div className="flex flex-col gap-3">
                        {[...item.transparencyUpdates].reverse().slice(0, 3).map(u => (
                          <div key={u._id} className="flex gap-3.5 items-start">
                            <span className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_CLS[u.status] || "bg-gray-100 text-gray-700"}`}>
                              {u.status}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-brand-dark text-sm mb-0.5">{u.title}</div>
                              <div className="text-sm text-brand-brown leading-relaxed">{u.description}</div>
                              {u.images?.length > 0 && (
                                <div className="flex gap-2 mt-2.5 flex-wrap">
                                  {u.images.map((img, i) => (
                                    <img key={i} src={`${IMG_BASE}${img}`} alt="update"
                                      className="w-20 h-14 object-cover rounded-lg" />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 shrink-0">{new Date(u.publishedAt).toLocaleDateString()}</div>
                          </div>
                        ))}
                        {item.transparencyUpdates.length > 3 && (
                          <button onClick={() => navigate(`/project/${item.charityId}`)}
                            className="self-start px-3.5 py-1.5 bg-brand-warm text-brand-orange border border-orange-200/50 rounded-lg text-xs font-semibold cursor-pointer">
                            View all {item.transparencyUpdates.length} updates →
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="px-7 py-3.5 text-sm text-gray-400">No updates posted yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransparencyPage;