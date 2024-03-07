import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";

function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [visible, setVisible] = useState(true);

  let navigator = useNavigate();

  const handleClick = () => {
    setVisible(false);
  };

  useEffect(() => {
    setSessions((prevSessions) => {
      return prevSessions.slice().sort((a, b) => {
        if (a.id === localStorage.getItem("sessionid")) return -1;
        if (b.id === localStorage.getItem("sessionid")) return 1;
      });
    });
  }, []);

  async function deleteSpecificSession(id) {
    await fetch(`${API_HOST}/sessions/${id}`, {
      method: "DELETE",
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    if (localStorage.getItem("sessionid") === id) {
      localStorage.removeItem("sessionid");
      navigator("/login");
    } else {
      GetSessions();
    }
  }

  async function deleteAllSessions() {
    const response = await fetch(`${API_HOST}/sessions`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
      method: "DELETE",
    });

    localStorage.removeItem("sessionid");

    navigator("/login");
  }

  async function getBrowserName(userAgent, ip_address, created_at, session_id) {
    setVisible(true);
    const browserName = userAgent.includes("Chrome")
      ? "Chrome"
      : userAgent.includes("Firefox")
      ? "Firefox"
      : userAgent.includes("Safari")
      ? "Safari"
      : userAgent.includes("Edg")
      ? "Edge"
      : "Unknown";

    setSelectedSession({
      ip: ip_address,
      browser: browserName,
      created: created_at,
      id: session_id,
    });
  }

  const browserImageMap = {
    Chrome: "chrome.png",
    Firefox: "firefox.png",
    Safari: "safari.png",
    Edge: "edge.png",
    Unknown: "unknown.png",
  };

  async function GetSessions() {
    const response = await fetch(`${API_HOST}/sessions`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();

    setSessions(responseJSON.sessions);
  }

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
      GetSessions();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-6 mt-6">
      <p className="text-xl text-white font-medium w-full text-left pl-[5%]">
        Deine Sitzungen
      </p>
      <p className="text-white italic text-center w-[80%]">
        Unten finden Sie eine Übersicht Ihrer Sitzungen. Die grün hinterlegte
        Sitzung ist ihre momentane, wenn Sie auf Mehr Informationen drücken,
        können Sie sich eine detaillierte Ansicht der ausgewählten Sitzung
        anzeigen.
      </p>
      <div className="w-[90%] flex flex-col items-center justify-top shadow-md hover:shadow-lg rounded-md gap-3">
        {/* <button
          className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg duration-300"
          onClick={deleteAllSessions}
        >
          Alle löschen
        </button> */}
        {sessions.map((session, index) => (
          <div
            className={`py-3 w-full h-auto flex flex-col rounded-md items-center justify-center ${
              localStorage.getItem("sessionid") == session.id
                ? "bg-green-50 hover:bg-green-100 duration-300"
                : index % 2 == 0
                ? "bg-gray-50 hover:bg-gray-100"
                : "bg-white hover:bg-gray-100"
            }`}
            key={session.id}
          >
            <div className="flex items-center relative w-full justify-center">
              <button
                className="text-black ml-10 text-lg absolute right-2 cursor-pointer"
                onClick={() => deleteSpecificSession(session.id)}
              >
                &times;
              </button>
            </div>
            <Button
              onClick={() =>
                getBrowserName(
                  session.user_agent,
                  session.ip_address,
                  session.created_at,
                  session.id
                )
              }
            >
              Mehr Informationen
            </Button>
          </div>
        ))}
      </div>
      {selectedSession && visible && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col justify-center gap-2 relative">
            <p className="text-sm text-black">
              Sitzungs ID: {selectedSession.id}
            </p>
            <p
              className="absolute top-0 right-3 text-xl cursor-pointer"
              onClick={handleClick}
            >
              &times;
            </p>
            <img
              className="w-[100px] object-cover"
              src={browserImageMap[selectedSession.browser]}
            />
            <p>{selectedSession.browser}</p>
            <p>IP Addresse: {selectedSession.ip}</p>
            <p>Datum: {selectedSession.created.split("T")[0]}</p>
            <p>
              Uhrzeit: {selectedSession.created.split("T")[1].split(".")[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
