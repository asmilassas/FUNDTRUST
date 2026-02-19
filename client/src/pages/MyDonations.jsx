import { useEffect, useState } from "react";
import api from "../services/api";

function MyDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/donations/me");
        setDonations(res.data.donations);
      } catch (error) {
        console.error("Error fetching donations", error);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Donations</h2>

      {donations.length === 0 ? (
        <p>No donations yet.</p>
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
            <p><strong>Project:</strong> {donation.charity.name}</p>
            <p><strong>Amount:</strong> ${donation.amount}</p>
            <p><strong>Status:</strong> {donation.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyDonations;
