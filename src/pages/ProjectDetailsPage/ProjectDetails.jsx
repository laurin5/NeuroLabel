import Button from "@mui/material/Button";
import { useEffect, useState, useRef } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProjectDetails() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedSign, setSelectedSign] = useState("");
  const [firstSign, setFirstSign] = useState("");
  const [secondSign, setSecondSign] = useState("");
  const [showMember, setShowMember] = useState(false);
  const [details, setDetails] = useState({});
  const [fileName, setFileName] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [toggleDatasetVisibility, setToggleDatasetVisibility] = useState(false);
  const [toggleLabelVisibility, setToggleLabelVisibility] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskIndex, setTaskIndex] = useState(1);
  let datasetName = useRef(null);
  const [dataset, setDataset] = useState([]);

  const params = useParams();
  let navigator = useNavigate();

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
    console.log(responseJSON);
    setDataset(responseJSON.datasets);
  }

  useEffect(() => {
    loadProjectDetails();
  }, []);

  const handleButtonClick = () => {
    setVisible(true);
  };

  const showMemberOnClick = () => {
    setShowMember(true);
  };

  const handleButtonIndex = () => {
    if (index === 3) {
      setIndex(0);
    } else if (selectedSign.length > 1 && index === 0) {
      setIndex(index + 1);
    } else if (firstSign.length > 1 && index === 1) {
      setIndex(index + 1);
    } else if (secondSign.length > 1 && index === 2) {
      setIndex(index + 1);
    } else {
      console.log("Bitte laden Sie ein File hoch");
    }
  };

  const handleChange = (event) => {
    setSelectedSign(event.target.value);
  };

  const handleFileInput1 = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFirstSign(reader.result);
      };

      setFileName(file.name);

      reader.readAsDataURL(file);
    }
  };

  const handleFileInput2 = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSecondSign(reader.result);
      };

      setFileName2(file.name);

      reader.readAsDataURL(file);
    }
  };

  const createNewTask = () => {
    setTaskIndex(taskIndex + 1);
    const newTask = {
      id: taskIndex,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
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
    const responseJSON = await response.json();
  };

  return (
    <div className="w-full h-screen flex items-center mt-6 flex-col gap-4">
      {details.project && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl">{details.project.name}</p>
          <div className="border-[1px] border-gray-300 rounded-sm w-2/3">
            <img src="/public/chrome.png" alt="" className="bg-zinc-100" />
            <p className="text-center text-md">{details.project.description}</p>
          </div>
        </div>
      )}
      {dataset.map((data) => (
        <button
          className="w-2/3 bg-blue-900 text-white py-2 rounded-sm mt-4"
          onClick={handleButtonClick}
        >
          {data.name}
        </button>
      ))}
      {visible && index === 0 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="max-md:w-[90%] w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly">
            <p
              onClick={() => setVisible(false)}
              className="text-2xl absolute top-[14%] left-[85%] cursor-pointer"
            >
              &times;
            </p>
            <p>Was wollen Sie hochladen?</p>

            <Select
              className="w-[60%]"
              label="Schild auswählen"
              value={selectedSign}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Kein Schild ausgewählt</em>
              </MenuItem>
              <MenuItem value="Stop">Stop</MenuItem>
              <MenuItem value="Vorfahrt">Vorfahrt</MenuItem>
              <MenuItem value="Geschwindigkeitsbegrenzung">
                Geschwindigkeitsbegrenzung
              </MenuItem>
              <MenuItem value="Parken">Parken</MenuItem>
              <MenuItem value="Überholverbot">Überholverbot</MenuItem>
              <MenuItem value="Fußgängerüberweg">Fußgängerüberweg</MenuItem>
              <MenuItem value="Kreuzung">Kreuzung</MenuItem>
              <MenuItem value="Einfahrt verboten">Einfahrt verboten</MenuItem>
              <MenuItem value="Umweltzone">Umweltzone</MenuItem>
              <MenuItem value="Autobahn">Autobahn</MenuItem>
            </Select>

            <button
              className="w-2/3 border-[1px] bg-blue-900 text-white py-2 rounded-sm max-md:w-[60%]"
              onClick={handleButtonIndex}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {visible && index === 1 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly max-md:w-[90%]">
            <p className="text-center">
              Laden Sie ein Bild des {selectedSign} Schildes aus 15m Entfernung
              hoch!
            </p>
            <div className="relative mt-4 max-md:w-[60%]">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput1}
              />
              <div className="border-blue-900 border rounded-md p-2 text-sm text-gray-700">
                <span className="text-gray-400">
                  {fileName ? `${fileName}` : "Bild"}
                </span>
              </div>
            </div>
            {firstSign && <img src={firstSign} alt="" />}
            <button
              className="w-2/3 border-[1px] bg-blue-900 text-white py-2 rounded-sm max-md:w-[60%]"
              onClick={handleButtonIndex}
            >
              Continue
            </button>
            <button
              onClick={() => setIndex(index - 1)}
              className="text-blue-700 border-b border-blue-700"
            >
              Zurück
            </button>
          </div>
        </div>
      )}

      {visible && index === 2 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly max-md:w-[90%]">
            <p className="text-center">
              Laden Sie ein Bild des {selectedSign} Schildes aus 10m Entfernung
              hoch.
            </p>
            <div className="relative mt-4 max-md:w-[60%]">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={() => {
                  handleFileInput2;
                  uploadPictures;
                }}
                ref={emailInput2}
              />
              <div className="border-blue-900 border rounded-md p-2 text-sm text-gray-700">
                <span className="text-gray-400">
                  {fileName2 ? `${fileName2}` : "Bild"}
                </span>
              </div>
            </div>
            {secondSign && <img src={secondSign} alt="" />}
            <button
              className="w-2/3 border-[1px] bg-blue-900 text-white py-2 rounded-sm max-md:w-[60%]"
              onClick={handleButtonIndex}
            >
              Continue
            </button>
            <button
              onClick={() => setIndex(index - 1)}
              className="text-blue-700 border-b border-blue-700"
            >
              Zurück
            </button>
          </div>
        </div>
      )}

      {visible && index === 3 && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 justify-evenly max-md:w-[90%]">
            <p>Danke fürs mitmachen!</p>
            <button
              className="bg-blue-900 text-white py-2 rounded-sm max-md:w-[60%]"
              onClick={() => {
                setVisible(false);
                setIndex(0);
                setFileName("");
                setFileName2("");
                setFirstSign("");
                setSecondSign("");
                setSelectedSign("");
              }}
            >
              Beenden
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          navigator("/invite/send");
          localStorage.setItem("projectID", details.project.id);
        }}
        className="w-2/3 border-[1px] border-blue-900 text-blue-900 py-2 rounded-sm"
      >
        Person einladen
      </button>
      <button onClick={showMemberOnClick} variant="contained" className="">
        Project Member
      </button>
      {showMember && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
          <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 gap-4">
            <p
              className="cursor-pointer"
              onClick={() => {
                setShowMember(false);
              }}
            >
              &times;
            </p>
            {details.members &&
              details.members.map((member) => (
                <div className="flex gap-2 items-center">
                  <p>
                    {member.first_name} {member.last_name}
                  </p>
                  <Button
                    onClick={() => {
                      kickUser(member.email);
                    }}
                  >
                    Kick
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
      <button
        className="w-2/3 border-[1px] bg-blue-900 text-white py-2 rounded-sm"
        onClick={() => setToggleDatasetVisibility(true)}
      >
        Create Dataset
      </button>
      {toggleDatasetVisibility && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50 z-10">
          <div className="w-1/2 h-3/4 bg-white rounded-md flex items-center flex-col pt-8 gap-4 max-md:w-[90%]">
            <p
              onClick={() => {
                setToggleDatasetVisibility(false);
                setTasks([]);
                setTaskIndex(1);
              }}
              className="text-2xl absolute top-[14%] left-[85%] cursor-pointer"
            >
              &times;
            </p>
            <p className="font-semibold">Dataset</p>
            <p className="text-center">Enter Dataset Name</p>
            <input
              ref={datasetName}
              type="text"
              className="border-2 pl-2"
              placeholder="Name"
            />
            <button
              onClick={createNewTask}
              className="border-blue-900 border text-blue-900 py-2 rounded-sm max-md:w-[60%]"
            >
              Create new Task
            </button>
            {tasks.map((task) => (
              <div key={task.id}>
                <p className="text-center">Task #{task.id}</p>
                <input type="text" className="border-2" />
              </div>
            ))}
            <button
              onClick={() => {
                createNewDataset();
                setToggleDatasetVisibility(false);
                loadProjectDetails();
              }}
              className="bg-blue-900 border text-white py-2 rounded-sm max-md:w-[60%]"
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
