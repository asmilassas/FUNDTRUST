import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function VerifyOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      alert("Account verified successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Verify Your Account</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>
        Verify
      </button>
    </div>
  );
}

export default VerifyOtpPage;