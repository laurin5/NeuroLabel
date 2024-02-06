import React, { useEffect, useState } from "react";
import { API_HOST } from "../../utils/api";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [file, setFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");

  let lastNameInput = useRef(null);
  let firstNameInput = useRef(null);

  let navigator = useNavigate();

  useEffect(() => {
    loadUserDetails();
  }, []);

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
    console.log(responseJSON);
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
    formData.append("image", uploadFile);

    const response = await fetch(`${API_HOST}/files`, {
      method: "POST",
      headers: {
        sessionid: localStorage.getItem("sessionid"),
      },
      body: formData,
    });

    const responseJSON = await response.json();
    console.log(responseJSON.filename);

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
    console.log(responseJSON2);
    navigator("/projects");
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="mt-6 text-2xl font-semibold text-white">Profil</h1>
      <div className="flex items-center gap-2 mb-[1%] w-[80%]">
        <img
          className="h-[80px] w-[80px] object-cover rounded-full shadow-sm"
          src={`${API_HOST}/${userDetails.profile_picture_url}`}
          alt=""
        />
        <p className="text-lg font-semibold text-white">
          {userDetails.last_name} {userDetails.first_name}
        </p>
      </div>
      <div className="w-[55%] bg-white flex flex-col p-6 rounded-md shadow-md hover:shadow-lg">
        <div className="flex justify-between mb-[2%]">
          <label htmlFor="userLastName">Nachname</label>
          <input
            className="border shadow appearance-none rounded text-md text-gray-700 leading-tight focus:outline-none pl-2 py-2"
            ref={lastNameInput}
            type="text"
            name="userLastName"
            placeholder={userDetails.last_name}
          />
        </div>
        <div className="flex justify-between">
          <label htmlFor="userFirstName">Vorname</label>
          <input
            className="border shadow appearance-none rounded text-md text-gray-700 leading-tight focus:outline-none pl-2 py-2"
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
              className="h-[200px] w-[30%] object-cover mb-[6%]"
              src={file}
              alt=""
            />
            <p
              onClick={() => setFile(undefined)}
              className="absolute top-0 right-[20%] text-lg cursor-pointer"
            >
              &times;
            </p>
          </div>
        ) : (
          <div className="relative w-[100%] h-[200px] border-2 border-gray-2 rounded-md 00 mb-[6%] items-center flex justify-center">
            <input
              name="fileInput"
              type="file"
              className="w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInput}
            />
            <p className="absolute italic text-gray-400">Bild hier hochladen</p>
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
          className="w-full text-right text-red-600"
          onClick={handleLogOut}
        >
          Ausloggen
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
