import React, { useEffect, useState } from "react";
import { API_HOST } from "../../utils/api";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  let navigator = useNavigate();

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
      getUsers();
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  const makeInstructor = async (userId, instructor) => {
    instructor = !instructor;
    const response = await fetch(`${API_HOST}/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        SessionID: localStorage.getItem("sessionid"),
      },
      body: JSON.stringify({
        is_instructor: instructor,
      }),
    });
    const responseJSON = await response.json();
    getUsers();
  };

  const getUsers = async () => {
    const response = await fetch(`${API_HOST}/admin/users`, {
      headers: {
        SessionID: localStorage.getItem("sessionid"),
      },
    });
    const responseJSON = await response.json();
    setUsers(responseJSON.users);
  };

  useEffect(() => {
    const results = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, users]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[90%] flex flex-col items-center justify-center">
        <p className="text-white text-xl my-4 font-semibold">Mitglieder</p>
        <p className="text-white italic text-center w-[80%]">
          Unten finden Sie eine Übersicht über die verifizierten Mitglieder. Sie
          können ein Mitglieder suchen, in dem Sie die gewünschte Email
          eingeben.
        </p>
        <div
          className={`bg-white w-full my-2 outline-none rounded-md shadow-md ${
            searchResults.length > 0 && searchTerm.length > 0 ? "pt-2" : "py-2"
          }`}
        >
          <div className="w-full flex items-center">
            <input
              className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none"
              type="text"
              placeholder="Suche nach Email"
              value={searchTerm}
              onChange={handleSearch}
            />
            <SearchIcon className="mr-3" />
          </div>
          <ul
            className={`${
              searchTerm.length > 0 && searchResults.length > 0
                ? "border-t-[1px]"
                : ""
            }`}
          >
            {searchTerm.length > 0 &&
              searchResults.map((user, index) => (
                <div
                  key={user.id}
                  className={`cursor-pointer flex justify-start py-2 border-b-2 last-of-type:rounded-b-md relative items-center ${
                    index % 2 == 1 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <img
                    className="w-[40px] h-[40px] rounded-full object-cover mx-2"
                    src={`${API_HOST}/${user.profile_picture_url}`}
                    alt=""
                  />
                  <div className="flex flex-col">
                    <li key={user.id}>
                      {user.first_name} {user.last_name}
                    </li>
                    <p className="text-gray-600 text-[10px]">{user.email}</p>
                    <p className="text-[10px]">
                      {user.is_admin
                        ? "AdministratorIn"
                        : user.is_instructor
                        ? "LehrerIn"
                        : "TeilnehmerIn"}
                    </p>
                    {!user.is_admin && (
                      <p
                        onClick={() =>
                          makeInstructor(user.id, user.is_instructor)
                        }
                        className="absolute text-[10px] right-4 bottom-6 text-red-500"
                      >
                        {user.is_instructor
                          ? "Zu TeilnehmerIn machen"
                          : "Zu LehrerIn machen"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
