import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

const QUICK_LINKS = [
  { label: "Create Fund", icon: "➕", to: "/admin/projects", color: "#f97316" },
  { label: "Manage Users", icon: "👥", to: "/admin/users", color: "#3b82f6" },
  { label: "Add Category", icon: "📂", to: "/admin/categories", color: "#8b5cf6" },
  { label: "View Reviews", icon: "📝", to: "/admin/feedback", color: "#10b981" },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topFunds, setTopFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/donations/stats"),
      api.get("/donations/transparency"),
    ])
      .then(([s, t]) => {
        setStats(s.data);
        setTopFunds((t.data.summary || []).slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Raised", value: `LKR ${(stats?.totalRaised   || 0).toLocaleString()}`, icon: "💰", color: "#f97316" },
    { label: "Total Donors", value: (stats?.totalDonors    || 0).toLocaleString(), icon: "👥", color: "#3b82f6" },
    { label: "Donations Made", value: (stats?.totalDonations || 0).toLocaleString(), icon: "🧾", color: "#8b5cf6" },
    { label: "Active Funds", value: (stats?.totalFunds  || 0).toLocaleString(), icon: "🌟", color: "#10b981" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-1">Dashboard</h1>
        <p className="text-brand-brown text-sm mb-8">Platform overview and quick actions.</p>

        {loading ? (
          <p className="text-brand-brown text-center py-10">Loading stats…</p>
        ) : (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {statCards.map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-serif text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <h2 className="text-base font-bold text-brand-dark mb-3.5">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {QUICK_LINKS.map(q => (
            <button key={q.label} onClick={() => navigate(q.to)}
              className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer text-center shadow-card hover:-translate-y-0.5 hover:shadow-panel transition-all">
              <div className="text-3xl mb-2">{q.icon}</div>
              <div className="text-sm font-semibold text-gray-700">{q.label}</div>
            </button>
          ))}
        </div>

        {/* Top funded */}
        <h2 className="text-base font-bold text-brand-dark mb-3.5">Top Funded Funds</h2>
        {topFunds.length === 0 ? (
          <div className="bg-white rounded-2xl p-9 text-center text-gray-400 border border-gray-100">
            No donation data yet.{" "}
            <button onClick={() => navigate("/admin/projects")} className="text-brand-orange font-semibold cursor-pointer bg-transparent border-none">
              Create a fund
            </button>{" "}
            to get started.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {topFunds.map((fund, i) => {
              const goal = fund.goals?.[0];
              const pct = goal ? Math.min((goal.amountRaised / goal.targetAmount) * 100, 100) : 0;
              return (
                <div key={fund.charityId} className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex items-center gap-4">
                  <span className="font-serif text-xl font-bold text-gray-200 w-7 text-center">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div onClick={() => navigate(`/project/${fund.charityId}`)}
                      className="font-bold text-brand-dark text-sm mb-1 cursor-pointer truncate hover:text-brand-orange transition-colors">
                      {fund.charityName}
                    </div>
                    {goal && (
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                        <div className="h-full bg-gradient-to-r from-brand-orange to-brand-amber rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-lg font-bold text-brand-orange">LKR {fund.totalAmount.toLocaleString()}</div>
                    <div className="text-[11px] text-gray-400">{fund.donorCount} donors</div>
                  </div>
                  <button onClick={() => navigate(`/admin/projects/${fund.charityId}`)}
                    className="px-3.5 py-1.5 bg-brand-warm text-brand-orange border border-orange-200/50 rounded-lg font-semibold cursor-pointer text-xs shrink-0">
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

AdminDashboard.jsx