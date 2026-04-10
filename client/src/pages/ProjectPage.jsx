import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../services/api";
import { validateDonationAmount, fundingProgress, avgRating } from "../utils";
import { AuthContext } from "../context/AuthContext";

// Initialise Stripe 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#111827",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#dc2626" },
  },
};

const IMG_BASE = "http://localhost:5000/uploads/";

// Payment Modal 
function PaymentModal({ project, onClose, onSuccess }) {
  const [step, setStep] = useState("amount");
  const [amount, setAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState("");

  const goal = project.goals?.[0];
  const remaining = goal ? goal.targetAmount - goal.amountRaised : Infinity;

  const handleAmountNext = () => {
    setError("");
    const { valid, error: err } = validateDonationAmount(amount, remaining);
    if (!valid) { setError(err); return; }
    setStep("paying");
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: "#f97316", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {step === "success" ? "Complete" : `Step ${step === "amount" ? 1 : 2} of 2`}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c0f00", margin: 0 }}>
              {step === "amount" ? "Choose Amount" : step === "paying" ? "Pay with Card" : "🎉 Thank You!"}
            </h2>
          </div>
          {step !== "success" && (
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
          )}
        </div>

        {/* Progress bar */}
        {step !== "success" && (
          <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, marginBottom: 24 }}>
            <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#f97316,#fbbf24)", width: step === "amount" ? "50%" : "100%", transition: "width 0.3s" }} />
          </div>
        )}

        {/* Enter amount */}
        {step === "amount" && (
          <div>
            <label style={lbl}>Donation Amount (LKR)</label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#78583a", fontWeight: 600, fontSize: 11 }}>LKR</span>
              <input
                type="number" min="1" value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                style={{ ...inp, paddingLeft: 48 }}
              />
            </div>

            {/* Quick-pick amounts */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[500, 1000, 2500, 5000].map(a => (
                <button key={a} onClick={() => setAmount(a)}
                  style={{ flex: 1, padding: "8px 0", border: `1.5px solid ${amount == a ? "#f97316" : "#e5e7eb"}`, borderRadius: 8, background: amount == a ? "#fff7ee" : "white", color: amount == a ? "#f97316" : "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                  {a.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Anonymous option */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Donate anonymously</div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                  Your name won't appear in the fund's donations list.
                </div>
              </div>
            </label>

            {error && <p style={errStyle}>{error}</p>}
            <button onClick={handleAmountNext} style={primaryBtn}>Continue to Payment →</button>
          </div>
        )}

        {/* Stripe card */}
        {step === "paying" && (
          <Elements stripe={stripePromise}>
            <StripeCardForm
              project={project}
              amount={Number(amount)}
              anonymous={anonymous}
              onSuccess={(d) => { setStep("success"); onSuccess(d); }}
              onBack={() => setStep("amount")}
            />
          </Elements>
        )}

        {/* Success */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1c0f00", marginBottom: 8 }}>Donation Successful!</h3>
            <p style={{ color: "#78583a", marginBottom: 6 }}>
              You donated <strong>LKR {Number(amount).toLocaleString()}</strong> to <strong>{project.name}</strong>.
            </p>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>Thank you for your generosity! 💛</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={onClose} style={primaryBtn}>Done</button>
              <button
                onClick={() => { onClose(); window.location.href = "/my-donations"; }}
                style={ghostBtn}>
                My Donations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stripe Card Form 
function StripeCardForm({ project, amount, anonymous, onSuccess, onBack }) {
  const { user }   = useContext(AuthContext);
  const stripe     = useStripe();   
  const elements   = useElements(); 
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return; // SDK not ready yet
    setError(""); setLoading(true);

    try {
      // Create PaymentIntent 
      const { data } = await api.post("/donations", {
        charityId: project._id,
        amount,
        anonymous,
      });
      const { clientSecret, donationId } = data;

      // Confirm the card payment
      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.name || "Donor" },
        },
      });

      if (stripeErr) {
        setError(stripeErr.message);
        return;
      }

      // Inform backend payment succeeded so it can update donation record
      const confirm = await api.post(`/donations/${donationId}/confirm`, {
        paymentIntentId: paymentIntent.id,
      });
      onSuccess(confirm.data.donation);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Summary */}
      <div style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 16px", marginBottom: 20, fontSize: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#6b7280" }}>Donating to</span>
          <span style={{ fontWeight: 600, color: "#1c0f00" }}>{project.name}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ color: "#6b7280" }}>Amount</span>
          <span style={{ fontWeight: 700, color: "#f97316", fontSize: 16 }}>LKR {amount.toLocaleString()}</span>
        </div>
        {anonymous && (
          <div style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>🕵️ Donating anonymously</div>
        )}
      </div>

      {/* CardElement */}
      <label style={lbl}>Card Details</label>
      <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px", marginBottom: 6, background: "white" }}>
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={e => setError(e.error?.message || "")} />
      </div>

      {error && <p style={{ ...errStyle, marginBottom: 14 }}>{error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={ghostBtn} disabled={loading}>← Back</button>
        <button
          onClick={handlePay}
          disabled={!stripe || loading}
          style={{ ...primaryBtn, flex: 1, opacity: (!stripe || loading) ? 0.7 : 1, cursor: (!stripe || loading) ? "not-allowed" : "pointer" }}>
          {loading ? "Processing…" : `Pay LKR ${amount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

/* Star Rating */
function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s}
          onClick={() => !readOnly && onChange && onChange(s)}
          onMouseEnter={() => !readOnly && setHovered(s)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{ fontSize: readOnly ? 16 : 24, cursor: readOnly ? "default" : "pointer", color: s <= (hovered || value) ? "#f97316" : "#d1d5db", transition: "color 0.15s" }}>
          ★
        </span>
      ))}
    </div>
  );
}

/* Main Page  */
function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [myFeedback, setMyFeedback] = useState(null);
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState("");
  const [fbLoading, setFbLoading] = useState(false);
  const [fbError, setFbError] = useState("");
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("about");

  const fetchProject = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setProject(res.data.charity);
    } catch { navigate("/"); }
  };

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback/charity/${id}`);
      const list = res.data.feedback || [];
      setFeedback(list);
      if (user) {
        const mine = list.find(f => f.user?._id === user._id);
        if (mine) { setMyFeedback(mine); setFbRating(mine.rating); setFbComment(mine.comment); }
      }
    } catch {}
  };

  const fetchDonations = async () => {
    try {
      const res = await api.get(`/donations/charity/${id}`);
      setDonations(res.data.donations || []);
    } catch {}
  };

  useEffect(() => {
    fetchProject();
    fetchFeedback();
    fetchDonations();
  }, [id]);

  const handleFeedbackSubmit = async () => {
    setFbError("");
    if (!fbComment.trim()) { setFbError("Comment is required"); return; }
    setFbLoading(true);
    try {
      await api.post(`/feedback/charity/${id}`, { rating: fbRating, comment: fbComment });
      fetchFeedback();
    } catch (err) {
      setFbError(err.response?.data?.message || "Failed to submit feedback");
    } finally { setFbLoading(false); }
  };

  const handleFeedbackDelete = async (fbId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await api.delete(`/feedback/${fbId}`);
      fetchFeedback();
      setMyFeedback(null); setFbComment(""); setFbRating(5);
    } catch {}
  };

  if (!project) return <div style={{ padding: 60, textAlign: "center", color: "#78583a" }}>Loading fund…</div>;

  const goal = project.goals?.[0];
  const progress = fundingProgress(goal?.amountRaised || 0, goal?.targetAmount || 0);
  const isFullyFunded = goal ? goal.amountRaised >= goal.targetAmount : false;
  const avg = avgRating(feedback);

  const tabStyle = (t) => ({
    padding: "9px 18px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
    background: activeTab === t ? "#f97316" : "transparent",
    color: activeTab === t ? "white" : "#78583a",
    transition: "all 0.2s", fontFamily: "inherit",
  });

  return (
    <div style={{ background: "#fdf8f3", minHeight: "100vh" }}>
      {showPayment && (
        <PaymentModal
          project={project}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { fetchProject(); fetchDonations(); }}
        />
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

        {/* Navigation Path */}
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#f97316" }}>Home</span>
          {project.category && (
            <> / <span onClick={() => navigate(`/category/${project.category._id}`)} style={{ cursor: "pointer", color: "#f97316" }}>{project.category.name}</span></>
          )}
          {" / "}{project.name}
        </div>

        {/* Cover image */}
        {project.coverImage && (
          <div style={{ marginBottom: 28, borderRadius: 20, overflow: "hidden", maxHeight: 340 }}>
            <img
              src={`${IMG_BASE}${project.coverImage}`}
              alt={project.name}
              style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Lora',serif", fontSize: 36, fontWeight: 700, color: "#1c0f00", marginBottom: 12, lineHeight: 1.2 }}>
            {project.name}
          </h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "#78583a" }}>
            {project.category && (
              <span style={{ background: "#fff7ee", border: "1px solid rgba(234,88,12,0.2)", padding: "4px 12px", borderRadius: 20 }}>
                {project.category.name}
              </span>
            )}
            {avg && <span>⭐ {avg} ({feedback.length} {feedback.length === 1 ? "review" : "reviews"})</span>}
            <span>👥 {project.donorCount || 0} donors</span>
          </div>
        </div>

        {/* Funding card */}
        {goal && (
          <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid rgba(234,88,12,0.1)", boxShadow: "0 4px 20px rgba(180,80,20,0.06)", marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: "'Lora',serif", fontSize: 28, fontWeight: 700, color: "#1c0f00", marginBottom: 2 }}>
                  LKR {goal.amountRaised.toLocaleString()}
                </p>
                <p style={{ fontSize: 14, color: "#9ca3af" }}>raised of LKR {goal.targetAmount.toLocaleString()} goal</p>
              </div>
              {isFullyFunded ? (
                <span style={{ background: "#d1fae5", color: "#065f46", padding: "6px 14px", borderRadius: 20, fontWeight: 700, fontSize: 13 }}>
                  🎉 Fully Funded
                </span>
              ) : (
                <button
                  onClick={() => user ? (user.isAdmin ? null : setShowPayment(true)) : navigate("/login")}
                  disabled={user?.isAdmin}
                  style={{ padding: "12px 28px", background: user?.isAdmin ? "#e5e7eb" : "linear-gradient(135deg,#f97316,#ea580c)", color: user?.isAdmin ? "#9ca3af" : "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: user?.isAdmin ? "not-allowed" : "pointer", boxShadow: user?.isAdmin ? "none" : "0 4px 14px rgba(249,115,22,0.35)", fontFamily: "inherit" }}>
                  {user?.isAdmin ? "Admin cannot donate" : !user ? "Login to Donate" : "Donate Now ❤️"}
                </button>
              )}
            </div>
            <div style={{ background: "#f3f4f6", borderRadius: 8, height: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 8, background: "linear-gradient(90deg,#f97316,#fbbf24)", width: `${progress}%`, transition: "width 1s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
              <span>{progress.toFixed(1)}% funded</span>
              {goal.deadline && <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, background: "white", padding: 6, borderRadius: 12, border: "1px solid rgba(234,88,12,0.1)", width: "fit-content", flexWrap: "wrap" }}>
          {["about", "updates", "donations", "reviews"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
              {t === "about" ? "About"
               : t === "updates" ? `Updates (${project.transparencyUpdates?.length || 0})`
               : t === "donations" ? `Donations (${donations.length})`
               : `Reviews (${feedback.length})`}
            </button>
          ))}
        </div>

        {/* Tab: About */}
        {activeTab === "about" && (
          <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid rgba(234,88,12,0.1)" }}>
            <h3 style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 700, color: "#1c0f00", marginBottom: 14 }}>About This Fund</h3>
            <p style={{ color: "#78583a", lineHeight: 1.8, fontSize: 15 }}>{project.mission}</p>
            {project.impact && (
              <>
                <h4 style={{ fontFamily: "'Lora',serif", fontSize: 16, fontWeight: 700, color: "#1c0f00", margin: "24px 0 10px" }}>Description</h4>
                <p style={{ color: "#78583a", lineHeight: 1.8, fontSize: 15 }}>{project.impact}</p>
              </>
            )}
            {goal && (
              <>
                <h4 style={{ fontFamily: "'Lora',serif", fontSize: 16, fontWeight: 700, color: "#1c0f00", margin: "24px 0 10px" }}>Funding Goal</h4>
                <p style={{ color: "#78583a", lineHeight: 1.7, fontSize: 14 }}>{goal.description}</p>
              </>
            )}
          </div>
        )}

        {/* Tab: Updates */}
        {activeTab === "updates" && (
          <div>
            {(!project.transparencyUpdates || project.transparencyUpdates.length === 0) ? (
              <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9ca3af", border: "1px solid rgba(234,88,12,0.1)" }}>
                No updates yet. Check back soon!
              </div>
            ) : (
              [...project.transparencyUpdates].reverse().map((u) => (
                <div key={u._id} style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid rgba(234,88,12,0.1)", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h4 style={{ fontFamily: "'Lora',serif", fontWeight: 700, color: "#1c0f00", fontSize: 17, margin: 0 }}>{u.title}</h4>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600, flexShrink: 0, marginLeft: 12,
                      background: u.status === "completed" ? "#d1fae5" : u.status === "in-progress" ? "#dbeafe" : "#f3f4f6",
                      color: u.status === "completed" ? "#065f46" : u.status === "in-progress" ? "#1e40af" : "#374151" }}>
                      {u.status}
                    </span>
                  </div>
                  <p style={{ color: "#78583a", lineHeight: 1.7, fontSize: 14, marginBottom: 8 }}>{u.description}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(u.publishedAt).toLocaleDateString()}</p>
                  {u.images && u.images.length > 0 && (
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      {u.images.map((img, i) => (
                        <img key={i} src={`${IMG_BASE}${img}`} alt={`Update image ${i + 1}`}
                          style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 10 }} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Donations */}
        {activeTab === "donations" && (
          <div>
            {donations.length === 0 ? (
              <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", color: "#9ca3af", border: "1px solid rgba(234,88,12,0.1)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💛</div>
                <p>No donations yet. Be the first to donate!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {donations.map((d, i) => (
                  <div key={d._id || i} style={{ background: "white", borderRadius: 16, padding: "16px 20px", border: "1px solid rgba(234,88,12,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    {/* Left: donor name + date */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Avatar circle */}
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: d.donor === "Anonymous" ? "#f3f4f6" : "linear-gradient(135deg,#f97316,#fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: d.donor === "Anonymous" ? "#9ca3af" : "white", flexShrink: 0 }}>
                        {d.donor === "Anonymous" ? "?" : d.donor.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1c0f00", fontSize: 14 }}>
                          {d.donor}
                        </div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>
                          {new Date(d.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                    {/* Right: amount */}
                    <div style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 700, color: "#ea580c", flexShrink: 0 }}>
                      LKR {d.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Reviews */}
        {activeTab === "reviews" && (
          <div>
            {user && !user.isAdmin && (
              <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid rgba(234,88,12,0.1)", marginBottom: 20 }}>
                <h4 style={{ fontFamily: "'Lora',serif", fontWeight: 700, color: "#1c0f00", marginBottom: 14 }}>
                  {myFeedback ? "Your Review" : "Write a Review"}
                </h4>
                <div style={{ marginBottom: 12 }}>
                  <StarRating value={fbRating} onChange={setFbRating} />
                </div>
                <textarea value={fbComment} onChange={e => setFbComment(e.target.value)}
                  placeholder="Share your experience with this fund…"
                  style={{ ...inp, height: 80, resize: "none", marginBottom: 12, width: "100%", boxSizing: "border-box" }} />
                {fbError && <p style={{ ...errStyle, marginBottom: 10 }}>{fbError}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleFeedbackSubmit} disabled={fbLoading}
                    style={{ padding: "10px 20px", background: "#f97316", color: "white", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {fbLoading ? "Saving…" : myFeedback ? "Update Review" : "Submit Review"}
                  </button>
                  {myFeedback && (
                    <button onClick={() => handleFeedbackDelete(myFeedback._id)}
                      style={{ padding: "10px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
            {!user && (
              <div style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid rgba(234,88,12,0.1)", marginBottom: 20, textAlign: "center", color: "#78583a" }}>
                <a href="/login" style={{ color: "#f97316", fontWeight: 600 }}>Log in</a> to leave a review.
              </div>
            )}
            {feedback.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No reviews yet. Be the first!</div>
            ) : (
              feedback.map(f => (
                <div key={f._id} style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid rgba(234,88,12,0.1)", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <strong style={{ color: "#1c0f00" }}>{f.user?.name || "Anonymous"}</strong>
                      <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                    <StarRating value={f.rating} readOnly />
                  </div>
                  <p style={{ color: "#78583a", fontSize: 14, lineHeight: 1.7 }}>{f.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* Shared styles */
const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 };
const modal = { background: "white", borderRadius: 24, padding: 32, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" };
const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
const primaryBtn = { padding: "13px 24px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", width: "100%", fontSize: 15, boxShadow: "0 4px 14px rgba(249,115,22,0.3)", fontFamily: "inherit" };
const ghostBtn = { padding: "13px 20px", background: "white", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "inherit" };
const errStyle = { background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 10, fontSize: 13, margin: 0 };

export default ProjectPage;