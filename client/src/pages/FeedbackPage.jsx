import { useEffect, useState } from "react";
import api from "../services/api";

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchComments();
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const fetchComments = async () => {
    const res = await api.get("/comments");
    setComments(res.data.comments || []);
  };

  const submitComment = async () => {
    if (!message) return alert("Message required");

    await api.post("/comments", { rating, message });

    setMessage("");
    setRating(5);
    fetchComments();
  };

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, c) => sum + c.rating, 0) /
          comments.length
        ).toFixed(1)
      : 0;

  return (
    <div style={{ padding: "60px", maxWidth: "800px", margin: "auto" }}>
      <h1>Platform Feedback</h1>

      <h3>⭐ Average Rating: {averageRating}</h3>

      {user && (
        <div style={formStyle}>
          <h3>Leave a Review</h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={inputStyle}
          >
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback..."
            style={inputStyle}
          />

          <button style={btnStyle} onClick={submitComment}>
            Submit
          </button>
        </div>
      )}

      {!user && (
        <p style={{ marginTop: "20px", color: "gray" }}>
          Login to leave a review.
        </p>
      )}

      <div style={{ marginTop: "40px" }}>
        {comments.map((c) => (
          <div key={c._id} style={cardStyle}>
            <strong>{c.user?.name}</strong>
            <div>{"⭐".repeat(c.rating)}</div>
            <p>{c.message}</p>
            <small>
              {new Date(c.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

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

const cardStyle = {
  background: "#f3f4f6",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "10px",
};

export default CommentsPage;