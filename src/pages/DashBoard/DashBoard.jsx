import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  async function loadProjects() {
    let response = await fetch("http://lizard-studios.at:10187/projects", {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });

    let responseJSON = await response.json();
    setProjects(responseJSON.projects);
    console.log(responseJSON);
  }

  const loadUserDetails = async () => {
    let response = await fetch("http://lizard-studios.at:10187/users/details", {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });

    let responseJSON = await response.json();
    setUserDetails(responseJSON.user);
    console.log(responseJSON);
  };

  useEffect(() => {
    loadProjects();
    loadUserDetails();
  }, []);

  return (
    <div className="w-full h-screen">
      <h1 className="text-center text-2xl py-1 font-semibold">Projekte</h1>
      <div className="border-b-[1px] border-black"></div>
      <div className="gap-4 p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            to={`/projects/${project.id}`}
            state={{ isAdmin: project.is_admin }}
            key={project.id}
          >
            <div
              className="shadow-black shadow-sm rounded-md p-2 text-center text-sm h-auto w-auto flex flex-col items-center gap-1 relative"
              key={project.id}
            >
              <img src="firefox.png" className="h-[75px] object-cover" alt="" />
              <div className="w-full border-b-[1px]"></div>
              <h2 className="text-sm">{project.name.length > 10 ? `${project.name.slice(0, 10)}...` : project.name}</h2>
            </div>
          </Link>
        ))}
        <div>
          {userDetails.is_instructor && (
            <Link to="/create">
              <button className="shadow-black shadow-sm rounded-md w-full h-full text-white mb-20">
                <AddIcon color="primary" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
