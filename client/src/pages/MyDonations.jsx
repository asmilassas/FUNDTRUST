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
    <>
      <style>{styles}</style>

      <div className="donations-page">
        <div className="donations-container">
          <h2 className="donations-title">My Donations</h2>

          {donations.length === 0 ? (
            <p className="empty-text">You haven't donated yet.</p>
          ) : (
            <div className="donations-grid">
              {donations.map((donation) => (
                <div key={donation._id} className="donation-card">
                  <h3 className="project-name">{donation.charity.name}</h3>

                  <div className="donation-info">
                    <p>
                      <span>Amount</span>
                      <strong>${donation.amount}</strong>
                    </p>

                    <p>
                      <span>Status</span>
                      <strong className="status">{donation.status}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = `
.donations-page{
  background:#fdf8f0;
  min-height:100vh;
  padding:80px 20px;
  font-family:'DM Sans', sans-serif;
}

.donations-container{
  max-width:1000px;
  margin:auto;
}

.donations-title{
  font-family:'Cormorant Garamond', serif;
  font-size:40px;
  text-align:center;
  color:#0f1f3d;
  margin-bottom:50px;
}

.donations-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:20px;
}

.donation-card{
  background:#fffef9;
  border:1px solid rgba(15,31,61,0.08);
  border-radius:14px;
  padding:24px;
  transition:all .2s ease;
  box-shadow:0 4px 20px rgba(15,31,61,0.05);
}

.donation-card:hover{
  transform:translateY(-4px);
  box-shadow:0 12px 40px rgba(15,31,61,0.12);
  border-color:rgba(201,150,58,0.4);
}

.project-name{
  font-family:'Cormorant Garamond', serif;
  font-size:22px;
  color:#0f1f3d;
  margin-bottom:18px;
}

.donation-info p{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
  font-size:14px;
}

.donation-info span{
  color:#6b7a99;
}

.donation-info strong{
  color:#0f1f3d;
}

.status{
  color:#c9963a;
  font-weight:600;
}

.empty-text{
  text-align:center;
  color:#6b7a99;
  font-size:16px;
}
`;

export default MyDonations;