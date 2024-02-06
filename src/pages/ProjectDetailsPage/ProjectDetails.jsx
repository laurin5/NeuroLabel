import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_HOST } from "../../utils/api";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function ProjectDetails() {
  const [showMember, setShowMember] = useState(false);
  const [details, setDetails] = useState({});
  const [toggleDatasetVisibility, setToggleDatasetVisibility] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(null);
  const [datasetSettings, setDatasetSettings] = useState(false);
  const [memberVisibility, setMemberVisibility] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [renameDataset, setRenameDataset] = useState(false);

  let renameDatasetInput = useRef(null);
  let datasetName = useRef(null);

  const params = useParams();
  let location = useLocation();
  let navigator = useNavigate();

  const newDatasetName = async () => {
    console.log(renameDatasetInput.current.value);
    const response = await fetch(
      `${API_HOST}/projects/datasets/${dataset[selectedDatasetIndex].id}`,
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
    loadProjectDetails();
  };

  async function kickUser(emailInput) {
    let response = await fetch(`${API_HOST}/projects/${params.id}/kick`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        email: emailInput,
      }),
    });
    let responseJSON = await response.json();
    loadProjectDetails();
  }

  async function promoteUser(emailInput) {
    let response = await fetch(
      `${API_HOST}/projects/${params.id}/admins/toggle`,
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
    let response = await fetch(`${API_HOST}/projects/${params.id}/details`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });

    let responseJSON = await response.json();
    setDetails(responseJSON);
    setDataset(responseJSON.datasets);
    console.log(responseJSON);
  }

  useEffect(() => {
    loadProjectDetails();
  }, []);

  const showMemberOnClick = () => {
    setShowMember(true);
  };

  const handleDatasetSettings = (index) => {
    setSelectedDatasetIndex(index);
    setDatasetSettings(!datasetSettings);
  };

  const createNewDataset = async () => {
    const response = await fetch(`${API_HOST}/projects/${params.id}/datasets`, {
      method: "POST",
      headers: {
        SessionID: localStorage.getItem("sessionid"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: datasetName.current.value,
        upload_type: "image",
      }),
    });
    loadProjectDetails();
  };

  async function deleteDataset(datasetId) {
    let response = await fetch(`${API_HOST}/projects/datasets/${datasetId}`, {
      method: "DELETE",
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    loadProjectDetails();
    setDatasetSettings(!datasetSettings);
  }

  return (
    <div className="w-full h-full flex items-center pt-[2%] flex-col gap-4">
      {details.project && (
        <div className="flex flex-row w-full items-center justify-between px-[4%] relative">
          <div className="flex flex-col w-full">
            <p className="text-xl w-full text-left text-white font-medium">
              {details.project.name}
            </p>
            <p className="text-left text-md italic w-[80%] text-white">
              {details.project.description}
            </p>
          </div>
          {location.state.isAdmin && (
            <SettingsIcon
              className="cursor-pointer text-white xl:right-9 max-lg:right-4 right-4"
              onClick={() => {
                setSettingsVisibility(!settingsVisibility);
              }}
            />
          )}
        </div>
      )}
      {location.state.isAdmin && settingsVisibility && (
        <div className="flex flex-col bg-white absolute top-[20%] right-[2%] w-[180px] h-fit shadow-xl rounded-md z-10">
          <div className="rounded-sm cursor-pointer bg-white absolute top-full shadow-xl border-[1px] border-gray-100 right-4 w-full z-10 items-start flex flex-col">
            <Link
              onClick={() => {
                localStorage.setItem("projectID", details.project.id);
              }}
              state={{ isAdmin: location.state.isAdmin }}
              to={"/invite/send"}
              className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
            >
              Personen einladen
            </Link>
            <button
              onClick={showMemberOnClick}
              variant="contained"
              className="hover:bg-gray-100 duration-150 w-full text-left pl-2 py-[3%]"
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
        <p className="text-xl text-white">Datensätze</p>
      )}
      {location.state.isAdmin && (
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium text-white">Datensätze</p>
          <p className="text-white italic text-center w-[80%] my-2">
            Unten finden Sie eine Übersicht Ihrer erstellten Datensätze. Sie
            haben die Option, weitere Datensätze hinzuzufügen. Weitere
            Bearbeitungsoptionen finden Sie in den Menüpunkten mit den drei
            gestapelten Punkten.
          </p>
        </div>
      )}
      <div
        className={`${
          dataset && dataset.length >= 1
            ? "bg-white gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2  xl:grid-cols-4 w-[96%] shadow-md rounded-md"
            : `gap-6 p-6 grid max-sm:grid-cols-1 grid-cols-2 xl:grid-cols-4 w-[92%] ${
                location.state.isAdmin ? "bg-white" : ""
              }`
        } `}
      >
        {dataset.map((data, index) => (
          <div className="w-full bg-white shadow-md hover:shadow-lg relative border-2 h-[150px] border-gray-200 text-center text-sm flex flex-col items-center gap-1 pb-8">
            <Link
              to="/upload"
              state={{ datasetId: data.id }}
              key={data.id}
              className="text-lg relative w-full h-full flex justify-center items-center"
            >
              {data.name}
            </Link>
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
                    className="hover:bg-gray-100 w-full text-left pl-2 py-[3%]"
                  >
                    Datensatz löschen
                  </button>
                  <button
                    onClick={() => setRenameDataset(!renameDataset)}
                    className="hover:bg-gray-100 w-full text-left pl-2 py-[3%]"
                  >
                    Datensatz umbenennen
                  </button>
                  <Link
                    to={`/projects/datasets/${data.id}`}
                    state={{ dataId: data.id }}
                    className="hover:bg-gray-100 w-full text-left pl-2 py-[3%]"
                  >
                    Datensatz bearbeiten
                  </Link>
                  <Link
                    state={{ id: data.id }}
                    className="hover:bg-gray-100 w-full text-left pl-2 py-[3%]"
                    to={`/projects/datasets/${data.id}/entries`}
                  >
                    Datensatz Einträge
                  </Link>
                </div>
              )}
          </div>
        ))}
        {renameDataset && (
          <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
            <div className="max-md:w-[90%] w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8 justify-center gap-8">
              <p
                onClick={() => {
                  setRenameDataset(false);
                  setDatasetSettings(false);
                }}
                className="cursor-pointer absolute top-[26%] right-[35%] text-xl"
              >
                &times;
              </p>
              <label htmlFor="renameDataset">Wie soll der neue Name sein</label>
              <input
                ref={renameDatasetInput}
                type="text"
                placeholder="Name"
                className="border-2 p-2 rounded-md outline-none"
              />
              <button
                onClick={() => {
                  newDatasetName();
                  setRenameDataset(false);
                  setDatasetSettings(false);
                }}
                className="bg-blue-600 border text-white py-2 max-md:w-[60%] w-[60%] rounded-md"
              >
                Bestätigen
              </button>
            </div>
          </div>
        )}
        {location.state.isAdmin && (
          <div>
            <button
              onClick={() => {
                setToggleDatasetVisibility(true);
              }}
              className="h-[150px] border-2 w-full text-white border-gray-200 shadow-md hover:shadow-lg"
            >
              <AddIcon color="primary" />
            </button>
          </div>
        )}
      </div>
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
                        <span className="text-left absolute right-[15%]">
                          {member.is_project_admin
                            ? "LehrerIn"
                            : "TeilnehmerIn"}
                        </span>
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
                        <div className="cursor-pointer bg-white absolute top-[31%] right-[4%] shadow-xl border-[1px] border-gray-100 w-[30%] z-10 items-start flex flex-col">
                          <p
                            onClick={() => kickUser(member.email)}
                            className="text-red-600 hover:bg-gray-100 w-full text-left pl-2 py-[3%]"
                          >
                            Teilnehmer kicken
                          </p>
                          <p
                            onClick={() => {
                              promoteUser(member.email);
                              setMemberVisibility(!memberVisibility);
                            }}
                            className="hover:bg-gray-100 w-full text-left pl-2 py-[3%]"
                          >
                            {member.is_project_admin
                              ? "Zu User machen"
                              : "Zu Admin machen"}
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
