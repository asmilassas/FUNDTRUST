import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

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

  // 🔴 NEW REJECT FUNCTION
  const rejectDonation = async (id) => {
    const reason = prompt("Enter rejection reason:");

    if (!reason) return;

    try {
      await api.put(`/donations/${id}/reject`, { reason });
      fetchPending();
    } catch (error) {
      console.error("Rejection failed", error);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "30px" }}>📊 Pending Bank Donations</h1>

      {donations.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          No pending donations 🎉
        </div>
      ) : (
        donations.map((donation) => (
          <div
            key={donation._id}
            style={{
              background: "white",
              padding: "25px",
              marginBottom: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <strong>User:</strong> {donation.user?.name || "Unknown"}
            </div>
            <div>
              <strong>Email:</strong> {donation.user?.email}
            </div>
            <div>
              <strong>Project:</strong> {donation.charity?.name}
            </div>
            <div>
              <strong>Amount:</strong> ${donation.amount}
            </div>

            {donation.receiptImage && (
              <img
                src={`http://localhost:5000/uploads/${donation.receiptImage}`}
                alt="Receipt"
                style={{
                  width: "220px",
                  marginTop: "15px",
                  borderRadius: "8px",
                }}
              />
            )}

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => approveDonation(donation._id)}
                style={approveBtn}
              >
                ✔ Approve
              </button>

              {/* 🔴 NEW REJECT BUTTON */}
              <button
                onClick={() => rejectDonation(donation._id)}
                style={rejectBtn}
              >
                ❌ Reject
              </button>

              <button
                onClick={() =>
                  navigate(`/project/${donation.charity?._id}`)
                }
                style={viewBtn}
              >
                🔍 View Project
              </button>

              <button
                onClick={() =>
                  navigate(`/admin/project/${donation.charity?._id}/update`)
                }
                style={updateBtn}
              >
                ✏ Add Update
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/admin/projects")}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#2c7be5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        📁 Manage Projects
      </button>
    </AdminLayout>
  );
}

/* Button Styles */
const approveBtn = {
  padding: "10px 16px",
  background: "#00d97e",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const rejectBtn = {
  padding: "10px 16px",
  background: "#e63757",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const viewBtn = {
  padding: "10px 16px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const updateBtn = {
  padding: "10px 16px",
  background: "#f6c343",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminDashboard;