import { Routes, Route, useLocation } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FeedbackPage from "./pages/FeedbackPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ProjectPage from "./pages/ProjectPage";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtpPage from "./pages/VerifyOtpPage";

// User pages
import MyDonations from "./pages/MyDonations";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import AdminProjectUpdatePage from "./pages/AdminProjectUpdatePage";
import AdminUpdatePage from "./pages/AdminUpdatePage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminEditUserPage from "./pages/AdminEditUserPage";

// Footer is hidden on admin and auth pages
const NO_FOOTER = ["/admin", "/login", "/register", "/verify-otp"];

function App() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER.some((p) => pathname.startsWith(p));

  return (
    <>
      <Navbar />

      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />

        {/* ── Auth ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* ── User ── */}
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ── Admin ── */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/projects/:id" element={<AdminProjectUpdatePage />} />
        <Route path="/admin/projects/:id/update" element={<AdminUpdatePage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/:id/edit" element={<AdminEditUserPage />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default App;