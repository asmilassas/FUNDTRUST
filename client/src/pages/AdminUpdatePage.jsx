import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUpdatePage() {
  const { id } = useParams(); // project id
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("started");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/charities/${id}`);
      setProject(res.data.charity);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setMessage("Title and description are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const res = await api.post(
        `/charities/${id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "Update added successfully!");

      setTitle("");
      setDescription("");
      setImages([]);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Update failed.");
    }
  };

  if (!project) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ padding: "50px", maxWidth: "700px", margin: "auto" }}>
      <h2>Add Update for: {project.name}</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        
        <input
          type="text"
          placeholder="Update Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <textarea
          placeholder="Update Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "6px"
          }}
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
            padding: "12px 25px",
            background: "#2c7be5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Add Update
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

export default AdminUpdatePage;
