import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_HOST } from "../utils/api";

function MainLayout() {
  const [userDetails, setUserDetails] = useState({});

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
    <div className="w-full">
      <div className="w-full shadow-md bg-white flex items-center justify-around pt-2 sticky top-0 z-10">
        <img
          onClick={() => navigator("/projects")}
          src="/Neuro_Label.svg"
          className="object-cover w-[50px]"
        />
        <div className="w-full flex items-center justify-center gap-32">
          <a
            className="text-gray-700 text-md hover:border-b-2 hover:border-blue-600 duration-150"
            href="/invites"
          >
            Einladungen
          </a>
          <a
            className="text-gray-700 text-md hover:border-b-2 hover:border-blue-600 duration-150"
            href="/sessions"
          >
            Sitzungen
          </a>
          <p
            className="cursor-pointer text-gray-700 hover:border-b-2 hover:border-blue-600 duration-150"
            onClick={handleLogOut}
          >
            Ausloggen
          </p>
        </div>
        <div className="flex justify-end mr-4">
          <img
            onClick={() => navigator("/profile")}
            className="w-[50px] h-[50px] object-cover rounded-full shadow-sm mb-2"
            src={`${API_HOST}/${userDetails.profile_picture_url}`}
            alt=""
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default MainLayout;
