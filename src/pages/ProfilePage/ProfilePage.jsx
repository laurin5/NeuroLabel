import React, { useEffect, useState } from "react";
import { API_HOST } from "../../utils/api";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [file, setFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");

  let lastNameInput = useRef(null);
  let firstNameInput = useRef(null);
  let navigator = useNavigate();

  useEffect(() => {
    validateSession();
    loadUserDetails();
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
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  const handleLogOut = () => {
    deleteSession();
    localStorage.removeItem("sessionid");
    navigator("/login");
  };

  async function deleteSession() {
    const id = localStorage.getItem("sessionid");
    const response = await fetch(`${API_HOST}/sessions/${id}`, {
      headers: {
        SessionID: id,
      },
      method: "DELETE",
    });
  }

  const loadUserDetails = async () => {
    const response = await fetch(`${API_HOST}/users/details`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    setUserDetails(responseJSON.user);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    setUploadFile(event.target.files[0]);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFile(reader.result);
      };

      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  };

  async function updateProfile() {
    const formData = new FormData();
    formData.append("file", uploadFile);

    const response = await fetch(`${API_HOST}/files`, {
      method: "POST",
      headers: {
        sessionid: localStorage.getItem("sessionid"),
      },
      body: formData,
    });

    const responseJSON = await response.json();

    const response2 = await fetch(`${API_HOST}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        SessionID: localStorage.getItem("sessionid"),
      },
      body: JSON.stringify({
        last_name:
          lastNameInput.current.value.length >= 1
            ? lastNameInput.current.value
            : userDetails.last_name,
        first_name:
          firstNameInput.current.value.length >= 1
            ? firstNameInput.current.value
            : userDetails.first_name,
        profile_picture_url: responseJSON.filename,
      }),
    });

    const responseJSON2 = await response2.json();
    window.location.reload();
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="mt-6 text-2xl font-semibold text-white">Profil</h1>
      <div className="flex items-center gap-2 mb-[1%] max-md:w-[95%] max-md:pb-4 w-[80%]">
        <img
          className="max-md:h-[60px] max-md:w-[60px] h-[80px] w-[80px] object-cover rounded-full shadow-sm"
          src={`${API_HOST}/${userDetails.profile_picture_url}`}
          alt=""
        />
        <p className="text-lg font-semibold text-white">
          {userDetails.last_name} {userDetails.first_name}
        </p>
        <div
          onClick={() => {
            navigator("/sessions");
          }}
          className="border-2 p-1 rounded-full flex flex-row justify-center"
        >
          <ClearAllIcon className="text-white" />
        </div>
      </div>
      <div className="w-[55%] max-md:w-[95%] bg-white flex flex-col p-6 rounded-md shadow-md hover:shadow-lg">
        <div className="flex justify-between mb-[2%] items-center">
          <label htmlFor="userLastName">Nachname</label>
          <input
            className="border shadow appearance-none rounded text-md text-gray-700 leading-tight focus:outline-none py-2 pl-2"
            ref={lastNameInput}
            type="text"
            name="userLastName"
            placeholder={userDetails.last_name}
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="userFirstName">Vorname</label>
          <input
            className="border shadow appearance-none rounded text-md text-gray-700 leading-tight focus:outline-none py-2 pl-2"
            ref={firstNameInput}
            type="text"
            name="userFirstName"
            placeholder={userDetails.first_name}
          />
        </div>
        <div className="">
          <label
            className="mt-[6%] mb-[2%] block text-gray-800 text-md font-normal tracking-tighter"
            htmlFor="fileInput"
          >
            Neues Bild hochladen
          </label>
        </div>
        {file ? (
          <div className="flex flex-col items-center relative">
            <img
              className="h-[200px] max-md:w-[95%] w-[30%] object-cover mb-[6%]"
              src={file}
              alt=""
            />
            <p
              onClick={() => setFile(undefined)}
              className="absolute max-md:right-4 max-md:text-xl max-md:text-white top-0 right-[20%] text-lg cursor-pointer"
            >
              &times;
            </p>
          </div>
        ) : (
          <div className="relative w-[100%] h-[200px] border-2 border-gray-2 rounded-md mb-[6%] items-center flex justify-center">
            <input
              name="fileInput"
              type="file"
              className="w-full h-full opacity-0 cursor-pointer z-20"
              onChange={handleFileInput}
            />
            <p className="absolute italic text-gray-400 z-0">
              Bild hier hochladen
            </p>
          </div>
        )}
        <div className="w-full items-center flex flex-col">
          <button
            className="py-2 px-3 bg-blue-600 rounded-md text-white "
            onClick={() => updateProfile()}
          >
            Profil aktualisieren
          </button>
        </div>
        <button
          className="w-full text-right text-red-600 max-md:pt-2"
          onClick={handleLogOut}
        >
          Ausloggen
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
