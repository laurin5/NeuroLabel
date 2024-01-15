import { Link, Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

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

function MainLayout() {
  let navigator = useNavigate();

  const handleLogOut = () => {
    deleteSession();
    localStorage.removeItem("sessionid");
    navigator("/login");
  };

  return (
    <div className="w-full h-screen flex">
      <div className="h-full w-[200px] bg-gradient-to-br from-gray-800 to-gray-900 overflow-y-auto">
        <ul className="flex flex-col text-white items-center gap-2">
          <li>
            <Link to="/projects">Overview</Link>
          </li>
          <li>
            <Link to="/create">Create Project</Link>
          </li>
          <li>
            <Link to="/invites">Invites</Link>
          </li>
          <li>
            <Link to="/sessions">Sessions</Link>
          </li>
          <Button onClick={handleLogOut}>Log Out</Button>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export default MainLayout;
