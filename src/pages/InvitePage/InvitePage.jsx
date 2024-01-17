import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";

function InvitePage() {
  const [invites, setInvites] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  let navigator = useNavigate();

  async function cancelInvites(InviteId) {
    let response = await fetch(
      `http://lizard-studios.at:10187/projects/invites/${InviteId}/cancel`,
      {
        method: "DELETE",
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );

    getPendingInvites();
  }

  async function getPendingInvites() {
    let response = await fetch(
      "http://lizard-studios.at:10187/projects/invites/sent",
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );

    let responseJSON = await response.json();
    setPendingInvites(responseJSON.invites);
  }

  async function loadInvites() {
    let response = await fetch(
      "http://lizard-studios.at:10187/projects/invites",
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );

    let responseJSON = await response.json();
    console.log(responseJSON);
    setInvites(responseJSON.invites);
  }

  async function declineInvites(InviteId) {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/invites/${InviteId}/decline`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          sessionid: localStorage.getItem("sessionid"),
        },
      }
    );

    navigator("/projects");
  }

  async function acceptInvites(InviteId, projectId) {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/invites/${InviteId}/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          sessionid: localStorage.getItem("sessionid"),
        },
      }
    );

    navigator("/projects");
  }

  const loadUserDetails = async () => {
    const response = await fetch(`${API_HOST}/users/details`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    setUserDetails(responseJSON.user);
    console.log(responseJSON);
  };

  useEffect(() => {
    loadInvites();
    getPendingInvites();
    loadUserDetails();
  }, []);

  return (
    <div className="w-full h-screen flex max-md:pt-0 pt-10 flex-col gap-2 bg-gray-200 items-center">
      {userDetails.is_instructor && (
        <p className="text-xl w-full text-left pl-[10%]">
          Gesendete Einladungen
        </p>
      )}
      {pendingInvites.map((pending) => (
        <div
          key={pending.id}
          className="flex flex-col items-center bg-white p-2 w-[60%] max-md:w-[90%] rounded-md"
        >
          <p className="text-lg">Einladung zu</p>
          <div className="flex gap-12 items-center">
            <p className="text-md">{pending.project.name}</p>
            <Button
              onClick={() => cancelInvites(pending.id)}
              variant="contained"
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
      <p
        className={`text-xl w-full text-left pl-[10%] ${
          userDetails.is_participant && !userDetails.is_instructor
            ? ""
            : "mt-[5%]"
        }`}
      >
        Empfangene Einladungen
      </p>
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col items-center bg-white p-2 w-[60%] max-md:w-[90%] rounded-md"
        >
          <div className="text-center flex flex-col gap-2 items-center">
            <p className="text-lg">Einladung zu</p>
            {invite.project.name} from {invite.sender.first_name}
            <div className="flex gap-2">
              <Button
                onClick={() => acceptInvites(invite.id, invite.project_id)}
                variant="contained"
              >
                Accept
              </Button>
              <Button
                onClick={() => declineInvites(invite.id)}
                variant="contained"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvitePage;
