import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

const DatasetDetails = () => {
  let location = useLocation();
  let taskDescription = useRef(null);
  let labelName = useRef(null);
  let renameDatasetInput = useRef(null);
  let renameTaskInput = useRef(null);
  let renameLabelInput = useRef(null)

  const [getTasks, setGetTasks] = useState([]);
  const [getLabels, setGetLabels] = useState([]);
  const [taskVisibility, setTaskVisibility] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskSettings, setTaskSettings] = useState(false);
  const [labelVisibility, setLabelVisibility] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [labelSettings, setLabelSettings] = useState(false);
  const [renameDataset, setRenameDataset] = useState(false);
  const [datasetSettings, setDatasetSettings] = useState(false);
  const [renameTask, setRenameTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [renameLabel, setRenameLabel] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const newDatasetName = async() => {
    console.log(renameDatasetInput.current.value);
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${location.state.dataId}`,
      {
        method: "PUT",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_name: renameDatasetInput.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
  }

  const newTaskName = async() => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/tasks/${selectedTask}`,
      {
        method: "PUT",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_task: renameTaskInput.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);

    fetchTasks();
  }

  const newLabelName = async() => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/labels/${selectedLabel}`,
      {
        method: "PUT",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_label: renameLabelInput.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);

    fetchLabels();
  }

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
      <div className="flex w-full items-center">
        <p className="text-xl font-semibold w-full text-center">
          Tasks und Labels
        </p>
        <SettingsIcon
          onClick={() => setDatasetSettings(!datasetSettings)}
          className="absolute top-[13%] right-[5%]"
        />
        {datasetSettings && (
          <div className="cursor-pointer bg-white absolute shadow-xl top-[15%] border-[1px] border-gray-100 right-[6%] z-10 items-start flex flex-col py-2 px-1">
            <p onClick={() => setRenameDataset(!renameDataset)}>Datensatz umbennenen</p>
          </div>
        )}
        {renameDataset && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
            <div className="max-md:w-[90%] w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8">
              <p onClick={() => {
                setRenameDataset(false);
                setDatasetSettings(false);
              }} className="cursor-pointer absolute top-[26%] right-[35%] text-xl">&times;</p>
              <label htmlFor="renameDataset">Wie soll der neue Name sein</label>
              <input ref={renameDatasetInput} type="text" placeholder="Name" className="border-2 p-2 rounded-md outline-none"/>
              <button
                onClick={() => {
                  newDatasetName();
                  setRenameDataset(false);
                  setDatasetSettings(false);
                }}
                className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
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
        {renameTask && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-20">
            <div className="max-md:w-[90%] w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8">
              <p onClick={() => {
                setRenameTask(false);
              }} className="cursor-pointer absolute top-[26%] right-[35%] text-xl">&times;</p>
              <label htmlFor="renameDataset">Wie soll der neue Name sein</label>
              <input ref={renameTaskInput} type="text" placeholder="Name" className="border-2 p-2 rounded-md outline-none"/>
              <button
                onClick={() => {
                  newTaskName();
                  setRenameTask(false);
                  setTaskSettings(false);
                }}
                className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md"
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
                  className="cursor-pointer bg-white absolute flex flex-col gap-2 top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] py-2 z-10"
                >
                  <button onClick={() => deleteTask(task.id)} className="w-full text-left ml-2">
                    Task löschen
                  </button>
                  <button onClick={() => {
                    setRenameTask(!renameTask);
                    setSelectedTask(task.id);
                    }} 
                    className="w-full text-left ml-2">
                    Task umbennenen
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
          {renameLabel && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-20">
            <div className="max-md:w-[90%] w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8">
              <p onClick={() => {
                setRenameLabel(false);
              }} className="cursor-pointer absolute top-[26%] right-[35%] text-xl">&times;</p>
              <label htmlFor="renameDataset">Wie soll der neue Name sein</label>
              <input ref={renameLabelInput} type="text" placeholder="Name" className="border-2 p-2 rounded-md outline-none"/>
              <button
                onClick={() => {
                  newLabelName();
                  setRenameLabel(false);
                  setLabelSettings(false);
                }}
                className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md"
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
                  className="cursor-pointer bg-white absolute flex flex-col gap-2 top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] py-2 z-10"
                >
                  <button onClick={() => deleteLabel(label.id)} className="w-full text-left ml-2">
                    Label löschen
                  </button>
                  <button onClick={() => {
                    setRenameLabel(!renameLabel);
                    setSelectedLabel(label.id);
                    }} 
                    className="w-full text-left ml-2">
                    Label umbennenen
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
