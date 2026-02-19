import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProjectPage from "./pages/ProjectPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";


function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
              path="/admin/dashboard" 
              element={
                   <AdminRoute>
                      <AdminDashboard />
                   </AdminRoute> } />
      </Routes>
    
  );
}

export default App;
