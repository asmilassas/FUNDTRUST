import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("verifyEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

  try{
    await api.post("/auth/verify-otp", {
      email,
      otp
    });

    localStorage.removeItem("verifyEmail");

    navigate("/login");
  } catch (err) {
    alert("Invalid OTP");
  }
};

  return (
    <div>
      <h2>Enter OTP</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit">
          Verify
        </button>
      </form>
    </div>
  );
}

export default VerifyOTP;