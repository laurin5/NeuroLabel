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
      <div className="w-full shadow-md bg-stone-50 flex items-center justify-between sticky top-0 z-10 py-4 px-8">
        <img
          onClick={() => navigator("/projects")}
          src="/Neuro_Label.png"
          className="object-cover w-[50px] h-[50px] cursor-pointer"
          alt="Projects"
        />
        <ul className="flex items-center gap-8">
          <li>
            <Link
              to="/invites"
              className="text-gray-700 text-md hover:border-b-2 hover:border-blue-600 duration-150"
            >
              Einladungen
            </Link>
          </li>
          <li>
            <Link
              to="/sessions"
              className="text-gray-700 text-md hover:border-b-2 hover:border-blue-600 duration-150"
            >
              Sitzungen
            </Link>
          </li>
          <li
            className="cursor-pointer text-gray-700 hover:border-b-2 hover:border-blue-600 duration-150"
            onClick={handleLogOut}
          >
            Ausloggen
          </li>
        </ul>
        <li className="flex justify-end">
          <img
            onClick={() => navigator("/profile")}
            className="w-[50px] h-[50px] object-cover rounded-full shadow-sm cursor-pointer"
            src={`${API_HOST}/${userDetails.profile_picture_url}`}
            alt="Profile"
          />
        </li>
      </div>
      <Outlet />
    </div>
  );
}

export default MainLayout;
