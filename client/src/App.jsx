import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProjectPage from "./pages/ProjectPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import MyDonations from "./pages/MyDonations";
import AdminUpdatePage from "./pages/AdminUpdatePage";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import AdminProjectUpdatePage from "./pages/AdminProjectUpdatePage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminEditUserPage from "./pages/AdminEditUserPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FeedbackPage from "./pages/FeedbackPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <Navbar />
       {/* Tailwind Test */}
      <h1 className="text-3xl font-bold text-blue-600">
        Tailwind Working
      </h1>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/admin/project/:id/update" element={<AdminRoute><AdminUpdatePage /></AdminRoute>} />
        <Route path="/admin/projects" element={<AdminRoute><AdminProjectsPage /></AdminRoute>} />
        <Route path="/admin/projects/:id" element={<AdminRoute><AdminProjectUpdatePage /></AdminRoute>} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
        <Route path="/admin/users/:id/edit" element={<AdminRoute><AdminEditUserPage /></AdminRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
