import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setStatus(null); setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null);
    try {
      await api.post("/auth/register", form);
      localStorage.setItem("verifyEmail", form.email);
      setStatus({ type: "success", text: "OTP sent! Redirecting…" });
      setTimeout(() => navigate("/verify-otp"), 1200);
    } catch (err) {
      setStatus({ type: "error", text: err?.response?.data?.message || "Registration failed." });
    } finally { setLoading(false); }
  };

  const hasError = status?.type === "error";

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-panel border border-brand-orange/10 px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-1">Create account</h1>
        <p className="text-brand-brown text-sm mb-8">Join FundTrust and start making a difference</p>

        <form onSubmit={handleSubmit} noValidate>
          {[["name","Full name","text","name","Jane Smith"],["email","Email address","email","email","you@example.com"],["password","Password","password","current-password","Min. 8 characters"]].map(([name,label,type,ac,ph]) => (
            <div key={name}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
              <input name={name} type={type} required autoComplete={ac} placeholder={ph}
                value={form[name]} onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-xl border-[1.5px] text-sm outline-none font-sans mb-4 ${hasError ? "border-red-400" : "border-gray-200"}`} />
            </div>
          ))}

          {status && (
            <div className={`text-sm px-4 py-3 rounded-xl mb-4 ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {status.text}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl text-sm shadow-orange cursor-pointer disabled:opacity-60 font-sans">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-brand-brown mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-orange font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;