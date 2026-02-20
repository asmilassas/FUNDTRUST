import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/charities/admin/all");
      setProjects(res.data.charities);
    } catch (error) {
      console.error("Error loading projects", error);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Manage Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px"
            }}
          >
            <h3>{project.name}</h3>
            <p>{project.mission}</p>

            <button
              onClick={() => navigate(`/admin/projects/${project._id}`)}
              style={{
                padding: "8px 15px",
                background: "#2c7be5",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Manage
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminProjectsPage;
