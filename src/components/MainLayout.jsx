import { Link, Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_HOST } from "../utils/api";

function MainLayout() {
  const [userDetails, setUserDetails] = useState({});
  const [profileVisibility, setProfileVisibility] = useState(false);

  let navigator = useNavigate();

  useEffect(() => {
    loadUserDetails();
  }, []);

  const handleLogOut = () => {
    deleteSession();
    localStorage.removeItem("sessionid");
    navigator("/login");
  };

  async function deleteSession() {
    const id = localStorage.getItem("sessionid");
    const response = await fetch(
      `http://lizard-studios.at:10187/sessions/${id}`,
      {
        headers: {
          SessionID: id,
        },
        method: "DELETE",
      }
    );
  }

  const loadUserDetails = async () => {
    const response = await fetch(`${API_HOST}/users/details`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    setUserDetails(responseJSON.user);
    console.log(responseJSON);
  };

  return (
    <div className="w-full h-screen flex">
      <div className="h-full w-[200px] shadow-xl bg-white overflow-y-auto">
        <div className="flex flex-col items-center mt-6 mb-4 relative">
          <img
            onClick={() => setProfileVisibility(!profileVisibility)}
            className="w-[80px] h-[80px] object-cover rounded-full shadow-sm"
            src={`${API_HOST}/${userDetails.profile_picture_url}`}
            alt=""
          />
          {profileVisibility && (
            <div className="w-full flex flex-col bg-white absolute top-[103%] max-xl:top-20 h-fit shadow-2xl rounded-md z-10">
              <div className="w-full items-center my-[6%] flex flex-col">
                <a
                  className="text-gray-700 text-md hover:bg-gray-50 duration-300 w-full pl-[20px] py-[2px]"
                  href="/profile"
                >
                  Profil
                  <div className="border-b-[1px]"></div>
                </a>
                <a
                  className="text-gray-700 text-md hover:bg-gray-50 duration-300 w-full pl-[20px] py-[2px]"
                  href="/invites"
                >
                  Einladungen
                </a>
                <a
                  className="text-gray-700 text-md hover:bg-gray-50 duration-300 w-full pl-[20px] py-[2px]"
                  href="/sessions"
                >
                  Sitzungen
                </a>
                <p
                  className="cursor-pointer text-gray-700 text-md hover:bg-gray-50 duration-300 w-full pl-[20px] py-[2px]"
                  onClick={handleLogOut}
                >
                  Ausloggen
                </p>
              </div>
            </div>
          )}
        </div>
        <ul className="flex flex-col text-black items-center gap-2">
          <li>
            <Link to="/projects">Overview</Link>
          </li>
          <li>
            <Link to="/create">Create Project</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export default MainLayout;
