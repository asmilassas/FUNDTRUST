import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // 🔥 added
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();   // 🔥 added

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/users/admin/all");
    setUsers(res.data.users || []);
  };

  const createUser = async () => {
    if (!name || !email || !password) {
      alert("All fields required");
      return;
    }

    await api.post("/users/admin/create", {
      name,
      email,
      password,
      isAdmin,
    });

    setName("");
    setEmail("");
    setPassword("");
    setIsAdmin(false);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/admin/${id}`);
    fetchUsers();
  };

  const normalUsers = users.filter((u) => !u.isAdmin);
  const adminUsers = users.filter((u) => u.isAdmin);

  return (
    <AdminLayout>
      <h1 style={{ marginBottom: "30px" }}>👥 Manage Users</h1>

      {/* Create User Form */}
      <div style={cardStyle}>
        <h3>Create New User</h3>

        <input
          style={inputStyle}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          {" "}Make Admin
        </label>

        <button style={createBtn} onClick={createUser}>
          Create User
        </button>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
        
        {/* Normal Users */}
        <div style={{ flex: 1 }}>
          <h2>👤 Users</h2>
          {normalUsers.map((user) => (
            <div key={user._id} style={userCard}>
              <div>
                {user.name} <br />
                <small>{user.email}</small>
              </div>
              <div>
                {/* 🔥 UPDATED EDIT BUTTON */}
                <button
                  style={editBtn}
                  onClick={() =>
                    navigate(`/admin/users/${user._id}/edit`)
                  }
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Users */}
        <div style={{ flex: 1 }}>
          <h2>🛡 Admins</h2>
          {adminUsers.map((user) => (
            <div key={user._id} style={userCard}>
              <div>
                {user.name} <br />
                <small>{user.email}</small>
              </div>
              <div>
                {/* 🔥 UPDATED EDIT BUTTON */}
                <button
                  style={editBtn}
                  onClick={() =>
                    navigate(`/admin/users/${user._id}/edit`)
                  }
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

/* Styles */

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

const createBtn = {
  padding: "8px 15px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  background: "#2c7be5",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px",
};

const deleteBtn = {
  background: "#e63757",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const userCard = {
  background: "white",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

export default AdminUsersPage;