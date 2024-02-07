import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function MobileNavbar() {
  const [value, setValue] = useState("Projects");
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
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  return (
    <div className="">
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Projects"
          value="Projects"
          icon={<FolderOpenIcon />}
          onClick={() => {
            handleNavigate("/projects");
          }}
        />
        <BottomNavigationAction
          label="Invites"
          value="Invites"
          icon={<PersonAddIcon />}
          onClick={() => {
            handleNavigate("/invites");
          }}
        />
        <BottomNavigationAction
          label="Sessions"
          value="Sessions"
          icon={<ClearAllIcon />}
          onClick={() => {
            handleNavigate("/sessions");
          }}
        />
      </BottomNavigation>
      <Outlet />
    </div>
  );
}

export default MobileNavbar;
