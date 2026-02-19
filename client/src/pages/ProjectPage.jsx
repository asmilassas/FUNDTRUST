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
    api.get(`/charities/${id}`)
      .then((res) => {
        setProject(res.data.charity);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
      });
  }, [id]);

  if (!project) return <p style={{ padding: "40px" }}>Loading...</p>;


  //  Funding Progress

  const goal = project?.goals?.[0];

  const progress = goal
    ? Math.min((goal.amountRaised / goal.targetAmount) * 100, 100)
    : 0;

  const isFullyFunded = goal
    ? goal.amountRaised >= goal.targetAmount
    : false;


  //  Handle Donation
  
  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.isAdmin) {
      setMessage("Admin users are not allowed to donate.");
      return;
    }

    if (isFullyFunded) {
      setMessage("This project is already fully funded.");
      return;
    }

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

      // Reload project to update progress
      const updated = await api.get(`/charities/${id}`);
      setProject(updated.data.charity);

      setAmount("");
      setSelectedFile(null);

    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Donation failed."
      );
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "800px", margin: "auto" }}>
      
      <h1>{project.name}</h1>

      <p style={{ fontSize: "18px", marginTop: "15px" }}>
        {project.mission}
      </p>

      {/* 
           Progress Section
     */}
      {goal && (
        <div style={{ marginTop: "25px" }}>
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

          {isFullyFunded && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              🎉 This project is fully funded!
            </p>
          )}
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* 
          Donation Section
     */}

      {!user ? (
        <div>
          <p>You must login to donate.</p>
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
            Login
          </button>
        </div>
      ) : user.isAdmin ? (
        <p style={{ color: "red" }}>
          Admin users are not allowed to donate.
        </p>
      ) : (
        <>
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
              disabled={isFullyFunded}
              style={{
                padding: "12px 25px",
                background: isFullyFunded ? "gray" : "#2c7be5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isFullyFunded ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              {isFullyFunded ? "Fully Funded" : "Donate"}
            </button>
          </form>
        </>
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
