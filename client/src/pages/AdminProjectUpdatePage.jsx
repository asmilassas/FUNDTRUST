import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminProjectUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("started");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await api.post(`/charities/${id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("Project update added successfully!");
      setTitle("");
      setDescription("");
      setImages([]);

    } catch (error) {
      console.error(error);
      setMessage("Failed to add update.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Add Project Update</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Update Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />

        <textarea
          placeholder="Update Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        >
          <option value="started">Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
          style={{ marginBottom: "15px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Add Update
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      <button
        onClick={() => navigate("/admin/projects")}
        style={{
          marginTop: "30px",
          padding: "8px 15px",
          background: "#2c7be5",
          color: "white",
          border: "none",
          borderRadius: "6px"
        }}
      >
        Back to Projects
      </button>
    </div>
  );
}

export default AdminProjectUpdatePage;
