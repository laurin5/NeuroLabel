import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setConfirmDelete(true);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="w-full h-screen">
      <h1 className="text-center text-2xl py-1 font-semibold">Projekte</h1>
      <div className="border-b-[1px] border-black"></div>
      <div className="gap-4 p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div>
          <Link to="/create">
            <button className="shadow-black shadow-sm rounded-md w-full h-full text-white">
              <AddIcon color="primary" />
            </button>
          </Link>
        </div>
        {projects.map((project) => (
          <Link
            className="z-0"
            to={`/projects/${project.id}`}
            state={{ isAdmin: project.is_admin }}
            key={project.id}
          >
            <div
              className="shadow-black shadow-sm rounded-md p-2 text-center text-sm h-auto w-auto flex flex-col items-center gap-1 relative"
              key={project.id}
            >
              {/* <p
                onClick={() => {
                  setConfirmDelete(true);
                }}
                className="text-2xl z-10 absolute top-0 right-2 cursor-pointer"
              >
                &times;
              </p> */}
              {confirmDelete && (
                <div>
                  <p>Willst du dieses Projekt wirklich löschen</p>
                  <div>
                    <button>Nein</button>
                    <button>Ja</button>
                  </div>
                </div>
              )}
              <img src="firefox.png" className="h-[75px] object-cover" alt="" />
              <div className="w-full border-b-[1px]"></div>
              <h2>{project.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
