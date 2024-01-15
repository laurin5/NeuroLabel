import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [projectSettings, setProjectSettings] = useState(false);

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

  const handleProjectSettingsClick = (index) => {
    setSelectedProjectIndex(index);
    setProjectSettings(!projectSettings);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-200 overflow-y-auto pb-10">
      <h1 className="text-center text-xl py-1 tracking-wide mt-[1%] font-semibold">
        Ihre Projekte
      </h1>
      <h1 className="w-full text-left pl-[10%] text-lg py-[2%]">
        Willkommen {userDetails.first_name}!
      </h1>
      <div className="gap-6 p-4 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[92%] bg-white">
        {projects.map((project, index) => (
          <div
            className="hover:shadow-md w-full relative border-2 border-gray-200 rounded-sm py-1 text-center text-sm h-auto flex flex-col items-center gap-1 pb-8"
            key={project.id}
          >
            <Link
              className="w-full"
              to={`/projects/${project.id}`}
              state={{ isAdmin: project.is_admin }}
              key={project.id}
            >
              <div className="w-full flex items-center flex-col">
                <img src="firefox.png" className="h-[95px]" alt="" />
                <div className="w-full border-b-[1px]"></div>
                <h2 className="text-lg font-medium tracking-normal">
                  {project.name.length > 20
                    ? `${project.name.slice(0, 20)}...`
                    : project.name}
                </h2>
                <p className="relative bottom-0 left-0">
                  by {project.admin.first_name} {project.admin.last_name}
                </p>
              </div>
            </Link>
            <button onClick={() => handleProjectSettingsClick(index)}>
              <MoreVertIcon
                className="absolute bottom-2 right-2"
                color="black"
                fontSize="small"
              />
            </button>
            {projectSettings && selectedProjectIndex === index && (
              <div className="bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] py-2 z-10">
                <button className="">Projekt löschen</button>
              </div>
            )}
          </div>
        ))}
        <div>
          {userDetails.is_instructor && (
            <Link to="/create">
              <button className="border-2 border-gray-200 rounded-md w-full h-[187px] text-white mb-20">
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
