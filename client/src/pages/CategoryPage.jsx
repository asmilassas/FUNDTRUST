import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [id]);

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/charities?category=${id}`);
      const data = res.data.charities || [];

      setProjects(data);

      if (data.length > 0) {
        setCategoryName(data[0].category?.name || "Projects");
      } else {
        setCategoryName("Projects");
      }

    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1>{categoryName}</h1>

      {projects.length === 0 ? (
        <p>No projects found in this section.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/project/${project._id}`)}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            <h3>{project.name}</h3>
            <p>{project.mission}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CategoryPage;