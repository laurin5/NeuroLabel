import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const UploadPage = () => {
  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [file, setFile] = useState(null);

  let location = useLocation();
  let navigator = useNavigate();

  let dataType = location.state.dataType;

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response1 = await fetch("http://lizard-studios.at:10187/files", {
      method: "POST",
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
      body: formData,
    });
    const responseJSON1 = await response1.json();

    const response2 = await fetch(
      `${API_HOST}/projects/datasets/${location.state.datasetId}/entries`,
      {
        method: "POST",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "content-type": "application/json",
        },
        body: JSON.stringify({
          [`${dataType}_url`]: responseJSON1.filename,
          label_uuid: selectedLabelId,
        }),
      }
    );
    const responseJSON2 = await response2.json();

    setFilePreview(null);
    setSelectedFile(null);
  };

  const fetchAll = async () => {
    const responseTasks = await fetch(
      `${API_HOST}/projects/datasets/${location.state.datasetId}/tasks`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const tasksData = await responseTasks.json();
    setTasks(tasksData.tasks);
    console.log(tasksData);

    const responseLabels = await fetch(
      `${API_HOST}/projects/datasets/${location.state.datasetId}/labels`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const labelsData = await responseLabels.json();
    setLabels(labelsData.labels);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files[0]);
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFilePreview(reader.result);
      };

      if (
        file.type.startsWith("audio/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("image/")
      ) {
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); // Clear file preview if it's not an audio, video or image file
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentTaskIndex((prevIndex) => prevIndex + 1);
    setSelectedFile(null);
    setFilePreview(null);
    setFile(null);
    setSelectedLabel("");
  };

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
    responseJSON;
    if (responseJSON.message == "Success.") {
      fetchAll();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {currentTaskIndex < tasks.length && (
        <form
          className="flex flex-col w-[30%] rounded-md max-lg:w-3/5 max-md:w-4/5 items-center bg-white shadow-md mt-[5%] px-10 py-10 gap-3"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl">Aufgabe {currentTaskIndex + 1}</h2>
          <h1>{tasks[currentTaskIndex].task}</h1>
          {filePreview && (
            <>
              {file.type.startsWith("audio/") && (
                <audio controls className="w-full" src={filePreview}>
                  Your browser does not support the audio element.
                </audio>
              )}
              {file.type.startsWith("video/") && (
                <video controls className="w-full" src={filePreview}>
                  Your browser does not support the video element.
                </video>
              )}
              {file.type.startsWith("image/") && (
                <img
                  className="max-h-[200px] bg-contain w-max-[80%]"
                  src={filePreview}
                  alt=""
                />
              )}
              {!file.type.startsWith("audio/") &&
                !file.type.startsWith("video/") &&
                !file.type.startsWith("image/") && (
                  <div className="flex flex-col items-center relative my-4">
                    <img
                      className="max-h-[200px] bg-contain w-max-[80%]"
                      src={filePreview}
                      alt=""
                    />
                  </div>
                )}
            </>
          )}
          {!filePreview && (
            <div className="relative w-[100%] h-[150px] border-2 border-gray-2 rounded-md 00 mb-[6%] items-center flex justify-center">
              <input
                name="fileInput"
                type="file"
                className="w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                accept="audio/*,video/*,image/*"
              />
              <p className="absolute italic text-gray-400 z-0">Hochladen</p>
            </div>
          )}
          {filePreview && (
            <div className="flex w-full items-center justify-center gap-4">
              <p>Wähle eine Kategorie</p>
              <Select
                className="w-[30%]"
                label="Label auswählen"
                value={selectedLabel}
                onChange={(e) => {
                  setSelectedLabel(e.target.value);
                  setSelectedLabelId(
                    labels.find((label) => label.label === e.target.value)?.id
                  );
                }}
              >
                {labels.map((label) => (
                  <MenuItem key={label.id} value={label.label}>
                    {label.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
          {filePreview && (
            <button
              className="py-2 px-2 bg-blue-600 text-white rounded-md w-[50%] mt-4 duration-300 hover:animate-pulse"
              onClick={() => {
                uploadFile();
                setSelectedLabel("");
              }}
            >
              Senden
            </button>
          )}
        </form>
      )}
      {currentTaskIndex >= tasks.length && tasks.length >= 1 && (
        <div className="text-xl w-full flex flex-col items-center justify-center mt-[15%] text-white italic">
          <p>Alle Aufgaben abgeschlossen!</p>
          <button
            className="border-white border-[1px] px-4 py-2 mt-10 rounded-md hover:bg-white hover:text-blue-600 duration-300"
            onClick={() => setCurrentTaskIndex(0)}
          >
            Nochmal hochladen
          </button>
        </div>
      )}
      {tasks.length < 1 && (
        <div className="text-2xl w-full flex flex-col items-center justify-center mt-[15%] text-white italic max-md:text-xl">
          <p>Es sind keine Aufgaben in diesem Datensatz vorhanden!</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
