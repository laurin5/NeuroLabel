import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePage() {
  const projectnameInput = useRef(null);
  const projectdescriptionInput = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  let navigator = useNavigate();
 
  async function createProject() {
    const response = await fetch("http://lizard-studios.at:10187/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        sessionid: localStorage.getItem("sessionid"),
      },
      body: JSON.stringify({
        name: projectnameInput.current.value,
        description: projectdescriptionInput.current.value,
      }),
    });

    const responseJSON = await response.json();
    navigator("/projects")
  }

  const handleFileInput = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFile(reader.result);
      };

      reader.readAsDataURL(file);
      setFileName(file.name);
      console.log(file.name)
    }
  };

  return (
    <div className="w-full h-screen flex justify-center my-10">
      <div className="">
        <h1 className="text-2xl">Neues Projekt erstellen</h1>
        <form name="lastName" onSubmit={createProject}>
          <div className="mt-4">
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="projectName"
            >
              Name des Projekts
            </label>
            <input
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              ref={projectnameInput}
              type="text"
              name="projectName"
              placeholder="Name"
            />
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="projectDescription"
            >
              Beschreibung des Projekts
            </label>
            <textarea
              rows="4"
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              ref={projectdescriptionInput}
              type="text"
              name="projectDescription"
            />
          </div>
          <div className="relative mt-4">
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="fileInput"
            >Lade ein Bild hoch</label>
            <input
              name="fileInput"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInput}
            />
            <div className="border rounded-md p-2 text-sm text-gray-700">
              <span className="text-gray-400">{fileName ? `${fileName}` : "Bild"}</span>
            </div>
          </div>
          {file && (
            <img className="mt-4 w-[250px]" src={file} alt="" />
          )}
          <button
            className="duration-300 hover:bg-blue-800 bg-blue-900 text-xl text-white w-full mt-4 py-2 rounded-sm font-semibold"
            type="submit"
          >
            Erstellen
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;