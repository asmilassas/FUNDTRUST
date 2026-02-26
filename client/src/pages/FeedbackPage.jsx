import { useEffect, useState } from "react";
import api from "../services/api";

function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedback(Array.isArray(res.data.feedback) ? res.data.feedback : []);
    } catch (error) {
      console.error("Fetch feedback failed", error);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!comment.trim()) return alert("Comment required");

    try {
      if (editingId) {
        await api.put(`/feedback/${editingId}`, { rating, comment });
        setEditingId(null);
      } else {
        await api.post("/feedback", { rating, comment });
      }

      setComment("");
      setRating(5);
      fetchFeedback();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete your feedback?")) return;

    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedback();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setRating(item.rating);
    setComment(item.comment);
  };

  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedback.length
        ).toFixed(1)
      : 0;

  if (loading) {
    return <div style={{ padding: "60px" }}>Loading feedback...</div>;
  }

  return (
    <div style={{ padding: "60px", maxWidth: "800px", margin: "auto" }}>
      <h1>Platform Feedback</h1>
      <h3>⭐ Average Rating: {averageRating}</h3>

      {/* Feedback Form */}
      {user && (
        <div style={formStyle}>
          <h3>{editingId ? "Edit Review" : "Leave a Review"}</h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={inputStyle}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback..."
            style={inputStyle}
          />

          <button style={btnStyle} onClick={submitFeedback}>
            {editingId ? "Update" : "Submit"}
          </button>
        </div>
      )}

      {!user && (
        <p style={{ marginTop: "20px", color: "gray" }}>
          Login to leave a review.
        </p>
      )}

      {/* Feedback List */}
      <div style={{ marginTop: "40px" }}>
        {feedback.length === 0 && (
          <p style={{ color: "gray" }}>No feedback yet.</p>
        )}

        {feedback.map((f) => {
          const isOwner =
            user &&
            f.user &&
            user._id &&
            f.user._id &&
            String(user._id) === String(f.user._id);

          return (
            <div key={f._id} style={cardStyle}>
              <strong>{f.user?.name || "Anonymous"}</strong>
              <div>{"⭐".repeat(f.rating || 0)}</div>
              <p>{f.comment}</p>
              <small>
                {f.createdAt
                  ? new Date(f.createdAt).toLocaleDateString()
                  : ""}
              </small>

              {isOwner && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    style={editBtn}
                    onClick={() => startEdit(f)}
                  >
                    Edit
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => deleteFeedback(f._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Styles */

const formStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const btnStyle = {
  padding: "10px 20px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  padding: "6px 12px",
  background: "#f6c343",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px",
};

const deleteBtn = {
  padding: "6px 12px",
  background: "#e63757",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const cardStyle = {
  background: "#f3f4f6",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "10px",
};

export default FeedbackPage;