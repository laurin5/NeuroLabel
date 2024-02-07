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

  async function getBrowserName(userAgent, ip_address, created_at) {
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

    responseJSON;
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
    responseJSON;
    if (responseJSON.message == "Success.") {
      GetSessions();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full h-screen flex flex-col items-center justify-top mt-[2%] gap-3">
        <p className="text-xl text-white font-semibold">Your Sessions</p>
        <button
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 duration-300"
          onClick={deleteAllSessions}
        >
          Delete all
        </button>
        {sessions.map((session) => (
          <div
            className="w-full h-auto flex flex-col border-2 rounded-md items-center justify-center"
            key={session.id}
          >
            {localStorage.getItem("sessionid") === session.id && (
              <p className="text-white">Current Session</p>
            )}
            <div className="flex items-center">
              <p className="text-sm text-white">ID: {session.id}</p>
              <button
                className="text-white ml-10 text-lg"
                onClick={() => deleteSpecificSession(session.id)}
              >
                Delete
              </button>
            </div>
            <Button
              onClick={() =>
                getBrowserName(
                  session.user_agent,
                  session.ip_address,
                  session.created_at
                )
              }
            >
              See more Information
            </Button>
          </div>
        ))}
      </div>
      {selectedSession && visible && (
        <div className="w-full h-screen flex items-center justify-center fixed left-0 top-0 bg-black/50">
          <div className="w-1/3 h-2/4 bg-white rounded-md flex items-center flex-col pt-8">
            <div className="w-full flex justify-end mr-20 ">
              <p
                className="text-4xl mb-12 cursor-pointer text-right"
                onClick={handleClick}
              >
                &times;
              </p>
            </div>
            <img
              className="w-[100px] object-cover"
              src={browserImageMap[selectedSession.browser]}
              style={{ maxWidth: "100%" }}
            />
            <p>{selectedSession.browser}</p>
            <p>IP Address: {selectedSession.ip}</p>
            <p>Date: {selectedSession.created.split("T")[0]}</p>
            <p>Time: {selectedSession.created.split("T")[1].split(".")[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
