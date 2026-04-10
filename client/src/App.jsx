import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

// Public pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProjectPage from "./pages/ProjectPage";
import AboutPage from "./pages/AboutPage";
import FeedbackPage from "./pages/FeedbackPage";
import TransparencyPage from "./pages/TransparencyPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtpPage from "./pages/VerifyOtpPage";

// Authenticated user pages
import MyDonations from "./pages/MyDonations";
import DonationReceiptPage from "./pages/DonationReceiptPage";
import ProfilePage from "./pages/ProfilePage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import AdminProjectUpdatePage from "./pages/AdminProjectUpdatePage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Authenticated user */}
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/donations/:id/receipt" element={<DonationReceiptPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/projects" element={<AdminRoute><AdminProjectsPage /></AdminRoute>} />
        <Route path="/admin/funds" element={<AdminRoute><AdminProjectsPage /></AdminRoute>} />
        <Route path="/admin/projects/:id" element={<AdminRoute><AdminProjectUpdatePage /></AdminRoute>} />
        <Route path="/admin/funds/:id" element={<AdminRoute><AdminProjectUpdatePage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
        <Route path="/admin/feedback" element={<AdminRoute><AdminFeedbackPage /></AdminRoute>} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}