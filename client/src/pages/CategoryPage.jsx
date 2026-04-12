import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { fundingProgress } from "../utils";
import { getImageUrl } from "../utils";

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [funds, setFunds] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFunds = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/charities?category=${id}&page=${p}&limit=9`);
      const list = res.data.charities || [];
      setFunds(list);
      setTotalPages(res.data.totalPages || 1);
      if (list.length > 0) setCategoryName(list[0].category?.name || "Funds");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(1); fetchFunds(1); }, [id]);

  const changePage = (next) => { setPage(next); fetchFunds(next); };

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-warm to-brand-bg border-b border-orange-100/40 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/")}
            className="bg-transparent border-none text-brand-orange font-semibold cursor-pointer text-sm mb-4 p-0">
            ← Back to Home
          </button>
          <h1 className="font-serif text-4xl font-bold text-brand-dark mb-2">
            {categoryName || "Funds"}
          </h1>
          <p className="text-brand-brown text-[15px]">
            {loading ? "Loading funds…" : `${funds.length > 0 ? `${funds.length} fund${funds.length !== 1 ? "s" : ""}` : "No funds"} in this category`}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-72 border border-orange-100/30 animate-pulse" />
            ))}
          </div>
        ) : funds.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-orange-100/40">
            <div className="text-5xl mb-4">🌻</div>
            <h3 className="font-serif text-brand-dark mb-2">No funds yet</h3>
            <p className="text-brand-brown mb-6">Nothing in this category yet. Check back soon!</p>
            <button onClick={() => navigate("/")} className="btn-orange px-6 py-3">
              Explore Other Categories
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
              {funds.map(p => {
                const goal   = p.goals?.[0];
                const pct    = fundingProgress(goal?.amountRaised || 0, goal?.targetAmount || 0);
                const funded = goal && goal.amountRaised >= goal.targetAmount;
                return (
                  <div key={p._id} onClick={() => navigate(`/project/${p._id}`)}
                    className="bg-white rounded-2xl border border-orange-100/40 overflow-hidden cursor-pointer shadow-card hover:-translate-y-1 hover:shadow-panel transition-all">
                    {p.coverImage ? (
                      <img src={getImageUrl(p.coverImage)} alt={p.name} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="h-28 bg-gradient-to-br from-brand-warm to-orange-100 flex items-center justify-center text-4xl">❤️</div>
                    )}
                    <div className="p-5">
                      <h3 className="font-serif text-base font-bold text-brand-dark mb-1.5 leading-snug">{p.name}</h3>
                      <p className="text-sm text-brand-brown leading-relaxed mb-3.5 line-clamp-2">{p.mission}</p>
                      {goal && (
                        <div className="mb-3">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${funded ? "bg-gradient-to-r from-green-400 to-emerald-400" : "bg-gradient-to-r from-brand-orange to-brand-amber"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5 text-[11.5px] text-gray-400">
                            <span>LKR {goal.amountRaised.toLocaleString()} raised</span>
                            <span>{funded ? "🎉 Fully Funded" : `${pct.toFixed(0)}%`}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>👥 {p.donorCount || 0} donors</span>
                        <span className="text-brand-orange font-bold">Donate →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-9">
                <button disabled={page === 1} onClick={() => changePage(page - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold disabled:text-gray-300 disabled:cursor-default cursor-pointer">
                  ← Prev
                </button>
                <span className="px-4 py-2 text-sm text-brand-brown font-semibold">
                  {page} / {totalPages}
                </span>
                <button disabled={page === totalPages} onClick={() => changePage(page + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold disabled:text-gray-300 disabled:cursor-default cursor-pointer">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;