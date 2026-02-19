import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>FundTrust</h1>
      <p>Building Trust Through Transparent Funding</p>

      <h2 style={{ marginTop: "30px" }}>Donation Categories</h2>

      {categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => navigate(`/category/${cat._id}`)}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))
      )}

      <div style={{ marginTop: "20px" }}>
         <Link to="/login" style={{ marginRight: "15px" }}>
          Login
         </Link>

         <Link to="/register">
          Register
        </Link>
      </div>

    </div>
    
  );
}

export default Home;
