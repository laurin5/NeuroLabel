import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_HOST } from "../utils/api";

function MainLayout() {
  const [userDetails, setUserDetails] = useState({});

  let navigator = useNavigate();

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
    <div className="w-full">
      {localStorage.getItem("sessionid") != null && (
        <div className="w-full shadow-md bg-stone-50 flex items-center justify-between sticky top-0 z-10 py-4 px-8">
          <img
            onClick={() =>
              localStorage.getItem("sessionid") != null
                ? navigator("/projects")
                : ""
            }
            src="/Neuro_Label.png"
            className="object-cover w-[50px] h-[50px] cursor-pointer"
            alt="Projects"
          />
          <ul className="flex items-center gap-8">
            <li>
              <Link
                to="/invites"
                className="cursor-pointer text-gray-700 text-md hover:border-b-2 hover:border-gray-700 duration-150"
              >
                Einladungen
              </Link>
            </li>
            <li>
              <Link
                to="/sessions"
                className="cursor-pointer text-gray-700 text-md hover:border-b-2 hover:border-gray-700 duration-150"
              >
                Sitzungen
              </Link>
            </li>
            {userDetails.is_admin && (
              <li>
                <Link
                  to="/admin"
                  className="cursor-pointer text-gray-700 text-md hover:border-b-2 hover:border-gray-700 duration-150"
                >
                  Nutzerverwaltung
                </Link>
              </li>
            )}
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
      )}
      {localStorage.getItem("sessionid") == null && (
        <div className="w-full shadow-md bg-stone-50 flex items-center justify-center sticky top-0 z-10 py-4 px-8">
          <img
            src="/Neuro_Label.png"
            className="object-cover w-[50px] h-[50px] cursor-pointer"
            alt="Projects"
          />
          <h1 className="font-semibold cursor-pointer">N E U R O L A B E L</h1>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default MainLayout;
