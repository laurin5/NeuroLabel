import { useEffect, useState, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useParams, Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function ProjectDetails() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [showMember, setShowMember] = useState(false);
  const [details, setDetails] = useState({});
  const [toggleDatasetVisibility, setToggleDatasetVisibility] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [toggleTaskVisibility, setToggleTaskVisibility] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [toggleLabelVisibility, setToggleLabelVisibility] = useState(false);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [file, setFile] = useState(null);
  const [selectedLabelId, setSelectedLabelId] = useState("");
  const [thanks, setThanks] = useState(false);
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(null);
  const [datasetSettings, setDatasetSettings] = useState(false);
  const [memberVisibility, setMemberVisibility] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  let datasetName = useRef(null);
  let descriptionInput = useRef(null);
  let labelNameInput = useRef(null);

  let navigate = useNavigate();
  const params = useParams();
  let location = useLocation();

  async function kickUser(emailInput) {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/${params.id}/kick`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          email: emailInput,
        }),
      }
    );
    let responseJSON = await response.json();
    loadProjectDetails();
  }

  async function promoteUser(emailInput) {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/${params.id}/admins/toggle`,
      {
        headers: {
          "Content-Type": "application/json",
          SessionID: localStorage.getItem("sessionid"),
        },
        method: "PUT",
        body: JSON.stringify({
          email: emailInput,
        }),
      }
    );
    let responseJSON = await response.json();
    console.log(responseJSON);
    loadProjectDetails();
  }

  async function loadProjectDetails() {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/${params.id}/details`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );

    let responseJSON = await response.json();
    setDetails(responseJSON);
    setDataset(responseJSON.datasets);
    console.log(responseJSON);
  }

  useEffect(() => {
    loadProjectDetails();

    if (selectedDatasetId) {
      fetchTasks();
      fetchLabels();
    }
  }, [selectedDatasetId]);

  const handleButtonClick = () => {
    setVisible(true);
  };

  const showMemberOnClick = () => {
    setShowMember(true);
  };

  const handleDatasetSettings = (index) => {
    setSelectedDatasetIndex(index);
    setDatasetSettings(!datasetSettings);
  };

  const handleDatasetClick = (datasetId) => {
    setSelectedDatasetId(datasetId);
    handleButtonClick();
  };

  const handleLabelClick = (labelId) => {
    setSelectedLabelId(labelId);
  };

  const handleFileInput = (event) => {
    setFile(event.target.files[0]);
  };

  const createNewDataset = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/${params.id}/datasets`,
      {
        method: "POST",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: datasetName.current.value,
          upload_type: "image",
        }),
      }
    );
    loadProjectDetails();
  };

  const createNewTask = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${selectedDatasetId}/tasks`,
      {
        method: "POST",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: descriptionInput.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
  };

  const fetchTasks = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${selectedDatasetId}/tasks`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    setTasks(responseJSON.tasks);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const response1 = await fetch("http://lizard-studios.at:10187/files", {
      method: "POST",
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
      body: formData,
    });
    const responseJSON1 = await response1.json();

    const response2 = await fetch(
      `${API_HOST}/projects/datasets/${selectedDatasetId}/entries`,
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
    setThanks(true);
    setIndex(0);
  };

  async function deleteDataset(datasetId) {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${datasetId}`,
      {
        method: "DELETE",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    loadProjectDetails();
    setDatasetSettings(!datasetSettings);
  }

  const createNewLabel = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${selectedDatasetId}/labels`,
      {
        method: "POST",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: labelNameInput.current.value,
        }),
      }
    );
    const responseJSON = await response.json();
    setSelectedLabelId(responseJSON.id);
  };

  const fetchLabels = async () => {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/datasets/${selectedDatasetId}/labels`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    setLabels(responseJSON.labels);
  };

  const reload = () => {
    fetchTasks();
    fetchLabels();
  };

  return (
    <div className="w-full h-screen flex items-center pt-[2%] flex-col gap-4 bg-gray-200">
      {details.project && (
        <div className="flex flex-row w-full items-center justify-between px-[5%]">
          <div className="flex flex-col">
            <p className="text-xl w-full text-left ml-[8%]">
              {details.project.name}
            </p>
            <p className="text-left ml-[8%] text-md italic w-full">
              {details.project.description}
            </p>
          </div>
          {location.state.isAdmin && (
            <SettingsIcon
              className="cursor-pointer"
              onClick={() => {
                setSettingsVisibility(!settingsVisibility);
              }}
            />
          )}
        </div>
      )}
      {location.state.isAdmin && settingsVisibility && (
        <div className="flex flex-col bg-white absolute top-[10%] max-xl:top-[8%] right-[5%] w-[180px] h-fit shadow-xl rounded-md z-10">
          <div className="w-full items-center my-[6%] flex flex-col">
            <Link
              onClick={() => {
                localStorage.setItem("projectID", details.project.id);
              }}
              state={{ isAdmin: location.state.isAdmin }}
              to={"/invite/send"}
              className="text-gray-700 text-md hover:bg-gray-50 duration-300 w-full pl-[16px] py-[2px]"
            >
              Personen einladen
            </Link>
            <button
              onClick={showMemberOnClick}
              variant="contained"
              className="text-gray-700 text-md hover:bg-gray-50 duration-300 w-full pl-4 py-[2px] pr-[28px]"
            >
              Mitglieder ansehen
            </button>
          </div>
        </div>
      )}
      {dataset && dataset.length < 1 && !location.state.isAdmin && (
        <div className="mt-[20%] flex items-center justify-center max-md:mt-[40%] max-md:text-md">
          <p className="italic">
            In diesem Projekt wurde noch kein Datensatz erstellt!
          </p>
        </div>
      )}
      {dataset && dataset.length >= 1 && !location.state.isAdmin && (
        <p className="text-xl">Datensätze</p>
      )}
      {location.state.isAdmin && <p className="text-xl">Datensätze</p>}
      <div
        className={`${
          dataset && dataset.length >= 1
            ? "bg-white gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[96%] hover:shadow-md"
            : `gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2 xl:grid-cols-4 w-[92%] ${
                location.state.isAdmin ? "bg-white" : ""
              }`
        } `}
      >
        {dataset.map((data, index) => (
          <div className="w-full bg-gradient-to-br from-gray-100 to-gray-50 hover:shadow-md relative border-2 h-[150px] border-gray-200 text-center text-sm flex flex-col items-center gap-1 pb-8">
            <div
              key={data.id}
              className="text-lg relative w-full h-full flex justify-center items-center"
            >
              {data.name}
            </div>
            {location.state.isAdmin && (
              <button onClick={() => handleDatasetSettings(index)}>
                <MoreVertIcon
                  className="absolute bottom-1 right-1"
                  color="black"
                  fontSize="small"
                />
              </button>
            )}
            {datasetSettings &&
              selectedDatasetIndex === index &&
              location.state.isAdmin && (
                <div className="cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-[60%] z-10 items-start flex flex-col">
                  <button
                    onClick={() => deleteDataset(data.id)}
                    className="hover:bg-gray-50 w-full text-left pl-2 py-[3%]"
                  >
                    Datensatz löschen
                  </button>
                  <Link
                    to={`/projects/datasets/${data.id}`}
                    state={{ dataId: data.id }}
                    className="hover:bg-gray-50 w-full text-left pl-2 py-[3%] "
                  >
                    Datensatz bearbeiten
                  </Link>
                </div>
              )}
          </div>
        ))}
        {location.state.isAdmin && (
          <div>
            <button
              onClick={() => {
                setToggleDatasetVisibility(true);
              }}
              className="h-[150px] border-2 w-full text-white border-gray-200"
            >
              <AddIcon color="primary" />
            </button>
          </div>
        )}
      </div>
      {visible && index === 0 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="max-md:w-[90%] w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly">
            <p
              onClick={() => {
                setVisible(false);
              }}
              className="text-2xl absolute top-[14%] left-[85%] cursor-pointer"
            >
              &times;
            </p>
            <div className="max-md:w-[90%] w-full h-screen bg-white rounded-md flex items-center flex-col pt-8 justify-evenly">
              {location.state.isAdmin && (
                <div className="flex flex-col gap-4">
                  <Link
                    state={{ id: selectedDatasetId }}
                    className="text-blue-700 border-b-[1px] cursor-pointer"
                    to={`/projects/datasets/${selectedDatasetId}/entries`}
                  >
                    Schau die Entries dieses Datasets an
                  </Link>
                  <p
                    onClick={() => setToggleTaskVisibility(true)}
                    className="text-blue-700 border-b-[1px] cursor-pointer"
                  >
                    Task erstellen
                  </p>
                  <p
                    onClick={() => {
                      setToggleLabelVisibility(true);
                    }}
                    className="text-blue-700 border-b-[1px] cursor-pointer"
                  >
                    Labels erstellen
                  </p>
                </div>
              )}

              {toggleLabelVisibility && (
                <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0">
                  <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly max-md:w-[90%]">
                    <p
                      onClick={() => {
                        setToggleLabelVisibility(false);
                      }}
                      className="text-2xl absolute top-[14%] left-[85%] cursor-pointer"
                    >
                      &times;
                    </p>
                    <p>Name des Labels welches Sie erstellen wollen!</p>
                    <label htmlFor="labelName">Name</label>
                    <input
                      type="text"
                      placeholder="Name..."
                      name="labelName"
                      ref={labelNameInput}
                    />

                    <button
                      onClick={() => {
                        createNewLabel();
                        setToggleLabelVisibility(false);
                        reload();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {toggleTaskVisibility && (
                <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0">
                  <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly max-md:w-[90%]">
                    <p
                      onClick={() => {
                        setToggleTaskVisibility(false);
                      }}
                      className="text-2xl absolute top-[14%] left-[85%] cursor-pointer"
                    >
                      &times;
                    </p>
                    <p>Geben Sie die Beschreibung ihrer Task ein!</p>

                    <label htmlFor="description">Beschreibung</label>
                    <input
                      type="text"
                      placeholder="Beschreibung..."
                      name="description"
                      ref={descriptionInput}
                    />

                    <button
                      onClick={() => {
                        createNewTask();
                        setToggleTaskVisibility(false);
                        reload();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {thanks && (
                <h1 className="font-semibold">Danke fürs mitmachen!</h1>
              )}
              <button
                className="border-b-[1px] border-blue-700 text-blue-700"
                onClick={() => {
                  setIndex(1);
                }}
              >
                Hochladen
              </button>
            </div>
          </div>
        </div>
      )}
      {index == 1 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
          <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 gap-4 max-md:w-[90%] overflow-scroll">
            <p
              onClick={() => {
                setVisible(setIndex(0));
              }}
              className="text-2xl absolute top-[14%] left-[85%] cursor-pointer"
            >
              &times;
            </p>
            {tasks.map((task) => (
              <div
                key={task.task_no}
                className="w-full flex flex-col items-center"
              >
                <button
                  onClick={() => setIndex(index + 1)}
                  className="w-2/3 border-[1px] bg-blue-900 text-white py-2 rounded-sm"
                >
                  {task.task_no}: {task.task}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {index == 2 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
          <div className="relative w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 gap-4 max-md:w-[90%]">
            <div className=" mt-4 max-md:w-[60%] flex flex-col">
              <p
                onClick={() => {
                  setVisible(setIndex(0));
                  setSelectedLabel("");
                }}
                className="text-3xl absolute cursor-pointer top-0 right-4"
              >
                &times;
              </p>
            </div>
            <h1 className="text-xl font-semibold tracking-wide">
              Laden Sie hier ihr Bild hoch!
            </h1>
            <p className="text-md">Geben Sie ihrem Bild ein Label</p>
            <Select
              className="w-[30%]"
              label="Label auswählen"
              value={selectedLabel}
              onChange={(e) => {
                setSelectedLabel(e.target.value);
                handleLabelClick(
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
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-6 mt-10 justify-center items-center w-full"
            >
              <label htmlFor="fileUpload">Lade hier das Bild hoch</label>
              <input onChange={handleFileInput} type="file" required />
              <button
                className="mt-20 bg-blue-800 text-white w-[30%] py-2 rounded-sm hover:bg-blue-700 duration-300"
                onClick={() => {
                  uploadFile();
                  setSelectedLabel("");
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showMember && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
          <div className="relative w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 gap-4 max-md:w-[90%]">
            <p
              className="cursor-pointer absolute top-2 right-4 text-2xl"
              onClick={() => {
                setShowMember(false);
              }}
            >
              &times;
            </p>
            <div className="w-full flex flex-col justify-around">
              <div className="flex w-full justify-around border-b-2">
                <p className="font-semibold tracking-wider text-lg">
                  Vorname/Nachname
                </p>
                <p className="font-semibold tracking-wider text-lg">Rolle</p>
              </div>
              {details.members &&
                details.members.map((member, index) => (
                  <div
                    className={`${
                      index % 2 == 1
                        ? "bg-gray-100 flex flex-row justify-between w-full items-center border-b-2 pt-2"
                        : "bg-white flex flex-row justify-between w-full items-center border-b-2 pt-2"
                    }`}
                    key={member.id}
                  >
                    <div className="flex items-center gap-2 justify-start ml-[17%] w-full mb-2">
                      <img
                        src={`${API_HOST}/${member.profile_picture_url}`}
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                      <p>
                        {member.first_name} {member.last_name}{" "}
                        {member.is_participant && !member.is_instructor && (
                          <span className="absolute right-[12%]">
                            TeilnehmerIn
                          </span>
                        )}
                        {member.is_admin && (
                          <span className="absolute right-[16%]">LehrerIn</span>
                        )}
                      </p>
                      {!member.is_admin && (
                        <MoreHorizIcon
                          onClick={() => {
                            setMemberVisibility(!memberVisibility);
                            setSelectedMemberId(index);
                          }}
                          className="absolute right-2 cursor-pointer"
                        />
                      )}
                      {memberVisibility && selectedMemberId == index && (
                        <div className="absolute top-[31%] right-[5%] bg-white p-3 rounded-md shadow-lg z-10">
                          <p
                            onClick={() => kickUser(member.email)}
                            className="text-red-600 cursor-pointer"
                          >
                            Teilnehmer kicken
                          </p>
                          <p
                            onClick={() => {
                              promoteUser(member.email);
                              setMemberVisibility(!memberVisibility);
                            }}
                            className="text-gray-700 cursor-pointer"
                          >
                            Zu Admin machen
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {toggleDatasetVisibility && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
          <div className="w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 gap-4 max-md:w-[90%] absolute">
            <p
              onClick={() => {
                setToggleDatasetVisibility(false);
                setTasks([]);
              }}
              className="text-2xl absolute top-0 right-3 cursor-pointer"
            >
              &times;
            </p>
            <p className="font-semibold text-xl mt-[3%] mb-[5%]">
              Datensatz erstellen
            </p>
            <p className="text-center">Hier Datensatz Namen eingeben</p>
            <input
              ref={datasetName}
              type="text"
              className="border shadow appearance-none rounded w-[60%] text-md text-gray-700 leading-tight focus:outline-none pl-2 py-[2%]"
              placeholder="Name"
            />
            <button
              onClick={() => {
                createNewDataset();
                setSettingsVisibility(false);
                setToggleDatasetVisibility(false);
              }}
              className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md mt-[12%]"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
