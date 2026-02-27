import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setProject(res.data.charity);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  if (!project) return <p style={{ padding: "40px" }}>Loading...</p>;

  const goal = project.goals?.[0];

  const progress = goal
    ? Math.min((goal.amountRaised / goal.targetAmount) * 100, 100)
    : 0;

  const isFullyFunded = goal
    ? goal.amountRaised >= goal.targetAmount
    : false;

  // 💰 Donation Handler
  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.isAdmin) {
      setMessage("Admin users cannot donate.");
      return;
    }

    if (isFullyFunded) {
      setMessage("This project is already fully funded.");
      return;
    }

    if (!amount || amount <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("charityId", id);
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "bank") {
        if (!selectedFile) {
          setMessage("Upload receipt image.");
          return;
        }
        formData.append("receiptImage", selectedFile);
      }

      const response = await api.post(
        "/donations/one-time",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(response.data.message);
      setAmount("");
      setSelectedFile(null);
      fetchProject();

    } catch (error) {
      setMessage(error.response?.data?.message || "Donation failed.");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "900px", margin: "auto" }}>

      <h1>{project.name}</h1>
      <p style={{ fontSize: "18px", marginTop: "15px" }}>
        {project.mission}
      </p>

      {/* Funding Progress */}
      {goal && (
        <div style={{ marginTop: "30px" }}>
          <h3>Funding Progress</h3>
          <p>${goal.amountRaised} raised of ${goal.targetAmount}</p>

          <div style={{
            background: "#eee",
            height: "20px",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <div
              style={{
                width: `${progress}%`,
                background: "#2c7be5",
                height: "100%",
              }}
            />
          </div>

          <p>{progress.toFixed(1)}% completed</p>

          {isFullyFunded && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              🎉 Fully Funded
            </p>
          )}
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* 💰 Donation Section */}
      <h2>Make a Donation</h2>

      {!user ? (
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            background: "#2c7be5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Login to Donate
        </button>
      ) : user.isAdmin ? (
        <p style={{ color: "red" }}>
          Admin users cannot donate.
        </p>
      ) : (
        <form onSubmit={handleDonate}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          >
            <option value="stripe">Stripe</option>
            <option value="bank">Bank Transfer</option>
          </select>

          {paymentMethod === "bank" && (
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ marginBottom: "15px" }}
            />
          )}

          <button
            type="submit"
            disabled={isFullyFunded}
            style={{
              padding: "12px 25px",
              background: isFullyFunded ? "gray" : "#2c7be5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isFullyFunded ? "not-allowed" : "pointer"
            }}
          >
            {isFullyFunded ? "Fully Funded" : "Donate"}
          </button>
        </form>
      )}

      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ProjectPage;