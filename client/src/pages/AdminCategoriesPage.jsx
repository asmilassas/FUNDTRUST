import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.categories || []);
  };

  const createCategory = async () => {
    if (!name || !description) {
      alert("Both name and description are required");
      return;
    }

    try {
      await api.post("/categories", { name, description });
      setName("");
      setDescription("");
      fetchCategories();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <AdminLayout>
      <h1>📂 Manage Sections</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Section Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <input
          placeholder="Section Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <button onClick={createCategory}>Create</button>
      </div>

      {categories.map((cat) => (
        <div key={cat._id} style={{ marginBottom: "10px" }}>
          <strong>{cat.name}</strong> - {cat.description}
          <button
            onClick={() => deleteCategory(cat._id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </AdminLayout>
  );
}

export default AdminCategoriesPage;