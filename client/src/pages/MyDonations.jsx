import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0, charities: 0 });
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    api.get("/donations/me")
      .then(res => {
        const list = res.data.donations || [];
        setDonations(list);
        const charitySet = new Set(list.map(d => d.charity?._id).filter(Boolean));
        setStats({ total: list.reduce((s, d) => s + d.amount, 0), count: list.length, charities: charitySet.size });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  if (authLoading) return null;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <p className="text-brand-brown">Loading your donations…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-6 font-sans">
      <div className="max-w-[760px] mx-auto">
        <h1 className="font-serif text-4xl font-bold text-brand-dark mb-1.5">My Donations</h1>
        <p className="text-brand-brown text-sm mb-8">Your giving history and impact overview.</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-9">
          {[
            { label: "Total Donated",   value: `LKR ${stats.total.toLocaleString()}`, icon: "💰" },
            { label: "Donations Made",  value: stats.count, icon: "🧾" },
            { label: "Funds Supported", value: stats.charities, icon: "🌟" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[18px] p-5 border border-brand-orange/10 text-center shadow-card">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-serif text-[22px] font-bold text-brand-burn mb-1">{s.value}</div>
              <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        {donations.length === 0 ? (
          <div className="bg-white rounded-[20px] p-15 text-center border border-brand-orange/10" style={{padding:60}}>
            <div className="text-5xl mb-4">💛</div>
            <h3 className="font-serif text-brand-dark mb-2">No donations yet</h3>
            <p className="text-brand-brown mb-6">Start giving today and track your impact here.</p>
            <button onClick={() => navigate("/")}
              className="px-7 py-3 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl cursor-pointer font-sans">
              Browse Funds
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {donations.map(d => (
              <div key={d._id} className="bg-white rounded-2xl px-[22px] py-[18px] border border-brand-orange/8 shadow-card flex justify-between items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[160px]">
                  <div className="font-bold text-brand-dark text-[15px] mb-0.5">{d.charity?.name || "Unknown fund"}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(d.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-3.5 shrink-0">
                  <span className="font-serif text-[20px] font-bold text-brand-burn">LKR {d.amount.toLocaleString()}</span>
                  <button onClick={() => navigate(`/donations/${d._id}/receipt`)}
                    className="px-3.5 py-1.5 bg-white border-[1.5px] border-brand-orange/20 rounded-[9px] text-brand-orange text-xs font-bold cursor-pointer font-sans">
                    Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyDonations;