import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminEditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await api.get("/users/admin/all");
    const user = res.data.users.find((u) => u._id === id);

    if (!user) {
      alert("User not found");
      navigate("/admin/users");
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
  };

  const updateUser = async () => {
    await api.put(`/users/admin/${id}`, {
      name,
      email,
      isAdmin,
    });

    navigate("/admin/users");
  };

  const cancelEdit = () => {
    navigate("/admin/users");
  };

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "30px" }}>✏ Edit User</h1>

      <div style={cardStyle}>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          {" "}Make Admin
        </label>

        <div style={{ marginTop: "15px" }}>
          <button style={updateBtn} onClick={updateUser}>
            Update
          </button>

          <button
            style={cancelBtn}
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  maxWidth: "500px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const updateBtn = {
  padding: "8px 15px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px",
};

const cancelBtn = {
  padding: "8px 15px",
  background: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminEditUserPage;