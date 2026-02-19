import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/charities/${id}`)
      .then((res) => {
        setProject(res.data.charity);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
      });
  }, [id]);

  // 🔥 Funding Progress Logic
  const goal = project?.goals?.[0];

  const progress = goal
    ? Math.min((goal.amountRaised / goal.targetAmount) * 100, 100)
    : 0;

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("charityId", id);
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "bank") {
        if (!selectedFile) {
          setMessage("Please upload receipt image.");
          return;
        }
        formData.append("receiptImage", selectedFile);
      }

      const response = await api.post(
        "/donations/one-time",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message || "Donation submitted!");

    } catch (error) {
      console.error(error);
      setMessage("Donation failed.");
    }
  };

  if (!project) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ padding: "50px", maxWidth: "800px", margin: "auto" }}>
      
      <h1>{project.name}</h1>

      <p style={{ fontSize: "18px", marginTop: "15px" }}>
        {project.mission}
      </p>

      {/*Progress Section */}
      {goal && (
        <div style={{ marginTop: "20px" }}>
          <h3>Funding Progress</h3>

          <p>
            ${goal.amountRaised} raised of ${goal.targetAmount}
          </p>

          <div
            style={{
              background: "#eee",
              borderRadius: "8px",
              height: "20px",
              width: "100%",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                background: "#2c7be5",
                height: "100%"
              }}
            ></div>
          </div>

          <p>{progress.toFixed(1)}% completed</p>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h3>Make a Donation</h3>

      <form onSubmit={handleDonate} style={{ marginTop: "20px" }}>
        
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "6px"
          }}
        >
          <option value="stripe">Stripe (Online Payment)</option>
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
          style={{
            padding: "12px 25px",
            background: "#2c7be5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Donate
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ProjectPage;
