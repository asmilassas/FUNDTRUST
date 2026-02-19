import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Add this
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    api.get(`/charities?category=${id}`)
      .then((res) => {
        setCharities(res.data.charities);
      })
      .catch((err) => {
        console.error("Error fetching charities:", err);
      });
  }, [id]);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Projects in This Category</h2>

      {charities.length === 0 ? (
        <p>No projects found</p>
      ) : (
        charities.map((charity) => (
          <div
            key={charity._id}
            onClick={() => navigate(`/project/${charity._id}`)} // ✅ Click action
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px",
              cursor: "pointer", // ✅ Makes it look clickable
              boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
            }}
          >
            <h3>{charity.name}</h3>
            <p>{charity.mission}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CategoryPage;
