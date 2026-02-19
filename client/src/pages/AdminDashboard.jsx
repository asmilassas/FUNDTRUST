import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  // Protect admin page
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/donations/admin/pending");
      setDonations(res.data.donations);
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
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <h3>Pending Bank Donations</h3>

      {donations.length === 0 ? (
        <p>No pending donations</p>
      ) : (
        donations.map((donation) => (
          <div
            key={donation._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <p><strong>User:</strong> {donation.user?.name}</p>
            <p><strong>Email:</strong> {donation.user?.email}</p>
            <p><strong>Project:</strong> {donation.charity?.name}</p>
            <p><strong>Amount:</strong> ${donation.amount}</p>

            {donation.receiptImage && (
              <div>
                <img
                  src={`http://localhost:5000/uploads/${donation.receiptImage}`}
                  alt="Receipt"
                  width="200"
                />
              </div>
            )}

            <button
              onClick={() => approveDonation(donation._id)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
