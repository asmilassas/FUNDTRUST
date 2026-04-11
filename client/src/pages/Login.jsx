import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setError(""); setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", form);
      await login(res.data.token);
      navigate(res.data.user.isAdmin ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-panel border border-brand-orange/10 px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-1">Welcome back</h1>
        <p className="text-brand-brown text-sm mb-8">Sign in to your FundTrust account</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email address</label>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange}
            className={`block w-full px-4 py-3 rounded-xl border-[1.5px] text-sm outline-none font-sans mb-4 ${error ? "border-red-400" : "border-gray-200"}`} />

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
          <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••"
            value={form.password} onChange={handleChange}
            className={`block w-full px-4 py-3 rounded-xl border-[1.5px] text-sm outline-none font-sans mb-4 ${error ? "border-red-400" : "border-gray-200"}`} />

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-br from-brand-orange to-brand-burn text-white font-bold rounded-xl text-sm shadow-orange cursor-pointer disabled:opacity-60 font-sans">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-brand-brown mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-orange font-semibold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

Login.jsx