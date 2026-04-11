import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail");

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!email) { setError("Session expired. Please register again."); return; }
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      localStorage.removeItem("verifyEmail");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-panel border border-gray-100 px-9 py-10">
        <h1 className="font-serif text-2xl font-bold text-brand-dark mb-1.5">Verify your email</h1>
        <p className="text-sm text-gray-500 mb-7 leading-relaxed">
          We sent a 6-digit code to <strong className="text-gray-700">{email || "your email"}</strong>.
          Enter it below to activate your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">OTP Code</label>
          <input type="text" inputMode="numeric" maxLength={6} required placeholder="123456"
            value={otp} onChange={(e) => { setOtp(e.target.value); setError(""); }} autoFocus
            className={`block w-full px-4 py-3.5 rounded-xl border-[1.5px] text-2xl font-mono tracking-[0.3em] text-center outline-none mb-4 text-gray-900 ${error ? "border-red-300" : "border-gray-200"}`} />

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <button type="submit" disabled={loading}
            className="block w-full py-3.5 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-60 font-sans">
            {loading ? "Verifying…" : "Verify Account"}
          </button>
        </form>

        <p className="mt-5 text-xs text-gray-400 text-center leading-relaxed">
          Didn't receive a code? Check your spam folder or{" "}
          <span onClick={() => navigate("/register")} className="text-brand-orange font-semibold cursor-pointer">
            try registering again
          </span>.
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;