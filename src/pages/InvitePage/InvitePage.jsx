import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function InvitePage() {
  const [invites, setInvites] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

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

  useEffect(() => {
    loadInvites();
    getPendingInvites();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-2">
      <p>Pending Invites</p>
      {pendingInvites.map((pending) => (
        <div key={pending.id} className="border-2 p-2 rounded-md">
          <p>
            {pending.project.name}
            <Button
              onClick={() => cancelInvites(pending.id)}
              variant="contained"
            >
              Cancel
            </Button>
          </p>
        </div>
      ))}
      <p>Invites</p>
      {invites.map((invite) => (
        <div key={invite.id} className="border-2 p-2 rounded-md">
          <div className="flex flex-row gap-4 items-center">
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
