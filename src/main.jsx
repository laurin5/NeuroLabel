import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import Dashboard from "./pages/DashBoard/DashBoard.jsx";
import ProjectDetails from "./pages/ProjectDetailsPage/ProjectDetails.jsx";
import InvitePage from "./pages/InvitePage/InvitePage.jsx";
import SessionsPage from "./pages/SessionsPage/SessionsPage.jsx";
import MobileNavbar from "./components/MobileNavbar.jsx";
import CreatePage from "./pages/CreatePage/CreatePage.jsx";
import InvitePeople from "./pages/InvitePeoplePage/InvitePeoplePage.jsx";
import EntryPage from "./pages/EntryPage/EntryPage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import DatasetDetails from "./pages/DatasetDetails/DatasetDetails.jsx";
import UploadPage from "./pages/UploadPage/UploadPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import FeedbackPage from "./pages/FeedbackPage/FeedbackPage.jsx";

const isMobile = window.innerWidth <= 768;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {isMobile ? (
          <Route element={<MobileNavbar />}>
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/invite/send" element={<InvitePeople />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/invites" element={<InvitePage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/projects/datasets/:id" element={<DatasetDetails />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route
              path="/projects/datasets/:id/entries"
              element={<EntryPage />}
            />
          </Route>
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/invite/send" element={<InvitePeople />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/invites" element={<InvitePage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/projects/datasets/:id" element={<DatasetDetails />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route
              path="/projects/datasets/:id/entries"
              element={<EntryPage />}
            />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Do you ever feel like a plastic bag
// Drifting through the wind, wanting to start again?
