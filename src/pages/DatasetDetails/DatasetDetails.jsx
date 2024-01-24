import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

const DatasetDetails = () => {
  let location = useLocation();
  let taskDescription = useRef(null);
  let labelName = useRef(null);

  const [getTasks, setGetTasks] = useState([]);
  const [getLabels, setGetLabels] = useState([]);
  const [taskVisibility, setTaskVisibility] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskSettings, setTaskSettings] = useState(false);
  const [labelVisibility, setLabelVisibility] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [labelSettings, setLabelSettings] = useState(false);

  const createNewTask = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${location.state.dataId}/tasks`,
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
    console.log(responseJSON);
    fetchTasks();
  };

  const fetchTasks = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${location.state.dataId}/tasks`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setGetTasks(responseJSON.tasks);
  };

  async function deleteTask(taskId) {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setTaskSettings(!taskSettings);
    fetchTasks();
  }

  async function deleteLabel(labelId) {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/labels/${labelId}`,
      {
        method: "DELETE",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setLabelSettings(!labelSettings);
    fetchLabels();
  }

  const createNewLabel = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${location.state.dataId}/labels`,
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
    console.log(responseJSON);
    setSelectedLabelId(responseJSON.id);
    fetchLabels();
  };

  const fetchLabels = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${location.state.dataId}/labels`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setGetLabels(responseJSON.labels);
  };

  useEffect(() => {
    fetchTasks();
    fetchLabels();
  }, []);

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
    <div className="w-full h-full flex flex-col items-center bg-gray-200 overflow-auto overflow-x-hidden">
      <p className="text-xl font-semibold mt-[1%]">Tasks und Labels</p>
      <p className="w-full text-xl my-[1%] ml-[2%]">Tasks</p>
      <div className="flex bg-white w-[90%]">
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
                Task erstellen
              </p>
              <p className="text-center">
                Geben Sie hier die Beschreibung ihrer Task ein
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
                Submit
              </button>
            </div>
          </div>
        )}
        <div
          className={`${
            getTasks.length >= 1
              ? "bg-white gap-6 p-6 grid max-sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 w-full hover:shadow-md"
              : "gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[92%]"
          } `}
        >
          {getTasks.map((task, index) => (
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-50 hover:shadow-md relative border-2 h-[150px] border-gray-200 justify-center text-sm flex flex-col items-center gap-1 pb-8">
              <p>Task:</p>
              <p className="text-md text-center font-mono w-[90%]">
                {task.task}
              </p>
              <MoreVertIcon
                className="absolute bottom-1 right-0 cursor-pointer"
                fontSize="small"
                onClick={() => handleTaskSettings(index)}
              />
              {taskSettings && selectedTaskId === index && (
                <div
                  onClick={() => deleteTask(task.id)}
                  className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] py-2 z-10"
                >
                  <button className="max-md:text-center w-full">
                    Task löschen
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            className="h-[150px] border-2 w-full text-white border-gray-200"
            onClick={handleTaskClick}
          >
            <AddIcon color="primary" />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full items-center max-md:mb-[15%] mb-[5%]">
        <p className="w-full text-xl my-[1%] ml-[2%]">Labels</p>
        <div className="flex bg-white w-[90%]">
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
                  Label erstellen
                </p>
                <p className="text-center">
                  Geben Sie hier den Namen ihres Labels ein!
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
                  Submit
                </button>
              </div>
            </div>
          )}
          <div
            className={`${
              getLabels.length >= 1
                ? "bg-white gap-6 p-6 grid max-sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 w-full hover:shadow-md"
                : "gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[92%]"
            } `}
          >
            {getLabels.map((label, index) => (
              <div className="w-full bg-gradient-to-br from-gray-100 to-gray-50 hover:shadow-md relative border-2 h-[150px] border-gray-200 justify-center text-sm flex flex-col items-center gap-1 pb-8">
                <p>Label:</p>
                <p className="text-md text-center font-mono w-[90%]">
                  {label.label}
                </p>
                <MoreVertIcon
                  className="absolute bottom-1 right-0 cursor-pointer"
                  fontSize="small"
                  onClick={() => handleLabelSettings(index)}
                />
                {labelSettings && selectedLabelId === index && (
                  <div
                    onClick={() => deleteLabel(label.id)}
                    className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] py-2 z-10"
                  >
                    <button className="max-lg:text-center w-full">
                      Label löschen
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              className="h-[150px] border-2 w-full text-white border-gray-200"
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
