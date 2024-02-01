import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { API_HOST } from "../../utils/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [projectSettings, setProjectSettings] = useState(false);
  const [changeProjectSettings, setChangeProjectSettings] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");

  let projectNameInput = useRef(null);
  let projectDescriptionInput = useRef(null);
  let projectImageInput = useRef(null);

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

  async function changeProject() {
    const formData = new FormData();
    formData.append("image", uploadFile);

    const response = await fetch(`${API_HOST}/files`, {
      method: "POST",
      headers: {
        sessionid: localStorage.getItem("sessionid"),
      },
      body: formData,
    });

    const responseJSON = await response.json();
    console.log(responseJSON.filename);

    const response2 = await fetch(
      `${API_HOST}/projects/${projects[selectedProjectIndex].id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          SessionID: localStorage.getItem("sessionid"),
        },
        body: JSON.stringify({
          project_name: projectNameInput.current.value,
          project_description: projectDescriptionInput.current.value,
          image_url: responseJSON.filename,
        }),
      }
    );
    loadProjects();
    setProjectSettings(false);
    setChangeProjectSettings(false);
  }

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    setUploadFile(event.target.files[0]);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFile(reader.result);
      };

      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pb-10">
      <h1 className="text-white text-center text-2xl py-1 tracking-wide mt-[1%] font-semibold">
        Projektübersicht
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
              <div className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] z-10 items-start flex flex-col">
                <button
                  onClick={() => deleteProjects(project.id)}
                  className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
                >
                  Projekt löschen
                </button>
                <button
                  onClick={() =>
                    setChangeProjectSettings(!changeProjectSettings)
                  }
                  className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
                >
                  Projekt umbenennen
                </button>
              </div>
            )}
          </div>
        ))}
        {changeProjectSettings && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
            <div className="max-md:w-[90%] w-2/4 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8 relative">
              <p
                onClick={() => {
                  setChangeProjectSettings(false);
                  setProjectSettings(false);
                }}
                className="absolute top-3 right-5 text-lg cursor-pointer"
              >
                &times;
              </p>
              <form
                className="w-full flex flex-col items-center"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="w-[75%] bg-white flex flex-col p-6 rounded-md">
                  <div className="flex justify-between mb-[2%]">
                    <label htmlFor="projectName">Projekt Name</label>
                    <input
                      className="border shadow appearance-none rounded text-md text-gray-700 leading-tight focus:outline-none pl-2 py-2"
                      ref={projectNameInput}
                      type="text"
                      name="userLastName"
                      placeholder={projects[selectedProjectIndex].name}
                    />
                  </div>
                  <div className="flex justify-between">
                    <label htmlFor="projectDescription">
                      Projekt Beschreibung
                    </label>
                    <input
                      className="border shadow appearance-none rounded text-md text-gray-700 leading-tight focus:outline-none pl-2 py-2"
                      ref={projectDescriptionInput}
                      type="text"
                      name="userFirstName"
                      placeholder={projects[selectedProjectIndex].description}
                    />
                  </div>
                  <div className="">
                    <label
                      className="mt-[6%] mb-[2%] block text-gray-800 text-md font-normal tracking-tighter"
                      htmlFor="fileInput"
                    >
                      Neues Bild hochladen
                    </label>
                  </div>
                  {file ? (
                    <div className="flex flex-col items-center relative">
                      <img
                        className="h-[200px] w-[30%] object-cover mb-[6%]"
                        src={file}
                        alt=""
                      />
                      <p
                        onClick={() => setFile(undefined)}
                        className="absolute top-0 right-[20%] text-lg cursor-pointer"
                      >
                        &times;
                      </p>
                    </div>
                  ) : (
                    <div className="relative w-[100%] h-[200px] border-2 border-gray-2 rounded-md 00 mb-[6%] items-center flex justify-center">
                      <input
                        name="fileInput"
                        type="file"
                        className="w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileInput}
                      />
                      <p className="absolute italic text-gray-400">
                        Bild hier hochladen
                      </p>
                    </div>
                  )}
                  <div className="w-full items-center flex flex-col">
                    <button
                      className="py-2 px-3 bg-blue-600 rounded-md text-white "
                      onClick={() => changeProject()}
                    >
                      Profil aktualisieren
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
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
