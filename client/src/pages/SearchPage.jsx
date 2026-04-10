import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { fundingProgress } from "../utils";

const IMG_BASE = "http://localhost:5000/uploads/";

// Chip button used to filter categories
function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={[
        "px-4 py-1.5 rounded-full font-semibold text-sm cursor-pointer border transition-all",
        active
          ? "bg-brand-orange text-white border-brand-orange"
          : "bg-white text-brand-brown border-orange-200/50 hover:border-brand-orange/40",
      ].join(" ")}>
      {children}
    </button>
  );
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "24" });
    if (q) params.set("search", q);
    if (selectedCat) params.set("category", selectedCat);
    api.get(`/charities?${params}`)
      .then(res => setResults(res.data.charities || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q, selectedCat]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* Search header */}
      <div className="bg-gradient-to-br from-brand-warm to-brand-bg border-b border-orange-100/40 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-5">
            {q ? `Results for "${q}"` : "Browse All Funds"}
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2.5">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search funds…"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none font-sans focus:border-brand-orange transition-colors" />
            </div>
            <button type="submit" className="btn-orange px-6 py-3">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <FilterChip active={!selectedCat} onClick={() => setSelectedCat("")}>All</FilterChip>
            {categories.map(cat => (
              <FilterChip
                key={cat._id}
                active={selectedCat === cat._id}
                onClick={() => setSelectedCat(cat._id === selectedCat ? "" : cat._id)}>
                {cat.name}
              </FilterChip>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-brand-brown">Searching…</div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-orange-100/40">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-serif text-brand-dark mb-2">No funds found</h3>
            <p className="text-brand-brown mb-6">
              {q ? `No results for "${q}". Try a different search term.` : "No funds available yet."}
            </p>
            <button
              onClick={() => { setQuery(""); setSearchParams({}); setSelectedCat(""); }}
              className="px-6 py-2.5 bg-white text-brand-orange border border-orange-300/50 rounded-xl font-semibold cursor-pointer">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-5">
              {results.length} fund{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {results.map(p => {
                const goal    = p.goals?.[0];
                const pct     = fundingProgress(goal?.amountRaised || 0, goal?.targetAmount || 0);
                const funded  = goal && goal.amountRaised >= goal.targetAmount;
                return (
                  <div key={p._id} onClick={() => navigate(`/project/${p._id}`)}
                    className="bg-white rounded-2xl border border-orange-100/40 overflow-hidden cursor-pointer shadow-card hover:-translate-y-1 hover:shadow-panel transition-all">
                    {p.coverImage ? (
                      <img src={`${IMG_BASE}${p.coverImage}`} alt={p.name} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-28 bg-gradient-to-br from-brand-warm to-orange-100 flex items-center justify-center text-4xl">❤️</div>
                    )}
                    <div className="p-5">
                      {p.category && (
                        <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">{p.category.name}</span>
                      )}
                      <h3 className="font-serif text-base font-bold text-brand-dark mt-1.5 mb-2 leading-snug">{p.name}</h3>
                      <p className="text-sm text-brand-brown leading-relaxed mb-3.5 line-clamp-2">{p.mission}</p>
                      {goal && (
                        <div className="mb-3">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${funded ? "bg-gradient-to-r from-green-400 to-emerald-400" : "bg-gradient-to-r from-brand-orange to-brand-amber"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5 text-[11.5px] text-gray-400">
                            <span>LKR {goal.amountRaised.toLocaleString()} raised</span>
                            <span>{funded ? "🎉 Funded" : `${pct.toFixed(0)}%`}</span>
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
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;