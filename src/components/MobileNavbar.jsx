import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonIcon from "@mui/icons-material/Person";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PublicIcon from "@mui/icons-material/Public";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { API_HOST } from "../utils/api";

function MobileNavbar() {
  const [value, setValue] = useState("Projects");
  const [userDetails, setUserDetails] = useState({});
  let navigator = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNavigate = (path) => {
    navigator(path);
  };

  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    const response = await fetch(
      `${API_HOST}/sessions/${localStorage.getItem("sessionid")}/validate`,
      {
        headers: {
          SessionId: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    if (responseJSON.message == "Success.") {
      loadUserDetails();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  const loadUserDetails = async () => {
    const response = await fetch(`${API_HOST}/users/details`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    setUserDetails(responseJSON.user);
  };

  return (
    <div className="">
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Projekte"
          value="Projekte"
          icon={<FolderOpenIcon />}
          onClick={() => {
            handleNavigate("/projects");
          }}
        />
        <BottomNavigationAction
          label="Einladungen"
          value="Einladungen"
          icon={<GroupAddIcon />}
          onClick={() => {
            handleNavigate("/invites");
          }}
        />
        <BottomNavigationAction
          label="Rückmeldung"
          value="Rückmeldung"
          icon={<FeedbackIcon />}
          onClick={() => {
            handleNavigate("/feedback");
          }}
        />
        {userDetails.is_admin && (
          <BottomNavigationAction
            label="Admin"
            value="Admin"
            icon={<PublicIcon />}
            onClick={() => {
              handleNavigate("/admin");
            }}
          />
        )}
        <BottomNavigationAction
          label="Profil"
          value="Profil"
          icon={<PersonIcon />}
          onClick={() => {
            handleNavigate("/profile");
          }}
        />
      </BottomNavigation>
      <Outlet />
    </div>
  );
}

export default MobileNavbar;
