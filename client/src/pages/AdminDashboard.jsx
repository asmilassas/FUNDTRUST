import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  // 🔐 Protect Admin Route
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchPending();
  }, [navigate]);

  const fetchPending = async () => {
    try {
      const res = await api.get("/donations/admin/pending");
      setDonations(res.data.donations || []);
    } catch (error) {
      console.error("Error fetching pending donations", error);
    }
  };

  const approveDonation = async (id) => {
    try {
      await api.put(`/donations/${id}/approve`);
      fetchPending();
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>

      <h3 style={{ marginTop: "30px" }}>Pending Bank Donations</h3>

      {donations.length === 0 ? (
        <p>No pending donations</p>
      ) : (
        donations.map((donation) => (
          <div
            key={donation._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#fafafa"
            }}
          >
            <p><strong>User:</strong> {donation.user?.name || "Unknown"}</p>
            <p><strong>Email:</strong> {donation.user?.email}</p>
            <p><strong>Project:</strong> {donation.charity?.name}</p>
            <p><strong>Amount:</strong> ${donation.amount}</p>

            {donation.receiptImage && (
              <img
                src={`http://localhost:5000/uploads/${donation.receiptImage}`}
                alt="Receipt"
                style={{
                  width: "200px",
                  marginTop: "10px",
                  borderRadius: "6px"
                }}
              />
            )}

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => approveDonation(donation._id)}
                style={{
                  padding: "8px 15px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Approve
              </button>

              <button
                onClick={() =>
                  navigate(`/project/${donation.charity?._id}`)
                }
                style={{
                  padding: "8px 15px",
                  background: "#2c7be5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                View Project
              </button>

              {/* 🔥 NEW BUTTON ADDED HERE */}
              <button
                onClick={() =>
                  navigate(`/admin/project/${donation.charity?._id}/update`)
                }
                style={{
                  padding: "8px 15px",
                  background: "orange",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Add Update
              </button>

            </div>
          </div>
        ))
      )}
      <button
  onClick={() => navigate("/admin/projects")}
  style={{
    padding: "10px 20px",
    background: "#2c7be5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "20px"
  }}
>
  Manage Projects
</button>

    </div>
    
  );
}

export default AdminDashboard;
