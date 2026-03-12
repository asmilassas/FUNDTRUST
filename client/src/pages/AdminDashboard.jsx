import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function RejectModal({ onConfirm, onCancel }) {
  const [reason, setReason] = useState("");

  return (
    <div className="ad-modal-overlay" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ad-modal-title">Reject Donation</h3>
        <p className="ad-modal-sub">
          Please provide a reason for rejection. This will be shared with the donor.
        </p>

        <textarea
          className="ad-modal-textarea"
          placeholder="Enter rejection reason…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />

        <div className="ad-modal-actions">
          <button className="ad-modal-cancel" onClick={onCancel}>
            Cancel
          </button>

          <button
            className="ad-modal-confirm"
            onClick={() => reason.trim() && onConfirm(reason)}
            disabled={!reason.trim()}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchPending();
  }, [navigate]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/donations/admin/pending");
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Error fetching pending donations", err);
    } finally {
      setLoading(false);
    }
  };

  const setLoading1 = (id, val) =>
    setActionLoading((prev) => ({ ...prev, [id]: val }));

  const approveDonation = async (id) => {
    setLoading1(id, true);
    try {
      await api.put(`/donations/${id}/approve`);
      fetchPending();
    } catch (err) {
      console.error("Approval failed", err);
    } finally {
      setLoading1(id, false);
    }
  };

  const rejectDonation = async (id, reason) => {
    setLoading1(id, true);
    setRejectTarget(null);

    try {
      await api.put(`/donations/${id}/reject`, { reason });
      fetchPending();
    } catch (err) {
      console.error("Rejection failed", err);
    } finally {
      setLoading1(id, false);
    }
  };

  return (
    <AdminLayout>
      <style>{styles}</style>

      {rejectTarget && (
        <RejectModal
          onConfirm={(reason) => rejectDonation(rejectTarget, reason)}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {/* Page header */}
      <div className="ad-page-header">
        <div>
          <p className="ad-page-eyebrow">Admin Panel</p>
          <h1 className="ad-page-title">Pending Donations</h1>
          <p className="ad-page-sub">
            Review and approve bank transfer receipts submitted by donors.
          </p>
        </div>

        <button
          className="ad-manage-btn"
          onClick={() => navigate("/admin/projects")}
        >
          📁 Manage Projects
        </button>
      </div>

      {/* Stats */}
      <div className="ad-stats-strip">
        <div className="ad-stat">
          <span className="ad-stat-val">{donations.length}</span>
          <span className="ad-stat-lbl">Pending</span>
        </div>

        <div className="ad-stat-divider" />

        <div className="ad-stat">
          <span className="ad-stat-val">
            ${donations.reduce((s, d) => s + (d.amount || 0), 0).toLocaleString()}
          </span>
          <span className="ad-stat-lbl">Total Awaiting</span>
        </div>

        <div className="ad-stat-divider" />

        <div className="ad-stat">
          <span className="ad-stat-val">
            {new Set(donations.map((d) => d.charity?._id)).size}
          </span>
          <span className="ad-stat-lbl">Charities Involved</span>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : donations.length === 0 ? (
        <div className="ad-empty">
          <div className="ad-empty-icon">🎉</div>
          <h3 className="ad-empty-title">All caught up!</h3>
          <p className="ad-empty-sub">
            No pending bank donations to review right now.
          </p>
        </div>
      ) : (
        <div className="ad-list">
          {donations.map((donation) => (
            <div key={donation._id} className="ad-card">

              <div className="ad-card-header">
                <div className="ad-donor-avatar">
                  {(donation.user?.name || "?").charAt(0).toUpperCase()}
                </div>

                <div className="ad-donor-info">
                  <span className="ad-donor-name">
                    {donation.user?.name || "Unknown"}
                  </span>
                  <span className="ad-donor-email">
                    {donation.user?.email}
                  </span>
                </div>

                <div className="ad-amount-badge">
                  ${Number(donation.amount).toLocaleString()}
                </div>
              </div>

              <div className="ad-card-divider" />

              <div className="ad-details-row">
                <div className="ad-detail">
                  <span className="ad-detail-lbl">Charity</span>
                  <span className="ad-detail-val">
                    {donation.charity?.name || "—"}
                  </span>
                </div>

                <div className="ad-detail">
                  <span className="ad-detail-lbl">Method</span>
                  <span className="ad-detail-val">🏦 Bank Transfer</span>
                </div>

                <div className="ad-detail">
                  <span className="ad-detail-lbl">Status</span>
                  <span className="ad-pending-badge">⏳ Pending Review</span>
                </div>
              </div>

              {donation.receiptImage && (
                <div className="ad-receipt-wrap">
                  <p className="ad-receipt-lbl">Receipt Image</p>

                  <img
                    src={`http://localhost:5000/uploads/${donation.receiptImage}`}
                    alt="Receipt"
                    className="ad-receipt-img"
                  />
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="ad-actions">
                <button
                  className="ad-btn ad-btn--approve"
                  onClick={() => approveDonation(donation._id)}
                  disabled={actionLoading[donation._id]}
                >
                  {actionLoading[donation._id] ? "…" : "✔ Approve"}
                </button>

                <button
                  className="ad-btn ad-btn--reject"
                  onClick={() => setRejectTarget(donation._id)}
                  disabled={actionLoading[donation._id]}
                >
                  ✕ Reject
                </button>

                <button
                  className="ad-btn ad-btn--view"
                  onClick={() =>
                    navigate(`/project/${donation.charity?._id}`)
                  }
                >
                  🔍 View Project
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy:       #0f1f3d;
    --navy-mid:   #1a3260;
    --navy-light: #f5eddc;
    --gold:       #c9963a;
    --gold-deep:  #a87628;
    --gold-light: #fdf5e6;
    --gold-pale:  rgba(201,150,58,0.1);
    --ink:        #0a1628;
    --muted:      #4e6080;
    --surface:    #fdf8f0;
    --card:       #fffef9;
    --border:     rgba(15,31,61,0.09);
    --shadow-md:  0 8px 36px rgba(15,31,61,0.1);
    --shadow-lg:  0 20px 64px rgba(15,31,61,0.13);
    --green:      #166534;
    --green-bg:   rgba(22,101,52,0.09);
    --green-border: rgba(22,101,52,0.22);
    --red:        #991b1b;
    --red-bg:     rgba(153,27,27,0.07);
    --red-border: rgba(153,27,27,0.18);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ══ PAGE HEADER ══ */
  .ad-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }

  .ad-page-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }

  .ad-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.3px;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .ad-page-sub {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.6;
    max-width: 420px;
  }

  .ad-manage-btn {
    padding: 11px 22px;
    background: var(--navy);
    color: white;
    border: none;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.18s, box-shadow 0.18s;
    box-shadow: 0 2px 12px rgba(15,31,61,0.18);
    flex-shrink: 0;
  }

  .ad-manage-btn:hover { background: var(--navy-mid); box-shadow: 0 6px 20px rgba(15,31,61,0.24); }

  /* ══ STATS STRIP ══ */
  .ad-stats-strip {
    display: flex;
    align-items: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 32px;
    gap: 0;
    margin-bottom: 32px;
    box-shadow: var(--shadow-md);
    flex-wrap: wrap;
  }

  .ad-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 4px 16px;
  }

  .ad-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }

  .ad-stat-lbl {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .ad-stat-divider {
    width: 1px;
    height: 36px;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ══ LIST ══ */
  .ad-list { display: flex; flex-direction: column; gap: 20px; }

  /* ══ DONATION CARD ══ */
  .ad-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 28px 32px;
    box-shadow: var(--shadow-md);
    animation: ad-fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes ad-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Card header */
  .ad-card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .ad-donor-avatar {
    width: 46px; height: 46px;
    border-radius: 12px;
    background: var(--navy);
    color: var(--gold);
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .ad-donor-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .ad-donor-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }

  .ad-donor-email {
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
  }

  .ad-amount-badge {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--green);
    background: var(--green-bg);
    border: 1px solid var(--green-border);
    border-radius: 10px;
    padding: 6px 18px;
    line-height: 1.2;
  }

  .ad-card-divider {
    width: 100%;
    height: 1px;
    background: var(--border);
    margin-bottom: 20px;
  }

  /* Details row */
  .ad-details-row {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .ad-detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ad-detail-lbl {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .ad-detail-val {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
  }

  .ad-pending-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 700;
    color: #92400e;
    background: rgba(146,64,14,0.08);
    border: 1px solid rgba(146,64,14,0.2);
    border-radius: 50px;
    padding: 3px 10px;
    letter-spacing: 0.04em;
  }

  /* Receipt */
  .ad-receipt-wrap {
    margin-bottom: 20px;
  }

  .ad-receipt-lbl {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .ad-receipt-img {
    width: 220px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid var(--border);
    display: block;
    cursor: zoom-in;
    transition: box-shadow 0.18s;
  }

  .ad-receipt-img:hover { box-shadow: var(--shadow-lg); }

  /* ══ ACTION BUTTONS ══ */
  .ad-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding-top: 4px;
  }

  .ad-btn {
    padding: 9px 18px;
    border: none;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }

  .ad-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .ad-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ad-btn--approve {
    background: var(--green-bg);
    color: var(--green);
    border: 1.5px solid var(--green-border);
  }

  .ad-btn--approve:hover:not(:disabled) {
    background: rgba(22,101,52,0.14);
    box-shadow: 0 4px 14px rgba(22,101,52,0.15);
  }

  .ad-btn--reject {
    background: var(--red-bg);
    color: var(--red);
    border: 1.5px solid var(--red-border);
  }

  .ad-btn--reject:hover:not(:disabled) {
    background: rgba(153,27,27,0.12);
    box-shadow: 0 4px 14px rgba(153,27,27,0.15);
  }

  .ad-btn--view {
    background: var(--gold-pale);
    color: var(--gold-deep);
    border: 1.5px solid rgba(201,150,58,0.22);
  }

  .ad-btn--view:hover:not(:disabled) {
    background: var(--gold-light);
    box-shadow: 0 4px 14px rgba(201,150,58,0.15);
  }

  .ad-btn--update {
    background: var(--surface);
    color: var(--muted);
    border: 1.5px solid var(--border);
  }

  .ad-btn--update:hover:not(:disabled) {
    border-color: var(--navy);
    color: var(--navy);
    background: rgba(15,31,61,0.04);
  }

  /* ══ EMPTY STATE ══ */
  .ad-empty {
    text-align: center;
    padding: 80px 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: var(--shadow-md);
  }

  .ad-empty-icon  { font-size: 48px; margin-bottom: 16px; }

  .ad-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
  }

  .ad-empty-sub {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.65;
  }

  /* ══ SKELETON ══ */
  .ad-skeleton-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 28px 32px;
  }

  .ad-skeleton {
    background: linear-gradient(90deg, #f5eddc 25%, #fdf8f0 50%, #f5eddc 75%);
    background-size: 200% 100%;
    animation: ad-shimmer 1.5s infinite;
    border-radius: 6px;
    display: block;
  }

  @keyframes ad-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ══ REJECT MODAL ══ */
  .ad-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(8,15,30,0.6);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ad-fadeIn 0.2s ease;
  }

  @keyframes ad-fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .ad-modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px;
    width: 100%;
    max-width: 460px;
    box-shadow: var(--shadow-lg);
    animation: ad-scaleIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes ad-scaleIn {
    from { transform: scale(0.93); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }

  .ad-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
  }

  .ad-modal-sub {
    font-size: 14px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.65;
    margin-bottom: 20px;
  }

  .ad-modal-textarea {
    width: 100%;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    outline: none;
    resize: vertical;
    min-height: 100px;
    line-height: 1.65;
    transition: border-color 0.18s, box-shadow 0.18s;
    margin-bottom: 20px;
  }

  .ad-modal-textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,150,58,0.1);
  }

  .ad-modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .ad-modal-cancel {
    padding: 10px 20px;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s, color 0.15s;
  }

  .ad-modal-cancel:hover { border-color: var(--navy); color: var(--navy); }

  .ad-modal-confirm {
    padding: 10px 20px;
    background: var(--red);
    border: none;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
  }

  .ad-modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
  .ad-modal-confirm:hover:not(:disabled) { opacity: 0.88; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 700px) {
    .ad-card { padding: 20px; }
    .ad-stats-strip { padding: 16px; gap: 8px; }
    .ad-details-row { gap: 16px; }
    .ad-modal { padding: 24px; margin: 16px; }
    .ad-page-header { flex-direction: column; align-items: flex-start; }
  }
`;

export default AdminDashboard;