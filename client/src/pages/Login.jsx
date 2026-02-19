import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        if (res.data.user.isAdmin) {
  navigate("/admin/dashboard");
} else {
  navigate("/");
}

window.location.reload(); // 🔥 Add this line

      }

    } catch (error) {
      setMessage("Invalid email or password.");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Login
        </button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Register Link Section */}
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "#2c7be5" }}>
          Register here
        </Link>
      </p>
    </div>
  );
}

export default Login;
