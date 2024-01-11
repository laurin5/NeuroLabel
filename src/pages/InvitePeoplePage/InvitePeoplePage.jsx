import { useNavigate, Link, useLocation } from "react-router-dom";
import { useRef } from "react";

function InvitePeople() {
  let navigator = useNavigate();
  const inviteInput = useRef(null);
  let location = useLocation();
  console.log(localStorage.getItem("projectID"))

  async function sendInvite() {
    const response = await fetch(
      `http://lizard-studios.at:10187/projects/${localStorage.getItem("projectID")}/invites`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          sessionid: localStorage.getItem("sessionid"),
        },
        body: JSON.stringify({
          receiver: inviteInput.current.value,
        }),
      }
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center px-4">
      <div className="rounded-md max-md:w-full xl:border-[1px] xl:shadow-md xl:w-1/4 flex py-8 px-8 h-auto mt-10 bg-white flex-col justify-center">
        <h1 className="font-medium text-2xl mt-3 text-center">
          Personen einladen
        </h1>
          <div className="mt-4">
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              ref={inviteInput}
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              type="email"
              name="email"
              placeholder="enter email"
            />
          </div>
          <div className="w-full flex flex-col items-center gap-4">
            <button
              onClick={() => {
                sendInvite();
                navigator("/projects");
              }}
              className="duration-300 hover:bg-blue-800 bg-blue-900 text-xl text-white w-full mt-6 py-2 rounded-sm font-semibold"
              type="submit"
            >
              Senden
            </button>
            <Link state={{isAdmin: location.state.isAdmin}} to={`/projects/${localStorage.getItem("projectID")}`}
              className="text-blue-700 border-b border-blue-700"
            >
              Zurück
            </Link>
          </div>
      </div>
    </div>
  );
}

export default InvitePeople;
