import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Save user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful!");

      // ✅ Role-based redirect
      if (res.data.user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      setMessage("Invalid credentials.");
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

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
