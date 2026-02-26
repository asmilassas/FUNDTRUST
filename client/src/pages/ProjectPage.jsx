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

  // 🔥 Feedback State
  const [feedback, setFeedback] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProject();
    fetchFeedback();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setProject(res.data.charity);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  // 🔥 Fetch Charity Feedback
  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback/charity/${id}`);
      setFeedback(res.data.feedback || []);
    } catch (err) {
      console.error("Error fetching feedback:", err);
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
    if (!user) return navigate("/login");
    if (user.isAdmin) return setMessage("Admin users are not allowed to donate.");
    if (isFullyFunded) return setMessage("This project is already fully funded.");
    if (!amount || amount <= 0) return setMessage("Please enter valid amount.");

    try {
      const formData = new FormData();
      formData.append("charityId", id);
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "bank") {
        if (!selectedFile) return setMessage("Upload receipt image.");
        formData.append("receiptImage", selectedFile);
      }

      const response = await api.post(
        "/donations/one-time",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(response.data.message);
      fetchProject();
      setAmount("");
      setSelectedFile(null);

    } catch (error) {
      setMessage(error.response?.data?.message || "Donation failed.");
    }
  };

  // 🔥 Submit / Update Feedback
  const submitFeedback = async () => {
    if (!comment) return alert("Comment required");

    try {
      if (editingId) {
        await api.put(`/feedback/${editingId}`, { rating, comment });
        setEditingId(null);
      } else {
        await api.post("/feedback", {
          charityId: id,
          rating,
          comment,
        });
      }

      setRating(5);
      setComment("");
      fetchFeedback();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  // 🔥 Average Rating
  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + f.rating, 0) /
          feedback.length
        ).toFixed(1)
      : 0;

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
          <div style={{ background: "#eee", height: "20px", borderRadius: "8px" }}>
            <div
              style={{
                width: `${progress}%`,
                background: "#2c7be5",
                height: "100%",
              }}
            />
          </div>
          <p>{progress.toFixed(1)}% completed</p>
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      {/* 🔥 Feedback Section */}
      <h2>⭐ Feedback</h2>
      <h3>Average Rating: {averageRating}</h3>

      {user && (
        <div style={{ marginBottom: "20px" }}>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback..."
            style={{ width: "100%", marginTop: "10px" }}
          />

          <button
            onClick={submitFeedback}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              background: "#2c7be5",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            {editingId ? "Update" : "Submit"}
          </button>
        </div>
      )}

      {feedback.map((f) => (
        <div
          key={f._id}
          style={{
            background: "#f3f4f6",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>{f.user?.name}</strong>
          <div>{"⭐".repeat(f.rating)}</div>
          <p>{f.comment}</p>

          {user && user._id === f.user?._id && (
            <>
              <button
                onClick={() => {
                  setEditingId(f._id);
                  setRating(f.rating);
                  setComment(f.comment);
                }}
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  await api.delete(`/feedback/${f._id}`);
                  fetchFeedback();
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}

      {message && (
        <p style={{ marginTop: "20px", color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ProjectPage;