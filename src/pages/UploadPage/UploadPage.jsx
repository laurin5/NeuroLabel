import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  const uploadFile = async () => {
    console.log(file);
    const formData = new FormData();
    formData.append("image", file);

    console.log(formData);
    console.log(selectedLabel);

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
          image_url: responseJSON1.filename,
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
    console.log(tasksData);
    setTasks(tasksData.tasks);

    const responseLabels = await fetch(
      `${API_HOST}/projects/datasets/${location.state.datasetId}/labels`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const labelsData = await responseLabels.json();
    console.log(labelsData);
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

      reader.readAsDataURL(file);
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
    fetchAll();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {currentTaskIndex < tasks.length && (
        <form
          className="flex flex-col w-[30%] rounded-md max-md:w-4/5 items-center bg-white shadow-md mt-[5%] px-10 py-10 gap-3"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl">Aufgabe {currentTaskIndex + 1}</h2>
          <h1>{tasks[currentTaskIndex].task}</h1>
          {filePreview && (
            <div className="image-preview">
              <img
                src={filePreview}
                className="max-h-[200px] bg-contain w-max-[80%]"
                alt="File Preview"
              />
            </div>
          )}
          {filePreview && (
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
          )}
          <label
            className="mt-[6%] mb-[2%] block text-gray-800 font-normal tracking-tighter text-md"
            htmlFor="fileInput"
          >
            Lade ein Bild hoch
          </label>
          <input
            name="fileInput"
            className="w-[50%] max-md:w-[95%] text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4 file:rounded-md
                      file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            type="file"
            onChange={handleFileChange}
            placeholder="Hier Bild hochladen"
          />
          <button
            onClick={() => {
              uploadFile();
              setSelectedLabel("");
            }}
          >
            Senden
          </button>
        </form>
      )}
      {currentTaskIndex >= tasks.length && tasks.length >= 1 && (
        <div className="text-xl w-full flex flex-col items-center justify-center mt-[15%] text-white italic">
          <p>Alle Aufgaben abgeschlossen!</p>
          <button onClick={() => setCurrentTaskIndex(0)}>
            Nochmal hochladen
          </button>
        </div>
      )}
      {tasks.length < 1 && (
        <div className="text-2xl w-full flex flex-col items-center justify-center mt-[15%] text-white italic">
          <p>Es sind keine Aufgaben in diesem Datensatz vorhanden!</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
