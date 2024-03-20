import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";

const FeedbackPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(null);
  const [randomImage, setRandomImage] = useState([]);
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
      loadProjects();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  async function loadProjects() {
    let response = await fetch(`${API_HOST}/projects`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });

    const responseJSON = await response.json();
    setProjects(responseJSON.projects);
    console.log(responseJSON);
  }

  const getRandomEntry = async (projectId) => {
    let response = await fetch(
      `${API_HOST}/projects/${projectId}/entries/random`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setRandomImage(responseJSON.images[0]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center mt-4">
      <p className="text-white italic max-md:text-sm text-center w-[80%]">
        Auf dieser Seite sehen Sie Projekte, in denen Sie Mitglied sind. Per
        Tastendruck können Sie auswählen aus welchem Projekt sie zufällige
        Bilder bewerten wollen. Sie werden ein zufälliges Bild aus diesem
        Projekt bekommen und müssen bestimmen, ob die dazu gehörigen Kategorien
        zu dem Bild passen.
      </p>
      <p className="w-full text-xl my-[1%] pl-[2%] mt-4 text-white font-medium tracking-wide">
        Ihre Projekte
      </p>
      <div className="grid grid-cols-10 max-md:grid-cols-4 w-full items-top justify-center p-4 gap-4">
        {projects.map((project, index) => (
          <div
            className={`hover:shadow-lg shadow-md relative border-2 w-full border-gray-200 text-center text-sm flex flex-col items-center gap-1 ${
              currentProjectIndex === index
                ? "bg-green-400/80 duration-300"
                : ""
            }`}
            key={project.id}
          >
            <Link className="w-full" key={project.id}>
              <div className="w-full flex items-center flex-col">
                <img
                  onClick={() => {
                    if (currentProjectIndex === index) {
                      setCurrentProjectIndex(null);
                      setRandomImage("");
                    } else {
                      setCurrentProjectIndex(index);
                      getRandomEntry(project.id);
                    }
                  }}
                  src={`${API_HOST}/${project.image_url}`}
                  className="h-[50px] w-full object-cover"
                  alt=""
                />
                <h2
                  onMouseEnter={(e) => {
                    e.target.innerText = project.name;
                  }}
                  onMouseLeave={(e) => {
                    e.target.innerText =
                      project.name.length > 5
                        ? `${project.name.slice(0, 5)}...`
                        : project.name;
                  }}
                  className={`text-sm font-medium tracking-normal ${
                    currentProjectIndex === index ? "text-black" : "text-white"
                  }`}
                >
                  {project.name.length > 5
                    ? `${project.name.slice(0, 5)}...`
                    : project.name}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {currentProjectIndex != null && (
        <img
          className="object-cover h-96 max-md:h-[20%] max-md:w-[90%]"
          src={`${API_HOST}/${randomImage.image_recording_url}`}
          alt=""
        />
      )}
    </div>
  );
};

export default FeedbackPage;
