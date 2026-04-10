import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function DonationReceiptPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    api.get(`/donations/${id}/receipt`)
      .then(res => setDonation(res.data.donation))
      .catch(err => setError(err.response?.data?.message || "Could not load receipt"))
      .finally(() => setLoading(false));
  }, [id, user, authLoading]);

  if (authLoading || loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <p className="text-brand-brown">{authLoading ? "" : "Loading receipt…"}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate("/my-donations")}
          className="px-5 py-2.5 bg-brand-orange text-white rounded-xl cursor-pointer font-sans font-semibold">
          Back to My Donations
        </button>
      </div>
    </div>
  );

  if (!donation) return null;

  const receiptNumber = `RCPT-${new Date(donation.createdAt).toISOString().split("T")[0].replace(/-/g,"")}-${donation._id.slice(-6).toUpperCase()}`;
  const rows = [
    ["Receipt No.", receiptNumber],
    ["Date", new Date(donation.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
    ["Donor", user?.name  || "—"],
    ["Email", user?.email || "—"],
    ["Fund", donation.charity?.name || "Unknown"],
    ["Amount", `LKR ${donation.amount.toLocaleString()}`],
    ...(donation.message ? [["Message", `"${donation.message}"`]] : []),
  ];

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-card, .receipt-card * { visibility: visible; }
          .receipt-card { position: fixed; top: 0; left: 0; width: 100%; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .receipt-header { background: #1c0f00 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-brand-bg py-12 px-6 font-sans">
        <div className="max-w-[520px] mx-auto">
          <button onClick={() => navigate("/my-donations")}
            className="no-print text-brand-orange font-semibold text-sm mb-6 bg-transparent border-none cursor-pointer p-0">
            ← Back to My Donations
          </button>

          <div className="receipt-card bg-white rounded-[20px] overflow-hidden shadow-modal border border-brand-orange/10">
            <div className="receipt-header bg-brand-dark px-8 py-7 text-center">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-cream/45 mb-2">FundTrust</p>
              <h1 className="font-serif text-[22px] font-bold text-brand-cream mb-0.5">Donation Receipt</h1>
              <p className="text-xs text-brand-cream/40">Thank you for your generosity</p>
            </div>

            <div className="bg-brand-warm px-8 py-6 text-center border-b border-brand-orange/10">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-1.5">Amount Donated</p>
              <p className="font-serif text-[44px] font-bold text-brand-orange leading-none mb-1.5">
                LKR {donation.amount.toLocaleString()}
              </p>
              <p className="text-sm text-brand-brown">to <strong>{donation.charity?.name}</strong></p>
            </div>

            <div className="px-8 py-5">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between items-start py-2.5 border-b border-gray-50 gap-4 last:border-0">
                  <span className="text-[13px] text-gray-400 font-medium shrink-0">{k}</span>
                  <span className="text-[13px] text-brand-dark font-semibold text-right break-words">{v}</span>
                </div>
              ))}
            </div>

            <div className="px-8 py-4 pb-6 bg-gray-50 text-center">
              <p className="text-xs text-gray-400 leading-relaxed">
                This is an official confirmation of your donation made through FundTrust.
              </p>
            </div>
          </div>

          <div className="no-print flex gap-3 justify-center mt-6 flex-wrap">
            <button onClick={() => window.print()}
              className="px-6 py-3 bg-white text-gray-700 border-[1.5px] border-gray-200 rounded-xl font-semibold text-sm cursor-pointer font-sans">
              🖨️ Print Receipt
            </button>
            <button onClick={() => navigate(`/project/${donation.charity?._id}`)}
              className="px-6 py-3 bg-gradient-to-br from-brand-orange to-brand-burn text-white rounded-xl font-bold text-sm cursor-pointer font-sans">
              View Fund →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DonationReceiptPage;