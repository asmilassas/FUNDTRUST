import { useState } from "react";
import api from "../services/api";

function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    try {
      const res = await api.patch("/users/me", {
        name,
        currentPassword,
        newPassword,
      });

      setMessage(res.data.message || "Profile updated successfully");

      // ✅ Update localStorage user name
      const updatedUser = {
        ...storedUser,
        name: res.data.user.name,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");

    } catch (error) {
      setError(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ padding: "60px", maxWidth: "500px", margin: "auto" }}>
      <h2>Update Profile</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <label>Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={inputStyle}
      />

      <label>New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleUpdate} style={buttonStyle}>
        Update Profile
      </button>

      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  marginTop: "5px",
};

const buttonStyle = {
  padding: "10px 20px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default ProfilePage;