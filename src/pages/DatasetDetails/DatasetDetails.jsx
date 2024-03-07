import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { API_HOST } from "../../utils/api";

const DatasetDetails = () => {
  let location = useLocation();
  let taskDescription = useRef(null);
  let labelName = useRef(null);
  let renameTaskInput = useRef(null);
  let renameLabelInput = useRef(null);
  let navigator = useNavigate();

  const [getTasks, setGetTasks] = useState([]);
  const [getLabels, setGetLabels] = useState([]);
  const [taskVisibility, setTaskVisibility] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskSettings, setTaskSettings] = useState(false);
  const [labelVisibility, setLabelVisibility] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [labelSettings, setLabelSettings] = useState(false);
  const [renameTask, setRenameTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [renameLabel, setRenameLabel] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const newTaskName = async () => {
    const response = await fetch(
      `${API_HOST}/projects/datasets/tasks/${selectedTask}`,
      {
        method: "PUT",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_task:
            renameTaskInput.current.value.length >= 1
              ? renameTaskInput.current.value
              : selectedTask.name,
        }),
      }
    );
    const responseJSON = await response.json();

    fetchTasks();
  };

  const newLabelName = async () => {
    const response = await fetch(
      `${API_HOST}/projects/datasets/labels/${selectedLabel}`,
      {
        method: "PUT",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_label:
            renameLabelInput.current.value.length >= 1
              ? renameLabelInput.current.value
              : selectedLabel.name,
        }),
      }
    );
    const responseJSON = await response.json();

    fetchLabels();
  };

  const createNewTask = async () => {
    const response = await fetch(
      `${API_HOST}/projects/datasets/${location.state.dataId}/tasks`,
      {
        method: "POST",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: taskDescription.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    fetchTasks();
  };

  const fetchTasks = async () => {
    const response = await fetch(
      `${API_HOST}/projects/datasets/${location.state.dataId}/tasks`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    setGetTasks(responseJSON.tasks);
  };

  async function deleteTask(taskId) {
    let response = await fetch(
      `${API_HOST}/projects/datasets/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    setTaskSettings(!taskSettings);
    fetchTasks();
  }

  async function deleteLabel(labelId) {
    let response = await fetch(
      `${API_HOST}/projects/datasets/labels/${labelId}`,
      {
        method: "DELETE",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    setLabelSettings(!labelSettings);
    fetchLabels();
  }

  const createNewLabel = async () => {
    const response = await fetch(
      `${API_HOST}/projects/datasets/${location.state.dataId}/labels`,
      {
        method: "POST",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: labelName.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    responseJSON;
    setSelectedLabelId(responseJSON.id);
    fetchLabels();
  };

  const fetchLabels = async () => {
    const response = await fetch(
      `${API_HOST}/projects/datasets/${location.state.dataId}/labels`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    responseJSON;
    setGetLabels(responseJSON.labels);
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
      fetchTasks();
      fetchLabels();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  const handleTaskClick = () => {
    setTaskVisibility(true);
    setTaskSettings(false);
    setLabelSettings(false);
  };

  const handleTaskSettings = (index) => {
    setSelectedTaskId(index);
    setTaskSettings(!taskSettings);
  };

  const handleLabelClick = () => {
    setLabelVisibility(true);
    setLabelSettings(false);
    setTaskSettings(false);
  };

  const handleLabelSettings = (index) => {
    setSelectedLabelId(index);
    setLabelSettings(!labelSettings);
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto overflow-x-hidden">
      <div className="flex w-full flex-col items-center">
        <p className="text-white text-2xl mt-2 font-semibold w-full text-center">
          Aufgaben und Kategorien
        </p>
        <p className="text-white italic text-center w-[80%] my-2">
          Unten finden Sie eine Übersicht Ihrer erstellten Aufgabe und
          Kategorien. Sie haben die Option, weitere Aufgaben oder Kategorien
          hinzuzufügen. Weitere Bearbeitungsoptionen finden Sie in den
          Menüpunkten mit den drei gestapelten Punkten.
        </p>
      </div>
      <p className="w-full text-xl my-[1%] ml-[2%] text-white font-medium tracking-wide">
        Aufgaben
      </p>
      <div className="flex bg-white w-[90%] rounded-md shadow-md">
        {taskVisibility && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
            <div className="w-1/3 h-2/4 max-md:h-2/3 rounded-md bg-white flex items-center flex-col pt-8 gap-4 max-md:w-[90%] absolute">
              <p
                onClick={() => {
                  setTaskVisibility(false);
                }}
                className="text-2xl absolute top-0 right-3 cursor-pointer"
              >
                &times;
              </p>
              <p className="font-semibold text-xl mt-[3%] mb-[5%]">
                Aufgabe erstellen
              </p>
              <p className="text-center">
                Geben Sie hier die Beschreibung ihrer Aufgabe ein
              </p>
              <input
                ref={taskDescription}
                type="text"
                className="border shadow appearance-none rounded w-[60%] text-md text-gray-700 leading-tight focus:outline-none pl-2 py-[2%]"
                placeholder="Name"
              />
              <button
                onClick={() => {
                  createNewTask();
                  setTaskVisibility(false);
                }}
                className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md mt-[12%]"
              >
                Bestätigen
              </button>
            </div>
          </div>
        )}
        {renameTask && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-20">
            <div className="max-md:w-[90%] w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8">
              <p
                onClick={() => {
                  setRenameTask(false);
                }}
                className="cursor-pointer absolute top-[26%] right-[35%] text-xl"
              >
                &times;
              </p>
              <label htmlFor="renameDataset">Wie soll der neue Name sein</label>
              <input
                ref={renameTaskInput}
                type="text"
                placeholder="Name"
                className="border-2 p-2 rounded-md outline-none"
              />
              <button
                onClick={() => {
                  newTaskName();
                  setRenameTask(false);
                  setTaskSettings(false);
                }}
                className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md"
              >
                Bestätigen
              </button>
            </div>
          </div>
        )}
        <div
          className={`${
            getTasks.length >= 1
              ? "bg-white gap-6 p-6 grid grid-cols-2 max-md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full shadow-md rounded-md"
              : "gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2 xl:grid-cols-4 w-[92%] rounded-md"
          } `}
        >
          {getTasks.map((task, index) => (
            <div className="w-full bg-white hover:shadow-lg shadow-md relative border-2 h-[150px] border-gray-200 justify-center text-sm flex flex-col items-center gap-1 pb-8">
              <p>Aufgabe:</p>
              <p className="text-md text-center font-mono w-[90%]">
                {task.task}
              </p>
              <MoreVertIcon
                className="absolute bottom-1 right-0 cursor-pointer"
                fontSize="small"
                onClick={() => handleTaskSettings(index)}
              />
              {taskSettings && selectedTaskId === index && (
                <div className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] z-10 items-start flex flex-col">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
                  >
                    Aufgabe löschen
                  </button>
                  <button
                    onClick={() => {
                      setRenameTask(!renameTask);
                      setSelectedTask(task.id);
                    }}
                    className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
                  >
                    Aufgabe umbennenen
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            className="h-[150px] border-2 w-full text-white border-gray-200 shadow-md hover:shadow-lg"
            onClick={handleTaskClick}
          >
            <AddIcon color="primary" />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full items-center max-md:mb-[15%] mb-[5%]">
        <p className="w-full text-xl my-[1%] ml-[2%] text-white font-medium tracking-wide">
          Kategorien
        </p>
        <div className="flex bg-white w-[90%] shadow-md rounded-md">
          {labelVisibility && (
            <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
              <div className="w-1/3 h-2/4 rounded-md bg-white flex items-center flex-col pt-8 gap-4 max-md:w-[90%] absolute">
                <p
                  onClick={() => {
                    setLabelVisibility(false);
                  }}
                  className="text-2xl absolute top-0 right-3 cursor-pointer"
                >
                  &times;
                </p>
                <p className="font-semibold text-xl mt-[3%] mb-[5%]">
                  Kategorie erstellen
                </p>
                <p className="text-center">
                  Geben Sie hier den Namen Ihrer Kategorie ein!
                </p>
                <input
                  ref={labelName}
                  type="text"
                  className="border shadow appearance-none rounded w-[60%] text-md text-gray-700 leading-tight focus:outline-none pl-2 py-[2%]"
                  placeholder="Name"
                />
                <button
                  onClick={() => {
                    createNewLabel();
                    setLabelVisibility(false);
                  }}
                  className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md mt-[12%]"
                >
                  Bestätigen
                </button>
              </div>
            </div>
          )}
          {renameLabel && (
            <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-20">
              <div className="max-md:w-[90%] w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8">
                <p
                  onClick={() => {
                    setRenameLabel(false);
                  }}
                  className="cursor-pointer absolute top-[26%] right-[35%] text-xl"
                >
                  &times;
                </p>
                <label htmlFor="renameDataset">
                  Wie soll der neue Name sein
                </label>
                <input
                  ref={renameLabelInput}
                  type="text"
                  placeholder="Name"
                  className="border-2 p-2 rounded-md outline-none"
                />
                <button
                  onClick={() => {
                    newLabelName();
                    setRenameLabel(false);
                    setLabelSettings(false);
                  }}
                  className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md"
                >
                  Bestätigen
                </button>
              </div>
            </div>
          )}
          <div
            className={`${
              getLabels.length >= 1
                ? "bg-white gap-6 p-6 grid grid-cols-2 max-md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 w-full shadow-md rounded-md"
                : "gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[92%]"
            } `}
          >
            {getLabels.map((label, index) => (
              <div className="w-full bg-white shadow-md hover:shadow-xl relative border-2 h-[100px] border-gray-200 justify-center text-sm flex flex-col items-center gap-1 pb-2">
                <p className="text-md text-center font-mono w-[90%]">
                  {label.label.length > 10
                    ? `${label.label.slice(0, 10)}...`
                    : label.label}
                </p>
                <MoreVertIcon
                  className="absolute bottom-1 right-0 cursor-pointer"
                  fontSize="small"
                  onClick={() => handleLabelSettings(index)}
                />
                {labelSettings && selectedLabelId === index && (
                  <div className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[120%] z-10 items-start flex flex-col">
                    <button
                      onClick={() => deleteLabel(label.id)}
                      className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
                    >
                      Kategorie löschen
                    </button>
                    <button
                      onClick={() => {
                        setRenameLabel(!renameLabel);
                        setSelectedLabel(label.id);
                      }}
                      className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
                    >
                      Kategorie umbennenen
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              className="h-[100px] border-2 w-full text-white border-gray-200 shadow-md hover:shadow-lg"
              onClick={handleLabelClick}
            >
              <AddIcon color="primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;
