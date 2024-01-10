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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MobileNavbar />}>
          <Route path="/projects" element={<Dashboard />} />
          <Route path ="/create" element={<CreatePage/>}></Route>
          <Route path ="/invite/send" element={<InvitePeople/>}></Route>
          <Route path="/projects/:id" element={<ProjectDetails />}></Route>
          <Route path="/invites" element={<InvitePage />}></Route>
          <Route path="/sessions" element={<SessionsPage />}></Route>
          <Route path="/projects/datasets/:id/entries" element={<EntryPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Do you ever feel like a plastic bag
// Drifting through the wind, wanting to start again?
