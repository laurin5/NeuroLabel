import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";

function CreatePage() {
  const projectnameInput = useRef(null);
  const projectdescriptionInput = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");
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
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  async function createProject() {
    const formData = new FormData();
    formData.append("image", uploadFile);

    const response2 = await fetch(`${API_HOST}/files`, {
      method: "POST",
      headers: {
        sessionid: localStorage.getItem("sessionid"),
      },
      body: formData,
    });

    const responseJSON2 = await response2.json();

    const response = await fetch(`${API_HOST}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SessionID: localStorage.getItem("sessionid"),
      },
      body: JSON.stringify({
        name: projectnameInput.current.value,
        description: projectdescriptionInput.current.value,
        image_url: responseJSON2.filename,
      }),
    });

    const responseJSON = await response.json();

    navigator("/projects");
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
      file.name;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        className="w-[35%] max-lg:w-[80%] max-lg:h-screen max-md:my-auto h-auto bg-white px-[2%] my-6 py-[2%] max-md:py-[5%] shadow-xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          <h1 className="text-xl text-center font-medium mb-[6%]">
            Neues Projekt erstellen
          </h1>
          <label
            className="block text-gray-800 text-lg font-normal tracking-tighter"
            htmlFor="projectName"
          >
            Name des Projekts
          </label>
          <input
            className="border shadow appearance-none rounded w-full text-md text-gray-700 leading-tight focus:outline-none pl-2 py-[2%]"
            ref={projectnameInput}
            type="text"
            name="projectName"
            placeholder="Name"
          />
          <label
            className="mt-[6%] block text-gray-800 text-lg font-normal tracking-tighter"
            htmlFor="projectDescription"
          >
            Beschreibung des Projekts
          </label>
          <textarea
            rows="4"
            className="resize-none border shadow appearance-none rounded w-full text-lg text-gray-700 leading-tight focus:outline-none pl-2 py-[1%]"
            ref={projectdescriptionInput}
            type="text"
            name="projectDescription"
          />
        </div>
        <div className="">
          <label
            className="mt-[6%] mb-[2%] block text-gray-800 text-lg font-normal tracking-tighter"
            htmlFor="fileInput"
          >
            Lade ein Bild hoch
          </label>
        </div>
        {file ? (
          <div className="flex flex-col items-center relative">
            <img
              className="max-h-[150px] w-[50%] object-cover mb-[6%]"
              src={file}
              alt=""
            />
            <p
              onClick={() => setFile(undefined)}
              className="absolute top-0 right-10 text-lg cursor-pointer"
            >
              &times;
            </p>
          </div>
        ) : (
          <div className="relative w-[100%] h-[150px] border-2 border-gray-2 rounded-md 00 mb-[6%] items-center flex justify-center">
            <input
              name="fileInput"
              type="file"
              className="w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileInput}
            />
            <p className="absolute italic text-gray-400 z-0">
              Bild hier hochladen
            </p>
          </div>
        )}
        {fileName && (
          <div className="mb-[6%] border rounded-md p-2 text-lg text-gray-700">
            <span className="text-gray-400">
              {fileName ? `${fileName}` : ""}
            </span>
          </div>
        )}
        <button
          className="py-[3%] duration-300 hover:bg-blue-500 bg-blue-600 text-xl text-white w-full rounded-md font-semibold"
          type="submit"
          onClick={() => {
            createProject();
          }}
        >
          Erstellen
        </button>
      </form>
    </div>
  );
}

export default CreatePage;
