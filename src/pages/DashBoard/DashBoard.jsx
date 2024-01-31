import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { API_HOST } from "../../utils/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [projectSettings, setProjectSettings] = useState(false);

  async function loadProjects() {
    let response = await fetch(`${API_HOST}/projects`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });

    let responseJSON = await response.json();
    setProjects(responseJSON.projects);
    console.log(responseJSON);
  }

  const loadUserDetails = async () => {
    let response = await fetch(`${API_HOST}/users/details`, {
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

  async function deleteProjects(projectID) {
    let response = await fetch(`${API_HOST}/projects/${projectID}`, {
      method: "DELETE",
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    console.log(responseJSON);
    loadProjects();
    setProjectSettings(!projectSettings);
  }

  return (
    <div className="w-full h-full flex flex-col items-center pb-10">
      <h1 className="text-white text-center text-2xl py-1 tracking-wide mt-[1%] font-semibold">
        Überblick
      </h1>
      <h1 className="w-full text-left pl-[4%] text-lg py-[2%] text-white italic font-semibold">
        Willkommen {userDetails.first_name}!
      </h1>
      {projects.length < 1 && !userDetails.is_admin && (
        <div className="w-full h-full items-center justify-center flex">
          <p className="max-md:text-lg italic text-2xl text-white">
            Sie sind derzeit in keinem Projekt!
          </p>
        </div>
      )}
      <div
        className={`${
          projects.length >= 1
            ? "bg-white gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[96%] rounded-md shadow-md"
            : `gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[92%] ${
                userDetails.is_admin ? "bg-white" : ""
              } rounded-md`
        } `}
      >
        {projects.map((project, index) => (
          <div
            className="hover:shadow-lg shadow-md relative border-2 w-full border-gray-200 text-center text-sm flex flex-col items-center gap-1 pb-8"
            key={project.id}
          >
            <Link
              className="w-full"
              to={`/projects/${project.id}`}
              state={{ isAdmin: project.is_admin }}
              key={project.id}
            >
              <div className="w-full flex items-center flex-col">
                <img
                  src={`${API_HOST}/${project.image_url}`}
                  className="h-[150px] w-full object-cover"
                  alt=""
                />
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
            {userDetails.is_instructor && (
              <button onClick={() => handleProjectSettingsClick(index)}>
                <MoreVertIcon
                  className="absolute bottom-2 right-2"
                  color="black"
                  fontSize="small"
                />
              </button>
            )}
            {projectSettings && selectedProjectIndex === index && (
              <div
                onClick={() => deleteProjects(project.id)}
                className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] z-10 items-start flex flex-col"
              >
                <button className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]">
                  Projekt löschen
                </button>
              </div>
            )}
          </div>
        ))}
        <div>
          {userDetails.is_admin && (
            <Link to="/create">
              <button className="h-[238px] border-2 border-gray-200 w-full text-white shadow-md hover:shadow-lg">
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
