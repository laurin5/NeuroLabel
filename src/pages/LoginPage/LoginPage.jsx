import { useEffect, useRef } from "react";
import { API_HOST } from "../../utils/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  let emailInput = useRef(null);
  let passwordInput = useRef(null);
  let navigator = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("sessionid") != null) {
      navigator("/projects");
    }
  }, []);

  async function login(event) {
    event.preventDefault();
    emailInput.current.value;
    passwordInput.current.value;
    const response = await fetch(`${API_HOST}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.current.value,
        password: passwordInput.current.value,
      }),
    });
    const responseJSON = await response.json();

    if (response.status === 200) {
      localStorage.setItem("sessionid", responseJSON.sessionid);
      navigator("/projects");
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center px-4">
      <div className="rounded-md max-md:w-full xl:border-[1px] xl:shadow-md xl:w-2/6 flex py-8 px-8 h-auto mt-10 bg-white flex-col justify-center">
        <h1 className="font-medium text-2xl mt-3 text-center">
          Willkommen bei Neuro Label
        </h1>
        <form name="lastName" onSubmit={login}>
          <div className="mt-4">
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              ref={emailInput}
              type="email"
              name="email"
              placeholder="Email"
            />
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="password"
            >
              Passwort
            </label>
            <input
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              ref={passwordInput}
              type="password"
              name="password"
              placeholder="Passwort"
            />
          </div>
          <button
            className="duration-300 hover:bg-blue-500 bg-blue-600 text-xl text-white w-full mt-6 py-2 rounded-sm font-semibold"
            type="submit"
          >
            Einloggen
          </button>
        </form>
        <div className="flex flex-col items-center mt-4 justify-center">
          <a className="text-blue-700 mb-2">Password vergessen?</a>
          <a href="/register" className="text-blue-700">
            Registrierung
          </a>
          <a className="text-blue-700 mt-2">Impressum</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
