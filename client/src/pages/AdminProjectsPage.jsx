import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [mission, setMission] = useState("");
  const [category, setCategory] = useState("");

  // 🔥 GOAL STATES
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    fetchProjects();
    fetchCategories();
  }, [navigate]);

  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const res = await api.get("/charities/admin/all");
      setProjects(res.data.charities || []);
    } catch (error) {
      console.error("Error loading projects", error);
    }
  };

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  // ================= CREATE PROJECT =================
  const createProject = async () => {
    if (
      !name ||
      !mission ||
      !category ||
      !goalTitle ||
      !goalDescription ||
      !targetAmount
    ) {
      alert("All required fields must be filled");
      return;
    }

    try {
      await api.post("/charities", {
        name,
        mission,
        category,
        goals: [
          {
            title: goalTitle,
            description: goalDescription,
            targetAmount: Number(targetAmount),
            amountRaised: 0,
            deadline: deadline || null,
          },
        ],
      });

      // Reset fields
      setName("");
      setMission("");
      setCategory("");
      setGoalTitle("");
      setGoalDescription("");
      setTargetAmount("");
      setDeadline("");

      fetchProjects();
    } catch (error) {
      console.error("Create project failed", error.response?.data || error.message);
    }
  };

  // ================= DELETE PROJECT =================
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/charities/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h1 style={{ marginBottom: "30px" }}>📁 Manage Projects</h1>

        {/* ================= CREATE PROJECT FORM ================= */}
        <div
          style={{
            marginBottom: "40px",
            padding: "20px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Create New Project</h3>

          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Project Mission"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            style={{ ...inputStyle, height: "100px" }}
          />

          <input
            type="text"
            placeholder="Goal Title"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Goal Description"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            style={{ ...inputStyle, height: "80px" }}
          />

          <input
            type="number"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={inputStyle}
          />

          {/* CATEGORY DROPDOWN */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Section</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button onClick={createProject} style={createBtn}>
            Create Project
          </button>
        </div>

        {/* ================= PROJECT LIST ================= */}
        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              }}
            >
              <h3>{project.name}</h3>
              <p>{project.mission}</p>
              <p>
                <strong>Section:</strong>{" "}
                {project.category?.name || "Not assigned"}
              </p>

              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() =>
                    navigate(`/admin/projects/${project._id}`)
                  }
                  style={manageBtn}
                >
                  Manage
                </button>

                <button
                  onClick={() => deleteProject(project._id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const createBtn = {
  padding: "10px 16px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const manageBtn = {
  padding: "8px 14px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px",
};

const deleteBtn = {
  padding: "8px 14px",
  background: "#e63757",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminProjectsPage;